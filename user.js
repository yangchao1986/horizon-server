const Moment = require('moment')
const express = require('express')
const sqlFun = require('./mysql')
const multer = require('multer') //处理上传数据的库

const user = express.Router()

//路由测试接口
user.get('/',(req,res)=>{
  res.send('hello')
})

/*
 * 获取用户信息列表
 */
user.get('/userList',(req,res)=>{
  const page = req.query.page || 1;
  const sqlLen = "select * from user where id";
  sqlFun(sqlLen,null,data => {
    let len = data.length;
    const sql = "select * from user order by id desc limit 8 offset " + (page-1)*8;
    sqlFun(sql,null,result => {
      if(result.length>0){
        res.send({
          status:200,
          data:result,
          pageSize:8,
          total:len
        })
      } else {
        res.send({
          status:500,
          msg:"暂无数据"
        })
      }
    })
  })
})

/*
* 1、添加用户
* 2、获取参数[username,password,name,job,email,register,status,role,phone,avatar]
*/
user.get("/addUser", (req, res) => {
    let name = []
    let value = []
    /* 将接口数据{json}转成name字段字符串,value值字符串 */
    for(var k in req.query){
      var flag = ['checkPassword'].includes(k)  //判断这个值是否需要被踢掉。
      if(!flag){
        if(isNaN(req.query[k])&&!isNaN(Date.parse(req.query[k]))){
          req.query[k] = Moment(req.query[k]).format("YYYY-MM-DD")
        }
        name.push(k);
        value.push(req.query[k])
      }
    }
    const sql = "insert into user (`" + name.join("`,`") + "`) values ('" + value.join("','") + "')";
    var arr=null;
    sqlFun(sql, arr, result => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "添加成功"
            })
        } else {
            res.send({
                status: 500,
                msg: "添加失败"
            })
        }
    })
})

/*
 * 删除用户 {id}
 */
user.get("/delUser", (req, res) => {
    var id = req.query.id;
    const sql = "delete from user where id=?"
    const arr = [id];
    sqlFun(sql, arr, result => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "删除成功"
            })
        } else {
            res.send({
                status: 500,
                msg: "删除失败"
            })
        }
    })
})

/*
* 查询用户
*/
user.get("/searchUser",(req,res) => {
  var search = req.query.search;
  const sql = "select * from user where concat(`username`,`name`) like '%" + search + "%'"; //后台进行数据分割减少前台压力
  sqlFun(sql,null,(result) => {
    if(result.length>0){
      res.send({
        status: 200,
        result
      })
    }else{
      res.send({
        status: 500,
        msg: "暂无数据"
      })
    }
  })
})

module.exports = user
