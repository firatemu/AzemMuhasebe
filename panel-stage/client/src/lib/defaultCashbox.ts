/** Yerel varsayılan nakit kasa (Tahsilat / Ödeme formlarında ön seçim). */
const STORAGE_KEY = 'muhasebe_default_cashbox_id';

export function getDefaultCashboxId(): string | null {
  if (typeof window === 'undefined') return null;
  const id = localStorage.getItem(STORAGE_KEY);
  return id && id.trim().length > 0 ? id : null;
}

export function setDefaultCashboxId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(STORAGE_KEY, id);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/** Liste içinde geçerli ve isteğe bağlı NAKIT tipinde mi kontrol eder. */
export function resolveDefaultCashboxId(
  kasalar: { id: string; kasaTipi?: string }[],
  options?: { nakitOnly?: boolean },
): string {
  const id = getDefaultCashboxId();
  if (!id) return '';
  const found = kasalar.find((k) => k.id === id);
  if (!found) return '';
  if (options?.nakitOnly && found.kasaTipi && found.kasaTipi !== 'NAKIT') return '';
  return id;
}
