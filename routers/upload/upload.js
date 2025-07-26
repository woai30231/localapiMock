const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {File} = require("../../models/file.js");



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


router.post("/api/upload-with-date",upload.single('file'),async (req,res)=>{
    //检查是否有文件上传
    if(!req.file){
        return res.status(400).json({
            error:"未上传文件或文件格式不正确",
            code:400
        });
    }

    const date = req.body.date;
    //检查日期是否存在
    if(!date){
        return res.status(400).json({
            error:'缺少日期信息',
            code:400
        })
    };

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateRegex.test(date)){
        return res.status(400).json({
            error:"日期格式不正确，请使用YYYY-MM-DD格式",
            code:400
        })
    };
    try{
        const fileRecord = await File.create({
            originalName:req.file.originalname,
            filename:req.file.filename,
            path:`/client-upload/${req.file.filename}`,
            mimetype:req.file.mimetype,
            size:req.file.size,
            uploadDate:date
        });
        res.json({
            message: '上传成功',
            data: {
                id:fileRecord.id,
                filename:fileRecord.filename,
                path:fileRecord.path,
                uploadDate:fileRecord.uploadDate
            },
            code: 200
        })
    }catch(err){
        res.status(500).json({error:"数据库保存失败",code:500})
    }
})


router.get("/api/file/:id",async(req,res)=>{
    const id = req.params.id;
    const fileRecord = await File.findByPk(id);
    if(!fileRecord){
        return res.status(404).json({error:"文件不存在",code:404})
    };
    res.json({
        code:200,
        data:{
            id:fileRecord.id,
            filename:fileRecord.filename,
            path:fileRecord.path,
            originalName:fileRecord.originalName,
            uploadDate:fileRecord.uploadDate
        }
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