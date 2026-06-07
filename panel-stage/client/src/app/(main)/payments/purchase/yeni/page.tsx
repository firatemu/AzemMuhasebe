'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTabStore } from '@/stores/tabStore';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Description,
  AccountBalanceWallet,
  Payments,
  CalendarToday,
  Receipt,
} from '@mui/icons-material';
import axios from '@/lib/axios';
import MainLayout from '@/components/Layout/MainLayout';

interface Cari {
  id: string;
  code?: string;
  title: string;
}

interface Fatura {
  id: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  account: Cari;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
}

interface Bank {
  id: string;
  name: string;
  accountNumber?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const numberInputSx = {
  '& input[type=number]': { MozAppearance: 'textfield' },
  '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
  '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
};

export function PurchasePaymentForm({ onBack }: { onBack?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const faturaId = searchParams.get('faturaId');
  const { addTab, setActiveTab } = useTabStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fatura, setFatura] = useState<Fatura | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  const [formData, setFormData] = useState({
    faturaId: faturaId || '',
    odemeTipi: 'HAVALE' as 'HAVALE' | 'NAKIT' | 'KREDI_KARTI' | 'CEK' | 'SENET',
    bankaId: '',
    tarih: new Date().toISOString().split('T')[0],
    tutar: 0,
    aciklama: '',
    referansNo: '',
    vade: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    addTab({
      id: 'payment-purchase-yeni',
      label: 'Yeni Satın Alma Ödemesi',
      path: '/payments/purchase/yeni'
    });
    setActiveTab('payment-purchase-yeni');

    if (faturaId) {
      fetchFatura(faturaId);
    }
    fetchBanks();
  }, [faturaId]);

  const fetchFatura = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/invoices/${id}`);
      const faturaData = response.data;

      if (faturaData.invoiceType !== 'PURCHASE') {
        showSnackbar('Bu bir satın alma faturası değil', 'error');
        return;
      }

      setFatura(faturaData);
      setFormData(prev => ({
        ...prev,
        faturaId: id,
        tutar: faturaData.remainingAmount || faturaData.grandTotal,
        vade: faturaData.dueDate ? new Date(faturaData.dueDate).toISOString().split('T')[0] : prev.vade,
      }));
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Fatura yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await axios.get('/banks?active=true');
      setBanks(response.data || []);
    } catch (error) {
      console.error('Bankalar yüklenirken hata:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async () => {
    try {
      if (!formData.faturaId) {
        showSnackbar('Fatura seçimi zorunludur', 'error');
        return;
      }
      if (formData.tutar <= 0) {
        showSnackbar('Tutar 0\'dan büyük olmalıdır', 'error');
        return;
      }
      if (formData.odemeTipi === 'HAVALE' && !formData.bankaId) {
        showSnackbar('Havale için banka seçimi zorunludur', 'error');
        return;
      }

      setSaving(true);
      const payload = {
        invoiceId: formData.faturaId,
        paymentType: formData.odemeTipi,
        bankId: formData.bankaId || null,
        date: new Date(formData.tarih).toISOString(),
        amount: Number(formData.tutar),
        dueDate: new Date(formData.vade).toISOString(),
        notes: formData.aciklama || null,
        reference: formData.referansNo || null,
      };

      await axios.post('/payments', payload);
      showSnackbar('Ödeme başarıyla kaydedildi', 'success');

      setTimeout(() => {
        router.push('/invoice/purchase');
      }, 1500);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Ödeme kaydedilirken hata oluştu', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <>
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => onBack ? onBack() : router.back()} sx={{ bgcolor: 'var(--secondary)' }}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">Yeni Satın Alma Ödemesi</Typography>
              <Typography variant="body2" color="text.secondary">
                {fatura ? `${fatura.invoiceNo} - ${fatura.account?.title}` : 'Ödeme Kaydı'}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saving}
            sx={{
              bgcolor: 'var(--chart-2)',
              color: 'var(--chart-2-foreground)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: 'var(--chart-2-hover)' },
            }}
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', bgcolor: 'var(--card)' }}>
        <Stack spacing={3}>
          <Tabs value={tabValue} onChange={(_, nv) => setTabValue(nv)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Ödeme Bilgileri" icon={<Payments sx={{ fontSize: 18 }} />} iconPosition="start" />
            <Tab label="Fatura Bilgileri" icon={<Receipt sx={{ fontSize: 18 }} />} iconPosition="start" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {/* Fatura Özeti Kartı */}
            {fatura && (
              <Card
                variant="outlined"
                sx={{
                  mb: 3,
                  bgcolor: 'color-mix(in srgb, var(--chart-2) 10%, transparent)',
                  borderColor: 'var(--chart-2)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Receipt sx={{ color: 'var(--chart-2)', fontSize: 32 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold">{fatura.invoiceNo}</Typography>
                      <Typography variant="body2" color="text.secondary">{fatura.account?.title}</Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Fatura Tutarı:</Typography>
                      <Typography variant="body1" fontWeight="600">{formatCurrency(fatura.grandTotal)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Ödenen:</Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ color: 'var(--chart-3)' }}>
                        {formatCurrency(fatura.paidAmount || 0)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Kalan:</Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ color: 'var(--destructive)' }}>
                        {formatCurrency(fatura.remainingAmount || fatura.grandTotal)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="caption" color="text.secondary">Vade:</Typography>
                      <Typography variant="body1" fontWeight="600">
                        {new Date(fatura.dueDate || fatura.date).toLocaleDateString('tr-TR')}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Ödeme Formu */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Ödeme Tarihi"
                  value={formData.tarih}
                  onChange={(e) => setFormData(prev => ({ ...prev, tarih: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  className="form-control-textfield"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth className="form-control-select">
                  <InputLabel>Ödeme Tipi</InputLabel>
                  <Select
                    value={formData.odemeTipi}
                    onChange={(e) => setFormData(prev => ({ ...prev, odemeTipi: e.target.value as any }))}
                    label="Ödeme Tipi"
                  >
                    <MenuItem value="HAVALE">Havale/EFT</MenuItem>
                    <MenuItem value="NAKIT">Nakit</MenuItem>
                    <MenuItem value="KREDI_KARTI">Kredi Kartı</MenuItem>
                    <MenuItem value="CEK">Çek</MenuItem>
                    <MenuItem value="SENET">Senet</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth className="form-control-select" disabled={formData.odemeTipi !== 'HAVALE'}>
                  <InputLabel>Banka</InputLabel>
                  <Select
                    value={formData.bankaId}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankaId: e.target.value }))}
                    label="Banka"
                  >
                    <MenuItem value="">
                      <em>Seçiniz</em>
                    </MenuItem>
                    {banks.map((bank) => (
                      <MenuItem key={bank.id} value={bank.id}>
                        {bank.name} {bank.accountNumber ? `(${bank.accountNumber})` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tutar (₺)"
                  value={formData.tutar}
                  onChange={(e) => setFormData(prev => ({ ...prev, tutar: parseFloat(e.target.value) || 0 }))}
                  InputProps={{
                    startAdornment: <AccountBalanceWallet sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  className="form-control-textfield"
                  sx={numberInputSx}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Vade Tarihi"
                  value={formData.vade}
                  onChange={(e) => setFormData(prev => ({ ...prev, vade: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  className="form-control-textfield"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Referans No"
                  value={formData.referansNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, referansNo: e.target.value }))}
                  placeholder="Makbuz/Seri No"
                  className="form-control-textfield"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Açıklama / Notlar"
              value={formData.aciklama}
              onChange={(e) => setFormData(prev => ({ ...prev, aciklama: e.target.value }))}
              className="form-control-textfield"
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {fatura ? (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Fatura No:</Typography>
                    <Typography variant="body1" fontWeight="bold">{fatura.invoiceNo}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Tarih:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {new Date(fatura.date).toLocaleDateString('tr-TR')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Vade Tarihi:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {fatura.dueDate ? new Date(fatura.dueDate).toLocaleDateString('tr-TR') : '-'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Durum:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {fatura.status === 'APPROVED' ? 'Onaylandı' : fatura.status === 'OPEN' ? 'Açık' : fatura.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Cari:</Typography>
                    <Typography variant="body1" fontWeight="bold">{fatura.account?.title}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ bgcolor: 'var(--muted)', p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Ara Toplam:</Typography>
                    <Typography variant="body2">{formatCurrency(fatura.totalAmount)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">KDV Toplamı:</Typography>
                    <Typography variant="body2">{formatCurrency(fatura.vatAmount)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">Genel Toplam:</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--chart-2)' }}>
                      {formatCurrency(fatura.grandTotal)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: 'var(--chart-3)' }}>Ödenen:</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--chart-3)' }}>
                      {formatCurrency(fatura.paidAmount || 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'var(--destructive)', fontWeight: 600 }}>Kalan:</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--destructive)', fontWeight: 600 }}>
                      {formatCurrency(fatura.remainingAmount || fatura.grandTotal)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Fatura bilgisi yükleniyor...
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Stack>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(p => ({ ...p, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}

export default function YeniSatinAlmaOdemePage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }>
        <PurchasePaymentForm />
      </Suspense>
    </MainLayout>
  );
}
