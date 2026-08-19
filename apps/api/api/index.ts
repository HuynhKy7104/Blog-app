/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import type { Express } from 'express';

let expressApp: Express;

async function bootstrap(): Promise<Express> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async (req: any, res: any) => {
  expressApp = expressApp ?? (await bootstrap());
  return expressApp(req, res);
};
