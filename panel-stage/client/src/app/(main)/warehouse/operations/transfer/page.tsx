'use client';

import React, { Suspense, useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete,
  Divider,
  Stack,
  Chip,
  IconButton,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  SwapHoriz,
  Inventory2,
  ArrowForward,
  Warehouse as WarehouseIcon,
  LocationOn,
  Description as DescriptionIcon,
  DoubleArrow,
} from '@mui/icons-material';
import { StandardPage, StandardCard } from '@/components/common';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Grid from '@mui/material/Grid';

interface Product {
  id: string;
  stokKodu: string;
  stokAdi: string;
  marka?: string;
  birim: string;
}

interface Warehouse {
  id: string;
  code: string;
  name: string;
  active: boolean;
}

interface Location {
  id: string;
  warehouseId: string;
  code: string;
  barcode: string;
  name?: string;
  active: boolean;
  warehouse: {
    code: string;
    name: string;
  };
}

interface ProductStock {
  product: Product;
  qtyOnHand: number;
}

function TransferPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedFromLocationId = searchParams.get('fromLocationId');

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [fromLocations, setFromLocations] = useState<Location[]>([]);
  const [toLocations, setToLocations] = useState<Location[]>([]);
  const [productsInFromLocation, setProductsInFromLocation] = useState<ProductStock[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  const [formData, setFormData] = useState({
    productId: '',
    fromWarehouseId: '',
    fromLocationId: preselectedFromLocationId || '',
    toWarehouseId: '',
    toLocationId: '',
    qty: 1,
    note: '',
  });

  const [fromWarehouse, setFromWarehouse] = useState<Warehouse | null>(null);
  const [fromLocation, setFromLocation] = useState<Location | null>(null);
  const [toWarehouse, setToWarehouse] = useState<Warehouse | null>(null);
  const [toLocation, setToLocation] = useState<Location | null>(null);
  const [availableQty, setAvailableQty] = useState<number>(0);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products', {
        params: { limit: 1000 }
      });
      setProducts(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Ürün listesi alınamadı:', error);
      setProducts([]);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/warehouses', { params: { active: true } });
      setWarehouses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Depo listesi alınamadı:', error);
      setWarehouses([]);
    }
  };

  const fetchLocations = async (warehouseId: string, setLocationsFunc: (locations: Location[]) => void) => {
    try {
      const response = await axios.get('/location', {
        params: { warehouseId, active: true },
      });
      setLocationsFunc(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Raf listesi alınamadı:', error);
      setLocationsFunc([]);
    }
  };

  const fetchLocationDetails = async (locationId: string) => {
    try {
      const response = await axios.get(`/location/${locationId}`);
      const location = response.data;

      setFromLocation(location);
      setFromWarehouse({
        id: location.warehouseId,
        code: location.warehouse.code,
        name: location.warehouse.name,
        active: true,
      });
      setFormData({
        ...formData,
        fromWarehouseId: location.warehouseId,
        fromLocationId: location.id,
      });

      fetchLocations(location.warehouseId, setFromLocations);

      const productsData: ProductStock[] = location.productLocationStocks.map((stock: any) => ({
        product: stock.product,
        qtyOnHand: stock.qtyOnHand,
      }));
      setProductsInFromLocation(productsData);
    } catch (error) {
      console.error('Raf bilgisi alınamadı:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();

    if (preselectedFromLocationId) {
      fetchLocationDetails(preselectedFromLocationId);
    }
  }, [preselectedFromLocationId]);

  const handleFromWarehouseChange = (warehouse: Warehouse | null) => {
    setFromWarehouse(warehouse);
    setFromLocation(null);
    setFormData({
      ...formData,
      fromWarehouseId: warehouse?.id || '',
      fromLocationId: '',
    });

    if (warehouse) {
      fetchLocations(warehouse.id, setFromLocations);
    } else {
      setFromLocations([]);
    }
  };

  const handleFromLocationChange = async (location: Location | null) => {
    setFromLocation(location);
    setFormData({
      ...formData,
      fromLocationId: location?.id || '',
      productId: '',
      qty: 1,
    });
    setAvailableQty(0);

    if (location) {
      try {
        const response = await axios.get(`/location/${location.id}`);
        const productsData: ProductStock[] = response.data.productLocationStocks.map((stock: any) => ({
          product: stock.product,
          qtyOnHand: stock.qtyOnHand,
        }));
        setProductsInFromLocation(productsData);
      } catch (error) {
        console.error('Raf ürünleri alınamadı:', error);
      }
    } else {
      setProductsInFromLocation([]);
    }
  };

  const handleToWarehouseChange = (warehouse: Warehouse | null) => {
    setToWarehouse(warehouse);
    setToLocation(null);
    setFormData({
      ...formData,
      toWarehouseId: warehouse?.id || '',
      toLocationId: '',
    });

    if (warehouse) {
      fetchLocations(warehouse.id, setToLocations);
    } else {
      setToLocations([]);
    }
  };

  const handleToLocationChange = (location: Location | null) => {
    setToLocation(location);
    setFormData({
      ...formData,
      toLocationId: location?.id || '',
    });
  };

  const handleProductChange = (product: Product | null) => {
    setFormData({ ...formData, productId: product?.id || '', qty: 1 });

    if (product) {
      const stockInfo = productsInFromLocation.find(p => p.product.id === product.id);
      setAvailableQty(stockInfo?.qtyOnHand || 0);
    } else {
      setAvailableQty(0);
    }
  };

  const handleSubmit = async () => {
    if (!formData.productId || !formData.fromWarehouseId || !formData.fromLocationId ||
      !formData.toWarehouseId || !formData.toLocationId || formData.qty <= 0) {
      setSnackbar({ open: true, message: 'Lütfen tüm alanları doldurun', severity: 'error' });
      return;
    }

    if (formData.qty > availableQty) {
      setSnackbar({ open: true, message: `Maksimum ${availableQty} adet transfer edilebilir`, severity: 'error' });
      return;
    }

    if (formData.fromLocationId === formData.toLocationId) {
      setSnackbar({ open: true, message: 'Kaynak ve hedef raf aynı olamaz', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      await axios.post('/stock-movements/transfer', {
        productId: formData.productId,
        fromWarehouseId: formData.fromWarehouseId,
        fromLocationId: formData.fromLocationId,
        toWarehouseId: formData.toWarehouseId,
        toLocationId: formData.toLocationId,
        qty: formData.qty,
        note: formData.note || undefined,
      });

      setSnackbar({ open: true, message: 'Transfer işlemi başarılı', severity: 'success' });

      setTimeout(() => {
        if (preselectedFromLocationId) {
          setToWarehouse(null);
          setToLocation(null);
          setFormData({
            ...formData,
            productId: '',
            toWarehouseId: '',
            toLocationId: '',
            qty: 1,
            note: '',
          });
          setToLocations([]);
          setAvailableQty(0);
          if (fromLocation) {
            fetchLocationDetails(fromLocation.id);
          }
        } else {
          setFromWarehouse(null);
          setFromLocation(null);
          setToWarehouse(null);
          setToLocation(null);
          setFormData({
            productId: '',
            fromWarehouseId: '',
            fromLocationId: '',
            toWarehouseId: '',
            toLocationId: '',
            qty: 1,
            note: '',
          });
          setFromLocations([]);
          setToLocations([]);
          setProductsInFromLocation([]);
          setAvailableQty(0);
        }
      }, 1500);
    } catch (error: any) {
      console.error('Transfer işlemi başarısız:', error);
      const message = error.response?.data?.message || 'Transfer işlemi başarısız';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectedProductInfo = productsInFromLocation.find(p => p.product.id === formData.productId);

  return (
    <StandardPage>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Geri
          </Button>
          <Box>
            <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SwapHoriz sx={{ fontSize: 32, color: 'primary.main' }} />
              Transfer İşlemi
            </Typography>
            <Typography variant="body2" color="text.secondary">Ürünü bir raftan başka bir rafa transfer etmek için bilgileri girin.</Typography>
          </Box>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Kaynak Raf Bilgileri */}
            <StandardCard>
              <Typography variant="subtitle2" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, fontWeight: 700 }}>
                <DoubleArrow sx={{ fontSize: 18, transform: 'rotate(0deg)' }} /> 📤 Kaynak Raf
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={warehouses}
                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                    value={fromWarehouse}
                    onChange={(_, newValue) => handleFromWarehouseChange(newValue)}
                    disabled={!!preselectedFromLocationId}
                    renderInput={(params) => <TextField {...params} label="Kaynak Depo *" placeholder="Depo seç..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={fromLocations}
                    getOptionLabel={(option) => `${option.code} ${option.name ? `- ${option.name}` : ''}`}
                    value={fromLocation}
                    onChange={(_, newValue) => handleFromLocationChange(newValue)}
                    disabled={!formData.fromWarehouseId || !!preselectedFromLocationId}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Kaynak Raf *"
                        placeholder="Raf seç..."
                        helperText={!formData.fromWarehouseId ? 'Önce depo seçin' : ''}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Autocomplete
                  options={productsInFromLocation}
                  getOptionLabel={(option) => `${option.product.stokKodu} - ${option.product.stokAdi} (Stok: ${option.qtyOnHand})`}
                  value={selectedProductInfo || null}
                  onChange={(_, newValue) => handleProductChange(newValue?.product || null)}
                  disabled={!formData.fromLocationId}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ürün *"
                      placeholder="Ürün seç..."
                      helperText={
                        !formData.fromLocationId
                          ? 'Önce kaynak raf seçin'
                          : productsInFromLocation.length === 0
                            ? 'Bu rafta ürün yok'
                            : `Bu rafta ${productsInFromLocation.length} farklı ürün var`
                      }
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <Box component="li" key={key} {...otherProps}>
                        <Box sx={{ width: '100%' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="body2" fontWeight="bold">{option.product.stokKodu}</Typography>
                              <Typography variant="caption" color="text.secondary">{option.product.stokAdi}</Typography>
                            </Box>
                            <Chip label={`${option.qtyOnHand} ${option.product.birim}`} size="small" variant="outlined" color="primary" />
                          </Stack>
                        </Box>
                      </Box>
                    );
                  }}
                />
              </Box>
            </StandardCard>

            {/* Hedef Raf Bilgileri */}
            <StandardCard>
              <Typography variant="subtitle2" color="secondary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, fontWeight: 700 }}>
                <DoubleArrow sx={{ fontSize: 18 }} /> 📥 Hedef Raf
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={warehouses}
                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                    value={toWarehouse}
                    onChange={(_, newValue) => handleToWarehouseChange(newValue)}
                    renderInput={(params) => <TextField {...params} label="Hedef Depo *" placeholder="Depo seç..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={toLocations}
                    getOptionLabel={(option) => `${option.code} ${option.name ? `- ${option.name}` : ''}`}
                    value={toLocation}
                    onChange={(_, newValue) => handleToLocationChange(newValue)}
                    disabled={!formData.toWarehouseId}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Hedef Raf *"
                        placeholder="Raf seç..."
                        helperText={!formData.toWarehouseId ? 'Önce depo seçin' : ''}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Miktar *"
                    value={formData.qty}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setFormData({ ...formData, qty: value === '' ? 0 : parseInt(value, 10) });
                      }
                    }}
                    inputProps={{ min: 1, max: availableQty }}
                    helperText={availableQty > 0 ? `Max: ${availableQty}` : ''}
                    error={formData.qty > availableQty}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    fullWidth
                    label="Not (opsiyonel)"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    multiline
                    rows={1}
                    placeholder="Ek açıklama..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !formData.productId ||
                    !formData.fromWarehouseId ||
                    !formData.fromLocationId ||
                    !formData.toWarehouseId ||
                    !formData.toLocationId ||
                    formData.qty <= 0 ||
                    formData.qty > availableQty
                  }
                  sx={{ borderRadius: 2, height: 50, fontWeight: 700 }}
                >
                  {loading ? 'Transfer Ediliyor...' : 'Transfer İşlemini Tamamla'}
                </Button>
              </Box>
            </StandardCard>
          </Stack>
        </Grid>

        {/* Özet Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <StandardCard sx={{ bgcolor: alpha('#6366f1', 0.05), borderColor: alpha('#6366f1', 0.1) }}>
              <Typography variant="subtitle2" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, fontWeight: 800 }}>
                <Inventory2 sx={{ fontSize: 18 }} /> Transfer Özeti
              </Typography>

              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Transfer Edilen Ürün</Typography>
                  {selectedProductInfo ? (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" fontWeight="700">{selectedProductInfo.product.stokKodu}</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">{selectedProductInfo.product.stokAdi}</Typography>
                      <Chip
                        label={`Mevcut: ${availableQty}`}
                        size="small"
                        color="info"
                        sx={{ mt: 1, height: 20, fontSize: '0.65rem' }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', mt: 0.5 }}>Ürün seçilmedi</Typography>
                  )}
                </Box>

                <Box sx={{ position: 'relative' }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">Kaynak Raf</Typography>
                      {fromLocation ? (
                        <Chip
                          label={fromLocation.code}
                          size="small"
                          color="primary"
                          sx={{ mt: 0.5, fontWeight: 800, borderRadius: 1 }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', mt: 0.5 }}>Seçilmedi</Typography>
                      )}
                    </Box>

                    <Box sx={{ pt: 2 }}>
                      <ArrowForward color="primary" sx={{ fontSize: 20 }} />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" display="block">Hedef Raf</Typography>
                      {toLocation ? (
                        <Chip
                          label={toLocation.code}
                          size="small"
                          color="secondary"
                          sx={{ mt: 0.5, fontWeight: 800, borderRadius: 1 }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', mt: 0.5 }}>Seçilmedi</Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>

                {formData.qty > 0 && (
                  <Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="caption" color="text.secondary" display="block">Planlanan Miktar</Typography>
                    <Typography variant="h4" color="primary.main" fontWeight="900" sx={{ mt: 0.5 }}>
                      {formData.qty} <Typography component="span" variant="h6" color="text.secondary">{selectedProductInfo?.product.birim}</Typography>
                    </Typography>
                  </Box>
                )}
              </Stack>

              {!selectedProductInfo && !fromLocation && !toLocation && (
                <Box sx={{ textAlign: 'center', py: 4, opacity: 0.5 }}>
                  <SwapHoriz sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Formu doldurdukça transfer planı burada netleşecektir.
                  </Typography>
                </Box>
              )}
            </StandardCard>

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="800" gutterBottom>Transfer Kuralları</Typography>
              <Typography variant="caption" display="block">
                • Kaynak ve hedef raf aynı olamaz.
              </Typography>
              <Typography variant="caption" display="block">
                • Mevcut stok miktarından fazla transfer yapılamaz.
              </Typography>
              <Typography variant="caption" display="block">
                • Bu işlem stok miktarlarını fiziksel olarak günceller.
              </Typography>
            </Alert>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as any} sx={{ borderRadius: 2, boxShadow: 3 }} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StandardPage>
  );
}

export default function TransferPage() {
  return (
    <Suspense
      fallback={(
        <StandardPage>
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </StandardPage>
      )}
    >
      <TransferPageContent />
    </Suspense>
  );
}

