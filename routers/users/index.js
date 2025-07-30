const express = require('express');
const router = express.Router();

//获取用户列表
router.get('/api/userlist',(req,res)=>{
  res.status(200).json({
    code:200,
    message:'获取用户列表数据成功',
    data:[
      {
        id:2424,
        name:'xiaoming',
        email:'xiaoming@qq.com'
      },
      {
        id:32424,
        name:'xiaohong',
        email:'xiaohong@qq.com'
      }
    ]
  })
})

router.get("/api/user",(req,res)=>{
    res.status(200).json({
      code:200,
      message:'获取用户信息成功',
      data:{
        name:'小王',
        address:'城南',
        email:'xx@xx.com'
      }
    })
})


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
});
router.post("/api/signup",(req,res)=>{
  // throw new Error("在请求这个接口的地方有一个错误！")
  // let data = ''
  // console.log("走这里了吗？")
  // req.on('data',(chunk)=>{
  //   data += chunk;
  // })
  // req.on("end",(e)=>{
  //   console.log(e)
  //   console.log("结束")
  //   console.log(data);
  //   console.log(JSON.parse(data).username)
  // })
  const {username,email,password} = req.body;
  if(!username || !email || !password){
    return res.status(400).json({
      code:400,
      message:"用户名、邮箱和密码不能为空",
      data:{}
    })
  };
  console.log(username)
  if(username.length<3 || username.length >20){
    return res.status(400).json({
      code : 400,
      message:"用户名长度必须在3-20个字符之间",
      data:{}
    })
  }

  // 2. 检查字段长度
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({
      code: 400,
      message: '用户名长度必须在3-20个字符之间',
      data: {}
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      code: 400,
      message: '密码长度不能少于6个字符',
      data: {}
    });
  }
  
  // 3. 检查邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      code: 400,
      message: '邮箱格式不正确',
      data: {}
    });
  }

   // 4. 检查用户名是否包含特殊字符
   const usernameRegex = /^[a-zA-Z0-9_]+$/;
   if (!usernameRegex.test(username)) {
     return res.status(400).json({
       code: 400,
       message: '用户名只能包含字母、数字和下划线',
       data: {}
     });
   }
  // if()
  res.status(200).json({
    code:200,
    message:'注册账号成功',
    data:{}
  })
})
module.exports = router;