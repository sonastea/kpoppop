import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as firebase from 'firebase-admin';
import * as fs from 'fs';
import * as passport from 'passport';
import * as path from 'path';
import { AppModule } from './app.module';
import { MyLogger } from './logger/my-logger.service';
import { RedisIoAdapter } from './sockets/redis.adapter';
import { prismaSessionStore } from './store/prisma-session-store';

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function whatMode(logger: MyLogger) {
  logger.log(`Running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
}

export const cookie: session.CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
  domain: process.env.NODE_ENV === 'production' ? '.kpoppop.com' : null,
  sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
};

const sessionOpts: session.SessionOptions = {
  resave: false,
  saveUninitialized: false,
  store: prismaSessionStore,
  secret: process.env.SESSION_SECRET_KEY,
};

async function bootstrap() {
  // Firebase Initialization
  const serviceAccount = require('../firebaseCredentials.json');
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: `gs://${process.env.STORAGE_BUCKET}/`,
  });

  const httpsOptions = {
    key: fs.readFileSync(path.resolve('./secrets/key.pem')),
    cert: fs.readFileSync(path.resolve('./secrets/cert.pem')),
  };

  const sessionOptions = {
    cookie,
    ...sessionOpts,
  };

  if (process.env.NODE_ENV === 'production') {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: ['https://kpoppop.com', /\.kpoppop\.com$/],
        credentials: true,
      },
      httpsOptions,
      bufferLogs: true,
    });
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();

    const logger = app.get(MyLogger);

    app.setGlobalPrefix('api');
    app.useLogger(logger);
    app.use(compression());
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(session(sessionOptions));
    app.useWebSocketAdapter(redisIoAdapter);

    app.enableShutdownHooks();
    await app.listen(process.env.PORT, () => whatMode(logger));
  } else {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: true,
        credentials: true,
      },
      httpsOptions,
      bufferLogs: true,
    });
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();

    const logger = app.get(MyLogger);

    app.setGlobalPrefix('api');
    app.useLogger(logger);
    app.use(compression());
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(session(sessionOptions));
    app.useWebSocketAdapter(redisIoAdapter);

    app.enableShutdownHooks();
    await app.listen(process.env.PORT, () => whatMode(logger));
  }
}
bootstrap();
