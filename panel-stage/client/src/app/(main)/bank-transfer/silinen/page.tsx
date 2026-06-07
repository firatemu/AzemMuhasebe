'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  TextField,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  alpha,
  useTheme,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  Visibility,
  DeleteForever,
  FilterList,
  Refresh,
  TrendingUp,
  TrendingDown,
  AccountBalance,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from '@/lib/axios';
import StandardPage from '@/components/common/StandardPage';

interface DeletedBankaHavale {
  id: string;
  originalId: string;
  hareketTipi: 'GELEN' | 'GIDEN';
  bankaHesabiId: string;
  bankaHesabiAdi: string;
  cariId: string;
  cariUnvan: string;
  tutar: number;
  tarih: string;
  aciklama?: string;
  referansNo?: string;
  gonderen?: string;
  alici?: string;
  originalCreatedAt: string;
  originalUpdatedAt: string;
  deletedAt: string;
  deleteReason?: string;
  deletedByUser?: {
    id: string;
    fullName: string;
    username: string;
  };
}

export default function SilinenHavalelerPage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [kayitlar, setKayitlar] = useState<DeletedBankaHavale[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedKayit, setSelectedKayit] = useState<DeletedBankaHavale | null>(null);

  // Filter state
  const [filterHareketTip, setFilterHareketTip] = useState('');
  const [filterBaslangic, setFilterBaslangic] = useState('');
  const [filterBitis, setFilterBitis] = useState('');

  useEffect(() => {
    fetchSilinenKayitlar();
  }, []);

  const fetchSilinenKayitlar = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/bank-havale/deleted');
      setKayitlar(response.data);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Kayıtlar yüklenirken hata oluştu', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (kayit: DeletedBankaHavale) => {
    setSelectedKayit(kayit);
    setOpenDetail(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredKayitlar = useMemo(() => {
    return kayitlar.filter(kayit => {
      if (filterHareketTip && kayit.hareketTipi !== filterHareketTip) return false;
      if (filterBaslangic && new Date(kayit.deletedAt) < new Date(filterBaslangic)) return false;
      if (filterBitis && new Date(kayit.deletedAt) > new Date(filterBitis)) return false;
      return true;
    });
  }, [kayitlar, filterHareketTip, filterBaslangic, filterBitis]);

  const stats = useMemo(() => {
    return {
      toplam: kayitlar.length,
      gelen: kayitlar.filter(k => k.hareketTipi === 'GELEN').length,
      giden: kayitlar.filter(k => k.hareketTipi === 'GIDEN').length,
      toplamTutar: kayitlar.reduce((sum, k) => sum + Number(k.tutar), 0)
    };
  }, [kayitlar]);

  const columns: GridColDef[] = [
    {
      field: 'hareketTipi',
      headerName: 'Tip',
      width: 100,
      renderCell: (p: GridRenderCellParams) => (
        <Chip
          icon={p.value === 'GELEN' ? <TrendingUp /> : <TrendingDown />}
          label={p.value === 'GELEN' ? 'Gelen' : 'Giden'}
          size="small"
          sx={{
            bgcolor: p.value === 'GELEN' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
            color: p.value === 'GELEN' ? 'success.main' : 'error.main',
            fontWeight: 700
          }}
        />
      )
    },
    {
      field: 'bankaHesabiAdi',
      headerName: 'Banka Hesabı',
      flex: 1.2,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, height: '100%', display: 'flex', alignItems: 'center' }}>
          {p.value}
        </Typography>
      )
    },
    {
      field: 'cariUnvan',
      headerName: 'Cari Hesap',
      flex: 1.5,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 600, height: '100%', display: 'flex', alignItems: 'center' }}>
          {p.value}
        </Typography>
      )
    },
    {
      field: 'tutar',
      headerName: 'Tutar',
      width: 140,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {formatCurrency(p.value)}
        </Typography>
      )
    },
    {
      field: 'deletedAt',
      headerName: 'Silinme Tarihi',
      width: 160,
      renderCell: (p: GridRenderCellParams) => (
        <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main' }}>
          {formatDate(p.value)}
        </Typography>
      )
    },
    {
      field: 'deletedByUser',
      headerName: 'Silen Kullanıcı',
      width: 150,
      renderCell: (p: GridRenderCellParams) => (
        p.value ? (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.value.fullName}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>@{p.value.username}</Typography>
          </Box>
        ) : <Typography variant="caption">—</Typography>
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      align: 'right',
      renderCell: (p: GridRenderCellParams) => (
        <Tooltip title="Detay">
          <IconButton size="small" onClick={() => handleViewDetail(p.row as DeletedBankaHavale)} sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  return (
    <StandardPage
      title="Silinen Havale Kayıtları"
      headerActions={
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchSilinenKayitlar}
          sx={{ fontWeight: 700, borderRadius: 2.5 }}
        >
          Yenile
        </Button>
      }
    >
      <Stack spacing={3}>
        <Grid container spacing={2}>
          {[
            { label: 'Toplam Silinen', value: stats.toplam, color: 'grey.600', icon: <DeleteForever /> },
            { label: 'Gelen Havale', value: stats.gelen, color: 'success.main', icon: <TrendingUp /> },
            { label: 'Giden Havale', value: stats.giden, color: 'error.main', icon: <TrendingDown /> },
            { label: 'Toplam Tutar', value: formatCurrency(stats.toplamTutar), color: 'warning.main', icon: <AccountBalance /> },
          ].map((stat, i) => (
            <Grid key={i} size={{ xs: 12, md: 3 }}>
              <Card sx={{ borderRadius: 4, bgcolor: alpha(stat.color === 'success.main' ? theme.palette.success.main : stat.color === 'error.main' ? theme.palette.error.main : theme.palette.primary.main, 0.02), border: '1px solid', borderColor: alpha(stat.color === 'success.main' ? theme.palette.success.main : stat.color === 'error.main' ? theme.palette.error.main : theme.palette.primary.main, 0.1) }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(stat.color === 'success.main' ? theme.palette.success.main : stat.color === 'error.main' ? theme.palette.error.main : theme.palette.primary.main, 0.1), color: stat.color }}>
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

        <Paper sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2.5 }}>
            <FilterList sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Filtreler</Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                size="small"
                options={['GELEN', 'GIDEN']}
                getOptionLabel={(o) => o === 'GELEN' ? 'Gelen Havale' : 'Giden Havale'}
                value={filterHareketTip || null}
                onChange={(_: any, v: string | null) => setFilterHareketTip(v || '')}
                renderInput={(p: any) => <TextField {...p} label="Hareket Tipi" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Silinme Başlangıç"
                value={filterBaslangic}
                onChange={(e: any) => setFilterBaslangic(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Silinme Bitiş"
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
            rows={filteredKayitlar}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': { bgcolor: alpha(theme.palette.primary.main, 0.03), borderBottom: '1px solid', borderColor: 'divider' },
              '& .MuiDataGrid-row:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) },
              '& .MuiDataGrid-cell': { borderColor: 'divider' },
            }}
          />
        </Box>
      </Stack>

      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.error.main, 0.05), borderBottom: '1px solid', borderColor: alpha(theme.palette.error.main, 0.1) }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <DeleteForever sx={{ color: 'error.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Silinen Havale Detayı</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedKayit && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>Temel Bilgiler</Typography>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <Box>
                    <Typography variant="caption" display="block">Hareket Tipi</Typography>
                    <Chip
                      icon={selectedKayit.hareketTipi === 'GELEN' ? <TrendingUp /> : <TrendingDown />}
                      label={selectedKayit.hareketTipi === 'GELEN' ? 'Gelen' : 'Giden'}
                      size="small"
                      sx={{
                        bgcolor: selectedKayit.hareketTipi === 'GELEN' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                        color: selectedKayit.hareketTipi === 'GELEN' ? 'success.main' : 'error.main',
                        fontWeight: 700
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block">Tutar</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>{formatCurrency(selectedKayit.tutar)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block">Banka Hesabı</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedKayit.bankaHesabiAdi}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" display="block">Cari</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedKayit.cariUnvan}</Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>Silme Bilgileri</Typography>
                <Card sx={{ mt: 1, bgcolor: alpha(theme.palette.error.main, 0.02), border: '1px dashed', borderColor: alpha(theme.palette.error.main, 0.2), borderRadius: 3 }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" display="block">Silinme Tarihi</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'error.main' }}>{formatDate(selectedKayit.deletedAt)}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" display="block">Silen Kullanıcı</Typography>
                        {selectedKayit.deletedByUser ? (
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedKayit.deletedByUser.fullName}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>@{selectedKayit.deletedByUser.username}</Typography>
                          </Box>
                        ) : <Typography variant="body1">—</Typography>}
                      </Box>
                      <Box>
                        <Typography variant="caption" display="block">Silme Nedeni</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedKayit.deleteReason || 'Belirtilmemiş'}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>Diğer Bilgiler</Typography>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" display="block">İşlem Tarihi</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatDate(selectedKayit.tarih)}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" display="block">Referans No</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedKayit.referansNo || '—'}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" display="block">Açıklama</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedKayit.aciklama || '—'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained" sx={{ fontWeight: 800, borderRadius: 2.5, px: 4 }}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </StandardPage>
  );
}
