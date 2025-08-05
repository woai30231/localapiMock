/**
 * 文件上传安全配置
 * 可以根据实际需求调整这些参数
 */

module.exports = {
  // 文件大小限制
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFilesPerRequest: 5, // 单次最多上传5个文件
  
  // 每日限制
  maxDailyUploads: 50, // 每个IP每日最多上传50个文件
  maxDailySize: 100 * 1024 * 1024, // 每个IP每日最多100MB
  
  // 文件类型白名单
  allowedTypes: [
    'image/png',
    'image/jpeg', 
    'image/gif',
    'image/jpg',
    'image/webp'
  ],
  
  // 存储配置
  uploadDir: 'client-upload', // 上传目录
  cleanupDays: 7, // 文件保留天数，7天后自动清理
  
  // 安全设置
  rateLimitWindow: 24 * 60 * 60 * 1000, // 24小时窗口期
  
  // 监控设置
  enableStorageMonitor: true, // 启用存储监控
  cleanupInterval: 60 * 60 * 1000, // 每小时检查清理
  
  // 生产环境建议
  production: {
    maxFileSize: 2 * 1024 * 1024, // 生产环境建议更小：2MB
    maxDailyUploads: 20, // 生产环境：每日20个文件
    maxDailySize: 50 * 1024 * 1024, // 生产环境：每日50MB
    cleanupDays: 3, // 生产环境：3天清理
  },
  
  // 开发环境配置
  development: {
    maxFileSize: 10 * 1024 * 1024, // 开发环境：10MB
    maxDailyUploads: 100,
    maxDailySize: 200 * 1024 * 1024, // 200MB
    cleanupDays: 7,
  }
};