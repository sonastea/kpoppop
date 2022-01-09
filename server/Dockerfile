FROM node:17-alpine as builder

RUN mkdir /app

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

#

FROM node:17-alpine

COPY .env ./.env
COPY package*.json ./
COPY prisma ./prisma
COPY secrets ./secrets
COPY firebaseCredentials.json ./

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

RUN npm install @nestjs/core
RUN npm install prisma

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
