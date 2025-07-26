const express = require("express");
const router = express.Router();

//api路由接口
const objlistRouter = require('./objlist');
router.use(objlistRouter);

const uploadRouter = require("./upload/upload.js");
router.use(uploadRouter);
module.exports = router;