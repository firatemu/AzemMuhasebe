'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Divider,
  Stack,
  Autocomplete,
  CircularProgress,
  InputAdornment,
  Grid,
} from '@mui/material';
import { Save, ArrowBack, QrCodeScanner } from '@mui/icons-material';
import { StandardPage, StandardCard } from '@/components/common';
import DocumentItemTable, { DocumentItem } from '@/components/Form/DocumentItemTable';
import axios from '@/lib/axios';
import { useTabStore } from '@/stores/tabStore';

interface Account {
  id: string;
  code: string;
  name: string;
}

export default function DuzenleSatinAlmaTeklifiPage() {
  const params = useParams();
  const router = useRouter();
  const { addTab, setActiveTab } = useTabStore();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [barcode, setBarcode] = useState('');

  const [formData, setFormData] = useState({
    quoteNo: '',
    quoteType: 'PURCHASE' as 'SALE' | 'PURCHASE',
    accountId: '',
    date: '',
    validUntil: '',
    overallDiscountRate: 0,
    overallDiscountAmount: 0,
    notes: '',
    items: [] as DocumentItem[],
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accountsRes, productsRes, quoteRes] = await Promise.all([
          axios.get('/account', { params: { limit: 1000 } }),
          axios.get('/products', { params: { limit: 1000 } }),
          axios.get(`/quotes/${params.id}`)
        ]);

        setAccounts(accountsRes.data.data || []);
        setProducts((productsRes.data.data || []).map((p: any) => ({
          id: p.id,
          stokKodu: p.code,
          stokAdi: p.name,
          satisFiyati: Number(p.alisFiyati) || 0,
          kdvOrani: Number(p.vatRate) || 20,
          barkod: p.barcode,
          birim: p.unit || 'ADET'
        })));

        const quote = quoteRes.data;
        setFormData({
          quoteNo: quote.quoteNo,
          quoteType: quote.quoteType || 'PURCHASE',
          accountId: quote.accountId,
          date: quote.date ? new Date(quote.date).toISOString().split('T')[0] : '',
          validUntil: quote.validUntil ? new Date(quote.validUntil).toISOString().split('T')[0] : '',
          overallDiscountRate: 0,
          overallDiscountAmount: Number(quote.discount) || 0,
          notes: quote.notes || '',
          items: (quote.items || []).map((k: any) => ({
            stokId: k.productId,
            stok: k.product ? {
              id: k.product.id,
              stokKodu: k.product.code,
              stokAdi: k.product.name,
              satisFiyati: Number(k.product.salePrice) || 0,
              kdvOrani: Number(k.product.vatRate) || 20,
            } : undefined,
            miktar: Number(k.quantity) || 0,
            birimFiyat: Number(k.unitPrice) || 0,
            kdvOrani: Number(k.vatRate) || 0,
            iskontoOran: Number(k.discountRate) || 0,
            iskontoTutar: Number(k.discountAmount) || 0,
            birim: k.product?.unit || 'ADET'
          })),
        });

        addTab({ id: `quotes-purchase-edit-${params.id}`, label: `Düzenle: ${quote.quoteNo}`, path: `/quotes/purchase/duzenle/${params.id}` });
      } catch (error: any) {
        showSnackbar('Veriler yüklenirken hata oluştu', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchData();
  }, [params.id]);

  const totals = useMemo(() => {
    let araToplam = 0, kalemIskonto = 0, toplamKdv = 0;
    formData.items.forEach(k => {
      const lineTotal = k.miktar * k.birimFiyat;
      araToplam += lineTotal;
      kalemIskonto += (k.iskontoTutar || 0);
      const net = lineTotal - (k.iskontoTutar || 0);
      toplamKdv += (net * k.kdvOrani) / 100;
    });
    const genelIskonto = formData.overallDiscountAmount || 0;
    const netToplam = araToplam - kalemIskonto - genelIskonto;
    return { araToplam, toplamIskonto: kalemIskonto + genelIskonto, toplamKdv, genelToplam: netToplam + toplamKdv };
  }, [formData.items, formData.overallDiscountAmount]);

  const handleSave = async () => {
    try {
      if (!formData.accountId || formData.items.length === 0) {
        showSnackbar('Lütfen zorunlu alanları doldurun', 'error');
        return;
      }
      setSaving(true);
      await axios.put(`/quotes/${params.id}`, {
        quoteNo: formData.quoteNo,
        quoteType: 'PURCHASE',
        accountId: formData.accountId,
        date: new Date(formData.date).toISOString(),
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
        discount: Number(formData.overallDiscountAmount) || 0,
        notes: formData.notes,
        items: formData.items.map(k => ({
          productId: k.stokId,
          quantity: k.miktar,
          unitPrice: k.birimFiyat,
          vatRate: k.kdvOrani,
          discountRate: k.iskontoOran,
          discountAmount: k.iskontoTutar,
        })),
      });
      showSnackbar('Teklif güncellendi', 'success');
      setTimeout(() => router.push('/quotes/purchase'), 1500);
    } catch (e: any) {
      showSnackbar(e.response?.data?.message || 'Hata oluştu', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBarcodeSubmit = (barkod: string) => {
    if (!barkod) return;
    const stok = products.find(s => s.barkod === barkod.trim());
    if (stok) {
      const existingIndex = formData.items.findIndex(k => k.stokId === stok.id);
      if (existingIndex > -1) {
        const newItems = [...formData.items];
        newItems[existingIndex].miktar += 1;
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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;

  return (
    <StandardPage>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.back()}>Geri</Button>
          <Box>
            <Typography variant="h5" fontWeight="800">Teklifi Düzenle</Typography>
            <Typography variant="body2" color="text.secondary">{formData.quoteNo}</Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving} sx={{ borderRadius: 2, px: 4 }}>
          {saving ? 'Güncelleniyor...' : 'Güncelle'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <StandardCard sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Teklif Bilgileri</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Teklif No" value={formData.quoteNo} onChange={e => setFormData(p => ({ ...p, quoteNo: e.target.value }))} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth type="date" label="Tarih" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth type="date" label="Geçerlilik" value={formData.validUntil} onChange={e => setFormData(p => ({ ...p, validUntil: e.target.value }))} InputLabelProps={{ shrink: true }} /></Grid>
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={accounts}
                  getOptionLabel={o => `${o.code} - ${o.name}`}
                  value={accounts.find(a => a.id === formData.accountId) || null}
                  onChange={(_, nv) => setFormData(p => ({ ...p, accountId: nv?.id || '' }))}
                  renderInput={p => <TextField {...p} label="Cari Seçiniz" required />}
                />
              </Grid>
            </Grid>
          </StandardCard>

          <StandardCard padding={0}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid', borderColor: 'divider' }}>
              <TextField
                size="small"
                label="Barkod Okut"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBarcodeSubmit(barcode)}
                InputProps={{ startAdornment: <InputAdornment position="start"><QrCodeScanner color="action" /></InputAdornment> }}
                sx={{ width: 250 }}
              />
            </Box>
            <DocumentItemTable kalemler={formData.items} onChange={ni => setFormData(p => ({ ...p, items: ni }))} stoklar={products} cariId={formData.accountId} onSnackbar={showSnackbar} />
          </StandardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StandardCard sx={{ position: 'sticky', top: 24 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Teklif Özeti</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Ara Toplam</Typography><Typography fontWeight="700">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totals.araToplam)}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">İskonto</Typography><Typography fontWeight="700" color="error">-{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totals.toplamIskonto)}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">KDV Toplamı</Typography><Typography fontWeight="700">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totals.toplamKdv)}</Typography></Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6" fontWeight="800">Genel Toplam</Typography><Typography variant="h6" fontWeight="900" color="primary">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totals.genelToplam)}</Typography></Box>
              <TextField fullWidth multiline rows={3} label="Notlar" value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} />
            </Stack>
          </StandardCard>
        </Grid>
      </Grid>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(p => ({ ...p, open: false }))}><Alert severity={snackbar.severity}>{snackbar.message}</Alert></Snackbar>
    </StandardPage>
  );
}
