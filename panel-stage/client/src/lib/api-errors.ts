const ERROR_MESSAGES: Record<string, string> = {
  FORBIDDEN: 'Bu işlem için yetkiniz yok.',
  NOT_FOUND: 'Kayıt bulunamadı.',
  VALIDATION_ERROR: 'Girdiğiniz bilgileri kontrol edin.',
  TENANT_REQUIRED: 'Oturum veya şirket bilgisi eksik.',
  DELETION_PROTECTED: 'Bu kayıt başka belgelerde kullanıldığı için silinemez.',
};

export function resolveApiError(error: unknown): string {
  const ax = error as { response?: { status?: number; data?: { message?: string | string[]; code?: string } } };
  const code = ax.response?.data?.code;
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];
  const msg = ax.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(' ');
  if (typeof msg === 'string') return msg;
  if (ax.response?.status === 403) return ERROR_MESSAGES.FORBIDDEN;
  if (ax.response?.status === 404) return ERROR_MESSAGES.NOT_FOUND;
  return 'Beklenmeyen bir hata oluştu.';
}