import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  AllExceptionsFilter,
  PrismaExceptionFilter,
  HttpExceptionFilter,
} from './common/filters';
import { LoggingInterceptor, TimeoutInterceptor } from './common/interceptors';
import helmet from 'helmet';
import compression = require('compression');

import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  // Proxy arkasında gerçek IP'yi almak için (Rate limit için kritik)
  app.set('trust proxy', 1);

  // Security Headers - Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // Response compression - Performans için
  app.use(compression());

  // CORS ayarları
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : [
      // Staging origins
      'https://staging.muhasebe.com',
      'https://staging-api.muhasebe.com',

      // Local development origins (all common ports)
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3010',
      'http://localhost:3011',
      'http://localhost:3020',
      'http://localhost:3021',
      'http://localhost:3022',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3010',
      'http://127.0.0.1:3011',
      'http://127.0.0.1:3020',
      'http://127.0.0.1:3021',
      'http://127.0.0.1:3022',
    ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (same-origin, mobile apps, server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Check if origin is in allowlist
      if (corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('🚫 CORS blocked origin:', origin);
        // ✅ FIX: Return false, not Error object
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'x-tenant-id',
      'X-Request-ID',
    ],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // ✅ FIX: 24 hours preflight cache
  });

  // ═══════════════════════════════════════════════════════════════
  // GLOBAL INTERCEPTORS
  // ═══════════════════════════════════════════════════════════════
  // Order matters: Interceptors are executed in LIFO order (Last In First Out)
  // So first registered interceptor runs first
  app.useGlobalInterceptors(
    new LoggingInterceptor(), // First: Log incoming requests
    // new TimeoutInterceptor(), // Second: Enforce timeout (TEMPORARILY DISABLED)
  );

  // ═══════════════════════════════════════════════════════════════
  // GLOBAL EXCEPTION FILTERS
  // ═══════════════════════════════════════════════════════════════
  // IMPORTANT: Filter registration order is OPPOSITE of interceptor order
  // Last registered filter = Outermost = First to catch exceptions
  // 
  // Execution flow:
  // 1. LoggingInterceptor (request)
  // 2. TimeoutInterceptor (request)
  // 3. Controller → Service → Database
  // 4. Exception thrown
  // 5. HttpExceptionFilter (most specific - catches 4xx/5xx)
  // 6. PrismaExceptionFilter (catches Prisma errors)
  // 7. AllExceptionsFilter (catch-all - last line of defense)
  // 8. TimeoutInterceptor (response)
  // 9. LoggingInterceptor (response)
  app.useGlobalFilters(
    new AllExceptionsFilter(),     // Outermost (last registered) - catches everything
    new PrismaExceptionFilter(),   // Catches Prisma before catch-all
    new HttpExceptionFilter(),     // Innermost (first registered) - most specific
  );

  // ═══════════════════════════════════════════════════════════════
  // GLOBAL VALIDATION PIPE
  // ═══════════════════════════════════════════════════════════════
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
        // Enable enum transformation
        enableCircularCheck: true,
        excludeExtraneousValues: false,
      },
      // Don't stop at first error - show all validation errors
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => {
          return {
            field: err.property,
            constraints: err.constraints,
            value: err.value,
          };
        });
        console.error('[ValidationPipe] Validation error:', formattedErrors);
        const { BadRequestException } = require('@nestjs/common');
        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger/OpenAPI Yapılandırması
  const config = new DocumentBuilder()
    .setTitle('Oto Muhasebe API')
    .setDescription('Oto Muhasebe ERP/SaaS API Dokümantasyonu')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('tenants')
    .addBearerAuth()
    .build();

  try {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
      jsonDocumentUrl: 'api-json',
    });
  } catch (err) {
    console.warn('⚠️ Swagger document creation skipped (e.g. circular enum):', err?.message || err);
  }

  // Static files serving - uploads klasörü için (Docker volume ile kalıcı)
  const express = require('express');
  const path = require('path');
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('📁 Created uploads directory:', uploadsDir);
    }
  } catch (err) {
    console.warn('⚠️ Could not ensure uploads directory:', err.message);
  }
  app.use('/api/uploads', express.static(uploadsDir));

  // Sabit port: 3020 (staging API portu)
  const port = process.env.PORT || 3020;
  await app.listen(port, '0.0.0.0'); // Tüm interface'lerde dinle

  console.log(
    `🚀 Yedek Parça Otomasyonu Backend çalışıyor: http://localhost:${port}`,
  );
  console.log(`📚 API Endpoint: http://localhost:${port}/api`);
}
bootstrap();