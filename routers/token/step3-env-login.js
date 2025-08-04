// 步骤3：使用环境变量的JWT登录实现
// 这个版本展示了如何正确使用环境变量管理密钥

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 加载环境变量
require('dotenv').config({ path: './routers/token/.env' });

// 从环境变量获取密钥，确保安全性
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 检查密钥是否存在
if (!SECRET_KEY) {
    console.error('❌ JWT_SECRET 未在环境变量中设置！');
    process.exit(1);
}

console.log('✅ JWT配置已加载');
console.log('📄 Token过期时间:', TOKEN_EXPIRES_IN);

// 模拟用户数据
const users = [
    { id: 1, username: 'admin', password: 'admin123' },
    { id: 2, username: 'user', password: 'user123' }
];

// 登录接口
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 验证用户
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ 
            success: false, 
            message: '用户名或密码错误' 
        });
    }

    // 生成token
    const token = jwt.sign(
        { 
            userId: user.id, 
            username: user.username 
        },
        SECRET_KEY,
        { 
            expiresIn: TOKEN_EXPIRES_IN 
        }
    );

    res.json({
        success: true,
        message: '登录成功',
        data:{
            token:token
        },
        code:200,
        user: {
            id: user.id,
            username: user.username
        }
    });
});

// 验证token接口
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: '未提供token'
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({
            success: true,
            message: 'token有效',
            user: decoded
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'token无效或已过期',
            error: error.message
        });
    }
});

// 获取用户信息接口
router.get('/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: '未提供token'
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = users.find(u => u.id === decoded.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'token无效或已过期'
        });
    }
});

module.exports = router;