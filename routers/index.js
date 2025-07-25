const express = require("express");
const router = express.Router();

//api路由接口
const objlistRouter = require('./objlist');
router.use(objlistRouter);
module.exports = router;