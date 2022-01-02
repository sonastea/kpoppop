FROM node:16.13.1-alpine as builder

RUN mkdir /app

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

FROM node:16.13.1-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/firebaseCredentials.json ./

EXPOSE 5000

CMD ["npm", "run", "start:migrate:prod"]
