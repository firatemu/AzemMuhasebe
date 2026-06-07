import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ErrorResponseDto } from '../dto/error-response.dto';

/**
 * All Exceptions Filter
 * Catch-all filter for unexpected errors (last line of defense)
 * This is the outermost filter - catches what other filters don't handle
 * 
 * Priority order:
 * 1. Check if it's a Prisma error → delegate to prisma filter logic
 * 2. Check if it's an HttpException → delegate to http filter logic
 * 3. Check if it's an Axios error → handle external API failures
 * 4. Everything else → 500 Internal Server Error
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get or generate request ID
    const requestId =
      (request.headers['x-request-id'] as string) ||
      (request.headers['X-Request-ID'] as string) ||
      uuidv4();

    // Extract tenant ID for logging
    const tenantId = (request as any).tenantId || 'unknown';
    const userId = (request as any).userId || 'unknown';

    // Handle different error types
    if (this.isPrismaError(exception)) {
      // Prisma errors should be handled by PrismaExceptionFilter
      // But since this is catch-all, we handle it here as fallback
      return this.handlePrismaError(exception, request, response, tenantId, userId, requestId);
    }

    if (this.isHttpException(exception)) {
      // HttpException should be handled by HttpExceptionFilter
      // But we handle it here as fallback
      return this.handleHttpException(exception, request, response, tenantId, userId, requestId);
    }

    if (this.isAxiosError(exception)) {
      // External API failures (Iyzico, GİB, etc.)
      return this.handleAxiosError(
        exception as AxiosError,
        request,
        response,
        tenantId,
        userId,
        requestId,
      );
    }

    // Unknown/Unexpected errors
    return this.handleUnknownError(exception, request, response, tenantId, userId, requestId);
  }

  /**
   * Check if exception is a Prisma error
   */
  private isPrismaError(exception: unknown): boolean {
    return (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientRustPanicError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientValidationError
    );
  }

  /**
   * Check if exception is an HttpException
   */
  private isHttpException(exception: unknown): exception is { getStatus: () => number; getResponse: () => any } {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'getStatus' in exception &&
      'getResponse' in exception
    );
  }

  /**
   * Check if exception is an Axios error
   */
  private isAxiosError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'isAxiosError' in exception
    );
  }

  /**
   * Handle Prisma errors (fallback handler)
   */
  private handlePrismaError(
    exception: unknown,
    request: Request,
    response: Response,
    tenantId: string,
    userId: string,
    requestId: string,
  ): void {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Veritabanı işlemi başarısız';

    this.logger.error(
      `[PRISMA FALLBACK] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    const errorResponse: ErrorResponseDto = {
      success: false,
      statusCode: status,
      error: 'INTERNAL_SERVER_ERROR',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Handle HttpException (fallback handler)
   */
  private handleHttpException(
    exception: { getStatus: () => number; getResponse: () => any },
    request: Request,
    response: Response,
    tenantId: string,
    userId: string,
    requestId: string,
  ): void {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    let message = 'An error occurred';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || responseObj.error || message;
    }

    const logLevel = status >= 500 ? 'error' : 'warn';
    if (logLevel === 'error') {
      this.logger.error(
        `[HTTP FALLBACK] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | ${message}`,
      );
    } else {
      this.logger.warn(
        `[HTTP FALLBACK] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | ${message}`,
      );
    }

    const errorResponse: ErrorResponseDto = {
      success: false,
      statusCode: status,
      error: this.getHttpStatusName(status),
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Handle Axios errors (external API failures)
   */
  private handleAxiosError(
    exception: AxiosError,
    request: Request,
    response: Response,
    tenantId: string,
    userId: string,
    requestId: string,
  ): void {
    const status = HttpStatus.BAD_GATEWAY;
    let message = 'Harici serviste bir hata oluştu';

    // Check if it's a specific external service
    const url = exception.config?.url || '';

    // Iyzico payment errors
    if (url.includes('iyzico') || url.includes('payment')) {
      if (exception.response?.status === 402) {
        return this.handleIyzicoPaymentError(exception, request, response, tenantId, userId, requestId);
      }
      return this.handleIyzicoError(exception, request, response, tenantId, userId, requestId);
    }

    // GİB e-fatura SOAP errors
    if (url.includes('gib') || url.includes('efatura') || url.includes('e-fatura')) {
      return this.handleGibError(exception, request, response, tenantId, userId, requestId);
    }

    // Generic external API error
    this.logger.error(
      `[EXTERNAL API] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | External API failed: ${url} | ${exception.message}`,
      exception.stack,
    );

    const errorResponse: ErrorResponseDto = {
      success: false,
      statusCode: status,
      error: 'BAD_GATEWAY',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Handle Iyzico payment errors
   */
  private handleIyzicoPaymentError(
    exception: AxiosError,
    request: Request,
    response: Response,
    tenantId: string,
    userId: string,
    requestId: string,
  ): void {
    const status = HttpStatus.PAYMENT_REQUIRED;
    const data = exception.response?.data as Record<string, unknown> | undefined;
    const msgFromData =
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : undefined;
    const message = msgFromData || 'Ödeme işlemi başarısız';

    this.logger.error(
      `[IYZICO] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | Payment failed: ${message}`,
      exception.stack,
    );

    const errorResponse: ErrorResponseDto = {
      success: false,
      statusCode: status,
      error: 'PAYMENT_REQUIRED',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Handle other Iyzico errors
   */
  private handleIyzicoError(
    exception: AxiosError,
    request: Request,
    response: Response,
    tenantId: string,
    userId: string,
    requestId: string,
  ): void {
    const status = HttpStatus.BAD_GATEWAY;
    const message = 'Ödeme servisi şu an kullanılamıyor';

    this.logger.error(
      `[IYZICO] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | Iyzico service unavailable`,
      exception.stack,
    );

    const errorResponse: ErrorResponseDto = {
      success: false,
      statusCode: status,
      error: 'BAD_GATEWAY',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Handle GİB e-fatura SOAP errors
   */
  private handleGibError(
    exception: AxiosError,
    request: Request,
    response: Response,
    tenantId: string,
    userId: string,
    requestId: string,
  ): void {
    const status = HttpStatus.BAD_GATEWAY;
    const message = 'E-fatura servisi şu an kullanılamıyor';

    this.logger.error(
      `[GİB EFATURA] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | E-fatura service unavailable`,
      exception.stack,
    );

    const errorResponse: ErrorResponseDto = {
      success: false,
      statusCode: status,
      error: 'BAD_GATEWAY',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Handle unknown/unexpected errors
   */
  private handleUnknownError(
    exception: unknown,
    request: Request,
    response: Response,
    tenantId: string,
    userId: string,
    requestId: string,
  ): void {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Beklenmeyen bir hata oluştu';

    const errorMessage = exception instanceof Error ? exception.message : String(exception);
    const stackTrace = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(
      `[UNEXPECTED ERROR] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | ${errorMessage}`,
      stackTrace || 'No stack trace available',
    );

    const errorResponse: ErrorResponseDto = {
      success: false,
      statusCode: status,
      error: 'INTERNAL_SERVER_ERROR',
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Get HTTP status name from status code
   */
  private getHttpStatusName(status: number): string {
    const statusNames: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      402: 'PAYMENT_REQUIRED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      408: 'REQUEST_TIMEOUT',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT',
    };

    return statusNames[status] || 'ERROR';
  }
}