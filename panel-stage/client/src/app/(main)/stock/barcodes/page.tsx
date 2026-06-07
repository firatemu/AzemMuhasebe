'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Stack,
  Grid,
  Alert,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Add,
  Delete,
  Search,
  QrCode,
  Star,
  StarBorder,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';

interface ProductBarcode {
  id: string;
  barcode: string;
  productId: string;
  product?: { stokKodu: string; stokAdi: string };
  isPrimary: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  stokKodu: string;
  stokAdi: string;
}

const BarcodeDialog = memo(({
  barcode,
  products,
  selectedProductId,
  onSave,
  onClose,
  isEdit = false,
}: {
  barcode?: ProductBarcode | null;
  products: Product[];
  selectedProductId?: string;
  onSave: (data: any) => void;
  onClose: () => void;
  isEdit?: boolean;
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    productId: barcode?.productId || selectedProductId || '',
    barcode: barcode?.barcode || '',
    description: barcode?.description || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.productId || !formData.barcode) return;
    onSave(formData);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle component="div" sx={{ bgcolor: 'background.neutral', pb: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          {isEdit ? 'Barkod Düzenle' : 'Yeni Barkod Ekle'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Ürüne yeni bir barkod tanımlayın
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            {isEdit ? (
              <TextField
                fullWidth
                label="Ürün"
                value={barcode?.product?.stokKodu ? `${barcode.product.stokKodu} - ${barcode.product.stokAdi}` : ''}
                disabled
              />
            ) : (
              <Autocomplete
                fullWidth
                options={products}
                getOptionLabel={(option) => `${option.stokKodu} - ${option.stokAdi}`}
                value={products.find((p) => p.id === formData.productId) || null}
                onChange={(_, newValue) => handleChange('productId', newValue?.id || '')}
                renderInput={(params) => (
                  <TextField {...params} label="Ürün" placeholder="Ürün ara..." />
                )}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Barkod"
              value={formData.barcode}
              onChange={(e: any) => handleChange('barcode', e.target.value)}
              placeholder="Barkod numarasını girin"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCode />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Açıklama"
              value={formData.description}
              onChange={(e: any) => handleChange('description', e.target.value)}
              placeholder="Barkod açıklaması (opsiyonel)"
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.productId || !formData.barcode}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
          }}
        >
          {isEdit ? 'Güncelle' : 'Barkod Ekle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

BarcodeDialog.displayName = 'BarcodeDialog';

export default function ProductBarcodePage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [barcodes, setBarcodes] = useState<ProductBarcode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState<ProductBarcode | null>(null);
  const [searchBarcode, setSearchBarcode] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState<Product | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchBarcodes = async () => {
    try {
      setLoading(true);
      let data: ProductBarcode[] = [];

      if (selectedProductFilter?.id) {
        const response = await axios.get(`/product-barcode/product/${selectedProductFilter.id}`);
        data = response.data?.data || response.data || [];
      } else if (searchBarcode) {
        const response = await axios.get(`/product-barcode/barcode/${searchBarcode}`);
        data = response.data ? [response.data] : [];
      } else {
        // Fetch all products and their barcodes
        const productsResponse = await axios.get('/products', { params: { limit: 500 } });
        const prods = productsResponse.data?.data || productsResponse.data || [];
        setProducts(prods);

        // For simplicity, fetch first page of products and their barcodes
        const allBarcodes: ProductBarcode[] = [];
        for (const product of prods.slice(0, 50)) {
          try {
            const bcResponse = await axios.get(`/product-barcode/product/${product.id}`);
            const bcs = bcResponse.data?.data || bcResponse.data || [];
            allBarcodes.push(...bcs);
          } catch (e) {}
        }
        data = allBarcodes;
      }

      setBarcodes(data);
    } catch (error) {
      console.error('Barkodlar yüklenirken hata:', error);
      enqueueSnackbar('Barkodlar yüklenemedi', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products', { params: { limit: 500 } });
      setProducts(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchBarcodes()]);
    setLoading(false);
  };

  const handleOpenDialog = (barcode?: ProductBarcode) => {
    setSelectedBarcode(barcode || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBarcode(null);
  };

  const handleSave = async (formData: any) => {
    try {
      if (selectedBarcode?.id) {
        if (formData.barcode !== selectedBarcode.barcode || formData.productId !== selectedBarcode.productId) {
          await axios.delete(`/product-barcode/${selectedBarcode.id}`);
          await axios.post('/product-barcode', formData);
        }
        enqueueSnackbar('Barkod güncellendi', { variant: 'success' });
      } else {
        await axios.post('/product-barcode', formData);
        enqueueSnackbar('Barkod eklendi', { variant: 'success' });
      }
      handleCloseDialog();
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Barkod kaydedilemedi', { variant: 'error' });
    }
  };

  const handleSetPrimary = async (barcode: ProductBarcode) => {
    try {
      await axios.put(`/product-barcode/${barcode.id}/set-primary`);
      enqueueSnackbar('Ana barkod olarak ayarlandı', { variant: 'success' });
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Barkod güncellenemedi', { variant: 'error' });
    }
  };

  const handleDelete = async (barcode: ProductBarcode) => {
    if (!confirm(`${barcode.barcode} barkodunu silmek istediğinizden emin misiniz?`)) return;

    try {
      await axios.delete(`/product-barcode/${barcode.id}`);
      enqueueSnackbar('Barkod silindi', { variant: 'success' });
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Barkod silinemedi', { variant: 'error' });
    }
  };

  const handleSearchByBarcode = () => {
    if (searchBarcode) {
      setSelectedProductFilter(null);
      fetchBarcodes();
    }
  };

  const filteredBarcodes = useMemo(() => {
    if (!searchProduct) return barcodes;
    const search = searchProduct.toLowerCase();
    return barcodes.filter((b: ProductBarcode) => {
      return (
        b.product?.stokKodu?.toLowerCase().includes(search) ||
        b.product?.stokAdi?.toLowerCase().includes(search) ||
        b.barcode?.toLowerCase().includes(search)
      );
    });
  }, [barcodes, searchProduct]);

  const columns: GridColDef[] = [
    {
      field: 'isPrimary',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {params.value ? (
            <Star sx={{ color: 'warning.main', fontSize: 20 }} />
          ) : (
            <IconButton
              size="small"
              onClick={() => handleSetPrimary(params.row as ProductBarcode)}
              sx={{ color: 'text.disabled' }}
            >
              <StarBorder fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
    {
      field: 'barcode',
      headerName: 'Barkod',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QrCode sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'product',
      headerName: 'Ürün',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {params.value?.stokKodu || '-'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.value?.stokAdi || '-'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'description',
      headerName: 'Açıklama',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Oluşturulma',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="caption" color="text.secondary">
          {params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 150,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => {
        const barcode = params.row as ProductBarcode;
        return (
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
            <Tooltip title="Düzenle">
              <IconButton
                size="small"
                onClick={() => handleOpenDialog(barcode)}
                sx={{ color: 'warning.main' }}
              >
                <QrCode fontSize="small" />
              </IconButton>
            </Tooltip>
            {!barcode.isPrimary && (
              <Tooltip title="Ana Yap">
                <IconButton
                  size="small"
                  onClick={() => handleSetPrimary(barcode)}
                  sx={{ color: 'info.main' }}
                >
                  <Star fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Sil">
              <IconButton
                size="small"
                onClick={() => handleDelete(barcode)}
                sx={{ color: 'error.main' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StandardPage
      title="Ürün Barkodları"
      subtitle="Ürün barkodlarını yönetin, ana barkod belirleyin"
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
            }}
          >
            Yeni Barkod Ekle
          </Button>
        </Box>

        <StandardCard sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Barkod numarası ile ara..."
                value={searchBarcode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchBarcode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchByBarcode()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <QrCode color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchBarcode && (
                    <IconButton size="small" onClick={() => { setSearchBarcode(''); fetchBarcodes(); }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                fullWidth
                options={products}
                getOptionLabel={(option) => `${option.stokKodu} - ${option.stokAdi}`}
                value={selectedProductFilter}
                onChange={(_, newValue) => {
                  setSelectedProductFilter(newValue);
                  if (newValue) {
                    setSearchBarcode('');
                  }
                }}
                onInputChange={(_, newValue) => setSearchProduct(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Ürün ile filtrele..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </StandardCard>

        {barcodes.length === 0 && !loading && (
          <Alert severity="info">
            {selectedProductFilter
              ? `${selectedProductFilter.stokAdi} ürünü için tanımlı barkod bulunamadı`
              : searchBarcode
              ? `"${searchBarcode}" barkod numaralı ürün bulunamadı`
              : 'Barkod aramak için barkod numarası girin veya ürün seçin'}
          </Alert>
        )}

        {barcodes.length > 0 && (
          <StandardCard padding={0}>
            <Box sx={{ height: 600 }}>
              <DataGrid
                rows={filteredBarcodes}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 25, 50, 100]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'action.hover',
                    fontWeight: 700,
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                }}
              />
            </Box>
          </StandardCard>
        )}
      </Box>

      {openDialog && (
        <BarcodeDialog
          barcode={selectedBarcode}
          products={products}
          onSave={handleSave}
          onClose={handleCloseDialog}
          isEdit={!!selectedBarcode?.id}
        />
      )}
    </StandardPage>
  );
}