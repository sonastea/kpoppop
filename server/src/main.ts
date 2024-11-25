import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import type { CookieOptions, SessionOptions } from 'express-session';
import * as expressSession from 'express-session';
import * as firebase from 'firebase-admin';
import * as fs from 'fs';
import * as passport from 'passport';
import * as path from 'path';
import { AppModule } from './app.module';
import { MyLogger } from './logger/my-logger.service';
import { prismaSessionStore } from './store/prisma-session-store';

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function whatMode(logger: MyLogger) {
  logger.log(`Running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
}

export const cookie: CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
  domain: process.env.NODE_ENV === 'production' ? '.kpoppop.com' : null,
  sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
};

const sessionOpts: SessionOptions = {
  resave: false,
  saveUninitialized: false,
  store: prismaSessionStore,
  secret: process.env.SESSION_SECRET_KEY,
};

const httpsOptions = {
  key: fs.readFileSync(path.resolve('./secrets/key.pem')),
  cert: fs.readFileSync(path.resolve('./secrets/cert.pem')),
};

const sessionOptions = {
  cookie,
  ...sessionOpts,
};

async function configureApp(options: {
  cors: { origin: boolean | (string | RegExp)[]; credentials: boolean };
}) {
  const app = await NestFactory.create(AppModule, {
    cors: options.cors,
    httpsOptions: httpsOptions,
    bufferLogs: true,
  });

  const logger = app.get(MyLogger);

  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.useLogger(logger);
  app.use(compression());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(expressSession(sessionOptions));
  app.enableShutdownHooks();

  return app;
}

async function bootstrap() {
  // Firebase Initialization
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const serviceAccount = require('../firebaseCredentials.json');
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: `gs://${process.env.STORAGE_BUCKET}/`,
  });

  if (process.env.NODE_ENV === 'production') {
    const app = await configureApp({
      cors: {
        origin: ['https://kpoppop.com', /\.kpoppop\.com$/],
        credentials: true,
      },
    });

    await app.listen(process.env.PORT, () => whatMode(app.get(MyLogger)));
  } else {
    const app = await configureApp({
      cors: {
        origin: true,
        credentials: true,
      },
    });

    await app.listen(process.env.PORT, () => whatMode(app.get(MyLogger)));
  }
}
bootstrap();
