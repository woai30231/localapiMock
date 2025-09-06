const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// 延迟路由 - 2秒后直接发送script.js文件
router.get("/test/defer", (req, res) => {
    setTimeout(() => {
        const scriptPath = path.join(__dirname, "script.js");
        res.sendFile(scriptPath, (err) => {
            if (err) {
                res.status(500).json({
                    code: 500,
                    message: "发送文件失败",
                    data: null
                });
            }
        });
    }, 2000);
});

router.all("/test/api",(req,res)=>{
    let data = null;

    if(req.method == 'POST'){
        data = req.body;
    }else if(req.method == 'GET'){
        data = req.query;
    }else{
        data = {msg:'你用了get和post以外的请求方法'}
    }
    res.status(200).json({
        code: 200,
        message: '返回成功信息',
        data: data
    })
})
module.exports = router;