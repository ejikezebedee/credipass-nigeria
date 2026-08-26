import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns stable process health data', async () => {
    const module = await Test.createTestingModule({ controllers: [HealthController] }).compile();
    expect(module.get(HealthController).health()).toEqual({ status: 'ok', service: 'credipass-api', version: '0.1.0' });
  });
});
