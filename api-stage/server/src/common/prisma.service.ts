import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from './services/tenant-context.service';
import { ClsService } from './services/cls.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Connection pool optimizasyonları - 51 bağlantı sorununu çözmek için
    // DATABASE_URL'e connection_limit ve pool_timeout parametreleri eklenmeli
    // Örnek: postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20
    const databaseUrl = process.env.DATABASE_URL || '';

    // Eğer DATABASE_URL'de connection pool parametreleri yoksa ekle
    let optimizedUrl = databaseUrl;
    if (databaseUrl && !databaseUrl.includes('connection_limit')) {
      const separator = databaseUrl.includes('?') ? '&' : '?';
      optimizedUrl = `${databaseUrl}${separator}connection_limit=10&pool_timeout=20&connect_timeout=10`;
    }

    super({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: optimizedUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Staging/Production için tenant isolation ve soft-delete desteği sunan genişletilmiş client.
   * CekSenet, BaseRepository vb. bu property üzerinden işlem yapar.
   * 
   * RLS Desteği: Her operation öncesi PostgreSQL `app.current_tenant_id` setting'ini set eder.
   * Bu, Phase 3'te eklenen Row Level Security policy'leri ile çalışır.
   */
  get extended() {
    const prisma = this;
    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            // RLS için tenant context'i PostgreSQL'e set et
            const tenantId = ClsService.getTenantId();

            if (!tenantId) {
              // Tenant context yoksa RLS sorguları bloke edecek
              // Log atarak uyar (production'da monitoring için)
              console.warn(`[RLS] No tenant context for ${model}.${operation}, RLS will block queries`);
            } else {
              // SET LOCAL yerine set_config kullanıyoruz çünkü:
              // 1. SET LOCAL sadece transaction içinde çalışır
              // 2. Prisma'nın normal sorguları transaction içinde değil
              // 3. set_config session boyunca kalır ve transaction dışında da çalışır
              await prisma.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, false)`;
            }

            return query(args);
          },
        },
      },
    });
  }
}