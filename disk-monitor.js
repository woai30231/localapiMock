const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class DiskMonitor {
  constructor(config) {
    this.config = config;
    this.uploadDir = path.resolve(__dirname, config.uploadDir || 'client-upload');
    this.threshold = config.diskThreshold || 80; // 磁盘使用率阈值 80%
    this.maxSize = config.maxDirectorySize || 500 * 1024 * 1024; // 500MB
  }

  // 获取磁盘使用情况
  async getDiskUsage() {
    return new Promise((resolve, reject) => {
      exec('df -h .', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        
        const lines = stdout.trim().split('\n');
        if (lines.length >= 2) {
          const parts = lines[1].split(/\s+/);
          const usage = {
            filesystem: parts[0],
            size: parts[1],
            used: parts[2],
            available: parts[3],
            usagePercent: parseInt(parts[4])
          };
          resolve(usage);
        } else {
          reject(new Error('无法解析磁盘使用情况'));
        }
      });
    });
  }

  // 获取目录统计信息
  getDirectoryStats() {
    try {
      if (!fs.existsSync(this.uploadDir)) {
        return { totalFiles: 0, totalSize: 0, oldestFile: null };
      }

      const files = fs.readdirSync(this.uploadDir);
      let totalSize = 0;
      let oldestFile = null;
      let oldestTime = Date.now();

      files.forEach(filename => {
        const filePath = path.join(this.uploadDir, filename);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            totalSize += stats.size;
            if (stats.mtime.getTime() < oldestTime) {
              oldestTime = stats.mtime.getTime();
              oldestFile = { filename, size: stats.size, mtime: stats.mtime };
            }
          }
        } catch (error) {
          console.error(`获取文件统计失败: ${filename}`, error);
        }
      });

      return {
        totalFiles: files.filter(f => !f.startsWith('.')).length,
        totalSize,
        oldestFile,
        averageFileSize: files.length > 0 ? totalSize / files.length : 0
      };
    } catch (error) {
      console.error('获取目录统计失败:', error);
      return { totalFiles: 0, totalSize: 0, oldestFile: null };
    }
  }

  // 清理过期文件
  cleanupExpiredFiles(maxAgeDays) {
    const cutoffTime = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000);
    let deletedCount = 0;
    let freedSpace = 0;

    try {
      if (!fs.existsSync(this.uploadDir)) return { deletedCount, freedSpace };

      const files = fs.readdirSync(this.uploadDir);
      
      files.forEach(filename => {
        const filePath = path.join(this.uploadDir, filename);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isFile() && stats.mtime.getTime() < cutoffTime) {
            freedSpace += stats.size;
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch (error) {
          console.error(`清理文件失败: ${filename}`, error);
        }
      });
    } catch (error) {
      console.error('清理过期文件失败:', error);
    }

    return { deletedCount, freedSpace };
  }

  // 按大小清理（删除最大的文件）
  cleanupBySize(targetFreeSpace) {
    try {
      if (!fs.existsSync(this.uploadDir)) return { deletedCount: 0, freedSpace: 0 };

      const files = fs.readdirSync(this.uploadDir);
      const fileStats = [];

      files.forEach(filename => {
        const filePath = path.join(this.uploadDir, filename);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            fileStats.push({ filename, filePath, size: stats.size, mtime: stats.mtime });
          }
        } catch (error) {
          console.error(`获取文件信息失败: ${filename}`, error);
        }
      });

      // 按文件大小降序排序
      fileStats.sort((a, b) => b.size - a.size);

      let deletedCount = 0;
      let freedSpace = 0;

      for (const file of fileStats) {
        if (freedSpace >= targetFreeSpace) break;
        
        try {
          fs.unlinkSync(file.filePath);
          freedSpace += file.size;
          deletedCount++;
        } catch (error) {
          console.error(`删除文件失败: ${file.filename}`, error);
        }
      }

      return { deletedCount, freedSpace };
    } catch (error) {
      console.error('按大小清理失败:', error);
      return { deletedCount: 0, freedSpace: 0 };
    }
  }

  // 生成监控报告
  async generateReport() {
    try {
      const [diskUsage, dirStats] = await Promise.all([
        this.getDiskUsage(),
        this.getDirectoryStats()
      ]);

      const report = {
        timestamp: new Date().toISOString(),
        diskUsage,
        uploadDirectory: dirStats,
        warnings: [],
        recommendations: []
      };

      // 检查警告条件
      if (diskUsage.usagePercent > this.threshold) {
        report.warnings.push(`磁盘使用率过高: ${diskUsage.usagePercent}%`);
      }

      if (dirStats.totalSize > this.maxSize) {
        report.warnings.push(`上传目录过大: ${(dirStats.totalSize / 1024 / 1024).toFixed(2)}MB`);
      }

      if (dirStats.totalFiles > 1000) {
        report.warnings.push(`文件数量过多: ${dirStats.totalFiles}个`);
      }

      // 生成建议
      if (report.warnings.length > 0) {
        report.recommendations.push('建议清理过期文件');
        if (dirStats.oldestFile) {
          report.recommendations.push(`最旧文件: ${dirStats.oldestFile.filename} (${Math.floor((Date.now() - dirStats.oldestFile.mtime) / (1000 * 60 * 60 * 24))}天前)`);
        }
      }

      return report;
    } catch (error) {
      console.error('生成报告失败:', error);
      return {
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  // 自动清理策略
  async autoCleanup() {
    const report = await this.generateReport();
    let result = { action: 'none', details: {} };

    // 如果磁盘使用率过高，执行清理
    if (report.diskUsage && report.diskUsage.usagePercent > 85) {
      const cleanupResult = this.cleanupExpiredFiles(1); // 清理1天前的文件
      result = {
        action: 'emergency_cleanup',
        details: cleanupResult,
        reason: '磁盘使用率过高'
      };
    } else if (report.uploadDirectory && report.uploadDirectory.totalSize > this.maxSize) {
      // 如果目录过大，清理一半空间
      const targetFreeSpace = report.uploadDirectory.totalSize / 2;
      const cleanupResult = this.cleanupBySize(targetFreeSpace);
      result = {
        action: 'size_cleanup',
        details: cleanupResult,
        reason: '上传目录过大'
      };
    } else {
      // 正常清理过期文件
      const cleanupResult = this.cleanupExpiredFiles(7);
      result = {
        action: 'routine_cleanup',
        details: cleanupResult,
        reason: '定期清理'
      };
    }

    return result;
  }
}

// CLI工具
if (require.main === module) {
  const config = require('./security-config');
  const monitor = new DiskMonitor(config);

  const command = process.argv[2];
  
  switch (command) {
    case 'report':
      monitor.generateReport().then(report => {
        console.log('=== 磁盘监控报告 ===');
        console.log(JSON.stringify(report, null, 2));
      });
      break;
      
    case 'cleanup':
      monitor.autoCleanup().then(result => {
        console.log('=== 自动清理结果 ===');
        console.log(JSON.stringify(result, null, 2));
      });
      break;
      
    case 'manual':
      const days = parseInt(process.argv[3]) || 7;
      const result = monitor.cleanupExpiredFiles(days);
      console.log(`=== 手动清理 (${days}天前) ===`);
      console.log(`删除文件: ${result.deletedCount}个`);
      console.log(`释放空间: ${(result.freedSpace / 1024 / 1024).toFixed(2)}MB`);
      break;
      
    default:
      console.log('用法:');
      console.log('  node disk-monitor.js report    - 生成监控报告');
      console.log('  node disk-monitor.js cleanup   - 自动清理');
      console.log('  node disk-monitor.js manual 7  - 手动清理7天前文件');
  }
}

module.exports = DiskMonitor;