'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { useTabStore } from '@/stores/tabStore';
import {
  Add,
  Receipt,
  Download,
  RefreshOutlined,
  ArrowUpward,
  FilterList,
  Search,
  Visibility,
  Delete,
  MoreHoriz,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Stack,
  LinearProgress,
  MenuItem,
  Menu,
  ListItemIcon,
  Paper,
} from '@mui/material';
import { GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import InvoiceDataGrid from '@/components/Fatura/InvoiceDataGrid';
import { StandardCard, StandardPage } from '@/components/common';
import MainLayout from '@/components/Layout/MainLayout';

interface Payment {
  id: string;
  invoice: {
    id: string;
    invoiceNo: string;
    account: { title: string };
  };
  paymentType: 'HAVALE' | 'NAKIT' | 'KREDI_KARTI' | 'CEK' | 'SENET';
  bank?: { name: string };
  date: string;
  dueDate: string;
  amount: number;
  notes?: string;
  reference?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

interface PaymentStats {
  toplamOdeme: number;
  buAyOdeme: number;
  bekleyenOdeme: number;
}

const paymentTypeConfig: Record<string, { label: string; color: any }> = {
  HAVALE: { label: 'Havale/EFT', color: 'info' },
  NAKIT: { label: 'Nakit', color: 'success' },
  KREDI_KARTI: { label: 'Kredi Kartı', color: 'primary' },
  CEK: { label: 'Çek', color: 'warning' },
  SENET: { label: 'Senet', color: 'default' },
};

const statusConfig: Record<string, { label: string; color: any }> = {
  PENDING: { label: 'Beklemede', color: 'warning' },
  COMPLETED: { label: 'Tamamlandı', color: 'success' },
  CANCELLED: { label: 'İptal', color: 'error' },
};

export default function PurchasePaymentsPage() {
  const { addTab, setActiveTab } = useTabStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'date', sort: 'desc' }]);
  const [rowCount, setRowCount] = useState(0);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDurum, setFilterDurum] = useState<string[]>([]);

  useEffect(() => {
    addTab({ id: 'payments-purchase', label: 'Satın Alma Ödemeleri', path: '/payments/purchase' });
  }, [addTab]);

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [paginationModel, sortModel, filterStartDate, filterEndDate, filterDurum]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        type: 'PURCHASE',
        search: searchTerm,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: sortModel[0]?.field || 'date',
        sortOrder: sortModel[0]?.sort || 'desc',
      };
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');

      const response = await axios.get('/payments', { params });
      setPayments(response.data?.data || []);
      setRowCount(response.data?.meta?.total || 0);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Ödemeler yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params: Record<string, any> = { type: 'PURCHASE' };
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');

      const response = await axios.get('/payments/stats', { params });
      setStats(response.data);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDelete = async () => {
    if (!selectedPayment) return;
    try {
      await axios.delete(`/payments/${selectedPayment.id}`);
      showSnackbar('Ödeme başarıyla silindi', 'success');
      setOpenDelete(false);
      fetchPayments();
      fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Silme işlemi başarısız', 'error');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'invoice.invoiceNo',
      headerName: 'Fatura No',
      width: 150,
      valueGetter: (_v, row: Payment) => row.invoice?.invoiceNo || '',
      renderCell: (params) => <Typography variant="body2" fontWeight="bold">{params.value}</Typography>
    },
    {
      field: 'date',
      headerName: 'Ödeme Tarihi',
      width: 120,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: 'dueDate',
      headerName: 'Vade Tarihi',
      width: 120,
      valueFormatter: (value) => value ? formatDate(value) : '-',
    },
    {
      field: 'account',
      headerName: 'Cari',
      flex: 1,
      minWidth: 200,
      valueGetter: (_v, row: Payment) => row.invoice?.account?.title || '',
      renderCell: (params) => <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
    },
    {
      field: 'paymentType',
      headerName: 'Ödeme Tipi',
      width: 130,
      renderCell: (params) => {
        const config = paymentTypeConfig[params.value] || { label: params.value, color: 'default' };
        return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px' }} />;
      }
    },
    {
      field: 'amount',
      headerName: 'Tutar',
      width: 140,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
          <ArrowUpward sx={{ fontSize: 14, color: 'var(--chart-2)' }} />
          <Typography variant="body2" fontWeight="700" sx={{ color: 'var(--chart-2)' }}>
            {formatCurrency(params.value)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Durum',
      width: 130,
      renderCell: (params) => {
        const config = statusConfig[params.value] || { label: params.value, color: 'default' };
        return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px' }} />;
      }
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const row = params.row as Payment;

        const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        const menuActions = [
          {
            id: 'view',
            label: 'Detayları Görüntüle',
            icon: <Visibility fontSize="small" />,
            onClick: () => { handleClose(); /* TODO: Implement view */ },
            disabled: false,
          },
          {
            id: 'delete',
            label: 'Sil',
            icon: <Delete fontSize="small" sx={{ color: 'var(--destructive)' }} />,
            onClick: () => { handleClose(); setSelectedPayment(row); setOpenDelete(true); },
            disabled: row.status === 'COMPLETED',
          },
        ];

        return (
          <>
            <IconButton
              size="small"
              onClick={handleToggle}
              sx={{
                bgcolor: open ? 'var(--secondary)' : 'transparent',
                color: open ? 'var(--secondary-foreground)' : 'text.secondary',
                '&:hover': {
                  bgcolor: 'var(--secondary)',
                  color: 'var(--secondary-foreground)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <MoreHoriz fontSize="small" />
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
                  borderRadius: 3,
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  bgcolor: 'var(--muted)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <Typography variant="body2" fontWeight="bold">{row.invoice?.invoiceNo}</Typography>
              </Box>
              <Box sx={{ px: 1.5, py: 1 }}>
                {menuActions.map((action) => (
                  <MenuItem
                    key={action.id}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      my: 0.25,
                      '&:hover': { bgcolor: 'var(--secondary)' },
                      '&.Mui-disabled': { opacity: 0.5 },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {action.icon}
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {action.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>
            </Menu>
          </>
        );
      },
    },
  ], []);

  const pageTotal = useMemo(() => payments.reduce((sum, p) => sum + (p.amount || 0), 0), [payments]);

  return (
    <StandardPage maxWidth={false}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-2) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt sx={{ color: 'var(--chart-2)', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight="700" color="text.primary">
            Satın Alma Ödemeleri
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<Add />}
          onClick={() => {
            addTab({ id: 'payment-purchase-yeni', label: 'Yeni Ödeme', path: '/payments/purchase/yeni' });
            setActiveTab('payment-purchase-yeni');
            router.push('/payments/purchase/yeni');
          }}
          sx={{
            bgcolor: 'var(--chart-2)',
            fontWeight: 600,
            fontSize: '0.8rem',
            px: 1.5,
            py: 0.75,
            boxShadow: 'none',
            '&:hover': { bgcolor: 'color-mix(in srgb, var(--chart-2) 85%, black)' },
          }}
        >
          Yeni Ödeme
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2, height: 3 }} color="secondary" />}

      {/* Summary Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'color-mix(in srgb, var(--chart-2) 10%, transparent)', border: '1px solid var(--chart-2)', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Toplam Ödeme</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--chart-2)' }}>{formatCurrency(stats.toplamOdeme || 0)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'color-mix(in srgb, var(--chart-3) 10%, transparent)', border: '1px solid var(--chart-3)', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Bu Ay Ödeme</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--chart-3)' }}>{formatCurrency(stats.buAyOdeme || 0)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'color-mix(in srgb, var(--destructive) 10%, transparent)', border: '1px solid var(--destructive)', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Bekleyen Ödeme</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--destructive)' }}>{formatCurrency(stats.bekleyenOdeme || 0)}</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Data Grid Card */}
      <StandardCard padding={0} sx={{ boxShadow: 'none', overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'var(--card)' }}>
          <TextField
            size="small"
            placeholder="Ödeme Ara (Fatura No, Cari vb.)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
            }}
          />

          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
            <Tooltip title="Filtreler">
              <IconButton size="small" onClick={() => setShowFilters(!showFilters)} color={showFilters ? 'secondary' : 'default'}>
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Yenile">
              <IconButton size="small" onClick={fetchPayments}>
                <RefreshOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ p: 2, bgcolor: 'var(--muted)', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="Başlangıç Tarihi"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="Bitiş Tarihi"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Button variant="outlined" fullWidth onClick={() => { setFilterStartDate(''); setFilterEndDate(''); setFilterDurum([]); }}>
                  Filtreleri Temizle
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* Row Count Display */}
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Toplam <b>{rowCount}</b> ödeme listeleniyor
          </Typography>
        </Box>

        {/* DataGrid */}
        <InvoiceDataGrid
          rows={payments}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          checkboxSelection={false}
          height={700}
        />

        {/* Footer Summary */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Bu sayfadaki toplam <b>Tutar</b>:
          </Typography>
          <Typography variant="body2" fontWeight={800} sx={{ color: 'var(--chart-2)' }}>
            {formatCurrency(pageTotal)}
          </Typography>
        </Box>
      </StandardCard>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Ödeme Sil</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{selectedPayment?.invoice?.invoiceNo}</strong> faturasına ait {formatCurrency(selectedPayment?.amount || 0)} tutarındaki ödemeyi silmek istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Bu işlem geri alınamaz!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>İptal</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}
