'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Snackbar,
  Alert,
  Divider,
  Stack,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Save, ArrowBack, QrCodeScanner, Description } from '@mui/icons-material';
import MainLayout from '@/components/Layout/MainLayout';
import DocumentItemTable, { DocumentItem, Product } from '@/components/Form/DocumentItemTable';
import axios from '@/lib/axios';
import { useTabStore } from '@/stores/tabStore';
import { useInvoiceDraftStore } from '@/stores/invoiceDraftStore';

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

interface Cari {
  id: string;
  code: string;
  title: string;
  type: string;
  dueDays?: number;
}

interface Stok extends Product { }

interface Warehouse {
  id: string;
  name: string;
  isDefault?: boolean;
}

export function SatinAlmaSiparisForm({ siparisId: editSiparisId, onBack }: { siparisId?: string; onBack?: () => void }) {
  const router = useRouter();
  const { addTab, setActiveTab } = useTabStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [cariler, setCariler] = useState<Cari[]>([]);
  const [stoklar, setStoklar] = useState<Stok[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const { drafts, setDraft, clearDraft } = useInvoiceDraftStore();
  const draft = drafts.purchase_order;

  const [formData, setFormData] = useState(draft || {
    siparisNo: '',
    cariId: '',
    warehouseId: '',
    tarih: new Date().toISOString().split('T')[0],
    vade: '',
    genelIskontoOran: 0,
    genelIskontoTutar: 0,
    aciklama: '',
    kalemler: [] as DocumentItem[],
  });

  // Draft Sync
  useEffect(() => {
    if (!editSiparisId) {
      setDraft('purchase_order', formData);
    }
  }, [formData, editSiparisId, setDraft]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carilerRes, stoklarRes, warehousesRes] = await Promise.all([
          axios.get('/account', { params: { limit: 1000 } }),
          axios.get('/products', { params: { limit: 1000 } }),
          axios.get('/warehouses?active=true')
        ]);

        const mappedCariler = (carilerRes.data.data || []).map((c: any) => ({
          id: c.id,
          code: c.code,
          title: c.title,
          dueDays: c.dueDays || 0,
        }));
        setCariler(mappedCariler);

        const mappedStoklar = (stoklarRes.data.data || []).map((s: any) => ({
          id: s.id,
          stokKodu: s.code,
          stokAdi: s.name,
          satisFiyati: Number(s.purchasePrice) || Number(s.salePrice) || 0,
          kdvOrani: Number(s.vatRate) || 20,
          barkod: s.barcode,
          birim: s.unit || 'ADET',
          miktar: Number(s.quantity ?? 0),
        }));
        setStoklar(mappedStoklar);

        const warehouseList = warehousesRes.data || [];
        setWarehouses(warehouseList);

        const defaultWarehouse = warehouseList.find((w: any) => w.isDefault);
        if (defaultWarehouse) {
          setFormData(prev => ({ ...prev, warehouseId: defaultWarehouse.id }));
        } else if (warehouseList.length === 1) {
          setFormData(prev => ({ ...prev, warehouseId: warehouseList[0].id }));
        }

        if (editSiparisId) {
          const res = await axios.get(`/orders/${editSiparisId}`);
          const s = res.data;
          setFormData({
            siparisNo: s.orderNo || '',
            cariId: s.accountId || '',
            warehouseId: s.warehouseId || '',
            tarih: s.date ? new Date(s.date).toISOString().split('T')[0] : '',
            vade: s.dueDate ? new Date(s.dueDate).toISOString().split('T')[0] : '',
            genelIskontoOran: 0,
            genelIskontoTutar: Number(s.discount) || 0,
            aciklama: s.notes || '',
            kalemler: (s.items || []).map((k: any) => ({
              stokId: k.productId,
              stok: k.product ? {
                id: k.product.id,
                stokKodu: k.product.code,
                stokAdi: k.product.name,
                satisFiyati: Number(k.product.purchasePrice) || Number(k.product.salePrice) || 0,
                kdvOrani: Number(k.product.vatRate) || 20,
                birim: k.product.unit || 'ADET',
              } : undefined,
              miktar: Number(k.quantity) || 0,
              birimFiyat: Number(k.unitPrice) || 0,
              kdvOrani: Number(k.vatRate) || 0,
              iskontoOran: Number(k.discountRate) || 0,
              iskontoTutar: Number(k.discountAmount) || 0,
              birim: k.unit || 'ADET',
            })),
          });
        } else {
          await generateSiparisNo();

          if (!editSiparisId) {
            addTab({ id: 'purchase-orders-yeni', label: 'Yeni Satın Alma Siparişi', path: '/purchase-orders/yeni' });
          }
        }
      } catch (error: any) {
        showSnackbar('Veriler yüklenirken hata oluştu', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editSiparisId]);

  const generateSiparisNo = async () => {
    try {
      const res = await axios.get('/code-templates/preview-code/ORDER_PURCHASE');
      if (res.data?.nextCode) {
        setFormData(prev => ({ ...prev, siparisNo: res.data.nextCode }));
      }
    } catch (e) {
      console.warn('Numara üretilemedi');
    }
  };

  const handleBarcodeSubmit = (barkod: string) => {
    if (!barkod) return;
    const stok = stoklar.find(s => s.barkod === barkod.trim());
    if (stok) {
      const existingIndex = formData.kalemler.findIndex(k => k.stokId === stok.id);
      if (existingIndex > -1) {
        const newKalemler = [...formData.kalemler];
        newKalemler[existingIndex].miktar += 1;
        setFormData(prev => ({ ...prev, kalemler: newKalemler }));
      } else {
        setFormData(prev => ({
          ...prev,
          kalemler: [...prev.kalemler, {
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

  const totals = useMemo(() => {
    let araToplam = 0, kalemIskonto = 0, toplamKdv = 0;
    formData.kalemler.forEach(k => {
      const lineTotal = k.miktar * k.birimFiyat;
      araToplam += lineTotal;
      kalemIskonto += (k.iskontoTutar || 0);
      const net = lineTotal - (k.iskontoTutar || 0);
      toplamKdv += (net * k.kdvOrani) / 100;
    });
    const genelIskonto = formData.genelIskontoTutar || 0;
    const netToplam = araToplam - kalemIskonto - genelIskonto;
    return { araToplam, kalemIskonto, genelIskonto, toplamIskonto: kalemIskonto + genelIskonto, toplamKdv, genelToplam: netToplam + toplamKdv };
  }, [formData.kalemler, formData.genelIskontoTutar]);

  const handleGenelIskontoOranChange = (value: string) => {
    const oran = parseFloat(value) || 0;
    const araToplam = formData.kalemler.reduce((sum, k) => sum + (k.miktar * k.birimFiyat - k.iskontoTutar), 0);
    const tutar = (araToplam * oran) / 100;
    setFormData(prev => ({ ...prev, genelIskontoOran: oran, genelIskontoTutar: tutar }));
  };

  const handleGenelIskontoTutarChange = (value: string) => {
    const tutar = parseFloat(value) || 0;
    const araToplam = formData.kalemler.reduce((sum, k) => sum + (k.miktar * k.birimFiyat - k.iskontoTutar), 0);
    const oran = araToplam > 0 ? (tutar / araToplam) * 100 : 0;
    setFormData(prev => ({ ...prev, genelIskontoOran: oran, genelIskontoTutar: tutar }));
  };

  const handleSave = async () => {
    try {
      if (!formData.cariId || formData.kalemler.length === 0) {
        showSnackbar('Lütfen zorunlu alanları doldurun', 'error');
        return;
      }
      setSaving(true);
      const payload = {
        orderNo: formData.siparisNo,
        orderType: 'PURCHASE',
        accountId: formData.cariId,
        warehouseId: formData.warehouseId,
        date: new Date(formData.tarih).toISOString(),
        dueDate: formData.vade ? new Date(formData.vade).toISOString() : null,
        discount: totals.toplamIskonto,
        notes: formData.aciklama,
        items: formData.kalemler.map(k => ({
          productId: k.stokId,
          quantity: k.miktar,
          unitPrice: k.birimFiyat,
          vatRate: k.kdvOrani,
          discountRate: k.iskontoOran,
          discountAmount: k.iskontoTutar,
          unit: k.birim,
        })),
      };

      if (editSiparisId) {
        await axios.put(`/orders/${editSiparisId}`, payload);
        showSnackbar('Sipariş başarıyla güncellendi', 'success');
      } else {
        await axios.post('/purchase-orders', payload);
        showSnackbar('Sipariş başarıyla oluşturuldu', 'success');
        clearDraft('purchase_order');
      }

      setTimeout(() => {
        if (onBack) onBack();
        else router.push('/purchase-orders');
      }, 1500);
    } catch (e: any) {
      showSnackbar(e.response?.data?.message || 'Kaydedilirken hata oluştu', 'error');
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
          <IconButton onClick={() => onBack ? onBack() : router.back()} sx={{
            bgcolor: 'var(--secondary)',
            width: 48,
            height: 48,
            '&:hover': { bgcolor: 'color-mix(in srgb, var(--secondary) 80%, var(--foreground))' }
          }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'var(--foreground)' }}>
              {editSiparisId ? 'Satın Alma Siparişi Düzenle' : 'Yeni Satın Alma Siparişi'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tedarikçiden mal alımı için sipariş oluşturun
            </Typography>
          </Box>
        </Box>
      </Box>

      <Paper sx={{
        p: 3,
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        bgcolor: 'var(--card)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          bgcolor: 'var(--chart-1)',
        },
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-ambient)',
          transition: 'all 0.2s ease',
        },
        transition: 'all 0.2s ease',
      }}>
        <Stack spacing={3}>
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

          {/* Mobile: Single column, Desktop: TabPanel */}
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
                  label="Sipariş No"
                  value={formData.siparisNo}
                  onChange={e => setFormData(p => ({ ...p, siparisNo: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Tarih"
                  value={formData.tarih}
                  onChange={e => setFormData(p => ({ ...p, tarih: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Vade"
                  value={formData.vade}
                  onChange={e => setFormData(p => ({ ...p, vade: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl className="form-control-select" required fullWidth>
                  <InputLabel>Ambar</InputLabel>
                  <Select
                    value={formData.warehouseId}
                    onChange={e => setFormData(p => ({ ...p, warehouseId: e.target.value }))}
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
                  options={cariler}
                  getOptionLabel={o => `${o.code || ''} - ${o.title}`}
                  value={cariler.find(c => c.id === formData.cariId) || null}
                  onChange={(_, nv) => setFormData(p => ({ ...p, cariId: nv?.id || '' }))}
                  renderInput={p => <TextField {...p} className="form-control-textfield" label="Tedarikçi Seçiniz" required />}
                />
              </Box>
            </Box>
          ) : (
            <TabPanel value={tabValue} index={0}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 2
              }}>
                <TextField
                  className="form-control-textfield"
                  label="Sipariş No"
                  value={formData.siparisNo}
                  onChange={e => setFormData(p => ({ ...p, siparisNo: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Tarih"
                  value={formData.tarih}
                  onChange={e => setFormData(p => ({ ...p, tarih: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Vade"
                  value={formData.vade}
                  onChange={e => setFormData(p => ({ ...p, vade: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <FormControl className="form-control-select" required fullWidth>
                  <InputLabel>Ambar</InputLabel>
                  <Select
                    value={formData.warehouseId}
                    onChange={e => setFormData(p => ({ ...p, warehouseId: e.target.value }))}
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
                  options={cariler}
                  getOptionLabel={o => `${o.code || ''} - ${o.title}`}
                  value={cariler.find(c => c.id === formData.cariId) || null}
                  onChange={(_, nv) => setFormData(p => ({ ...p, cariId: nv?.id || '' }))}
                  renderInput={p => <TextField {...p} className="form-control-textfield" label="Tedarikçi Seçiniz" required />}
                />
              </Box>
            </TabPanel>
          )}

          {/* Kalemler */}
          <Box>
            <Divider sx={{ mb: 2, borderColor: 'var(--border)' }} />

            <Box sx={{ mt: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Description sx={{ fontSize: 18, color: 'var(--chart-1)' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--foreground)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                  Sipariş Kalemleri
                </Typography>
              </Box>
              <Box sx={{ py: 1, px: 2, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-1) 5%, var(--card))', border: '1px solid var(--border)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    size="small"
                    label="Barkod Okut"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleBarcodeSubmit(barcode)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><QrCodeScanner sx={{ color: 'var(--chart-1)' }} /></InputAdornment> }}
                    sx={{
                      width: 250,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 3px color-mix(in srgb, var(--chart-1) 20%, transparent)',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
              <DocumentItemTable kalemler={formData.kalemler} onChange={ni => setFormData(p => ({ ...p, kalemler: ni }))} stoklar={stoklar} cariId={formData.cariId} onSnackbar={showSnackbar} />
            </Box>
          </Box>

          {/* Genel İskonto */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <TextField
              type="number"
              label="Genel İskonto %"
              value={formData.genelIskontoOran || ''}
              onChange={e => handleGenelIskontoOranChange(e.target.value)}
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              helperText="İskonto oranı"
              sx={{
                width: { xs: '100%', sm: '200px' },
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
              }}
            />
            <TextField
              type="number"
              label="Genel İskonto (₺)"
              value={formData.genelIskontoTutar || ''}
              onChange={e => handleGenelIskontoTutarChange(e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              helperText="İskonto tutarı"
              sx={{
                width: { xs: '100%', sm: '200px' },
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
              }}
            />
          </Box>

          {/* Açıklama ve Özet - Yan Yana */}
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
            {/* Açıklama */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Açıklama / Notlar"
                value={formData.aciklama}
                onChange={e => setFormData(p => ({ ...p, aciklama: e.target.value }))}
              />
            </Box>

            {/* Toplam Bilgileri */}
            <Paper variant="outlined" sx={{
              flex: 1,
              p: isMobile ? 2 : 3,
              bgcolor: 'var(--card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--chart-1) 8%, var(--card)) 0%, var(--card) 100%)',
              position: 'sticky',
              top: 80,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Description sx={{ fontSize: 18, color: 'var(--chart-1)' }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--foreground)' }}>
                  Sipariş Özeti
                </Typography>
              </Box>
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
                    <Typography variant="body2" color="var(--muted-foreground)">KDV Toplamı:</Typography>
                    <Typography variant="body2" fontWeight="600">{formatCurrency(totals.toplamKdv)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="var(--muted-foreground)" fontWeight="bold">Toplam İndirim:</Typography>
                    <Typography variant="body2" fontWeight="bold" color={totals.toplamIskonto > 0 ? "error.main" : "inherit"}>
                      {totals.toplamIskonto > 0 ? '- ' : ''}{formatCurrency(totals.toplamIskonto)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="800">Genel Toplam:</Typography>
                    <Typography variant="h6" fontWeight="900" sx={{ color: 'var(--chart-1)' }}>
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
              justifyContent: 'flex-end'
            }}>
              <Button
                variant="outlined"
                size="large"
                fullWidth={isMobile}
                onClick={() => {
                  const hasData = formData.cariId || formData.kalemler.length > 0 || formData.aciklama;
                  if (hasData && !editSiparisId) {
                    if (window.confirm('Taslak verileriniz silinecek. Çıkmak istediğinize emin misiniz?')) {
                      clearDraft('purchase_order');
                      onBack ? onBack() : router.back();
                    }
                  } else {
                    onBack ? onBack() : router.back();
                  }
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  '&:hover': {
                    borderColor: 'var(--chart-1)',
                    bgcolor: 'color-mix(in srgb, var(--chart-1) 8%, transparent)',
                  },
                }}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                size="large"
                fullWidth={isMobile}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  bgcolor: 'var(--chart-1)',
                  color: 'var(--primary-foreground)',
                  textTransform: 'none',
                  fontWeight: 700,
                  minWidth: isMobile ? '100%' : 150,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: 'color-mix(in srgb, var(--chart-1) 90%, var(--background))',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {saving ? 'Kaydediliyor...' : (editSiparisId ? 'Güncelle' : 'Oluştur')}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(p => ({ ...p, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
}

export default function YeniSatinalmaSiparisiPage() {
  return <SatinAlmaSiparisForm />;
}

export { SatinAlmaSiparisForm };
