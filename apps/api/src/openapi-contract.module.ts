import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';

// Contract generation deliberately excludes live infrastructure providers.
@Module({ controllers: [HealthController] })
export class ContractModule {}
