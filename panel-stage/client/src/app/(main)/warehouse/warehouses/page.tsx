'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warehouse as WarehouseIcon,
  AccountTree as AccountTreeIcon,
} from '@mui/icons-material';
import MainLayout from '@/components/Layout/MainLayout';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { StandardPage, StandardCard } from '@/components/common';

interface Warehouse {
  id: string;
  code: string;
  name: string;
  active: boolean;
  address?: string;
  phone?: string;
  manager?: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  code: string;
  name: string;
  active: boolean;
  address: string;
  phone: string;
  manager: string;
}

const initialFormData: FormData = {
  code: '',
  name: '',
  active: true,
  address: '',
  phone: '',
  manager: '',
};

export default function DepoYonetimiPage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/warehouses');
      setWarehouses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Depo listesi alınamadı:', error);
      setSnackbar({ open: true, message: 'Depo listesi alınamadı', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingId(warehouse.id);
      setFormData({
        code: warehouse.code,
        name: warehouse.name,
        active: warehouse.active,
        address: warehouse.address || '',
        phone: warehouse.phone || '',
        manager: warehouse.manager || '',
      });
    } else {
      setEditingId(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    if (!formData.code && !editingId) {
      // Otomatik kod üretilsin istiyoruz, backend desteklemiyorsa burası hata verebilir.
      // Ama kullanıcı adı zorunlu.
    }
    if (!formData.name) {
      setSnackbar({ open: true, message: 'Depo adı zorunludur', severity: 'error' });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/warehouses/${editingId}`, formData);
        setSnackbar({ open: true, message: 'Depo güncellendi', severity: 'success' });
      } else {
        await axios.post('/warehouses', formData);
        setSnackbar({ open: true, message: 'Depo oluşturuldu', severity: 'success' });
      }
      handleCloseDialog();
      fetchWarehouses();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'İşlem başarısız';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu depoyu silmek istediğinizden emin misiniz?')) return;

    try {
      await axios.delete(`/warehouses/${id}`);
      setSnackbar({ open: true, message: 'Depo silindi', severity: 'success' });
      fetchWarehouses();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Silme işlemi başarısız';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleViewHierarchy = (warehouseId: string) => {
    router.push(`/warehouse/warehouses/${warehouseId}`);
  };

  return (
    <StandardPage>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WarehouseIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            Depo Yönetimi
          </Typography>
          <Typography variant="body2" color="text.secondary">İşletmenize ait stok depolarını buradan yönetebilirsiniz.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Yeni Depo
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><Typography color="text.secondary">Depolar yükleniyor...</Typography></Box>
      ) : warehouses.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Henüz depo kaydı yok. Yeni depo oluşturmak için "Yeni Depo" butonuna tıklayın.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {warehouses.map((warehouse: Warehouse) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={warehouse.id}>
              <StandardCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="700">
                      {warehouse.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      KOD: {warehouse.code}
                    </Typography>
                  </Box>
                  <Chip
                    label={warehouse.active ? 'Aktif' : 'Pasif'}
                    color={warehouse.active ? 'success' : 'default'}
                    variant={warehouse.active ? 'filled' : 'outlined'}
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: 1.5 }}
                  />
                </Box>

                <Stack spacing={1} sx={{ flex: 1 }}>
                  {warehouse.address && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.6 }}>📍</Typography>
                      <Typography variant="body2" color="text.secondary">{warehouse.address}</Typography>
                    </Box>
                  )}
                  {warehouse.phone && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.6 }}>📞</Typography>
                      <Typography variant="body2" color="text.secondary">{warehouse.phone}</Typography>
                    </Box>
                  )}
                  {warehouse.manager && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.6 }}>👤</Typography>
                      <Typography variant="body2" color="text.secondary">{warehouse.manager}</Typography>
                    </Box>
                  )}
                </Stack>

                <Box sx={{ display: 'flex', gap: 1, mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AccountTreeIcon />}
                    onClick={() => handleViewHierarchy(warehouse.id)}
                    sx={{ borderRadius: 1.5, flex: 1 }}
                  >
                    Yerleşim Planı
                  </Button>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog(warehouse)}
                    sx={{ bgcolor: 'primary.lighter', '&:hover': { bgcolor: 'primary.light' } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(warehouse.id)}
                    sx={{ bgcolor: 'error.lighter', '&:hover': { bgcolor: 'error.light' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </StandardCard>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, px: 3, pt: 3 }}>
          {editingId ? 'Depo Düzenle' : 'Yeni Depo Oluştur'}
        </DialogTitle>
        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            <TextField
              label="Depo Kodu"
              value={formData.code}
              onChange={(e: any) => setFormData({ ...formData, code: e.target.value })}
              fullWidth
              placeholder="Boş bırakılırsa otomatik oluşturulur"
              helperText="Boş bırakırsanız otomatik kod üretilir (örn: D001)"
            />

            <TextField
              label="Depo Adı"
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
              placeholder="örn: Ana Depo"
            />

            <TextField
              label="Adres"
              value={formData.address}
              onChange={(e: any) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
              placeholder="Depo adresi"
            />

            <TextField
              label="Telefon"
              value={formData.phone}
              onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
              placeholder="örn: 0212 123 45 67"
            />

            <TextField
              label="Yetkili"
              value={formData.manager}
              onChange={(e: any) => setFormData({ ...formData, manager: e.target.value })}
              fullWidth
              placeholder="Depo yetkilisi adı"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e: any) => setFormData({ ...formData, active: e.target.checked })}
                />
              }
              label="Depo Aktif"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2 }}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 2 }}>
            {editingId ? 'Güncelle' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StandardPage>
  );
}

