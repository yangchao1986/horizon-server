FROM node:latest
WORKDIR /app
COPY ./package.json /app/
RUN npm install -g npm@8.15.0 pm2
RUN npm install
COPY . /app/
EXPOSE 3000
CMD npm start
