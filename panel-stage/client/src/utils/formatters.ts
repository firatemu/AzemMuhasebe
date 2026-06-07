export const formatCurrency = (value: number | string, currency: string = 'TRY') => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return value;

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

export const formatDate = (date: string | Date | null | undefined, format: string = 'DD.MM.YYYY') => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const pad = (n: number) => n.toString().padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();

  if (format === 'DD.MM.YYYY HH:mm') {
    return `${day}.${month}.${year} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  return `${day}.${month}.${year}`;
};
