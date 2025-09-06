const express = require('express');
const app = express();
require("dotenv").config({path:"./.env.port"})
const port = process.env.site_port;
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(expressStaticGzip(path.resolve(__dirname,'./public'), {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  serveStatic: {
    index: false
  }
}));
app.use("/client-upload", expressStaticGzip(path.resolve(__dirname,'./client-upload'), {
  enableBrotli: true,
  orderPreference: ['br', 'gz'],
  serveStatic: {
    index: false
  }
}));

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
  if(req.path.startsWith('/react-app')){
    res.sendFile(path.resolve(__dirname, './public/react-app/index.html'));
  }else if(req.path.startsWith('/vue-app')){
    res.sendFile(path.resolve(__dirname, './public/vue-app/index.html'));
  }else if(req.path.startsWith('/vue-admin')){
    res.sendFile(path.resolve(__dirname, './public/vue-admin/index.html'));
  }else if(req.path == '/' || req.path == '' || req.path == '/index.html'){
    res.status(200).sendFile(path.resolve(__dirname,'./public/index.html'))
  }else{
    res.status(404).sendFile(path.resolve(__dirname,'./notfound.html'))
  };

});

app.listen(port, () => {
    console.log(`服务器已启动，监听端口 ${port}`);
    console.log(`SPA路由已启用，所有未匹配路径将返回index.html`);
});
