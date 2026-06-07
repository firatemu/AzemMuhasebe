'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
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
  Button,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  InputAdornment,
  Stack,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Checkbox,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  Delete, Save, LocalShipping, Description,
  AccountBalanceWallet,
  QrCodeScanner,
  Add,
  ArrowBack,
} from '@mui/icons-material';
import DocumentItemTable from '@/components/Form/DocumentItemTable';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTabStore } from '@/stores/tabStore';
import { useInvoiceDraftStore } from '@/stores/invoiceDraftStore';
import MainLayout from '@/components/Layout/MainLayout';

interface Cari {
  id: string;
  cariKodu: string;
  unvan: string;
  tip: string;
  vadeSuresi?: number;
}

interface Stok {
  id: string;
  stokKodu: string;
  stokAdi: string;
  birim: string;
  satisFiyati: number;
  alisFiyati: number;
  kdvOrani: number;
  barkod?: string;
  miktar: number;
}

interface FaturaKalemi {
  stokId: string;
  stok?: Stok;
  miktar: number;
  birimFiyat: number;
  kdvOrani: number;
  iskontoOran: number;
  iskontoTutar: number;
  birim?: string;
  cokluIskonto?: boolean;
  iskontoFormula?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`return-tabpanel-${index}`}
      aria-labelledby={`return-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const numberInputSx = {
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
};

interface OdemePlaniItem {
  id?: string;
  vade: string;
  tutar: number;
  odemeTipi: string;
  aciklama?: string;
}

export function AlisIadeFaturaForm({ faturaId: editFaturaId, onBack }: { faturaId?: string; onBack?: () => void }) {
  const router = useRouter();
  const isEdit = Boolean(editFaturaId);
  const [isMounted, setIsMounted] = useState(false);
  const { addTab, removeTab, setActiveTab } = useTabStore();

  useEffect(() => {
    setIsMounted(true);
    if (!isEdit) {
      addTab({
        id: 'purchase-return-invoice-yeni',
        label: 'Yeni Alış İade Faturası',
        path: '/invoice/return/purchase/yeni'
      });
      setActiveTab('purchase-return-invoice-yeni');
    }
  }, []);

  const [cariler, setCariler] = useState<Cari[]>([]);
  const [stoklar, setStoklar] = useState<Stok[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFatura, setLoadingFatura] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const { drafts, updateDraft, clearDraft } = useInvoiceDraftStore();
  const draft = drafts.purchase_return;
  const [formData, setFormData] = useState(
    draft || {
      invoiceNo: '',
      invoiceType: 'PURCHASE_RETURN' as const,
      accountId: '',
      warehouseId: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'APPROVED' as 'DRAFT' | 'PENDING' | 'APPROVED',
      genelIskontoOran: 0,
      genelIskontoTutar: 0,
      notes: '',
      items: [] as FaturaKalemi[],
      eScenario: 'TICARI_FATURA',
      odemePlani: [] as OdemePlaniItem[],
    }
  );

  // Update store whenever formData changes
  useEffect(() => {
    if (!editFaturaId) {
      updateDraft('purchase_return', formData);
    }
  }, [formData, editFaturaId, updateDraft]);

  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [barcode, setBarcode] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Ödeme Planı Dialog state
  const [odemePlaniDialogOpen, setOdemePlaniDialogOpen] = useState(false);
  const [odemePlaniItems, setOdemePlaniItems] = useState<OdemePlaniItem[]>([]);
  const [editingOdemePlaniIndex, setEditingOdemePlaniIndex] = useState<number | null>(null);
  const [newOdemePlaniItem, setNewOdemePlaniItem] = useState<OdemePlaniItem>({
    vade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tutar: 0,
    odemeTipi: 'NAKIT',
    aciklama: '',
  });

  const odemeTipOptions = [
    { label: 'Nakit', value: 'NAKIT' },
    { label: 'Kredi Kartı', value: 'KREDI_KARTI' },
    { label: 'Banka Havalesi', value: 'BANKA_HAVALESI' },
    { label: 'Çek', value: 'CEK' },
    { label: 'Senet', value: 'ENVIZ' },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toNumEdit = (v: any): number => {
    if (v == null || v === '') return 0;
    const n = Number(v);
    return Number.isNaN(n) ? 0 : n;
  };

  const toInputDate = (value: any, fallback = ''): string => {
    if (!value) return fallback;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return fallback;
    return d.toISOString().split('T')[0];
  };

  const fetchFatura = async () => {
    if (!editFaturaId) return;
    try {
      setLoadingFatura(true);
      const response = await axios.get(`/invoices/${editFaturaId}`);
      const fatura = response.data;
      setFormData(prev => ({
        ...prev,
        invoiceNo: fatura.invoiceNo || '',
        invoiceType: fatura.invoiceType || 'PURCHASE_RETURN',
        accountId: fatura.accountId || '',
        warehouseId: String(fatura.warehouseId || ''),
        status: fatura.status,
        date: toInputDate(fatura.date, prev.date),
        dueDate: toInputDate(fatura.dueDate, ''),
        genelIskontoTutar: toNumEdit(fatura.discount),
        notes: fatura.notes || '',
        items: (fatura.items || []).map((k: any) => ({
          stokId: k.productId,
          stok: k.product ? {
            id: k.product.id,
            stokKodu: k.product.code,
            stokAdi: k.product.name,
            alisFiyati: toNumEdit(k.product.purchasePrice),
            kdvOrani: toNumEdit(k.product.vatRate),
            miktar: 0,
          } : undefined,
          miktar: toNumEdit(k.quantity),
          birimFiyat: toNumEdit(k.unitPrice),
          kdvOrani: toNumEdit(k.vatRate),
          iskontoOran: toNumEdit(k.discountRate),
          iskontoTutar: toNumEdit(k.discountAmount),
          birim: k.unit || 'ADET',
        })),
      }));
    } catch (error: any) {
      showSnackbar('Fatura yüklenirken hata oluştu', 'error');
      onBack?.();
    } finally {
      setLoadingFatura(false);
    }
  };

  useEffect(() => {
    fetchCariler();
    fetchStoklar();
    fetchWarehouses();

    if (isEdit) fetchFatura();
    else generateFaturaNo();
  }, [editFaturaId, isEdit]);

  const fetchCariler = async () => {
    try {
      const response = await axios.get('/account', { params: { limit: 1000 } });
      setCariler((response.data.data || []).map((c: any) => ({
        ...c,
        cariKodu: c.code,
        unvan: c.title,
        vadeSuresi: c.dueDays || 0,
      })));
    } catch (error) { console.error('Cariler error:', error); }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/warehouses?active=true');
      setWarehouses(response.data || []);
      if (response.data.length > 0 && !formData.warehouseId) {
        setFormData(prev => ({ ...prev, warehouseId: response.data.find((w: any) => w.isDefault)?.id || response.data[0].id }));
      }
    } catch (error) { console.error('Warehouse error:', error); }
  };

  const fetchStoklar = async () => {
    try {
      const response = await axios.get('/products', { params: { limit: 2000 } });
      setStoklar((response.data.data || []).map((s: any) => ({
        ...s,
        stokKodu: s.code,
        stokAdi: s.name,
        barkod: s.barcode,
        miktar: s.quantity ?? 0,
        kdvOrani: s.vatRate || 20,
        birim: s.unit || 'ADET',
      })));
    } catch (error) { console.error('Stoklar error:', error); }
  };

  const generateFaturaNo = async () => {
    try {
      const res = await axios.get('/code-templates/preview-code/INVOICE_PURCHASE_RETURN');
      if (res.data?.nextCode) { setFormData(p => ({ ...p, invoiceNo: res.data.nextCode })); return; }
    } catch (e) { }
    setFormData(p => ({ ...p, invoiceNo: `AIF-${new Date().getFullYear()}-001` }));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleHandleFaturaNo = async (val: string) => {
    setFormData(p => ({ ...p, invoiceNo: val }));
    if (!isEdit && val) try { await axios.post('/code-templates/save-manual-code/INVOICE_PURCHASE_RETURN', { code: val }); } catch (e) { }
  };

  const handleAddKalem = (stokId?: string) => {
    const newItem: any = {
      stokId: stokId || '',
      miktar: 1,
      birimFiyat: 0,
      kdvOrani: 20,
      iskontoOran: 0,
      iskontoTutar: 0,
      birim: 'ADET',
    };

    if (stokId) {
      const stok = stoklar.find(s => s.id === stokId);
      if (stok) {
        newItem.birimFiyat = stok.alisFiyati || 0;
        newItem.kdvOrani = stok.kdvOrani;
        newItem.birim = stok.birim;
      }
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const totals = useMemo(() => {
    let araToplam = 0, toplamKalemIskontosu = 0, toplamKdv = 0;
    formData.items.forEach(k => {
      const lineAra = k.miktar * k.birimFiyat;
      araToplam += lineAra;
      toplamKalemIskontosu += k.iskontoTutar;
      toplamKdv += ((lineAra - k.iskontoTutar) * k.kdvOrani / 100);
    });
    const genelIskonto = Number(formData.genelIskontoTutar) || 0;
    const netToplam = araToplam - toplamKalemIskontosu - genelIskonto;
    return {
      araToplam,
      toplamKalemIskontosu,
      genelIskonto,
      toplamIskonto: toplamKalemIskontosu + genelIskonto,
      toplamKdv,
      netToplam,
      genelToplam: netToplam + toplamKdv
    };
  }, [formData.items, formData.genelIskontoTutar]);

  // Ödeme Planı handlers
  const handleOpenOdemePlani = () => {
    setOdemePlaniItems(formData.odemePlani.length > 0 ? [...formData.odemePlani] : [{
      vade: formData.dueDate,
      tutar: totals.genelToplam,
      odemeTipi: 'NAKIT',
      aciklama: '',
    }]);
    setOdemePlaniDialogOpen(true);
  };

  const handleSaveOdemePlani = () => {
    setFormData(prev => ({ ...prev, odemePlani: odemePlaniItems }));
    setOdemePlaniDialogOpen(false);
    showSnackbar('Ödeme planı kaydedildi', 'success');
  };

  const handleAddOdemePlaniItem = () => {
    setOdemePlaniItems(prev => [...prev, { ...newOdemePlaniItem, id: Date.now().toString() }]);
    setNewOdemePlaniItem({
      vade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tutar: 0,
      odemeTipi: 'NAKIT',
      aciklama: '',
    });
  };

  const handleUpdateOdemePlaniItem = (index: number, field: keyof OdemePlaniItem, value: any) => {
    setOdemePlaniItems(prev => {
      const updated = [...prev];
      if (field === 'odemeTipi') {
        updated[index] = { ...updated[index], odemeTipi: value.value };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleDeleteOdemePlaniItem = (index: number) => {
    setOdemePlaniItems(prev => prev.filter((_, i) => i !== index));
  };

  const odemePlaniToplam = odemePlaniItems.reduce((sum, item) => sum + (Number(item.tutar) || 0), 0);

  const handleBarcodeSubmit = () => {
    if (!barcode) return;
    const stok = stoklar.find(s => s.barkod === barcode.trim());
    if (stok) {
      const existingIndex = formData.items.findIndex(k => k.stokId === stok.id);
      if (existingIndex > -1) {
        const newItems = [...formData.items];
        newItems[existingIndex].miktar += 1;
        setFormData(prev => ({ ...prev, items: newItems }));
      } else {
        const newItem: FaturaKalemi = {
          stokId: stok.id,
          stok: stok,
          miktar: 1,
          birimFiyat: stok.alisFiyati || 0,
          kdvOrani: stok.kdvOrani,
          iskontoOran: 0,
          iskontoTutar: 0,
          birim: stok.birim,
        };
        setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
      }
      setBarcode('');
      showSnackbar(`${stok.stokAdi} eklendi`, 'success');
    } else {
      showSnackbar('Barkod bulunamadı', 'error');
    }
  };

  const handleGenelIskontoOranChange = (value: number) => {
    const oran = Number(value) || 0;
    const tutar = (totals.araToplam - totals.toplamKalemIskontosu) * oran / 100;
    setFormData(prev => ({ ...prev, genelIskontoOran: oran, genelIskontoTutar: tutar }));
  };

  const handleGenelIskontoTutarChange = (value: number) => {
    const tutar = Number(value) || 0;
    const oran = (totals.araToplam - totals.toplamKalemIskontosu) > 0
      ? (tutar / (totals.araToplam - totals.toplamKalemIskontosu)) * 100
      : 0;
    setFormData(prev => ({ ...prev, genelIskontoTutar: tutar, genelIskontoOran: oran }));
  };

  const handleSave = async () => {
    try {
      if (!formData.accountId || !formData.warehouseId) { showSnackbar('Cari ve Ambar seçimi zorunludur', 'error'); return; }
      const valid = formData.items.filter(k => k.stokId);
      if (valid.length === 0) { showSnackbar('En az bir kalem eklemelisiniz', 'error'); return; }

      setLoading(true);
      const payload = {
        invoiceNo: formData.invoiceNo,
        type: 'PURCHASE_RETURN',
        accountId: formData.accountId,
        date: new Date(formData.date).toISOString(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        discount: Number(formData.genelIskontoTutar) || 0,
        notes: formData.notes || null,
        status: formData.status,
        warehouseId: formData.warehouseId,
        items: valid.map(k => ({
          productId: k.stokId,
          quantity: Number(k.miktar),
          unitPrice: Number(k.birimFiyat),
          vatRate: Number(k.kdvOrani),
          discountRate: Number(k.iskontoOran) || 0,
          discountAmount: Number(k.iskontoTutar) || 0,
          unit: k.birim || null,
        })),
        paymentPlan: formData.odemePlani.map(p => ({
          dueDate: new Date(p.vade).toISOString(),
          amount: Number(p.tutar),
          paymentType: p.odemeTipi,
          notes: p.aciklama || null,
        })),
      };

      if (isEdit) await axios.put(`/invoices/${editFaturaId}`, payload);
      else await axios.post('/invoices', payload);

      showSnackbar(`Fatura başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}`, 'success');
      if (!isEdit) clearDraft('purchase_return');
      removeTab(isEdit ? `purchase-return-invoice-edit-${editFaturaId}` : 'purchase-return-invoice-yeni');
      addTab({ id: 'purchase-invoice', label: 'Satın Alma Faturaları', path: '/invoice/purchase' });
      setActiveTab('purchase-invoice');
      setTimeout(() => router.push('/invoice/purchase'), 1500);
    } catch (e: any) {
      showSnackbar(e.response?.data?.message || 'Hata oluştu', 'error');
    } finally { setLoading(false); }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  if (isEdit && loadingFatura) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!isMounted) return null;

  return (
    <>
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Back Icon Button removed */}
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" sx={{ color: 'var(--foreground)' }}>
                {isEdit ? 'Alış İade Faturası Düzenle' : 'Yeni Alış İade Faturası'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.invoiceNo || 'Fatura No'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isEdit && formData.status !== 'APPROVED' && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: 'DRAFT' }));
                  setTimeout(handleSave, 100);
                }}
                disabled={loading}
              >
                Taslak Olarak Kaydet
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              onClick={() => {
                if (formData.status !== 'APPROVED') {
                  setFormData(prev => ({ ...prev, status: 'APPROVED' }));
                }
                setTimeout(handleSave, 100);
              }}
              disabled={loading || (isEdit && formData.status === 'APPROVED')}
              sx={{
                bgcolor: formData.status === 'APPROVED' ? 'var(--muted)' : 'var(--ring)',
                color: formData.status === 'APPROVED' ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
              }}
            >
              {loading ? 'Kaydediliyor...' : (formData.status === 'APPROVED' ? 'Fatura Onaylandı' : 'Kaydet')}
            </Button>
          </Box>
        </Box>
      </Box>

      <Paper sx={{ p: 0, borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', bgcolor: 'var(--card)', overflow: 'hidden' }}>
        <Stack spacing={0}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tabs value={tabValue} onChange={(_, nv) => setTabValue(nv)} sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minHeight: 48,
              }
            }}>
              <Tab label="Genel Bilgiler" icon={<Description sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab label="e-Dönüşüm" icon={<Description sx={{ fontSize: 18 }} />} iconPosition="start" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    disabled={!!editFaturaId && formData.status === 'APPROVED'}
                    fullWidth
                    label="Fatura No"
                    value={formData.invoiceNo}
                    onChange={e => setFormData(p => ({ ...p, invoiceNo: e.target.value }))}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    disabled={!!editFaturaId && formData.status === 'APPROVED'}
                    fullWidth
                    type="date"
                    label="Tarih"
                    value={formData.date}
                    onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    disabled={!!editFaturaId && formData.status === 'APPROVED'}
                    fullWidth
                    type="date"
                    label="Vade"
                    value={formData.dueDate}
                    onChange={e => setFormData(p => ({ ...p, dueDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    disabled={!!editFaturaId && formData.status === 'APPROVED'}
                    fullWidth
                    options={cariler}
                    getOptionLabel={o => `${o.cariKodu} - ${o.unvan}`}
                    value={cariler.find(c => c.id === formData.accountId) || null}
                    onChange={(_, v) => {
                      // Cari seçildiğinde vade gününü hesapla
                      if (v?.vadeSuresi && formData.date) {
                        const tarih = new Date(formData.date);
                        tarih.setDate(tarih.getDate() + (v.vadeSuresi || 0));
                        const vadeTarihi = tarih.toISOString().split('T')[0];
                        setFormData(p => ({ ...p, accountId: v?.id || '', dueDate: vadeTarihi }));
                      } else {
                        setFormData(p => ({ ...p, accountId: v?.id || '' }));
                      }
                    }}
                    renderInput={params => <TextField {...params} label="Cari Tedarikçi" required />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Ambar</InputLabel>
                    <Select
                      disabled={!!editFaturaId && formData.status === 'APPROVED'}
                      value={formData.warehouseId}
                      onChange={e => setFormData(p => ({ ...p, warehouseId: e.target.value }))}
                      label="Ambar"
                    >
                      {warehouses.map(w => (
                        <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ border: '1px solid var(--border)', borderRadius: 1, overflow: 'hidden', mt: 3 }}>
                <Box sx={{ p: 2, bgcolor: 'var(--muted)', display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    disabled={!!editFaturaId && formData.status === 'APPROVED'}
                    size="small"
                    label="Barkod Okut"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleBarcodeSubmit()}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <QrCodeScanner />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    disabled={!!editFaturaId && formData.status === 'APPROVED'}
                    variant="outlined"
                    startIcon={<AccountBalanceWallet />}
                    onClick={handleOpenOdemePlani}
                  >
                    Ödeme Planı {formData.odemePlani.length > 0 && `(${formData.odemePlani.length})`}
                  </Button>
                </Box>
                <DocumentItemTable
                  disabled={!!editFaturaId && formData.status === 'APPROVED'}
                  kalemler={formData.items}
                  stoklar={stoklar}
                  onChange={ni => setFormData(p => ({ ...p, items: ni }))}
                  cariId={formData.accountId}
                  onSnackbar={(m, s) => setSnackbar({ open: true, message: m, severity: s })}
                />
              </Box>

              <Box sx={{ mt: 3, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <TextField
                      disabled={!!editFaturaId && formData.status === 'APPROVED'}
                      label="Genel İskonto %"
                      type="number"
                      value={formData.genelIskontoOran || ''}
                      onChange={e => handleGenelIskontoOranChange(Number(e.target.value))}
                      sx={{ ...numberInputSx, width: 150 }}
                    />
                    <TextField
                      disabled={!!editFaturaId && formData.status === 'APPROVED'}
                      label="Genel İskonto (₺)"
                      type="number"
                      value={formData.genelIskontoTutar || ''}
                      onChange={e => handleGenelIskontoTutarChange(Number(e.target.value))}
                      sx={{ ...numberInputSx, width: 150 }}
                    />
                  </Box>
                  <TextField
                    disabled={!!editFaturaId && formData.status === 'APPROVED'}
                    fullWidth
                    multiline
                    rows={3}
                    label="Açıklama / Notlar"
                    value={formData.notes}
                    onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  />
                </Box>

                <Paper variant="outlined" sx={{ width: isMobile ? '100%' : 350, p: 2, bgcolor: 'var(--card)' }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Ara Toplam</Typography>
                      <Typography variant="body2" fontWeight={500}>{formatCurrency(totals.araToplam)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Kalem İskonto</Typography>
                      <Typography variant="body2" fontWeight={500}>{formatCurrency(totals.toplamKalemIskontosu)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Genel İskonto</Typography>
                      <Typography variant="body2" fontWeight={500}>{formatCurrency(formData.genelIskontoTutar)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">KDV Toplam</Typography>
                      <Typography variant="body2" fontWeight={500}>{formatCurrency(totals.toplamKdv)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">Genel Toplam</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">{formatCurrency(totals.genelToplam)}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="body2" color="text.secondary">e-Dönüşüm ayarları varsayılan olarak seçilmiştir.</Typography>
            </TabPanel>
          </Box>
        </Stack>
      </Paper>

      {/* Ödeme Planı Dialogu */}
      <Dialog
        open={odemePlaniDialogOpen}
        onClose={() => setOdemePlaniDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 'var(--radius)' } }}
      >
        <DialogTitle sx={{ pb: 1 }}>Ödeme Planı</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Vade</TableCell>
                    <TableCell align="right">Tutar</TableCell>
                    <TableCell>Ödeme Tipi</TableCell>
                    <TableCell>Açıklama</TableCell>
                    <TableCell align="right">İşlem</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {odemePlaniItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          type="date"
                          size="small"
                          value={item.vade}
                          onChange={(e) => handleUpdateOdemePlaniItem(index, 'vade', e.target.value)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={item.tutar}
                          onChange={(e) => handleUpdateOdemePlaniItem(index, 'tutar', Number(e.target.value))}
                          sx={{ width: 120 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={item.odemeTipi}
                          onChange={(e) => handleUpdateOdemePlaniItem(index, 'odemeTipi', { value: e.target.value })}
                        >
                          {odemeTipOptions.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={item.aciklama || ''}
                          onChange={(e) => handleUpdateOdemePlaniItem(index, 'aciklama', e.target.value)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => handleDeleteOdemePlaniItem(index)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button variant="outlined" startIcon={<Add />} onClick={handleAddOdemePlaniItem}>Ekle</Button>
            <Box sx={{ flex: 1 }} />
            {Math.abs(odemePlaniToplam - totals.genelToplam) > 0.01 && (
              <Alert severity="warning" sx={{ py: 0 }}>Fark: {formatCurrency(Math.abs(odemePlaniToplam - totals.genelToplam))}</Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOdemePlaniDialogOpen(false)}>İptal</Button>
          <Button onClick={handleSaveOdemePlani} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(p => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function YeniAlisIadeFaturasiPage() {
  return (
    <MainLayout>
      <Suspense fallback={<CircularProgress />}>
        <AlisIadeFaturaForm />
      </Suspense>
    </MainLayout>
  );
}
