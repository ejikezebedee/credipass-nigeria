import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApplication } from './bootstrap';
import { createOpenApiDocument } from './common/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApplication(app);
  SwaggerModule.setup('docs', app, createOpenApiDocument(app));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
