const express = require('express')
const sqlFun = require('./mysql')
const multer = require('multer') //处理上传数据的库
const Moment = require('moment')

const Material = express.Router()

//路由测试接口
Material.get('/',(req,res)=>{
  res.send('hello')
})

/*
 * 获取物料信息列表
 */
Material.get('/materialList',(req,res)=>{
  const page = req.query.page || 1;
  const sqlLen = "select * from material where is_deleted=0";
  sqlFun(sqlLen,null,data => {
    let len = data.length;
    const sql = "select * from material where is_deleted=0 order by id desc limit 10 offset " + (page-1)*10;
    sqlFun(sql,null,result => {
      if(result.length>0){
        res.send({
          status:200,
          data:result,
          pageSize:10,
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
* 查询物料
*/
Material.get("/searchMaterial",(req,res) => {
  var search = req.query.search;
  const page = req.query.page || 1;
  const sqlLen = "select * from material where is_deleted=0 and concat(`material`,`code`,`brand`) like '%" 
  + search + "%'";
  sqlFun(sqlLen,null,data => {
    let len = data.length;
    const sql = "select * from material where is_deleted=0 and concat(`material`,`code`,`brand`) like '%" 
  + search + "%' order by id desc limit 10 offset " 
  + (page-1)*10;
    sqlFun(sql,null,result => {
      if(result.length>0){
        res.send({
          status:200,
          data:result,
          pageSize:10,
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
* 1、添加物料
* 2、获取参数[Materialname,password,name,job,email,register,status,role,phone,avatar]
*/
Material.get("/addMaterial", (req, res) => {
  let item = req.query
  delete item['checkPassword']
  item.receiving = Moment(item.receiving).format("YYYY-MM-DD")
  item.register = Moment(item.register).format("YYYY-MM-DD")
  item.expiration = Moment(item.expiration).format("YYYY-MM-DD")
  let name = Object.keys(item)
  let value = Object.values(item)
  
  const sql = "insert into material (`" + name.join("`,`") + "`) values ('" + value.join("','") + "')";
  console.log(sql)
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
 * 编辑物料 {id}
 */
Material.get("/editMaterial", (req, res) => {
  console.log("更新编辑数据")
  var id = req.query.id;
  let name = []
  let value = []
  /* 将接口数据{json}转成name字段字符串,value值字符串 */
  for(var k in req.query){
    var flag = ['id','is_deleted'].includes(k)  //判断这个值是否需要被踢掉。
    if(isNaN(req.query[k])&&!isNaN(Date.parse(req.query[k]))){
      req.query[k] = Moment(req.query[k]).format("YYYY-MM-DD")
    }
    if(!flag){
      name.push(k+"=?");
      value.push(req.query[k])
    }
  }
  value.push(id)
  const sql = "update material set " + name.join(",") + " where id=?"

  sqlFun(sql, value, result => {
      if (result.affectedRows > 0) {
          res.send({
              status: 200,
              msg: "更新成功"
          })
      } else {
          res.send({
              status: 500,
              msg: "更新失败"
          })
      }
  })
})

/*
 * 逻辑删除，删除物料 {id}
 */
Material.get("/delMaterial", (req, res) => {
    var id = req.query.id;
    const sql = "update material set is_deleted=1 where id=?"
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
* 1、批量添加物料
* 2、获取参数[Materialname,...]
*/
Material.get("/addBatchMaterial", (req, res) => {
  
  let dataArr = Object.values(req.query)
  
  let arr = dataArr.map(item=>{
    item = JSON.parse(item) //序列化为JSON对象
    item.register=Moment(new Date()).format("YYYY-MM-DD")
    item.expiration=Moment(item.expiration).format("YYYY-MM-DD")
    item.receiving=Moment(item.receiving).format("YYYY-MM-DD")
    return Object.values(item)
  })
  let keyArr=Object.keys(JSON.parse(dataArr[0]))
  
  const sql = "insert into material (`" + keyArr.join("`,`") + "`) values ?"

  sqlFun(sql, [arr], result => {
      if (result.affectedRows > 0) {
          res.send({
              status: 200,
              msg: "总数据"+dataArr.length+"行，成功"+result.affectedRows+"次。"
          })
      } else {
          res.send({
              status: 500,
              msg: "导入失败"
          })
      }
  })
  
})

/*
 * 通过id获取数据
 * 用于下载指定数据
 */
Material.get("/selectMaterial", (req, res) => {
  let sids = req.query.sids
  let tableField = req.query.tableField
  const sql = "select " + tableField.join(",") + " from material where is_deleted=0 and (id in (" + sids.join(",") + "))"
  const arr = null
  
  sqlFun(sql, arr, result => {
      if (result.length > 0) {
        let dataArr = result.map(item=>{
          item.expiration=Moment(item.expiration).format("YYYY-MM-DD")
          item.receiving=Moment(item.receiving).format("YYYY-MM-DD")
          return item
        })
        res.send({
            status: 200,
            msg: "查询成功",
            dataArr
        })
      } else {
          res.send({
              status: 500,
              msg: "查询失败"
          })
      }
  })
})

module.exports = Material
