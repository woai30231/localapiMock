const express = require("express");
const router = express.Router();

//api路由接口
const users = require('./users');
router.use(users);

const uploadRouter = require("./upload/upload.js");
router.use(uploadRouter);

const testapi = require("./test");
router.use(testapi)
module.exports = router;