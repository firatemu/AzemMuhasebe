import { z } from 'zod';

const optionalText = z
  .string()
  .transform((value) => value.trim())
  .optional();

const optionalNumber = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  },
  z.number().min(0, 'Negatif değer girilemez').optional(),
);

const requiredNumber = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  },
  z.number().min(0, 'Negatif değer girilemez'),
);

export const materialFormSchema = z.object({
  stokKodu: optionalText,
  stokAdi: z.string().trim().min(2, 'Malzeme adı en az 2 karakter olmalı'),
  barkod: optionalText,
  aciklama: optionalText,
  marka: optionalText,
  model: optionalText,
  anaKategori: optionalText,
  altKategori: optionalText,
  birim: z.string().trim().min(1, 'Birim seçimi zorunludur'),
  birimId: optionalText,
  olcu: optionalText,
  raf: optionalText,
  tedarikciKodu: optionalText,
  alisFiyati: requiredNumber.default(0),
  satisFiyati: requiredNumber.default(0),
  vatRate: z.coerce.number().min(0).max(100).default(20),
  criticalQty: z.coerce.number().int().min(0).default(0),
  weight: optionalNumber,
  weightUnit: optionalText.default('kg'),
  dimensions: optionalText,
  warrantyMonths: z.coerce.number().int().min(0).optional(),
  internalNote: optionalText,
  minOrderQty: z.coerce.number().int().min(0).optional(),
});

export type MaterialFormValues = z.infer<typeof materialFormSchema>;

export const defaultMaterialFormValues: MaterialFormValues = {
  stokKodu: '',
  stokAdi: '',
  barkod: '',
  aciklama: '',
  marka: '',
  model: '',
  anaKategori: '',
  altKategori: '',
  birim: 'Adet',
  birimId: '',
  olcu: '',
  raf: '',
  tedarikciKodu: '',
  alisFiyati: 0,
  satisFiyati: 0,
  vatRate: 20,
  criticalQty: 0,
  weight: undefined,
  weightUnit: 'kg',
  dimensions: '',
  warrantyMonths: undefined,
  internalNote: '',
  minOrderQty: undefined,
};
