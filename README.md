#下载
git clone git@github.com:yangchao1986/horizon-server.git

#修改mysql.js连接配置参数
const client = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'labmana',
  port:'3306'
})

#运行脚本
. run.sh