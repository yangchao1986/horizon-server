#！/bin/bash
WORK_PATH='./server'
cd $WORK_PATH
echo '清除旧代码'
git reset --hard origin/master
git clean -f
echo '拉取新代码'
git pull origin master
echo '开始构建...'
docker build -t horizonsys/server .