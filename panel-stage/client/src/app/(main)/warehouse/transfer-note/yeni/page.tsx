'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Alert,
  Snackbar,
  Grid,
  Stack,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Delete,
  Save,
  CheckCircle,
  SwapHoriz,
  Event,
  LocalShipping,
  Description,
  Inventory,
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { StandardPage, StandardCard } from '@/components/common';

interface Warehouse {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
}

interface Stok {
  id: string;
  stokKodu: string;
  stokAdi: string;
  birim: string;
  marka?: string;
}

interface TransferItem {
  stokId: string;
  stok?: Stok;
  miktar: number;
  fromLocationId?: string;
  toLocationId?: string;
  availableStock?: number;
  targetAvailableStock?: number;
}

export default function YeniTransferFisiPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stoklar, setStoklar] = useState<Stok[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState({
    tarih: new Date().toISOString().split('T')[0],
    fromWarehouseId: '',
    toWarehouseId: '',
    driverName: '',
    vehiclePlate: '',
    aciklama: '',
    kalemler: [] as TransferItem[],
  });

  useEffect(() => {
    fetchWarehouses();
    fetchStoklar();
  }, []);

  useEffect(() => {
    refreshAllStock();
  }, [formData.fromWarehouseId, formData.toWarehouseId]);

  const refreshAllStock = async () => {
    if (formData.kalemler.length === 0) return;

    const newKalemler = [...formData.kalemler];
    let changed = false;

    for (let i = 0; i < newKalemler.length; i++) {
      const kalem = newKalemler[i];
      if (kalem.stokId) {
        if (formData.fromWarehouseId) {
          const fromStock = await checkStock(formData.fromWarehouseId, kalem.stokId);
          if (kalem.availableStock !== fromStock) {
            newKalemler[i] = { ...newKalemler[i], availableStock: fromStock };
            changed = true;
          }
        }
        if (formData.toWarehouseId) {
          const toStock = await checkStock(formData.toWarehouseId, kalem.stokId);
          if (kalem.targetAvailableStock !== toStock) {
            newKalemler[i] = { ...newKalemler[i], targetAvailableStock: toStock };
            changed = true;
          }
        }
      }
    }

    if (changed) {
      setFormData(prev => ({ ...prev, kalemler: newKalemler }));
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/warehouses?active=true');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Ambar listesi alınamadı:', error);
    }
  };

  const fetchStoklar = async () => {
    try {
      const response = await axios.get('/products', { params: { limit: 1000 } });
      setStoklar(response.data.data || []);
    } catch (error) {
      console.error('Stok listesi alınamadı:', error);
    }
  };

  const checkStock = async (warehouseId: string, stokId: string) => {
    try {
      const response = await axios.get(`/warehouses/${warehouseId}/inventory`);
      const stockItem = response.data.find((item: any) => item.id === stokId);
      return stockItem?.qtyOnHand || 0;
    } catch (error) {
      console.error('Stok kontrolü yapılamadı:', error);
      return 0;
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      kalemler: [...formData.kalemler, { stokId: '', miktar: 1 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newKalemler = formData.kalemler.filter((_, i) => i !== index);
    setFormData({ ...formData, kalemler: newKalemler });
  };

  const handleItemChange = async (index: number, field: string, value: any) => {
    const newKalemler = [...formData.kalemler];
    newKalemler[index] = { ...newKalemler[index], [field]: value };

    // Stok seçildiğinde mevcut stoğu kontrol et
    if (field === 'stokId' && value) {
      if (formData.fromWarehouseId) {
        const availableStock = await checkStock(formData.fromWarehouseId, value);
        newKalemler[index].availableStock = availableStock;
      }
      if (formData.toWarehouseId) {
        const targetAvailableStock = await checkStock(formData.toWarehouseId, value);
        newKalemler[index].targetAvailableStock = targetAvailableStock;
      }
      const stok = stoklar.find(s => s.id === value);
      newKalemler[index].stok = stok;
    }

    setFormData({ ...formData, kalemler: newKalemler });
  };

  const handleSubmit = async (approve: boolean = false) => {
    // Validasyon
    if (!formData.fromWarehouseId || !formData.toWarehouseId) {
      setSnackbar({ open: true, message: 'Lütfen kaynak ve hedef ambarı seçin', severity: 'error' });
      return;
    }

    if (formData.fromWarehouseId === formData.toWarehouseId) {
      setSnackbar({ open: true, message: 'Kaynak ve hedef ambar aynı olamaz', severity: 'error' });
      return;
    }

    if (formData.kalemler.length === 0) {
      setSnackbar({ open: true, message: 'En az bir ürün eklemelisiniz', severity: 'error' });
      return;
    }

    // Stok kontrolü
    for (const kalem of formData.kalemler) {
      if (!kalem.stokId || kalem.miktar <= 0) {
        setSnackbar({ open: true, message: 'Lütfen tüm ürün bilgilerini doldurun', severity: 'error' });
        return;
      }
      if (kalem.availableStock !== undefined && kalem.miktar > kalem.availableStock) {
        setSnackbar({
          open: true,
          message: `${kalem.stok?.stokKodu} için yeterli stok yok. Mevcut: ${kalem.availableStock}`,
          severity: 'error'
        });
        return;
      }
    }

    try {
      setLoading(true);

      // Sanitize payload for backend validation
      const payload = {
        ...formData,
        kalemler: formData.kalemler.map(kalem => ({
          stokId: kalem.stokId,
          miktar: kalem.miktar,
          fromLocationId: kalem.fromLocationId,
          toLocationId: kalem.toLocationId
        }))
      };

      const response = await axios.post('/warehouse-transfer', payload);

      if (approve) {
        await axios.put(`/warehouse-transfer/${response.data.id}/approve`);
        setSnackbar({ open: true, message: 'Transfer fişi oluşturuldu ve onaylandı!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Transfer fişi oluşturuldu!', severity: 'success' });
      }

      setTimeout(() => router.push('/depo/transfer-fisi'), 1500);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Transfer fişi oluşturulamadı',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardPage>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => router.back()} variant="outlined" sx={{ borderRadius: 2 }}>Geri</Button>
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1 }}>
              <SwapHoriz sx={{ fontSize: 32, color: 'primary.main' }} />
              Yeni Ambar Transfer Fişi
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={() => handleSubmit(true)}
            disabled={loading}
            color="success"
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Kaydet ve Onayla
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => handleSubmit(false)}
            disabled={loading}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Taslak Kaydet
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <StandardCard sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Inventory sx={{ fontSize: 18 }} /> Ambar Bilgileri
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Çıkış Ambarı</InputLabel>
                  <Select
                    value={formData.fromWarehouseId}
                    onChange={(e) => setFormData({ ...formData, fromWarehouseId: e.target.value })}
                    label="Çıkış Ambarı"
                    sx={{ borderRadius: 2 }}
                  >
                    {warehouses.map((wh) => (
                      <MenuItem key={wh.id} value={wh.id}>
                        {wh.name} {wh.isDefault && '(Varsayılan)'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Giriş Ambarı</InputLabel>
                  <Select
                    value={formData.toWarehouseId}
                    onChange={(e) => setFormData({ ...formData, toWarehouseId: e.target.value })}
                    label="Giriş Ambarı"
                    sx={{ borderRadius: 2 }}
                  >
                    {warehouses.map((wh) => (
                      <MenuItem key={wh.id} value={wh.id}>
                        {wh.name} {wh.isDefault && '(Varsayılan)'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </StandardCard>

          <StandardCard padding={0}>
            <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SwapHoriz sx={{ fontSize: 18 }} /> Transfer Kalemleri
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddItem}
                disabled={!formData.fromWarehouseId}
                size="small"
                sx={{ borderRadius: 1.5 }}
              >
                Malzeme Ekle
              </Button>
            </Box>
            <Divider />

            {!formData.fromWarehouseId && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Alert severity="info" sx={{ borderRadius: 2, display: 'inline-flex' }}>
                  Malzeme eklemek için önce çıkış ambarını seçin
                </Alert>
              </Box>
            )}

            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Malzeme</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} width="100" align="center">Mevcut</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} width="120">Miktar</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} width="50"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.kalemler.map((kalem, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Autocomplete
                          options={stoklar}
                          getOptionLabel={(option) => `${option.stokKodu} - ${option.stokAdi}`}
                          value={stoklar.find(s => s.id === kalem.stokId) || null}
                          onChange={(_, value) => handleItemChange(index, 'stokId', value?.id || '')}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Malzeme/Hizmet Ara..."
                              variant="standard"
                              InputProps={{ ...params.InputProps, disableUnderline: true }}
                              sx={{ py: 0.5 }}
                            />
                          )}
                        />
                        {kalem.stok?.marka && (
                          <Typography variant="caption" display="block" color="primary.main" fontWeight={600}>
                            {kalem.stok.marka}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: kalem.availableStock !== undefined && kalem.miktar > kalem.availableStock ? 'error.main' : 'text.primary',
                            bgcolor: kalem.availableStock !== undefined && kalem.miktar > kalem.availableStock ? 'error.lighter' : 'action.hover',
                            px: 1, py: 0.5, borderRadius: 1, display: 'inline-block'
                          }}
                        >
                          {kalem.availableStock !== undefined ? kalem.availableStock : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={kalem.miktar}
                          onChange={(e) => handleItemChange(index, 'miktar', parseInt(e.target.value) || 0)}
                          variant="outlined"
                          size="small"
                          inputProps={{ min: 1, style: { fontWeight: 700, textAlign: 'center' } }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(index)}
                          sx={{ color: 'error.main', bgcolor: 'error.lighter', '&:hover': { bgcolor: 'error.light' } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {formData.kalemler.length === 0 && formData.fromWarehouseId && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                        Henüz malzeme eklenmedi. Malzeme eklemek için butona tıklayın.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </StandardCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <StandardCard sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Event sx={{ fontSize: 18 }} /> Genel Bilgiler
            </Typography>
            <TextField
              label="Transfer Tarihi"
              type="date"
              value={formData.tarih}
              onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Genel Açıklama"
              value={formData.aciklama}
              onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
              multiline
              rows={3}
              fullWidth
              placeholder="Transfer ile ilgili notlar..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </StandardCard>

          <StandardCard>
            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalShipping sx={{ fontSize: 18 }} /> Lojistik Bilgileri
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                label="Sürücü Adı Soyadı"
                value={formData.driverName}
                onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                fullWidth
                placeholder="Ad Soyad"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                label="Araç Plakası"
                value={formData.vehiclePlate}
                onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                fullWidth
                placeholder="06 AA 001"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Stack>
          </StandardCard>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StandardPage>
  );
}
