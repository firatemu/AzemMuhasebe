'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Stack,
  Grid,
  Alert,
  Autocomplete,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Add,
  Delete,
  Search,
  Inventory,
  LocalShipping,
  CheckCircle,
  ArrowForward,
  Assignment,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/stores/authStore';

interface StockMovement {
  id: string;
  moveType: 'ASSIGN_LOCATION' | 'PUT_AWAY' | 'TRANSFER';
  productId: string;
  product?: { stokKodu: string; stokAdi: string };
  fromWarehouseId?: string;
  fromWarehouse?: { name: string };
  toWarehouseId?: string;
  toWarehouse?: { name: string };
  fromLocationId?: string;
  fromLocation?: { code: string };
  toLocationId?: string;
  toLocation?: { code: string };
  qty: number;
  refType?: string;
  refId?: string;
  note?: string;
  createdAt: string;
  createdBy?: { fullName: string };
}

interface Warehouse {
  id: string;
  name: string;
}

interface Location {
  id: string;
  code: string;
  warehouseId: string;
}

interface Product {
  id: string;
  stokKodu: string;
  stokAdi: string;
}

type MovementType = 'ASSIGN_LOCATION' | 'PUT_AWAY' | 'TRANSFER';

const moveTypeConfig: Record<MovementType, { label: string; color: 'default' | 'primary' | 'success' | 'warning'; icon: React.ReactNode }> = {
  ASSIGN_LOCATION: { label: 'Lokasyon Ata', color: 'primary', icon: <Assignment sx={{ fontSize: 16 }} /> },
  PUT_AWAY: { label: 'Yerleştir', color: 'success', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
  TRANSFER: { label: 'Transfer', color: 'warning', icon: <ArrowForward sx={{ fontSize: 16 }} /> },
};

const BulkPutAwayDialog = memo(({
  onSave,
  onClose,
}: {
  onSave: (data: any) => void;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [whResponse, prResponse] = await Promise.all([
        axios.get('/warehouses'),
        axios.get('/products', { params: { limit: 1000 } }),
      ]);
      setWarehouses(whResponse.data?.data || whResponse.data || []);
      setProducts(prResponse.data?.data || prResponse.data || []);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
    }
  };

  const fetchLocations = async (warehouseId: string) => {
    try {
      const response = await axios.get('/location', { params: { warehouseId } });
      setLocations(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Lokasyonlar yüklenemedi:', error);
    }
  };

  useEffect(() => {
    if (selectedWarehouseId) {
      fetchLocations(selectedWarehouseId);
    }
  }, [selectedWarehouseId]);

  const handleAddProduct = (product: Product) => {
    setSelectedProducts((prev) => [...prev, product]);
    setQuantities((prev) => ({ ...prev, [product.id]: '1' }));
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    setQuantities((prev) => {
      const newQtys = { ...prev };
      delete newQtys[productId];
      return newQtys;
    });
  };

  const handleSubmit = () => {
    if (!selectedWarehouseId || !selectedLocationId || selectedProducts.length === 0) {
      return;
    }

    const items = selectedProducts.map((p) => ({
      productId: p.id,
      qty: parseFloat(quantities[p.id] || '1'),
      toWarehouseId: selectedWarehouseId,
      toLocationId: selectedLocationId,
    }));

    onSave({ items });
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle component="div" sx={{ bgcolor: 'background.neutral', pb: 2 }}>
        <Typography variant="h6" fontWeight={800}>Toplu Yerleştirme (Bulk Put-Away)</Typography>
        <Typography variant="caption" color="text.secondary">Birden fazla ürünü aynı lokasyona yerleştirin</Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Hedef Ambar</InputLabel>
              <Select
                value={selectedWarehouseId}
                onChange={(e: any) => {
                  setSelectedWarehouseId(e.target.value);
                  setSelectedLocationId('');
                }}
                label="Hedef Ambar"
              >
                {warehouses.map((wh) => (
                  <MenuItem key={wh.id} value={wh.id}>{wh.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth disabled={!selectedWarehouseId}>
              <InputLabel>Hedef Lokasyon</InputLabel>
              <Select
                value={selectedLocationId}
                onChange={(e: any) => setSelectedLocationId(e.target.value)}
                label="Hedef Lokasyon"
              >
                {locations.map((loc) => (
                  <MenuItem key={loc.id} value={loc.id}>{loc.code}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Ürünler</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Autocomplete
                sx={{ flex: 1 }}
                options={products.filter((p) => !selectedProducts.find((sp) => sp.id === p.id))}
                getOptionLabel={(option) => `${option.stokKodu} - ${option.stokAdi}`}
                onChange={(_, newValue) => newValue && handleAddProduct(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Ürün Ekle" placeholder="Ürün ara..." />
                )}
              />
            </Box>

            {selectedProducts.length === 0 ? (
              <Alert severity="info">Henüz ürün eklenmedi. Yukarıdan ürün seçip ekleyin.</Alert>
            ) : (
              <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 2 }}>
                {selectedProducts.map((product) => (
                  <Box
                    key={product.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {product.stokKodu} - {product.stokAdi}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        type="number"
                        size="small"
                        value={quantities[product.id] || '1'}
                        onChange={(e) => setQuantities((prev) => ({ ...prev, [product.id]: e.target.value }))}
                        sx={{ width: 80 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveProduct(product.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedWarehouseId || !selectedLocationId || selectedProducts.length === 0}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
          }}
        >
          Toplu Yerleştir
        </Button>
      </DialogActions>
    </Dialog>
  );
});

BulkPutAwayDialog.displayName = 'BulkPutAwayDialog';

const NewMovementDialog = memo(({
  movementType,
  onSave,
  onClose,
}: {
  movementType: MovementType;
  onSave: (data: any) => void;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    fromWarehouseId: '',
    toWarehouseId: '',
    fromLocationId: '',
    toLocationId: '',
    qty: '1',
    note: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [whResponse, prResponse] = await Promise.all([
        axios.get('/warehouses'),
        axios.get('/products', { params: { limit: 1000 } }),
      ]);
      setWarehouses(whResponse.data?.data || whResponse.data || []);
      setProducts(prResponse.data?.data || prResponse.data || []);
    } catch (error) {
      console.error('Veriler yüklenemedi:', error);
    }
  };

  const fetchLocations = async (warehouseId: string, type: 'from' | 'to') => {
    try {
      const response = await axios.get('/location', { params: { warehouseId } });
      const locs = response.data?.data || response.data || [];
      if (type === 'from') {
        setLocations((prev) => ({ ...prev, from: locs }));
      } else {
        setLocations((prev) => ({ ...prev, to: locs }));
      }
    } catch (error) {
      console.error('Lokasyonlar yüklenemedi:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'fromWarehouseId') fetchLocations(value, 'from');
    if (field === 'toWarehouseId') fetchLocations(value, 'to');
  };

  const handleSubmit = () => {
    if (!selectedProduct) return;

    const data: any = {
      productId: selectedProduct.id,
      qty: parseFloat(formData.qty),
      note: formData.note || undefined,
    };

    switch (movementType) {
      case 'ASSIGN_LOCATION':
        data.toLocationId = formData.toLocationId;
        break;
      case 'PUT_AWAY':
        data.toWarehouseId = formData.toWarehouseId;
        data.toLocationId = formData.toLocationId;
        break;
      case 'TRANSFER':
        data.fromWarehouseId = formData.fromWarehouseId;
        data.toWarehouseId = formData.toWarehouseId;
        data.fromLocationId = formData.fromLocationId;
        data.toLocationId = formData.toLocationId;
        break;
    }

    onSave(data);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle component="div" sx={{ bgcolor: 'background.neutral', pb: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          {moveTypeConfig[movementType].label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {movementType === 'ASSIGN_LOCATION' && 'Ürüne lokasyon atayın'}
          {movementType === 'PUT_AWAY' && 'Ürünü ambara yerleştirin'}
          {movementType === 'TRANSFER' && 'Ürünü bir lokasyondan diğerine transfer edin'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              fullWidth
              options={products}
              getOptionLabel={(option) => `${option.stokKodu} - ${option.stokAdi}`}
              value={selectedProduct}
              onChange={(_, newValue) => setSelectedProduct(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Ürün" placeholder="Ürün ara..." />
              )}
            />
          </Grid>

          {movementType === 'TRANSFER' && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Kaynak Ambar</InputLabel>
                  <Select
                    value={formData.fromWarehouseId}
                    onChange={(e: any) => handleChange('fromWarehouseId', e.target.value)}
                    label="Kaynak Ambar"
                  >
                    {warehouses.map((wh) => (
                      <MenuItem key={wh.id} value={wh.id}>{wh.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Hedef Ambar</InputLabel>
                  <Select
                    value={formData.toWarehouseId}
                    onChange={(e: any) => handleChange('toWarehouseId', e.target.value)}
                    label="Hedef Ambar"
                  >
                    {warehouses.map((wh) => (
                      <MenuItem key={wh.id} value={wh.id}>{wh.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {(movementType === 'PUT_AWAY' || movementType === 'TRANSFER') && (
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Hedef Ambar</InputLabel>
                <Select
                  value={formData.toWarehouseId}
                  onChange={(e: any) => handleChange('toWarehouseId', e.target.value)}
                  label="Hedef Ambar"
                >
                  {warehouses.map((wh) => (
                    <MenuItem key={wh.id} value={wh.id}>{wh.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {movementType === 'ASSIGN_LOCATION' && (
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Lokasyon</InputLabel>
                <Select
                  value={formData.toLocationId}
                  onChange={(e: any) => handleChange('toLocationId', e.target.value)}
                  label="Lokasyon"
                >
                  {locations.from?.map((loc) => (
                    <MenuItem key={loc.id} value={loc.id}>{loc.code}</MenuItem>
                  )) || []}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Miktar"
              value={formData.qty}
              onChange={(e: any) => handleChange('qty', e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Açıklama"
              value={formData.note}
              onChange={(e: any) => handleChange('note', e.target.value)}
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
          disabled={!selectedProduct || !formData.qty}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
          }}
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
});

NewMovementDialog.displayName = 'NewMovementDialog';

export default function StockMovementsPage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { permissions } = useAuthStore();

  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState<MovementType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMoveType, setFilterMoveType] = useState<string>('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  useEffect(() => {
    fetchMovements();
  }, [filterMoveType]);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (filterMoveType) params.moveType = filterMoveType;
      params.limit = 100;

      const response = await axios.get('/stock-movements', { params });
      const data = response.data?.data || response.data || [];
      setMovements(data);
    } catch (error) {
      console.error('Hareketler yüklenirken hata:', error);
      enqueueSnackbar('Hareketler yüklenemedi', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovement = async (type: MovementType, data: any) => {
    try {
      const endpoint = type === 'ASSIGN_LOCATION' ? '/stock-movements/assign-location' :
                       type === 'PUT_AWAY' ? '/stock-movements/put-away' :
                       '/stock-movements/transfer';
      await axios.post(endpoint, data);
      enqueueSnackbar('Hareket başarıyla oluşturuldu', { variant: 'success' });
      setOpenNewDialog(null);
      fetchMovements();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Hareket oluşturulamadı', { variant: 'error' });
    }
  };

  const handleBulkPutAway = async (data: any) => {
    try {
      await axios.post('/stock-movements/put-away/bulk', data);
      enqueueSnackbar('Toplu yerleştirme başarıyla tamamlandı', { variant: 'success' });
      setOpenBulkDialog(false);
      fetchMovements();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Toplu yerleştirme başarısız', { variant: 'error' });
    }
  };

  const filteredMovements = useMemo(() => {
    if (!searchTerm) return movements;
    const search = searchTerm.toLowerCase();
    return movements.filter((m: StockMovement) => {
      return (
        m.product?.stokKodu?.toLowerCase().includes(search) ||
        m.product?.stokAdi?.toLowerCase().includes(search) ||
        m.fromLocation?.code?.toLowerCase().includes(search) ||
        m.toLocation?.code?.toLowerCase().includes(search) ||
        m.note?.toLowerCase().includes(search)
      );
    });
  }, [movements, searchTerm]);

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Tarih',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleString('tr-TR') : '-'}
        </Typography>
      ),
    },
    {
      field: 'moveType',
      headerName: 'Hareket Tipi',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const config = moveTypeConfig[params.value as MovementType] || { label: params.value, color: 'default', icon: null };
        return (
          <Chip
            icon={config.icon as React.ReactElement}
            label={config.label}
            color={config.color}
            size="small"
            variant="tonal"
            sx={{ fontWeight: 700, borderRadius: 1 }}
          />
        );
      },
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
      field: 'qty',
      headerName: 'Miktar',
      width: 100,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'fromLocation',
      headerName: 'Kaynak Lokasyon',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value?.code || '-'}
        </Typography>
      ),
    },
    {
      field: 'toLocation',
      headerName: 'Hedef Lokasyon',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value?.code || '-'}
        </Typography>
      ),
    },
    {
      field: 'note',
      headerName: 'Açıklama',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" color="text.secondary">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'createdBy',
      headerName: 'Oluşturan',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value?.fullName || '-'}
        </Typography>
      ),
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
      title="Stok Hareketleri"
      subtitle="Lokasyon atama, yerleştirme ve transfer işlemlerini yönetin"
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            onClick={() => setOpenNewDialog('ASSIGN_LOCATION')}
            sx={{ borderRadius: 2 }}
          >
            Lokasyon Ata
          </Button>
          <Button
            variant="outlined"
            startIcon={<CheckCircle />}
            onClick={() => setOpenNewDialog('PUT_AWAY')}
            sx={{ borderRadius: 2 }}
          >
            Yerleştir
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowForward />}
            onClick={() => setOpenNewDialog('TRANSFER')}
            sx={{ borderRadius: 2 }}
          >
            Transfer
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenBulkDialog(true)}
            sx={{
              borderRadius: 2,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
            }}
          >
            Toplu Yerleştirme
          </Button>
        </Box>

        <StandardCard sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Ürün kodu, adı, lokasyon..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
              size="small"
            />
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Hareket Tipi</InputLabel>
              <Select
                value={filterMoveType}
                onChange={(e: any) => setFilterMoveType(e.target.value)}
                label="Hareket Tipi"
              >
                <MenuItem value="">Tümü</MenuItem>
                <MenuItem value="ASSIGN_LOCATION">Lokasyon Ata</MenuItem>
                <MenuItem value="PUT_AWAY">Yerleştir</MenuItem>
                <MenuItem value="TRANSFER">Transfer</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </StandardCard>

        <StandardCard padding={0}>
          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={filteredMovements}
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
      </Box>

      {openNewDialog && (
        <NewMovementDialog
          movementType={openNewDialog}
          onSave={(data) => handleCreateMovement(openNewDialog, data)}
          onClose={() => setOpenNewDialog(null)}
        />
      )}

      {openBulkDialog && (
        <BulkPutAwayDialog
          onSave={handleBulkPutAway}
          onClose={() => setOpenBulkDialog(false)}
        />
      )}
    </StandardPage>
  );
}