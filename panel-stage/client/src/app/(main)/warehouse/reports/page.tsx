'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Stack,
  TextField,
  Autocomplete,
  alpha,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Inventory2,
  Storage,
  Assessment,
  Search,
} from '@mui/icons-material';
import { StandardPage, StandardCard } from '@/components/common';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';

interface Location {
  id: string;
  code: string;
  name?: string;
  warehouseId?: string;
  warehouse: {
    code: string;
    name: string;
  };
}

interface Product {
  id: string;
  stokKodu: string;
  stokAdi: string;
  marka?: string;
}

interface StockByLocation {
  location: Location;
  stocks: Array<{
    product: Product;
    qtyOnHand: number;
  }>;
  totalQty: number;
}

interface LocationsByProduct {
  product: Product;
  locations: Array<{
    location: Location;
    qtyOnHand: number;
  }>;
  totalQty: number;
}

export default function DepoRaporlarPage() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  // Rafa Göre Stok
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [stockByLocation, setStockByLocation] = useState<StockByLocation | null>(null);

  // Ürüne Göre Raflar
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [locationsByProduct, setLocationsByProduct] = useState<LocationsByProduct | null>(null);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('/location', { params: { active: true } });
      setLocations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Raf listesi alınamadı:', error);
      setLocations([]);
    }
  };

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

  const fetchStockByLocation = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    try {
      const response = await axios.get(`/location/${selectedLocation.id}`);
      const location = response.data;

      const stocks = location.productLocationStocks.map((stock: any) => ({
        product: stock.product,
        qtyOnHand: stock.qtyOnHand,
      }));

      const totalQty = stocks.reduce((sum: number, stock: any) => sum + stock.qtyOnHand, 0);

      setStockByLocation({
        location: selectedLocation,
        stocks,
        totalQty,
      });
    } catch (error) {
      console.error('Raf stok bilgisi alınamadı:', error);
      setSnackbar({ open: true, message: 'Rapor alınamadı', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationsByProduct = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const locationMap = new Map<string, { location: Location; qtyOnHand: number }>();
      const locationsResponse = await axios.get('/location', { params: { active: true } });
      const allLocations = locationsResponse.data;

      for (const location of allLocations) {
        const locationDetail = await axios.get(`/location/${location.id}`);
        const stock = locationDetail.data.productLocationStocks.find(
          (s: any) => s.product.id === selectedProduct.id
        );

        if (stock && stock.qtyOnHand > 0) {
          locationMap.set(location.id, {
            location: {
              id: location.id,
              code: location.code,
              name: location.name,
              warehouse: location.warehouse,
            },
            qtyOnHand: stock.qtyOnHand,
          });
        }
      }

      const locations = Array.from(locationMap.values());
      const totalQty = locations.reduce((sum, loc) => sum + loc.qtyOnHand, 0);

      setLocationsByProduct({
        product: selectedProduct,
        locations,
        totalQty,
      });
    } catch (error) {
      console.error('Ürün raf bilgisi alınamadı:', error);
      setSnackbar({ open: true, message: 'Rapor alınamadı', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchStockByLocation();
    } else {
      setStockByLocation(null);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedProduct) {
      fetchLocationsByProduct();
    } else {
      setLocationsByProduct(null);
    }
  }, [selectedProduct]);

  const handleExportCSV = () => {
    setSnackbar({ open: true, message: 'CSV export özelliği yakında eklenecek', severity: 'info' });
  };

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
              <Assessment sx={{ fontSize: 32, color: 'primary.main' }} />
              Depo Raporları
            </Typography>
            <Typography variant="body2" color="text.secondary">Stoklarınızın depo ve raf bazlı dağılımını analiz edin.</Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExportCSV}
          sx={{ borderRadius: 2 }}
        >
          Dışa Aktar
        </Button>
      </Box>

      <StandardCard sx={{ p: 0 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ px: 2, pt: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<Storage sx={{ fontSize: 18 }} />} iconPosition="start" label="Rafa Göre Stok" sx={{ fontWeight: 700, minHeight: 60 }} />
          <Tab icon={<Inventory2 sx={{ fontSize: 18 }} />} iconPosition="start" label="Ürüne Göre Raflar" sx={{ fontWeight: 700, minHeight: 60 }} />
        </Tabs>

        {/* Tab 1: Rafa Göre Stok */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>1. Raf Seçimi</Typography>
                <Autocomplete
                  fullWidth
                  options={locations}
                  getOptionLabel={(option) => `${option.code} ${option.name ? `- ${option.name}` : ''} (${option.warehouse.code})`}
                  value={selectedLocation}
                  onChange={(_, newValue) => setSelectedLocation(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Raf kodu veya adı ile ara..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <Box component="li" key={key} {...otherProps}>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">{option.code}</Typography>
                          <Typography variant="caption" color="text.secondary">{option.warehouse.code} - {option.warehouse.name}</Typography>
                        </Box>
                      </Box>
                    );
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>2. Stok Özeti</Typography>
                <StandardCard sx={{ bgcolor: alpha('#6366f1', 0.05), borderColor: alpha('#6366f1', 0.1), py: 1.5 }}>
                  {stockByLocation ? (
                    <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="900" color="primary">{stockByLocation.totalQty}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TOPLAM STOK</Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="900" color="primary">{stockByLocation.stocks.length}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>ÜRÜN ÇEŞİDİ</Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 1 }}>
                      <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>Raf seçildiğinde özet burada görünecektir.</Typography>
                    </Box>
                  )}
                </StandardCard>
              </Grid>
            </Grid>

            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
                <CircularProgress size={40} />
                <Typography variant="body2" color="text.secondary">Stok verileri analiz ediliyor...</Typography>
              </Box>
            ) : stockByLocation ? (
              <TableContainer sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
                <Table>
                  <TableHead sx={{ bgcolor: alpha('#000', 0.02) }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Stok Kodu</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Ürün Adı</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Marka</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Miktar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockByLocation.stocks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                          <Inventory2 sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
                          <Typography color="text.secondary" fontWeight={700}>Bu rafta henüz ürün yok</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      stockByLocation.stocks.map((stock, index) => (
                        <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell><Typography variant="body2" fontWeight="700">{stock.product.stokKodu}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{stock.product.stokAdi}</Typography></TableCell>
                          <TableCell><Typography variant="body2" color="text.secondary">{stock.product.marka || '-'}</Typography></TableCell>
                          <TableCell align="right">
                            <Chip label={stock.qtyOnHand} size="small" color="primary" sx={{ fontWeight: 800, borderRadius: 1.5 }} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : !loading && !selectedLocation && (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: alpha('#000', 0.01), borderRadius: 3, border: '2px dashed', borderColor: 'divider' }}>
                <Search sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" fontWeight={700}>Analiz İçin Raf Seçin</Typography>
                <Typography variant="body2" color="text.disabled">Raf bazlı stok dökümü için yukarıdaki arama kutusunu kullanın.</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Tab 2: Ürüne Göre Raflar */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>1. Ürün Seçimi</Typography>
                <Autocomplete
                  fullWidth
                  options={products}
                  getOptionLabel={(option) => `${option.stokKodu} - ${option.stokAdi}`}
                  value={selectedProduct}
                  onChange={(_, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Ürün kodu veya adı ile ara..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <Box component="li" key={key} {...otherProps}>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">{option.stokKodu}</Typography>
                          <Typography variant="caption" color="text.secondary">{option.stokAdi} {option.marka && `• ${option.marka}`}</Typography>
                        </Box>
                      </Box>
                    );
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>2. Dağılım Özeti</Typography>
                <StandardCard sx={{ bgcolor: alpha('#10b981', 0.05), borderColor: alpha('#10b981', 0.1), py: 1.5 }}>
                  {locationsByProduct ? (
                    <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="900" color="success.main">{locationsByProduct.totalQty}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TOPLAM STOK</Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="900" color="success.main">{locationsByProduct.locations.length}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>RAF SAYISI</Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 1 }}>
                      <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>Ürün seçildiğinde dağılım burada görünecektir.</Typography>
                    </Box>
                  )}
                </StandardCard>
              </Grid>
            </Grid>

            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
                <CircularProgress size={40} color="success" />
                <Typography variant="body2" color="text.secondary">Ürün dağılımı hesaplanıyor...</Typography>
              </Box>
            ) : locationsByProduct ? (
              <TableContainer sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
                <Table>
                  <TableHead sx={{ bgcolor: alpha('#000', 0.02) }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Raf Kodu</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Depo</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Açıklama</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Miktar</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800 }}>İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {locationsByProduct.locations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <Storage sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
                          <Typography color="text.secondary" fontWeight={700}>Bu ürün hiçbir rafta bulunamadı</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      locationsByProduct.locations.map((loc, index) => (
                        <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell><Typography variant="body2" fontWeight="800" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{loc.location.code}</Typography></TableCell>
                          <TableCell><Typography variant="body2">{loc.location.warehouse.code} - {loc.location.warehouse.name}</Typography></TableCell>
                          <TableCell><Typography variant="body2" color="text.secondary">{loc.location.name || '-'}</Typography></TableCell>
                          <TableCell align="right">
                            <Chip label={loc.qtyOnHand} size="small" color="success" sx={{ fontWeight: 800, borderRadius: 1.5 }} />
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                const target = loc.location.warehouseId ?? loc.location.warehouse.code;
                                router.push(`/warehouse/warehouses/${target}`);
                              }}
                              sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 700 }}
                            >
                              Depoya Git
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : !loading && !selectedProduct && (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: alpha('#000', 0.01), borderRadius: 3, border: '2px dashed', borderColor: 'divider' }}>
                <Search sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" fontWeight={700}>Ürün Seçin</Typography>
                <Typography variant="body2" color="text.disabled">Seçilen ürünün depo içerisindeki konumlarını listelemek için yukarıyı kullanın.</Typography>
              </Box>
            )}
          </Box>
        )}
      </StandardCard>

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

