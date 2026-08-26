import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw = exception instanceof HttpException ? exception.getResponse() : undefined;
    const message = typeof raw === 'string' ? raw : (raw && typeof raw === 'object' && 'message' in raw ? (raw as { message: string | string[] }).message : 'Internal server error');
    response.status(status).json({
      success: false,
      error: { code: exception instanceof HttpException ? exception.name : 'InternalServerError', message },
      meta: { correlationId: request.correlationId, timestamp: new Date().toISOString(), path: request.url }
    });
  }
}
