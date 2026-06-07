'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  ArrowBack,
  PictureAsPdf,
  TableChart,
  CalendarMonth,
  Close,
  ReceiptLong,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  SwapHoriz,
  OpenInNew,
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { StandardPage } from '@/components/common';
import CariHareketDataGrid from '@/components/Cari/CariHareketDataGrid';
import {
  type CariAccount,
  type CariHareket,
  normalizeMovements,
  normalizeAccount,
  filterByDateRange,
  computeTotals,
  formatMoney,
} from '@/components/Cari/cariHareket.shared';
import {
  buildDetailedStatementParams,
  buildSummaryStatementParams,
  DETAILED_STATEMENT_API,
  accountSummaryExportPath,
  type DetailIncludeOptions,
} from '@/lib/cariDetailedStatement';

function KpiTile({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: 'debit' | 'credit' | 'balance' | 'neutral';
  icon: React.ReactNode;
}) {
  const toneColor =
    tone === 'debit'
      ? 'var(--destructive)'
      : tone === 'credit'
        ? 'var(--chart-2)'
        : tone === 'balance'
          ? 'var(--primary)'
          : 'var(--muted-foreground)';

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 2,
        borderRadius: 2,
        border: '1px solid var(--border)',
        bgcolor: `color-mix(in srgb, ${toneColor} 6%, var(--card))`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `color-mix(in srgb, ${toneColor} 14%, transparent)`,
          color: toneColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
          {label}
        </Typography>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ color: toneColor, lineHeight: 1.2, fontSize: '1.1rem' }}
          noWrap
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CariDetayPage() {
  const params = useParams();
  const router = useRouter();
  const cariId = params.id as string;

  const [cari, setCari] = useState<CariAccount | null>(null);
  const [hareketler, setHareketler] = useState<CariHareket[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });
  const [expandedHareketId, setExpandedHareketId] = useState<string | null>(null);
  const [baslangicTarihi, setBaslangicTarihi] = useState('');
  const [bitisTarihi, setBitisTarihi] = useState('');
  const [ekstreMode, setEkstreMode] = useState<'summary' | 'detailed'>('summary');
  const [detailInclude, setDetailInclude] = useState<DetailIncludeOptions>({
    invoiceLines: true,
    collections: true,
    checks: true,
  });

  const showSnackbar = useCallback(
    (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  const fetchCari = useCallback(async () => {
    try {
      const response = await axios.get(`/account/${cariId}`);
      setCari(normalizeAccount(response.data ?? {}));
    } catch {
      showSnackbar('Cari bilgisi yüklenemedi', 'error');
    }
  }, [cariId, showSnackbar]);

  const fetchHareketler = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/account/${cariId}/movements`, {
        params: { limit: 1000 },
      });
      const raw = response.data?.data ?? response.data ?? [];
      const normalized = Array.isArray(raw) ? normalizeMovements(raw) : [];
      normalized.sort((a, b) => {
        const dateA = new Date(a.tarih).getTime();
        const dateB = new Date(b.tarih).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.id.localeCompare(b.id);
      });
      setHareketler(normalized);
    } catch {
      showSnackbar('Hareketler yüklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  }, [cariId, showSnackbar]);

  useEffect(() => {
    void fetchCari();
    void fetchHareketler();
  }, [fetchCari, fetchHareketler]);

  const filteredHareketler = useMemo(
    () => filterByDateRange(hareketler, baslangicTarihi, bitisTarihi),
    [hareketler, baslangicTarihi, bitisTarihi],
  );

  const totals = useMemo(() => computeTotals(filteredHareketler), [filteredHareketler]);

  const currentBakiye =
    cari?.bakiye && cari.bakiye !== ''
      ? parseFloat(cari.bakiye)
      : totals.alacak - totals.borc;

  const hasDateFilter = Boolean(baslangicTarihi || bitisTarihi);

  const downloadExport = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportPrefix =
    ekstreMode === 'detailed' ? 'Cari_Detayli_Ekstre' : 'Cari_Ekstre';
  const dateSuffix = new Date().toISOString().split('T')[0];

  const handleExportExcel = async () => {
    try {
      showSnackbar('Excel indiriliyor...', 'info');
      const isDetailed = ekstreMode === 'detailed';
      const response = await axios.get(
        isDetailed ? DETAILED_STATEMENT_API.excel : accountSummaryExportPath(cariId, 'excel'),
        {
          params: isDetailed
            ? buildDetailedStatementParams(cariId, baslangicTarihi, bitisTarihi, detailInclude)
            : buildSummaryStatementParams(baslangicTarihi, bitisTarihi),
          responseType: 'blob',
        },
      );
      downloadExport(
        new Blob([response.data]),
        `${exportPrefix}_${cari?.unvan}_${dateSuffix}.xlsx`,
      );
      showSnackbar('Excel indirildi', 'success');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Excel indirilemedi';
      showSnackbar(msg, 'error');
    }
  };

  const handleExportPdf = async () => {
    try {
      showSnackbar('PDF hazırlanıyor...', 'info');
      const isDetailed = ekstreMode === 'detailed';
      const response = await axios.get(
        isDetailed ? DETAILED_STATEMENT_API.pdf : accountSummaryExportPath(cariId, 'pdf'),
        {
          params: isDetailed
            ? buildDetailedStatementParams(cariId, baslangicTarihi, bitisTarihi, detailInclude)
            : buildSummaryStatementParams(baslangicTarihi, bitisTarihi),
          responseType: 'blob',
        },
      );
      downloadExport(
        new Blob([response.data], { type: 'application/pdf' }),
        `${exportPrefix}_${cari?.unvan}_${dateSuffix}.pdf`,
      );
      showSnackbar('PDF indirildi', 'success');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'PDF indirilemedi';
      showSnackbar(msg, 'error');
    }
  };

  const openDetailedStatement = () => {
    const q = new URLSearchParams();
    if (baslangicTarihi) q.set('baslangic', baslangicTarihi);
    if (bitisTarihi) q.set('bitis', bitisTarihi);
    if (!detailInclude.invoiceLines) q.set('invoiceLines', 'false');
    if (!detailInclude.collections) q.set('collections', 'false');
    if (!detailInclude.checks) q.set('checks', 'false');
    const qs = q.toString();
    router.push(`/accounts/${cariId}/detailed-statement${qs ? `?${qs}` : ''}`);
  };

  const clearDateFilter = () => {
    setBaslangicTarihi('');
    setBitisTarihi('');
  };

  if (!cari && loading) {
    return (
      <StandardPage title="Cari Hesap Hareketleri">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </StandardPage>
    );
  }

  if (!cari) {
    return (
      <StandardPage title="Cari Hesap Hareketleri">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">Cari hesap bulunamadı.</Typography>
          <Button sx={{ mt: 2 }} onClick={() => router.push('/accounts')}>
            Listeye dön
          </Button>
        </Box>
      </StandardPage>
    );
  }

  return (
    <StandardPage title="">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Üst başlık */}
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid var(--border)',
            bgcolor: 'var(--card)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 2.5 },
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
              <IconButton
                size="small"
                onClick={() => router.push('/accounts')}
                aria-label="Cari listesine dön"
                sx={{ color: 'text.secondary' }}
              >
                <ArrowBack fontSize="small" />
              </IconButton>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  noWrap
                  title={cari.unvan}
                  sx={{ lineHeight: 1.3, fontSize: '1.05rem' }}
                >
                  {cari.unvan}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {cari.cariKodu}
                  {cari.vergiNo ? ` · ${cari.vergiNo}` : ''}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="column" spacing={1} alignItems="flex-end" flexShrink={0}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={ekstreMode}
                onChange={(_, v) => v && setEkstreMode(v)}
              >
                <ToggleButton value="summary" sx={{ textTransform: 'none', px: 1.5 }}>
                  Özet
                </ToggleButton>
                <ToggleButton value="detailed" sx={{ textTransform: 'none', px: 1.5 }}>
                  Detaylı
                </ToggleButton>
              </ToggleButtonGroup>
              {ekstreMode === 'detailed' && (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="flex-end">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={detailInclude.invoiceLines}
                        onChange={(e) =>
                          setDetailInclude((p) => ({ ...p, invoiceLines: e.target.checked }))
                        }
                      />
                    }
                    label={<Typography variant="caption">Fatura</Typography>}
                    sx={{ mr: 0 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={detailInclude.collections}
                        onChange={(e) =>
                          setDetailInclude((p) => ({ ...p, collections: e.target.checked }))
                        }
                      />
                    }
                    label={<Typography variant="caption">Tahsilat</Typography>}
                    sx={{ mr: 0 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={detailInclude.checks}
                        onChange={(e) =>
                          setDetailInclude((p) => ({ ...p, checks: e.target.checked }))
                        }
                      />
                    }
                    label={<Typography variant="caption">Çek</Typography>}
                    sx={{ mr: 0 }}
                  />
                </Stack>
              )}
              <Stack direction="row" spacing={1} alignItems="center">
              <Button
                size="small"
                variant="text"
                startIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                onClick={openDetailedStatement}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Görüntüle
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<TableChart sx={{ fontSize: 18 }} />}
                onClick={() => void handleExportExcel()}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'color-mix(in srgb, var(--chart-2) 40%, var(--border))',
                  color: 'var(--chart-2)',
                  '&:hover': {
                    borderColor: 'var(--chart-2)',
                    bgcolor: 'color-mix(in srgb, var(--chart-2) 8%, transparent)',
                  },
                }}
              >
                Excel
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<PictureAsPdf sx={{ fontSize: 18 }} />}
                onClick={() => void handleExportPdf()}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'color-mix(in srgb, var(--destructive) 35%, var(--border))',
                  color: 'var(--destructive)',
                  '&:hover': {
                    borderColor: 'var(--destructive)',
                    bgcolor: 'color-mix(in srgb, var(--destructive) 8%, transparent)',
                  },
                }}
              >
                PDF
              </Button>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          {/* KPI şeridi */}
          <Box
            sx={{
              px: { xs: 1.5, md: 2 },
              py: 1.5,
              display: 'flex',
              gap: 1.5,
              flexWrap: 'wrap',
            }}
          >
            <KpiTile
              label="Toplam Borç"
              value={formatMoney(totals.borc)}
              tone="debit"
              icon={<TrendingUp sx={{ fontSize: 20 }} />}
            />
            <KpiTile
              label="Toplam Alacak"
              value={formatMoney(totals.alacak)}
              tone="credit"
              icon={<TrendingDown sx={{ fontSize: 20 }} />}
            />
            <KpiTile
              label="Güncel Bakiye"
              value={formatMoney(currentBakiye, { signed: currentBakiye < 0 })}
              tone="balance"
              icon={<AccountBalanceWallet sx={{ fontSize: 20 }} />}
            />
            <KpiTile
              label="Hareket"
              value={String(filteredHareketler.length)}
              tone="neutral"
              icon={<SwapHoriz sx={{ fontSize: 20 }} />}
            />
          </Box>
        </Box>

        {/* Hareketler paneli */}
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid var(--border)',
            bgcolor: 'var(--card)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 520,
          }}
        >
          {/* Araç çubuğu */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              borderBottom: '1px solid var(--border)',
              bgcolor: 'color-mix(in srgb, var(--muted) 35%, transparent)',
            }}
          >
            <ReceiptLong sx={{ color: 'var(--primary)', fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight={800}>
              Hesap Hareketleri
            </Typography>
            {hasDateFilter && (
              <Chip
                label="Filtre aktif"
                size="small"
                color="primary"
                variant="outlined"
                onDelete={clearDateFilter}
              />
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <CalendarMonth sx={{ fontSize: 18, color: 'text.secondary' }} />
              <TextField
                type="date"
                size="small"
                label="Başlangıç"
                value={baslangicTarihi}
                onChange={(e) => setBaslangicTarihi(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 150 }}
              />
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
              <TextField
                type="date"
                size="small"
                label="Bitiş"
                value={bitisTarihi}
                onChange={(e) => setBitisTarihi(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 150 }}
              />
              {hasDateFilter && (
                <Tooltip title="Tarih filtresini temizle">
                  <IconButton size="small" onClick={clearDateFilter}>
                    <Close fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>

          {/* Grid */}
          <Box sx={{ flex: 1, minHeight: 460, width: '100%' }}>
            <CariHareketDataGrid
              hareketler={filteredHareketler}
              loading={loading}
              expandedHareketId={expandedHareketId}
              onToggleExpand={(id) =>
                setExpandedHareketId((prev) => (prev === id ? null : id))
              }
            />
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StandardPage>
  );
}
