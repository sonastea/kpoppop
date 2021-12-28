import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as firebase from 'firebase-admin';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  // Firebase Initialization
  const serviceAccount = require('../firebaseCredentials.json');
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: 'gs://images.kpoppop.com/',
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT);
}
bootstrap();
