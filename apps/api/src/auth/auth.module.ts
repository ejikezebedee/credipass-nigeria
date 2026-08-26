import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AUTH_STORE } from './auth.store';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { PrismaAuthStore } from './prisma-auth.store';

@Module({
  imports: [ConfigModule, InfrastructureModule, JwtModule.registerAsync({ inject: [ConfigService], useFactory: (config: ConfigService) => ({ secret: config.getOrThrow<string>('JWT_ACCESS_SECRET') }) })],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenGuard, PrismaAuthStore, { provide: AUTH_STORE, useExisting: PrismaAuthStore }],
  exports: [AuthService, AUTH_STORE]
})
export class AuthModule {}
