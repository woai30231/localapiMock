const express = require('express');
const app = express();
const port = 6666;
const path = require('path');
app.use("/client-upload",express.static(path.resolve(__dirname,'./client-upload')))

const objlistRouter= require("./routers");

app.get('/', (req, res) => {
  res.send('欢迎使用本地API接口测试服务器！');
});

app.use(objlistRouter);

// app.listen(port, () => {
//   console.log(`服务器已启动，监听端口 ${port}`);
// }); 

const { sequelize } = require('./models/file');

sequelize.sync().then(() => {
  console.log('数据库已同步');
  app.listen(port, () => {
    console.log(`服务器已启动，监听端口 ${port}`);
  });
});