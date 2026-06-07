import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { TenantContextService } from '../services/tenant-context.service';
import { JwtPayload } from '../../modules/auth/strategies/jwt.strategy';
import { ClsService } from '../services/cls.service';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      userId?: string;
      jwtPayload?: JwtPayload & { user?: any };
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private cachedStagingDefaultTenantId: string | null | undefined = undefined;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private tenantContext: TenantContextService,
  ) {}

  private async getStagingDefaultTenantId(): Promise<string | null> {
    if (this.cachedStagingDefaultTenantId !== undefined) {
      return this.cachedStagingDefaultTenantId;
    }

    try {
      const parameter = await this.prisma.systemParameter.findFirst({
        where: {
          key: 'STAGING_DEFAULT_TENANT_ID',
          tenantId: null,
        },
      });

      if (parameter?.value != null) {
        const v = parameter.value;
        const id =
          typeof v === 'string' ? v : (v as any)?.id ?? (v as any)?.value;
        if (typeof id === 'string' && id.length > 0) {
          this.cachedStagingDefaultTenantId = id;
          return id;
        }
      }
    } catch (error) {
      console.warn(
        '[TenantMiddleware] SystemParameter okuma hatası, fallback kullanılıyor:',
        error,
      );
    }

    const fallbackId = process.env.STAGING_DEFAULT_TENANT_ID || null;
    if (fallbackId) {
      this.cachedStagingDefaultTenantId = fallbackId;
      return fallbackId;
    }

    try {
      const first = await this.prisma.tenant.findFirst({
        where: { status: 'ACTIVE' },
        select: { id: true },
      });
      if (first?.id) {
        this.cachedStagingDefaultTenantId = first.id;
        return first.id;
      }
    } catch {
      /* ignore */
    }

    this.cachedStagingDefaultTenantId = null;
    return null;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (
      req.originalUrl === '/api/auth/login' ||
      req.originalUrl === '/api/auth/register'
    ) {
      return next();
    }

    ClsService.run(async () => {
      try {
        await this.handleRequest(req);

        if (req.tenantId) {
          ClsService.setTenantId(req.tenantId);
        }
        if (req.userId) {
          ClsService.set('userId', req.userId);
        }

        next();
      } catch (error) {
        console.error('[TenantMiddleware] Error:', error);
        next(error);
      }
    });
  }

  private async handleRequest(req: Request) {
    let tenantIdFromHeader = req.headers['x-tenant-id'] as string;
    if (!tenantIdFromHeader) {
      tenantIdFromHeader =
        ((req.headers as any)['X-Tenant-Id'] as string) ||
        (req.headers['tenant-id'] as string) ||
        ((req.headers as any)['Tenant-Id'] as string);
    }

    const nodeEnv = process.env.NODE_ENV;
    const isStaging =
      nodeEnv === 'staging' ||
      nodeEnv === 'development' ||
      process.env.STAGING_DISABLE_TENANT === 'true';
    const stagingDefaultTenantId = await this.getStagingDefaultTenantId();

    const authHeader = req.headers.authorization;
    let jwtPayload: JwtPayload | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        jwtPayload = this.jwtService.verify<JwtPayload>(token, {
          secret:
            process.env.JWT_ACCESS_SECRET ||
            process.env.JWT_SECRET ||
            'secret',
        });
        req.userId = jwtPayload.sub;
        req.tenantId = jwtPayload.tenantId;
        req.jwtPayload = jwtPayload;
      } catch {
        /* invalid token — guest */
      }
    }

    if (req.tenantId && isStaging) {
      const tenantExists = await this.prisma.tenant.findUnique({
        where: { id: req.tenantId },
        select: { id: true },
      });
      if (!tenantExists) {
        console.warn(
          `[TenantMiddleware] Invalid tenantId: ${req.tenantId}, clearing.`,
        );
        req.tenantId = undefined;
      }
    }

    if (jwtPayload?.sub) {
      const user = await this.prisma.user.findUnique({
        where: { id: jwtPayload.sub },
        include: { tenant: true },
      });

      if (user) {
        const userRole = user.role?.toString() || user.role;
        const isSuperAdmin =
          userRole === 'SUPER_ADMIN' ||
          userRole === 'SuperAdmin' ||
          userRole.toLowerCase() === 'super_admin';

        this.tenantContext.setUserRole(userRole as string);

        if (isSuperAdmin) {
          this.tenantContext.setUserRole('SUPER_ADMIN');
          if (user.tenantId) {
            req.tenantId = user.tenantId;
            this.tenantContext.setTenant(user.tenantId, user.id);
          } else {
            req.tenantId = undefined;
          }
        } else if (user.tenantId) {
          req.tenantId = user.tenantId;
          this.tenantContext.setTenant(user.tenantId, user.id);
        }

        req.jwtPayload = { ...jwtPayload, user } as any;
      }
    }

    const isSuperAdminNow = this.tenantContext.isSuperAdmin();

    if (tenantIdFromHeader) {
      req.tenantId = tenantIdFromHeader;
      this.tenantContext.setTenant(
        tenantIdFromHeader,
        req.userId || 'header-user',
      );
    } else if (
      !req.tenantId &&
      !isSuperAdminNow &&
      isStaging &&
      stagingDefaultTenantId
    ) {
      req.tenantId = stagingDefaultTenantId;
      this.tenantContext.setTenant(
        stagingDefaultTenantId,
        req.userId || 'staging-default',
      );
    }
  }
}
