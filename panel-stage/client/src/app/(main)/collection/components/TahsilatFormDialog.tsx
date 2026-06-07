"use client";

import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  AccountBalance,
  Close,
  CreditCard,
  Notes,
  Person,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';

import axios from '@/lib/axios';
import { resolveDefaultCashboxId } from '@/lib/defaultCashbox';
import { BankaHesap, Cari, FirmaKrediKarti, Kasa, TahsilatFormData } from '../types';

interface TahsilatFormDialogProps {
  open: boolean;
  initialFormData: TahsilatFormData;
  cariler: Cari[];
  bankaHesaplari: BankaHesap[];
  kasalar: Kasa[];
  carilerLoading: boolean;
  bankaHesaplariLoading: boolean;
  kasalarLoading: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: TahsilatFormData) => void;
  formatMoney: (value: number) => string;
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--background)',
    '& fieldset': { borderColor: 'var(--border)' },
    '&:hover fieldset': { borderColor: 'var(--ring)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--ring)' },
  },
  '& .MuiInputLabel-root': {
    color: 'var(--muted-foreground)',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
} as const;

const numberFieldSx = {
  ...fieldSx,
  '& input[type=number]': { MozAppearance: 'textfield' },
  '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
  '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
} as const;

const compactFieldSx = {
  ...fieldSx,
  maxWidth: { xs: '100%', sm: 240 },
} as const;

const compactNumberFieldSx = {
  ...numberFieldSx,
  maxWidth: { xs: '100%', sm: 220 },
} as const;

const panelSx = {
  p: 1.5,
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  bgcolor: 'var(--card)',
  boxShadow: 'none',
} as const;

const sectionTitleSx = {
  mb: 1.25,
  pb: 0.75,
  borderBottom: '1px solid var(--border)',
} as const;

const TahsilatFormDialog = memo(({
  open,
  initialFormData,
  cariler,
  bankaHesaplari,
  kasalar,
  carilerLoading,
  bankaHesaplariLoading,
  kasalarLoading,
  submitting,
  onClose,
  onSubmit,
  formatMoney,
}: TahsilatFormDialogProps) => {
  const [localFormData, setLocalFormData] = useState<TahsilatFormData>(initialFormData);
  const [firmaKrediKartlari, setFirmaKrediKartlari] = useState<FirmaKrediKarti[]>([]);
  const [firmaKrediKartlariLoading, setFirmaKrediKartlariLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalFormData(initialFormData);
    setErrors({});
    setTouched({});
  }, [initialFormData, open]);

  useEffect(() => {
    if (!open || localFormData.odemeTipi !== 'NAKIT' || localFormData.kasaId) return;
    const defaultId = resolveDefaultCashboxId(
      kasalar.map((k) => ({ id: k.id, kasaTipi: k.kasaTipi })),
      { nakitOnly: true },
    );
    if (defaultId) setLocalFormData((prev) => ({ ...prev, kasaId: defaultId }));
  }, [open, localFormData.odemeTipi, localFormData.kasaId, kasalar]);

  const posBankaHesaplariFiltered = useMemo(() => {
    if (localFormData.tip === 'COLLECTION' && localFormData.odemeTipi === 'KREDI_KARTI') {
      return bankaHesaplari.filter((h) => h.hesapTipi === 'POS');
    }
    return [];
  }, [bankaHesaplari, localFormData.tip, localFormData.odemeTipi]);

  const availableKasalar = useMemo(() => {
    if (localFormData.odemeTipi === 'NAKIT') return kasalar.filter((k) => k.kasaTipi === 'NAKIT');
    if (localFormData.odemeTipi === 'KREDI_KARTI' && localFormData.tip === 'PAYMENT') {
      return kasalar.filter((k) => k.kasaTipi === 'FIRMA_KREDI_KARTI');
    }
    return [];
  }, [kasalar, localFormData.odemeTipi, localFormData.tip]);

  useEffect(() => {
    const fetchFirmaKrediKartlari = async () => {
      if (localFormData.tip === 'PAYMENT' && localFormData.odemeTipi === 'KREDI_KARTI' && localFormData.kasaId) {
        try {
          setFirmaKrediKartlariLoading(true);
          const response = await axios.get('/firma-kredi-karti', { params: { kasaId: localFormData.kasaId } });
          setFirmaKrediKartlari(response.data || []);
        } catch {
          setFirmaKrediKartlari([]);
        } finally {
          setFirmaKrediKartlariLoading(false);
        }
      } else {
        setFirmaKrediKartlari([]);
        setLocalFormData((prev) => ({
          ...prev,
          firmaKrediKartiId: undefined,
          kartSahibi: '',
          kartSonDort: '',
          bankaAdi: '',
        }));
      }
    };
    void fetchFirmaKrediKartlari();
  }, [localFormData.tip, localFormData.odemeTipi, localFormData.kasaId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const tutarNum = typeof localFormData.tutar === 'string' ? parseFloat(localFormData.tutar) : localFormData.tutar;

    if (!localFormData.cariId) newErrors.cariId = 'Cari seçimi zorunludur';
    if (tutarNum === undefined || Number.isNaN(tutarNum) || tutarNum <= 0) newErrors.tutar = "Tutar 0'dan büyük olmalıdır";
    if (!localFormData.tarih) newErrors.tarih = 'Tarih seçimi zorunludur';
    if (localFormData.odemeTipi === 'NAKIT' && !localFormData.kasaId) newErrors.kasaId = 'Kasa seçimi zorunludur';

    if (localFormData.odemeTipi === 'KREDI_KARTI') {
      if (localFormData.tip === 'COLLECTION' && !localFormData.bankaHesapId) newErrors.bankaHesapId = 'POS hesabı seçimi zorunludur';
      if (localFormData.tip === 'COLLECTION') {
        const installmentValue = Number(localFormData.installmentCount || 1);
        if (!Number.isInteger(installmentValue) || installmentValue < 1) newErrors.installmentCount = 'Taksit sayısı en az 1 olmalıdır';
      }
      if (localFormData.tip === 'PAYMENT') {
        if (!localFormData.kasaId) newErrors.kasaId = 'Kart kasası seçimi zorunludur';
        if (!localFormData.firmaKrediKartiId) newErrors.firmaKrediKartiId = 'Kredi kartı seçimi zorunludur';
      }
    }

    setErrors(newErrors);
    setTouched({ cariId: true, tutar: true, tarih: true, kasaId: true, bankaHesapId: true, firmaKrediKartiId: true, installmentCount: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleLocalChange = (field: keyof TahsilatFormData, value: any) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'firmaKrediKartiId' && value) {
      const selectedKart = firmaKrediKartlari.find((kart) => kart.id === value);
      if (selectedKart) {
        setLocalFormData((prev) => ({
          ...prev,
          [field]: value,
          kartSahibi: selectedKart.kartAdi || '',
          kartSonDort: selectedKart.sonDortHane || '',
          bankaAdi: selectedKart.bankaAdi || '',
        }));
        return;
      }
    }

    if (field === 'odemeTipi') {
      const defaultKasaId = value === 'NAKIT'
        ? resolveDefaultCashboxId(kasalar.map((k) => ({ id: k.id, kasaTipi: k.kasaTipi })), { nakitOnly: true })
        : '';
      setLocalFormData((prev) => ({ ...prev, [field]: value, kasaId: defaultKasaId, bankaHesapId: '', installmentCount: 1 }));
      return;
    }

    setLocalFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocalSubmit = () => {
    if (!validateForm()) return;
    const tutarNum = typeof localFormData.tutar === 'string' ? parseFloat(localFormData.tutar) : localFormData.tutar;
    onSubmit({ ...localFormData, tutar: tutarNum || 0 });
  };

  if (!open) return null;

  const isTahsilat = localFormData.tip === 'COLLECTION';
  const actionColor = isTahsilat ? 'var(--income)' : 'var(--expense)';
  const actionMuted = isTahsilat ? 'var(--income-muted)' : 'var(--expense-muted)';
  const selectedCari = cariler.find((c) => c.id === localFormData.cariId);
  const selectedKasa = kasalar.find((k) => k.id === localFormData.kasaId);
  const selectedPos = bankaHesaplari.find((b) => b.id === localFormData.bankaHesapId);
  const selectedCard = firmaKrediKartlari.find((k) => k.id === localFormData.firmaKrediKartiId);
  const amountValue = typeof localFormData.tutar === 'string' ? parseFloat(localFormData.tutar) : localFormData.tutar;
  const previewAmount = Number.isFinite(amountValue) ? Number(amountValue) : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'var(--card)',
          borderRadius: 'calc(var(--radius) + 6px)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          maxHeight: '88vh',
        },
      }}
    >
      <DialogTitle component="div" sx={{ p: 0, bgcolor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <Box sx={{ p: 1.5, display: 'grid', gridTemplateColumns: '1fr auto', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--background)', color: actionColor, border: '1px solid var(--border)' }}>
              {isTahsilat ? <TrendingDown /> : <TrendingUp />}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={800} color="var(--foreground)" sx={{ lineHeight: 1.1 }}>
                {isTahsilat ? 'Tahsilat Ekle' : 'Ödeme Ekle'}
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={onClose} size="small" sx={{ color: 'var(--muted-foreground)' }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: 'var(--background)' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' } }}>
          <Box sx={{ p: 1.5, maxHeight: 'calc(88vh - 126px)', overflowY: 'auto' }}>
            <Grid container spacing={1.25}>
              <Grid size={12}>
                <Paper variant="outlined" sx={panelSx}>
                  <Box sx={sectionTitleSx}>
                    <Typography variant="subtitle2" fontWeight={800} color="var(--foreground)">İşlem Bilgileri</Typography>
                  </Box>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, md: 9 }}>
                      <Autocomplete
                        options={cariler}
                        getOptionLabel={(option) => `${option.cariKodu} - ${option.unvan}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <Box>
                              <Typography variant="body2" fontWeight={700}>{option.cariKodu}</Typography>
                              <Typography variant="caption" color="text.secondary">{option.unvan}</Typography>
                            </Box>
                          </li>
                        )}
                        loading={carilerLoading}
                        value={selectedCari || null}
                        onChange={(_, value) => handleLocalChange('cariId', value?.id || '')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cari"
                            error={!!errors.cariId && touched.cariId}
                            helperText={touched.cariId ? errors.cariId : ''}
                            sx={fieldSx}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start"><Person fontSize="small" /></InputAdornment>
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Tutar"
                        value={localFormData.tutar}
                        onChange={(e) => handleLocalChange('tutar', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                        error={!!errors.tutar && touched.tutar}
                        helperText={touched.tutar ? (errors.tutar || "Tutar 0'dan büyük olmalıdır") : "Tutar 0'dan büyük olmalıdır"}
                        sx={compactNumberFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start">₺</InputAdornment>, inputProps: { min: 0, step: 0.01 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextField fullWidth type="date" label="İşlem Tarihi" value={localFormData.tarih} onChange={(e) => handleLocalChange('tarih', e.target.value)} error={!!errors.tarih && touched.tarih} helperText={touched.tarih ? errors.tarih : ''} sx={compactFieldSx} slotProps={{ inputLabel: { shrink: true } }} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <FormControl fullWidth sx={compactFieldSx}>
                        <InputLabel>Ödeme Tipi</InputLabel>
                        <Select value={localFormData.odemeTipi} label="Ödeme Tipi" onChange={(e) => handleLocalChange('odemeTipi', e.target.value)} startAdornment={<InputAdornment position="start"><CreditCard fontSize="small" /></InputAdornment>}>
                          <MenuItem value="NAKIT">Nakit</MenuItem>
                          <MenuItem value="KREDI_KARTI">Kredi Kartı</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {localFormData.odemeTipi === 'KREDI_KARTI' && isTahsilat ? (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth error={!!errors.bankaHesapId && touched.bankaHesapId} sx={fieldSx}>
                          <InputLabel>POS Banka Hesabı</InputLabel>
                          <Select value={localFormData.bankaHesapId || ''} label="POS Banka Hesabı" onChange={(e) => handleLocalChange('bankaHesapId', e.target.value)} disabled={bankaHesaplariLoading} startAdornment={<InputAdornment position="start"><AccountBalance fontSize="small" /></InputAdornment>}>
                            {posBankaHesaplariFiltered.map((hesap) => (
                              <MenuItem key={hesap.id} value={hesap.id}>{hesap.bankaAdi} - {hesap.hesapAdi}</MenuItem>
                            ))}
                          </Select>
                          {touched.bankaHesapId && errors.bankaHesapId && <Typography variant="caption" color="error">{errors.bankaHesapId}</Typography>}
                        </FormControl>
                      </Grid>
                    ) : (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth error={!!errors.kasaId && touched.kasaId} sx={fieldSx}>
                          <InputLabel>{localFormData.odemeTipi === 'NAKIT' ? 'Nakit Kasa' : 'Kredi Kartı Kasası'}</InputLabel>
                          <Select value={localFormData.kasaId} label={localFormData.odemeTipi === 'NAKIT' ? 'Nakit Kasa' : 'Kredi Kartı Kasası'} onChange={(e) => handleLocalChange('kasaId', e.target.value)} disabled={kasalarLoading} startAdornment={<InputAdornment position="start"><AccountBalance fontSize="small" /></InputAdornment>}>
                            {availableKasalar.map((kasa) => (
                              <MenuItem key={kasa.id} value={kasa.id}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 1 }}>
                                  <span>{kasa.kasaAdi}</span>
                                  <Chip label={formatMoney(kasa.bakiye)} size="small" variant="outlined" />
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.kasaId && errors.kasaId && <Typography variant="caption" color="error">{errors.kasaId}</Typography>}
                        </FormControl>
                      </Grid>
                    )}

                    {!isTahsilat && localFormData.odemeTipi === 'KREDI_KARTI' && localFormData.kasaId && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth error={!!errors.firmaKrediKartiId && touched.firmaKrediKartiId} sx={fieldSx}>
                          <InputLabel>Firma Kredi Kartı</InputLabel>
                          <Select value={localFormData.firmaKrediKartiId || ''} label="Firma Kredi Kartı" onChange={(e) => handleLocalChange('firmaKrediKartiId', e.target.value)} disabled={firmaKrediKartlariLoading}>
                            {firmaKrediKartlari.filter((k) => k.aktif).map((kart) => (
                              <MenuItem key={kart.id} value={kart.id}>{kart.kartAdi} - {kart.bankaAdi} (Son 4: {kart.sonDortHane})</MenuItem>
                            ))}
                          </Select>
                          {touched.firmaKrediKartiId && errors.firmaKrediKartiId && <Typography variant="caption" color="error">{errors.firmaKrediKartiId}</Typography>}
                        </FormControl>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              {isTahsilat && localFormData.odemeTipi === 'KREDI_KARTI' && (
                <Grid size={12}>
                  <Paper variant="outlined" sx={panelSx}>
                    <Box sx={sectionTitleSx}>
                      <Typography variant="subtitle2" fontWeight={800} color="var(--foreground)">Kart Detayı</Typography>
                    </Box>
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth size="small" label="Kart Sahibi" value={localFormData.kartSahibi} onChange={(e) => handleLocalChange('kartSahibi', e.target.value)} sx={fieldSx} /></Grid>
                      <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth size="small" label="Son 4 Hane" inputProps={{ maxLength: 4 }} value={localFormData.kartSonDort} onChange={(e) => handleLocalChange('kartSonDort', e.target.value)} sx={compactFieldSx} /></Grid>
                      <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth size="small" label="Banka Adı" value={localFormData.bankaAdi} onChange={(e) => handleLocalChange('bankaAdi', e.target.value)} sx={fieldSx} /></Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField fullWidth size="small" type="number" label="Taksit" value={localFormData.installmentCount ?? 1} onChange={(e) => handleLocalChange('installmentCount', parseInt(e.target.value) || 1)} error={!!errors.installmentCount && touched.installmentCount} helperText={touched.installmentCount ? (errors.installmentCount || 'En az 1') : 'En az 1'} inputProps={{ min: 1, step: 1 }} sx={compactNumberFieldSx} />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}

              <Grid size={12}>
                <TextField fullWidth label="Açıklama" multiline rows={2} value={localFormData.aciklama} onChange={(e) => handleLocalChange('aciklama', e.target.value)} sx={fieldSx} InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: 1 }}><Notes fontSize="small" /></InputAdornment> }} />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: { xs: 'none', lg: 'block' }, borderLeft: '1px solid var(--border)', bgcolor: 'var(--card)', p: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={800} color="var(--foreground)">İşlem Özeti</Typography>

            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 'var(--radius)', bgcolor: 'var(--background)', border: '1px solid var(--border)' }}>
              <Typography variant="caption" color="var(--muted-foreground)" fontWeight={700}>{isTahsilat ? 'Tahsil edilecek' : 'Ödenecek'}</Typography>
              <Typography variant="h6" fontWeight={900} sx={{ color: actionColor, mt: 0.25 }}>{formatMoney(previewAmount)}</Typography>
            </Box>

            <Box sx={{ mt: 1.5, display: 'grid', gap: 0.75 }}>
              {[
                ['Cari', selectedCari ? `${selectedCari.cariKodu} - ${selectedCari.unvan}` : 'Seçilmedi'],
                ['Yöntem', localFormData.odemeTipi === 'NAKIT' ? 'Nakit' : 'Kredi Kartı'],
                ['Kaynak', selectedKasa?.kasaAdi || selectedPos?.hesapAdi || selectedCard?.kartAdi || 'Seçilmedi'],
                ['Tarih', localFormData.tarih || 'Seçilmedi'],
              ].map(([label, value]) => (
                <Box key={label} sx={{ py: 0.75, borderBottom: '1px solid var(--border)' }}>
                  <Typography variant="caption" color="var(--muted-foreground)" fontWeight={700}>{label}</Typography>
                  <Typography variant="body2" color="var(--foreground)" fontWeight={600} sx={{ mt: 0.25 }}>{value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 1.5, py: 1.25, bgcolor: 'var(--card)', borderTop: '1px solid var(--border)' }}>
        <Button onClick={onClose} disabled={submitting} variant="outlined" size="small" sx={{ borderRadius: 'var(--radius)', textTransform: 'none', fontWeight: 700 }}>İptal</Button>
        <Button
          onClick={handleLocalSubmit}
          variant="contained"
          disabled={submitting}
          size="small"
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : (isTahsilat ? <TrendingDown /> : <TrendingUp />)}
          sx={{ borderRadius: 'var(--radius)', textTransform: 'none', fontWeight: 800, bgcolor: actionColor, color: 'var(--income-foreground)', boxShadow: 'none', '&:hover': { bgcolor: `color-mix(in srgb, ${actionColor} 85%, black)`, boxShadow: 'none' } }}
        >
          {submitting ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

TahsilatFormDialog.displayName = 'TahsilatFormDialog';

export default TahsilatFormDialog;
