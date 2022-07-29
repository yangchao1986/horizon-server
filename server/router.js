const express = require('express')
const router = express.Router()
const sqlFun = require('./mysql')
const multer = require('multer') 
const fs = require('fs') 

router.get('/',(req,res)=>{
  res.send('hello')
})
router.get('/sampleList',(req,res)=>{
  const page = req.query.page || 1;
  const sqlLen = "select * from sample where id";
  sqlFun(sqlLen,null,data => {
    let len = data.length;
    const sql = "select * from sample order by id desc limit 8 offset " + (page-1)*8;
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
* 样本搜索功能
*/
router.get("/searchSample",(req,res) => {
  var search = req.query.search;
  const sql = "select * from sample where concat(`code`,`name`,`submitter`) like '%" + search + "%'"; //后台进行数据分割减少前台压力
  sqlFun(sql,null,(result) => {
    console.log(result)
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


/*
* 上传图片
* 说明
* 1 后台安装multer模块 同时引入fs
* 2 router.js入口文件导入模块
*   const fs=require('fs')
*   const multer=require('multer')
* 3 上传图片
 */

/* 判断目录权限和创建目录 */
var createFolder = function(folder){
  try{
    fs.accessSync(folder); //fs.accessSync()方法用于同步测试给定文件或目录的权限
  }catch(e){
    fs.mkdirSync(folder); //创建多级目录
  }
}
/* 设置存储目录和文件格式 */
var storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"./upload/img")
  },
  filename: function(req,file,cb){
    cb(null,Date.now()+"-"+file.originalname)
  }
})
/* 设置存储目录 */
var uploadFolder = './upload/img';
createFolder(uploadFolder);
var upload = multer({
  storage:storage
})

router.post("/upload",upload.single("file"),function(req,res,next){
  var file =req.file;
  console.log('文件类型：%s',file.mimetype);
  console.log('原始文件名：%s',file.originalname);
  console.log('文件大小：%s',file.size);
  console.log('文件保存路径：%s',file.path);
  res.json({
    res_code:'0',
    name:file.originalname,
    url:file.path
  })
})



/*
 * 样本信息添加
 * 参数： title cid  category sellPoint price num descs paramsInfo image
 */
router.get("/addSample", (req, res) => {
    /**
     * 获取参数[code,name,sex,age,uid,nationality,disease,history,clinical,sample,
     * status,test,sampling,receiving,unit,submitter,phone,remarks,pics]
     */
    //var arr = [code,name,sex,age,uid,nationality,disease,history,clinical,sample,status,test,sampling,receiving,unit,submitter,phone,remarks,pics];
    //console.log('本次提交的信息为',JSON.stringify(req.query)) //JSON.stringify将字典序列化为字符串
    let name = []
    let value = []
    /* 将接口数据{json}转成name字段字符串,value值字符串*/
    for(var k in req.query){
        name.push(k);
        value.push(req.query[k])
    }
    const sql = "insert into sample (`" + name.join("`,`") + "`) values ('" + value.join("','") + "')";
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
 * 样本数据删除接口 id
 */
router.get("/delSample", (req, res) => {
    var id = req.query.id;
    const sql = "delete from sample where id=?"
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


/**
 * 批量删除 batchDelete  idArr Array  id标识
 * sql = "delete from A where id in (1,2,3)"
 */
router.get("/batchDelete", (req, res) => {
    let arr = req.query.idArr;//[] 数组格式 需要传递数据是 离散的数字格式
    // const sql =`delete from project where id in (?)`;
    let sql = '';
    function fun(arr) {//sql =`delete from project where id in (101,102,103)`;
        sql = `delete from project where id in (`
        for (let i = 0; i < arr.length; i++) {
            sql += arr[i] + ',' //101,102,
        }
        sql = sql.slice(0, -1)
        sql = sql + ')'
        // console.log(sql);
    }
    fun(arr)
    sqlFn(sql, null, result => {
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




/**
 * 修改商品
 */

router.get("/editSample", (req, res) => {
    let str = []
    /* 将接口数据{json}转成name字段字符串,value值字符串*/
    for(let k in req.query){
      if(k!="id")
        str.push("`" + k + "`='" + req.query[k] + "'");
    }
    const sql = "update sample set " + str.join(",") + " where id=" + req.query.id;
    var arr=null;
    sqlFun(sql, arr, result => {
      if (result.affectedRows > 0) {
          res.send({
              status: 200,
              msg: "修改成功"
          })
      } else {
          res.send({
              status: 500,
              msg: "修改失败"
          })
      }
  })
})



module.exports = router
