FROM node:20-alpine as builder

WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV:-production}

RUN npm install -g pnpm@8.15.4

COPY package.json pnpm-lock.yaml .env .env.${NODE_ENV} ./

RUN pnpm install

COPY . .

RUN npx vite build --mode ${NODE_ENV}

#

FROM node:20-alpine

WORKDIR /app

RUN npm install serve@14.2.1

COPY --from=builder /app/build ./build
COPY --from=builder /app/secrets/cert.pem ./secrets/cert.crt
COPY --from=builder /app/secrets/key.pem ./secrets/key.pem

EXPOSE 3000

CMD ["npx", "serve", "--ssl-cert", "secrets/cert.crt", "--ssl-key", "secrets/key.pem", "-n", "-s", "build"]
