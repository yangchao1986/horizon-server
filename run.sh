#！/bin/bash
echo '创建目录'
mkdir upload/img
mkdir upload/avatar
echo '创建镜像'
docker build -t horizonsys/server:v1.0 . 
echo '删除旧容器'
exist=`docker inspect --format '{{.State.Running}}' horizonsys-server`
if [ "$exist" ];
then
docker stop horizonsys-server
docker rm horizonsys-server
fi;
echo '创建新容器'
docker run -di --name=horizonsys-server -p 38989:3000 horizonsys/server:v1.0
