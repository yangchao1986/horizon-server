const mysql = require('mysql')

const client = mysql.createConnection({
  host:'10.71.32.138',
  user:'root',
  password:'56592886',
  database:'labmana',
  port:'33306'
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
