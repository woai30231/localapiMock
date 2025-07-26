const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");



const router = express.Router();

const uploadDir = path.resolve(__dirname,"../../client-upload")
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true})
};

//配置multer
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,uploadDir);
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

const fileFilter = function(req,file,cb){
    const allowedTypes = ['image/png','image/jpeg','image/gif'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(new Error("只允许上传png jpeg gif格式的图片"))
    };
};

const upload = multer({storage,fileFilter});

router.post('/api/upload',upload.single('file'),(req,res)=>{
    if(!req.file){
        return res.status(400).json({error:'未上传文件或文件格式不正确'});
    };
    res.json({
        message:'上传成功',
        data:{
            filename:req.file.filename,
            path:`/client-upload/${req.file.filename}`,
        },
        code:200
    })
})

// 错误处理中间件
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({error: '文件大小超过限制'});
        }
        return res.status(400).json({error: '文件上传错误'});
    }
    
    if (error.message) {
        return res.status(400).json({error: error.message});
    }
    
    res.status(500).json({error: '服务器内部错误'});
});
module.exports = router;