const express = require('express');
const router = express.Router();
router.get("/api/objlist",(req,res)=>{
    const objList = [
        { value: 'v1', label: '标签1' },
        { value: 'v2', label: '标签2' },
        { value: 'v3', label: '标签3' },
        { value: 'v4', label: '标签4' },
        { value: 'v5', label: '标签5' },
        { value: 'v6', label: '标签6' },
        { value: 'v7', label: '标签7' },
        { value: 'v8', label: '标签8' },
        { value: 'v9', label: '标签9' },
        { value: 'v10', label: '标签10' }
      ];
      res.json({
        code:200,
        message:'获取列表成功',
        data:objList
      });
})
module.exports = router;