FROM node:latest
WORKDIR /app
COPY ./package.json /app/
RUN npm config set 
RUN npm install -g pm2 --registry=https://registry.npm.taobao.org
RUN npm install --registry=https://registry.npm.taobao.org
COPY . /app/
EXPOSE 3000
CMD npm start
