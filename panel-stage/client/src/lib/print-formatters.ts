export function formatDiscountPercent(rate: number) {
  if (!rate || rate <= 0) return '-';
  return `${Number.isInteger(rate) ? rate : rate.toFixed(2)}%`;
}
