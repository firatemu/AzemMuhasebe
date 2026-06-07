'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Stack,
  Grid,
  Card,
  CardContent,
  Autocomplete,
  alpha,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingDown,
  FilterList,
  Refresh,
  AccountBalance,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from '@/lib/axios';
import StandardPage from '@/components/common/StandardPage';


interface BankaHesabi {
  id: string;
  kasaKodu: string;
  kasaAdi: string;
  bankaAdi?: string;
  subeAdi?: string;
  hesapNo?: string;
  iban?: string;
  kasa?: {
    id: string;
    kasaKodu: string;
    kasaAdi: string;
  };
}

interface Cari {
  id: string;
  cariKodu: string;
  unvan: string;
  telefon?: string;
}

interface BankaHavale {
  id: string;
  hareketTipi: 'GELEN' | 'GIDEN';
  bankaHesabiId: string;
  cariId: string;
  tutar: number;
  tarih: string;
  aciklama?: string;
  referansNo?: string;
  alici?: string;
  createdAt: string;
  updatedAt: string;
  bankaHesabi: BankaHesabi;
  bankaHesap?: {
    id: string;
    hesapKodu: string;
    hesapAdi: string;
    banka: {
      ad: string;
      logo?: string;
    };
  };
  cari: Cari;
  createdByUser?: {
    id: string;
    fullName: string;
    username: string;
  };
  updatedByUser?: {
    id: string;
    fullName: string;
    username: string;
  };
}

interface Stats {
  toplamKayit: number;
  gelenHavale: {
    adet: number;
    toplam: number;
  };
  gidenHavale: {
    adet: number;
    toplam: number;
  };
  net: number;
}

// ✅ ÇÖZÜM: Dialog Component - Local State kullanıyor (FORM-PING-SORUNU-COZUMU.md)
const HavaleDialog = memo(({
  open,
  editMode,
  initialFormData,
  bankaHesaplari,
  cariler,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  editMode: boolean;
  initialFormData: any;
  bankaHesaplari: BankaHesabi[];
  cariler: Cari[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [localFormData, setLocalFormData] = useState(initialFormData);

  useEffect(() => {
    setLocalFormData(initialFormData);
  }, [initialFormData]);

  const handleLocalChange = (field: string, value: any) => {
    setLocalFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleLocalSubmit = () => {
    onSubmit(localFormData);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
        {editMode ? 'Giden Havale Düzenle' : 'Yeni Giden Havale'}
      </DialogTitle>
      <DialogContent sx={{ pt: '16px !important' }}>
        <Stack spacing={2.5}>
          <Box sx={{ p: 2, bgcolor: alpha('#f44336', 0.05), border: '1px dashed', borderColor: alpha('#f44336', 0.2), borderRadius: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="İşlem Tarihi"
                  value={localFormData.tarih}
                  onChange={(e) => handleLocalChange('tarih', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tutar"
                  value={localFormData.tutar}
                  onChange={(e) => handleLocalChange('tutar', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                />
              </Grid>
            </Grid>
          </Box>

          <Autocomplete
            options={bankaHesaplari}
            getOptionLabel={(o: BankaHesabi) => o.bankaAdi + ' - ' + o.kasaAdi}
            value={bankaHesaplari.find((b: BankaHesabi) => b.id === localFormData.bankaHesabiId) || null}
            onChange={(_: any, v: BankaHesabi | null) => handleLocalChange('bankaHesabiId', v?.id || '')}
            renderInput={(p: any) => <TextField {...p} label="Banka Hesabı" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />}
          />

          <Autocomplete
            options={cariler}
            getOptionLabel={(o: Cari) => o.unvan}
            value={cariler.find((c: Cari) => c.id === localFormData.cariId) || null}
            onChange={(_: any, v: Cari | null) => handleLocalChange('cariId', v?.id || '')}
            renderInput={(p: any) => <TextField {...p} label="Cari Hesap" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />}
          />

          <TextField
            fullWidth
            label="Referans No"
            value={localFormData.referansNo}
            onChange={(e) => handleLocalChange('referansNo', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Açıklama"
            value={localFormData.aciklama}
            onChange={(e) => handleLocalChange('aciklama', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700 }}>İptal</Button>
        <Button
          variant="contained"
          onClick={handleLocalSubmit}
          disabled={loading}
          sx={{ fontWeight: 900, borderRadius: 2.5, px: 4, bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
        >
          {editMode ? 'Güncelle' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

HavaleDialog.displayName = 'HavaleDialog';

export default function GidenHavalePage() {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [havaleler, setHavaleler] = useState<BankaHavale[]>([]);
  const [bankaHesaplari, setBankaHesaplari] = useState<BankaHesabi[]>([]);
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedHavale, setSelectedHavale] = useState<BankaHavale | null>(null);
  const [deleteReason, setDeleteReason] = useState('');

  const [filterBankaId, setFilterBankaId] = useState('');
  const [filterCariId, setFilterCariId] = useState('');
  const [filterBaslangic, setFilterBaslangic] = useState('');
  const [filterBitis, setFilterBitis] = useState('');

  const [initialFormData, setInitialFormData] = useState({
    hareketTipi: 'GIDEN' as 'GIDEN',
    bankaHesabiId: '',
    cariId: '',
    tutar: '',
    tarih: new Date().toISOString().split('T')[0],
    aciklama: '',
    referansNo: '',
  });

  useEffect(() => {
    fetchHavaleler();
    fetchBankaHesaplari();
    fetchCariler();
    fetchStats();
  }, [filterBankaId, filterCariId, filterBaslangic, filterBitis]);

  const fetchHavaleler = async () => {
    try {
      setLoading(true);
      const params: any = { hareketTipi: 'GIDEN' };
      if (filterBankaId) params.bankaHesabiId = filterBankaId;
      if (filterCariId) params.cariId = filterCariId;
      if (filterBaslangic) params.baslangicTarihi = filterBaslangic;
      if (filterBitis) params.bitisTarihi = filterBitis;
      const response = await axios.get('/bank-transfer', { params });
      setHavaleler(response.data);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Kayıtlar yüklenirken hata oluştu', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBankaHesaplari = async () => {
    try {
      const response = await axios.get('/banks');
      const bankalar = response.data || [];
      const vadesizHesaplar: BankaHesabi[] = [];
      bankalar.forEach((banka: any) => {
        if (banka.hesaplar) {
          banka.hesaplar.forEach((hesap: any) => {
            if (hesap.hesapTipi === 'VADESIZ') {
              vadesizHesaplar.push({
                id: hesap.id,
                kasaKodu: 'BANKA',
                kasaAdi: hesap.hesapAdi || banka.ad,
                bankaAdi: banka.ad,
                subeAdi: banka.sube,
                hesapNo: hesap.hesapNo,
                iban: hesap.iban,
                kasa: { id: hesap.id, kasaKodu: 'BANKA', kasaAdi: hesap.hesapAdi || banka.ad }
              });
            }
          });
        }
      });
      setBankaHesaplari(vadesizHesaplar);
    } catch (error) {
      enqueueSnackbar('Banka hesapları yüklenirken hata oluştu', { variant: 'error' });
    }
  };

  const fetchCariler = async () => {
    try {
      const response = await axios.get('/account', { params: { limit: 1000 } });
      setCariler(response.data.data || []);
    } catch (error) {
      console.error('Cariler yüklenirken hata:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const params: any = { hareketTipi: 'GIDEN' };
      if (filterBankaId) params.bankaHesabiId = filterBankaId;
      if (filterBaslangic) params.baslangicTarihi = filterBaslangic;
      if (filterBitis) params.bitisTarihi = filterBitis;
      const response = await axios.get('/bank-havale/stats', { params });
      setStats(response.data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const handleOpenDialog = useCallback((havale?: BankaHavale) => {
    if (havale) {
      setEditMode(true);
      setSelectedHavale(havale);
      setInitialFormData({
        hareketTipi: 'GIDEN',
        bankaHesabiId: bankaHesaplari.find(b => b.id === havale.bankaHesabiId || b.kasa?.id === havale.bankaHesabiId)?.id || '',
        cariId: havale.cariId,
        tutar: String(havale.tutar),
        tarih: new Date(havale.tarih).toISOString().split('T')[0],
        aciklama: havale.aciklama || '',
        referansNo: havale.referansNo || '',
      });
    } else {
      setEditMode(false);
      setSelectedHavale(null);
      setInitialFormData({
        hareketTipi: 'GIDEN',
        bankaHesabiId: '',
        cariId: '',
        tutar: '',
        tarih: new Date().toISOString().split('T')[0],
        aciklama: '',
        referansNo: '',
      });
    }
    setOpenDialog(true);
  }, [bankaHesaplari]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedHavale(null);
  }, []);

  const handleSubmit = useCallback(async (submitFormData: any) => {
    try {
      const tutarNumber = parseFloat(submitFormData.tutar);
      if (!submitFormData.bankaHesabiId || !submitFormData.cariId || !tutarNumber || tutarNumber <= 0) {
        enqueueSnackbar('Lütfen tüm zorunlu alanları doldurun ve geçerli bir tutar girin', { variant: 'error' });
        return;
      }
      setLoading(true);
      const submitData = { ...submitFormData, tutar: tutarNumber, bankaHesapId: submitFormData.bankaHesabiId };
      if (editMode && selectedHavale) {
        await axios.put(`/bank-transfer/${selectedHavale.id}`, submitData);
        enqueueSnackbar('Giden havale kaydı güncellendi', { variant: 'success' });
      } else {
        await axios.post('/bank-transfer', submitData);
        enqueueSnackbar('Giden havale kaydı oluşturuldu', { variant: 'success' });
      }
      handleCloseDialog();
      fetchHavaleler();
      fetchStats();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [editMode, selectedHavale, enqueueSnackbar, fetchHavaleler, fetchStats, handleCloseDialog]);

  const handleDelete = async () => {
    if (!selectedHavale) return;
    try {
      setLoading(true);
      await axios.delete(`/bank-transfer/${selectedHavale.id}`, { params: { reason: deleteReason } });
      enqueueSnackbar('Giden havale kaydı silindi', { variant: 'success' });
      setOpenDelete(false);
      setSelectedHavale(null);
      setDeleteReason('');
      fetchHavaleler();
      fetchStats();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Silme işlemi sırasında hata oluştu', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = useCallback((havale: BankaHavale) => {
    router.push(`/bank-transfer/giden/${havale.id}`);
  }, [router]);

  const formatCurrency = (v: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(v);
  const formatDate = (v: string) => new Date(v).toLocaleDateString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  const columns: GridColDef[] = [
    {
      field: 'bankaHesabi',
      headerName: 'Banka Hesabı',
      flex: 1.5,
      renderCell: (p: GridRenderCellParams) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ height: '100%' }}>
          <Box sx={{ width: 32, height: 32, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', bgcolor: alpha(theme.palette.error.main, 0.1) }}>
            {p.row.bankaHesap?.banka?.logo ? (
              <img src={p.row.bankaHesap.banka.logo} alt="banka" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <AccountBalance sx={{ fontSize: 18, color: 'error.main' }} />
            )}
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.row.bankaHesap?.hesapAdi || p.row.bankaHesabi?.kasaAdi}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{p.row.bankaHesap?.banka?.ad || p.row.bankaHesabi?.bankaAdi}</Typography>
          </Box>
        </Stack>
      )
    },
    {
      field: 'cari',
      headerName: 'Cari Hesap',
      flex: 1.5,
      renderCell: (p: GridRenderCellParams) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.value?.unvan}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{p.value?.cariKodu}</Typography>
        </Box>
      )
    },
    {
      field: 'tutar',
      headerName: 'Tutar',
      width: 150,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 900, color: 'error.main', height: '100%', display: 'flex', alignItems: 'center' }}>
          {formatCurrency(p.value)}
        </Typography>
      )
    },
    {
      field: 'tarih',
      headerName: 'İşlem Tarihi',
      width: 160,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', height: '100%', display: 'flex', alignItems: 'center' }}>
          {formatDate(p.value)}
        </Typography>
      )
    },
    {
      field: 'referansNo',
      headerName: 'Referans',
      width: 130,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="caption" sx={{ fontWeight: 700, px: 1, py: 0.5, bgcolor: alpha(theme.palette.action.active, 0.05), borderRadius: 1 }}>
          {p.value || '—'}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 150,
      sortable: false,
      align: 'right',
      renderCell: (p: GridRenderCellParams) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ height: '100%', alignItems: 'center' }}>
          <Tooltip title="Detay">
            <IconButton size="small" onClick={() => handleViewDetail(p.row)} sx={{ color: 'info.main', bgcolor: alpha(theme.palette.info.main, 0.05) }}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Düzenle">
            <IconButton size="small" onClick={() => handleOpenDialog(p.row)} sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton size="small" onClick={() => { setSelectedHavale(p.row); setOpenDelete(true); }} sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.05) }}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <StandardPage
      title="Giden Havale İşlemleri"
      headerActions={
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchHavaleler}
            sx={{ fontWeight: 700, borderRadius: 2.5 }}
          >
            Yenile
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' }, fontWeight: 900, borderRadius: 2.5, px: 3 }}
          >
            Yeni Giden Havale
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        {stats && (
          <Grid container spacing={2}>
            {[
              { label: 'Toplam Kayıt', value: stats.toplamKayit, color: 'error.main', icon: <InfoIcon /> },
              { label: 'Giden Havale Sayısı', value: stats.gidenHavale.adet, color: 'error.main', icon: <TrendingDown /> },
              { label: 'Toplam Giden', value: formatCurrency(stats.gidenHavale.toplam), color: 'error.main', icon: <AccountBalance /> },
            ].map((stat, i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Card sx={{ borderRadius: 4, bgcolor: alpha(theme.palette.error.main, 0.02), border: '1px solid', borderColor: alpha(theme.palette.error.main, 0.1) }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }}>
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
            <FilterList sx={{ color: 'error.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Filtreler</Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Autocomplete
                size="small"
                options={bankaHesaplari}
                getOptionLabel={(o: BankaHesabi) => o.bankaAdi + ' - ' + o.kasaAdi}
                value={bankaHesaplari.find((b: BankaHesabi) => b.id === filterBankaId) || null}
                onChange={(_: any, v: BankaHesabi | null) => setFilterBankaId(v?.id || '')}
                renderInput={(p: any) => <TextField {...p} label="Banka Hesabı" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Autocomplete
                size="small"
                options={cariler}
                getOptionLabel={(o: Cari) => o.unvan}
                value={cariler.find((c: Cari) => c.id === filterCariId) || null}
                onChange={(_: any, v: Cari | null) => setFilterCariId(v?.id || '')}
                renderInput={(p: any) => <TextField {...p} label="Cari Hesap" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Başlangıç"
                value={filterBaslangic}
                onChange={(e: any) => setFilterBaslangic(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Bitiş"
                value={filterBitis}
                onChange={(e: any) => setFilterBitis(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ height: 600, width: '100%', bgcolor: 'background.paper', borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
          <DataGrid
            rows={havaleler}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { bgcolor: alpha(theme.palette.error.main, 0.03), borderBottom: '1px solid', borderColor: 'divider' },
              '& .MuiDataGrid-row:hover': { bgcolor: alpha(theme.palette.error.main, 0.01) },
              '& .MuiDataGrid-cell': { borderColor: 'divider' },
            }}
          />
        </Box>
      </Stack>

      <HavaleDialog
        open={openDialog}
        editMode={editMode}
        initialFormData={initialFormData}
        bankaHesaplari={bankaHesaplari}
        cariler={cariler}
        loading={loading}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Silme Onayı</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontWeight: 500 }}>
            Bu giden havale kaydını silmek istediğinizden emin misiniz?
            <br />
            <Box component="span" sx={{ color: 'error.main', fontWeight: 700 }}>{selectedHavale?.cari.unvan}</Box> - {selectedHavale && formatCurrency(selectedHavale.tutar)}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Silme Nedeni"
            value={deleteReason}
            onChange={(e: any) => setDeleteReason(e.target.value)}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenDelete(false)} sx={{ fontWeight: 700 }}>Vazgeç</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
            sx={{ fontWeight: 900, borderRadius: 2.5, px: 4 }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </StandardPage>
  );
}
