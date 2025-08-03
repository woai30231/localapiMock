// 第二步：使用JWT的真实token登录
// 这一步需要安装jsonwebtoken包：npm install jsonwebtoken

const express = require('express');
const router = express.Router();

// 注意：需要运行 npm install jsonwebtoken 才能使用
// const jwt = require('jsonwebtoken');

// 模拟用户数据
const users = [
  { id: 1, username: 'admin', password: '123456', email: 'admin@example.com' },
  { id: 2, username: 'user', password: '123456', email: 'user@example.com' }
];

const SECRET_KEY = 'your-secret-key-change-this';

// 当用户准备好后，取消下面的注释并安装jsonwebtoken包
/*

// 1. 登录接口 - JWT版本
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      code: 401,
      message: '用户名或密码错误'
    });
  }
  
  // 创建JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
  
  res.json({
    code: 200,
    message: '登录成功',
    data: {
      token,
      user: { id: user.id, username: user.username, email: user.email }
    }
  });
});

// 2. 验证JWT token接口
router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '请提供token'
    });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    res.json({
      code: 200,
      message: '获取用户信息成功',
      data: { user: decoded }
    });
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: 'token无效或已过期'
    });
  }
});

*/

// 临时导出空路由，防止错误
router.get('/', (req, res) => {
  res.json({
    message: 'JWT版本已准备就绪，取消step2-jwt-login.js中的注释即可启用',
    instruction: '运行: npm install jsonwebtoken'
  });
});

module.exports = router;