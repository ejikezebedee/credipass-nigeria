import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createOpenApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('CrediPass Nigeria API')
    .setDescription('Consent-led credit passport infrastructure. Sprint 0 contract only.')
    .setVersion('0.1.0')
    .addServer('http://localhost:3000', 'Local development')
    .build();
  return SwaggerModule.createDocument(app, config, { operationIdFactory: (_controller, method) => method });
}
