import 'reflect-metadata';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { configureApplication } from './bootstrap';
import { createOpenApiDocument } from './common/swagger';

async function generate() {
  process.env.NODE_ENV ??= 'test';
  process.env.DATABASE_URL ??= 'postgresql://contract:contract@localhost:5432/contract?schema=public';
  process.env.REDIS_URL ??= 'redis://localhost:6379';
  process.env.JWT_ACCESS_SECRET ??= 'contract-generation-secret-at-least-32-chars';
  process.env.JWT_ACCESS_TTL ??= '15m';
  process.env.REFRESH_TOKEN_TTL_SECONDS ??= '2592000';
  const { AppModule } = await import('./app.module');
  const app = await NestFactory.create(AppModule, { logger: false, abortOnError: false });
  configureApplication(app);
  await app.init();
  const output = resolve(__dirname, '../../../docs/openapi.json');
  await writeFile(output, `${JSON.stringify(createOpenApiDocument(app), null, 2)}\n`);
  await app.close();
}
void generate().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
