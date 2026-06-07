import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Logging Interceptor
 * Logs every request/response for observability
 * Provides structured JSON-friendly logs for monitoring
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Skip logging for health check endpoints
    if (this.shouldSkipLogging(request.path)) {
      return next.handle();
    }

    const startTime = Date.now();

    // Extract request metadata
    const method = request.method;
    const path = request.path;
    const tenantId = (request as any).tenantId || 'unknown';
    const userId = (request as any).userId || 'unknown';
    const requestId =
      (request.headers['x-request-id'] as string) ||
      (request.headers['X-Request-ID'] as string) ||
      'no-req-id';

    // Log incoming request
    this.logger.log(
      `[REQUEST] ${method} ${path} | tenant:${tenantId} | user:${userId} | reqId:${requestId}`,
    );

    // Log outgoing response
    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          const logLevel = this.getLogLevel(duration);
          const logMethod = logLevel === 'error' ? this.logger.error.bind(this.logger) :
                            logLevel === 'warn' ? this.logger.warn.bind(this.logger) :
                            this.logger.log.bind(this.logger);

          logMethod(
            `[RESPONSE] ${method} ${path} | ${statusCode} | ${duration}ms | tenant:${tenantId} | user:${userId} | reqId:${requestId}`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `[RESPONSE ERROR] ${method} ${path} | ${duration}ms | tenant:${tenantId} | user:${userId} | reqId:${requestId} | ${error.message}`,
          );
        },
      }),
    );
  }

  /**
   * Determine if logging should be skipped for this path
   * @param path - Request path
   * @returns true if logging should be skipped
   */
  private shouldSkipLogging(path: string): boolean {
    const skipPaths = ['/health', '/metrics', '/favicon.ico'];

    return skipPaths.some((skipPath) => path.startsWith(skipPath));
  }

  /**
   * Determine log level based on response time
   * @param duration - Response time in milliseconds
   * @returns Log level ('log', 'warn', or 'error')
   */
  private getLogLevel(duration: number): 'log' | 'warn' | 'error' {
    if (duration > 3000) {
      return 'error';
    } else if (duration > 1000) {
      return 'warn';
    }
    return 'log';
  }
}