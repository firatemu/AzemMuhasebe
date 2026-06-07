import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma.service';
import { buildTenantWhereClause } from '../../../common/utils/staging.util';

/**
 * Ödeme planı taksitlerini güncelleme servisi
 * Tahsilat yapıldığında taksitleri otomatik "ödendi" işaretler
 */
@Injectable()
export class PaymentPlanHelperService {
  constructor(private prisma: PrismaService) {}

  /**
   * Fatura için ödeme planı taksitlerini günceller
   * FIFO mantığıyla: vade tarihi eski olan taksitten başlar
   *
   * @param invoiceId Fatura ID
   * @param paymentAmount Ödenen tutar
   * @param tenantId Tenant ID
   * @param prisma Transaction client (opsiyonel)
   * @returns Güncelleme sonuçları
   */
  async markInstallmentsAsPaid(
    invoiceId: string,
    paymentAmount: number,
    tenantId: string,
    prisma?: any,
  ) {
    const tx = prisma || this.prisma;

    // Ödenmemiş taksitleri getir (vade tarihine göre sıralı - FIFO)
    const paymentPlans = await tx.invoicePaymentPlan.findMany({
      where: {
        invoiceId,
        isPaid: false,
        ...buildTenantWhereClause(tenantId ?? undefined),
      },
      orderBy: { dueDate: 'asc' },
    });

    if (paymentPlans.length === 0) {
      // Ödeme planı yok, işlem yapma
      return {
        markedCount: 0,
        remainingAmount: paymentAmount,
        totalAmount: paymentAmount,
      };
    }

    let remainingAmount = paymentAmount;
    let markedCount = 0;

    for (const plan of paymentPlans) {
      if (remainingAmount <= 0.01) break; // 1 kuruş tolerans

      const planAmount = Number(plan.amount);

      // Taksit tamamen ödenebiliyor
      if (remainingAmount >= planAmount - 0.01) {
        await tx.invoicePaymentPlan.update({
          where: { id: plan.id },
          data: { isPaid: true },
        });
        remainingAmount -= planAmount;
        markedCount++;
      } else {
        // Kısmi ödeme desteği: Taksiti ödendi say, kalan tutar sonraki taksitten düşer
        // NOT: Şimdilik sadece tam ödeme desteği var
        break;
      }
    }

    // Kalan tutarı sonraki taksitten düş (kısmi ödeme senaryosu)
    if (remainingAmount > 0.01 && paymentPlans.length > markedCount) {
      // Kalan tutarı bir sonraki taksitin amount'ından çıkar
      // Bu kısım ileriki bir sürümde eklenebilir
      // Şimdilik kalan tutar bos gider
    }

    return {
      markedCount,
      remainingAmount,
      totalAmount: paymentAmount,
    };
  }
}
