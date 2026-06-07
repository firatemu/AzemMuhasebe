'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
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
  Card,
  CardContent,
  Autocomplete,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  FilterList,
  Refresh,
  AccountBalance,
  Info as InfoIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';

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
  bankaHesapId?: string;
  cariId: string;
  tutar: number;
  tarih: string;
  aciklama?: string;
  referansNo?: string;
  gonderen?: string;
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
  const theme = useTheme();
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
        }
      }}
    >
      <DialogTitle component="div" sx={{ p: 3, pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.success.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'success.main',
          }}>
            {editMode ? <Edit /> : <Add />}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {editMode ? 'Gelen Havale Düzenle' : 'Yeni Gelen Havale'}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="date"
              label="Tarih"
              value={localFormData.tarih}
              onChange={(e) => handleLocalChange('tarih', e.target.value)}
              InputLabelProps={{ shrink: true }}
              slotProps={{ input: { sx: { borderRadius: 2.5, fontWeight: 700 } } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              fullWidth
              options={bankaHesaplari}
              getOptionLabel={(option) => {
                const bankaAdi = option.bankaAdi || '';
                const hesapAdi = option.kasaAdi || '';
                const hesapInfo = option.hesapNo || option.iban || '';
                return `${bankaAdi} - ${hesapAdi}${hesapInfo ? ` (${hesapInfo})` : ''}`;
              }}
              value={bankaHesaplari.find(b => b.id === localFormData.bankaHesabiId) || null}
              onChange={(_, newValue) => handleLocalChange('bankaHesabiId', newValue?.id || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Banka Hesabı *"
                  placeholder="Banka hesabı ara..."
                  autoComplete="off"
                  slotProps={{ input: { sx: { borderRadius: 2.5, fontWeight: 700 } } }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                const hesapInfo = option.hesapNo || option.iban || '';
                return (
                  <li key={option.id} {...otherProps}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {option.bankaAdi} - {option.kasaAdi}
                      </Typography>
                      {hesapInfo && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {option.hesapNo ? `Hesap No: ${option.hesapNo}` : `IBAN: ${option.iban}`}
                        </Typography>
                      )}
                    </Box>
                  </li>
                );
              }}
              noOptionsText="Banka hesabı bulunamadı"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              fullWidth
              options={cariler}
              getOptionLabel={(option) => `${option.unvan} (${option.cariKodu})`}
              value={cariler.find(c => c.id === localFormData.cariId) || null}
              onChange={(_, newValue) => handleLocalChange('cariId', newValue?.id || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cari *"
                  placeholder="Cari ara..."
                  autoComplete="off"
                  slotProps={{ input: { sx: { borderRadius: 2.5, fontWeight: 700 } } }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <li key={option.id} {...otherProps}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {option.unvan}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {option.cariKodu}
                      </Typography>
                    </Box>
                  </li>
                );
              }}
              noOptionsText="Cari bulunamadı"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="number"
              label="Tutar"
              value={localFormData.tutar}
              onChange={(e) => handleLocalChange('tutar', e.target.value)}
              slotProps={{
                input: {
                  sx: { borderRadius: 2.5, fontWeight: 800, color: 'success.main' },
                  startAdornment: <Typography sx={{ mr: 1, fontWeight: 800, color: 'text.disabled' }}>₺</Typography>,
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <TextField
              fullWidth
              label="Referans No"
              value={localFormData.referansNo}
              onChange={(e) => handleLocalChange('referansNo', e.target.value)}
              placeholder="Havale referans numarası"
              slotProps={{ input: { sx: { borderRadius: 2.5, fontWeight: 600 } } }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Açıklama"
              value={localFormData.aciklama}
              onChange={(e) => handleLocalChange('aciklama', e.target.value)}
              placeholder="Havale açıklaması"
              slotProps={{ input: { sx: { borderRadius: 2.5, fontWeight: 500 } } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ fontWeight: 800 }}>Vazgeç</Button>
        <Button
          variant="contained"
          onClick={handleLocalSubmit}
          disabled={loading}
          sx={{
            bgcolor: 'success.main',
            color: 'white',
            textTransform: 'none',
            fontWeight: 900,
            borderRadius: 2.5,
            px: 4,
            '&:hover': {
              bgcolor: 'success.dark',
            },
          }}
        >
          {editMode ? 'Güncelle' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

HavaleDialog.displayName = 'HavaleDialog';

export default function GelenHavalePage() {
  const theme = useTheme();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [havaleler, setHavaleler] = useState<BankaHavale[]>([]);
  const [bankaHesaplari, setBankaHesaplari] = useState<BankaHesabi[]>([]);
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedHavale, setSelectedHavale] = useState<BankaHavale | null>(null);

  const [filterBankaId, setFilterBankaId] = useState('');
  const [filterCariId, setFilterCariId] = useState('');
  const [filterBaslangic, setFilterBaslangic] = useState('');
  const [filterBitis, setFilterBitis] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  const [initialFormData, setInitialFormData] = useState({
    hareketTipi: 'GELEN' as 'GELEN' | 'GIDEN',
    bankaHesabiId: '',
    cariId: '',
    tutar: '',
    tarih: new Date().toISOString().split('T')[0],
    aciklama: '',
    referansNo: '',
    gonderen: '',
    alici: '',
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
      const params: any = { hareketTipi: 'GELEN' };
      if (filterBankaId) params.bankaHesabiId = filterBankaId;
      if (filterCariId) params.cariId = filterCariId;
      if (filterBaslangic) params.baslangicTarihi = filterBaslangic;
      if (filterBitis) params.bitisTarihi = filterBitis;

      const response = await axios.get('/bank-transfer', { params });
      setHavaleler(response.data || []);
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
        if (banka.hesaplar && Array.isArray(banka.hesaplar)) {
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
      const params: any = { hareketTipi: 'GELEN' };
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
      const bankaHesabiId = bankaHesaplari.find(b => b.kasa?.id === havale.bankaHesabiId)?.id || havale.bankaHesapId || '';
      setInitialFormData({
        hareketTipi: 'GELEN',
        bankaHesabiId: bankaHesabiId,
        cariId: havale.cariId,
        tutar: String(havale.tutar),
        tarih: new Date(havale.tarih).toISOString().split('T')[0],
        aciklama: havale.aciklama || '',
        referansNo: havale.referansNo || '',
        gonderen: havale.gonderen || '',
        alici: havale.alici || '',
      });
    } else {
      setEditMode(false);
      setSelectedHavale(null);
      setInitialFormData({
        hareketTipi: 'GELEN',
        bankaHesabiId: '',
        cariId: '',
        tutar: '',
        tarih: new Date().toISOString().split('T')[0],
        aciklama: '',
        referansNo: '',
        gonderen: '',
        alici: '',
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
      const tutarNumber = typeof submitFormData.tutar === 'string' ? parseFloat(submitFormData.tutar) : submitFormData.tutar;
      if (!submitFormData.bankaHesabiId || !submitFormData.cariId || !tutarNumber || tutarNumber <= 0) {
        enqueueSnackbar('Lütfen tüm zorunlu alanları doldurun ve geçerli bir tutar girin', { variant: 'warning' });
        return;
      }

      const selectedBankaHesabi = bankaHesaplari.find(b => b.id === submitFormData.bankaHesabiId);
      if (!selectedBankaHesabi || !selectedBankaHesabi.id) {
        enqueueSnackbar('Banka hesabı bulunamadı', { variant: 'error' });
        return;
      }

      setLoading(true);
      const submitData: any = {
        hareketTipi: submitFormData.hareketTipi,
        cariId: submitFormData.cariId,
        tutar: tutarNumber,
        tarih: submitFormData.tarih,
        aciklama: submitFormData.aciklama || '',
        referansNo: submitFormData.referansNo || '',
        bankaHesapId: selectedBankaHesabi.id,
      };

      if (editMode && selectedHavale) {
        await axios.put(`/bank-transfer/${selectedHavale.id}`, submitData);
        enqueueSnackbar('Gelen havale kaydı güncellendi', { variant: 'success' });
      } else {
        await axios.post('/bank-transfer', submitData);
        enqueueSnackbar('Gelen havale kaydı oluşturuldu', { variant: 'success' });
      }

      handleCloseDialog();
      fetchHavaleler();
      fetchStats();
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [editMode, selectedHavale, bankaHesaplari, enqueueSnackbar]);

  const handleDelete = async () => {
    if (!selectedHavale) return;
    try {
      setLoading(true);
      const params = deleteReason ? { reason: deleteReason } : {};
      await axios.delete(`/bank-transfer/${selectedHavale.id}`, { params });
      enqueueSnackbar('Gelen havale kaydı silindi', { variant: 'success' });
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

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  }, []);

  const handleViewDetail = useCallback((havale: BankaHavale) => {
    router.push(`/bank-transfer/gelen/${havale.id}`);
  }, [router]);

  const columns: GridColDef[] = [
    {
      field: 'bankaHesabi',
      headerName: 'Banka Hesabı',
      flex: 1.5,
      renderCell: (p: GridRenderCellParams) => (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ height: '100%' }}>
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          }}>
            {p.row.bankaHesap?.banka?.logo ? (
              <img src={p.row.bankaHesap.banka.logo} alt="banka" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <AccountBalance sx={{ fontSize: 18, color: 'primary.main' }} />
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
        <Typography variant="body2" sx={{ fontWeight: 900, color: 'success.main', height: '100%', display: 'flex', alignItems: 'center' }}>
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
      title="Gelen Havale İşlemleri"
      breadcrumbs={[{ label: 'Banka Transfer', href: '/bank-transfer' }, { label: 'Gelen Havale' }]}
      headerActions={
        <Stack direction="row" spacing={1.5}>
          <Button startIcon={<Refresh />} onClick={() => { fetchHavaleler(); fetchStats(); }} sx={{ fontWeight: 800 }}>Yenile</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ fontWeight: 900, borderRadius: 3, px: 3, bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}>Yeni Gelen Havale</Button>
        </Stack>
      }
    >
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Toplam Kayıt', value: stats?.toplamKayit || 0, color: 'primary.main', icon: <InfoIcon /> },
          { label: 'Gelen Havale Adeti', value: stats?.gelenHavale.adet || 0, color: 'success.main', icon: <TrendingUp /> },
          { label: 'Toplam Tutar', value: formatCurrency(stats?.gelenHavale.toplam || 0), color: 'success.main', icon: <AccountBalance /> },
        ].map((s, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: alpha(s.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                    {s.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>{s.value}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FilterList sx={{ color: 'text.secondary' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Hızlı Filtreleme</Typography>
          <Grid container spacing={2} sx={{ flex: 1 }}>
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
              <TextField fullWidth size="small" type="date" label="Başlangıç" value={filterBaslangic} onChange={(e) => setFilterBaslangic(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth size="small" type="date" label="Bitiş" value={filterBitis} onChange={(e) => setFilterBitis(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <DataGrid
          rows={havaleler}
          columns={columns}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: '1px solid', borderColor: 'divider' },
            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 900, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' },
            '& .MuiDataGrid-cell': { borderColor: 'divider' },
          }}
          slots={{
            loadingOverlay: () => (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CircularProgress size={24} />
              </Box>
            ),
          }}
        />
      </Paper>

      {/* Diyaloglar */}
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

      {/* Silme Onay Diyaloğu */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Kaydı Sil</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>Bu havale kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</Typography>
          <TextField fullWidth label="Silme Nedeni (Opsiyonel)" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenDelete(false)}>Vazgeç</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={loading} sx={{ borderRadius: 2, fontWeight: 800 }}>Sil</Button>
        </DialogActions>
      </Dialog>
    </StandardPage>
  );
}

