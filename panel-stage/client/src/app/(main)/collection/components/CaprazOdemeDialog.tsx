"use client";

import React from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  AccountBalance,
  CalendarToday,
  Close,
  CurrencyLira,
  Description,
  Person,
  SwapHoriz,
} from '@mui/icons-material';

import { CaprazOdemeFormData, Cari } from '../types';

interface CaprazOdemeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: CaprazOdemeFormData;
  setFormData: (data: CaprazOdemeFormData) => void;
  cariler: Cari[];
  loading: boolean;
  submitting: boolean;
  carilerError: boolean;
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
  p: 1.75,
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  bgcolor: 'var(--card)',
  boxShadow: 'none',
} as const;

const sectionTitleSx = {
  mb: 1.5,
  pb: 1,
  borderBottom: '1px solid var(--border)',
} as const;

const CaprazOdemeDialog: React.FC<CaprazOdemeDialogProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  cariler,
  loading,
  submitting,
  carilerError,
}) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const tahsilatCari = cariler.find((c) => c.id === formData.tahsilatCariId);
  const odemeCari = cariler.find((c) => c.id === formData.odemeCariId);
  const tutarNum = typeof formData.tutar === 'string' ? parseFloat(formData.tutar) : formData.tutar;
  const previewAmount = Number.isFinite(tutarNum) ? Number(tutarNum) : 0;

  const handleChange = (field: keyof CaprazOdemeFormData, value: any) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    const amount = typeof formData.tutar === 'string' ? parseFloat(formData.tutar) : formData.tutar;

    if (!formData.tahsilatCariId) newErrors.tahsilatCariId = 'Borçlu cari seçimi zorunludur';
    if (!formData.odemeCariId) newErrors.odemeCariId = 'Alacaklı cari seçimi zorunludur';
    if (formData.tahsilatCariId && formData.tahsilatCariId === formData.odemeCariId) newErrors.odemeCariId = 'Cariler farklı olmalıdır';
    if (Number.isNaN(amount) || amount <= 0) newErrors.tutar = "Tutar 0'dan büyük olmalıdır";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit();
  };

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
        },
      }}
    >
      <DialogTitle component="div" sx={{ p: 0, bgcolor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: { xs: '1fr auto', md: '1fr 220px auto' }, gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--background)', color: 'var(--info)', border: '1px solid var(--border)' }}>
              <SwapHoriz />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={800} color="var(--foreground)" sx={{ lineHeight: 1.1 }}>
                Çapraz Ödeme Tahsilat
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' }, py: 0.75, px: 1, borderRadius: 'var(--radius)', bgcolor: 'var(--background)', border: '1px solid var(--border)' }}>
            <Typography variant="caption" color="var(--muted-foreground)" fontWeight={700}>Tutar</Typography>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'var(--info)', lineHeight: 1.1 }}>
              {previewAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </Typography>
          </Box>

          <IconButton onClick={onClose} size="small" sx={{ color: 'var(--muted-foreground)' }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, bgcolor: 'var(--background)' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' }, minHeight: { lg: 500 } }}>
          <Box sx={{ p: 2, maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
            <Grid container spacing={1.5}>
              <Grid size={12}>
                <Alert
                  severity="info"
                  icon={<SwapHoriz />}
                  sx={{
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    bgcolor: 'var(--card)',
                    color: 'var(--foreground)',
                    py: 0.75,
                  }}
                >
                  <Typography variant="body2" color="var(--muted-foreground)">
                    İki cari arasında mahsup oluşturulur; kasa, banka ve POS bakiyeleri değişmez.
                  </Typography>
                </Alert>
              </Grid>

              <Grid size={12}>
                <Paper variant="outlined" sx={panelSx}>
                  <Box sx={sectionTitleSx}>
                    <Typography variant="subtitle2" fontWeight={800} color="var(--foreground)">Cari Eşleştirme</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Autocomplete
                        options={Array.isArray(cariler) ? cariler : []}
                        getOptionLabel={(option) => `${option.cariKodu} - ${option.unvan}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <Box>
                              <Typography variant="body2" fontWeight={700}>{option.cariKodu}</Typography>
                              <Typography variant="caption" color="text.secondary">{option.unvan}</Typography>
                            </Box>
                          </li>
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={tahsilatCari || null}
                        onChange={(_, newValue) => handleChange('tahsilatCariId', newValue?.id || '')}
                        loading={loading}
                        disabled={loading || cariler.length === 0}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Borçlu Cari"
                            required
                            error={!!errors.tahsilatCariId}
                            helperText={errors.tahsilatCariId || 'Para çıkışı yapılacak cari'}
                            sx={fieldSx}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start"><Person color="action" /></InputAdornment>
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Autocomplete
                        options={Array.isArray(cariler) ? cariler.filter((c) => c.id !== formData.tahsilatCariId) : []}
                        getOptionLabel={(option) => `${option.cariKodu} - ${option.unvan}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                            <Box>
                              <Typography variant="body2" fontWeight={700}>{option.cariKodu}</Typography>
                              <Typography variant="caption" color="text.secondary">{option.unvan}</Typography>
                            </Box>
                          </li>
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={odemeCari || null}
                        onChange={(_, newValue) => handleChange('odemeCariId', newValue?.id || '')}
                        loading={loading}
                        disabled={loading || cariler.length === 0 || !formData.tahsilatCariId}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Alacaklı Cari"
                            required
                            error={!!errors.odemeCariId}
                            helperText={errors.odemeCariId || 'Para girişi yapılacak cari'}
                            sx={fieldSx}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start"><AccountBalance color="action" /></InputAdornment>
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid size={12}>
                <Paper variant="outlined" sx={panelSx}>
                  <Box sx={sectionTitleSx}>
                    <Typography variant="subtitle2" fontWeight={800} color="var(--foreground)">Virman Detayı</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextField
                        fullWidth
                        label="İşlem Tutarı"
                        type="number"
                        required
                        value={formData.tutar}
                        onChange={(e) => handleChange('tutar', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                        error={!!errors.tutar}
                        helperText={errors.tutar || "Tutar 0'dan büyük olmalıdır"}
                        sx={compactNumberFieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start"><CurrencyLira /></InputAdornment> }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <TextField
                        fullWidth
                        label="İşlem Tarihi"
                        type="date"
                        required
                        value={formData.tarih}
                        onChange={(e) => handleChange('tarih', e.target.value)}
                        sx={compactFieldSx}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><CalendarToday /></InputAdornment> }}
                      />
                    </Grid>

                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Açıklama"
                        multiline
                        rows={3}
                        value={formData.aciklama}
                        onChange={(e) => handleChange('aciklama', e.target.value)}
                        placeholder="İşlem hakkında notlar..."
                        sx={fieldSx}
                        InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: 1.5 }}><Description /></InputAdornment> }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {carilerError && (
                <Grid size={12}>
                  <Alert severity="error">Cariler yüklenirken bir hata oluştu.</Alert>
                </Grid>
              )}
            </Grid>
          </Box>

          <Box sx={{ display: { xs: 'none', lg: 'block' }, borderLeft: '1px solid var(--border)', bgcolor: 'var(--card)', p: 2 }}>
            <Typography variant="subtitle2" fontWeight={800} color="var(--foreground)">Virman Özeti</Typography>

            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 'var(--radius)', bgcolor: 'var(--background)', border: '1px solid var(--border)' }}>
              <Typography variant="caption" color="var(--muted-foreground)" fontWeight={700}>Mahsup Tutarı</Typography>
              <Typography variant="h6" fontWeight={900} sx={{ color: 'var(--info)', mt: 0.25 }}>
                {previewAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </Typography>
            </Box>

            <Box sx={{ mt: 1.5, display: 'grid', gap: 0.75 }}>
              {[
                ['Borçlu Cari', tahsilatCari ? `${tahsilatCari.cariKodu} - ${tahsilatCari.unvan}` : 'Seçilmedi'],
                ['Alacaklı Cari', odemeCari ? `${odemeCari.cariKodu} - ${odemeCari.unvan}` : 'Seçilmedi'],
                ['Tarih', formData.tarih || 'Seçilmedi'],
                ['Bakiye Etkisi', 'Kasa/banka etkilenmez'],
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

      <DialogActions sx={{ px: 2.5, py: 2, bgcolor: 'var(--card)', borderTop: '1px solid var(--border)' }}>
        <Button onClick={onClose} disabled={submitting} variant="outlined" size="small" sx={{ borderRadius: 'var(--radius)', textTransform: 'none', fontWeight: 700 }}>
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SwapHoriz />}
          sx={{
            borderRadius: 'var(--radius)',
            textTransform: 'none',
            fontWeight: 800,
            bgcolor: 'var(--info)',
            color: 'var(--info-foreground)',
            boxShadow: 'none',
            '&:hover': { bgcolor: 'color-mix(in srgb, var(--info) 85%, black)', boxShadow: 'none' },
          }}
        >
          {submitting ? 'İşleniyor...' : 'Virmanı Tamamla'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CaprazOdemeDialog;
