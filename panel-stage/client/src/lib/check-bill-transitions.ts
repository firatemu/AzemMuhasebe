import { CheckBillStatus, PortfolioType } from '@/types/check-bill';

/**
 * CREDIT (Alacak / Müşteri Çeki) portföyü için izin verilen durum geçişleri.
 * Tahsilat, ciro ve bankaya verme işlemleri bu portföy için geçerlidir.
 * ÖDEME YAPILMAZ.
 */
const CREDIT_TRANSITIONS: Partial<Record<CheckBillStatus, CheckBillStatus[]>> = {
    [CheckBillStatus.IN_PORTFOLIO]: [
        CheckBillStatus.IN_BANK_COLLECTION,  // Bankaya tahsilata ver
        CheckBillStatus.IN_BANK_GUARANTEE,   // Bankaya teminata ver
        CheckBillStatus.ENDORSED,            // Ciro et
        CheckBillStatus.COLLECTED,           // Doğrudan tahsilat
        CheckBillStatus.RETURNED,            // İade
        CheckBillStatus.CANCELLED,           // İptal
        CheckBillStatus.GIVEN_TO_CUSTOMER,   // Müşteriye ver (portföyden çıkış)
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
    [CheckBillStatus.DISCOUNTED]: [CheckBillStatus.COLLECTED, CheckBillStatus.RECOURSE],
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
    [CheckBillStatus.LEGAL_FOLLOWUP]: [CheckBillStatus.COLLECTED, CheckBillStatus.WRITTEN_OFF],
    [CheckBillStatus.RETURNED]: [CheckBillStatus.IN_PORTFOLIO],
    [CheckBillStatus.COLLECTED]: [],
    [CheckBillStatus.WRITTEN_OFF]: [],
    [CheckBillStatus.CANCELLED]: [],
    [CheckBillStatus.RECOURSE]: [],
};

/**
 * DEBIT (Borç / Firma Çeki) portföyü için izin verilen durum geçişleri.
 * Ödeme bu portföy için geçerlidir.
 * TAHSİLAT YAPILMAZ, BANKAYA VERİLMEZ.
 */
const DEBIT_TRANSITIONS: Partial<Record<CheckBillStatus, CheckBillStatus[]>> = {
    [CheckBillStatus.IN_PORTFOLIO]: [
        CheckBillStatus.PAID,               // Ödeme yapıldı
        CheckBillStatus.WITHOUT_COVERAGE,   // Karşılıksız çıktı
        CheckBillStatus.RETURNED,           // İade
        CheckBillStatus.CANCELLED,          // İptal
        CheckBillStatus.GIVEN_TO_CUSTOMER,  // Müşteriye ver (portföyden çıkış)
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
    [CheckBillStatus.LEGAL_FOLLOWUP]: [CheckBillStatus.PAID, CheckBillStatus.WRITTEN_OFF],
    [CheckBillStatus.RETURNED]: [CheckBillStatus.IN_PORTFOLIO],
    [CheckBillStatus.PAID]: [],
    [CheckBillStatus.WRITTEN_OFF]: [],
    [CheckBillStatus.CANCELLED]: [],
};

/** Portföy tipine göre izin verilen hedef durumlar */
export function getAllowedNextStatuses(
    current: CheckBillStatus | undefined | null,
    portfolioType?: PortfolioType | null,
): CheckBillStatus[] {
    if (current === undefined || current === null) return [];
    const table = portfolioType === PortfolioType.DEBIT ? DEBIT_TRANSITIONS : CREDIT_TRANSITIONS;
    return table[current] ?? [];
}

export function isTransitionAllowed(
    from: CheckBillStatus,
    to: CheckBillStatus,
    portfolioType?: PortfolioType | null,
): boolean {
    const allowed = getAllowedNextStatuses(from, portfolioType);
    return allowed.includes(to);
}
