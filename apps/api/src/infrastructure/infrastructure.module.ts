import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [BullModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({ connection: { url: config.getOrThrow<string>('REDIS_URL') } })
  })],
  providers: [PrismaService],
  exports: [PrismaService, BullModule]
})
export class InfrastructureModule {}
