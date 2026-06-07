'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  InputAdornment,
  Grid,
  Stack,
  CircularProgress,
  Chip,
  alpha,
} from '@mui/material';
import {
  ManageHistory,
  Refresh,
  Save,
  Search,
  Inventory2Outlined,
  AutoAwesome,
  HistoryOutlined
} from '@mui/icons-material';
import { StandardPage, StandardCard } from '@/components/common';
import { useTheme } from '@mui/material/styles';
import axios from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';
import TableSkeleton from '@/components/Loading/TableSkeleton';
import { PurchasePriceDialog } from '@/components/PurchasePriceDialog';

interface Stok {
  id: string;
  stokKodu: string;
  stokAdi: string;
  marka?: string | null;
  satisFiyati: number;
  alisFiyati: number;
}

const formatDateOnly = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export default function SatinAlmaFiyatlariPage() {
  const theme = useTheme();
  const [stoklar, setStoklar] = useState<Stok[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>(
    { open: false, message: '', severity: 'success' }
  );
  const [draftPrices, setDraftPrices] = useState<Record<string, string>>({});
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [selectedStok, setSelectedStok] = useState<Stok | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    void fetchStoklar();
  }, [debouncedSearch]);

  const fetchStoklar = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/products', {
        params: {
          limit: 200,
          search: debouncedSearch || undefined,
        },
      });
      const items: Stok[] = response.data?.data ?? [];
      setStoklar(items);
      setDraftPrices((prev) => {
        const next: Record<string, string> = { ...prev };
        items.forEach((stok) => {
          if (next[stok.id] === undefined) {
            next[stok.id] = Number(stok.alisFiyati ?? 0).toString();
          }
        });
        return next;
      });
    } catch (error) {
      console.error('Satın alma fiyatları alınamadı', error);
      setSnackbar({ open: true, severity: 'error', message: 'Satın alma fiyatları yüklenirken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (stokId: string, value: string) => {
    setDraftPrices((prev) => ({ ...prev, [stokId]: value }));
  };

  const handleOpenPriceDialog = (stok: Stok) => {
    setSelectedStok(stok);
    setPriceDialogOpen(true);
  };

  const handlePriceDialogClose = () => {
    setPriceDialogOpen(false);
    setSelectedStok(null);
  };

  const handleSavePrice = async (stok: Stok) => {
    const rawValue = draftPrices[stok.id];
    const parsed = Number(rawValue);
    if (Number.isNaN(parsed) || parsed < 0) {
      setSnackbar({ open: true, severity: 'error', message: 'Geçerli bir fiyat giriniz.' });
      return;
    }

    setSavingId(stok.id);
    try {
      const now = new Date();
      await axios.post('/price-cards', {
        stokId: stok.id,
        type: 'PURCHASE',
        price: parsed,
        effectiveFrom: formatDateOnly(now),
        note: `Hızlı guncelleme • ${now.toLocaleString('tr-TR')}`,
      });
      setSnackbar({ open: true, severity: 'success', message: `${stok.stokKodu} için satın alma fiyatı güncellendi.` });
      setStoklar((prev) =>
        prev.map((item) => (item.id === stok.id ? { ...item, alisFiyati: parsed } : item))
      );
      setDraftPrices((prev) => ({ ...prev, [stok.id]: parsed.toString() }));
      await fetchStoklar();
    } catch (error: any) {
      console.error('Satın alma fiyatı güncellenemedi', error);
      const message = error?.response?.data?.message ?? 'Fiyat güncellenirken hata oluştu.';
      setSnackbar({ open: true, severity: 'error', message });
    } finally {
      setSavingId(null);
    }
  };

  const filteredStoklar = useMemo(() => stoklar, [stoklar]);

  return (
    <StandardPage
      title="Satın Alma Fiyatları"
      subtitle="Ürün satın alma fiyatlarını takip edin ve güncelleyin"
      actions={
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchStoklar}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Yenile
        </Button>
      }
    >
      {/* İstatistik ve Arama */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StandardCard>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: alpha(theme.palette.secondary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Inventory2Outlined color="secondary" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="800">
                  {stoklar.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Toplam Ürün
                </Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
        <Grid item xs={12} md={8}>
          <StandardCard sx={{ height: '100%', display: 'flex', alignItems: 'center', py: 1 }}>
            <TextField
              fullWidth
              placeholder="Stok kodu veya adına göre ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </StandardCard>
        </Grid>
      </Grid>

      {/* Tablo */}
      <StandardCard sx={{ p: 0, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(10px)' }}>
                  Stok Bilgisi
                </TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(10px)' }}>
                  Marka
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(10px)' }}>
                  Güncel Alış Fiyatı
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(10px)', width: 160 }}>
                  Yeni Fiyat
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.background.paper, 0.8), backdropFilter: 'blur(10px)', width: 140 }}>
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableSkeleton rows={8} columns={5} />
              ) : filteredStoklar.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Box sx={{ textAlign: 'center', opacity: 0.5 }}>
                      <AutoAwesome sx={{ fontSize: 48, mb: 1, color: 'text.disabled' }} />
                      <Typography color="text.secondary">Kayıt bulunamadı</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStoklar.map((stok) => {
                  const draft = draftPrices[stok.id] ?? stok.alisFiyati?.toString() ?? '';
                  const hasChanged = Number(draft) !== Number(stok.alisFiyati);

                  return (
                    <TableRow
                      key={stok.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="body2" fontWeight={700} color="primary">
                          {stok.stokKodu}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="div">
                          {stok.stokAdi}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {stok.marka ? (
                          <Chip
                            label={stok.marka}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: 'info.main',
                              borderRadius: 1.5
                            }}
                          />
                        ) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700}>
                          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(stok.alisFiyati ?? 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={draft}
                          onChange={(e) => handlePriceChange(stok.id, e.target.value)}
                          inputProps={{
                            min: 0,
                            step: 0.01,
                            style: { textAlign: 'right', fontWeight: 700 }
                          }}
                          sx={{
                            width: 140,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: hasChanged ? alpha(theme.palette.warning.main, 0.05) : 'transparent',
                              borderColor: hasChanged ? 'warning.main' : 'divider',
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Fiyatı Kaydet">
                            <span>
                              <IconButton
                                size="small"
                                color="success"
                                disabled={savingId === stok.id || !hasChanged}
                                onClick={() => handleSavePrice(stok)}
                                sx={{
                                  bgcolor: alpha(theme.palette.success.main, 0.1),
                                  '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                                }}
                              >
                                {savingId === stok.id ? <CircularProgress size={16} /> : <Save fontSize="small" />}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Fiyat Geçmişini Gör">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenPriceDialog(stok)}
                              sx={{
                                color: 'text.secondary',
                                bgcolor: alpha(theme.palette.action.hover, 0.1),
                                '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.2) }
                              }}
                            >
                              <HistoryOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </StandardCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <PurchasePriceDialog
        open={priceDialogOpen}
        stok={selectedStok}
        onClose={handlePriceDialogClose}
        onPriceCreated={(newPrice) => {
          if (!selectedStok) return;
          setDraftPrices((prev) => ({ ...prev, [selectedStok.id]: newPrice.toString() }));
          setStoklar((prev) =>
            prev.map((item) => (item.id === selectedStok.id ? { ...item, alisFiyati: newPrice } : item))
          );
        }}
      />
    </StandardPage>
  );
}
