const express = require('express');
const router = express.Router();

const authMiddlare = require('../middleware');
// 加载环境变量
require('dotenv').config({ path: './routers/token/.env' });
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!SECRET_KEY) {
    console.error('❌ JWT_SECRET 未设置！');
    process.exit(1);
}
module.exports = router;
const adminMember = [
    {username:'admin',nickname:'超级管理员'},
    {username:'user',nickname:'管理员'}
]
router.get("/login",(req,res)=>{
    // 检查参数是否缺失
    const {username, password} = req.query;
    if (!username || !password) {
        return res.status(400).json({
            code: 400,
            message: '缺少必要参数 username 或 password',
            data: null
        });
    }
    // 根据username开头判断角色
    if (username.startsWith('admin')) {
        let item = adminMember.find(item=>item.username == 'admin');
        let token = authMiddlare.makeToken(item.nickname,SECRET_KEY,'user-manager');
        res.status(200).json({
            code: 200,
            message: '登录成功',
            data: {
                username:item.nickname,
                role: 'admin',
                permission: ['all'],
                token: token
            }
        });
    } else if (username.startsWith('user')) {
        let item = adminMember.find(item=>item.username == 'user');
        let token = authMiddlare.makeToken(item.nickname,SECRET_KEY,'user-manager');
        res.status(200).json({
            code: 200,
            message: '登录成功',
            data: {
                username:item.nickname,
                role: 'user',
                permission: ['update', 'add','view'],
                token: token
            }
        });
    } else {
        res.status(403).json({
            code: 403,
            message: '没有浏览权限',
            data: null
        });
    }
})