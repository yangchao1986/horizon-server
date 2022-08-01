FROM node:latest
WORKDIR /app
COPY ./package.json /app/
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install -g pm2 
RUN npm install
COPY . /app/
EXPOSE 3000
CMD npm start
