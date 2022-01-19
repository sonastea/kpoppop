FROM node:16-alpine as builder

RUN mkdir /app

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

#

FROM node:16-alpine

COPY --from=builder /app/.env ./.env
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/secrets ./secrets
COPY --from=builder /app/firebaseCredentials.json ./

RUN npm install @nestjs/core
RUN npm install prisma

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
