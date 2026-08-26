import { HttpException, HttpStatus } from '@nestjs/common';

export enum AuthErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  EMAIL_UNAVAILABLE = 'AUTH_EMAIL_UNAVAILABLE',
  TOKEN_REQUIRED = 'AUTH_TOKEN_REQUIRED',
  TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  SESSION_INVALID = 'AUTH_SESSION_INVALID',
  SESSION_REVOKED = 'AUTH_SESSION_REVOKED'
}

export class AppException extends HttpException {
  constructor(public readonly errorCode: string, message: string, status: HttpStatus) {
    super({ code: errorCode, message }, status);
  }
}
