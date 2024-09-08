FROM node:20-alpine

WORKDIR /app

ARG NODE_ENV

ENV BROWSER=none
ENV NODE_ENV=${NODE_ENV:-development}
ENV PORT=${PORT:-5000}

RUN npm install -g pnpm@9.9

COPY package.json pnpm-lock.yaml .env .env.${NODE_ENV} ./

RUN pnpm install

COPY . .

EXPOSE $PORT

CMD ["pnpm", "start", "--host"]
