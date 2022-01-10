import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as firebase from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

dotenv.config();

async function whatMode() {
  Logger.log(`Running in ${process.env.NODE_ENV} mode`);
}

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

  if (process.env.NODE_ENV === 'production') {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: true,
        credentials: true,
      },
      httpsOptions,
    });

    app.use(cookieParser());
    await app.listen(process.env.PORT, () => whatMode());
  } else {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: true,
        credentials: true,
      },
    });

    app.use(cookieParser());
    await app.listen(process.env.PORT, () => whatMode());

  }
}
bootstrap();
