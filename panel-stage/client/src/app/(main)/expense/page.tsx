'use client';

import MainLayout from '@/components/Layout/MainLayout';
import axios from '@/lib/axios';
import {
  Add,
  CurrencyLira,
  Category,
  Delete,
  Edit,
  FilterList,
  Refresh,
  Visibility,
  Search,
  CalendarToday,
  TableRows,
  TrendingDown,
  TrendingUp,
  History,
  Download,
  MoreVert,
  Close,
  FileDownload,
  TableChart,
  PictureAsPdf
} from '@mui/icons-material';
import {
  useTheme,
  useMediaQuery,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Stack,
  InputAdornment,
  Divider,
  Popover,
  Menu,
  Grid,
  Paper,
  ListItemIcon,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import KPIStoreCard from '@/components/KPIStoreCard';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import ExpensePrintForm from '@/components/PrintForm/ExpensePrintForm';
import { DataGrid, GridColDef, GridFooterContainer, GridPagination, GridRenderCellParams } from '@mui/x-data-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

interface MasrafKategori {
  id: string;
  name: string;
  notes?: string;
  _count?: {
    expenses: number;
  };
}

interface Masraf {
  id: string;
  categoryId: string;
  referenceNo?: string;
  notes?: string;
  amount: number;
  date: string;
  paymentType?: string;
  createdAt: string;
  updatedAt: string;
  category: MasrafKategori;
}

interface Stats {
  toplamExpense: number;
  toplamAdet: number;
  categoryler: Array<{
    categoryId: string;
    name: string;
    adet: number;
    toplam: number;
  }>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(value);

const formatDate = (dateString: string | Date | undefined | null) => {
  if (!dateString) return '-';
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    return '-';
  }
};

const ODEME_TIPI_LABELS: Record<string, string> = {
  CASH: 'Nakit',
  CREDIT_CARD: 'Kredi Kartı',
  BANK_TRANSFER: 'Havale/EFT',
};

const ODEME_TIPI_COLORS: Record<string, string> = {
  CASH: '#10b981',
  CREDIT_CARD: '#3b82f6',
  BANK_TRANSFER: '#0891b2',
};

const getOdemeTipiLabel = (tip: string | undefined | null) => tip ? (ODEME_TIPI_LABELS[tip] || tip) : '-';
const getOdemeTipiColor = (tip: string | undefined | null) => tip ? (ODEME_TIPI_COLORS[tip] || '#6b7280') : '#6b7280';

const DataGridNoRowsOverlay = () => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--muted-foreground)',
    }}
  >
    Kayıt bulunamadı
  </Box>
);

const AuditPopover = ({ anchorEl, onClose, data }: any) => (
  <Popover
    open={Boolean(anchorEl)}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    PaperProps={{
      sx: {
        p: 2,
        width: 280,
        bgcolor: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius)',
      },
    }}
  >
    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 1 }}>
      <History sx={{ fontSize: 18, color: 'var(--primary)' }} />
      Kayıt Geçmişi
    </Typography>
    <Stack spacing={1.5}>
      <Box>
        <Typography variant="caption" display="block" sx={{ color: 'var(--muted-foreground)', mb: 0.5 }}>Oluşturulma</Typography>
        <Typography variant="body2" sx={{ color: 'var(--foreground)', fontWeight: 500 }}>
          {formatDate(data?.createdAt)}
        </Typography>
      </Box>
      <Divider />
      <Box>
        <Typography variant="caption" display="block" sx={{ color: 'var(--muted-foreground)', mb: 0.5 }}>Son Güncelleme</Typography>
        <Typography variant="body2" sx={{ color: 'var(--foreground)', fontWeight: 500 }}>
          {formatDate(data?.updatedAt)}
        </Typography>
      </Box>
    </Stack>
  </Popover>
);

// Form Dialog
const MasrafFormDialog = memo(({
  open,
  editMode,
  formData,
  kategoriler,
  loading,
  onClose,
  onSubmit,
  onFormChange,
  isMobile
}: any) => {
  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: 'var(--card)',
          backgroundImage: 'none',
          borderRadius: isMobile ? 0 : 'var(--radius)',
          border: isMobile ? 'none' : '1px solid var(--border)',
          boxShadow: 'var(--shadow-2xl)',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(to right, var(--card), color-mix(in srgb, var(--primary) 3%, transparent))',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'color-mix(in srgb, var(--destructive) 10%, transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--destructive)',
          }}>
            <CurrencyLira sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.2 }}>
              {editMode ? 'Masraf Düzenle' : 'Yeni Masraf Kaydı'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>
              Harcama detaylarını buraya girin
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: 'var(--muted-foreground)',
            transition: 'all 0.2s',
            '&:hover': {
              color: 'var(--destructive)',
              bgcolor: 'color-mix(in srgb, var(--destructive) 8%, transparent)',
              transform: 'rotate(90deg)',
            },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: 'var(--card)' }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth required className="form-control-select">
              <InputLabel>Masraf Kategorisi</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={(e) => onFormChange('categoryId', e.target.value)}
                label="Masraf Kategorisi"
                sx={{ borderRadius: 'var(--radius-md)' }}
              >
                {kategoriler.map((kat: MasrafKategori) => (
                  <MenuItem key={kat.id} value={kat.id}>
                    {kat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              className="form-control-textfield"
              label="Fiş/Fatura No"
              value={formData.referenceNo}
              onChange={(e) => onFormChange('referenceNo', e.target.value)}
              placeholder="Örn: ABC20240001"
              InputProps={{
                startAdornment: <InputAdornment position="start"><History sx={{ fontSize: 18 }} /></InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="number"
              className="form-control-textfield"
              label="Tutar"
              value={formData.amount}
              onChange={(e) => onFormChange('amount', e.target.value)}
              inputProps={{ min: 0.01, step: 0.01 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">₺</InputAdornment>,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth className="form-control-select">
              <InputLabel>Ödeme Tipi</InputLabel>
              <Select
                value={formData.paymentType}
                onChange={(e) => onFormChange('paymentType', e.target.value)}
                label="Ödeme Tipi"
              >
                <MenuItem value="">
                  <em>Belirtilmedi</em>
                </MenuItem>
                <MenuItem value="CASH">Nakit</MenuItem>
                <MenuItem value="CREDIT_CARD">Kredi Kartı</MenuItem>
                <MenuItem value="BANK_TRANSFER">Havale/EFT</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="date"
              className="form-control-textfield"
              label="Harcama Tarihi"
              value={formData.date}
              onChange={(e) => onFormChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Açıklama"
              className="form-control-textfield"
              value={formData.notes}
              onChange={(e) => onFormChange('notes', e.target.value)}
              multiline
              rows={2}
              placeholder="Masraf hakkında kısa bilgi..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{
        px: 3,
        py: 2,
        bgcolor: 'color-mix(in srgb, var(--primary) 2%, var(--card))',
        borderTop: '1px solid var(--border)',
        gap: 1.5
      }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 'var(--radius)',
            textTransform: 'none',
            fontWeight: 600,
            color: 'var(--foreground)',
            borderColor: 'var(--border)',
            py: 1.2,
            '&:hover': {
              borderColor: 'var(--primary)',
              bgcolor: 'transparent',
            },
          }}
        >
          İptal
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={onSubmit}
          disabled={loading}
          sx={{
            borderRadius: 'var(--radius)',
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: 'var(--destructive)',
            color: 'var(--destructive-foreground)',
            py: 1.2,
            boxShadow: '0 4px 12px color-mix(in srgb, var(--destructive) 30%, transparent)',
            '&:hover': {
              bgcolor: 'color-mix(in srgb, var(--destructive) 90%, black)',
              boxShadow: '0 6px 16px color-mix(in srgb, var(--destructive) 40%, transparent)',
            },
            '&.Mui-disabled': {
              bgcolor: 'var(--muted)',
              color: 'var(--muted-foreground)',
            }
          }}
        >
          {loading ? 'İşleniyor...' : (editMode ? 'Güncellemeyi Kaydet' : 'Masrafı Kaydet')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

MasrafFormDialog.displayName = 'MasrafFormDialog';

export default function MasrafPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionLoading, setActionLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openKategoriDialog, setOpenKategoriDialog] = useState(false);
  const [openKategoriDelete, setOpenKategoriDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMasraf, setSelectedMasraf] = useState<Masraf | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<MasrafKategori | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const [auditAnchor, setAuditAnchor] = useState<{ el: HTMLElement | null, data: any }>({ el: null, data: null });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleQuickFilter = (type: string) => {
    const today = new Date();
    let start = '';
    let end = today.toISOString().split('T')[0];

    if (type === 'today') {
      start = end;
    } else if (type === 'week') {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      start = lastWeek.toISOString().split('T')[0];
    } else if (type === 'month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    }

    setFilterBaslangic(start);
    setFilterBitis(end);
  };


  const [filterKategori, setFilterKategori] = useState('');
  const [filterBaslangic, setFilterBaslangic] = useState('');
  const [filterBitis, setFilterBitis] = useState('');

  const [formData, setFormData] = useState({
    categoryId: '',
    referenceNo: '',
    notes: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentType: 'CASH',
  });

  const [kategoriFormData, setKategoriFormData] = useState({
    name: '',
    notes: '',
  });

  const [categorySearch, setCategorySearch] = useState('');

  const masrafQueryKey = useMemo(
    () => ['masraflar', filterKategori || null, filterBaslangic || null, filterBitis || null],
    [filterKategori, filterBaslangic, filterBitis],
  );

  const {
    data: masraflar = [],
    isLoading: masrafLoading,
    isFetching: masrafFetching,
    error: masrafError,
  } = useQuery<Masraf[]>({
    queryKey: masrafQueryKey,
    queryFn: async () => {
      const params: Record<string, string | number> = { limit: 100 };
      if (filterKategori) params.categoryId = filterKategori;
      if (filterBaslangic) params.startDate = filterBaslangic;
      if (filterBitis) params.endDate = filterBitis;

      const response = await axios.get('/expenses', { params });
      const data = response.data?.data ?? [];
      // Debug: Tarih alanını kontrol et
      if (data.length > 0) {
        console.log('Masraf verisi örneği:', data[0]);
        console.log('Tarih alanı:', data[0].date, 'Tip:', typeof data[0].date);
      }
      return data;
    },
  });

  useEffect(() => {
    if (masrafError) {
      const message =
        (masrafError as any)?.response?.data?.message || 'Kayıtlar yüklenirken hata oluştu';
      enqueueSnackbar(message, { variant: 'error' });
    }
  }, [masrafError, enqueueSnackbar]);

  const { data: kategoriler = [], isLoading: kategorilerLoading } = useQuery<MasrafKategori[]>({
    queryKey: ['masraf-kategoriler'],
    queryFn: async () => {
      const response = await axios.get('/expenses/categoryler');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: stats = null, isLoading: statsLoading } = useQuery<Stats | null>({
    queryKey: ['masraf-stats', filterKategori || null, filterBaslangic || null, filterBitis || null],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filterKategori) params.categoryId = filterKategori;
      if (filterBaslangic) params.startDate = filterBaslangic;
      if (filterBitis) params.endDate = filterBitis;

      const response = await axios.get('/expenses/stats', { params });
      return response.data ?? null;
    },
  });

  const isMasrafLoading = masrafLoading || masrafFetching || actionLoading;

  const handleViewDetail = useCallback((id: string) => {
    router.push(`/expense/${id}`);
  }, [router]);

  const handleOpenDialog = useCallback((masraf?: Masraf) => {
    if (masraf) {
      setEditMode(true);
      setSelectedMasraf(masraf);
      setFormData({
        categoryId: masraf.categoryId,
        referenceNo: masraf.referenceNo || '',
        notes: masraf.notes || '',
        amount: String(masraf.amount),
        date: new Date(masraf.date).toISOString().split('T')[0],
        paymentType: masraf.paymentType || 'CASH',
      });
    } else {
      setEditMode(false);
      setSelectedMasraf(null);
      setFormData({
        categoryId: '',
        referenceNo: '',
        notes: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentType: 'CASH',
      });
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedMasraf(null);
  }, []);

  const handleFormChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    try {
      const amountNumber = parseFloat(formData.amount);

      if (!formData.categoryId || !amountNumber || amountNumber <= 0) {
        enqueueSnackbar('Lütfen tüm zorunlu alanları doldurun', { variant: 'error' });
        return;
      }

      setActionLoading(true);

      const submitData = {
        ...formData,
        amount: amountNumber,
        paymentType: formData.paymentType || null,
      };

      if (editMode && selectedMasraf) {
        await axios.put(`/expenses/${selectedMasraf.id}`, submitData);
        enqueueSnackbar('Masraf kaydı güncellendi', { variant: 'success' });
      } else {
        await axios.post('/expenses', submitData);
        enqueueSnackbar('Masraf kaydı oluşturuldu', { variant: 'success' });
      }

      handleCloseDialog();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['masraflar'] }),
        queryClient.invalidateQueries({ queryKey: ['masraf-stats'] }),
      ]);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [printOpen, setPrintOpen] = useState(false);
  const openExportMenu = Boolean(exportAnchorEl);

  const handleExportExcel = () => {
    try {
      if (masraflar.length === 0) {
        enqueueSnackbar('Dışa aktarılacak veri bulunamadı', { variant: 'info' });
        return;
      }

      const exportData = masraflar.map(m => ({
        'Tarih': format(new Date(m.date), 'dd.MM.yyyy'),
        'Kategori': m.category?.name || '-',
        'Açıklama': m.notes || '-',
        'Fiş/Fatura No': m.referenceNo || '-',
        'Ödeme Şekli': m.paymentType || 'Belirtilmedi',
        'Tutar': m.amount
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Masraflar');

      // Kolon genişliklerini ayarla
      const wscols = [
        { wch: 12 }, // Tarih
        { wch: 25 }, // Kategori
        { wch: 40 }, // Açıklama
        { wch: 20 }, // Fiş No
        { wch: 15 }, // Ödeme Şekli
        { wch: 15 }  // Tutar
      ];
      ws['!cols'] = wscols;

      XLSX.writeFile(wb, `Masraf_Raporu_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`);
      setExportAnchorEl(null);
    } catch (error) {
      console.error('Excel export error:', error);
      enqueueSnackbar('Excel oluşturulurken hata oluştu', { variant: 'error' });
    }
  };

  const handleExportPdf = () => {
    if (masraflar.length === 0) {
      enqueueSnackbar('Dışa aktarılacak veri bulunamadı', { variant: 'info' });
      return;
    }
    setPrintOpen(true);
    setExportAnchorEl(null);
  };

  const handleDelete = async () => {
    if (!selectedMasraf) return;

    try {
      setActionLoading(true);
      await axios.delete(`/expenses/${selectedMasraf.id}`);
      enqueueSnackbar('Masraf kaydı silindi', { variant: 'success' });
      setOpenDelete(false);
      setSelectedMasraf(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['masraflar'] }),
        queryClient.invalidateQueries({ queryKey: ['masraf-stats'] }),
      ]);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Silme işlemi sırasında hata oluştu', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  // Kategori yönetimi
  const [kategoriEditMode, setKategoriEditMode] = useState(false);

  const handleOpenKategoriDialog = (kategori?: MasrafKategori) => {
    if (kategori) {
      setKategoriEditMode(true);
      setSelectedKategori(kategori);
      setKategoriFormData({
        name: kategori.name,
        notes: kategori.notes || '',
      });
    } else {
      setKategoriEditMode(false);
      setSelectedKategori(null);
      setKategoriFormData({
        name: '',
        notes: '',
      });
    }
    setOpenKategoriDialog(true);
  };

  const handleKategoriSubmit = async () => {
    try {
      if (!kategoriFormData.name.trim()) {
        enqueueSnackbar('Kategori adı gereklidir', { variant: 'error' });
        return;
      }

      setActionLoading(true);

      if (kategoriEditMode && selectedKategori) {
        await axios.put(`/expenses/categoryler/${selectedKategori.id}`, kategoriFormData);
        enqueueSnackbar('Kategori güncellendi', { variant: 'success' });
      } else {
        await axios.post('/expenses/categoryler', kategoriFormData);
        enqueueSnackbar('Kategori oluşturuldu', { variant: 'success' });
      }

      setOpenKategoriDialog(false);
      setKategoriFormData({ name: '', notes: '' });
      setKategoriEditMode(false);
      setSelectedKategori(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['masraf-kategoriler'] }),
        queryClient.invalidateQueries({ queryKey: ['masraf-stats'] }),
      ]);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Kategori işlemi sırasında hata oluştu', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleKategoriDelete = async () => {
    if (!selectedKategori) return;

    try {
      setActionLoading(true);
      await axios.delete(`/expenses/categoryler/${selectedKategori.id}`);
      enqueueSnackbar('Kategori silindi', { variant: 'success' });
      setOpenKategoriDelete(false);
      setSelectedKategori(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['masraf-kategoriler'] }),
        queryClient.invalidateQueries({ queryKey: ['masraf-stats'] }),
      ]);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Kategori silinemedi', { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const masrafColumns = useMemo<GridColDef[]>(() => [
    {
      field: 'date',
      headerName: 'Tarih',
      minWidth: 120,
      renderCell: (params: any) => {
        const row = params.row as Masraf;
        if (!row?.date) return <Typography variant="body2">-</Typography>;
        return <Typography variant="body2">{formatDate(row.date)}</Typography>;
      },
      valueGetter: (params: any) => params?.row?.date ? formatDate(params.row.date) : '',
    },
    {
      field: 'referenceNo',
      headerName: 'Fiş/Fatura No',
      minWidth: 140,
      renderCell: (params: any) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--foreground)', fontFamily: 'monospace' }}>
          {params.row.referenceNo || '-'}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Kategori',
      flex: 1,
      minWidth: 160,
      renderCell: (params: any) => {
        const row = params.row as Masraf;
        if (!row) return <Typography variant="body2">-</Typography>;
        return (
          <Chip
            label={row.category?.name || '-'}
            size="small"
            sx={{
              bgcolor: 'color-mix(in srgb, var(--muted-foreground) 10%, transparent)',
              color: 'var(--foreground)',
              borderColor: 'var(--border)',
            }}
            variant="outlined"
          />
        );
      },
      valueGetter: (params: any) => params?.row?.category?.name || '-',
    },
    {
      field: 'notes',
      headerName: 'Açıklama',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params: any) => {
        const row = params.row as Masraf;
        return (
          <Typography variant="body2" noWrap sx={{ maxWidth: '100%' }}>
            {row?.notes || '-'}
          </Typography>
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Tutar',
      minWidth: 140,
      renderCell: (params: any) => {
        const row = params.row as Masraf;
        if (!row?.amount) return <Typography variant="body2">-</Typography>;
        return (
          <Typography variant="body2" fontWeight={600} sx={{ color: 'var(--destructive)' }}>
            {formatCurrency(row.amount)}
          </Typography>
        );
      },
      valueGetter: (params: any) => params?.row?.amount ? formatCurrency((params.row as Masraf).amount) : '-',
    },
    {
      field: 'paymentType',
      headerName: 'Ödeme Tipi',
      minWidth: 160,
      renderCell: (params: any) => {
        const row = params.row as Masraf;
        if (!row?.paymentType) return <Typography variant="body2">-</Typography>;
        const colorMap: Record<string, string> = {
          CASH: 'var(--chart-2)',
          CREDIT_CARD: 'var(--chart-1)',
          BANK_TRANSFER: 'var(--secondary)',
        };
        const chipColor = colorMap[row.paymentType] || 'var(--muted-foreground)';
        return (
          <Chip
            label={getOdemeTipiLabel(row.paymentType)}
            size="small"
            sx={{
              bgcolor: `color-mix(in srgb, ${chipColor} 15%, transparent)`,
              color: chipColor,
              borderColor: chipColor,
            }}
            variant="outlined"
          />
        );
      },
      valueGetter: (params: any) => params?.row?.paymentType ? getOdemeTipiLabel((params.row as Masraf).paymentType) : '-',
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      sortable: false,
      filterable: false,
      width: 140,
      renderCell: (params: GridRenderCellParams) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const row = params.row;

        const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        if (!row) return null;

        return (
          <>
            <IconButton
              size="small"
              onClick={handleToggle}
              sx={{
                color: open ? 'var(--primary)' : 'text.secondary',
                '&:hover': {
                  bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                  color: 'var(--primary)',
                },
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={(e) => e.stopPropagation()}
              PaperProps={{
                elevation: 8,
                sx: {
                  minWidth: 200,
                  mt: 1,
                  borderRadius: 2,
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5, bgcolor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                  Masraf İşlemleri
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.aciklama || 'Masraf Kaydı'}
                </Typography>
              </Box>

              <Box sx={{ p: 1 }}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleOpenDialog(row);
                  }}
                  sx={{ borderRadius: 1.5, mb: 0.5 }}
                >
                  <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                  <Typography variant="body2" fontWeight={500}>Düzenle</Typography>
                </MenuItem>

                <MenuItem
                  onClick={(e) => {
                    handleClose();
                    setAuditAnchor({ el: e.currentTarget, data: row });
                  }}
                  sx={{ borderRadius: 1.5, mb: 0.5 }}
                >
                  <ListItemIcon><History fontSize="small" /></ListItemIcon>
                  <Typography variant="body2" fontWeight={500}>Denetim Bilgileri</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleClose();
                    setSelectedMasraf(row);
                    setOpenDelete(true);
                  }}
                  sx={{
                    borderRadius: 1.5,
                    color: 'error.main',
                    '&:hover': { bgcolor: 'color-mix(in srgb, var(--error) 10%, transparent)' }
                  }}
                >
                  <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
                  <Typography variant="body2" fontWeight={600}>Sil</Typography>
                </MenuItem>
              </Box>
            </Menu>
          </>
        );
      },
    },
  ], [handleOpenDialog, handleViewDetail]);

  return (
    <Box sx={{ pb: 4 }}>
      {/* Sayfa Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius)',
            background: 'linear-gradient(135deg, var(--destructive), color-mix(in srgb, var(--destructive) 70%, black))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px color-mix(in srgb, var(--destructive) 25%, transparent)',
          }}>
            <CurrencyLira sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.2 }}>
              Gider Yönetimi
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>
              İşletme harcamaları ve masraf kayıtları
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Category />}
            onClick={() => handleOpenKategoriDialog()}
            sx={{
              borderRadius: 'var(--radius)',
              textTransform: 'none',
              fontWeight: 600,
              color: 'var(--foreground)',
              borderColor: 'var(--border)',
              '&:hover': { bgcolor: 'var(--muted)', borderColor: 'var(--primary)' }
            }}
          >
            Kategoriler
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 'var(--radius)',
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: 'var(--destructive)',
              color: 'var(--destructive-foreground)',
              boxShadow: '0 4px 12px color-mix(in srgb, var(--destructive) 30%, transparent)',
              '&:hover': {
                bgcolor: 'color-mix(in srgb, var(--destructive) 90%, black)',
                boxShadow: '0 6px 16px color-mix(in srgb, var(--destructive) 40%, transparent)',
              }
            }}
          >
            Yeni Masraf
          </Button>
        </Stack>
      </Box>

      {/* KPI / Metrics strip */}
      <Paper variant="outlined" sx={{
        mb: 2,
        p: 0,
        display: 'flex',
        flexWrap: 'wrap',
        borderRadius: 'var(--radius)',
        bgcolor: 'var(--card)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}>
        {[
          { label: 'TOPLAM MASRAF', value: formatCurrency(stats?.toplamExpense || 0), icon: <TrendingDown />, color: 'var(--destructive)' },
          { label: 'KAYIT SAYISI', value: String(stats?.toplamAdet || 0), icon: <TableRows />, color: 'var(--primary)' },
          { label: 'KATEGORİ', value: String(kategoriler.length), icon: <Category />, color: 'var(--chart-2)' },
          { label: 'ORTALAMA', value: (stats?.toplamAdet ?? 0) > 0 ? formatCurrency((stats?.toplamExpense ?? 0) / (stats?.toplamAdet ?? 1)) : '₺0', icon: <TrendingUp />, color: 'var(--chart-4)' }
        ].map((item, idx) => (
          <Box key={idx} sx={{
            flex: '1 1 120px',
            p: 2,
            borderRight: idx === 3 ? 'none' : '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            minWidth: isMobile ? '50%' : 'auto',
            borderBottom: isMobile && idx < 2 ? '1px solid var(--border)' : 'none'
          }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius)',
              bgcolor: `color-mix(in srgb, ${item.color} 10%, transparent)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.color
            }}>
              {item.icon}
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 600, display: 'block', mb: 0.2 }}>
                {item.label}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.2 }}>
                {item.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* Toolbar */}
      <Paper variant="outlined" sx={{ mb: 2, borderRadius: 'var(--radius)', border: '1px solid var(--border)', bgcolor: 'var(--card)' }}>
        <Stack
          direction={isTablet ? 'column' : 'row'}
          spacing={2}
          sx={{ p: 2, alignItems: isTablet ? 'stretch' : 'center' }}
        >
          <TextField
            size="small"
            placeholder="Açıklama veya kategori ara..."
            sx={{ flex: 1 }}
            value={categorySearch}
            onChange={(e: any) => setCategorySearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2.5 }
            }}
          />

          {!isTablet && <Divider orientation="vertical" flexItem />}

          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              overflowX: 'auto',
              pb: isMobile ? 1 : 0,
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            <Chip
              label="Bugün"
              onClick={() => handleQuickFilter('today')}
              size="small"
              variant={filterBaslangic === new Date().toISOString().split('T')[0] ? 'filled' : 'outlined'}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            />
            <Chip
              label="Bu Hafta"
              onClick={() => handleQuickFilter('week')}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 2, fontWeight: 600 }}
            />
            <Chip
              label="Bu Ay"
              onClick={() => handleQuickFilter('month')}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 2, fontWeight: 600 }}
            />
          </Stack>

          {!isTablet && <Divider orientation="vertical" flexItem />}

          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1.5 : 1}
            sx={{ flex: isTablet ? 'none' : '1 1 300px' }}
          >
            <TextField
              size="small"
              type="date"
              label="Başlangıç"
              fullWidth={isMobile}
              value={filterBaslangic}
              onChange={(e: any) => setFilterBaslangic(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputBase-root': { borderRadius: 2.5 } }}
            />
            <TextField
              size="small"
              type="date"
              label="Bitiş"
              fullWidth={isMobile}
              value={filterBitis}
              onChange={(e: any) => setFilterBitis(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiInputBase-root': { borderRadius: 2.5 } }}
            />
          </Stack>

          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={(e: any) => setExportAnchorEl(e.currentTarget)}
            sx={{ borderRadius: 2.5, height: 40, px: 2 }}
          >
            Dışa Aktar
          </Button>
        </Stack>
      </Paper>

      {stats && stats.categoryler && stats.categoryler.length > 0 && (
        <Box sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          pb: 1,
          mb: 1.5,
          '&::-webkit-scrollbar': { display: 'none' },
        }}>
          {stats.categoryler.map((kat: any) => (
            <Box key={kat.categoryId}>
              <Paper
                variant="outlined"
                sx={{
                  px: 1.8,
                  py: 1.2,
                  borderRadius: 3,
                  minWidth: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  opacity: 0.6
                }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {kat.name}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, whiteSpace: 'nowrap' }}>
                  {formatCurrency(kat.toplam)}
                </Typography>
                <Box sx={{
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', color: 'text.secondary' }}>
                    {kat.adet}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      )}

      <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 'var(--radius)', border: '1px solid var(--border)', bgcolor: 'var(--card)' }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={masraflar}
            columns={masrafColumns}
            loading={isMasrafLoading}
            disableRowSelectionOnClick
            pageSizeOptions={[25, 50, 100]}
            rowHeight={44}
            columnHeaderHeight={40}
            density="compact"
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            slots={{
              noRowsOverlay: DataGridNoRowsOverlay,
              footer: () => (
                <Box sx={{
                  p: 1.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border)',
                  bgcolor: 'color-mix(in srgb, var(--muted) 30%, transparent)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Toplam Tutar
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--destructive)', fontSize: '0.9rem' }}>
                      {formatCurrency(stats?.toplamExpense || 0)}
                    </Typography>
                  </Box>
                  <GridPagination />
                </Box>
              )
            }}
            sx={{
              border: 'none',
              fontSize: '0.8125rem',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--border)',
              },
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                py: 0,
                borderBottom: '1px solid color-mix(in srgb, var(--border) 60%, transparent)',
                color: 'var(--foreground)',
              },
              '& .MuiDataGrid-row': {
                '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary) 4%, transparent)' },
              },
              '& .MuiDataGrid-footerContainer': {
                display: 'none', // Custom footer kullandığımız için varsayılanı gizliyoruz
              },
            }}
          />
        </Box>
      </Paper>

      {/* Dışa Aktarım Menüsü */}
      <Menu
        anchorEl={exportAnchorEl}
        open={openExportMenu}
        onClose={() => setExportAnchorEl(null)}
        PaperProps={{
          elevation: 8,
          sx: {
            minWidth: 180,
            mt: 1,
            borderRadius: 2,
            border: '1px solid var(--border)',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleExportExcel} sx={{ gap: 1.5, py: 1 }}>
          <ListItemIcon sx={{ minWidth: 'auto', color: 'success.main' }}>
            <FileDownload fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Excel ile Aktar</Typography>
        </MenuItem>
        <MenuItem onClick={() => { setExportAnchorEl(null); setPrintOpen(true); }} sx={{ gap: 1.5, py: 1 }}>
          <ListItemIcon sx={{ minWidth: 'auto', color: 'primary.main' }}>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>PDF / Yazdır</Typography>
        </MenuItem>
      </Menu>

      {/* Audit Popover */}
      <AuditPopover
        anchorEl={auditAnchor.el}
        data={auditAnchor.data}
        onClose={() => setAuditAnchor({ el: null, data: null })}
      />


      {/* Form Dialog */}
      <MasrafFormDialog
        open={openDialog}
        editMode={editMode}
        formData={formData}
        kategoriler={kategoriler}
        loading={actionLoading}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
        isMobile={isMobile}
      />

      {/* Kurumsal Yazdırma Formu */}
      <ExpensePrintForm
        open={printOpen}
        expenses={masraflar}
        onClose={() => setPrintOpen(false)}
        dateRange={{ start: filterBaslangic, end: filterBitis }}
      />

      {/* Silme Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Masraf Kaydını Sil</DialogTitle>
        <DialogContent>
          <Typography>Bu masraf kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDelete(false)} sx={{ borderRadius: 2 }}>İptal</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={actionLoading}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Masrafı Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Kategori Yönetimi Dialog */}
      <Dialog
        open={openKategoriDialog}
        onClose={() => setOpenKategoriDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            bgcolor: 'var(--card)',
            backgroundImage: 'none',
            borderRadius: isMobile ? 0 : 'var(--radius)',
            border: isMobile ? 'none' : '1px solid var(--border)',
            boxShadow: 'var(--shadow-2xl)',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(to right, var(--card), color-mix(in srgb, var(--primary) 3%, transparent))',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary)',
            }}>
              <Category sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.2 }}>
                Masraf Kategorileri
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>
                Gider kalemlerinizi gruplandırın ve yönetin
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => setOpenKategoriDialog(false)}
            sx={{
              color: 'var(--muted-foreground)',
              transition: 'all 0.2s',
              '&:hover': {
                color: 'var(--destructive)',
                bgcolor: 'color-mix(in srgb, var(--destructive) 8%, transparent)',
                transform: 'rotate(90deg)',
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0, bgcolor: 'var(--card)', height: isMobile ? '100%' : '70vh', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Sidebar: Liste ve Arama */}
          <Box sx={{
            width: { xs: '100%', md: '360px' },
            borderRight: { xs: 'none', md: '1px solid var(--border)' },
            borderBottom: { xs: '1px solid var(--border)', md: 'none' },
            display: (isMobile && kategoriEditMode) ? 'none' : 'flex',
            flexDirection: 'column',
            bgcolor: 'color-mix(in srgb, var(--primary) 1%, var(--card))',
            height: { xs: '100%', md: 'auto' }
          }}>
            <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Kategori Listesi</Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => {
                    setKategoriEditMode(false);
                    setSelectedKategori(null);
                    setKategoriFormData({ name: '', notes: '' });
                  }}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Yeni Ekle
                </Button>
              </Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Kategori ara..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ fontSize: 18, color: 'var(--muted-foreground)' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 'var(--radius-md)', bgcolor: 'var(--card)' }
                }}
              />
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
              <Stack spacing={1}>
                {kategoriler
                  .filter(k => k.name.toLowerCase().includes(categorySearch.toLowerCase()))
                  .map((kat) => {
                    const stat = stats?.categoryler?.find(s => s.categoryId === kat.id);
                    const percentage = stats?.toplamExpense ? ((stat?.toplam || 0) / stats.toplamExpense) * 100 : 0;
                    const isActive = selectedKategori?.id === kat.id && kategoriEditMode;

                    return (
                      <Box
                        key={kat.id}
                        onClick={() => handleOpenKategoriDialog(kat)}
                        sx={{
                          p: 1.5,
                          borderRadius: 'var(--radius)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: '1px solid',
                          borderColor: isActive ? 'var(--primary)' : 'transparent',
                          bgcolor: isActive ? 'color-mix(in srgb, var(--primary) 5%, var(--card))' : 'transparent',
                          '&:hover': {
                            bgcolor: isActive ? 'color-mix(in srgb, var(--primary) 8%, var(--card))' : 'var(--muted)',
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                            {kat.name}
                          </Typography>
                          <Chip
                            label={kat._count?.expenses || 0}
                            size="small"
                            sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: 'var(--background)', color: 'var(--muted-foreground)' }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ flex: 1, height: 4, bgcolor: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{
                              width: `${Math.min(100, percentage)}%`,
                              height: '100%',
                              bgcolor: 'var(--secondary)',
                              borderRadius: 2
                            }} />
                          </Box>
                          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 600, minWidth: 35 }}>
                            %{Math.round(percentage)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', display: 'block', mt: 0.5 }}>
                          {formatCurrency(stat?.toplam || 0)} harcama
                        </Typography>
                      </Box>
                    );
                  })}
              </Stack>
            </Box>
          </Box>

          {/* Main: Form ve Detay */}
          <Box sx={{
            flex: 1,
            p: { xs: 2.5, md: 4 },
            display: (isMobile && !kategoriEditMode) ? 'none' : 'flex',
            flexDirection: 'column',
            bgcolor: 'var(--card)',
            overflowY: 'auto'
          }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {isMobile && kategoriEditMode && (
                  <IconButton
                    size="small"
                    onClick={() => setKategoriEditMode(false)}
                    sx={{ mr: 1, color: 'var(--primary)' }}
                  >
                    <Visibility sx={{ transform: 'rotate(180deg)' }} />
                  </IconButton>
                )}
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--foreground)' }}>
                  {kategoriEditMode ? 'Kategori Düzenle' : 'Yeni Kategori Tanımla'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                {kategoriEditMode
                  ? 'Kategori bilgilerini güncelleyerek harcamalarınızı daha iyi organize edin.'
                  : 'Masraflarınızı gruplandırmak için yeni bir kategori adı ve isteğe bağlı açıklama girin.'}
              </Typography>
            </Box>

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Kategori Başlığı *"
                className="form-control-textfield"
                value={kategoriFormData.name}
                onChange={(e) => setKategoriFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Harcama grubunu isimlendirin..."
              />
              <TextField
                fullWidth
                label="Açıklama"
                className="form-control-textfield"
                value={kategoriFormData.notes}
                onChange={(e) => setKategoriFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Bu kategori neleri kapsıyor? (Opsiyonel)"
                multiline
                rows={3}
              />

              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleKategoriSubmit}
                  disabled={actionLoading}
                  sx={{
                    px: 4,
                    height: 44,
                    borderRadius: 'var(--radius)',
                    bgcolor: 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    textTransform: 'none',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px color-mix(in srgb, var(--secondary) 25%, transparent)',
                    '&:hover': {
                      bgcolor: 'color-mix(in srgb, var(--secondary) 90%, black)',
                      boxShadow: '0 6px 16px color-mix(in srgb, var(--secondary) 35%, transparent)',
                    },
                  }}
                >
                  {kategoriEditMode ? 'Değişiklikleri Kaydet' : 'Kategoriyi Oluştur'}
                </Button>
                {kategoriEditMode && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setKategoriEditMode(false);
                        setSelectedKategori(null);
                        setKategoriFormData({ name: '', notes: '' });
                      }}
                      sx={{
                        height: 44,
                        borderRadius: 'var(--radius)',
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'var(--muted-foreground)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      Vazgeç
                    </Button>
                    <IconButton
                      onClick={() => {
                        setOpenKategoriDelete(true);
                      }}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius)',
                        color: 'var(--destructive)',
                        bgcolor: 'color-mix(in srgb, var(--destructive) 8%, transparent)',
                        '&:hover': { bgcolor: 'color-mix(in srgb, var(--destructive) 15%, transparent)' }
                      }}
                      disabled={!!selectedKategori?._count?.expenses}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Stack>

            {kategoriEditMode && (selectedKategori?._count?.expenses ?? 0) > 0 && (
              <Alert severity="info" sx={{ mt: 'auto', borderRadius: 'var(--radius)', bgcolor: 'color-mix(in srgb, var(--primary) 5%, var(--card))', border: 'none' }}>
                Bu kategoride {selectedKategori?._count?.expenses} adet harcama kaydı bulunmaktadır.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'var(--card)', borderTop: '1px solid var(--border)' }}>
          <Button
            onClick={() => setOpenKategoriDialog(false)}
            sx={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              '&:hover': {
                borderColor: 'var(--primary)',
                bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
              },
            }}
          >
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Kategori Silme Dialog */}
      <Dialog
        open={openKategoriDelete}
        onClose={() => setOpenKategoriDelete(false)}
        PaperProps={{
          sx: {
            bgcolor: 'var(--card)',
            backgroundImage: 'none',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-2xl)',
            overflow: 'hidden',
            minWidth: 320,
          },
        }}
      >
        <DialogTitle sx={{
          fontWeight: 800,
          color: 'var(--foreground)',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center',
          py: 2
        }}>
          Kategori Silme Onayı
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: 'var(--card)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2, pt: 1 }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'color-mix(in srgb, var(--destructive) 10%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--destructive)',
              mb: 1
            }}>
              <Delete sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="body1" sx={{ color: 'var(--foreground)', fontWeight: 500 }}>
              Bu kategoriyi silmek istediğinizden emin misiniz?
            </Typography>

            <Box sx={{
              width: '100%',
              p: 2,
              bgcolor: 'var(--background)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              textAlign: 'left',
              mt: 1
            }}>
              <Typography variant="caption" display="block" sx={{ color: 'var(--muted-foreground)', mb: 0.5 }}>KATEGORİ ADI</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
                {selectedKategori?.name}
              </Typography>
            </Box>

            {selectedKategori?._count?.expenses ? (
              <Alert severity="error" sx={{ mt: 2, width: '100%', borderRadius: 'var(--radius-md)' }}>
                Bu kategoride **{selectedKategori._count.expenses}** adet masraf kaydı var. Önce bu kayıtları silmeniz gerekir.
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ mt: 2, width: '100%', borderRadius: 'var(--radius-md)' }}>
                Bu işlem geri alınamaz!
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'color-mix(in srgb, var(--primary) 2%, var(--card))', borderTop: '1px solid var(--border)', gap: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpenKategoriDelete(false)}
            sx={{
              borderRadius: 'var(--radius)',
              textTransform: 'none',
              fontWeight: 600,
              color: 'var(--foreground)',
              borderColor: 'var(--border)',
              '&:hover': { borderColor: 'var(--primary)', bgcolor: 'transparent' }
            }}
          >
            Vazgeç
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleKategoriDelete}
            disabled={actionLoading || !!selectedKategori?._count?.expenses}
            sx={{
              borderRadius: 'var(--radius)',
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: 'var(--destructive)',
              color: 'var(--destructive-foreground)',
              boxShadow: '0 4px 12px color-mix(in srgb, var(--destructive) 30%, transparent)',
              '&:hover': {
                bgcolor: 'color-mix(in srgb, var(--destructive) 90%, black)',
                boxShadow: '0 6px 16px color-mix(in srgb, var(--destructive) 40%, transparent)',
              }
            }}
          >
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
