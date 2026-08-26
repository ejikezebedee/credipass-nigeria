import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta: { correlationId: string; timestamp: string };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccess<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccess<T>> {
    const request = context.switchToHttp().getRequest<Request & { correlationId: string }>();
    return next.handle().pipe(map((data) => ({
      success: true as const,
      data,
      meta: { correlationId: request.correlationId, timestamp: new Date().toISOString() }
    })));
  }
}
