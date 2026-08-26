import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppException, AuthErrorCode } from '../../common/app.exception';
import { AccessPrincipal } from '../auth.types';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly config: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const [scheme, token] = request.header('authorization')?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) throw new AppException(AuthErrorCode.TOKEN_REQUIRED, 'Authentication is required.', HttpStatus.UNAUTHORIZED);
    try {
      request.auth = await this.jwt.verifyAsync<AccessPrincipal>(token, { secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET') });
      return true;
    } catch { throw new AppException(AuthErrorCode.TOKEN_INVALID, 'Authentication token is invalid or expired.', HttpStatus.UNAUTHORIZED); }
  }
}

declare global { namespace Express { interface Request { auth: AccessPrincipal; } } }
