const express = require("express");
const router = express.Router();

// 在文件顶部添加
const tokenRouter = require('./token/step4-enhanced-login');

// 在router.use()部分添加
router.use('/token', tokenRouter);

//api路由接口
const users = require('./users');
router.use(users);

const uploadRouter = require("./upload/upload-secure.js");
router.use(uploadRouter);

const testapi = require("./test");
router.use(testapi)
module.exports = router;