'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Language as LanguageIcon,
  AccessTime,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';
import StandardPage from '@/components/common/StandardPage';
import { StandardCard } from '@/components/common';

interface LocalizationSettings {
  timezone?: string;
  locale?: string;
  currency?: string;
}

const TIMEZONES = [
  { value: 'Europe/Istanbul', label: 'Europe/Istanbul (UTC+3)' },
  { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1)' },
  { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
];

const LOCALES = [
  { value: 'tr-TR', label: 'Türkçe (TR)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'de-DE', label: 'Deutsch (DE)' },
];

const CURRENCIES = [
  { value: 'TRY', label: 'Türk Lirası (TRY)' },
  { value: 'USD', label: 'Amerikan Doları (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'İngiliz Sterlini (GBP)' },
];

export default function LocalizationSettingsPage() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<LocalizationSettings>({
    timezone: 'Europe/Istanbul',
    locale: 'tr-TR',
    currency: 'TRY',
  });

  const { data: settings, isLoading } = useQuery<LocalizationSettings>({
    queryKey: ['tenant-settings'],
    queryFn: async () => {
      const response = await axios.get('/tenants/settings');
      return response.data;
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        timezone: settings.timezone || 'Europe/Istanbul',
        locale: settings.locale || 'tr-TR',
        currency: settings.currency || 'TRY',
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (data: LocalizationSettings) =>
      axios.put('/tenants/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-settings'] });
      enqueueSnackbar('Dil ve bölge ayarları kaydedildi', { variant: 'success' });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      enqueueSnackbar(
        error.response?.data?.message || 'Kayıt sırasında hata oluştu',
        { variant: 'error' },
      );
    },
  });

  const handleSelectChange =
    (field: keyof LocalizationSettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <StandardPage
        title="Dil ve Bölge"
        breadcrumbs={[
          { label: 'Ayarlar', href: '/settings' },
          { label: 'Dil ve Bölge' },
        ]}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </StandardPage>
    );
  }

  return (
    <StandardPage
      title="Dil ve Bölge"
      breadcrumbs={[
        { label: 'Ayarlar', href: '/settings' },
        { label: 'Dil ve Bölge' },
      ]}
    >
      <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
        Tarih, saat ve para birimi formatları bu ayarlara göre uygulanır. Firma
        bilgileri için{' '}
        <Typography
          component="a"
          href="/settings/company-settings"
          sx={{ fontWeight: 700, color: 'info.main' }}
        >
          Firma Ayarları
        </Typography>{' '}
        sayfasını kullanın.
      </Alert>

      <StandardCard>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              display: 'flex',
            }}
          >
            <LanguageIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Yerel Ayarlar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saat dilimi, dil ve varsayılan para birimi
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Saat Dilimi"
              fullWidth
              value={formData.timezone}
              onChange={handleSelectChange('timezone')}
              SelectProps={{ native: true }}
              InputProps={{
                startAdornment: (
                  <AccessTime sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                ),
              }}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Dil"
              fullWidth
              value={formData.locale}
              onChange={handleSelectChange('locale')}
              SelectProps={{ native: true }}
            >
              {LOCALES.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Para Birimi"
              fullWidth
              value={formData.currency}
              onChange={handleSelectChange('currency')}
              SelectProps={{ native: true }}
            >
              {CURRENCIES.map((cur) => (
                <option key={cur.value} value={cur.value}>
                  {cur.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Box>
      </StandardCard>
    </StandardPage>
  );
}
