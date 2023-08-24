FROM node:latest

COPY . /home/app

WORKDIR /home/app

RUN npm install

CMD ["node", "index.js"]


