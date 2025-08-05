const express = require('express');
const app = express();
const port = 6753;
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.resolve(__dirname,'./public')))
app.use("/client-upload",express.static(path.resolve(__dirname,'./client-upload')))

const Router = require("./routers");

app.get('/', (req, res) => {
  res.send('欢迎使用本地API接口测试服务器！');
});

app.use(Router);

// SPA路由配置：所有未匹配的路径返回index.html
app.get('*', (req, res) => {
  // 检查请求是否为API接口
  if (req.path.startsWith('/api') || req.path.startsWith('/token')) {
    return res.status(404).json({
      error: '接口不存在',
      code: 404,
      path: req.path
    });
  }
  
  // 返回SPA的index.html
  res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.listen(port, () => {
    console.log(`服务器已启动，监听端口 ${port}`);
    console.log(`SPA路由已启用，所有未匹配路径将返回index.html`);
});
