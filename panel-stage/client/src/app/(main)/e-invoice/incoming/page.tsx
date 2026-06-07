'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  Grid,
  Stack,
  alpha,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CloudDownload as DownloadIcon,
  CheckCircle as SuccessIcon,
  VpnKey as KeyIcon,
  FilterAlt as FilterIcon,
  Error as ErrorIcon,
  Sync as SyncIcon,
  CalendarMonth as DateIcon,
  Cable as ConnectionIcon
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import IncomingGrid from '@/components/efatura/IncomingGrid';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

export default function GelenEFaturaPage() {
  const theme = useTheme();
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isGettingToken, setIsGettingToken] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const { data: tokenStatus, refetch: refetchTokenStatus, isLoading: isTokenLoading } = useQuery({
    queryKey: ['hizli-token-status'],
    queryFn: async () => {
      const response = await axios.get('/hizli/token-status');
      return response.data;
    },
    refetchInterval: 60000,
  });

  const handleRefresh = async () => {
    setLastRefresh(new Date());
    await refetchTokenStatus();
    window.dispatchEvent(new CustomEvent('refresh-incoming-grid', {
      detail: { startDate, endDate }
    }));
  };

  const handleDateFilter = () => {
    setFilterError(null);
    if (!startDate || !endDate) {
      setFilterError('Lütfen başlangıç ve bitiş tarihlerini seçin.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start > end) {
      setFilterError('Başlangıç tarihi bitiş tarihinden sonra olamaz.');
      return;
    }
    if (end > today) {
      setFilterError('Bitiş tarihi bugünden sonra olamaz.');
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const maxDays = 180;

    if (diffDays > maxDays) {
      setFilterError(`Tarih aralığı en fazla 6 ay (${maxDays} gün) olabilir.`);
      return;
    }

    window.dispatchEvent(new CustomEvent('refresh-incoming-grid', {
      detail: { startDate, endDate }
    }));
  };

  const handleGetToken = async () => {
    setIsGettingToken(true);
    setTokenError(null);
    try {
      const response = await axios.post('/hizli/auto-login');
      if (response.data.success) {
        await refetchTokenStatus();
        window.dispatchEvent(new Event('refresh-incoming-grid'));
      } else {
        // Backend endpoint henüz aktif değil
        setTokenError(response.data.message || 'Token alınamadı');
      }
    } catch (error: any) {
      console.error('Token error:', error);
      setTokenError(error.response?.data?.message || 'Token yenileme işlemi başarısız');
    } finally {
      setIsGettingToken(false);
    }
  };

  return (
    <StandardPage
      title="Gelen E-Faturalar"
      breadcrumbs={[{ label: 'E-Fatura', href: '/e-invoice/incoming' }, { label: 'Gelen Kutusu' }]}
      headerActions={
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ fontWeight: 700, borderRadius: 3 }}
          >
            Yenile
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
          >
            Faturaları Çek
          </Button>
        </Stack>
      }
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 700 }}>
          Hızlı Teknoloji entegratörü üzerinden gelen faturalarınızı burada listeleyebilir, ERP sistemine aktarabilir veya PDF olarak görüntüleyebilirsiniz.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Connection Status Card */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
                  <ConnectionIcon fontSize="small" />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Entegratör Bağlantısı</Typography>
              </Stack>

              {!tokenStatus ? (
                <Chip label="Kontrol Ediliyor..." color="warning" size="small" sx={{ fontWeight: 800 }} />
              ) : tokenStatus.isValid ? (
                <Chip icon={<SuccessIcon />} label="Bağlantı Aktif" color="success" size="small" sx={{ fontWeight: 800 }} />
              ) : (
                <Chip icon={<ErrorIcon />} label="Bağlantı Yok" color="error" size="small" sx={{ fontWeight: 800 }} />
              )}
            </Box>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Entegratör</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>Hızlı Teknoloji AS</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Oturum Anahtarı (Token)</Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>Son geçerlilik: {tokenStatus?.expiresAt ? new Date(tokenStatus.expiresAt).toLocaleTimeString('tr-TR') : '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tokenStatus?.isValid && <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>{tokenStatus.token?.substring(0, 12)}...</Typography>}
                  <Button
                    variant="text"
                    size="small"
                    startIcon={isGettingToken ? <CircularProgress size={14} /> : <KeyIcon sx={{ fontSize: 16 }} />}
                    onClick={handleGetToken}
                    disabled={isGettingToken}
                    sx={{ fontWeight: 800, textTransform: 'none' }}
                  >
                    {isGettingToken ? 'Alınıyor...' : 'Yenile'}
                  </Button>
                </Box>
              </Box>
              {tokenError && (
                <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setTokenError(null)}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{tokenError}</Typography>
                </Alert>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Date Filter Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.background.paper, 0.4), height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main', display: 'flex' }}>
                <FilterIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Tarih Aralığı</Typography>
            </Box>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Başlangıç"
                  type="date"
                  size="small"
                  value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  onChange={(e: any) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Bitiş"
                  type="date"
                  size="small"
                  value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SyncIcon />}
                onClick={handleDateFilter}
                sx={{ borderRadius: 2.5, fontWeight: 700 }}
              >
                Filtreyi Uygula ve Sorgula
              </Button>
              {filterError && <Typography variant="caption" color="error" sx={{ fontWeight: 700, textAlign: 'center' }}>{filterError}</Typography>}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Grid Status Info */}
      <Box sx={{ px: 2, py: 1.5, mb: 2, borderRadius: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderLeft: '4px solid', borderColor: 'info.main', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'info.main' }}>
          {lastRefresh ? `Son sorgulama: ${lastRefresh.toLocaleTimeString('tr-TR')}` : 'Faturaları listelemek için yenile veya filtrele butonunu kullanın.'}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Maximum sorgu aralığı: 180 Gün
        </Typography>
      </Box>

      {/* Main Grid Container */}
      <Paper variant="outlined" sx={{ p: 0, borderRadius: 4, overflow: 'hidden', minHeight: 600, border: '1px solid', borderColor: 'divider' }}>
        <IncomingGrid startDate={startDate} endDate={endDate} />
      </Paper>
    </StandardPage>
  );
}
