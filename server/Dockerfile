FROM node:20-alpine as builder

ARG NODE_ENV
ENV PORT=${PORT:-5000}

RUN mkdir /app

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

#

FROM node:20-alpine

ARG NODE_ENV
ENV PORT=${PORT:-5000}

WORKDIR /app

COPY --from=builder /app/.env ./.env
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/secrets ./secrets
COPY --from=builder /app/firebaseCredentials.json ./

RUN npm install @nestjs/core@10.3.3

EXPOSE $PORT

CMD ["npm", "run", "start:docker"]
