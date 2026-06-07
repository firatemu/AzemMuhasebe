/** Internal sentinel — Base UI Select requires a non-empty string value. Never show this in the UI. */
export const EMPTY_SELECT_VALUE = '__empty__';

export function toOptionalSelectValue(value: string | null | undefined): string {
  return value?.trim() ? value : EMPTY_SELECT_VALUE;
}

export function fromOptionalSelectValue(value: string | null | undefined): string {
  if (!value || value === EMPTY_SELECT_VALUE) return '';
  return value;
}

/** Maps internal enum/sentinel Select value to user-visible label (never expose raw codes like `true`, `MUSTERI`). */
export function enumSelectLabel(value: string | null | undefined, labels: Record<string, string>): string {
  if (value == null || value === '') return '';
  return labels[value] ?? value;
}

/** Boolean durum alanları — `true`/`false` Select value olarak kullanılmaz (Base UI ham değeri gösterir). */
export const AKTIF_SELECT_VALUE = 'AKTIF';
export const PASIF_SELECT_VALUE = 'PASIF';

export function booleanToAktifSelectValue(aktif: boolean): string {
  return aktif ? AKTIF_SELECT_VALUE : PASIF_SELECT_VALUE;
}

export function aktifSelectValueToBoolean(value: string | null | undefined): boolean {
  return value === AKTIF_SELECT_VALUE;
}

export function optionalSelectLabel(
  value: string,
  options: {
    emptyLabel?: string;
    resolveLabel?: (value: string) => string | undefined;
  } = {},
): string | null {
  if (!value || value === EMPTY_SELECT_VALUE) {
    return options.emptyLabel ?? null;
  }
  return options.resolveLabel?.(value) ?? value;
}
