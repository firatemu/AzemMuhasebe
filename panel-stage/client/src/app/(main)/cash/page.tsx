'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
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
  Card,
  CardContent,
  Grid,
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Payments,
  CreditCard,
  ToggleOn,
  ToggleOff,
  AccountBalanceWallet,
  RefreshOutlined,
  TrendingUp,
  TrendingDown,
  Person,
  Search,
  Close,
  Refresh,
  Star,
  StarBorder,
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { StandardPage, StandardCard } from '@/components/common';
import { getDefaultCashboxId, setDefaultCashboxId } from '@/lib/defaultCashbox';

interface Kasa {
  id: string;
  code: string;
  name: string;
  type: 'CASH';
  balance: number;
  isActive: boolean;
  isRetail: boolean;
  _count?: {
    movements: number;
  };
}

export default function KasaPage() {
  const router = useRouter();
  const [kasalar, setKasalar] = useState<Kasa[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedKasa, setSelectedKasa] = useState<Kasa | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [defaultCashboxId, setDefaultCashboxIdState] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'CASH' as const,
    isActive: true,
    isRetail: false,
  });

  useEffect(() => {
    fetchKasalar();
  }, [showInactive]);

  useEffect(() => {
    setDefaultCashboxIdState(getDefaultCashboxId());
  }, []);

  const handleSetDefaultCashbox = (kasa: Kasa) => {
    if (!kasa.isActive) {
      showSnackbar('Pasif kasa varsayılan yapılamaz', 'error');
      return;
    }
    const nextId = defaultCashboxId === kasa.id ? null : kasa.id;
    setDefaultCashboxId(nextId);
    setDefaultCashboxIdState(nextId);
    showSnackbar(
      nextId ? `"${kasa.name}" varsayılan kasa olarak kaydedildi` : 'Varsayılan kasa kaldırıldı',
      'success',
    );
  };

  const fetchKasalar = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/cashbox', {
        params: { isActive: !showInactive },
      });
      setKasalar(response.data || []);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Kasalar yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = async () => {
    // Otomatik kod al
    let nextCode = '';
    try {
      const response = await axios.get('/code-templates/preview-code/CASHBOX');
      nextCode = response.data.nextCode || '';
    } catch (error) {
      console.log('Otomatik kod alınamadı');
    }

    setFormData({
      code: nextCode || '',
      name: '',
      type: 'CASH',
      isActive: true,
      isRetail: false,
    });
  };

  const openAddDialog = async () => {
    setEditMode(false);
    await resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (kasa: Kasa) => {
    setFormData({
      code: kasa.code,
      name: kasa.name,
      type: kasa.type,
      isActive: kasa.isActive,
      isRetail: kasa.isRetail,
    });
    setSelectedKasa(kasa);
    setEditMode(true);
    setOpenDialog(true);
  };

  const openDeleteDialog = (kasa: Kasa) => {
    setSelectedKasa(kasa);
    setOpenDelete(true);
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        code: formData.code && formData.code.trim().length > 0 ? formData.code : undefined,
        name: formData.name,
        type: formData.type,
        isActive: formData.isActive === true,
        isRetail: formData.isRetail === true,
      };

      if (editMode && selectedKasa) {
        await axios.put(`/cashbox/${selectedKasa.id}`, dataToSend);
        showSnackbar('Kasa başarıyla güncellendi', 'success');
      } else {
        await axios.post('/cashbox', dataToSend);
        showSnackbar('Kasa başarıyla oluşturuldu', 'success');
      }
      setOpenDialog(false);
      fetchKasalar();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedKasa) return;

    try {
      await axios.delete(`/cashbox/${selectedKasa.id}`);
      showSnackbar('Kasa başarıyla silindi', 'success');
      setOpenDelete(false);
      fetchKasalar();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Silme sırasında hata oluştu', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // İstatistik hesaplamaları
  const totalBalance = useMemo(() => kasalar.reduce((sum, k) => sum + (k.balance || 0), 0), [kasalar]);
  const activeCashbox = kasalar.filter(k => k.isActive && k.type === 'CASH').length;
  const totalMovements = useMemo(() => kasalar.reduce((sum, k) => sum + (k._count?.movements || 0), 0), [kasalar]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const theme = useTheme();

  const getKasaIcon = (type: string) => {
    return <Payments sx={{ color: theme.palette.primary.main }} />;
  };

  const getKasaColor = (type: string) => {
    return theme.palette.primary.main;
  };

  const getKasaTipLabel = (type: string) => {
    return 'Nakit Kasa';
  };

  const headerActions = (
    <Stack direction="row" spacing={1}>
      <Button
        variant="outlined"
        size="small"
        startIcon={showInactive ? <ToggleOff /> : <ToggleOn />}
        onClick={() => setShowInactive(!showInactive)}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          color: showInactive ? theme.palette.error.main : theme.palette.success.main,
          borderColor: alpha(showInactive ? theme.palette.error.main : theme.palette.success.main, 0.4),
          '&:hover': {
            borderColor: showInactive ? theme.palette.error.main : theme.palette.success.main,
            bgcolor: alpha(showInactive ? theme.palette.error.main : theme.palette.success.main, 0.05),
          },
        }}
      >
        {showInactive ? 'Aktifleri Göster' : 'Pasifleri Göster'}
      </Button>
      <Button
        variant="contained"
        size="small"
        startIcon={<Add />}
        onClick={openAddDialog}
        sx={{
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          boxShadow: 'none',
          '&:hover': { bgcolor: theme.palette.secondary.dark, boxShadow: 'none' },
        }}
      >
        Yeni Kasa Ekle
      </Button>
    </Stack>
  );

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Tip',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
          {getKasaIcon(params.value)}
          <Chip
            label={getKasaTipLabel(params.value)}
            size="small"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 700,
              borderRadius: 1,
              bgcolor: alpha(getKasaColor(params.value), 0.1),
              color: getKasaColor(params.value),
              borderColor: alpha(getKasaColor(params.value), 0.2),
            }}
          />
        </Box>
      ),
    },
    {
      field: 'code',
      headerName: 'Kasa Kodu',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'name',
      headerName: 'Kasa Adı',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{params.value}</Typography>
          {defaultCashboxId === params.row.id && (
            <Chip
              label="Varsayılan"
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                fontWeight: 800,
                bgcolor: alpha(theme.palette.secondary.main, 0.12),
                color: theme.palette.secondary.dark,
              }}
            />
          )}
          {params.row.isRetail && (
            <Chip
              label="Perakende"
              size="small"
              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark }}
            />
          )}
        </Box>
      ),
    },
    {
      field: 'balance',
      headerName: 'Bakiye',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 800,
            color: params.value >= 0 ? theme.palette.success.main : theme.palette.error.main,
          }}
        >
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Durum',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Aktif' : 'Pasif'}
          size="small"
          sx={{
            fontWeight: 600,
            borderRadius: 1.5,
            bgcolor: params.value ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
            color: params.value ? theme.palette.success.main : theme.palette.grey[700],
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 190,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, alignItems: 'center', height: '100%' }}>
          <Tooltip title={defaultCashboxId === params.row.id ? 'Varsayılanı kaldır' : 'Varsayılan kasa yap'}>
            <IconButton
              size="small"
              onClick={() => handleSetDefaultCashbox(params.row)}
              disabled={!params.row.isActive}
              sx={{
                color: defaultCashboxId === params.row.id ? theme.palette.warning.main : theme.palette.text.secondary,
                bgcolor: alpha(
                  defaultCashboxId === params.row.id ? theme.palette.warning.main : theme.palette.grey[500],
                  0.08,
                ),
              }}
            >
              {defaultCashboxId === params.row.id ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Detay">
            <IconButton
              size="small"
              onClick={() => router.push(`/cash/${params.row.id}`)}
              sx={{ color: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.05) }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Düzenle">
            <IconButton
              size="small"
              onClick={() => openEditDialog(params.row)}
              sx={{ color: theme.palette.warning.main, bgcolor: alpha(theme.palette.warning.main, 0.05) }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          {(!params.row._count?.movements || params.row._count.movements === 0) && (
            <Tooltip title="Sil">
              <IconButton
                size="small"
                onClick={() => openDeleteDialog(params.row)}
                sx={{ color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.05) }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <StandardPage title="Kasa Yönetimi" headerActions={headerActions}>
      {/* KPI Kartları - MODERNIZE */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Toplam Kasa', value: kasalar.length, icon: AccountBalanceWallet, color: theme.palette.primary.main },
          { label: 'Aktif Kasa', value: kasalar.filter(k => k.isActive).length, icon: Person, color: theme.palette.success.main },
          { label: 'Toplam Bakiye', value: formatCurrency(totalBalance), icon: TrendingUp, color: theme.palette.info.main },
          { label: 'Toplam Hareket', value: totalMovements, icon: TrendingDown, color: theme.palette.warning.main },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StandardCard>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: alpha(item.color as string, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <item.icon sx={{ color: item.color }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="800">
                    {item.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              </Stack>
            </StandardCard>
          </Grid>
        ))}
      </Grid>

      {/* Tablo Kartı */}
      {/* 6. DATAGRID */}
      <StandardCard padding={0}>
        <Box sx={{ height: 'auto', minHeight: 600, width: '100%' }}>
          <DataGrid
            rows={kasalar}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            disableRowSelectionOnClick
            loading={loading}
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderBottom: `1px solid ${theme.palette.divider}`,
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: theme.palette.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.05,
                },
              },
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                fontSize: '0.875rem',
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.background.paper, 0.4),
              },
            }}
          />
        </Box>
      </StandardCard>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle component="div" sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0' }}>
          {editMode ? 'Kasa Düzenle' : 'Yeni Kasa Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Kasa Tipi artık sabit CASH */}

            <TextField
              fullWidth
              label="Kasa Kodu"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              disabled={editMode}
              placeholder="Otomatik"
              helperText={!editMode && formData.code ? "Önerilen kod (değiştirilebilir)" : "Boş bırakılırsa otomatik"}
              sx={{
                '& .MuiInputBase-input': {
                  color: formData.code && !editMode ? '#0066cc' : 'inherit',
                  fontWeight: formData.code && !editMode ? 500 : 'normal'
                }
              }}
            />

            <TextField
              fullWidth
              label="Kasa Adı"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              autoFocus
              placeholder="Örn: Ana Kasa, Ziraat Bankası, vb."
            />



            <FormControl fullWidth>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Perakende Kasa</Typography>
                  <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>POS satışlarında nakit tahsilat için kullanılır</Typography>
                </Box>
                <Select
                  size="small"
                  value={formData.isRetail}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRetail: e.target.value === 'true' }))}
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value="true">Evet</MenuItem>
                  <MenuItem value="false">Hayır</MenuItem>
                </Select>
              </Box>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                label="Durum"
              >
                <MenuItem value="true">Kullanım İçi</MenuItem>
                <MenuItem value="false">Kullanım Dışı</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.name}>
            {editMode ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle component="div" sx={{ fontWeight: 'bold' }}>Kasa Sil</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{selectedKasa?.name}</strong> kasasını silmek istediğinizden emin misiniz?
          </Typography>
          {selectedKasa?._count && selectedKasa._count.movements > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Bu kasa hareket görmüştür ve silinemez. Kullanım dışı yapabilirsiniz.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>İptal</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StandardPage>
  );
}
