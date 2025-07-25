# 本地API接口测试服务器

## 项目简介
本项目基于 Node.js + Express，旨在为前后端独立开发前端本地业务开发提供便捷的 API 接口测试环境。支持模块化路由管理，便于后续扩展和维护。

## 目录结构
```markdown
api接口/
├── index.js           # 入口文件
├── package.json
├── routes/            # 路由目录
│   ├── objlist.js     # 示例接口
│   └── router.js      # 路由主文件
└── node_modules/
```

## 安装依赖
```bash
npm install
```

## 启动开发服务器
```bash
npm run dev
```
> 使用 nodemon 自动监听文件变动，便于开发调试。


## 新增API接口方法
1. 在 `routes` 目录下新建对应的 js 文件，编写接口逻辑。
2. 在 `routes/router.js` 中引入并挂载新接口模块。

## 示例接口
- `GET /api/objlist`  
  返回一个对象数组，包含 value 和 label 字段。

## 版本管理
- 已添加 `.gitignore`，`node_modules` 不纳入版本管理。

## 其它说明
- 如需扩展中间件、mock数据、跨域等功能，请在 issues 或 PR 中提出。

---
