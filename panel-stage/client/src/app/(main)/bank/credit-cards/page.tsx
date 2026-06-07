'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  TextField,
  LinearProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Collapse,
  Tooltip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  alpha,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Add,
  Search,
  RefreshOutlined,
  FilterList,
  Close,
  CreditCard,
  Visibility,
  Edit,
  Delete,
  ExpandMore,
  Download,
  Event,
  AttachMoney,
  CalendarMonth,
  Warning,
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { StandardPage, StandardCard } from '@/components/common';
import { useTabStore } from '@/stores/tabStore';
import * as XLSX from 'xlsx';

interface CompanyCreditCard {
  id: string;
  cardName: string;
  cardLastFourDigits?: string;
  cardType: 'PERSONAL' | 'COMPANY';
  billingDay: number;
  dueDay: number;
  creditLimit: number;
  usedLimit: number;
  availableLimit: number;
  isActive: boolean;
  bank?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface UpcomingInstallment {
  id: string;
  cardId: string;
  cardName: string;
  dueDate: string;
  amount: number;
  lastFourDigits?: string;
  isPaid: boolean;
}

const CARD_TYPE_LABELS = {
  PERSONAL: 'Kişisel',
  COMPANY: 'Kurumsal',
};

export default function CompanyCreditCardsPage() {
  const router = useRouter();
  const { addTab, setActiveTab } = useTabStore();

  const [cards, setCards] = useState<CompanyCreditCard[]>([]);
  const [upcomingInstallments, setUpcomingInstallments] = useState<UpcomingInstallment[]>([]);
  const [loading, setLoading] = useState(false);
  const [installmentsLoading, setInstallmentsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }]);
  const [rowCount, setRowCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [showUpcoming, setShowUpcoming] = useState(true);

  const [selectedCard, setSelectedCard] = useState<CompanyCreditCard | null>(null);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    cardName: '',
    cardLastFourDigits: '',
    cardType: 'COMPANY' as 'PERSONAL' | 'COMPANY',
    billingDay: 1,
    dueDay: 15,
    creditLimit: 0,
    isActive: true,
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [banks, setBanks] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    addTab({ id: 'company-credit-cards', label: 'Firma Kredi Kartları', path: '/bank/credit-cards' });
  }, [addTab]);

  useEffect(() => {
    fetchCards();
    fetchUpcomingInstallments();
  }, [paginationModel, sortModel, filterType]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      };
      if (filterType) params.type = filterType;

      const response = await axios.get('/company-credit-cards', { params });
      setCards(response.data?.data || response.data || []);
      setRowCount(response.data?.total || (Array.isArray(response.data) ? response.data.length : 0));
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Kartlar yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingInstallments = async () => {
    try {
      setInstallmentsLoading(true);
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 30);

      const response = await axios.get('/banks/credit-cards/upcoming', {
        params: {
          start: today.toISOString(),
          end: endDate.toISOString(),
        },
      });
      setUpcomingInstallments(response.data || []);
    } catch (error: any) {
      console.error('Taksitler yüklenirken hata:', error);
    } finally {
      setInstallmentsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleViewCard = (card: CompanyCreditCard) => {
    setSelectedCard(card);
    setOpenView(true);
  };

  const handleEditCard = (card: CompanyCreditCard) => {
    setSelectedCard(card);
    setEditForm({
      cardName: card.cardName || '',
      cardLastFourDigits: card.cardLastFourDigits || '',
      cardType: card.cardType || 'COMPANY',
      billingDay: card.billingDay || 1,
      dueDay: card.dueDay || 15,
      creditLimit: card.creditLimit || 0,
      isActive: card.isActive,
    });
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCard) return;
    try {
      await axios.put(`/company-credit-cards/${selectedCard.id}`, editForm);
      showSnackbar('Kart başarıyla güncellendi', 'success');
      setOpenEdit(false);
      fetchCards();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Güncelleme başarısız', 'error');
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) return;
    try {
      await axios.delete(`/company-credit-cards/${selectedCard.id}`);
      showSnackbar('Kart başarıyla silindi', 'success');
      setOpenDelete(false);
      setSelectedCard(null);
      fetchCards();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Silme işlemi başarısız', 'error');
    }
  };

  const handleClearFilters = () => {
    setFilterType('');
    setSearchTerm('');
  };

  const handleExportExcel = async () => {
    try {
      const params: Record<string, any> = {};
      if (filterType) params.type = filterType;

      const response = await axios.get('/company-credit-cards', {
        params: { ...params, limit: 10000, page: 1 },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `firma_kredi_kartlari_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSnackbar('Excel dosyası indirildi', 'success');
    } catch (error: any) {
      showSnackbar('Excel aktarımı başarısız', 'error');
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const pageTotals = useMemo(() => {
    return cards.reduce(
      (acc, card) => ({
        creditLimit: acc.creditLimit + (card.creditLimit || 0),
        usedLimit: acc.usedLimit + (card.usedLimit || 0),
        availableLimit: acc.availableLimit + (card.availableLimit || 0),
      }),
      { creditLimit: 0, usedLimit: 0, availableLimit: 0 }
    );
  }, [cards]);

  const upcomingDueCards = useMemo(() => {
    const now = new Date();
    return upcomingInstallments.filter(i => !i.isPaid && new Date(i.dueDate) <= now);
  }, [upcomingInstallments]);

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'cardName',
      headerName: 'Kart Adı',
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<CompanyCreditCard>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            bgcolor: alpha('var(--chart-5)', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CreditCard sx={{ fontSize: 18, color: 'var(--chart-5)' }} />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="bold">{params.value}</Typography>
            {params.row.cardLastFourDigits && (
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                ****{params.row.cardLastFourDigits}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: 'bank',
      headerName: 'Banka',
      width: 150,
      renderCell: (params) => params.value?.name || '-',
    },
    {
      field: 'cardType',
      headerName: 'Tür',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={CARD_TYPE_LABELS[params.value as keyof typeof CARD_TYPE_LABELS] || params.value}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
        />
      ),
    },
    {
      field: 'creditLimit',
      headerName: 'Kredi Limiti',
      width: 140,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => formatCurrency(value),
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>{formatCurrency(params.value)}</Typography>
      ),
    },
    {
      field: 'usedLimit',
      headerName: 'Kullanılan',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => formatCurrency(value),
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: 'var(--destructive)' }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'availableLimit',
      headerName: 'Kalan Limit',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => formatCurrency(value),
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} sx={{ color: 'var(--chart-2)' }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'billingDue',
      headerName: 'Kesim / Vade',
      width: 120,
      renderCell: (params: GridRenderCellParams<CompanyCreditCard>) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
          {params.row.billingDay}. / {params.row.dueDay}.
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
          color={params.value ? 'success' : 'default'}
          sx={{ fontWeight: 600, borderRadius: 1.5 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams<CompanyCreditCard>) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Detay">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewCard(params.row); }}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Düzenle">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditCard(params.row); }}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); setSelectedCard(params.row); setOpenDelete(true); }}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ], []);

  const installmentColumns: GridColDef[] = useMemo(() => [
    {
      field: 'cardName',
      headerName: 'Kart',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'dueDate',
      headerName: 'Son Ödeme',
      width: 130,
      valueFormatter: (value) => formatDate(value),
      renderCell: (params: GridRenderCellParams<UpcomingInstallment>) => {
        const dueDate = new Date(params.value);
        const today = new Date();
        const isOverdue = dueDate < today && !params.row.isPaid;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isOverdue && <Warning sx={{ fontSize: 14, color: 'var(--destructive)' }} />}
            <Typography variant="body2" sx={{ color: isOverdue ? 'var(--destructive)' : 'inherit', fontWeight: isOverdue ? 700 : 400 }}>
              {formatDate(params.value)}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Tutar',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => formatCurrency(value),
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={700} color="var(--chart-5)">
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'lastFourDigits',
      headerName: 'Son 4 Hane',
      width: 100,
      renderCell: (params) => params.value ? `****${params.value}` : '-',
    },
    {
      field: 'isPaid',
      headerName: 'Durum',
      width: 100,
      renderCell: (params: GridRenderCellParams<UpcomingInstallment>) => (
        <Chip
          label={params.value ? 'Ödendi' : 'Bekliyor'}
          size="small"
          color={params.value ? 'success' : 'warning'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ], []);

  return (
    <StandardPage maxWidth={false}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-5) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard sx={{ color: 'var(--chart-5)', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight="700">Firma Kredi Kartları</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<Download />} onClick={handleExportExcel}>
            Excel
          </Button>
        </Stack>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2, height: 3 }} color="secondary" />}

      {/* Summary KPIs */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--chart-5)' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">Toplam Kredi Limiti</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: 'var(--chart-5)' }}>
                {formatCurrency(pageTotals.creditLimit)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--destructive)' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">Toplam Kullanılan</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: 'var(--destructive)' }}>
                {formatCurrency(pageTotals.usedLimit)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--chart-2)' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">Toplam Kalan Limit</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: 'var(--chart-2)' }}>
                {formatCurrency(pageTotals.availableLimit)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Installments */}
      {upcomingDueCards.length > 0 && (
        <Paper sx={{ mb: 2, p: 2, borderRadius: 2, border: '1px solid var(--destructive)', bgcolor: 'color-mix(in srgb, var(--destructive) 5%, var(--card))' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Warning sx={{ color: 'var(--destructive)', fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'var(--destructive)' }}>
              Vadesi Geçen Taksitler ({upcomingDueCards.length})
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {upcomingDueCards.map((item) => (
              <Chip
                key={item.id}
                label={`${item.cardName} - ${formatCurrency(item.amount)} (${formatDate(item.dueDate)})`}
                size="small"
                color="error"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            ))}
          </Stack>
        </Paper>
      )}

      <StandardCard padding={0} sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            size="small"
            placeholder="Kart ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <Close fontSize="small" />
                </IconButton>
              ),
            }}
          />
          <Button
            variant={showUpcoming ? 'contained' : 'outlined'}
            size="small"
            startIcon={<CalendarMonth />}
            onClick={() => setShowUpcoming(!showUpcoming)}
            color={showUpcoming ? 'secondary' : 'default'}
          >
            Yaklaşan Taksitler
          </Button>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
            <Tooltip title="Filtreler">
              <IconButton onClick={() => setShowFilters(!showFilters)} color={showFilters ? 'secondary' : 'default'}>
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Yenile">
              <IconButton onClick={() => { fetchCards(); fetchUpcomingInstallments(); }}>
                <RefreshOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ p: 2, bgcolor: 'action.hover', borderBottom: '1px solid var(--border)' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Kart Türü</InputLabel>
                <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Kart Türü">
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="COMPANY">Kurumsal</MenuItem>
                  <MenuItem value="PERSONAL">Kişisel</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={handleClearFilters}>Temizle</Button>
            </Stack>
          </Box>
        </Collapse>

        <Collapse in={showUpcoming}>
          <Box sx={{ p: 2, borderBottom: '1px solid var(--border)', bgcolor: 'var(--muted)' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Yaklaşan Taksitler (30 Gün)</Typography>
            {installmentsLoading ? (
              <LinearProgress />
            ) : upcomingInstallments.length > 0 ? (
              <DataGrid
                rows={upcomingInstallments}
                columns={installmentColumns}
                autoHeight
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                sx={{
                  border: '1px solid var(--border)',
                  borderRadius: 2,
                  '& .MuiDataGrid-columnHeaders': { bgcolor: 'var(--card)' },
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">Yaklaşan taksit bulunmamaktadır.</Typography>
            )}
          </Box>
        </Collapse>

        <DataGrid
          rows={cards}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          checkboxSelection={false}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'var(--muted)',
              borderBottom: '1px solid var(--border)',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid var(--border)',
              py: 1.5,
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'var(--secondary)',
              cursor: 'pointer',
            },
          }}
          onRowClick={(params) => handleViewCard(params.row as CompanyCreditCard)}
        />
      </StandardCard>

      {/* View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
        <DialogTitle component="div" sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>Kart Detayı: {selectedCard?.cardName}</Box>
          <IconButton size="small" onClick={() => setOpenView(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedCard && (
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--chart-5)' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary">Kredi Limiti</Typography>
                      <Typography variant="h5" fontWeight={800} sx={{ color: 'var(--chart-5)' }}>
                        {formatCurrency(selectedCard.creditLimit)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--chart-2)' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary">Kalan Limit</Typography>
                      <Typography variant="h5" fontWeight={800} sx={{ color: 'var(--chart-2)' }}>
                        {formatCurrency(selectedCard.availableLimit)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Kart Türü</Typography>
                  <Typography variant="body2" fontWeight={600}>{CARD_TYPE_LABELS[selectedCard.cardType] || selectedCard.cardType}</Typography>
                </Box>
                {selectedCard.cardLastFourDigits && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Son 4 Hane</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>****{selectedCard.cardLastFourDigits}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Banka</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedCard.bank?.name || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Kesim Günü</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedCard.billingDay}. gün</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Son Ödeme Günü</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedCard.dueDay}. gün</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Durum</Typography>
                  <Chip label={selectedCard.isActive ? 'Aktif' : 'Pasif'} size="small" color={selectedCard.isActive ? 'success' : 'default'} />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle component="div">Kredi Kartını Düzenle</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Kart Adı"
              value={editForm.cardName}
              onChange={(e) => setEditForm({ ...editForm, cardName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Son 4 Hane"
              value={editForm.cardLastFourDigits}
              onChange={(e) => setEditForm({ ...editForm, cardLastFourDigits: e.target.value })}
              fullWidth
              inputProps={{ maxLength: 4 }}
            />
            <FormControl fullWidth>
              <InputLabel>Kart Türü</InputLabel>
              <Select
                value={editForm.cardType}
                onChange={(e) => setEditForm({ ...editForm, cardType: e.target.value as 'PERSONAL' | 'COMPANY' })}
                label="Kart Türü"
              >
                <MenuItem value="COMPANY">Kurumsal</MenuItem>
                <MenuItem value="PERSONAL">Kişisel</MenuItem>
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Kesim Günü"
                  type="number"
                  value={editForm.billingDay}
                  onChange={(e) => setEditForm({ ...editForm, billingDay: parseInt(e.target.value) || 1 })}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Son Ödeme Günü"
                  type="number"
                  value={editForm.dueDay}
                  onChange={(e) => setEditForm({ ...editForm, dueDay: parseInt(e.target.value) || 15 })}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              label="Kredi Limiti"
              type="number"
              value={editForm.creditLimit}
              onChange={(e) => setEditForm({ ...editForm, creditLimit: parseFloat(e.target.value) || 0 })}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">₺</InputAdornment>,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>İptal</Button>
          <Button onClick={handleSaveEdit} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Kart Sil</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{selectedCard?.cardName}</strong> kartını silmek istediğinize emin misiniz?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>Bu işlem geri alınamaz!</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>İptal</Button>
          <Button onClick={handleDeleteCard} color="error" variant="contained">Sil</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}