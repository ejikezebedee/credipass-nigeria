import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApplication } from '../src/bootstrap';

describe('health endpoint', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    configureApplication(app);
    await app.init();
  });
  afterAll(() => app?.close());
  it('wraps health data and propagates correlation ID', async () => {
    const response = await request(app.getHttpServer()).get('/health').set('x-correlation-id', 'test-correlation-001').expect(200);
    expect(response.headers['x-correlation-id']).toBe('test-correlation-001');
    expect(response.body).toMatchObject({ success: true, data: { status: 'ok', service: 'credipass-api' }, meta: { correlationId: 'test-correlation-001' } });
  });
});
