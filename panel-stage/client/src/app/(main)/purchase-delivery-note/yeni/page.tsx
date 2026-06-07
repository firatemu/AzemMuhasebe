'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Stack,
  Autocomplete,
  CircularProgress,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Save, ArrowBack, QrCodeScanner, LocalShipping, Description } from '@mui/icons-material';
import MainLayout from '@/components/Layout/MainLayout';
import DocumentItemTable, { DocumentItem } from '@/components/Form/DocumentItemTable';
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
  code?: string;
  title: string;
}

interface Stok {
  id: string;
  stokKodu: string;
  stokAdi: string;
  satisFiyati: number;
  kdvOrani: number;
  barkod?: string;
  birim: string;
}

interface Warehouse {
  id: string;
  name: string;
  isDefault?: boolean;
}

export function SatinAlmaIrsaliyeForm({ irsaliyeId: editIrsaliyeId, onBack }: { irsaliyeId?: string; onBack?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siparisId = searchParams.get('siparisId');
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
  const draft = drafts.purchase_delivery_note;

  const [formData, setFormData] = useState(draft || {
    irsaliyeNo: '',
    cariId: '',
    irsaliyeTarihi: new Date().toISOString().split('T')[0],
    aciklama: '',
    warehouseId: '',
    genelIskontoOran: 0,
    genelIskontoTutar: 0,
    kalemler: [] as DocumentItem[],
  });

  // Draft Sync
  useEffect(() => {
    if (!editIrsaliyeId) {
      setDraft('purchase_delivery_note', formData);
    }
  }, [formData, editIrsaliyeId, setDraft]);

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

        const whList = warehousesRes.data || [];
        setWarehouses(whList);
        const defaultWh = whList.find((w: any) => w.isDefault) || whList[0];
        if (defaultWh) setFormData(prev => ({ ...prev, warehouseId: defaultWh.id }));

        if (editIrsaliyeId) {
          const res = await axios.get(`/purchase-waybill/${editIrsaliyeId}`);
          const irs = res.data;
          setFormData({
            irsaliyeNo: irs.deliveryNoteNo || '',
            cariId: irs.accountId || '',
            irsaliyeTarihi: irs.date ? new Date(irs.date).toISOString().split('T')[0] : '',
            aciklama: irs.notes || '',
            warehouseId: irs.warehouseId || '',
            genelIskontoOran: 0,
            genelIskontoTutar: Number(irs.discount) || 0,
            kalemler: (irs.items || []).map((k: any) => ({
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
          await generateIrsaliyeNo();

          if (siparisId) {
            await fetchSiparisBilgileri(siparisId);
          }

          if (!editIrsaliyeId) {
            addTab({ id: 'purchase-delivery-note-yeni', label: 'Yeni Satın Alma İrsaliyesi', path: '/purchase-delivery-note/yeni' });
          }
        }
      } catch (error: any) {
        showSnackbar('Veriler yüklenirken hata oluştu', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editIrsaliyeId, siparisId]);

  const generateIrsaliyeNo = async () => {
    try {
      const res = await axios.get('/code-templates/preview-code/DELIVERY_NOTE_PURCHASE');
      if (res.data?.nextCode) {
        setFormData(prev => ({ ...prev, irsaliyeNo: res.data.nextCode }));
      }
    } catch (e) {
      console.warn('Numara üretilemedi');
    }
  };

  const fetchSiparisBilgileri = async (id: string) => {
    try {
      const res = await axios.get(`/orders/${id}`);
      const siparis = res.data;
      if (siparis.accountId) {
        setFormData(prev => ({
          ...prev,
          cariId: siparis.accountId,
          kalemler: (siparis.items || []).map((k: any) => ({
            stokId: k.productId,
            stok: k.product ? {
              id: k.product.id,
              stokKodu: k.product.code,
              stokAdi: k.product.name,
              satisFiyati: Number(k.unitPrice) || 0,
              kdvOrani: Number(k.vatRate) || 20,
              birim: k.product.unit || 'ADET',
            } : undefined,
            miktar: Number(k.quantity) - Number(k.receivedQuantity || 0),
            birimFiyat: Number(k.unitPrice) || 0,
            kdvOrani: Number(k.vatRate) || 0,
            iskontoOran: Number(k.discountRate) || 0,
            iskontoTutar: Number(k.discountAmount) || 0,
            birim: k.unit || 'ADET',
          })).filter((k: any) => k.miktar > 0),
        }));
      }
    } catch (e) {
      showSnackbar('Sipariş bilgileri yüklenemedi', 'error');
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

  const handleSave = async () => {
    try {
      if (!formData.cariId || !formData.warehouseId || formData.kalemler.length === 0) {
        showSnackbar('Lütfen zorunlu alanları doldurun ve en az bir kalem ekleyin', 'error');
        return;
      }
      setSaving(true);
      const payload = {
        deliveryNoteNo: formData.irsaliyeNo,
        accountId: formData.cariId,
        warehouseId: formData.warehouseId,
        date: formData.irsaliyeTarihi,
        discount: totals.toplamIskonto,
        notes: formData.aciklama,
        items: formData.kalemler.map(k => ({
          productId: k.stokId,
          quantity: k.miktar,
          unitPrice: k.birimFiyat,
          vatRate: k.kdvOrani,
          discountAmount: k.iskontoTutar,
        })),
      };

      if (editIrsaliyeId) {
        await axios.put(`/purchase-waybill/${editIrsaliyeId}`, payload);
        showSnackbar('İrsaliye başarıyla güncellendi', 'success');
      } else {
        await axios.post('/purchase-waybill', payload);
        showSnackbar('İrsaliye başarıyla oluşturuldu', 'success');
        clearDraft('purchase_delivery_note');
      }

      setTimeout(() => {
        if (onBack) onBack();
        else router.push('/purchase-delivery-note');
      }, 1500);
    } catch (e: any) {
      showSnackbar(e.response?.data?.message || 'Kaydedilirken hata oluştu', 'error');
    } finally {
      setSaving(false);
    }
  };

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
          <IconButton
            onClick={() => onBack ? onBack() : router.back()}
            sx={{
              bgcolor: 'var(--secondary)',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'var(--secondary)',
                transform: 'translateY(-1px)',
                boxShadow: 'var(--shadow-sm)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              bgcolor: 'color-mix(in srgb, var(--chart-4) 12%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <LocalShipping sx={{ color: 'var(--chart-4)', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="700" sx={{ color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
                {editIrsaliyeId ? 'Satın Alma İrsaliyesi Düzenle' : 'Yeni Satın Alma İrsaliyesi'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                İrsaliye bilgilerini {editIrsaliyeId ? 'güncelleyin' : 'girin veya siparişten aktarın'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Paper
        sx={{
          p: 3,
          borderRadius: 'var(--radius)',
          bgcolor: 'var(--card)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: 'var(--shadow-ambient)',
          },
          transition: 'box-shadow 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            bgcolor: 'var(--primary)',
          },
        }}
      >
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
                  label="İrsaliye No"
                  value={formData.irsaliyeNo}
                  onChange={e => setFormData(p => ({ ...p, irsaliyeNo: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Tarih"
                  value={formData.irsaliyeTarihi}
                  onChange={e => setFormData(p => ({ ...p, irsaliyeTarihi: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <FormControl className="form-control-select" required fullWidth>
                  <InputLabel>Ambar</InputLabel>
                  <Select
                    value={formData.warehouseId}
                    onChange={e => setFormData(p => ({ ...p, warehouseId: e.target.value }))}
                    label="Ambar"
                  >
                    {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
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
                  label="İrsaliye No"
                  value={formData.irsaliyeNo}
                  onChange={e => setFormData(p => ({ ...p, irsaliyeNo: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  className="form-control-textfield"
                  type="date"
                  label="Tarih"
                  value={formData.irsaliyeTarihi}
                  onChange={e => setFormData(p => ({ ...p, irsaliyeTarihi: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <FormControl className="form-control-select" required fullWidth>
                  <InputLabel>Ambar</InputLabel>
                  <Select
                    value={formData.warehouseId}
                    onChange={e => setFormData(p => ({ ...p, warehouseId: e.target.value }))}
                    label="Ambar"
                  >
                    {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
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
              <Box sx={{
                py: 1.5,
                px: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                borderRadius: 2,
                mb: 2,
              }}>
                <QrCodeScanner sx={{ color: 'var(--primary)', fontSize: 22 }} />
                <Typography variant="subtitle1" fontWeight="700" color="var(--foreground)">
                  Kalemler
                </Typography>
              </Box>
              <Box sx={{ py: 1, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    label="Barkod Okut"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleBarcodeSubmit(barcode)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><QrCodeScanner color="primary" /></InputAdornment>
                    }}
                    sx={{
                      width: 280,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--primary)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'var(--primary)',
                          boxShadow: '0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent)',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LocalShipping />}
                    onClick={fetchOrdersToImport}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      borderRadius: 1.5,
                      '&:hover': {
                        borderColor: 'var(--primary)',
                        bgcolor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Siparişten Aktar
                  </Button>
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

            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                p: isMobile ? 2 : 3,
                bgcolor: 'var(--card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                position: 'sticky',
                top: 80,
                background: 'linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--chart-4) 3%, var(--card)) 100%)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Description sx={{ color: 'var(--chart-4)', fontSize: 20 }} />
                <Typography variant="h6" fontWeight="bold" color="var(--foreground)">
                  İrsaliye Özeti
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
                    <Typography
                      variant="h5"
                      fontWeight="900"
                      sx={{
                        color: 'var(--chart-4)',
                        fontSize: '1.4rem',
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
              gap: 1.5,
              justifyContent: 'flex-end'
            }}>
              <Button
                variant="outlined"
                size="large"
                fullWidth={isMobile}
                onClick={() => {
                  const hasData = formData.cariId || formData.kalemler.length > 0 || formData.aciklama;
                  if (hasData && !editIrsaliyeId) {
                    if (window.confirm('Taslak verileriniz silinecek. Çıkmak istediğinize emin misiniz?')) {
                      clearDraft('purchase_delivery_note');
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
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    borderColor: 'var(--ring)',
                    bgcolor: 'color-mix(in srgb, var(--ring) 8%, transparent)',
                    transform: 'translateY(-1px)',
                    boxShadow: 'var(--shadow-sm)',
                  },
                  transition: 'all 0.2s ease',
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
                  bgcolor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: isMobile ? '100%' : 160,
                  boxShadow: 'var(--shadow-sm)',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    bgcolor: 'var(--primary)',
                    boxShadow: 'var(--shadow-md)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {saving ? 'Kaydediliyor...' : (editIrsaliyeId ? 'Güncelle' : 'Oluştur')}
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

export default function YeniSatinalmaIrsaliyeleriPage() {
  return <SatinAlmaIrsaliyeForm />;
}

export { SatinAlmaIrsaliyeForm };
