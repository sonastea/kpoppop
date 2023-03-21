import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as firebase from 'firebase-admin';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import { RedisIoAdapter } from './sockets/redis.adapter';
import { prismaSessionStore } from './store/prisma-session-store';

dotenv.config();

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function whatMode() {
  Logger.log(`Running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
}

export const cookie: expressSession.CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
  domain: process.env.NODE_ENV === 'production' ? '.kpoppop.com' : null,
  sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
};

async function bootstrap() {
  // Firebase Initialization
  const serviceAccount = require('../firebaseCredentials.json');
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: `gs://${process.env.STORAGE_BUCKET}/`,
  });

  const httpsOptions = {
    key: fs.readFileSync(path.resolve('./secrets/private-key.pem')),
    cert: fs.readFileSync(path.resolve('./secrets/public-certificate.pem')),
  };

  const sessionOptions = {
    cookie,
    resave: false,
    saveUninitialized: false,
    store: prismaSessionStore,
    secret: process.env.SESSION_SECRET_KEY,
  };

  if (process.env.NODE_ENV === 'production') {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: ['https://kpoppop.com', /\.kpoppop\.com$/],
        credentials: true,
      },
      httpsOptions,
    });
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();

    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(expressSession(sessionOptions));
    app.useWebSocketAdapter(redisIoAdapter);

    app.enableShutdownHooks();
    await app.listen(process.env.PORT, () => whatMode());
  } else {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: true,
        credentials: true,
      },
      httpsOptions,
    });
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();

    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(expressSession(sessionOptions));
    app.useWebSocketAdapter(redisIoAdapter);

    app.enableShutdownHooks();
    await app.listen(process.env.PORT, () => whatMode());
  }
}
bootstrap();
