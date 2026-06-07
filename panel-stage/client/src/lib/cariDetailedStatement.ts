export interface DetailIncludeOptions {
  invoiceLines: boolean;
  collections: boolean;
  checks: boolean;
}

export function buildDetailedStatementParams(
  accountId: string,
  startDate: string,
  endDate: string,
  include: DetailIncludeOptions,
) {
  return {
    accountId,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    baslangicTarihi: startDate || undefined,
    bitisTarihi: endDate || undefined,
    invoiceLines: include.invoiceLines ? 'true' : 'false',
    collections: include.collections ? 'true' : 'false',
    checks: include.checks ? 'true' : 'false',
  };
}

export function buildSummaryStatementParams(startDate: string, endDate: string) {
  return {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    baslangicTarihi: startDate || undefined,
    bitisTarihi: endDate || undefined,
  };
}

/** Detaylı ekstre API yolları (account-movements controller) */
export const DETAILED_STATEMENT_API = {
  json: '/account-movements/statement/detailed',
  excel: '/account-movements/statement/detailed/export/excel',
  pdf: '/account-movements/statement/detailed/export/pdf',
} as const;

/** Özet ekstre — mevcut account controller alias */
export function accountSummaryExportPath(accountId: string, format: 'excel' | 'pdf') {
  return `/account/${accountId}/statement/export/${format}`;
}

/** Detaylı ekstre — account controller alias (yedek) */
export function accountDetailedExportPath(
  accountId: string,
  format: 'excel' | 'pdf',
) {
  return `/account/${accountId}/statement/detailed/export/${format}`;
}
