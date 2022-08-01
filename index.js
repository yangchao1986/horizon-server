//搭建express服务，后台服务
const express = require('express')
const app = express()

//样本信息路由
const router = require('./router')
app.use('/api',router)

//用户信息路由
const user = require('./user')
app.use('/user',user)

//物料信息路由
const material = require('./material')
app.use('/material',material)


//post请求表单数据
app.use(express.urlencoded({ extended: true }))

app.listen(3000,()=>{
  console.log('服务已经启动' + 3000);
})
