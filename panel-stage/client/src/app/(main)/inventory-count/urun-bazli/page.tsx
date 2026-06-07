'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Stack,
  alpha,
  useTheme,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Delete as DeleteIcon,
  QrCodeScanner as ScanIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Inventory as InventoryIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  KeyboardReturn as EnterIcon,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface Stok {
  id: string;
  stokKodu: string;
  stokAdi: string;
  birim: string;
}

interface SayimKalemi {
  stokId: string;
  stok?: Stok;
  sistemMiktari: number;
  sayilanMiktar: number;
  farkMiktari: number;
}

export default function UrunBazliSayimPage() {
  const theme = useTheme();
  const router = useRouter();
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const [sayimNo, setSayimNo] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kalemler, setKalemler] = useState<SayimKalemi[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [loading, setLoading] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeMode, setBarcodeMode] = useState(false);
  const [detayliOzetOpen, setDetayliOzetOpen] = useState(false);

  // Manuel ürün ekleme için
  const [urunler, setUrunler] = useState<Stok[]>([]);
  const [manuelDialog, setManuelDialog] = useState(false);
  const [secilenUrun, setSecilenUrun] = useState<Stok | null>(null);
  const [manuelMiktar, setManuelMiktar] = useState(1);

  useEffect(() => {
    generateSayimNo();
    fetchUrunler();
  }, []);

  useEffect(() => {
    if (barcodeMode && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [barcodeMode, kalemler]);

  const fetchUrunler = async () => {
    try {
      const response = await axios.get('/products', { params: { limit: 1000 } });
      setUrunler(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Ürün listesi yüklenemedi:', error);
    }
  };

  const generateSayimNo = async () => {
    try {
      const response = await axios.get('/inventory-count', { params: { sayimTipi: 'URUN_BAZLI', limit: 1 } });
      const sayimlar = response.data || [];
      const lastSayim = sayimlar[0];
      const lastNo = lastSayim ? parseInt(lastSayim.sayimNo.split('-')[2]) : 0;
      const newNo = (lastNo + 1).toString().padStart(3, '0');
      setSayimNo(`SAY-${new Date().getFullYear()}-${newNo}`);
    } catch (error) {
      console.error('Sayım numarası hatası:', error);
    }
  };

  const handleBarcodeSubmit = async () => {
    if (!barcodeInput.trim()) return;

    try {
      const response = await axios.get(`/inventory-count/barcode/products/${barcodeInput}`);
      const stok = response.data;
      const lastKalem = kalemler.length > 0 ? kalemler[kalemler.length - 1] : null;

      if (lastKalem && lastKalem.stokId === stok.id) {
        const newKalemler = [...kalemler];
        newKalemler[newKalemler.length - 1].sayilanMiktar += 1;
        newKalemler[newKalemler.length - 1].farkMiktari = newKalemler[newKalemler.length - 1].sayilanMiktar - newKalemler[newKalemler.length - 1].sistemMiktari;
        setKalemler(newKalemler);
        showSnackbar(`${stok.stokAdi} (+1)`, 'success');
      } else {
        let sistemMiktari = 0;
        const existingKalem = kalemler.find(k => k.stokId === stok.id);

        if (!existingKalem) {
          const movements = await axios.get(`/products/${stok.id}/stock-movements`);
          (movements.data.data || movements.data).forEach((h: any) => {
            if (h.hareketTipi === 'GIRIS') sistemMiktari += h.miktar;
            else if (h.hareketTipi === 'CIKIS' || h.hareketTipi === 'SATIS') sistemMiktari -= h.miktar;
          });
        } else {
          sistemMiktari = existingKalem.sistemMiktari;
        }

        setKalemler([...kalemler, { stokId: stok.id, stok, sistemMiktari, sayilanMiktar: 1, farkMiktari: 1 - sistemMiktari }]);
        showSnackbar(`${stok.stokAdi} eklendi`, 'success');
      }
      setBarcodeInput('');
    } catch (error: any) {
      showSnackbar('Barkod bulunamadı', 'error');
      setBarcodeInput('');
    }
  };

  const handleManuelEkle = async () => {
    if (!secilenUrun || manuelMiktar <= 0) return;
    try {
      const movements = await axios.get(`/products/${secilenUrun.id}/stock-movements`);
      let sistemMiktari = 0;
      (movements.data.data || movements.data).forEach((h: any) => {
        if (h.hareketTipi === 'GIRIS') sistemMiktari += h.miktar;
        else if (h.hareketTipi === 'CIKIS' || h.hareketTipi === 'SATIS') sistemMiktari -= h.miktar;
      });

      const existingIndex = kalemler.findIndex(k => k.stokId === secilenUrun.id);
      if (existingIndex >= 0) {
        const newKalemler = [...kalemler];
        newKalemler[existingIndex].sayilanMiktar = manuelMiktar;
        newKalemler[existingIndex].farkMiktari = manuelMiktar - newKalemler[existingIndex].sistemMiktari;
        setKalemler(newKalemler);
      } else {
        setKalemler([...kalemler, { stokId: secilenUrun.id, stok: secilenUrun, sistemMiktari, sayilanMiktar: manuelMiktar, farkMiktari: manuelMiktar - sistemMiktari }]);
      }
      setManuelDialog(false);
      setSecilenUrun(null);
      setManuelMiktar(1);
      showSnackbar(`${secilenUrun.stokAdi} eklendi`, 'success');
    } catch (error) {
      showSnackbar('Ürün eklenirken hata oluştu', 'error');
    }
  };

  const handleMiktarChange = (index: number, miktar: number) => {
    const newKalemler = [...kalemler];
    newKalemler[index].sayilanMiktar = miktar;
    newKalemler[index].farkMiktari = miktar - newKalemler[index].sistemMiktari;
    setKalemler(newKalemler);
  };

  const handleSave = async (durum: 'TASLAK' | 'TAMAMLANDI' = 'TASLAK') => {
    if (!sayimNo || kalemler.length === 0) return;
    try {
      setLoading(true);
      const grouped = kalemler.reduce((acc: any[], k) => {
        const ex = acc.find(x => x.stokId === k.stokId);
        if (ex) ex.sayilanMiktar += k.sayilanMiktar;
        else acc.push({ stokId: k.stokId, sayilanMiktar: k.sayilanMiktar });
        return acc;
      }, []);

      const response = await axios.post('/inventory-count', { sayimNo, sayimTipi: 'URUN_BAZLI', aciklama, kalemler: grouped });
      if (durum === 'TAMAMLANDI') await axios.put(`/inventory-count/${response.data.id}/complete`);

      showSnackbar(durum === 'TAMAMLANDI' ? 'Sayım tamamlandı!' : 'Sayım taslağa kaydedildi', 'success');
      setTimeout(() => router.push('/inventory-count/liste'), 1500);
    } catch (error: any) {
      showSnackbar('Kaydetme hatası', 'error');
    } finally { setLoading(false); }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <StandardPage
      title="Ürün Bazlı Stok Sayımı"
      breadcrumbs={[{ label: 'Stok', href: '/stock' }, { label: 'Sayım', href: '/inventory-count' }, { label: 'Yeni Ürün Bazlı' }]}
      headerActions={
        <Stack direction="row" spacing={1.5}>
          <Button
            variant={barcodeMode ? 'contained' : 'outlined'}
            startIcon={<ScanIcon />}
            onClick={() => setBarcodeMode(!barcodeMode)}
            color={barcodeMode ? 'success' : 'primary'}
            sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
          >
            {barcodeMode ? 'Okuma Modu Aktif' : 'Barkod Modunu Aç'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setManuelDialog(true)}
            sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
          >
            Manuel Ürün Ekle
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        {/* Header Info */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField
              label="Sayım Referans No"
              size="small"
              value={sayimNo}
              onChange={(e) => setSayimNo(e.target.value)}
              required
              sx={{ flexShrink: 0, width: { md: 250 }, '& .MuiOutlinedInput-root': { borderRadius: 2.5, fontWeight: 800, bgcolor: 'background.paper' } }}
            />
            <TextField
              fullWidth
              label="Sayım Açıklaması / Notlar"
              size="small"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Örn: 2025 Yılsonu Genel Stok Sayımı"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' } }}
            />
          </Stack>
        </Paper>

        {/* Barcode Scanning Area */}
        {barcodeMode && (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.success.main, 0.02),
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: 'success.main',
              animation: 'pulse 2s infinite'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.main', color: 'white', display: 'flex' }}>
                <ScanIcon />
              </Box>
              <TextField
                fullWidth
                inputRef={barcodeInputRef}
                placeholder="Ürün barkodunu okutun veya manuel girin..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSubmit()}
                autoFocus
                InputProps={{
                  sx: { borderRadius: 3, bgcolor: 'background.paper', fontSize: '1.1rem', fontWeight: 600 },
                  endAdornment: <EnterIcon sx={{ opacity: 0.3 }} />
                }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleBarcodeSubmit}
                sx={{ borderRadius: 3, px: 4, fontWeight: 900, height: 50 }}
              >
                Bul ve Ekle
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Main List */}
        <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <InventoryIcon color="primary" sx={{ fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>SAYILAN ÜRÜNLER ({kalemler.length})</Typography>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Ürün Bilgisi</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Sistem Stok</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Sayılan Miktar</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Fark</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>İşlem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kalemler.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                      <Stack spacing={2} alignItems="center" sx={{ opacity: 0.4 }}>
                        <ScanIcon sx={{ fontSize: 64 }} />
                        <Typography variant="h6">Okutulan ürünler burada listelenecek</Typography>
                        <Typography variant="body2">Ürün eklemek için yukarıdaki butonları kullanın.</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  kalemler.map((kalem, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{kalem.stok?.stokAdi}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{kalem.stok?.stokKodu}</Typography>
                      </TableCell>
                      <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600 }}>{kalem.sistemMiktari}</Typography></TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={kalem.sayilanMiktar}
                          onChange={(e) => handleMiktarChange(idx, Number(e.target.value))}
                          sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 900 } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={kalem.farkMiktari > 0 ? `+${kalem.farkMiktari}` : kalem.farkMiktari}
                          color={kalem.farkMiktari > 0 ? 'success' : kalem.farkMiktari < 0 ? 'error' : 'default'}
                          size="small"
                          sx={{ fontWeight: 900, borderRadius: 1.5, minWidth: 60, fontFamily: 'monospace' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => setKalemler(kalemler.filter((_, i) => i !== idx))}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Sticky Summary & Actions */}
        {kalemler.length > 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              border: '1px solid',
              borderColor: 'primary.main',
              position: 'sticky',
              bottom: 24,
              zIndex: 10,
              boxShadow: theme.shadows[4]
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={4} divider={<Divider orientation="vertical" flexItem />}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>TOPLAM KALEM</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>{kalemler.length}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main', textTransform: 'uppercase' }}>FAZLA ÜRÜN</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: 'success.main' }}>+{kalemler.filter(k => k.farkMiktari > 0).length}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'error.main', textTransform: 'uppercase' }}>EKSİK ÜRÜN</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: 'error.main' }}>-{kalemler.filter(k => k.farkMiktari < 0).length}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<BackIcon />} onClick={() => router.back()} sx={{ fontWeight: 700, borderRadius: 2.5 }}>İptal</Button>
                <Button variant="outlined" startIcon={<SaveIcon />} onClick={() => handleSave('TASLAK')} sx={{ fontWeight: 800, borderRadius: 2.5 }}>Taslak Olarak Tut</Button>
                <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => handleSave('TAMAMLANDI')} sx={{ fontWeight: 900, borderRadius: 2.5, px: 4 }}>Sayımı Tamamla</Button>
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Manuel Add Dialog */}
        <Dialog open={manuelDialog} onClose={() => setManuelDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 900 }}>Manuel Ürün Sayımı</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Autocomplete
                options={urunler}
                getOptionLabel={(opt) => `${opt.stokKodu} - ${opt.stokAdi}`}
                value={secilenUrun}
                onChange={(_, v) => setSecilenUrun(v)}
                renderInput={(params) => <TextField {...params} label="Ürün Ara / Seç" autoFocus />}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
              <TextField
                fullWidth
                type="number"
                label="Sayılan Miktar"
                value={manuelMiktar}
                onChange={(e) => setManuelMiktar(Number(e.target.value))}
                inputProps={{ min: 1 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
              <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
                Manuel eklediğiniz miktar, sistemdeki miktarla karşılaştırılarak fark raporuna yansıtılacaktır.
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setManuelDialog(false)} sx={{ fontWeight: 700 }}>Vazgeç</Button>
            <Button variant="contained" onClick={handleManuelEkle} disabled={!secilenUrun} sx={{ fontWeight: 800, borderRadius: 2.5, px: 4 }}>Listeye Ekle</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 700 }}>{snackbar.message}</Alert>
        </Snackbar>
      </Stack>
    </StandardPage>
  );
}
