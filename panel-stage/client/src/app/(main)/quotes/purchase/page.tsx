'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { useTabStore } from '@/stores/tabStore';
import {
  Add,
  Assessment,
  Close,
  Delete,
  Edit,
  Print,
  Search,
  Visibility,
  Download,
  RefreshOutlined,
  FilterList,
  MoreHoriz,
  ShoppingCart,
  CheckCircle,
  Cancel,
  Warning,
  History,
  CalendarMonth,
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  LinearProgress,
  Avatar,
  alpha,
  useTheme,
  InputAdornment,
  Select,
} from '@mui/material';
import { StandardCard, StandardPage } from '@/components/common';

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
}

interface QuoteItem {
  id: string;
  productId: string;
  product?: { id: string; name: string; code: string };
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discountRate?: number;
  discountAmount?: number;
  amount?: number;
  vatAmount?: number;
}

interface Quote {
  id: string;
  quoteNo: string;
  quoteType: 'SALE' | 'PURCHASE';
  date: string;
  validUntil: string | null;
  account: { id: string; code: string; name: string };
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  status: 'OFFERED' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_ORDER';
  discount?: number;
  notes?: string;
  orderId?: string | null;
  items?: QuoteItem[];
  createdByUser?: { fullName?: string; username?: string };
  createdAt?: string;
}

interface QuoteStats {
  totalQuotes: number;
  offeredCount: number;
  approvedCount: number;
  rejectedCount: number;
  convertedCount: number;
  totalValue: number;
  averageValue: number;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactElement }> = {
  OFFERED: { label: 'Teklif', color: '#6b7280', bgColor: 'color-mix(in srgb, #6b7280 12%, transparent)', icon: <Assignment sx={{ fontSize: 14 }} /> },
  APPROVED: { label: 'Onaylandı', color: '#2563eb', bgColor: 'color-mix(in srgb, #2563eb 12%, transparent)', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  REJECTED: { label: 'Reddedildi', color: '#dc2626', bgColor: 'color-mix(in srgb, #dc2626 12%, transparent)', icon: <Cancel sx={{ fontSize: 14 }} /> },
  CONVERTED_TO_ORDER: { label: 'Siparişe Dönüştü', color: '#059669', bgColor: 'color-mix(in srgb, #059669 12%, transparent)', icon: <ShoppingCart sx={{ fontSize: 14 }} /> },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || {
    label: status,
    color: '#4b5563',
    bgColor: 'var(--muted)',
    icon: <History sx={{ fontSize: 14 }} />,
  };
  return (
    <Chip
      label={config.label}
      icon={config.icon}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: '0.7rem',
        color: config.color,
        bgcolor: config.bgColor,
        border: '1px solid',
        borderColor: `${config.color}25`,
        borderRadius: '6px',
        '& .MuiChip-icon': { color: 'inherit', ml: 0.5 },
      }}
    />
  );
}

export default function SatinAlmaTeklifleriPage() {
  const theme = useTheme();
  const { addTab } = useTabStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<QuoteStats | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  // Dialogs & Actions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  useEffect(() => {
    addTab({ id: 'quotes-purchase', label: 'Satın Alma Teklifleri', path: '/quotes/purchase' });
  }, [addTab]);

  useEffect(() => {
    fetchQuotes();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const params: any = { quoteType: 'PURCHASE' };
      if (searchTerm && searchTerm.trim()) params.search = searchTerm.trim();
      if (statusFilter) params.status = statusFilter;

      const response = await axios.get('/quotes', { params });
      setQuotes(response.data?.data || []);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        showSnackbar(error.response?.data?.message || 'Teklifler yüklenirken hata oluştu', 'error');
      }
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/quotes/stats', { params: { quoteType: 'PURCHASE' } });
      setStats(response.data);
    } catch (error: any) {
      console.error('Stats hata:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, quote: Quote) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuote(quote);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedQuote) return;
    try {
      await axios.put(`/quotes/${selectedQuote.id}/status`, { status: newStatus });
      showSnackbar(`Teklif durumu "${statusConfig[newStatus]?.label}" olarak güncellendi`, 'success');
      fetchQuotes();
      fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Durum değiştirilirken hata oluştu', 'error');
    } finally {
      handleMenuClose();
      setOpenStatus(false);
    }
  };

  const handleConvertToOrder = async () => {
    if (!selectedQuote) return;
    if (!confirm('Bu teklifi siparişe dönüştürmek istediğinizden emin misiniz?')) {
      handleMenuClose();
      return;
    }
    try {
      const response = await axios.post(`/quotes/${selectedQuote.id}/convert-to-order`);
      showSnackbar('Teklif başarıyla siparişe dönüştürüldü', 'success');
      setTimeout(() => { router.push(`/purchase-orders/duzenle/${response.data.orderId}`); }, 1500);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Dönüştürme başarısız', 'error');
    } finally {
      handleMenuClose();
    }
  };

  const handleDelete = async () => {
    if (!selectedQuote) return;
    try {
      await axios.delete(`/quotes/${selectedQuote.id}`);
      showSnackbar('Teklif başarıyla silindi', 'success');
      fetchQuotes();
      fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Silme başarısız', 'error');
    } finally {
      handleMenuClose();
      setOpenDelete(false);
    }
  };

  const handleView = async () => {
    if (!selectedQuote) return;
    try {
      const response = await axios.get(`/quotes/${selectedQuote.id}`);
      setSelectedQuote(response.data);
      setOpenView(true);
    } catch (error: any) {
      showSnackbar('Teklif detayı yüklenirken hata oluştu', 'error');
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (!selectedQuote) return;
    handleMenuClose();
    router.push(`/quotes/purchase/duzenle/${selectedQuote.id}`);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR');
  const isExpired = (validUntil: string | null) => validUntil ? new Date(validUntil) < new Date() : false;

  return (
    <StandardPage maxWidth={false}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-4) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Assignment sx={{ color: 'var(--chart-4)', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="700" color="text.primary">Satın Alma Teklifleri</Typography>
            <Typography variant="caption" color="text.secondary">Tedarikçilerden gelen teklifleri yönet</Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<Download />}
            onClick={() => showSnackbar('Excel aktarımı yakında eklenecek', 'info')}
            sx={{ fontWeight: 600, fontSize: '0.8rem', boxShadow: 'none' }}>
            Excel
          </Button>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={() => router.push('/quotes/purchase/yeni')}
            sx={{ bgcolor: 'var(--chart-2)', '&:hover': { bgcolor: 'color-mix(in srgb, var(--chart-2) 85%, var(--background))' }, fontWeight: 600, fontSize: '0.8rem' }}>
            Yeni Teklif
          </Button>
        </Stack>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1, height: 3 }} color="secondary" />}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StandardCard padding={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-4) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Assignment sx={{ color: 'var(--chart-4)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Toplam Teklif</Typography>
                <Typography variant="h6" fontWeight={800}>{stats?.totalQuotes ?? '-'}</Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StandardCard padding={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, #6b7280 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <History sx={{ color: '#6b7280', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Bekleyen</Typography>
                <Typography variant="h6" fontWeight={800}>{stats?.offeredCount ?? '-'}</Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StandardCard padding={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-3) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle sx={{ color: 'var(--chart-3)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Onaylanan</Typography>
                <Typography variant="h6" fontWeight={800}>{stats?.approvedCount ?? '-'}</Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StandardCard padding={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-2) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart sx={{ color: 'var(--chart-2)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Siparişe Dönüşen</Typography>
                <Typography variant="h6" fontWeight={800}>{stats?.convertedCount ?? '-'}</Typography>
              </Box>
            </Stack>
          </StandardCard>
        </Grid>
      </Grid>

      <StandardCard padding={0} sx={{ boxShadow: 'none', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'var(--card)' }}>
          <TextField size="small" placeholder="Teklif No, Tedarikçi Ara..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
              endAdornment: searchTerm && (<IconButton size="small" onClick={() => setSearchTerm('')}><Close fontSize="small" /></IconButton>),
            }} />

          <Stack direction="row" spacing={1}>
            {['', 'OFFERED', 'APPROVED', 'REJECTED', 'CONVERTED_TO_ORDER'].map((status) => (
              <Chip
                key={status}
                label={status === '' ? 'Tümü' : statusConfig[status]?.label || status}
                variant={statusFilter === status ? 'filled' : 'outlined'}
                color={statusFilter === status ? 'secondary' : 'default'}
                onClick={() => setStatusFilter(status)}
                size="small"
                sx={{ cursor: 'pointer', fontWeight: 500 }}
              />
            ))}
          </Stack>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
            <Tooltip title="Yenile">
              <IconButton size="small" onClick={() => { fetchQuotes(); fetchStats(); }}>
                <RefreshOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: 700 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Teklif No</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Geçerlilik</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tedarikçi</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Tutar</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>KDV</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Genel Toplam</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}><CircularProgress size={24} /></TableCell>
                  </TableRow>
                ) : quotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Teklif bulunamadı</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  quotes.map((quote) => (
                    <TableRow key={quote.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>{quote.quoteNo}</Typography>
                      </TableCell>
                      <TableCell><Typography variant="body2">{formatDate(quote.date)}</Typography></TableCell>
                      <TableCell>
                        {quote.validUntil ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {isExpired(quote.validUntil) && (
                              <Warning sx={{ fontSize: 14, color: 'error.main' }} />
                            )}
                            <Typography
                              variant="body2"
                              color={isExpired(quote.validUntil) ? 'error.main' : 'text.primary'}
                              fontWeight={isExpired(quote.validUntil) ? 700 : 400}
                            >
                              {formatDate(quote.validUntil)}
                            </Typography>
                          </Box>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>{quote.account?.name || '-'}</Typography>
                        <Typography variant="caption" color="text.secondary">{quote.account?.code}</Typography>
                      </TableCell>
                      <TableCell align="right"><Typography variant="body2">{formatCurrency(quote.totalAmount)}</Typography></TableCell>
                      <TableCell align="right"><Typography variant="body2">{formatCurrency(quote.taxAmount)}</Typography></TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700} color="var(--chart-2)">
                          {formatCurrency(quote.grandTotal)}
                        </Typography>
                      </TableCell>
                      <TableCell><StatusBadge status={quote.status} /></TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Tooltip title="Detayları Görüntüle" arrow>
                            <IconButton size="small" onClick={() => { setSelectedQuote(quote); handleView(); }}
                              sx={{ bgcolor: alpha('#1976d2', 0.08), '&:hover': { bgcolor: alpha('#1976d2', 0.2) } }}>
                              <Visibility sx={{ fontSize: 16, color: '#1976d2' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Düzenle" arrow>
                            <IconButton size="small"
                              onClick={() => { setSelectedQuote(quote); handleEdit(); }}
                              disabled={quote.status === 'CONVERTED_TO_ORDER' || quote.status === 'REJECTED'}
                              sx={{ bgcolor: alpha('#059669', 0.08), '&:hover': { bgcolor: alpha('#059669', 0.2) } }}>
                              <Edit sx={{ fontSize: 16, color: '#059669' }} />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, quote)}
                            sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.12) } }}>
                            <MoreHoriz sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </StandardCard>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ elevation: 8, sx: { minWidth: 240, borderRadius: 3, border: '1px solid', borderColor: 'divider' } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {selectedQuote && (
          <Box sx={{ px: 2, py: 1.5, bgcolor: 'var(--muted)', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Teklif İşlemleri
            </Typography>
            <Typography variant="body2" fontWeight={700}>{selectedQuote.quoteNo}</Typography>
          </Box>
        )}
        <Box sx={{ px: 1.5, py: 1 }}>
          <MenuItem onClick={handleView} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
            <ListItemText primary="Detayları Görüntüle" />
          </MenuItem>
          {selectedQuote && selectedQuote.status !== 'CONVERTED_TO_ORDER' && selectedQuote.status !== 'REJECTED' && (
            <MenuItem onClick={handleEdit} sx={{ borderRadius: 2, mb: 0.5 }}>
              <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
              <ListItemText primary="Düzenle" />
            </MenuItem>
          )}
          {selectedQuote && (selectedQuote.status === 'OFFERED' || selectedQuote.status === 'APPROVED') && (
            <MenuItem onClick={() => { handleMenuClose(); setOpenStatus(true); }} sx={{ borderRadius: 2, mb: 0.5 }}>
              <ListItemIcon><CheckCircle fontSize="small" /></ListItemIcon>
              <ListItemText primary="Durumu Güncelle" />
            </MenuItem>
          )}
          {selectedQuote && (selectedQuote.status === 'OFFERED' || selectedQuote.status === 'APPROVED') && (
            <MenuItem onClick={handleConvertToOrder} sx={{ borderRadius: 2, mb: 0.5 }}>
              <ListItemIcon><ShoppingCart fontSize="small" /></ListItemIcon>
              <ListItemText primary="Siparişe Dönüştür" />
            </MenuItem>
          )}
          {selectedQuote && selectedQuote.orderId && (
            <MenuItem onClick={() => { handleMenuClose(); router.push(`/purchase-orders/duzenle/${selectedQuote.orderId}`); }} sx={{ borderRadius: 2, mb: 0.5 }}>
              <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
              <ListItemText primary="İlgili Siparişi Görüntüle" />
            </MenuItem>
          )}
          <Divider sx={{ my: 1 }} />
          {selectedQuote && selectedQuote.status !== 'CONVERTED_TO_ORDER' && (
            <MenuItem onClick={() => { handleMenuClose(); setOpenDelete(true); }} sx={{ borderRadius: 2, color: 'error.main' }}>
              <ListItemIcon><Delete fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
              <ListItemText primary="Sil" />
            </MenuItem>
          )}
        </Box>
      </Menu>

      {/* Status Change Dialog */}
      <Dialog open={openStatus} onClose={() => setOpenStatus(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ fontWeight: 'bold' }}>
          Durum Güncelle
          <IconButton size="small" onClick={() => setOpenStatus(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedQuote && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>{selectedQuote.quoteNo}</strong> numaralı teklifin durumunu güncelleyin:
              </Typography>
              <Stack spacing={1}>
                {['OFFERED', 'APPROVED', 'REJECTED'].map((status) => (
                  <Button
                    key={status}
                    variant={selectedQuote.status === status ? 'contained' : 'outlined'}
                    color={status === 'REJECTED' ? 'error' : 'primary'}
                    fullWidth
                    startIcon={statusConfig[status].icon}
                    onClick={() => handleStatusChange(status)}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {statusConfig[status].label}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Teklif Detayı
          <StatusBadge status={selectedQuote?.status || ''} />
        </DialogTitle>
        <DialogContent dividers>
          {selectedQuote && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary">Teklif No</Typography>
                  <Typography variant="body1" fontWeight={700}>{selectedQuote.quoteNo}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary">Tarih</Typography>
                  <Typography variant="body1" fontWeight={700}>{formatDate(selectedQuote.date)}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary">Geçerlilik</Typography>
                  <Typography variant="body1" fontWeight={700} color={isExpired(selectedQuote.validUntil) ? 'error.main' : 'text.primary'}>
                    {selectedQuote.validUntil ? formatDate(selectedQuote.validUntil) : '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary">Tedarikçi</Typography>
                  <Typography variant="body1" fontWeight={700}>{selectedQuote.account?.name}</Typography>
                </Grid>
              </Grid>

              {selectedQuote.items && selectedQuote.items.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Kalemler</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Ürün</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Kod</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Miktar</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Birim Fiyat</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>KDV %</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Toplam</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedQuote.items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell><Typography variant="body2">{item.product?.name || '-'}</Typography></TableCell>
                            <TableCell><Typography variant="caption">{item.product?.code || '-'}</Typography></TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell align="right">%{item.vatRate}</TableCell>
                            <TableCell align="right" fontWeight={600}>
                              {formatCurrency((Number(item.amount) || 0) + (Number(item.vatAmount) || 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover', display: 'flex', justifyContent: 'flex-end' }}>
                <Stack spacing={1} sx={{ minWidth: 250 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Ara Toplam:</Typography>
                    <Typography variant="body2">{formatCurrency(selectedQuote.totalAmount)}</Typography>
                  </Box>
                  {selectedQuote.discount && selectedQuote.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="error.main">İskonto:</Typography>
                      <Typography variant="body2" color="error.main">-{formatCurrency(selectedQuote.discount)}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">KDV:</Typography>
                    <Typography variant="body2">{formatCurrency(selectedQuote.taxAmount)}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight={800}>Genel Toplam:</Typography>
                    <Typography variant="subtitle1" fontWeight={800} color="var(--chart-2)">
                      {formatCurrency(selectedQuote.grandTotal)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {selectedQuote.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">Not:</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>{selectedQuote.notes}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenView(false)}>Kapat</Button></DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ fontWeight: 'bold' }}>Teklif Sil</DialogTitle>
        <DialogContent>
          <Typography><strong>{selectedQuote?.quoteNo}</strong> numaralı teklifi silmek istediğinizden emin misiniz?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>Bu işlem geri alınamaz!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Vazgeç</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Sil</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StandardPage>
  );
}