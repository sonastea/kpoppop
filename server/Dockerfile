FROM node:18-alpine as builder

RUN mkdir /app

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

#

FROM node:18-alpine

ENV PORT=${PORT:-5000}

WORKDIR /app

COPY --from=builder /app/.env ./.env
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/secrets ./secrets
COPY --from=builder /app/firebaseCredentials.json ./

RUN npm install @nestjs/core@9.4.2
RUN npm install prisma@4.15.0 && npx prisma migrate deploy

EXPOSE $PORT

CMD ["npm", "run", "start:prod"]
