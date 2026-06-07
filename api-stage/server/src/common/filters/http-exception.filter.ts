import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ErrorResponseDto } from '../dto/error-response.dto';

/**
 * HttpException Filter
 * Handles all HttpException instances (4xx and 5xx errors)
 * This is the innermost filter - most specific exception handling
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get or generate request ID
    const requestId =
      (request.headers['x-request-id'] as string) ||
      (request.headers['X-Request-ID'] as string) ||
      uuidv4();

    // Extract status code
    const status = exception.getStatus();

    // Detect ForbiddenException by name or status
    const isForbidden = status === 403;

    // Extract message from exception
    const exceptionResponse = exception.getResponse();
    let message = 'An error occurred';
    let details: any = undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || responseObj.error || message;

      // If it's a validation error with multiple messages
      if (responseObj.errors && Array.isArray(responseObj.errors)) {
        message = responseObj.message || 'Validation failed';
      }

      // Preserve additional details (e.g., risk limit excess amount)
      if (responseObj.details) {
        details = responseObj.details;
      }

      // Preserve error code for frontend handling
      if (responseObj.error && typeof responseObj.error === 'string' && responseObj.error !== 'BAD_REQUEST') {
        details = details || {};
        details.errorCode = responseObj.error;
      }

      // Enrich ForbiddenException with code: 'FORBIDDEN'
      if (isForbidden) {
        details = details || {};
        details.code = 'FORBIDDEN';
      }
    }

    // Extract tenant ID from request for logging
    const tenantId = (request as any).tenantId || 'unknown';
    const userId = (request as any).userId || 'unknown';

    // Build error response
    const errorResponse: any = {
      success: false,
      statusCode: status,
      error: this.getHttpStatusName(status),
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    // Include details if available (e.g., risk limit excess amount)
    if (details) {
      errorResponse.details = details;
    }

    // Log based on status code
    if (status >= 500) {
      // Server errors - log with error level
      this.logger.error(
        `[HTTP ${status}] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | ${message}`,
      );
    } else if (status >= 400) {
      // Client errors - log with warn level
      this.logger.warn(
        `[HTTP ${status}] ${request.method} ${request.url} | tenant:${tenantId} | user:${userId} | reqId:${requestId} | ${message}`,
      );
    }

    // Never expose stack traces
    response.status(status).json(errorResponse);
  }

  /**
   * Get HTTP status name from status code
   * @param status - HTTP status code
   * @returns Status name (e.g., "NOT_FOUND", "CONFLICT")
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