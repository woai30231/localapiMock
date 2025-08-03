# Token登录流程学习指南（前端开发者专用）

## 🎯 第一步：理解Token登录的基本概念

### Token登录流程就像...
想象你去图书馆：
1. **登录** = 出示身份证办借书证（获得token）
2. **访问资源** = 每次借书时出示借书证（携带token）
3. **退出** = 归还借书证（删除token）

### 三个核心接口

#### 1. 登录接口 `/token/login`
**作用**: 验证用户名密码，返回token

**测试命令**:
```bash
curl -X POST http://localhost:6753/token/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin", "password":"123456"}'
```

**预期返回**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "simple-token-1703...",
    "user": {"id": 1, "username": "admin"}
  }
}
```

#### 2. 获取用户信息 `/token/profile`
**作用**: 使用token获取用户信息

**测试命令**:
```bash
curl -X GET http://localhost:6753/token/profile \
  -H "Authorization: Bearer 你的token"
```

#### 3. 退出登录 `/token/logout`
**作用**: 删除token

**测试命令**:
```bash
curl -X POST http://localhost:6753/token/logout \
  -H "Authorization: Bearer 你的token"
```

## 🚀 如何启用这个示例

### 步骤1：将token路由添加到主路由
打开 `routers/index.js`，添加一行：

```javascript
// 在文件顶部添加
const tokenRouter = require('./token/step1-basic-login');

// 在router.use()部分添加
router.use('/token', tokenRouter);
```

### 步骤2：重启服务器
```bash
npm run dev
```

### 步骤3：用Postman或curl测试

## 🔍 前端代码示例

```javascript
// 登录
const login = async () => {
  const response = await fetch('/token/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username: 'admin', password: '123456'})
  });
  const data = await response.json();
  localStorage.setItem('token', data.data.token);
};

// 获取用户信息
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/token/profile', {
    headers: {'Authorization': `Bearer ${token}`}
  });
  const data = await response.json();
  console.log(data);
};
```

## 🎓 下一步学习
当你理解了这个基础流程后，我们可以：
1. 使用真实的JWT token（下一步）
2. 连接数据库
3. 添加密码加密
4. 添加token过期时间

有任何问题随时问我！