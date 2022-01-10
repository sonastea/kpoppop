FROM node:17-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run start
