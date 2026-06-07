import { TenantResolverService } from '../../common/services/tenant-resolver.service';
/**
 * KpiService — CEO Dashboard KPI Hesaplama ve SSE Yayını
 *
 * Invoice/iş emri event'leri gelince KPI'ları yeniden hesaplar,
 * Redis'e cache'ler ve SSE ile push eder.
 *
 * Büyük avantaj: CEO endpoint'i SELECT hesabı yapmaz,
 * sadece Redis'ten okur. O(1) response time.
 */

import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@/common/services/redis.service';
import { PrismaService } from '@/common/prisma.service';
import { SseService } from '@/common/sse/sse.service';

export interface KpiSnapshot {
    netCash: number;
    openReceivables: number;
    openPayables: number;
    bankBalance: number;
    activeWorkOrders: number;
    readyForDelivery: number;
    _computedAt: string;
}

@Injectable()
export class KpiService {
    private readonly logger = new Logger(KpiService.name);
    private readonly CACHE_TTL_SECONDS = 300; // 5 dakika

    constructor(private readonly prisma: PrismaService,
        private readonly sseService: SseService,
        private readonly redis: RedisService, private readonly tenantResolver: TenantResolverService) { }

    /**
     * KPI'ları Redis'ten oku (O(1), DB'ye gitme).
     * Cache yoksa hesapla.
     */
    async getKpis(tenantId: string): Promise<KpiSnapshot> {
        const cached = await this.redis.getForTenant('kpi', tenantId);
        if (cached) return JSON.parse(cached);

        // Cache miss: hesapla ve cache'le
        return this.recomputeAndEmit(tenantId);
    }

    /**
     * KPI'ları DB'den yeniden hesapla, Redis'e yaz, SSE ile push et.
     * Event listener'lardan çağrılır (iş emri tamamlandı, fatura kesildi, vb.)
     */
    async recomputeAndEmit(tenantId: string): Promise<KpiSnapshot> {
        try {
            const [receivables, payables, bankBalance, activeWO, readyWO] =
                await Promise.all([
                    this.prisma.invoice.aggregate({
                        where: { tenantId, invoiceType: 'SALE', status: { in: ['OPEN', 'PARTIALLY_PAID'] } },
                        _sum: { grandTotal: true },
                    }),
                    this.prisma.invoice.aggregate({
                        where: { tenantId, invoiceType: 'PURCHASE', status: { in: ['OPEN', 'PARTIALLY_PAID'] } },
                        _sum: { grandTotal: true },
                    }),
                    this.prisma.bankAccount.aggregate({
                        where: { bank: { tenantId }, isActive: true },
                        _sum: { balance: true },
                    }).catch(() => ({ _sum: { balance: 0 } })),
                    this.prisma.workOrder.count({
                        where: { tenantId, status: { notIn: ['INVOICED_CLOSED', 'CLOSED_WITHOUT_INVOICE', 'CANCELLED'] } },
                    }),
                    this.prisma.workOrder.count({
                        where: { tenantId, status: 'VEHICLE_READY' },
                    }),
                ]);

            const openReceivables = Number(receivables._sum?.grandTotal ?? 0);
            const openPayables = Number(payables._sum?.grandTotal ?? 0);
            const bank = Number((bankBalance as any)._sum?.balance ?? 0);

            const kpi: KpiSnapshot = {
                netCash: bank + openReceivables - openPayables,
                openReceivables,
                openPayables,
                bankBalance: bank,
                activeWorkOrders: activeWO,
                readyForDelivery: readyWO,
                _computedAt: new Date().toISOString(),
            };

            // Redis'e yaz
            await this.redis.setForTenant('kpi', JSON.stringify(kpi), this.CACHE_TTL_SECONDS, tenantId);

            // SSE ile CEO'ya push et
            this.sseService.emit(tenantId, 'KPI_UPDATE', kpi as unknown as Record<string, unknown>);

            return kpi;
        } catch (err) {
            this.logger.error(`[KpiService] Recompute hatası (tenant: ${tenantId}):`, err);
            throw err;
        }
    }

    /**
     * KPI Cache'i manuel olarak geçersiz kıl.
     * Migration veya bulk işlemler sonrasında kullanılır.
     */
    async invalidateCache(tenantId: string) {
        await this.redis.delForTenant('kpi', tenantId);
        this.logger.log(`[KpiService] Cache temizlendi: ${tenantId}`);
    }

    /**
     * Mevcut aydan geriye dönük 6 aylık Nakit Akışı trendini (Gelir/Gider) hesaplar
     * Cache TTL 1 saat.
     */
    async getCashTrend(tenantId: string) {
        const cached = await this.redis.getForTenant('cash-trend', tenantId);
        if (cached) return JSON.parse(cached);

        const today = new Date();
        const trend: Array<{ month: string; gelir: number; gider: number }> = [];
        const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

            const [gelirRes, giderRes] = await Promise.all([
                this.prisma.invoice.aggregate({
                    where: { tenantId, invoiceType: 'SALE', status: { not: 'CANCELLED' as any }, date: { gte: startDate, lte: endDate } },
                    _sum: { grandTotal: true },
                }),
                this.prisma.invoice.aggregate({
                    where: { tenantId, invoiceType: 'PURCHASE', status: { not: 'CANCELLED' as any }, date: { gte: startDate, lte: endDate } },
                    _sum: { grandTotal: true },
                })
            ]);

            trend.push({
                month: monthNames[date.getMonth()],
                gelir: Number(gelirRes._sum?.grandTotal ?? 0),
                gider: Number(giderRes._sum?.grandTotal ?? 0),
            });
        }

        await this.redis.setForTenant('cash-trend', JSON.stringify(trend), 3600, tenantId); // 1 saat
        return trend;
    }
}
