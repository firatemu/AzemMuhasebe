'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Update,
  Settings,
  ShoppingCartCheckout,
  TrendingUp,
  InfoOutlined,
  Refresh,
  FilterList
} from '@mui/icons-material';
import MainLayout from '@/components/Layout/MainLayout';
import axios from '@/lib/axios';

/**
 * Interface definition for product/stock data
 */
interface Stok {
  id: string;
  stokKodu: string;
  stokAdi: string;
  marka?: string | null;
  anaKategori?: string | null;
  altKategori?: string | null;
  satisFiyati?: number | null;
}

/**
 * Reusable component for Bulk Update sections
 */
interface BulkUpdateSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  stocks: Stok[];
  onUpdate: (payload: any) => void;
  loading: boolean;
  basePriceType: 'SALE' | 'PURCHASE';
}

function BulkUpdateSection({ title, subtitle, icon, stocks, onUpdate, loading, basePriceType }: BulkUpdateSectionProps) {
  const [marka, setMarka] = useState('');
  const [anaKategori, setAnaKategori] = useState('');
  const [altKategori, setAltKategori] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'percentage' | 'fixed'>('percentage');
  const [adjustmentValue, setAdjustmentValue] = useState('');

  const markaOptions = useMemo(() => {
    const values = stocks.map((s) => s.marka).filter(Boolean);
    return Array.from(new Set(values)).sort();
  }, [stocks]);

  const anaKategoriOptions = useMemo(() => {
    const values = stocks.map((s) => s.anaKategori).filter(Boolean);
    return Array.from(new Set(values)).sort();
  }, [stocks]);

  const altKategoriOptions = useMemo(() => {
    const filtered = anaKategori ? stocks.filter((s) => s.anaKategori === anaKategori) : stocks;
    const values = filtered.map((s) => s.altKategori).filter(Boolean);
    return Array.from(new Set(values)).sort();
  }, [stocks, anaKategori]);

  const handleProcess = () => {
    const valueNum = Number(adjustmentValue);
    if (!valueNum || valueNum === 0) return;

    onUpdate({
      marka: marka || undefined,
      anaKategori: anaKategori || undefined,
      altKategori: altKategori || undefined,
      adjustmentType,
      adjustmentValue: valueNum,
      basePriceType,
    });
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', mb: 3, border: '1px solid var(--border)', background: 'var(--card)' }}>
      {/* Section Header */}
      <Box sx={{ p: 2, bgcolor: 'var(--muted)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-sm)',
          bgcolor: basePriceType === 'SALE' ? 'var(--primary)' : 'var(--secondary)',
          color: basePriceType === 'SALE' ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1, color: 'var(--foreground)' }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography variant="caption" fontWeight={700} sx={{ color: 'var(--muted-foreground)', display: 'block', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Hedef Ürün Filtreleri
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Marka Seçin</InputLabel>
            <Select label="Marka Seçin" value={marka} onChange={(e) => setMarka(e.target.value)}>
              <MenuItem value=""><em>Tümü</em></MenuItem>
              {markaOptions.map(m => <MenuItem key={m || 'unknown'} value={(m || '') as string}>{m}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Ana Kategori</InputLabel>
            <Select label="Ana Kategori" value={anaKategori} onChange={(e) => { setAnaKategori(e.target.value); setAltKategori(''); }}>
              <MenuItem value=""><em>Tümü</em></MenuItem>
              {anaKategoriOptions.map(k => <MenuItem key={k || 'unknown'} value={(k || '') as string}>{k}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Alt Kategori</InputLabel>
            <Select label="Alt Kategori" value={altKategori} onChange={(e) => setAltKategori(e.target.value)} disabled={!anaKategori}>
              <MenuItem value=""><em>Tümü</em></MenuItem>
              {altKategoriOptions.map(k => <MenuItem key={k || 'unknown'} value={(k || '') as string}>{k}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="caption" fontWeight={700} sx={{ color: 'var(--muted-foreground)', display: 'block', mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Fiyat Artış Ayarları
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, mb: 3 }}>
          <RadioGroup row value={adjustmentType} onChange={(e) => setAdjustmentType(e.target.value as any)}>
            <FormControlLabel value="percentage" control={<Radio size="small" />} label={<Typography variant="body2">Yüzdelik (%)</Typography>} />
            <FormControlLabel value="fixed" control={<Radio size="small" />} label={<Typography variant="body2">Sabit Tutar (₺)</Typography>} />
          </RadioGroup>
          <TextField
            size="small"
            label={adjustmentType === 'percentage' ? 'Artış Yüzdesi' : 'Artış Tutarı'}
            type="number"
            value={adjustmentValue}
            onChange={(e) => setAdjustmentValue(e.target.value)}
            sx={{ width: 180 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">{adjustmentType === 'percentage' ? '%' : '₺'}</InputAdornment>,
            }}
          />
          <Button
            variant="contained"
            disabled={loading || !adjustmentValue}
            onClick={handleProcess}
            sx={{
              bgcolor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              boxShadow: 'var(--shadow-sm)',
              fontWeight: 600,
              textTransform: 'none',
              px: 4,
              borderRadius: 'var(--radius-md)',
              '&:hover': { bgcolor: 'var(--primary-hover)', boxShadow: 'var(--shadow-md)' }
            }}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <TrendingUp sx={{ fontSize: 16 }} />}
          >
            Fiyatları Hazırla ve Uygula
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default function TopluFiyatGuncellePage() {
  const [stocks, setStocks] = useState<Stok[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentPayload, setCurrentPayload] = useState<any>(null);
  const [summary, setSummary] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    void fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/products', { params: { limit: 1000 } });
      setStocks(response.data?.data ?? []);
    } catch (error) {
      console.error('Veriler alınamadı', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInitiated = (payload: any) => {
    setCurrentPayload(payload);
    setConfirmOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (!currentPayload) return;
    setConfirmOpen(false);
    setProcessing(true);
    try {
      const response = await axios.post('/price-cards/bulk-update', currentPayload);
      const { message, totalProcessed, successCount, skippedCount } = response.data;
      setSummary({
        open: true,
        severity: 'success',
        message: `${message} İşlem başarılı: ${successCount}, Atlanan: ${skippedCount}.`
      });
    } catch (error: any) {
      console.error('Hata:', error);
      setSummary({
        open: true,
        severity: 'error',
        message: error?.response?.data?.message ?? 'İşlem sırasında bir hata oluştu.'
      });
    } finally {
      setProcessing(false);
      setCurrentPayload(null);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              <Settings fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, color: 'var(--foreground)' }}>
                Toplu Fiyat Yönetimi
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                Ürün satış fiyatlarını toplu kurallar ile güncelleyin
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={fetchStocks} disabled={loading}>
            <Refresh fontSize="small" />
          </IconButton>
        </Box>

        {summary && (
          <Alert severity={summary.severity} sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSummary(null)}>
            {summary.message}
          </Alert>
        )}

        {/* Section 1: Mevcut Satış Fiyatları */}
        <BulkUpdateSection
          title="Mevcut Satış Fiyatları Güncelleme"
          subtitle="Seçili ürünlerin mevcut aktif satış fiyatları üzerine artış uygula."
          icon={<TrendingUp fontSize="small" />}
          stocks={stocks}
          loading={processing}
          basePriceType="SALE"
          onUpdate={handleUpdateInitiated}
        />

        {/* Section 2: Son Satınalma Fiyatına Göre */}
        <BulkUpdateSection
          title="Son Satınalma Fiyatına Göre Satış Fiyatı Belirleme"
          subtitle="En son satınalma faturanızdaki maliyet üzerine kar marjı ekleyerek satış fiyatı oluştur."
          icon={<ShoppingCartCheckout fontSize="small" />}
          stocks={stocks}
          loading={processing}
          basePriceType="PURCHASE"
          onUpdate={handleUpdateInitiated}
        />


        {/* Info Strip */}
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 'var(--radius-md)', bgcolor: 'var(--accent)', borderColor: 'var(--border)', border: '1px solid var(--border)' }}>
          <InfoOutlined sx={{ color: 'var(--muted-foreground)' }} />
          <Typography variant="body2" sx={{ color: 'var(--foreground)' }}>
            <strong>İpucu:</strong> Her iki işlem de ürünler için yeni birer fiyat kartı oluşturur. Mevcut geçmiş verileriniz korunur.
            İşlem bittiğinde ürünlerin satış fiyatı olarak bu yeni değerler geçerli olacaktır.
          </Typography>
        </Paper>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: 'var(--radius-md)', p: 1, bgcolor: 'var(--card)', border: '1px solid var(--border)' } }}>
        <DialogTitle sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
          Toplu İşlem Onayı
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'var(--muted-foreground)' }}>
            Seçili kriterlere uyan ürünlerin fiyatları <strong>kalıcı olarak</strong> güncellenecektir.
            Bu işlem sonrasında her ürün için yeni bir fiyat kartı oluşturulur.
            <br /><br />
            Devam etmek istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none', fontWeight: 600, color: 'var(--muted-foreground)' }}>
            Vazgeç
          </Button>
          <Button
            onClick={handleConfirmUpdate}
            variant="contained"
            sx={{ bgcolor: 'var(--primary)', color: 'var(--primary-foreground)', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 'var(--radius-md)', '&:hover': { bgcolor: 'var(--primary-hover)' } }}
          >
            Evet, İşlemi Başlat
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
