
//生成token 
exports.makeToken = (username,key,role)=>{
    const jwt = require("jsonwebtoken");
    const tokenPayload = {
        username: username,
        role: role,
        iat: Math.floor(Date.now() / 1000), // 签发时间
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7天后过期
    };

    const token = jwt.sign(tokenPayload, key);

    return token;
}
// Token验证中间件 - 更智能的错误处理
exports.authenticateToken = (req, res, next) => {
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