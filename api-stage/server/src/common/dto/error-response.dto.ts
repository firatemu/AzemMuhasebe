import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

/**
 * Standardized error response shape for all API endpoints
 * Ensures consistent error responses across the entire application
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Always false for error responses',
    example: false,
  })
  success: false;

  @ApiProperty({
    description: 'HTTP status code',
    example: HttpStatus.NOT_FOUND,
  })
  statusCode: number;

  @ApiProperty({
    description: 'HTTP status name (e.g., NOT_FOUND, CONFLICT)',
    example: 'NOT_FOUND',
  })
  error: string;

  @ApiProperty({
    description: 'Human-readable error message in Turkish',
    example: 'Invoice not found',
  })
  message: string;

  @ApiProperty({
    description: 'ISO 8601 timestamp',
    example: '2026-03-13T23:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/invoices/123',
  })
  path: string;

  @ApiProperty({
    description: 'Unique request ID for tracing',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  requestId: string;

  @ApiProperty({
    description: 'Additional error details (e.g., risk limit excess amount)',
    example: { excessAmount: 5000, creditLimit: 10000 },
    required: false,
  })
  details?: Record<string, any>;
}