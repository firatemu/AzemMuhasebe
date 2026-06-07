import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';

/**
 * Timeout Decorator - Metadata key for custom timeout value
 */
export const TIMEOUT_KEY = 'timeout';
export const Timeout = (ms: number) =>
  // @ts-ignore - decorator metadata
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(TIMEOUT_KEY, ms, descriptor.value);
    return descriptor;
  };

/**
 * Timeout Interceptor
 * Prevents hanging requests with configurable timeout
 * Default timeout: 30 seconds
 * Can be overridden per endpoint with @Timeout decorator
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check for custom timeout from decorator
    const customTimeout = this.reflector.get<number>(
      TIMEOUT_KEY,
      context.getHandler(),
    );

    // Use custom timeout or default (30 seconds)
    const timeoutMs = customTimeout || 30000;

    return next.handle().pipe(
      timeout(timeoutMs),
      catchError((err) => {
        if (!err) {
          return throwError(() => new Error('Unknown timeout error'));
        }
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                'İstek zaman aşımına uğradı',
              ),
          );
        }
        // Re-throw other errors
        return throwError(() => err);
      }),
    );
  }
}