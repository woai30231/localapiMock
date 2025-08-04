const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadDir = path.resolve(__dirname, "../../client-upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 使用时间戳+随机数重命名文件，避免重复
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("只允许上传 png、jpeg、jpg、gif 格式的图片"));
  }
};

// 配置文件大小限制（10MB）
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * 简单文件上传接口 - 不依赖MySQL
 * POST /api/upload
 */
router.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "未上传文件或文件格式不正确",
      code: 400,
    });
  }

  res.json({
    message: "上传成功",
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/client-upload/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
    code: 200,
  });
});

/**
 * 批量文件上传接口 - 不依赖MySQL
 * POST /api/upload-multiple
 */
router.post("/api/upload-multiple", upload.array("files", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      error: "未上传文件或文件格式不正确",
      code: 400,
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
    },
    code: 200,
  });
});

/**
 * 获取上传文件列表 - 不依赖MySQL
 * GET /api/files
 */
router.get("/api/files", (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const fileList = files
      .filter((file) => !file.startsWith("."))
      .map((file) => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          path: `/client-upload/${file}`,
          size: stats.size,
          uploadTime: stats.mtime,
        };
      })
      .sort((a, b) => b.uploadTime - a.uploadTime);

    res.json({
      message: "获取文件列表成功",
      data: {
        files: fileList,
        count: fileList.length,
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
 * 删除上传文件 - 不依赖MySQL
 * DELETE /api/files/:filename
 */
router.delete("/api/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  // 安全检查：防止路径遍历攻击
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return res.status(400).json({
      error: "文件名不合法",
      code: 400,
    });
  }

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "文件不存在",
        code: 404,
      });
    }

    fs.unlinkSync(filePath);
    res.json({
      message: "文件删除成功",
      data: {
        filename,
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

// 错误处理中间件
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "文件大小超过限制（最大10MB）",
        code: 400,
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "文件数量超过限制（最多10个）",
        code: 400,
      });
    }
    return res.status(400).json({
      error: "文件上传错误",
      code: 400,
    });
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