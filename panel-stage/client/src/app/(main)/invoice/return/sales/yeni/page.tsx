'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
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
  DialogContentText,
  Chip,
  CircularProgress,
  Checkbox,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Delete, Save, ArrowBack, Add as AddIcon,
  LocalShipping, AccountBalanceWallet, QrCodeScanner, Description,
} from '@mui/icons-material';
import MainLayout from '@/components/Layout/MainLayout';
import DocumentItemTable from '@/components/Form/DocumentItemTable';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTabStore } from '@/stores/tabStore';
import { useInvoiceDraftStore } from '@/stores/invoiceDraftStore';

const TEVKIFAT_KODLARI = [
  { kod: '601', ad: 'Yapım İşleri (2/10)', oran: 0.2 },
  { kod: '602', ad: 'Etüt, Plan-Proje (9/10)', oran: 0.9 },
  { kod: '603', ad: 'Makine Bakım Onarım (7/10)', oran: 0.7 },
  { kod: '604', ad: 'Yemek Servis (5/10)', oran: 0.5 },
  { kod: '605', ad: 'Danışmanlık (9/10)', oran: 0.9 },
  { kod: '606', ad: 'Temizlik Hizmetleri (7/10)', oran: 0.7 },
  { kod: '607', ad: 'Güvenlik Hizmetleri (7/10)', oran: 0.7 },
  { kod: '608', ad: 'Taşımacılık Hizmetleri (2/10)', oran: 0.2 },
  { kod: '609', ad: 'İşgücü Temini (9/10)', oran: 0.9 },
  { kod: '610', ad: 'Yapı Denetim (9/10)', oran: 0.9 },
  { kod: '611', ad: 'Fason Tekstil (5/10)', oran: 0.5 },
  { kod: '612', ad: 'Turistik Mağazalar (5/10)', oran: 0.5 },
  { kod: '624', ad: 'Ticari Reklam Hizmetleri (3/10)', oran: 0.3 },
];

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
      id={`fatura-tabpanel-${index}`}
      aria-labelledby={`fatura-tab-${index}`}
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

interface Cari {
  id: string;
  cariKodu: string;
  unvan: string;
  tip: string;
  dueDays?: number;
}

interface Stok {
  id: string;
  stokKodu: string;
  stokAdi: string;
  satisFiyati: number;
  kdvOrani: number;
  barkod?: string;
  miktar?: number;
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
}

interface OdemePlaniItem {
  vade: string;
  tutar: number;
  odemeTipi: string;
  aciklama: string;
  odendi: boolean;
}

interface SatisElemani {
  id: string;
  adSoyad: string;
}

export function SatisIadeFaturaForm({ faturaId, onBack }: { faturaId?: string; onBack?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [stoklar, setStoklar] = useState<Stok[]>([]);
  const [satisElemanlari, setSatisElemanlari] = useState<SatisElemani[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [barcode, setBarcode] = useState('');

  const { drafts, updateDraft, clearDraft } = useInvoiceDraftStore();
  const { removeTab, addTab, setActiveTab } = useTabStore();
  const draft = drafts.sales_return;
  const [formData, setFormData] = useState(
    draft || {
      invoiceNo: '',
      invoiceType: 'SALES_RETURN' as const,
      accountId: '',
      warehouseId: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'APPROVED' as 'DRAFT' | 'PENDING' | 'APPROVED',
      genelIskontoOran: 0,
      genelIskontoTutar: 0,
      notes: '',
      staffId: '',
      items: [] as FaturaKalemi[],
      odemePlani: [] as OdemePlaniItem[],
    }
  );

  // Update store whenever formData changes
  useEffect(() => {
    if (!faturaId) {
      updateDraft('sales_return', formData);
    }
  }, [formData, faturaId, updateDraft]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [tabValue, setTabValue] = useState(0);
  const [openIrsaliyeDialog, setOpenIrsaliyeDialog] = useState(false);
  const [irsaliyeler, setIrsaliyeler] = useState<any[]>([]);
  const [selectedIrsaliyeler, setSelectedIrsaliyeler] = useState<string[]>([]);
  const [loadingIrsaliyeler, setLoadingIrsaliyeler] = useState(false);
  const [hasDeliveryNoteItems, setHasDeliveryNoteItems] = useState(false);
  const [openOdemePlaniDialog, setOpenOdemePlaniDialog] = useState(false);
  const [taksitSayisi, setTaksitSayisi] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carilerRes, stoklarRes, warehousesRes, staffRes] = await Promise.all([
          axios.get('/account', { params: { limit: 1000 } }),
          axios.get('/products', { params: { limit: 1000 } }),
          axios.get('/warehouses?active=true'),
          axios.get('/staff', { params: { limit: 100 } })
        ]);

        setCariler(carilerRes.data.data || []);
        setStoklar(
          (stoklarRes.data.data || []).map((s: any) => ({
            ...s,
            stokKodu: s.stokKodu ?? s.code,
            stokAdi: s.stokAdi ?? s.name,
            barkod: s.barkod ?? s.barcode,
            birim: s.birim ?? s.unit ?? 'ADET',
            kdvOrani: Number(s.kdvOrani ?? s.vatRate ?? 20),
            satisFiyati: Number(s.satisFiyati ?? s.salePrice ?? 0),
            miktar: Number(s.miktar ?? s.quantity ?? 0),
          })),
        );
        setWarehouses(warehousesRes.data || []);
        setSatisElemanlari(staffRes.data.data || []);

        const warehouseList = warehousesRes.data || [];
        const defaultWarehouse = warehouseList.find((w: any) => w.isDefault);
        if (defaultWarehouse) {
          setFormData(prev => ({ ...prev, warehouseId: defaultWarehouse.id }));
        } else if (warehouseList.length === 1) {
          setFormData(prev => ({ ...prev, warehouseId: warehouseList[0].id }));
        }

        if (faturaId) {
          const faturaRes = await axios.get(`/invoices/${faturaId}`);
          const fatura = faturaRes.data;
          setFormData({
            invoiceNo: fatura.invoiceNo,
            invoiceType: 'SALES_RETURN',
            accountId: fatura.accountId,
            date: fatura.date ? new Date(fatura.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            dueDate: fatura.dueDate ? new Date(fatura.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: fatura.status,
            genelIskontoOran: 0,
            genelIskontoTutar: fatura.discount || 0,
            notes: fatura.notes || '',
            staffId: fatura.staffId || '',
            warehouseId: fatura.warehouseId || '',
            items: (fatura.items || []).map((k: any) => ({
              stokId: k.productId,
              stok: k.product,
              miktar: Number(k.quantity) || 0,
              birimFiyat: Number(k.unitPrice) || 0,
              kdvOrani: Number(k.vatRate) || 0,
              iskontoOran: Number(k.discountRate) || 0,
              iskontoTutar: Number(k.discountAmount) || 0,
              birim: k.unit || 'ADET',
            })),
            odemePlani: (fatura.paymentPlan || []).map((o: any) => ({
              vade: new Date(o.dueDate).toISOString().split('T')[0],
              tutar: Number(o.amount),
              odemeTipi: o.paymentType || 'NAKIT',
              aciklama: o.notes || '',
              odendi: o.isPaid || false,
            })),
          });
        } else {
          generateFaturaNo();
        }
      } catch (error: any) {
        console.error('Data loading error:', error);
        showSnackbar('Veriler yüklenirken hata oluştu', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [faturaId]);

  const generateFaturaNo = async () => {
    try {
      const response = await axios.get('/code-templates/preview-code/INVOICE_SALES_RETURN');
      if (response.data?.nextCode) {
        setFormData(prev => ({ ...prev, invoiceNo: response.data.nextCode }));
      }
    } catch (error: any) {
      setFormData(prev => ({
        ...prev,
        invoiceNo: `SIF-${new Date().getFullYear()}-001`,
      }));
      console.error('Fatura numarası oluşturulurken hata:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTaksitHesapla = () => {
    const toplam = totals.genelToplam;
    if (toplam <= 0 || taksitSayisi <= 0) return;

    const taksitTutari = Math.floor((toplam / taksitSayisi) * 100) / 100;
    const fark = Math.round((toplam - (taksitTutari * taksitSayisi)) * 100) / 100;

    const yeniPlan: OdemePlaniItem[] = [];
    let currentVade = new Date(formData.date);

    for (let i = 0; i < taksitSayisi; i++) {
      currentVade = new Date(currentVade);
      currentVade.setMonth(currentVade.getMonth() + 1);

      yeniPlan.push({
        vade: currentVade.toISOString().split('T')[0],
        tutar: i === taksitSayisi - 1 ? taksitTutari + fark : taksitTutari,
        odemeTipi: 'KREDI_KARTI',
        aciklama: `${i + 1}. Taksit`,
        odendi: false,
      });
    }

    setFormData(prev => ({ ...prev, odemePlani: yeniPlan }));
  };

  const totals = useMemo(() => {
    let araToplam = 0, kalemIskonto = 0, toplamKdv = 0;
    formData.items.forEach(k => {
      const lineTotal = k.miktar * k.birimFiyat;
      araToplam += lineTotal;
      kalemIskonto += (k.iskontoTutar || 0);
      const net = lineTotal - (k.iskontoTutar || 0);
      toplamKdv += (net * k.kdvOrani) / 100;
    });
    const genelIskonto = formData.genelIskontoTutar || 0;
    const netToplam = araToplam - kalemIskonto - genelIskonto;
    return { araToplam, kalemIskonto, genelIskonto, toplamIskonto: kalemIskonto + genelIskonto, toplamKdv, genelToplam: netToplam + toplamKdv };
  }, [formData.items, formData.genelIskontoTutar]);

  const handleGenelIskontoOranChange = (value: string) => {
    const oran = parseFloat(value) || 0;
    const araToplam = formData.items.reduce((sum, k) => sum + (k.miktar * k.birimFiyat - k.iskontoTutar), 0);
    const tutar = (araToplam * oran) / 100;
    setFormData(prev => ({ ...prev, genelIskontoOran: oran, genelIskontoTutar: tutar }));
  };

  const handleGenelIskontoTutarChange = (value: string) => {
    const tutar = parseFloat(value) || 0;
    const araToplam = formData.items.reduce((sum, k) => sum + (k.miktar * k.birimFiyat - k.iskontoTutar), 0);
    const oran = araToplam > 0 ? (tutar / araToplam) * 100 : 0;
    setFormData(prev => ({ ...prev, genelIskontoOran: oran, genelIskontoTutar: tutar }));
  };

  const fetchIrsaliyeler = async (cariId: string) => {
    if (!cariId) {
      showSnackbar('Lütfen önce bir cari seçiniz', 'error');
      return;
    }
    try {
      setLoadingIrsaliyeler(true);
      setOpenIrsaliyeDialog(true);
      const response = await axios.get('/delivery-notes', {
        params: {
          cariId,
          faturaId: null,
          limit: 100,
        },
      });
      setIrsaliyeler(response.data.data || []);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İrsaliyeler yüklenirken hata oluştu', 'error');
    } finally {
      setLoadingIrsaliyeler(false);
    }
  };

  const handleIrsaliyeleriEkle = () => {
    if (selectedIrsaliyeler.length === 0) {
      showSnackbar('Lütfen en az bir irsaliye seçiniz', 'error');
      return;
    }

    const secilenIrsaliyeler = irsaliyeler.filter((i: any) => selectedIrsaliyeler.includes(i.id));
    const yeniKalemler: FaturaKalemi[] = [];

    secilenIrsaliyeler.forEach((irsaliye: any) => {
      irsaliye.kalemler?.forEach((kalem: any) => {
        const mevcutKalem = formData.items.find(k => k.stokId === kalem.stokId);
        if (mevcutKalem) {
          mevcutKalem.miktar += kalem.miktar;
        } else {
          yeniKalemler.push({
            stokId: kalem.stokId,
            stok: kalem.stok,
            miktar: kalem.miktar,
            birimFiyat: kalem.birimFiyat,
            kdvOrani: kalem.kdvOrani,
            iskontoOran: 0,
            iskontoTutar: 0,
            birim: kalem.birim || 'ADET',
          });
        }
      });
    });

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, ...yeniKalemler],
    }));

    setOpenIrsaliyeDialog(false);
    setSelectedIrsaliyeler([]);
    setHasDeliveryNoteItems(true);
    showSnackbar(`${selectedIrsaliyeler.length} irsaliyedeki kalemler eklendi`, 'success');
  };

  const handleBarcodeSubmit = (barkod: string) => {
    if (!barkod) return;
    const stok = stoklar.find(s => s.barkod === barkod.trim());
    if (stok) {
      const iIdx = formData.items.findIndex(k => k.stokId === stok.id);
      if (iIdx > -1) {
        const newItems = [...formData.items];
        newItems[iIdx].miktar += 1;
        setFormData(prev => ({ ...prev, items: newItems }));
      } else {
        setFormData(prev => ({
          ...prev,
          items: [...prev.items, {
            stokId: stok.id,
            stok: stok,
            miktar: 1,
            birimFiyat: stok.satisFiyati,
            kdvOrani: stok.kdvOrani,
            iskontoOran: 0,
            iskontoTutar: 0,
            birim: stok.birim || 'ADET',
          }]
        }));
      }
      setBarcode('');
      showSnackbar(`${stok.stokAdi} eklendi`, 'success');
    } else {
      showSnackbar('Barkod bulunamadı', 'error');
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.accountId) {
        showSnackbar('Cari seçimi zorunludur', 'error');
        return;
      }

      const validItems = formData.items.filter(k => k.stokId && k.stokId.trim() !== '');

      if (validItems.length === 0) {
        showSnackbar('En az bir kalem eklemelisiniz', 'error');
        return;
      }

      setSaving(true);
      const payload = {
        invoiceNo: formData.invoiceNo,
        type: formData.invoiceType,
        accountId: formData.accountId,
        date: new Date(formData.date).toISOString(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        discount: Number(formData.genelIskontoTutar) || 0,
        notes: formData.notes || null,
        staffId: formData.staffId || null,
        status: formData.status,
        warehouseId: formData.warehouseId || null,
        ...(hasDeliveryNoteItems && { preventAutoDeliveryNote: 'true' }),
        items: validItems.map(k => ({
          productId: k.stokId,
          quantity: Number(k.miktar),
          unitPrice: Number(k.birimFiyat),
          vatRate: Number(k.kdvOrani),
          discountRate: Number(k.iskontoOran) || 0,
          discountAmount: Number(k.iskontoTutar) || 0,
        })),
      };

      if (faturaId) {
        await axios.put(`/invoices/${faturaId}`, payload);
        showSnackbar('Fatura başarıyla güncellendi', 'success');
      } else {
        await axios.post('/invoices', payload);
        showSnackbar('Fatura başarıyla kaydedildi', 'success');
        clearDraft('sales_return');
      }

      removeTab(faturaId ? `sales-return-invoice-edit-${faturaId}` : 'sales-return-invoice-yeni');
      addTab({ id: 'sales-return-invoice', label: 'Satış İade Faturaları', path: '/invoice/return/sales' });
      setActiveTab('sales-return-invoice');

      setTimeout(() => {
        router.push('/invoice/return/sales');
      }, 1500);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  if (loading) return (
    <MainLayout>
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    </MainLayout>
  );

  return (
    <MainLayout>
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2,
          mb: 2
        }}>
          {/* Back IconButton removed */}
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'var(--foreground)' }}>
              {faturaId ? 'Satış İade Faturası Düzenle' : 'Yeni Satış İade Faturası'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              İade faturası bilgilerini {faturaId ? 'güncelleyin' : 'girin'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', bgcolor: 'var(--card)' }}>
        <Stack spacing={3}>
          {/* Fatura Bilgileri */}
          {warehouses.length === 0 && (
            <Alert severity="error">
              Sistemde tanımlı ambar bulunmamaktadır. İşlem yapabilmek için lütfen önce ambar tanımlayınız.
            </Alert>
          )}

          {/* Tab Interface - Desktop only */}
          {!isMobile && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }
                }}
              >
                <Tab icon={<Description />} label="Genel Bilgiler" iconPosition="start" />
              </Tabs>
            </Box>
          )}

          {/* Mobilde: Tüm alanlar tek kolonda */}
          {isMobile ? (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'var(--foreground)' }}>Genel Bilgiler</Typography>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 2
              }}>
                <TextField
                  className="form-control-textfield"
                  label="Fatura No"
                  value={formData.invoiceNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceNo: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Tarih"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Vade"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl className="form-control-select" required fullWidth>
                  <InputLabel>Ambar</InputLabel>
                  <Select
                    value={formData.warehouseId}
                    onChange={(e) => setFormData(prev => ({ ...prev, warehouseId: e.target.value }))}
                    label="Ambar"
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} {warehouse.isDefault && '(Varsayılan)'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Autocomplete
                  fullWidth
                  value={cariler.find(c => c.id === formData.accountId) || null}
                  onChange={async (_, newValue) => {
                    const accountId = newValue?.id || '';
                    // Cari seçildiğinde vade gününü hesapla
                    if (newValue?.dueDays && formData.date) {
                      const tarih = new Date(formData.date);
                      tarih.setDate(tarih.getDate() + (newValue.dueDays || 0));
                      const vadeTarihi = tarih.toISOString().split('T')[0];
                      setFormData(prev => ({ ...prev, accountId, dueDate: vadeTarihi }));
                    } else {
                      setFormData(prev => ({ ...prev, accountId }));
                    }
                    if (accountId) {
                      try {
                        const response = await axios.get(`/account/${accountId}`);
                        if (response.data?.staffId) {
                          setFormData(prev => ({ ...prev, staffId: response.data.staffId }));
                        }
                      } catch (error) {
                        console.error('Cari detayları yüklenirken hata:', error);
                      }
                    }
                  }}
                  options={cariler}
                  getOptionLabel={(option) => `${option.cariKodu} - ${option.unvan}`}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <Box component="li" key={key} {...otherProps}>
                        <Box>
                          <Typography variant="body1" fontWeight="600" sx={{ color: 'var(--foreground)' }}>
                            {option.unvan}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                            {option.cariKodu} - {option.tip === 'MUSTERI' ? 'Müşteri' : 'Tedarikçi'}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="form-control-textfield"
                      label="Cari Seçiniz"
                      placeholder="Cari kodu veya ünvanı ile ara..."
                      required
                    />
                  )}
                  noOptionsText="Cari bulunamadı"
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <FormControl className="form-control-select" fullWidth>
                  <InputLabel>Satış Elemanı</InputLabel>
                  <Select
                    value={formData.staffId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
                    label="Satış Elemanı"
                  >
                    <MenuItem value=""><em>Seçiniz</em></MenuItem>
                    {satisElemanlari.map((se) => (
                      <MenuItem key={se.id} value={se.id}>
                        {se.adSoyad}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          ) : (
            /* Desktop: TabPanel */
            <TabPanel value={tabValue} index={0}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 2
              }}>
                <TextField
                  className="form-control-textfield"
                  label="Fatura No"
                  value={formData.invoiceNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoiceNo: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Tarih"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Vade"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl className="form-control-select" required fullWidth>
                  <InputLabel>Ambar</InputLabel>
                  <Select
                    value={formData.warehouseId}
                    onChange={(e) => setFormData(prev => ({ ...prev, warehouseId: e.target.value }))}
                    label="Ambar"
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} {warehouse.isDefault && '(Varsayılan)'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                <Box sx={{ flex: '2 1 400px' }}>
                  <Autocomplete
                    disabled={!!faturaId && formData.status === 'APPROVED'}
                    fullWidth
                    value={cariler.find(c => c.id === formData.accountId) || null}
                    onChange={async (_, newValue) => {
                      const accountId = newValue?.id || '';
                      // Cari seçildiğinde vade gününü hesapla
                      if (newValue?.dueDays && formData.date) {
                        const tarih = new Date(formData.date);
                        tarih.setDate(tarih.getDate() + (newValue.dueDays || 0));
                        const vadeTarihi = tarih.toISOString().split('T')[0];
                        setFormData(prev => ({ ...prev, accountId, dueDate: vadeTarihi }));
                      } else {
                        setFormData(prev => ({ ...prev, accountId }));
                      }
                      if (accountId) {
                        try {
                          const response = await axios.get(`/account/${accountId}`);
                          if (response.data?.staffId) {
                            setFormData(prev => ({ ...prev, staffId: response.data.staffId }));
                          }
                        } catch (error) {
                          console.error('Cari detayları yüklenirken hata:', error);
                        }
                      }
                    }}
                    options={cariler}
                    getOptionLabel={(option) => `${option.cariKodu} - ${option.unvan}`}
                    renderOption={(props, option) => {
                      const { key, ...otherProps } = props;
                      return (
                        <Box component="li" key={key} {...otherProps}>
                          <Box>
                            <Typography variant="body1" fontWeight="600" sx={{ color: 'var(--foreground)' }}>
                              {option.unvan}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                              {option.cariKodu} - {option.tip === 'MUSTERI' ? 'Müşteri' : 'Tedarikçi'}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cari Seçiniz"
                        required
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flex: '1 1 200px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Satış Elemanı</InputLabel>
                    <Select
                      disabled={!!faturaId && formData.status === 'APPROVED'}
                      value={formData.staffId || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
                      label="Satış Elemanı"
                    >
                      <MenuItem value=""><em>Seçiniz</em></MenuItem>
                      {satisElemanlari.map((se) => (
                        <MenuItem key={se.id} value={se.id}>
                          {se.adSoyad}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </TabPanel>
          )}

          {/* Kalemler */}
          <Box>
            <Divider sx={{ mb: 2, borderColor: 'var(--border)' }} />

            <Box sx={{ mt: 3, mb: 3 }}>
              <Box sx={{ py: 1, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    disabled={!!faturaId && formData.status === 'APPROVED'}
                    size="small"
                    label="Barkod Okut"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleBarcodeSubmit(barcode)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><QrCodeScanner color="action" /></InputAdornment> }}
                    sx={{ width: 250 }}
                  />
                  <Button
                    disabled={!!faturaId && formData.durum === 'APPROVED'}
                    variant="outlined"
                    size="small"
                    startIcon={<AccountBalanceWallet />}
                    onClick={() => setOpenOdemePlaniDialog(true)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    Ödeme Planı {formData.odemePlani.length > 0 && `(${formData.odemePlani.length})`}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LocalShipping />}
                    onClick={() => fetchIrsaliyeler(formData.accountId)}
                    disabled={!formData.accountId || formData.status === 'APPROVED'}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    İrsaliyeden Getir
                  </Button>
                </Box>
              </Box>
              <DocumentItemTable
                disabled={!!faturaId && formData.status === 'APPROVED'}
                kalemler={formData.items}
                onChange={(newItems) => setFormData(prev => ({ ...prev, items: newItems }))}
                stoklar={stoklar}
                cariId={formData.accountId}
                onSnackbar={showSnackbar}
              />
            </Box>
          </Box>

          {/* Genel İskonto */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <TextField
              disabled={!!faturaId && formData.status === 'APPROVED'}
              type="number"
              label="Genel İskonto %"
              value={formData.genelIskontoOran || ''}
              onChange={(e) => handleGenelIskontoOranChange(e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              helperText="İskonto oranı"
              sx={{
                width: { xs: '100%', sm: '200px' },
                '& input[type=number]': { MozAppearance: 'textfield' },
                '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
              }}
            />
            <TextField
              disabled={!!faturaId && formData.status === 'APPROVED'}
              type="number"
              label="Genel İskonto (₺)"
              value={formData.genelIskontoTutar || ''}
              onChange={(e) => handleGenelIskontoTutarChange(e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              helperText="İskonto tutarı"
              sx={{
                width: { xs: '100%', sm: '200px' },
                '& input[type=number]': { MozAppearance: 'textfield' },
                '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
              }}
            />
          </Box>

          {/* Açıklama ve Fatura Özeti - Yan Yana */}
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            {/* Açıklama */}
            <Box sx={{ flex: 1 }}>
              <TextField
                disabled={!!faturaId && formData.status === 'APPROVED'}
                fullWidth
                multiline
                rows={2}
                label="Açıklama / Notlar"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Box>

            {/* Toplam Bilgileri */}
            <Paper variant="outlined" sx={{ flex: 1, p: isMobile ? 2 : 3, bgcolor: 'var(--card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'var(--foreground)' }}>
                Fatura Özeti
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 2 : 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="var(--muted-foreground)">Ara Toplam:</Typography>
                    <Typography variant="body2" fontWeight="600">{formatCurrency(totals.araToplam)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="var(--muted-foreground)">Malzeme İndirimleri:</Typography>
                    <Typography variant="body2" fontWeight="600" color={totals.kalemIskonto > 0 ? "error.main" : "inherit"}>
                      {totals.kalemIskonto > 0 ? '- ' : ''}{formatCurrency(totals.kalemIskonto)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="var(--muted-foreground)">Genel İskonto:</Typography>
                    <Typography variant="body2" fontWeight="600" color={formData.genelIskontoTutar > 0 ? "error.main" : "inherit"}>
                      {formData.genelIskontoTutar > 0 ? '- ' : ''}{formatCurrency(formData.genelIskontoTutar || 0)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="var(--muted-foreground)" fontWeight="bold">Toplam İndirim:</Typography>
                    <Typography variant="body2" fontWeight="bold" color={totals.toplamIskonto > 0 ? "error.main" : "inherit"}>
                      {totals.toplamIskonto > 0 ? '- ' : ''}{formatCurrency(totals.toplamIskonto)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="var(--muted-foreground)">KDV Toplamı:</Typography>
                    <Typography variant="body2" fontWeight="600">{formatCurrency(totals.toplamKdv)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="800">Genel Toplam:</Typography>
                    <Typography
                      variant="h6"
                      fontWeight="900"
                      sx={{
                        color: 'var(--destructive)',
                      }}
                    >
                      {formatCurrency(totals.genelToplam)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Action Buttons */}
          <Box>
            <Box sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column-reverse' : 'row',
              gap: 2,
              justifyContent: 'space-between'
            }}>
              {/* Geri button removed */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {formData.status !== 'APPROVED' && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: 'DRAFT' }));
                      setTimeout(handleSave, 100);
                    }}
                    disabled={saving}
                  >
                    Taslak Olarak Kaydet
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  onClick={() => {
                    if (formData.status !== 'APPROVED') {
                      setFormData(prev => ({ ...prev, status: 'APPROVED' }));
                    }
                    setTimeout(handleSave, 100);
                  }}
                  disabled={saving || formData.status === 'APPROVED'}
                  sx={{
                    bgcolor: formData.status === 'APPROVED' ? 'var(--muted)' : 'var(--ring)',
                    color: formData.status === 'APPROVED' ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
                  }}
                >
                  {saving ? 'Kaydediliyor...' : (formData.status === 'APPROVED' ? 'Fatura Onaylandı' : 'Kaydet')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* İrsaliye Seçim Dialogu */}
      <Dialog
        open={openIrsaliyeDialog}
        onClose={() => {
          setOpenIrsaliyeDialog(false);
          setSelectedIrsaliyeler([]);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>İrsaliyeden Aktar</DialogTitle>
        <DialogContent>
          {loadingIrsaliyeler ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : irsaliyeler.length === 0 ? (
            <Typography variant="body2" sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
              Aktarılabilir irsaliye bulunamadı.
            </Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedIrsaliyeler.length > 0 && selectedIrsaliyeler.length < irsaliyeler.length}
                          checked={irsaliyeler.length > 0 && selectedIrsaliyeler.length === irsaliyeler.length}
                          onChange={() => {
                            if (selectedIrsaliyeler.length === irsaliyeler.length) {
                              setSelectedIrsaliyeler([]);
                            } else {
                              setSelectedIrsaliyeler(irsaliyeler.map((i: any) => i.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>İrsaliye No</TableCell>
                      <TableCell>Tarih</TableCell>
                      <TableCell>Kalem Sayısı</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {irsaliyeler.map((irsaliye: any) => (
                      <TableRow
                        key={irsaliye.id}
                        hover
                        selected={selectedIrsaliyeler.includes(irsaliye.id)}
                        onClick={() => {
                          setSelectedIrsaliyeler(prev =>
                            prev.includes(irsaliye.id)
                              ? prev.filter(id => id !== irsaliye.id)
                              : [...prev, irsaliye.id]
                          );
                        }}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedIrsaliyeler.includes(irsaliye.id)} />
                        </TableCell>
                        <TableCell>{irsaliye.irsaliyeNo || irsaliye.deliveryNoteNo}</TableCell>
                        <TableCell>{new Date(irsaliye.tarih).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>{irsaliye.kalemSayisi || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIrsaliyeDialog(false)}>İptal</Button>
          <Button
            onClick={handleIrsaliyeleriEkle}
            variant="contained"
            disabled={selectedIrsaliyeler.length === 0}
          >
            Aktar ({selectedIrsaliyeler.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ödeme Planı Dialogu */}
      <Dialog
        open={openOdemePlaniDialog}
        onClose={() => setOpenOdemePlaniDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 'var(--radius)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Ödeme Planı
        </DialogTitle>

        <DialogContent>
          {/* Summary Row */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="caption" color="text.secondary">
                Fatura Toplamı
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatCurrency(totals.genelToplam)}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="caption" color="text.secondary">
                Planlanan
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatCurrency(formData.odemePlani.reduce((sum, o) => sum + o.tutar, 0))}
              </Typography>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="caption" color="text.secondary">
                Taksit Sayısı
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formData.odemePlani.length}
              </Typography>
            </Box>
          </Box>

          {/* Quick Actions */}
          {formData.odemePlani.length === 0 && (
            <>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                {[2, 3, 6, 9, 12].map((ay) => (
                  <Button
                    key={ay}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setTaksitSayisi(ay);
                      handleTaksitHesapla();
                    }}
                    disabled={formData.items.length === 0}
                  >
                    {ay} Ay
                  </Button>
                ))}
                <TextField
                  type="number"
                  size="small"
                  value={taksitSayisi}
                  onChange={e => setTaksitSayisi(parseInt(e.target.value) || 1)}
                  onKeyDown={e => e.key === 'Enter' && handleTaksitHesapla()}
                  inputProps={{ min: 1, max: 36 }}
                  sx={{ width: 80 }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleTaksitHesapla}
                  disabled={formData.items.length === 0 || taksitSayisi < 1}
                >
                  Oluştur
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Ödeme planı oluşturmak için taksit sayısı seçin veya girin.
              </Typography>
            </>
          )}

          {/* Payment Plan Table */}
          {formData.odemePlani.length > 0 && (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Taksit</TableCell>
                      <TableCell>Vade Tarihi</TableCell>
                      <TableCell>Tutar</TableCell>
                      <TableCell>Ödeme Tipi</TableCell>
                      <TableCell width={50}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.odemePlani.map((odeme, index) => (
                      <TableRow key={index}>
                        <TableCell>{odeme.aciklama}</TableCell>
                        <TableCell>{new Date(odeme.vade).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={odeme.tutar}
                            onChange={e => {
                              const newPlan = [...formData.odemePlani];
                              newPlan[index].tutar = parseFloat(e.target.value) || 0;
                              setFormData(f => ({ ...f, odemePlani: newPlan }));
                            }}
                            inputProps={{ min: 0, step: 0.01 }}
                            sx={{
                              width: 120,
                              '& input[type=number]': { MozAppearance: 'textfield' },
                              '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                              '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            size="small"
                            options={[
                              { value: 'NAKIT', label: 'Nakit' },
                              { value: 'KREDI_KARTI', label: 'Kredi Kartı' },
                              { value: 'CEK', label: 'Çek' },
                              { value: 'SENET', label: 'Senet' },
                            ]}
                            getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                            value={[
                              { value: 'NAKIT', label: 'Nakit' },
                              { value: 'KREDI_KARTI', label: 'Kredi Kartı' },
                              { value: 'CEK', label: 'Çek' },
                              { value: 'SENET', label: 'Senet' },
                            ].find(opt => opt.value === odeme.odemeTipi) || null}
                            onChange={(_, newValue) => {
                              const newPlan = [...formData.odemePlani];
                              newPlan[index].odemeTipi = newValue?.value || 'NAKIT';
                              setFormData(f => ({ ...f, odemePlani: newPlan }));
                            }}
                            isOptionEqualToValue={(option, value) => option.value === value?.value}
                            sx={{ width: 180 }}
                            renderInput={(params) => <TextField {...params} size="small" />}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => setFormData(f => ({ ...f, odemePlani: f.odemePlani.filter((_, i) => i !== index) }))}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Toplam: <strong>{formatCurrency(formData.odemePlani.reduce((sum, o) => sum + o.tutar, 0))}</strong>
                  {Math.abs(formData.odemePlani.reduce((sum, o) => sum + o.tutar, 0) - totals.genelToplam) > 0.01 && (
                    <span style={{ color: 'var(--warning)', marginLeft: 8 }}>
                      Fatura tutarından farklı
                    </span>
                  )}
                </Typography>
                <Button
                  size="small"
                  onClick={() => {
                    setTaksitSayisi(formData.odemePlani.length);
                    handleTaksitHesapla();
                  }}
                >
                  Yeniden Hesapla
                </Button>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenOdemePlaniDialog(false)}>
            Kapat
          </Button>
          {formData.odemePlani.length > 0 && (
            <Button
              onClick={() => setFormData(f => ({ ...f, odemePlani: [] }))}
              color="error"
            >
              Temizle
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}

export default function YeniSatisIadeFaturasiPage() {
  return (
    <Suspense
      fallback={(
        <MainLayout>
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </MainLayout>
      )}
    >
      <SatisIadeFaturaForm />
    </Suspense>
  );
}
