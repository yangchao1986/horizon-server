const mysql = require('mysql')

const client = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'labmana',
  port:'3306'
})
function sqlFun(sql,arr,callback){
  client.query(sql,arr,function(error,result){
    if(error){
      console.log('数据库连接错误');
      return;
    }
    callback(result)
  })
}

module.exports= sqlFun
