FROM node:20-alpine as builder

ARG NODE_ENV
ENV PORT=${PORT:-5000}

RUN mkdir /app

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["npm", "run", "start:docker"]
