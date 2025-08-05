const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const router = express.Router();

// 配置常量
const CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES_PER_REQUEST: 5,
  MAX_DAILY_UPLOADS: 50,
  MAX_DAILY_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_TYPES: ["image/png", "image/jpeg", "image/gif", "image/jpg"],
  UPLOAD_DIR: path.resolve(__dirname, "../../client-upload"),
  CLEANUP_DAYS: 7, // 7天后自动清理
  RATE_LIMIT_WINDOW: 24 * 60 * 60 * 1000, // 24小时
};

// 存储统计信息（生产环境应使用Redis或数据库）
let uploadStats = {
  dailyUploads: new Map(), // IP -> {count, size}
  fileRegistry: new Map(), // filename -> {ip, size, uploadTime}
};

// 工具函数
class UploadSecurity {
  static ensureUploadDir() {
    if (!fs.existsSync(CONFIG.UPLOAD_DIR)) {
      fs.mkdirSync(CONFIG.UPLOAD_DIR, { recursive: true });
    }
  }

  static getClientIP(req) {
    return req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
           (req.connection.socket ? req.connection.socket.remoteAddress : null);
  }

  static generateSecureFilename(originalname) {
    const ext = path.extname(originalname);
    const basename = path.basename(originalname, ext).replace(/[^a-zA-Z0-9]/g, '');
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${basename}-${timestamp}-${random}${ext}`;
  }

  static checkRateLimit(ip) {
    const now = Date.now();
    const today = new Date(now).toDateString();
    
    if (!uploadStats.dailyUploads.has(ip)) {
      uploadStats.dailyUploads.set(ip, { count: 0, size: 0, date: today });
    }

    const stats = uploadStats.dailyUploads.get(ip);
    
    // 重置每日统计
    if (stats.date !== today) {
      stats.count = 0;
      stats.size = 0;
      stats.date = today;
    }

    return stats;
  }

  static checkStorageLimit(stats) {
    return stats.count < CONFIG.MAX_DAILY_UPLOADS && 
           stats.size < CONFIG.MAX_DAILY_SIZE;
  }

  static getDirectorySize(dirPath) {
    let totalSize = 0;
    try {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
        }
      });
    } catch (error) {
      console.error('计算目录大小失败:', error);
    }
    return totalSize;
  }

  static cleanupOldFiles() {
    const now = Date.now();
    const cutoffTime = now - (CONFIG.CLEANUP_DAYS * 24 * 60 * 60 * 1000);
    
    try {
      const files = fs.readdirSync(CONFIG.UPLOAD_DIR);
      let deletedCount = 0;
      let freedSpace = 0;

      files.forEach(filename => {
        const filePath = path.join(CONFIG.UPLOAD_DIR, filename);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isFile() && stats.mtime.getTime() < cutoffTime) {
            freedSpace += stats.size;
            fs.unlinkSync(filePath);
            deletedCount++;
            uploadStats.fileRegistry.delete(filename);
          }
        } catch (error) {
          console.error(`清理文件失败: ${filename}`, error);
        }
      });

      if (deletedCount > 0) {
        console.log(`自动清理完成: 删除 ${deletedCount} 个文件，释放 ${(freedSpace / 1024 / 1024).toFixed(2)}MB 空间`);
      }
    } catch (error) {
      console.error('清理旧文件失败:', error);
    }
  }

  static getStorageStats() {
    const totalSize = this.getDirectorySize(CONFIG.UPLOAD_DIR);
    const fileCount = fs.readdirSync(CONFIG.UPLOAD_DIR).filter(f => !f.startsWith('.')).length;
    
    return {
      totalSize,
      fileCount,
      maxDailyUploads: CONFIG.MAX_DAILY_UPLOADS,
      maxDailySize: CONFIG.MAX_DAILY_SIZE,
      cleanupDays: CONFIG.CLEANUP_DAYS
    };
  }
}

// 初始化
UploadSecurity.ensureUploadDir();

// 配置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, CONFIG.UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, UploadSecurity.generateSecureFilename(file.originalname));
  },
});

const fileFilter = function (req, file, cb) {
  if (CONFIG.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`只允许上传 ${CONFIG.ALLOWED_TYPES.join(', ')} 格式的文件`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: CONFIG.MAX_FILE_SIZE,
    files: CONFIG.MAX_FILES_PER_REQUEST,
  },
});

// 中间件：检查上传限制
const checkUploadLimits = (req, res, next) => {
  const ip = UploadSecurity.getClientIP(req);
  const stats = UploadSecurity.checkRateLimit(ip);

  if (!UploadSecurity.checkStorageLimit(stats)) {
    return res.status(429).json({
      error: '今日上传限制已用完',
      code: 429,
      details: {
        maxUploads: CONFIG.MAX_DAILY_UPLOADS,
        maxSize: `${(CONFIG.MAX_DAILY_SIZE / 1024 / 1024).toFixed(0)}MB`,
        currentUploads: stats.count,
        currentSize: `${(stats.size / 1024 / 1024).toFixed(2)}MB`
      }
    });
  }

  next();
};

// 中间件：记录上传统计
const recordUpload = (req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode === 200) {
      try {
        const response = JSON.parse(data);
        if (response.data && response.data.size) {
          const ip = UploadSecurity.getClientIP(req);
          const stats = UploadSecurity.checkRateLimit(ip);
          stats.count += 1;
          stats.size += response.data.size;
          
          // 记录文件到注册表
          if (response.data.filename) {
            uploadStats.fileRegistry.set(response.data.filename, {
              ip,
              size: response.data.size,
              uploadTime: Date.now()
            });
          }
        }
      } catch (error) {
        console.error('记录上传统计失败:', error);
      }
    }
    originalSend.call(this, data);
  };
  next();
};

// 定期清理任务
setInterval(() => {
  UploadSecurity.cleanupOldFiles();
}, 60 * 60 * 1000); // 每小时清理一次

// API路由

/**
 * 获取存储统计信息
 * GET /api/storage/stats
 */
router.get('/api/storage/stats', (req, res) => {
  res.json({
    message: '获取存储统计成功',
    data: UploadSecurity.getStorageStats(),
    code: 200
  });
});

/**
 * 单文件上传 - 带安全防护
 * POST /api/upload/secure
 */
router.post('/api/upload/secure', 
  checkUploadLimits,
  recordUpload,
  upload.single('file'), 
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: '未上传文件或文件格式不正确',
        code: 400,
      });
    }

    const ip = UploadSecurity.getClientIP(req);
    const stats = UploadSecurity.checkRateLimit(ip);

    res.json({
      message: '上传成功',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/client-upload/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
        remainingUploads: CONFIG.MAX_DAILY_UPLOADS - stats.count,
        remainingSize: CONFIG.MAX_DAILY_SIZE - stats.size
      },
      code: 200,
    });
  }
);

/**
 * 批量文件上传 - 带安全防护
 * POST /api/upload/secure-multiple
 */
router.post('/api/upload/secure-multiple', 
  checkUploadLimits,
  recordUpload,
  upload.array('files', CONFIG.MAX_FILES_PER_REQUEST),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: '未上传文件或文件格式不正确',
        code: 400,
      });
    }

    const ip = UploadSecurity.getClientIP(req);
    const stats = UploadSecurity.checkRateLimit(ip);
    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);

    if (stats.size + totalSize > CONFIG.MAX_DAILY_SIZE) {
      return res.status(429).json({
        error: '今日上传总大小超出限制',
        code: 429,
        details: {
          currentSize: `${(stats.size / 1024 / 1024).toFixed(2)}MB`,
          requestedSize: `${(totalSize / 1024 / 1024).toFixed(2)}MB`,
          maxSize: `${(CONFIG.MAX_DAILY_SIZE / 1024 / 1024).toFixed(0)}MB`
        }
      });
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/client-upload/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({
      message: `成功上传 ${files.length} 个文件`,
      data: {
        files,
        count: files.length,
        totalSize: totalSize,
        remainingUploads: CONFIG.MAX_DAILY_UPLOADS - stats.count,
        remainingSize: CONFIG.MAX_DAILY_SIZE - stats.size - totalSize
      },
      code: 200,
    });
  }
);

/**
 * 获取上传文件列表 - 带分页
 * GET /api/files/secure
 */
router.get('/api/files/secure', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const files = fs.readdirSync(CONFIG.UPLOAD_DIR);
    const fileList = files
      .filter((file) => !file.startsWith("."))
      .map((file) => {
        const filePath = path.join(CONFIG.UPLOAD_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          path: `/client-upload/${file}`,
          size: stats.size,
          uploadTime: stats.mtime,
          age: Math.floor((Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24))
        };
      })
      .sort((a, b) => b.uploadTime - a.uploadTime);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFiles = fileList.slice(startIndex, endIndex);

    res.json({
      message: "获取文件列表成功",
      data: {
        files: paginatedFiles,
        total: fileList.length,
        page,
        limit,
        totalPages: Math.ceil(fileList.length / limit)
      },
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: "获取文件列表失败",
      code: 500,
    });
  }
});

/**
 * 删除上传文件 - 带权限检查
 * DELETE /api/files/secure/:filename
 */
router.delete('/api/files/secure/:filename', (req, res) => {
  const filename = req.params.filename;
  
  // 安全检查：防止路径遍历攻击
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return res.status(400).json({
      error: "文件名不合法",
      code: 400,
    });
  }

  const filePath = path.join(CONFIG.UPLOAD_DIR, filename);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "文件不存在",
        code: 404,
      });
    }

    const stats = fs.statSync(filePath);
    fs.unlinkSync(filePath);
    uploadStats.fileRegistry.delete(filename);

    res.json({
      message: "文件删除成功",
      data: {
        filename,
        freedSpace: stats.size
      },
      code: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: "删除文件失败",
      code: 500,
    });
  }
});

/**
 * 手动触发清理任务
 * POST /api/cleanup/manual
 */
router.post('/api/cleanup/manual', (req, res) => {
  try {
    UploadSecurity.cleanupOldFiles();
    res.json({
      message: "手动清理任务已触发",
      code: 200
    });
  } catch (error) {
    res.status(500).json({
      error: "清理任务失败",
      code: 500
    });
  }
});

// 错误处理中间件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: `文件大小超过限制（最大${CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB）`,
        code: 400,
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: `文件数量超过限制（最多${CONFIG.MAX_FILES_PER_REQUEST}个）`,
        code: 400,
      });
    }
  }

  if (error.message) {
    return res.status(400).json({
      error: error.message,
      code: 400,
    });
  }

  res.status(500).json({
    error: "服务器内部错误",
    code: 500,
  });
});

module.exports = router;
module.exports.CONFIG = CONFIG;
module.exports.UploadSecurity = UploadSecurity;