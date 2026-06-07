'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Paper,
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
  InputAdornment,
  Alert,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Person,
  ContactPhone,
  Work,
  AccountBalance,
  CheckCircle,
  LockOpen,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/stores/authStore';
import PersonelFormDialog from './components/PersonelFormDialog';

interface Personel {
  id: string;
  personelKodu: string;
  tcKimlikNo: string;
  ad: string;
  soyad: string;
  dogumTarihi: string | null;
  cinsiyet: 'ERKEK' | 'KADIN' | 'BELIRTILMEMIS' | null;
  medeniDurum: 'BEKAR' | 'EVLI' | null;
  telefon: string;
  email: string | null;
  adres: string | null;
  il: string | null;
  ilce: string | null;
  pozisyon: string;
  departman: string | null;
  iseBaslamaTarihi: string;
  istenCikisTarihi: string | null;
  aktif: boolean;
  maas: number;
  prim: number | null;
  maasGunu: number | null;
  sgkNo: string | null;
  ibanNo: string | null;
  bakiye: number;
  aciklama: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { odemeler: number };
}

interface Stats {
  toplamPersonel: number;
  toplamMaasBordro: number;
  toplamBakiye: number;
  departmanlar: Array<{
    departman: string;
    personelSayisi: number;
    toplamMaas: number;
  }>;
}

export default function PersonelPage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { permissions } = useAuthStore();
  const hasAllPermission = permissions.includes('ALL');

  const [personeller, setPersoneller] = useState<Personel[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPersonel, setSelectedPersonel] = useState<Personel | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Personel | null>(null);
  const [departmanlar, setDepartmanlar] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAktif, setFilterAktif] = useState<string>('');
  const [filterDepartman, setFilterDepartman] = useState<string>('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });

  useEffect(() => {
    fetchData();
  }, [filterAktif, filterDepartman]);

  const fetchPersoneller = async () => {
    try {
      const params: Record<string, any> = {};
      if (filterAktif !== '') params.isActive = filterAktif;
      if (filterDepartman) params.department = filterDepartman;

      const response = await axios.get('/employees', { params });
      const data = response.data?.data || (Array.isArray(response.data) ? response.data : []);
      setPersoneller(data);
    } catch (error) {
      console.error('Personeller yüklenirken hata:', error);
      enqueueSnackbar('Personeller yüklenemedi', { variant: 'error' });
    }
  };

  const fetchStats = async () => {
    try {
      const params: Record<string, any> = {};
      if (filterAktif !== '') params.isActive = filterAktif;
      if (filterDepartman) params.department = filterDepartman;

      const response = await axios.get('/employees/stats', { params });
      const data = response.data;
      setStats({
        toplamPersonel: data.toplamEmployee ?? data.toplamPersonel ?? 0,
        toplamMaasBordro: data.toplamMaasBordro ?? 0,
        toplamBakiye: data.toplamBakiye ?? 0,
        departmanlar: (data.departmentlar ?? data.departmanlar ?? []).map(
          (d: { department?: string; departman?: string; employeeSayisi?: number; personelSayisi?: number; toplamMaas?: number }) => ({
            departman: d.department ?? d.departman ?? '',
            personelSayisi: d.employeeSayisi ?? d.personelSayisi ?? 0,
            toplamMaas: d.toplamMaas ?? 0,
          }),
        ),
      });
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const fetchDepartmanlar = async () => {
    try {
      const response = await axios.get('/employees/departmentlar');
      const data = response.data || [];
      setDepartmanlar(
        Array.isArray(data)
          ? data.map((d) => (typeof d === 'string' ? d : d?.department)).filter(Boolean)
          : [],
      );
    } catch (error) {
      console.error('Departmanlar yüklenirken hata:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPersoneller(), fetchStats(), fetchDepartmanlar()]);
    setLoading(false);
  };

  const handleOpenDialog = async (personel?: Personel) => {
    if (!personel) {
      let nextCode = '';
      try {
        const response = await axios.get('/code-templates/preview-code/PERSONNEL');
        nextCode = response.data.nextCode || '';
      } catch (error) {
        console.log('Otomatik kod alınamadı, boş bırakılacak');
      }
      setSelectedPersonel({ personelKodu: nextCode || '' } as any);
    } else {
      setSelectedPersonel(personel);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPersonel(null);
  };

  const handleSave = async (formData: any) => {
    try {
      if (selectedPersonel?.id) {
        await axios.put(`/employees/${selectedPersonel.id}`, formData);
        enqueueSnackbar('Personel başarıyla güncellendi', { variant: 'success' });
      } else {
        await axios.post('/employees', formData);
        enqueueSnackbar('Personel başarıyla eklendi', { variant: 'success' });
      }
      handleCloseDialog();
      fetchData();
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Kayıt sırasında bir hata oluştu',
        { variant: 'error' }
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await axios.delete(`/employees/${deleteTarget.id}`);
      enqueueSnackbar('Personel kaydı silindi', { variant: 'success' });
      setOpenDeleteDialog(false);
      setDeleteTarget(null);
      fetchData();
    } catch (error: any) {
      console.error('Silme hatası:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Silme sırasında bir hata oluştu',
        { variant: 'error' }
      );
    }
  };

  const filteredPersoneller = useMemo(() => {
    if (!searchTerm) return personeller;
    const search = searchTerm.toLowerCase();
    return personeller.filter((p: Personel) => {
      return (
        p.ad.toLowerCase().includes(search) ||
        p.soyad.toLowerCase().includes(search) ||
        p.personelKodu.toLowerCase().includes(search) ||
        p.tcKimlikNo.includes(searchTerm) ||
        (p.pozisyon && p.pozisyon.toLowerCase().includes(search)) ||
        (p.departman && p.departman.toLowerCase().includes(search))
      );
    });
  }, [personeller, searchTerm]);

  const columns: GridColDef[] = [
    {
      field: 'personelKodu',
      headerName: 'Kod',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'ad',
      headerName: 'Ad Soyad',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {params.row.ad} {params.row.soyad}
          </Typography>
          {params.row.pozisyon && (
            <Typography variant="caption" color="text.secondary">
              {params.row.pozisyon}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'tcKimlikNo',
      headerName: 'TC Kimlik',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{params.value || '-'}</Typography>
      ),
    },
    {
      field: 'departman',
      headerName: 'Departman',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value || 'Belirtilmemiş'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, borderRadius: 1 }}
        />
      ),
    },
    {
      field: 'telefon',
      headerName: 'Telefon',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{params.value || '-'}</Typography>
      ),
    },
    {
      field: 'maas',
      headerName: 'Maaş',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          ₺{Number(params.value).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </Typography>
      ),
    },
    {
      field: 'bakiye',
      headerName: 'Bakiye',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={`₺${Number(params.value).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          size="small"
          color={Number(params.value) >= 0 ? 'success' : 'error'}
          variant="outlined"
          sx={{ fontWeight: 700, borderRadius: 1 }}
        />
      ),
    },
    {
      field: 'aktif',
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
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          <Tooltip title="Görüntüle">
            <IconButton
              size="small"
              onClick={() => {
                const personel = params.row as Personel;
                enqueueSnackbar(`${personel.ad} ${personel.soyad} - ${personel.pozisyon || 'Pozisyon belirtilmemiş'}`, { variant: 'info' });
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Düzenle">
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(params.row as Personel)}
              sx={{ color: 'warning.main' }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton
              size="small"
              sx={{ color: 'error.main' }}
              onClick={() => {
                setDeleteTarget(params.row as Personel);
                setOpenDeleteDialog(true);
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
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
      title="Personel Yönetimi"
      subtitle="Şirket çalışanlarınızın bilgilerini, maaşlarını ve bakiyelerini takip edin"
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
            Yeni Personel Ekle
          </Button>
        </Box>

        {/* Stats Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StandardCard variant="neutral">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                    <Person sx={{ color: 'primary.main', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 600 }}>
                    Toplam Personel
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {stats.toplamPersonel}
                </Typography>
              </StandardCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StandardCard variant="neutral">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                    <AccountBalance sx={{ color: 'secondary.main', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 600 }}>
                    Aylık Maaş Bordrosu
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                  ₺{Number(stats.toplamMaasBordro).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </Typography>
              </StandardCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StandardCard variant="neutral">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                    <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 600 }}>
                    Toplam Bakiye
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: Number(stats.toplamBakiye) >= 0 ? 'success.main' : 'error.main' }}>
                  ₺{Number(stats.toplamBakiye).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </Typography>
              </StandardCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StandardCard variant="neutral">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                    <Work sx={{ color: 'info.main', fontSize: 20 }} />
                  </Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 600 }}>
                    Departman Sayısı
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
                  {stats.departmanlar.length}
                </Typography>
              </StandardCard>
            </Grid>
          </Grid>
        )}

        {/* Filters */}
        <StandardCard sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Personel ara... (Ad, Soyad, Kod, TC, Pozisyon)"
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
                value={filterAktif}
                onChange={(e: any) => setFilterAktif(e.target.value)}
                label="Durum"
              >
                <MenuItem value="">Tümü</MenuItem>
                <MenuItem value="true">Aktif</MenuItem>
                <MenuItem value="false">Pasif</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Departman</InputLabel>
              <Select
                value={filterDepartman}
                onChange={(e: any) => setFilterDepartman(e.target.value)}
                label="Departman"
              >
                <MenuItem value="">Tümü</MenuItem>
                {departmanlar.map((dept: string) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </StandardCard>

        {/* DataGrid */}
        <StandardCard padding={0}>
          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={filteredPersoneller}
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

      {/* Add/Edit Dialog */}
      <PersonelFormDialog
        open={openDialog}
        personel={selectedPersonel}
        departmanlar={departmanlar}
        onSave={handleSave}
        onClose={handleCloseDialog}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Delete color="error" />
            <Typography variant="h6" fontWeight={800} color="error.main">Personel Silinecek</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {deleteTarget && `${deleteTarget.ad} ${deleteTarget.soyad}`} adlı personeli silmek istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Bu işlem personelin tüm kayıtlarını sistemden kalıcı olarak silecektir.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Bu işlem geri alınamaz!
          </Alert>
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