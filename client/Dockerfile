FROM node:18-alpine as builder

WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV:-production}

COPY package.json package-lock.json .env .env.${NODE_ENV} ./

RUN npm install

COPY . .

RUN npx vite build --mode ${NODE_ENV}

#

FROM node:18-alpine

WORKDIR /app

RUN npm install serve@14.2.0

COPY --from=builder /app/build ./build
COPY --from=builder /app/secrets/cert.pem ./secrets/cert.crt
COPY --from=builder /app/secrets/key.pem ./secrets/key.pem

EXPOSE 3000

CMD ["npx", "serve", "--ssl-cert", "secrets/cert.crt", "--ssl-key", "secrets/key.pem", "-s", "build"]
