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
  Tabs,
  Tab,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Add,
  Delete,
  Search,
  Warehouse,
  GridView,
  Layers,
  ViewModule,
  Edit,
  ExpandMore,
  ChevronRight,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/stores/authStore';

interface Location {
  id: string;
  code: string;
  warehouseId: string;
  warehouse?: { name: string };
  layer: number;
  corridor: string;
  side: number;
  section: number;
  level: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface LocationTreeNode {
  id: string;
  code: string;
  type: 'warehouse' | 'layer' | 'corridor' | 'section' | 'level' | 'grid';
  name: string;
  children: LocationTreeNode[];
  location?: Location;
}

const LocationDialog = memo(({
  location,
  warehouses,
  onSave,
  onClose,
  isEdit = false,
}: {
  location?: Location | null;
  warehouses: Warehouse[];
  onSave: (data: any) => void;
  onClose: () => void;
  isEdit?: boolean;
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    warehouseId: location?.warehouseId || '',
    code: location?.code || '',
    layer: location?.layer?.toString() || '1',
    corridor: location?.corridor || '',
    side: location?.side?.toString() || '1',
    section: location?.section?.toString() || '1',
    level: location?.level?.toString() || '1',
    active: location?.active ?? true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.warehouseId || !formData.code) return;
    const data = {
      warehouseId: formData.warehouseId,
      code: formData.code,
      layer: parseInt(formData.layer),
      corridor: formData.corridor,
      side: parseInt(formData.side),
      section: parseInt(formData.section),
      level: parseInt(formData.level),
      active: formData.active,
    };
    onSave(data);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle component="div" sx={{ bgcolor: 'background.neutral', pb: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          {isEdit ? 'Lokasyon Düzenle' : 'Yeni Lokasyon Ekle'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Ambar lokasyon bilgilerini girin
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Ambar</InputLabel>
              <Select
                value={formData.warehouseId}
                onChange={(e: any) => handleChange('warehouseId', e.target.value)}
                label="Ambar"
                disabled={isEdit}
              >
                {warehouses.map((wh) => (
                  <MenuItem key={wh.id} value={wh.id}>{wh.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Lokasyon Kodu"
              value={formData.code}
              onChange={(e: any) => handleChange('code', e.target.value)}
              placeholder="Örn: A-01-01-01"
              disabled={isEdit}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Kat"
              value={formData.layer}
              onChange={(e: any) => handleChange('layer', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Koridor"
              value={formData.corridor}
              onChange={(e: any) => handleChange('corridor', e.target.value)}
              placeholder="A"
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Yan"
              value={formData.side}
              onChange={(e: any) => handleChange('side', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Bölüm"
              value={formData.section}
              onChange={(e: any) => handleChange('section', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Seviye"
              value={formData.level}
              onChange={(e: any) => handleChange('level', e.target.value)}
            />
          </Grid>
          {isEdit && (
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Aktif Durumu</InputLabel>
                <Select
                  value={formData.active ? 'true' : 'false'}
                  onChange={(e: any) => handleChange('active', e.target.value === 'true')}
                  label="Aktif Durumu"
                >
                  <MenuItem value="true">Aktif</MenuItem>
                  <MenuItem value="false">Pasif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.warehouseId || !formData.code}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
          }}
        >
          {isEdit ? 'Güncelle' : 'Lokasyon Ekle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

LocationDialog.displayName = 'LocationDialog';

const BulkCreateDialog = memo(({
  type,
  warehouses,
  onSave,
  onClose,
}: {
  type: 'grid' | 'sections' | 'levels';
  warehouses: Warehouse[];
  onSave: (data: any) => void;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    warehouseId: warehouses[0]?.id || '',
    layer: '1',
    corridor: 'A',
    side: '1',
    sectionCount: type === 'sections' ? '5' : '1',
    section: type === 'levels' ? '1' : '1',
    levelCount: type === 'levels' ? '5' : '1',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const data: any = {
      warehouseId: formData.warehouseId,
      layer: parseInt(formData.layer),
      corridor: formData.corridor,
      side: parseInt(formData.side),
    };

    if (type === 'grid') {
      data.locations = [];
      // Grid creation needs specific locations
    } else if (type === 'sections') {
      data.sectionCount = parseInt(formData.sectionCount);
    } else if (type === 'levels') {
      data.section = parseInt(formData.section);
      data.levelCount = parseInt(formData.levelCount);
    }

    onSave({ type, data });
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle component="div" sx={{ bgcolor: 'background.neutral', pb: 2 }}>
        <Typography variant="h6" fontWeight={800}>
          {type === 'grid' && 'Toplu Grid Oluştur'}
          {type === 'sections' && 'Toplu Bölüm Oluştur'}
          {type === 'levels' && 'Toplu Seviye Oluştur'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {type === 'grid' && 'Belirtilen parametrelere göre grid lokasyonları oluşturun'}
          {type === 'sections' && 'Belirtilen sayıda bölüm oluşturun'}
          {type === 'levels' && 'Belirtilen sayıda seviye oluşturun'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Ambar</InputLabel>
              <Select
                value={formData.warehouseId}
                onChange={(e: any) => handleChange('warehouseId', e.target.value)}
                label="Ambar"
              >
                {warehouses.map((wh) => (
                  <MenuItem key={wh.id} value={wh.id}>{wh.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Kat"
              value={formData.layer}
              onChange={(e: any) => handleChange('layer', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Koridor"
              value={formData.corridor}
              onChange={(e: any) => handleChange('corridor', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Yan"
              value={formData.side}
              onChange={(e: any) => handleChange('side', e.target.value)}
            />
          </Grid>
          {type === 'sections' && (
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Bölüm Sayısı"
                value={formData.sectionCount}
                onChange={(e: any) => handleChange('sectionCount', e.target.value)}
              />
            </Grid>
          )}
          {type === 'levels' && (
            <>
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Bölüm"
                  value={formData.section}
                  onChange={(e: any) => handleChange('section', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Seviye Sayısı"
                  value={formData.levelCount}
                  onChange={(e: any) => handleChange('levelCount', e.target.value)}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
          }}
        >
          Oluştur
        </Button>
      </DialogActions>
    </Dialog>
  );
});

BulkCreateDialog.displayName = 'BulkCreateDialog';

export default function LocationsPage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { permissions } = useAuthStore();
  const hasAllPermission = permissions.includes('ALL');

  const [locations, setLocations] = useState<Location[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState<'grid' | 'sections' | 'levels' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchData();
  }, [filterWarehouse]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (filterWarehouse) params.warehouseId = filterWarehouse;

      const response = await axios.get('/location', { params });
      const data = response.data?.data || response.data || [];
      setLocations(data);
    } catch (error) {
      console.error('Lokasyonlar yüklenirken hata:', error);
      enqueueSnackbar('Lokasyonlar yüklenemedi', { variant: 'error' });
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
    await Promise.all([fetchLocations(), fetchWarehouses()]);
    setLoading(false);
  };

  const handleOpenDialog = (location?: Location) => {
    setSelectedLocation(location || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLocation(null);
  };

  const handleSave = async (formData: any) => {
    try {
      if (selectedLocation?.id) {
        await axios.put(`/location/${selectedLocation.id}`, formData);
        enqueueSnackbar('Lokasyon güncellendi', { variant: 'success' });
      } else {
        await axios.post('/location', formData);
        enqueueSnackbar('Lokasyon eklendi', { variant: 'success' });
      }
      handleCloseDialog();
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Lokasyon kaydedilemedi', { variant: 'error' });
    }
  };

  const handleBulkCreate = async ({ type, data }: { type: string; data: any }) => {
    try {
      let endpoint = '';
      switch (type) {
        case 'grid':
          endpoint = '/location/bulk/grid';
          break;
        case 'sections':
          endpoint = '/location/bulk/sections';
          break;
        case 'levels':
          endpoint = '/location/bulk/levels';
          break;
      }
      await axios.post(endpoint, data);
      enqueueSnackbar('Lokasyonlar oluşturuldu', { variant: 'success' });
      setOpenBulkDialog(null);
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Lokasyonlar oluşturulamadı', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await axios.delete(`/location/${deleteTarget.id}`);
      enqueueSnackbar('Lokasyon silindi', { variant: 'success' });
      setOpenDeleteDialog(false);
      setDeleteTarget(null);
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Lokasyon silinemedi', { variant: 'error' });
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Tüm lokasyonları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) return;

    try {
      await axios.delete('/location/all/delete-all');
      enqueueSnackbar('Tüm lokasyonlar silindi', { variant: 'success' });
      fetchData();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Lokasyonlar silinemedi', { variant: 'error' });
    }
  };

  const filteredLocations = useMemo(() => {
    if (!searchTerm) return locations;
    const search = searchTerm.toLowerCase();
    return locations.filter((l: Location) => {
      return (
        l.code?.toLowerCase().includes(search) ||
        l.warehouse?.name?.toLowerCase().includes(search) ||
        l.corridor?.toLowerCase().includes(search)
      );
    });
  }, [locations, searchTerm]);

  const buildTree = (locs: Location[]): LocationTreeNode[] => {
    // Group by warehouse
    const warehouseMap = new Map<string, LocationTreeNode>();
    
    locs.forEach((loc) => {
      const whId = loc.warehouseId;
      const whName = loc.warehouse?.name || 'Bilinmeyen Ambar';
      
      if (!warehouseMap.has(whId)) {
        warehouseMap.set(whId, {
          id: whId,
          code: whId,
          type: 'warehouse',
          name: whName,
          children: [],
        });
      }
      
      // Add to warehouse children - simplified for now
      warehouseMap.get(whId)!.children.push({
        id: loc.id,
        code: loc.code,
        type: 'grid',
        name: loc.code,
        children: [],
        location: loc,
      });
    });
    
    return Array.from(warehouseMap.values());
  };

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: 'Lokasyon Kodu',
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GridView sx={{ color: 'primary.main', fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'warehouse',
      headerName: 'Ambar',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value?.name || '-'}
        </Typography>
      ),
    },
    {
      field: 'layer',
      headerName: 'Kat',
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
      ),
    },
    {
      field: 'corridor',
      headerName: 'Koridor',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value || '-'} size="small" sx={{ fontWeight: 700 }} />
      ),
    },
    {
      field: 'locationPath',
      headerName: 'Lokasyon Yolu',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const loc = params.row as Location;
        const path = `${loc.layer || '-'}-${loc.corridor || '-'}-${loc.side || '-'}-${loc.section || '-'}-${loc.level || '-'}`;
        return (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {path}
          </Typography>
        );
      },
    },
    {
      field: 'active',
      headerName: 'Durum',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Aktif' : 'Pasif'}
          color={params.value ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 600, borderRadius: 1 }}
        />
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
        const location = params.row as Location;
        return (
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
            <Tooltip title="Düzenle">
              <IconButton
                size="small"
                onClick={() => handleOpenDialog(location)}
                sx={{ color: 'warning.main' }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sil">
              <IconButton
                size="small"
                onClick={() => {
                  setDeleteTarget(location);
                  setOpenDeleteDialog(true);
                }}
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
      title="Lokasyon / Raf Yönetimi"
      subtitle="Ambar lokasyonlarını ve raf sistemlerini yönetin"
    >
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GridView />}
            onClick={() => setOpenBulkDialog('grid')}
            sx={{ borderRadius: 2 }}
          >
            Grid Oluştur
          </Button>
          <Button
            variant="outlined"
            startIcon={<Layers />}
            onClick={() => setOpenBulkDialog('sections')}
            sx={{ borderRadius: 2 }}
          >
            Bölüm Oluştur
          </Button>
          <Button
            variant="outlined"
            startIcon={<ViewModule />}
            onClick={() => setOpenBulkDialog('levels')}
            sx={{ borderRadius: 2 }}
          >
            Seviye Oluştur
          </Button>
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
            Yeni Lokasyon
          </Button>
        </Box>

        <StandardCard sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Lokasyon kodu, ambar adı..."
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
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Ambar</InputLabel>
              <Select
                value={filterWarehouse}
                onChange={(e: any) => setFilterWarehouse(e.target.value)}
                label="Ambar"
              >
                <MenuItem value="">Tümü</MenuItem>
                {warehouses.map((wh) => (
                  <MenuItem key={wh.id} value={wh.id}>{wh.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {hasAllPermission && locations.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteAll}
                sx={{ borderRadius: 2 }}
              >
                Tümünü Sil
              </Button>
            )}
          </Stack>
        </StandardCard>

        <StandardCard padding={0}>
          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={filteredLocations}
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

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Toplam {locations.length} lokasyon
          </Typography>
        </Box>
      </Box>

      {openDialog && (
        <LocationDialog
          location={selectedLocation}
          warehouses={warehouses}
          onSave={handleSave}
          onClose={handleCloseDialog}
          isEdit={!!selectedLocation?.id}
        />
      )}

      {openBulkDialog && (
        <BulkCreateDialog
          type={openBulkDialog}
          warehouses={warehouses}
          onSave={handleBulkCreate}
          onClose={() => setOpenBulkDialog(null)}
        />
      )}

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Delete color="error" />
            <Typography variant="h6" fontWeight={800} color="error.main">Lokasyon Silinecek</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {deleteTarget?.code} lokasyonunu silmek istediğinizden emin misiniz?
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