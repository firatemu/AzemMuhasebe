import { BadRequestException } from '@nestjs/common';
import { CheckBillStatus, PortfolioType } from '@prisma/client';

/**
 * CREDIT (Alacak / Müşteri Çeki) portföyü için izin verilen durum geçişleri.
 * Alacak çekler tahsil edilir; ödeme YAPILMAZ.
 */
const CREDIT_TRANSITIONS: Record<string, CheckBillStatus[]> = {
  [CheckBillStatus.IN_PORTFOLIO]: [
    CheckBillStatus.SENT_TO_BANK, // Eski akış: bankaya tevdi
    CheckBillStatus.IN_BANK_COLLECTION, // Bankaya tahsilata ver
    CheckBillStatus.IN_BANK_GUARANTEE, // Bankaya teminata ver
    CheckBillStatus.ENDORSED, // Ciro et
    CheckBillStatus.COLLECTED, // Doğrudan tahsilat (nakit/banka)
    CheckBillStatus.RETURNED, // İade
    CheckBillStatus.CANCELLED, // İptal
    CheckBillStatus.GIVEN_TO_CUSTOMER, // Müşteriye ver (portföyden çıkış)
  ],
  [CheckBillStatus.SENT_TO_BANK]: [
    CheckBillStatus.DISCOUNTED,
    CheckBillStatus.COLLECTED,
    CheckBillStatus.WITHOUT_COVERAGE,
    CheckBillStatus.RETURNED,
    CheckBillStatus.PARTIAL_PAID,
  ],
  [CheckBillStatus.IN_BANK_COLLECTION]: [
    CheckBillStatus.COLLECTED,
    CheckBillStatus.WITHOUT_COVERAGE,
    CheckBillStatus.RETURNED,
    CheckBillStatus.PARTIAL_PAID,
  ],
  [CheckBillStatus.IN_BANK_GUARANTEE]: [
    CheckBillStatus.IN_PORTFOLIO,
    CheckBillStatus.RETURNED,
  ],
  [CheckBillStatus.ENDORSED]: [
    CheckBillStatus.ENDORSED,
    CheckBillStatus.COLLECTED,
    CheckBillStatus.RETURNED,
    CheckBillStatus.PROTESTED,
  ],
  [CheckBillStatus.PARTIAL_PAID]: [
    CheckBillStatus.PARTIAL_PAID,
    CheckBillStatus.COLLECTED,
    CheckBillStatus.RETURNED,
    CheckBillStatus.PROTESTED,
    CheckBillStatus.LEGAL_FOLLOWUP,
  ],
  [CheckBillStatus.DISCOUNTED]: [
    CheckBillStatus.COLLECTED,
    CheckBillStatus.RECOURSE,
  ],
  [CheckBillStatus.WITHOUT_COVERAGE]: [
    CheckBillStatus.PROTESTED,
    CheckBillStatus.RETURNED,
    CheckBillStatus.COLLECTED,
  ],
  [CheckBillStatus.PROTESTED]: [
    CheckBillStatus.LEGAL_FOLLOWUP,
    CheckBillStatus.COLLECTED,
    CheckBillStatus.WRITTEN_OFF,
  ],
  [CheckBillStatus.LEGAL_FOLLOWUP]: [
    CheckBillStatus.COLLECTED,
    CheckBillStatus.WRITTEN_OFF,
  ],
  [CheckBillStatus.RETURNED]: [CheckBillStatus.IN_PORTFOLIO],
  [CheckBillStatus.COLLECTED]: [],
  [CheckBillStatus.WRITTEN_OFF]: [],
  [CheckBillStatus.CANCELLED]: [],
  [CheckBillStatus.RECOURSE]: [],
};

/**
 * DEBIT (Borç / Firma Çeki) portföyü için izin verilen durum geçişleri.
 * Borç çekler ödenir; tahsilat YAPILMAZ; bankaya verilmez.
 */
const DEBIT_TRANSITIONS: Record<string, CheckBillStatus[]> = {
  [CheckBillStatus.IN_PORTFOLIO]: [
    CheckBillStatus.PAID, // Ödeme yapıldı
    CheckBillStatus.WITHOUT_COVERAGE, // Karşılıksız çıktı
    CheckBillStatus.RETURNED, // İade
    CheckBillStatus.CANCELLED, // İptal
    CheckBillStatus.GIVEN_TO_CUSTOMER, // Müşteriye ver (portföyden çıkış)
  ],
  [CheckBillStatus.UNPAID]: [
    CheckBillStatus.PAID,
    CheckBillStatus.RETURNED,
    CheckBillStatus.WITHOUT_COVERAGE,
  ],
  [CheckBillStatus.WITHOUT_COVERAGE]: [
    CheckBillStatus.PROTESTED,
    CheckBillStatus.RETURNED,
    CheckBillStatus.PAID,
  ],
  [CheckBillStatus.PROTESTED]: [
    CheckBillStatus.LEGAL_FOLLOWUP,
    CheckBillStatus.PAID,
    CheckBillStatus.WRITTEN_OFF,
  ],
  [CheckBillStatus.LEGAL_FOLLOWUP]: [
    CheckBillStatus.PAID,
    CheckBillStatus.WRITTEN_OFF,
  ],
  [CheckBillStatus.RETURNED]: [CheckBillStatus.IN_PORTFOLIO],
  [CheckBillStatus.PAID]: [],
  [CheckBillStatus.WRITTEN_OFF]: [],
  [CheckBillStatus.CANCELLED]: [],
};

/** Portföy tipine göre izin verilen hedef durumlar */
export function getAllowedNextStatusesForPortfolio(
  from: CheckBillStatus | null | undefined,
  portfolioType: PortfolioType | null | undefined,
): CheckBillStatus[] {
  if (!from) return [];
  const table =
    portfolioType === PortfolioType.DEBIT
      ? DEBIT_TRANSITIONS
      : CREDIT_TRANSITIONS;
  return table[from] ?? [];
}

/** @deprecated portfolioType'sız çağrı — sadece geriye dönük uyumluluk için */
export function assertLegalTransition(
  from: CheckBillStatus | null | undefined,
  to: CheckBillStatus,
): void {
  if (!from) return;
  // portfolioType bilinmiyorsa her iki tablodan geçiş kontrolü yap
  const creditOk = (CREDIT_TRANSITIONS[from] ?? []).includes(to);
  const debitOk = (DEBIT_TRANSITIONS[from] ?? []).includes(to);
  if (!creditOk && !debitOk) {
    throw new BadRequestException(
      `Bu işlem geçersiz: "${from}" durumundan "${to}" durumuna geçiş yapılamaz.`,
    );
  }
}

/** Portföy tipine duyarlı geçiş doğrulaması */
export function assertLegalTransitionForPortfolio(
  from: CheckBillStatus | null | undefined,
  to: CheckBillStatus,
  portfolioType: PortfolioType | null | undefined,
): void {
  if (!from) return;
  const allowed = getAllowedNextStatusesForPortfolio(from, portfolioType);
  if (!allowed.includes(to)) {
    throw new BadRequestException(
      `Bu işlem geçersiz: "${from}" durumundan "${to}" durumuna geçiş yapılamaz (portföy: ${portfolioType ?? 'bilinmiyor'}).`,
    );
  }
}
