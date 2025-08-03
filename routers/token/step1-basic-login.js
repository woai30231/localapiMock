// 第一步：最简单的token登录演示
// 这个文件只做一件事：演示token的基本概念

const express = require('express');
const router = express.Router();

// 模拟用户数据（真实环境会用数据库）
const users = [
  { id: 1, username: 'onlyadmin', password: '123456' },
  { id: 2, username: 'user', password: '123456' }
];

// 模拟token存储（真实环境会用jwt）
const tokenStore = new Map();

// 1. 登录接口 - 最简单的版本
router.post('/login', (req, res) => {
  console.log(req.body)
  const { username, password ,email} = req.body;
  console.log(username,password)
  
  // 查找用户
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.json({
      code: 401,
      message: '用户名或密码错误'
    });
  }
  
  user.email = email;
  // 生成一个简单token（实际用jwt）
  const token = 'simple-token-' + Date.now() + '-' + user.id;
  
  // 存储token（实际会存到redis或jwt签名）
  tokenStore.set(token, user);
  
  console.log('用户登录成功:', username, 'token:', token);
  
  res.json({
    code: 200,
    message: '登录成功',
    data: {
      token: token,
      user: { id: user.id, username: user.username }
    }
  });
});

// 2. 验证token接口 - 最简单的版本
router.get('/profile', (req, res) => {
  // 从header获取token
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.json({
      code: 401,
      message: '请登录',
      data:{}
    });
  }
  
  // 查找token
  const user = tokenStore.get(token);
  
  if (!user) {
    return res.json({
      code: 401,
      message: 'token无效'
    });
  }
  
  res.json({
    code: 200,
    message: '获取用户信息成功',
    data: {
      user: { id: user.id, username: user.username }
    }
  });
});

// 3. 退出登录接口
router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    tokenStore.delete(token);
  }
  
  res.json({
    code: 200,
    message: '退出登录成功'
  });
});

module.exports = router;