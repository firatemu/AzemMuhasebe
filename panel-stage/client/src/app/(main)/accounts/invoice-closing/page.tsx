'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Autocomplete,
  TextField,
  CircularProgress,
  Grid,
  Stack,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { AccountBalance, TrendingUp, TrendingDown, Receipt, CheckCircle, Warning } from '@mui/icons-material';
import axios from '@/lib/axios';
import { StandardPage, StandardCard } from '@/components/common';
import { alpha, useTheme } from '@mui/material/styles';

interface Account {
  id: string;
  code: string;
  title: string;
  tip: string;
  balance: number;
}

interface FaturaDetay {
  id: string;
  invoiceNo: string;
  invoiceType: string;
  date: string;
  dueDate: string | null;
  grandTotal: number;
  paidAmount: number;
  payableAmount: number;
  status: string;
  invoiceCollections: Array<{
    id: string;
    amount: number;
    collection: {
      id: string;
      date: string;
      type: string;
      paymentType: string;
    };
  }>;
}

export default function FaturaKapatmaPage() {
  const [cariler, setCariler] = useState<Account[]>([]);
  const [selectedCari, setSelectedCari] = useState<Account | null>(null);
  const [faturalar, setFaturalar] = useState<FaturaDetay[]>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchCariler();
  }, []);

  useEffect(() => {
    if (selectedCari) {
      fetchCariFaturalar(selectedCari.id);
    }
  }, [selectedCari]);

  const fetchCariler = async () => {
    try {
      const response = await axios.get('/account', {
        params: { limit: 1000 },
      });
      setCariler(response.data.data || []);
    } catch (error) {
      console.error('Cariler yüklenirken hata:', error);
    }
  };

  const fetchCariFaturalar = async (accountId: string) => {
    try {
      setLoading(true);
      const response = await axios.get('/invoices', {
        params: {
          accountId,
          page: 1,
          limit: 100,
        },
      });
      setFaturalar(response.data.data || []);
    } catch (error) {
      console.error('Faturalar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const getDurumColor = (status: string): any => {
    switch (status) {
      case 'CLOSED': return 'success';
      case 'PARTIALLY_PAID': return 'info';
      case 'OPEN': return 'warning';
      case 'APPROVED': return 'warning';
      default: return 'default';
    }
  };

  const getDurumText = (status: string) => {
    switch (status) {
      case 'CLOSED': return 'Kapalı';
      case 'PARTIALLY_PAID': return 'Kısmen Ödendi';
      case 'OPEN': return 'Açık';
      case 'APPROVED': return 'Onaylandı';
      case 'DRAFT': return 'Taslak';
      case 'CANCELLED': return 'İptal';
      default: return status;
    }
  };

  const getOdemeTipiText = (tip: string) => {
    const types: any = {
      CASH: 'Nakit',
      CREDIT_CARD: 'Kredi Kartı',
      BANK_TRANSFER: 'Havale',
      CHECK: 'Çek',
      PROMISSORY_NOTE: 'Senet',
      GIFT_CARD: 'Hediye Kartı',
    };
    return types[tip] || tip;
  };

  const ozet = {
    toplamFatura: faturalar.reduce((sum, f) => sum + Number(f.grandTotal || 0), 0),
    toplamOdenen: faturalar.reduce((sum, f) => sum + Number(f.paidAmount || 0), 0),
    toplamKalan: faturalar.reduce((sum, f) => sum + Number(f.payableAmount || 0), 0),
    acikFaturaSayisi: faturalar.filter(f => f.status === 'OPEN' || f.status === 'APPROVED').length,
    kismenOdenenSayisi: faturalar.filter(f => f.status === 'PARTIALLY_PAID').length,
    kapaliSayisi: faturalar.filter(f => f.status === 'CLOSED').length,
  };

  const tahsilatAnalizi = useMemo(() => {
    const tumOdemeler = faturalar.flatMap(f => f.invoiceCollections);

    if (tumOdemeler.length === 0) {
      return {
        ortalamaTahsilat: 0,
        odemeSayisi: 0,
        odemeSikligiGun: 0,
      };
    }

    const toplamTahsilat = tumOdemeler.reduce((sum, oc) => sum + Number(oc.amount || 0), 0);
    const ortalamaTahsilat = toplamTahsilat / tumOdemeler.length;

    const odemeTarihleri = tumOdemeler
      .map(oc => new Date(oc.collection.date).getTime())
      .sort((a, b) => a - b);

    if (odemeTarihleri.length >= 2) {
      const ilkOdeme = odemeTarihleri[0];
      const sonOdeme = odemeTarihleri[odemeTarihleri.length - 1];
      const gunFarki = (sonOdeme - ilkOdeme) / (1000 * 60 * 60 * 24);
      const odemeSikligiGun = gunFarki / (odemeTarihleri.length - 1);

      return {
        ortalamaTahsilat,
        odemeSayisi: tumOdemeler.length,
        odemeSikligiGun,
      };
    }

    return {
      ortalamaTahsilat,
      odemeSayisi: tumOdemeler.length,
      odemeSikligiGun: 0,
    };
  }, [faturalar]);

  return (
    <StandardPage title="Fatura Kapatma & Ekstre">
      {/* Cari Seçimi */}
      <StandardCard sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Cari Seçimi
        </Typography>
        <Autocomplete
          options={cariler}
          getOptionLabel={(option) => `${option.code} - ${option.title}`}
          value={selectedCari}
          onChange={(_, newValue) => setSelectedCari(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cari Seçiniz"
              variant="outlined"
              placeholder="Cari kodu veya ünvanı ile ara..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <Box component="li" key={key} {...otherProps}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {option.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.code} • {option.tip === 'MUSTERI' ? 'Müşteri' : 'Tedarikçi'}
                      </Typography>
                    </Box>
                    <Chip
                      label={formatCurrency(option.balance)}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: option.balance > 0 ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                        color: option.balance > 0 ? theme.palette.error.main : theme.palette.success.main,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          }}
          noOptionsText="Cari bulunamadı"
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </StandardCard>

      {selectedCari && (
        <>
          {/* Özet Kartlar */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Toplam Fatura', value: ozet.toplamFatura, icon: Receipt, color: theme.palette.primary.main, subText: `${faturalar.length} adet` },
              { label: 'Ödenen', value: ozet.toplamOdenen, icon: CheckCircle, color: theme.palette.success.main, subText: `${ozet.kapaliSayisi} fatura kapalı` },
              { label: 'Kalan', value: ozet.toplamKalan, icon: Warning, color: theme.palette.error.main, subText: `${ozet.acikFaturaSayisi + ozet.kismenOdenenSayisi} açık` },
              { label: 'Cari Bakiye', value: selectedCari.balance, icon: AccountBalance, color: theme.palette.warning.main, subText: selectedCari.tip === 'MUSTERI' ? 'Alacak' : 'Borç' },
              { label: 'Ort. Tahsilat', value: tahsilatAnalizi.ortalamaTahsilat, icon: TrendingUp, color: theme.palette.secondary.main, subText: `${tahsilatAnalizi.odemeSayisi} ödeme` },
              { label: 'Ödeme Sıklığı', value: `${tahsilatAnalizi.odemeSikligiGun.toFixed(1)} gün`, icon: TrendingDown, color: '#ec4899', subText: 'Ortalama aralık', isCurrency: false },
            ].map((item, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 2 }}>
                <StandardCard>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <item.icon sx={{ color: item.color, fontSize: 20 }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography variant="h6" fontWeight="800" sx={{ color: item.color }}>
                    {item.isCurrency === false ? item.value : formatCurrency(item.value as number)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.subText}
                  </Typography>
                </StandardCard>
              </Grid>
            ))}
          </Grid>

          {/* Fatura Listesi */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Fatura No</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tip</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Vade</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Toplam</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Ödenen</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Kalan</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Ödeme %</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Durum</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Tahsilat Detayı</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {faturalar.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          Bu cari için fatura bulunamadı.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    faturalar.map((fatura) => {
                      const grandTotal = Number(fatura.grandTotal || 0);
                      const paidAmount = Number(fatura.paidAmount || 0);
                      const payableAmount = Number(fatura.payableAmount || 0);
                      const paymentRate = grandTotal > 0
                        ? (paidAmount / grandTotal) * 100
                        : 0;

                      return (
                        <TableRow
                          key={fatura.id}
                          hover
                          sx={{
                            bgcolor: fatura.status === 'CLOSED' ? alpha(theme.palette.success.main, 0.02) : 'inherit',
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {fatura.invoiceNo}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={fatura.invoiceType === 'SALE' || fatura.invoiceType === 'SALE_RETURN' ? 'Satış' : 'Alış'}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                bgcolor: (fatura.invoiceType === 'SALE' || fatura.invoiceType === 'SALE_RETURN')
                                  ? alpha(theme.palette.primary.main, 0.1)
                                  : alpha(theme.palette.secondary.main, 0.1),
                                color: (fatura.invoiceType === 'SALE' || fatura.invoiceType === 'SALE_RETURN')
                                  ? theme.palette.primary.main
                                  : theme.palette.secondary.main,
                              }}
                            />
                          </TableCell>
                          <TableCell>{formatDate(fatura.date)}</TableCell>
                          <TableCell>
                            {fatura.dueDate ? (
                              <Box>
                                <Typography variant="body2">{formatDate(fatura.dueDate)}</Typography>
                                {new Date(fatura.dueDate) < new Date() && fatura.status !== 'CLOSED' && (
                                  <Typography variant="caption" color="error" fontWeight="600">
                                    Vadesi geçmiş!
                                  </Typography>
                                )}
                              </Box>
                            ) : '-'}
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="700">
                              {formatCurrency(grandTotal)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="700" color="success.main">
                              {formatCurrency(paidAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              fontWeight="700"
                              color={payableAmount > 0 ? 'error.main' : 'text.secondary'}
                            >
                              {formatCurrency(payableAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ width: 80, mx: 'auto' }}>
                              <Tooltip title={`${paymentRate.toFixed(1)}% ödendi`}>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(paymentRate, 100)}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: paymentRate >= 100 ? theme.palette.success.main : paymentRate > 0 ? theme.palette.primary.main : theme.palette.grey[400],
                                    }
                                  }}
                                />
                              </Tooltip>
                              <Typography variant="caption" color="text.secondary" align="center" display="block">
                                {paymentRate.toFixed(0)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={getDurumText(fatura.status)}
                              color={getDurumColor(fatura.status)}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                              icon={fatura.status === 'CLOSED' ? <CheckCircle fontSize="small" /> : undefined}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {fatura.invoiceCollections.length > 0 ? (
                              <Tooltip
                                title={
                                  <Box sx={{ p: 0.5 }}>
                                    <Typography variant="caption" fontWeight="bold" display="block" sx={{ mb: 1 }}>
                                      Tahsilat Geçmişi:
                                    </Typography>
                                    {fatura.invoiceCollections.map((fc, idx) => (
                                      <Typography key={fc.id} variant="caption" display="block">
                                        {idx + 1}. {formatDate(fc.collection.date)} - {formatCurrency(fc.amount)} ({getOdemeTipiText(fc.collection.paymentType)})
                                      </Typography>
                                    ))}
                                  </Box>
                                }
                                arrow
                              >
                                <Chip
                                  label={`${fatura.invoiceCollections.length} ödeme`}
                                  size="small"
                                  sx={{
                                    cursor: 'pointer',
                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                    color: theme.palette.info.main,
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                                  }}
                                />
                              </Tooltip>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Özet Çubuk */}
          {faturalar.length > 0 && (
            <StandardCard sx={{ mt: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                      Fatura Durumu
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={`${ozet.acikFaturaSayisi} Açık`}
                        color="warning"
                        size="small"
                        variant="outlined"
                        sx={{ bgcolor: alpha(theme.palette.warning.main, 0.08), fontWeight: 600 }}
                      />
                      <Chip
                        label={`${ozet.kismenOdenenSayisi} Kısmen`}
                        color="info"
                        size="small"
                        variant="outlined"
                        sx={{ bgcolor: alpha(theme.palette.info.main, 0.08), fontWeight: 600 }}
                      />
                      <Chip
                        label={`${ozet.kapaliSayisi} Kapalı`}
                        color="success"
                        size="small"
                        variant="outlined"
                        sx={{ bgcolor: alpha(theme.palette.success.main, 0.08), fontWeight: 600 }}
                      />
                    </Stack>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                      Ödeme Durumu
                    </Typography>
                    <Box sx={{ position: 'relative', height: 32 }}>
                      <LinearProgress
                        variant="determinate"
                        value={ozet.toplamFatura > 0 ? (ozet.toplamOdenen / ozet.toplamFatura) * 100 : 0}
                        sx={{
                          height: 32,
                          borderRadius: '12px',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: theme.palette.primary.main,
                            borderRadius: '12px',
                          }
                        }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight="800"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: theme.palette.common.white,
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        }}
                      >
                        {formatCurrency(ozet.toplamOdenen)} / {formatCurrency(ozet.toplamFatura)}
                        ({((ozet.toplamOdenen / ozet.toplamFatura) * 100).toFixed(1)}%)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </StandardCard>
          )}
        </>
      )}

      {/* Cari Seçilmediğinde */}
      {!selectedCari && (
        <StandardCard sx={{ p: 8, textAlign: 'center' }}>
          <AccountBalance sx={{ fontSize: 80, color: theme.palette.divider, mb: 2, opacity: 0.2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
            Cari Seçiniz
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fatura kapatma ve ekstre görüntülemek için yukarıdan bir cari seçin
          </Typography>
        </StandardCard>
      )}
    </StandardPage>
  );
}