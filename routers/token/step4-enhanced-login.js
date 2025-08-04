// 步骤4：增强版JWT验证 - 更好的错误处理和数据利用
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 加载环境变量
require('dotenv').config({ path: './routers/token/.env' });

const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!SECRET_KEY) {
    console.error('❌ JWT_SECRET 未设置！');
    process.exit(1);
}

// 模拟用户数据（实际应用中应来自数据库）
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Token验证中间件 - 更智能的错误处理
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'NO_TOKEN',
                message: '访问令牌未提供',
                details: '请在请求头中添加 Authorization: Bearer <token>'
            }
        });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            // 区分不同类型的token错误
            let errorCode = 'INVALID_TOKEN';
            let message = '访问令牌无效';
            
            if (err.name === 'TokenExpiredError') {
                errorCode = 'TOKEN_EXPIRED';
                message = '访问令牌已过期';
            } else if (err.name === 'JsonWebTokenError') {
                errorCode = 'MALFORMED_TOKEN';
                message = '访问令牌格式错误';
            }

            return res.status(401).json({
                success: false,
                error: {
                    code: errorCode,
                    message: message,
                    details: err.message,
                    expiredAt: err.expiredAt || null
                }
            });
        }

        // ✅ 验证成功，将decoded数据附加到请求对象
        req.user = decoded;
        next();
    });
};

// 登录接口 - 使用decoded数据
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 输入验证
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'INVALID_INPUT',
                message: '用户名和密码不能为空'
            }
        });
    }

    // 查找用户
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_CREDENTIALS',
                message: '用户名或密码错误'
            }
        });
    }

    // ✅ 生成包含用户信息的token
    const tokenPayload = {
        userId: user.id,
        username: user.username,
        role: user.role,
        iat: Math.floor(Date.now() / 1000), // 签发时间
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7天后过期
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY);

    res.json({
        success: true,
        code:200,
        message: '登录成功',
        data: {
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            },
             code:200,
            expiresIn: TOKEN_EXPIRES_IN
        }
    });
});

// 获取用户信息 - 使用decoded数据
router.get('/profile', authenticateToken, (req, res) => {
    // ✅ 使用req.user中的decoded数据
    const { userId } = req.user;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            error: {
                code: 'USER_NOT_FOUND',
                message: '用户不存在'
            }
        });
    }

    res.json({
        success: true,
        data: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

// 验证token接口 - 返回详细信息
router.get('/verify', authenticateToken, (req, res) => {
    // ✅ 直接使用req.user中的decoded数据
    res.json({
        success: true,
        data: {
            valid: true,
            user: req.user,
            issuedAt: new Date(req.user.iat * 1000).toISOString(),
            expiresAt: new Date(req.user.exp * 1000).toISOString()
        }
    });
});

// 刷新token接口
router.post('/refresh', authenticateToken, (req, res) => {
    // ✅ 使用decoded数据创建新token
    const { userId, username, role } = req.user;
    
    const newToken = jwt.sign(
        { userId, username, role },
        SECRET_KEY,
        { expiresIn: TOKEN_EXPIRES_IN }
    );

    res.json({
        success: true,
        data: {
            token: newToken,
            expiresIn: TOKEN_EXPIRES_IN
        }
    });
});

module.exports = router;