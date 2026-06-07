'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Chip,
  FormControlLabel,
  Checkbox,
  Pagination,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  PictureAsPdf,
  TableChart,
  CalendarMonth,
  Close,
  ReceiptLong,
} from '@mui/icons-material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';
import { StandardPage } from '@/components/common';
import MovementDetailBlock from '@/components/Cari/MovementDetailBlock';
import { normalizeAccount, formatMoney } from '@/components/Cari/cariHareket.shared';
import type { CariAccount } from '@/components/Cari/cariHareket.shared';
import type { DetailedStatementMovement } from '@/components/Cari/cariHareketDetail.shared';
import {
  buildDetailedStatementParams,
  DETAILED_STATEMENT_API,
  type DetailIncludeOptions,
} from '@/lib/cariDetailedStatement';

const PAGE_SIZE = 25;

export default function CariDetayliEkstrePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cariId = params.id as string;

  const [cari, setCari] = useState<CariAccount | null>(null);
  const [movements, setMovements] = useState<DetailedStatementMovement[]>([]);
  const [summary, setSummary] = useState<{
    totalDebit: number;
    totalCredit: number;
    netBalance: number;
    movementCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [baslangicTarihi, setBaslangicTarihi] = useState(
    () => searchParams.get('baslangic') ?? '',
  );
  const [bitisTarihi, setBitisTarihi] = useState(() => searchParams.get('bitis') ?? '');
  const [include, setInclude] = useState<DetailIncludeOptions>(() => ({
    invoiceLines: searchParams.get('invoiceLines') !== 'false',
    collections: searchParams.get('collections') !== 'false',
    checks: searchParams.get('checks') !== 'false',
  }));
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  const showSnackbar = useCallback(
    (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  const fetchCari = useCallback(async () => {
    try {
      const res = await axios.get(`/account/${cariId}`);
      setCari(normalizeAccount(res.data));
    } catch {
      showSnackbar('Cari bilgisi yüklenemedi', 'error');
    }
  }, [cariId, showSnackbar]);

  const fetchDetailed = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(DETAILED_STATEMENT_API.json, {
        params: buildDetailedStatementParams(cariId, baslangicTarihi, bitisTarihi, include),
      });
      setMovements(res.data.movements ?? []);
      setSummary(res.data.summary ?? null);
      if (res.data.account) {
        setCari(
          normalizeAccount({
            id: res.data.account.id,
            code: res.data.account.code,
            title: res.data.account.title,
            taxNumber: res.data.account.taxNumber,
            balance: res.data.account.balance,
          }),
        );
      }
      setPage(1);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Detaylı ekstre yüklenemedi';
      showSnackbar(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [cariId, baslangicTarihi, bitisTarihi, include, showSnackbar]);

  useEffect(() => {
    void fetchCari();
  }, [fetchCari]);

  useEffect(() => {
    void fetchDetailed();
  }, [fetchDetailed]);

  const paginatedMovements = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return movements.slice(start, start + PAGE_SIZE);
  }, [movements, page]);

  const pageCount = Math.max(1, Math.ceil(movements.length / PAGE_SIZE));
  const hasDateFilter = Boolean(baslangicTarihi || bitisTarihi);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportExcel = async () => {
    try {
      showSnackbar('Detaylı Excel indiriliyor...', 'info');
      const response = await axios.get(DETAILED_STATEMENT_API.excel, {
        params: buildDetailedStatementParams(cariId, baslangicTarihi, bitisTarihi, include),
        responseType: 'blob',
      });
      downloadBlob(
        new Blob([response.data]),
        `Cari_Detayli_Ekstre_${cari?.unvan ?? cariId}_${new Date().toISOString().split('T')[0]}.xlsx`,
      );
      showSnackbar('Excel indirildi', 'success');
    } catch {
      showSnackbar('Excel indirilemedi', 'error');
    }
  };

  const handleExportPdf = async () => {
    try {
      showSnackbar('Detaylı PDF hazırlanıyor...', 'info');
      const response = await axios.get(DETAILED_STATEMENT_API.pdf, {
        params: buildDetailedStatementParams(cariId, baslangicTarihi, bitisTarihi, include),
        responseType: 'blob',
      });
      downloadBlob(
        new Blob([response.data], { type: 'application/pdf' }),
        `Cari_Detayli_Ekstre_${cari?.unvan ?? cariId}_${new Date().toISOString().split('T')[0]}.pdf`,
      );
      showSnackbar('PDF indirildi', 'success');
    } catch {
      showSnackbar('PDF indirilemedi', 'error');
    }
  };

  return (
    <StandardPage title="">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid var(--border)',
            bgcolor: 'var(--card)',
            overflow: 'hidden',
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
                onClick={() => router.push(`/accounts/${cariId}`)}
                aria-label="Hareketlere dön"
              >
                <ArrowBack fontSize="small" />
              </IconButton>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                  Detaylı Ekstre — {cari?.unvan ?? '...'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cari?.cariKodu ?? ''}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} flexShrink={0}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<TableChart sx={{ fontSize: 18 }} />}
                onClick={() => void handleExportExcel()}
              >
                Excel
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<PictureAsPdf sx={{ fontSize: 18 }} />}
                onClick={() => void handleExportPdf()}
              >
                PDF
              </Button>
            </Stack>
          </Box>

          {summary && (
            <>
              <Divider />
              <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2">
                  Borç: <strong>{formatMoney(summary.totalDebit)}</strong>
                </Typography>
                <Typography variant="body2">
                  Alacak: <strong>{formatMoney(summary.totalCredit)}</strong>
                </Typography>
                <Typography variant="body2">
                  Bakiye: <strong>{formatMoney(summary.netBalance)}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {summary.movementCount} hareket
                </Typography>
              </Box>
            </>
          )}
        </Box>

        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid var(--border)',
            bgcolor: 'var(--card)',
            p: 2,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <ReceiptLong sx={{ color: 'var(--primary)', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight={800}>
                Filtreler
              </Typography>
              {hasDateFilter && (
                <Chip label="Tarih filtresi" size="small" variant="outlined" color="primary" />
              )}
            </Stack>

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
                <IconButton
                  size="small"
                  onClick={() => {
                    setBaslangicTarihi('');
                    setBitisTarihi('');
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Stack>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={include.invoiceLines}
                    onChange={(e) =>
                      setInclude((prev) => ({ ...prev, invoiceLines: e.target.checked }))
                    }
                    size="small"
                  />
                }
                label="Fatura kalemleri"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={include.collections}
                    onChange={(e) =>
                      setInclude((prev) => ({ ...prev, collections: e.target.checked }))
                    }
                    size="small"
                  />
                }
                label="Tahsilat / Ödeme"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={include.checks}
                    onChange={(e) =>
                      setInclude((prev) => ({ ...prev, checks: e.target.checked }))
                    }
                    size="small"
                  />
                }
                label="Çek / Senet"
              />
            </Stack>
          </Stack>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {paginatedMovements.map((mov) => (
              <MovementDetailBlock key={mov.id} movement={mov} />
            ))}
            {movements.length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                Seçili aralıkta hareket bulunamadı.
              </Typography>
            )}
            {movements.length > PAGE_SIZE && (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Stack>
        )}
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
