'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  Stack,
  Divider,
  Grid,
  alpha,
  useTheme,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  FormGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warehouse as WarehouseIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon,
  Info as InfoIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';
import locationService, { Province, District, Neighborhood } from '@/services/locationService';

interface Warehouse {
  id: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  isDefault: boolean;
  active: boolean;
  createdAt: string;
}

interface CompanyInfo {
  companyType: 'COMPANY' | 'INDIVIDUAL';
  companyName: string;
  taxNumber: string;
  taxOffice: string;
  mersisNo: string;
  firstName: string;
  lastName: string;
  tcNo: string;
  phone: string;
  email: string;
  website: string;
  country: string;
  city: string;
  district: string;
  neighborhood: string;
  postalCode: string;
  address: string;
  logoUrl?: string;
}

export default function FirmaAyarlariPage() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [companyLoading, setCompanyLoading] = useState(false);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    phone: '',
    isDefault: false,
    active: true,
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyType: 'COMPANY',
    companyName: '',
    taxNumber: '',
    taxOffice: '',
    mersisNo: '',
    firstName: '',
    lastName: '',
    tcNo: '',
    phone: '',
    email: '',
    website: '',
    country: 'Türkiye',
    city: '',
    district: '',
    neighborhood: '',
    postalCode: '',
    address: '',
    logoUrl: '',
  });

  useEffect(() => {
    if (tabValue === 0) {
      fetchCompanyInfo();
      loadProvinces();
    } else if (tabValue === 1) {
      fetchWarehouses();
    }
  }, [tabValue]);

  const loadProvinces = async () => {
    const data = await locationService.getProvinces();
    setProvinces(data);
  };

  const loadDistricts = async (provinceId: number) => {
    const data = await locationService.getDistricts(provinceId);
    setDistricts(data);
    setNeighborhoods([]);
  };

  const loadNeighborhoods = async (city: string, district: string) => {
    if (!city || !district) return;
    const data = await locationService.getLocalNeighborhoods(city, district);
    setNeighborhoods(data);
  };

  const fetchCompanyInfo = async () => {
    try {
      setCompanyLoading(true);
      const response = await axios.get('/tenants/settings');
      if (response.data) {
        setCompanyInfo({
          companyType: response.data.companyType || 'COMPANY',
          companyName: response.data.companyName || '',
          taxNumber: response.data.taxNumber || '',
          taxOffice: response.data.taxOffice || '',
          mersisNo: response.data.mersisNo || '',
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          tcNo: response.data.tcNo || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          website: response.data.website || '',
          country: response.data.country || 'Türkiye',
          city: response.data.city || '',
          district: response.data.district || '',
          neighborhood: response.data.neighborhood || '',
          postalCode: response.data.postalCode || '',
          address: response.data.address || '',
          logoUrl: response.data.logoUrl || '',
        });

        if (response.data.city) {
          const province = await locationService.findProvinceByName(response.data.city);
          if (province) {
            await loadDistricts(province.id);
            if (response.data.district) {
              await loadNeighborhoods(response.data.city, response.data.district);
            }
          }
        }
      }
    } catch (error) {
      console.error('Firma bilgileri yüklenemedi:', error);
    } finally {
      setCompanyLoading(false);
    }
  };

  const handleSaveCompanyInfo = async () => {
    if (companyInfo.companyType === 'COMPANY') {
      if (!companyInfo.companyName || !companyInfo.taxNumber) {
        setSnackbar({ open: true, message: 'Firma ünvanı ve vergi numarası zorunludur', severity: 'error' });
        return;
      }
    } else {
      if (!companyInfo.firstName || !companyInfo.lastName || !companyInfo.tcNo) {
        setSnackbar({ open: true, message: 'Ad, soyad ve TC kimlik numarası zorunludur', severity: 'error' });
        return;
      }
    }

    try {
      setCompanyLoading(true);
      await axios.put('/tenants/settings', companyInfo);
      setSnackbar({ open: true, message: 'Firma bilgileri kaydedildi', severity: 'success' });
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Kaydetme işlemi başarısız', severity: 'error' });
    } finally {
      setCompanyLoading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 75 * 1024) {
      setSnackbar({ open: true, message: 'Logo dosyası en fazla 75KB olabilir', severity: 'error' });
      return;
    }

    if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
      setSnackbar({ open: true, message: 'Sadece resim dosyaları (jpg, jpeg, png, gif) yüklenebilir', severity: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setCompanyLoading(true);
      const response = await axios.post('/tenants/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCompanyInfo({ ...companyInfo, logoUrl: response.data.logoUrl });
      setSnackbar({ open: true, message: 'Logo başarıyla yüklendi', severity: 'success' });
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Logo yüklenirken hata oluştu', severity: 'error' });
    } finally {
      setCompanyLoading(false);
      event.target.value = '';
    }
  };

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/warehouses');
      setWarehouses(response.data);
    } catch (error) {
      console.error('Ambarlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setFormData({
        code: warehouse.code,
        name: warehouse.name,
        address: warehouse.address || '',
        phone: warehouse.phone || '',
        isDefault: warehouse.isDefault,
        active: warehouse.active,
      });
    } else {
      setEditingWarehouse(null);
      setFormData({
        code: '',
        name: '',
        address: '',
        phone: '',
        isDefault: false,
        active: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingWarehouse(null);
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.name) {
      setSnackbar({ open: true, message: 'Lütfen zorunlu alanları doldurun', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      if (editingWarehouse) {
        await axios.put(`/warehouses/${editingWarehouse.id}`, formData);
        setSnackbar({ open: true, message: 'Ambar güncellendi', severity: 'success' });
      } else {
        await axios.post('/warehouses', formData);
        setSnackbar({ open: true, message: 'Ambar oluşturuldu', severity: 'success' });
      }
      handleCloseDialog();
      fetchWarehouses();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'İşlem başarısız', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ambarı silmek istediğinizden emin misiniz?')) return;
    try {
      await axios.delete(`/warehouses/${id}`);
      setSnackbar({ open: true, message: 'Ambar silindi', severity: 'success' });
      fetchWarehouses();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Silme işlemi başarısız', severity: 'error' });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await axios.put(`/warehouses/${id}`, { isDefault: true });
      setSnackbar({ open: true, message: 'Varsayılan ambar güncellendi', severity: 'success' });
      fetchWarehouses();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'İşlem başarısız', severity: 'error' });
    }
  };

  return (
    <StandardPage
      title="Firma ve Ambar Ayarları"
      breadcrumbs={[{ label: 'Ayarlar', href: '/settings' }, { label: 'Firma Ayarları' }]}
      headerActions={
        tabValue === 1 && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
          >
            Yeni Ambar
          </Button>
        )
      }
    >
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
            '& .MuiTab-root': { fontWeight: 800, fontSize: '0.9rem', color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } }
          }}
        >
          <Tab label="Genel Bilgiler" />
          <Tab label="Ambar (Depo) Yönetimi" />
        </Tabs>
        <Divider />
      </Box>

      {tabValue === 0 && (
        <Box sx={{ maxWidth: 1000 }}>
          <Alert
            severity="info"
            variant="outlined"
            icon={<InfoIcon />}
            sx={{ mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'info.light', bgcolor: alpha(theme.palette.info.main, 0.02) }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Resmi Entegrasyon Bilgileri</Typography>
            <Typography variant="caption">Bu bölümdeki veriler e-Fatura, e-Arşiv ve e-İrsaliye belgelerinde resmi gönderici bilgisi olarak kullanılacaktır.</Typography>
          </Alert>

          <Grid container spacing={4}>
            {/* Logo Section */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 4, height: '100%', bgcolor: alpha(theme.palette.background.paper, 0.8) }}>
                <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.disabled', letterSpacing: 1.5, display: 'block', mb: 2 }}>FİRMA LOGOSU</Typography>
                <Avatar
                  src={companyInfo.logoUrl}
                  variant="rounded"
                  sx={{
                    width: 140,
                    height: 140,
                    mx: 'auto',
                    mb: 3,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: '2px dashed',
                    borderColor: 'divider',
                    color: 'primary.main'
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>Maksimum 75KB, Kare form faktörü önerilir.</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={companyLoading}
                  sx={{ fontWeight: 800, borderRadius: 2 }}
                >
                  Logo Yükle
                  <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                </Button>
              </Paper>
            </Grid>

            {/* Form Section */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper variant="outlined" sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3 }}>Firma Tipi ve Kimlik</Typography>

                <ToggleButtonGroup
                  value={companyInfo.companyType}
                  exclusive
                  onChange={(_, v) => v && setCompanyInfo({ ...companyInfo, companyType: v })}
                  sx={{ mb: 4, display: 'flex' }}
                >
                  <ToggleButton value="COMPANY" sx={{ flex: 1, fontWeight: 700, borderRadius: 2 }}>
                    <BusinessIcon sx={{ mr: 1, fontSize: 18 }} /> Kurumsal (A.Ş, Ltd.Şti)
                  </ToggleButton>
                  <ToggleButton value="INDIVIDUAL" sx={{ flex: 1, fontWeight: 700, borderRadius: 2 }}>
                    <PersonIcon sx={{ mr: 1, fontSize: 18 }} /> Şahıs Firması
                  </ToggleButton>
                </ToggleButtonGroup>

                <Grid container spacing={2}>
                  {companyInfo.companyType === 'COMPANY' ? (
                    <>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label="Resmi Firma Ünvanı"
                          fullWidth
                          value={companyInfo.companyName}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Vergi Numarası"
                          fullWidth
                          value={companyInfo.taxNumber}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, taxNumber: e.target.value })}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Vergi Dairesi"
                          fullWidth
                          value={companyInfo.taxOffice}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, taxOffice: e.target.value })}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid size={{ xs: 6 }}>
                        <TextField label="Ad" fullWidth value={companyInfo.firstName} onChange={(e) => setCompanyInfo({ ...companyInfo, firstName: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <TextField label="Soyad" fullWidth value={companyInfo.lastName} onChange={(e) => setCompanyInfo({ ...companyInfo, lastName: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField label="TC Kimlik No" fullWidth value={companyInfo.tcNo} onChange={(e) => setCompanyInfo({ ...companyInfo, tcNo: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                      </Grid>
                    </>
                  )}

                  <Grid size={{ xs: 12 }}><Divider sx={{ my: 2 }} /></Grid>

                  <Grid size={{ xs: 12 }}><Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>İletişim ve Adres</Typography></Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Telefon" fullWidth value={companyInfo.phone} onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="E-posta" fullWidth value={companyInfo.email} onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={provinces}
                      getOptionLabel={(o) => typeof o === 'string' ? o : o.name}
                      value={companyInfo.city}
                      onChange={async (_, v) => {
                        const name = typeof v === 'string' ? v : v?.name || '';
                        setCompanyInfo({ ...companyInfo, city: name, district: '', neighborhood: '' });
                        if (v && typeof v !== 'string') await loadDistricts(v.id);
                      }}
                      renderInput={(p) => <TextField {...p} label="Şehir" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Autocomplete
                      options={districts}
                      getOptionLabel={(o) => typeof o === 'string' ? o : o.name}
                      value={companyInfo.district}
                      onChange={async (_, v) => {
                        const name = typeof v === 'string' ? v : v?.name || '';
                        setCompanyInfo({ ...companyInfo, district: name, neighborhood: '' });
                        if (v && typeof v !== 'string') await loadNeighborhoods(companyInfo.city, v.name);
                      }}
                      renderInput={(p) => <TextField {...p} label="İlçe" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Açık Adres"
                      fullWidth
                      multiline
                      rows={3}
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveCompanyInfo}
                    disabled={companyLoading}
                    sx={{ fontWeight: 800, borderRadius: 2, px: 6, py: 1.5 }}
                  >
                    {companyLoading ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Grid container spacing={3}>
            {warehouses.map((w) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={w.id}>
                <Card variant="outlined" sx={{ borderRadius: 4, position: 'relative', overflow: 'visible', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', boxShadow: theme.shadows[4] } }}>
                  {w.isDefault && (
                    <Chip
                      icon={<StarIcon sx={{ fontSize: '14px !important' }} />}
                      label="Varsayılan Ambar"
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', top: -12, left: 16, fontWeight: 800, px: 1 }}
                    />
                  )}
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
                        <WarehouseIcon />
                      </Box>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => handleOpenDialog(w)}><EditIcon fontSize="small" /></IconButton>
                        {!w.isDefault && <IconButton size="small" color="error" onClick={() => handleDelete(w.id)}><DeleteIcon fontSize="small" /></IconButton>}
                      </Stack>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>{w.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 2 }}>Kod: {w.code}</Typography>

                    <Stack spacing={1} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>Adres:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem', noWrap: true }}>{w.address || 'Tanımsız'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>Tel:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>{w.phone || '-'}</Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip label={w.active ? 'Aktif Ambar' : 'Pasif'} size="small" variant="outlined" color={w.active ? 'success' : 'default'} sx={{ fontWeight: 800 }} />
                      {!w.isDefault && (
                        <Button size="small" variant="text" onClick={() => handleSetDefault(w.id)} sx={{ fontWeight: 800 }}>Varsayılan Yap</Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {warehouses.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 8, textAlign: 'center', bgcolor: alpha(theme.palette.action.disabledBackground, 0.1), borderRadius: 4, border: '2px dashed', borderColor: 'divider' }}>
                  <WarehouseIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Ambar Bulunamadı</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Sistemde henüz tanımlı bir ambar yok. Yeni bir tane ekleyerek başlayın.</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ fontWeight: 800, borderRadius: 2 }}>Yeni Ambar Ekle</Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Warehouse Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{editingWarehouse ? 'Ambar Düzenle' : 'Yeni Ambar Tanımla'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Ambar Kodu" fullWidth value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField label="Ambar Adı" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Box>
            <TextField label="Telefon" fullWidth value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField label="Açık Adres" fullWidth multiline rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />

            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3 }}>
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />}
                  label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Ambar Aktif</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} disabled={formData.isDefault && !!editingWarehouse && warehouses.find(w => w.id === editingWarehouse.id)?.isDefault} />}
                  label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Varsayılan Yap</Typography>}
                />
              </FormGroup>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ fontWeight: 700 }}>İptal</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ fontWeight: 800, borderRadius: 2, px: 4 }}>{editingWarehouse ? 'Güncelle' : 'Oluştur'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 700 }}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}
