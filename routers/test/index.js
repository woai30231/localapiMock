const express = require("express");
const router = express.Router();

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
        code:200,
        message:'返回成功信息',
        data:data
    })
})
module.exports = router;