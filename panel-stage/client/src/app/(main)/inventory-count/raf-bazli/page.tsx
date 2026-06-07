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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Stack,
  Grid,
  alpha,
  useTheme,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Delete as DeleteIcon,
  QrCodeScanner as ScanIcon,
  Add as AddIcon,
  Warehouse as WarehouseIcon,
  LocationOn as LocationIcon,
  Inventory as InventoryIcon,
  KeyboardReturn as EnterIcon,
  CheckCircle as CheckIcon,
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

interface Location {
  id: string;
  code: string;
  name?: string;
  warehouse: {
    code: string;
    name: string;
  };
}

interface SayimKalemi {
  stokId: string;
  locationId: string;
  stok?: Stok;
  location?: Location;
  sistemMiktari: number;
  sayilanMiktar: number;
  farkMiktari: number;
}

export default function RafBazliSayimPage() {
  const theme = useTheme();
  const router = useRouter();
  const rafBarcodeRef = useRef<HTMLInputElement>(null);
  const urunBarcodeRef = useRef<HTMLInputElement>(null);

  const [sayimNo, setSayimNo] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kalemler, setKalemler] = useState<SayimKalemi[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [loading, setLoading] = useState(false);

  // Barkod okuma için state'ler
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [rafBarcodeInput, setRafBarcodeInput] = useState('');
  const [urunBarcodeInput, setUrunBarcodeInput] = useState('');
  const [barcodeMode, setBarcodeMode] = useState(false);

  // Manuel ekleme için
  const [urunler, setUrunler] = useState<Stok[]>([]);
  const [lokasyonlar, setLokasyonlar] = useState<Location[]>([]);
  const [manuelDialog, setManuelDialog] = useState(false);
  const [secilenUrun, setSecilenUrun] = useState<Stok | null>(null);
  const [secilenLokasyon, setSecilenLokasyon] = useState<Location | null>(null);
  const [manuelMiktar, setManuelMiktar] = useState(1);

  useEffect(() => {
    generateSayimNo();
    fetchUrunler();
    fetchLokasyonlar();
  }, []);

  useEffect(() => {
    if (barcodeMode && !currentLocation && rafBarcodeRef.current) {
      rafBarcodeRef.current.focus();
    } else if (barcodeMode && currentLocation && urunBarcodeRef.current) {
      urunBarcodeRef.current.focus();
    }
  }, [barcodeMode, currentLocation, kalemler]);

  const fetchUrunler = async () => {
    try {
      const response = await axios.get('/products', { params: { limit: 1000 } });
      setUrunler(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Ürün listesi hatası:', error);
    }
  };

  const fetchLokasyonlar = async () => {
    try {
      const response = await axios.get('/location', { params: { active: true } });
      setLokasyonlar(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Lokasyon hatası:', error);
    }
  };

  const generateSayimNo = async () => {
    try {
      const response = await axios.get('/inventory-count', { params: { sayimTipi: 'RAF_BAZLI', limit: 1 } });
      const sayimlar = response.data || [];
      const lastSayim = sayimlar[0];
      const lastNo = lastSayim ? parseInt(lastSayim.sayimNo.split('-')[2]) : 0;
      const newNo = (lastNo + 1).toString().padStart(3, '0');
      setSayimNo(`SAYRAF-${new Date().getFullYear()}-${newNo}`);
    } catch (error) {
      console.error('Sayım no hatası:', error);
    }
  };

  const handleRafBarcodeSubmit = async () => {
    if (!rafBarcodeInput.trim()) return;
    try {
      const response = await axios.get(`/inventory-count/barcode/location/${rafBarcodeInput}`);
      setCurrentLocation(response.data);
      setRafBarcodeInput('');
      showSnackbar(`Raf Seçildi: ${response.data.code}`, 'success');
    } catch (error: any) {
      showSnackbar('Raf barkodu bulunamadı', 'error');
      setRafBarcodeInput('');
    }
  };

  const handleUrunBarcodeSubmit = async () => {
    if (!urunBarcodeInput.trim() || !currentLocation) return;
    try {
      const response = await axios.get(`/inventory-count/barcode/products/${urunBarcodeInput}`);
      const stok = response.data;
      const existingIndex = kalemler.findIndex(k => k.stokId === stok.id && k.locationId === currentLocation.id);

      if (existingIndex >= 0) {
        const newKalemler = [...kalemler];
        newKalemler[existingIndex].sayilanMiktar += 1;
        newKalemler[existingIndex].farkMiktari = newKalemler[existingIndex].sayilanMiktar - newKalemler[existingIndex].sistemMiktari;
        setKalemler(newKalemler);
        showSnackbar(`${stok.stokAdi} (+1)`, 'success');
      } else {
        const locRes = await axios.get(`/location/${currentLocation.id}`);
        const productStock = locRes.data.productLocationStocks?.find((pls: any) => pls.productId === stok.id);
        const sistemMiktari = productStock?.qtyOnHand || 0;

        setKalemler([...kalemler, {
          stokId: stok.id,
          locationId: currentLocation.id,
          stok,
          location: currentLocation,
          sistemMiktari,
          sayilanMiktar: 1,
          farkMiktari: 1 - sistemMiktari
        }]);
        showSnackbar(`${stok.stokAdi} eklendi`, 'success');
      }
      setUrunBarcodeInput('');
    } catch (error: any) {
      showSnackbar('Ürün barkodu bulunamadı', 'error');
      setUrunBarcodeInput('');
    }
  };

  const handleManuelEkle = async () => {
    if (!secilenUrun || !secilenLokasyon || manuelMiktar <= 0) return;
    try {
      const locRes = await axios.get(`/location/${secilenLokasyon.id}`);
      const productStock = locRes.data.productLocationStocks?.find((pls: any) => pls.productId === secilenUrun.id);
      const sistemMiktari = productStock?.qtyOnHand || 0;

      const existingIndex = kalemler.findIndex(k => k.stokId === secilenUrun.id && k.locationId === secilenLokasyon.id);
      if (existingIndex >= 0) {
        const newKalemler = [...kalemler];
        newKalemler[existingIndex].sayilanMiktar = manuelMiktar;
        newKalemler[existingIndex].farkMiktari = manuelMiktar - newKalemler[existingIndex].sistemMiktari;
        setKalemler(newKalemler);
      } else {
        setKalemler([...kalemler, {
          stokId: secilenUrun.id,
          locationId: secilenLokasyon.id,
          stok: secilenUrun,
          location: secilenLokasyon,
          sistemMiktari,
          sayilanMiktar: manuelMiktar,
          farkMiktari: manuelMiktar - sistemMiktari
        }]);
      }
      setManuelDialog(false);
      setSecilenUrun(null);
      setSecilenLokasyon(null);
      setManuelMiktar(1);
      showSnackbar(`${secilenUrun.stokAdi} eklendi`, 'success');
    } catch (error) {
      showSnackbar('Hata oluştu', 'error');
    }
  };

  const handleSave = async () => {
    if (!sayimNo || kalemler.length === 0) return;
    try {
      setLoading(true);
      await axios.post('/inventory-count', {
        sayimNo,
        sayimTipi: 'RAF_BAZLI',
        aciklama,
        kalemler: kalemler.map(k => ({ stokId: k.stokId, locationId: k.locationId, sayilanMiktar: k.sayilanMiktar })),
      });
      showSnackbar('Raf bazlı sayım kaydedildi', 'success');
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
      title="Raf Bazlı (Adresli) Sayım"
      breadcrumbs={[{ label: 'Stok', href: '/stock' }, { label: 'Sayım', href: '/inventory-count' }, { label: 'Yeni Raf Bazlı' }]}
      headerActions={
        <Stack direction="row" spacing={1.5}>
          <Button
            variant={barcodeMode ? 'contained' : 'outlined'}
            startIcon={<ScanIcon />}
            onClick={() => { setBarcodeMode(!barcodeMode); setCurrentLocation(null); }}
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
            Manuel Ekle
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField
              label="Sayım Ref No"
              size="small"
              value={sayimNo}
              onChange={(e) => setSayimNo(e.target.value)}
              required
              sx={{ flexShrink: 0, width: { md: 250 }, '& .MuiOutlinedInput-root': { borderRadius: 2.5, fontWeight: 800, bgcolor: 'background.paper' } }}
            />
            <TextField
              fullWidth
              label="Açıklama"
              size="small"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Raf ve lokasyon bazlı sayım notları..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' } }}
            />
          </Stack>
        </Paper>

        {barcodeMode && (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.success.main, 0.02),
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: 'success.main'
            }}
          >
            {!currentLocation ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'warning.main', color: 'white', display: 'flex' }}>
                  <LocationIcon />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>ADIM 1: RAF BARKODUNU OKUTUN</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    inputRef={rafBarcodeRef}
                    placeholder="Raf kodunu girin veya barkodu okutun..."
                    value={rafBarcodeInput}
                    onChange={(e) => setRafBarcodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRafBarcodeSubmit()}
                    autoFocus
                    sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' } }}
                  />
                </Box>
                <Button variant="contained" color="warning" onClick={handleRafBarcodeSubmit} sx={{ height: 40, mt: 3, borderRadius: 2.5 }}>Rafı Seç</Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'success.main', color: 'white', display: 'flex' }}>
                  <ScanIcon />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>ADIM 2: ÜRÜN BARKODLARINI OKUTUN</Typography>
                    <Chip
                      icon={<WarehouseIcon sx={{ fontSize: '14px !important' }} />}
                      label={currentLocation.code}
                      size="small"
                      color="primary"
                      onDelete={() => setCurrentLocation(null)}
                      sx={{ fontWeight: 900, borderRadius: 1.5 }}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    size="small"
                    inputRef={urunBarcodeRef}
                    placeholder="Seçili raftaki ürünlerin barkodunu okutun..."
                    value={urunBarcodeInput}
                    onChange={(e) => setUrunBarcodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrunBarcodeSubmit()}
                    autoFocus
                    sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' } }}
                  />
                </Box>
                <Button variant="contained" color="success" onClick={handleUrunBarcodeSubmit} sx={{ height: 40, mt: 3, borderRadius: 2.5 }}>Ürünü Ekle</Button>
              </Stack>
            )}
          </Paper>
        )}

        <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Raf / Lokasyon</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Ürün Bilgisi</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Sistem Stok</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Sayılan</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Fark</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>İşlem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kalemler.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                      <Stack spacing={2} alignItems="center" sx={{ opacity: 0.4 }}>
                        <LocationIcon sx={{ fontSize: 64 }} />
                        <Typography variant="h6">Raf bazlı sayım kayıtları burada listelenecek</Typography>
                        <Typography variant="body2">İşleme başlamak için barkod okuma modunu aktif edin.</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  kalemler.map((kalem, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>
                        <Chip
                          label={kalem.location?.code}
                          size="small"
                          variant="outlined"
                          color="info"
                          sx={{ fontWeight: 800, borderRadius: 1.5 }}
                        />
                      </TableCell>
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
                          onChange={(e) => {
                            const newKalemler = [...kalemler];
                            newKalemler[idx].sayilanMiktar = Number(e.target.value);
                            newKalemler[idx].farkMiktari = newKalemler[idx].sayilanMiktar - newKalemler[idx].sistemMiktari;
                            setKalemler(newKalemler);
                          }}
                          sx={{ width: 100, '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 900 } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={kalem.farkMiktari > 0 ? `+${kalem.farkMiktari}` : kalem.farkMiktari}
                          color={kalem.farkMiktari > 0 ? 'success' : kalem.farkMiktari < 0 ? 'error' : 'default'}
                          size="small"
                          sx={{ fontWeight: 900, borderRadius: 1.5, minWidth: 60 }}
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

        {kalemler.length > 0 && (
          <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', borderBottom: '4px solid', borderColor: 'primary.main' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack direction="row" spacing={4} divider={<Divider orientation="vertical" flexItem />}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>TOPLAM RAF</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{new Set(kalemler.map(k => k.locationId)).size}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>TOPLAM ÜRÜN</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{kalemler.length}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main' }}>FAZLA TOPLAMI</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'success.main' }}>+{kalemler.filter(k => k.farkMiktari > 0).length}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => router.back()} sx={{ borderRadius: 2.5, fontWeight: 700 }}>Vazgeç</Button>
                  <Button variant="contained" startIcon={<CheckIcon />} onClick={handleSave} disabled={loading} sx={{ borderRadius: 2.5, fontWeight: 900, px: 4 }}>Sayımı Kaydet</Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Manuel Add Dialog */}
        <Dialog open={manuelDialog} onClose={() => setManuelDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 900 }}>Manuel Adresli Sayım Ekle</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Autocomplete
                options={lokasyonlar}
                getOptionLabel={(opt) => `${opt.code} - ${opt.warehouse.name}`}
                value={secilenLokasyon}
                onChange={(_, v) => setSecilenLokasyon(v)}
                renderInput={(params) => <TextField {...params} label="Raf / Lokasyon Seç" autoFocus />}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
              <Autocomplete
                options={urunler}
                getOptionLabel={(opt) => `${opt.stokKodu} - ${opt.stokAdi}`}
                value={secilenUrun}
                onChange={(_, v) => setSecilenUrun(v)}
                renderInput={(params) => <TextField {...params} label="Ürün Ara / Seç" />}
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
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setManuelDialog(false)} sx={{ fontWeight: 700 }}>İptal</Button>
            <Button variant="contained" onClick={handleManuelEkle} disabled={!secilenUrun || !secilenLokasyon} sx={{ fontWeight: 800, borderRadius: 2.5, px: 4 }}>Listeye Ekle</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 700 }}>{snackbar.message}</Alert>
        </Snackbar>
      </Stack>
    </StandardPage>
  );
}
