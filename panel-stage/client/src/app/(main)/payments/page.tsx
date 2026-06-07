'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefundIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';

interface Payment {
  id: string;
  amount: string | number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'OTHER';
  iyzicoPaymentId?: string;
  subscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentDetail extends Payment {
  metadata?: Record<string, any>;
}

export default function PaymentsPage() {
  const theme = useTheme();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetail | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Ödemeler yüklenemedi:', error);
      setSnackbar({ open: true, message: 'Ödemeler yüklenemedi', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleViewDetail = async (id: string) => {
    try {
      const response = await axios.get(`/payments/${id}`);
      setSelectedPayment(response.data);
      setDetailDialogOpen(true);
    } catch (error) {
      setSnackbar({ open: true, message: 'Ödeme detayı yüklenemedi', severity: 'error' });
    }
  };

  const handleRefund = async (id: string) => {
    if (!confirm('Bu ödemeyi iade etmek istediğinize emin misiniz?')) return;

    try {
      await axios.post(`/payments/${id}/refund`);
      setSnackbar({ open: true, message: 'İade işlemi başlatıldı', severity: 'success' });
      setRefundDialogOpen(false);
      fetchPayments();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'İade başarısız', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ödemeyi silmek istediğinize emin misiniz?')) return;

    try {
      await axios.delete(`/payments/${id}`);
      setSnackbar({ open: true, message: 'Ödeme silindi', severity: 'success' });
      fetchPayments();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Silme başarısız', severity: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      case 'REFUNDED': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Tamamlandı';
      case 'PENDING': return 'Bekliyor';
      case 'FAILED': return 'Başarısız';
      case 'REFUNDED': return 'İade Edildi';
      default: return status;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD': return <CardIcon fontSize="small" />;
      case 'BANK_TRANSFER': return <BankIcon fontSize="small" />;
      case 'CASH': return <MoneyIcon fontSize="small" />;
      default: return <MoneyIcon fontSize="small" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD': return 'Kredi Kartı';
      case 'BANK_TRANSFER': return 'Banka Havalesi';
      case 'CASH': return 'Nakit';
      default: return method;
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = !searchTerm ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.amount).includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          {params.value.slice(0, 8)}...
        </Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'Tutar',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Typography sx={{ fontWeight: 800 }}>
          ₺{Number(params.value).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'paymentMethod',
      headerName: 'Yöntem',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1} alignItems="center">
          {getMethodIcon(params.value)}
          <Typography variant="body2">{getMethodLabel(params.value)}</Typography>
        </Stack>
      ),
    },
    {
      field: 'status',
      headerName: 'Durum',
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={getStatusLabel(params.value)}
          size="small"
          color={getStatusColor(params.value) as any}
          sx={{ fontWeight: 800 }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Tarih',
      width: 160,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString('tr-TR')} {new Date(params.value).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 160,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="Detay">
            <IconButton size="small" onClick={() => handleViewDetail(params.row.id)}>
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {params.row.status === 'COMPLETED' && (
            <Tooltip title="İade">
              <IconButton size="small" color="warning" onClick={() => { setSelectedPayment(params.row); setRefundDialogOpen(true); }}>
                <RefundIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Sil">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <StandardPage
      title="Ödemeler"
      breadcrumbs={[{ label: 'Ödemeler' }]}
      headerActions={
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={fetchPayments}
          sx={{ fontWeight: 700 }}
        >
          Yenile
        </Button>
      }
    >
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <TextField
            size="small"
            placeholder="ID veya tutar ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Durum</InputLabel>
            <Select
              value={statusFilter}
              label="Durum"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tümü</MenuItem>
              <MenuItem value="COMPLETED">Tamamlandı</MenuItem>
              <MenuItem value="PENDING">Bekliyor</MenuItem>
              <MenuItem value="FAILED">Başarısız</MenuItem>
              <MenuItem value="REFUNDED">İade Edildi</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
        <Paper
          variant="outlined"
          sx={{
            flex: '1 1 150px',
            p: 2,
            borderRadius: 3,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.success.main, 0.05),
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Tamamlanan
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
            {payments.filter(p => p.status === 'COMPLETED').length}
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            flex: '1 1 150px',
            p: 2,
            borderRadius: 3,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.warning.main, 0.05),
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Bekleyen
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
            {payments.filter(p => p.status === 'PENDING').length}
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            flex: '1 1 150px',
            p: 2,
            borderRadius: 3,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.error.main, 0.05),
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            İade Edilen
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
            {payments.filter(p => p.status === 'REFUNDED').length}
          </Typography>
        </Paper>
      </Stack>

      <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredPayments}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
            }}
          />
        </Box>
      </Paper>

      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Ödeme Detayı</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Ödeme ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {selectedPayment.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Tarih</Typography>
                  <Typography variant="body2">
                    {new Date(selectedPayment.createdAt).toLocaleString('tr-TR')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Tutar</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    ₺{Number(selectedPayment.amount).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Durum</Typography>
                  <Chip
                    label={getStatusLabel(selectedPayment.status)}
                    size="small"
                    color={getStatusColor(selectedPayment.status) as any}
                    sx={{ fontWeight: 800 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Yöntem</Typography>
                  <Typography variant="body2">
                    {getMethodLabel(selectedPayment.paymentMethod)}
                  </Typography>
                </Box>
                {selectedPayment.iyzicoPaymentId && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">İyzico ID</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {selectedPayment.iyzicoPaymentId}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDetailDialogOpen(false)} sx={{ fontWeight: 700 }}>Kapat</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={refundDialogOpen} onClose={() => setRefundDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>İade Onayı</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bu ödeme için iade işlemi başlatılacaktır. Bu işlem geri alınamaz.
          </Alert>
          <Typography variant="body2">
            Ödeme ID: <strong>{selectedPayment?.id}</strong>
          </Typography>
          <Typography variant="body2">
            Tutar: <strong>₺{Number(selectedPayment?.amount).toLocaleString()}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRefundDialogOpen(false)} sx={{ fontWeight: 700 }}>İptal</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => selectedPayment && handleRefund(selectedPayment.id)}
            sx={{ fontWeight: 800 }}
          >
            İade Et
          </Button>
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
