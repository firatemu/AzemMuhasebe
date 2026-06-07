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
  Edit,
  Delete,
  Visibility,
  Search,
  SwapHoriz,
  CheckCircle,
  Cancel,
  Pending,
  LocalShipping,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/stores/authStore';

interface WarehouseTransfer {
  id: string;
  transferNo: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  sourceWarehouseId: string;
  targetWarehouseId: string;
  sourceWarehouse?: { id: string; name: string };
  targetWarehouse?: { id: string; name: string };
  items: Array<{
    id: string;
    productId: string;
    product?: { stokKodu: string; stokAdi: string };
    quantity: number;
  }>;
  approvedBy?: string;
  approvedAt?: string;
  completedBy?: string;
  completedAt?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface Warehouse {
  id: string;
  name: string;
  code?: string;
}

interface Product {
  id: string;
  stokKodu: string;
  stokAdi: string;
}

const statusConfig: Record<string, { label: string; color: 'default' | 'warning' | 'success' | 'error'; icon: React.ReactNode }> = {
  PENDING: { label: 'Bekliyor', color: 'warning', icon: <Pending sx={{ fontSize: 16 }} /> },
  APPROVED: { label: 'Onaylandı', color: 'success', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
  COMPLETED: { label: 'Tamamlandı', color: 'success', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
  CANCELLED: { label: 'İptal', color: 'error', icon: <Cancel sx={{ fontSize: 16 }} /> },
};

const TransferDialog = memo(({
  transfer,
  warehouses,
  onSave,
  onClose,
  isEdit = false,
}: {
  transfer?: WarehouseTransfer | null;
  warehouses: Warehouse[];
  onSave: (data: any) => void;
  onClose: () => void;
  isEdit?: boolean;
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    sourceWarehouseId: transfer?.sourceWarehouseId || '',
    targetWarehouseId: transfer?.targetWarehouseId || '',
    items: transfer?.items || [],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products', { params: { limit: 1000 } });
      const data = response.data?.data || response.data || [];
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (!selectedProduct || !quantity) return;
    const newItem = {
      id: `temp-${Date.now()}`,
      productId: selectedProduct.id,
      product: { stokKodu: selectedProduct.stokKodu, stokAdi: selectedProduct.stokAdi },
      quantity: parseFloat(quantity),
    };
    setFormData((prev: any) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setSelectedProduct(null);
    setQuantity('');
  };

  const handleRemoveItem = (productId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items.filter((item: any) => item.productId !== productId),
    }));
  };

  const handleSubmit = () => {
    if (!formData.sourceWarehouseId || !formData.targetWarehouseId) {
      return;
    }
    if (formData.items.length === 0) {
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle component="div" sx={{ bgcolor: 'background.neutral', pb: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          {isEdit ? 'Transfer Düzenle' : 'Yeni Ambar Transferi'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Kaynak ve hedef ambar seçin, ürün ekleyin
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Kaynak Ambar</InputLabel>
              <Select
                value={formData.sourceWarehouseId}
                onChange={(e: any) => handleChange('sourceWarehouseId', e.target.value)}
                label="Kaynak Ambar"
              >
                {warehouses.map((wh) => (
                  <MenuItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Hedef Ambar</InputLabel>
              <Select
                value={formData.targetWarehouseId}
                onChange={(e: any) => handleChange('targetWarehouseId', e.target.value)}
                label="Hedef Ambar"
              >
                {warehouses.map((wh) => (
                  <MenuItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Items */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
              Transfer Ürünleri
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Autocomplete
                sx={{ flex: 1 }}
                options={products}
                getOptionLabel={(option) => `${option.stokKodu} - ${option.stokAdi}`}
                value={selectedProduct}
                onChange={(_, newValue) => setSelectedProduct(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Ürün Seç" placeholder="Ürün ara..." />
                )}
              />
              <TextField
                type="number"
                label="Miktar"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                sx={{ width: 120 }}
              />
              <Button
                variant="contained"
                onClick={handleAddItem}
                disabled={!selectedProduct || !quantity}
                sx={{ alignSelf: 'flex-end' }}
              >
                Ekle
              </Button>
            </Box>

            {formData.items.length === 0 ? (
              <Alert severity="info">Henüz ürün eklenmedi. Yukarıdan ürün seçip ekleyin.</Alert>
            ) : (
              <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 2 }}>
                {formData.items.map((item: any, index: number) => (
                  <Box
                    key={item.id || index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < formData.items.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {item.product?.stokKodu} - {item.product?.stokAdi}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.quantity} adet
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.productId)}
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
          disabled={!formData.sourceWarehouseId || !formData.targetWarehouseId || formData.items.length === 0}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
          }}
        >
          {isEdit ? 'Güncelle' : 'Transfer Oluştur'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

TransferDialog.displayName = 'TransferDialog';

export default function WarehouseTransferPage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { permissions } = useAuthStore();
  const hasAllPermission = permissions.includes('ALL');

  const [transfers, setTransfers] = useState<WarehouseTransfer[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<WarehouseTransfer | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WarehouseTransfer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (filterStatus) params.status = filterStatus;

      const response = await axios.get('/warehouse-transfer', { params });
      const data = response.data?.data || response.data || [];
      setTransfers(data);
    } catch (error) {
      console.error('Transferler yüklenirken hata:', error);
      enqueueSnackbar('Transferler yüklenemedi', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/warehouses');
      const data = response.data?.data || response.data || [];
      setWarehouses(data);
    } catch (error) {
      console.error('Ambaralar yüklenemedi:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchTransfers(), fetchWarehouses()]);
    setLoading(false);
  };

  const handleOpenDialog = (transfer?: WarehouseTransfer) => {
    setSelectedTransfer(transfer || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTransfer(null);
  };

  const handleSave = async (formData: any) => {
    try {
      if (selectedTransfer?.id) {
        await axios.put(`/warehouse-transfer/${selectedTransfer.id}`, formData);
        enqueueSnackbar('Transfer başarıyla güncellendi', { variant: 'success' });
      } else {
        await axios.post('/warehouse-transfer', formData);
        enqueueSnackbar('Transfer başarıyla oluşturuldu', { variant: 'success' });
      }
      handleCloseDialog();
      fetchData();
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      enqueueSnackbar(error.response?.data?.message || 'Kayıt sırasında bir hata oluştu', { variant: 'error' });
    }
  };

  const handleApprove = async (transfer: WarehouseTransfer) => {
    try {
      await axios.put(`/warehouse-transfer/${transfer.id}/approve`);
      enqueueSnackbar('Transfer onaylandı', { variant: 'success' });
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Onaylama başarısız', { variant: 'error' });
    }
  };

  const handleComplete = async (transfer: WarehouseTransfer) => {
    try {
      await axios.put(`/warehouse-transfer/${transfer.id}/complete`);
      enqueueSnackbar('Transfer tamamlandı', { variant: 'success' });
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Tamamlama başarısız', { variant: 'error' });
    }
  };

  const handleCancel = async (transfer: WarehouseTransfer) => {
    const reason = prompt('İptal sebebini girin:');
    if (!reason) return;

    try {
      await axios.put(`/warehouse-transfer/${transfer.id}/cancel`, { reason });
      enqueueSnackbar('Transfer iptal edildi', { variant: 'success' });
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'İptal başarısız', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await axios.delete(`/warehouse-transfer/${deleteTarget.id}`);
      enqueueSnackbar('Transfer silindi', { variant: 'success' });
      setOpenDeleteDialog(false);
      setDeleteTarget(null);
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Silme başarısız', { variant: 'error' });
    }
  };

  const filteredTransfers = useMemo(() => {
    if (!searchTerm) return transfers;
    const search = searchTerm.toLowerCase();
    return transfers.filter((t: WarehouseTransfer) => {
      return (
        t.transferNo?.toLowerCase().includes(search) ||
        t.sourceWarehouse?.name?.toLowerCase().includes(search) ||
        t.targetWarehouse?.name?.toLowerCase().includes(search)
      );
    });
  }, [transfers, searchTerm]);

  const columns: GridColDef[] = [
    {
      field: 'transferNo',
      headerName: 'Transfer No',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'sourceWarehouse',
      headerName: 'Kaynak Ambar',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value?.name || '-'}
        </Typography>
      ),
    },
    {
      field: 'targetWarehouse',
      headerName: 'Hedef Ambar',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value?.name || '-'}
        </Typography>
      ),
    },
    {
      field: 'items',
      headerName: 'Ürünler',
      width: 100,
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={(params.value as any[])?.length || 0}
          size="small"
          sx={{ fontWeight: 700, borderRadius: 1, bgcolor: 'action.hover' }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Durum',
      width: 130,
      renderCell: (params: GridRenderCellParams) => {
        const config = statusConfig[params.value] || { label: params.value, color: 'default', icon: null };
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
      field: 'createdAt',
      headerName: 'Tarih',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 220,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => {
        const transfer = params.row as WarehouseTransfer;
        const status = transfer.status;

        return (
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
            <Tooltip title="Görüntüle">
              <IconButton
                size="small"
                onClick={() => enqueueSnackbar(`${transfer.transferNo} - ${transfer.sourceWarehouse?.name} → ${transfer.targetWarehouse?.name}`, { variant: 'info' })}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>

            {status === 'PENDING' && (
              <>
                <Tooltip title="Onayla">
                  <IconButton
                    size="small"
                    onClick={() => handleApprove(transfer)}
                    sx={{ color: 'success.main' }}
                  >
                    <CheckCircle fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Düzenle">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(transfer)}
                    sx={{ color: 'warning.main' }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {status === 'APPROVED' && (
              <Tooltip title="Tamamla">
                <IconButton
                  size="small"
                  onClick={() => handleComplete(transfer)}
                  sx={{ color: 'success.main' }}
                >
                  <CheckCircle fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {(status === 'PENDING' || status === 'APPROVED') && (
              <Tooltip title="İptal Et">
                <IconButton
                  size="small"
                  onClick={() => handleCancel(transfer)}
                  sx={{ color: 'error.main' }}
                >
                  <Cancel fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {status === 'PENDING' && (
              <Tooltip title="Sil">
                <IconButton
                  size="small"
                  onClick={() => {
                    setDeleteTarget(transfer);
                    setOpenDeleteDialog(true);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
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
      title="Ambar Transferleri"
      subtitle="Ambarlar arası ürün transferlerini yönetin"
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
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
              background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
            }}
          >
            Yeni Transfer
          </Button>
        </Box>

        <StandardCard sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Transfer no, ambar adı..."
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
              <InputLabel>Durum</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e: any) => setFilterStatus(e.target.value)}
                label="Durum"
              >
                <MenuItem value="">Tümü</MenuItem>
                <MenuItem value="PENDING">Bekliyor</MenuItem>
                <MenuItem value="APPROVED">Onaylandı</MenuItem>
                <MenuItem value="COMPLETED">Tamamlandı</MenuItem>
                <MenuItem value="CANCELLED">İptal</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </StandardCard>

        <StandardCard padding={0}>
          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={filteredTransfers}
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

      {openDialog && (
        <TransferDialog
          transfer={selectedTransfer}
          warehouses={warehouses}
          onSave={handleSave}
          onClose={handleCloseDialog}
          isEdit={!!selectedTransfer?.id}
        />
      )}

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Delete color="error" />
            <Typography variant="h6" fontWeight={800} color="error.main">Transfer Silinecek</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {deleteTarget?.transferNo} numaralı transferi silmek istediğinizden emin misiniz?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>Bu işlem geri alınamaz!</Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: 'background.neutral' }}>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined" color="inherit" sx={{ borderRadius: 1.5, fontWeight: 700 }}>İptal</Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 1.5, fontWeight: 800, px: 3 }}>
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
    </StandardPage>
  );
}