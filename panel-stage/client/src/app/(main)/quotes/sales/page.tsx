'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import { Add, Search, Visibility, Edit, Delete, MoreVert, ShoppingCart, Print as PrintIcon } from '@mui/icons-material';
import MainLayout from '@/components/Layout/MainLayout';
import axios from '@/lib/axios';
import { useTabStore } from '@/stores/tabStore';
import { useRouter } from 'next/navigation';

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
}

interface Quote {
  id: string;
  quoteNo: string;
  quoteType: 'SALE' | 'PURCHASE';
  date: string;
  validUntil: string | null;
  account: Account;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  status: 'OFFERED' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_ORDER';
  discount?: number;
  notes?: string;
  orderId?: string | null;
}

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  OFFERED: 'default',
  APPROVED: 'info',
  REJECTED: 'error',
  CONVERTED_TO_ORDER: 'success',
};

const statusTexts: Record<string, string> = {
  OFFERED: 'Teklif',
  APPROVED: 'Onaylandı',
  REJECTED: 'Reddedildi',
  CONVERTED_TO_ORDER: 'Siparişe Dönüştü',
};

export default function SatisTeklifleriPage() {
  const { addTab } = useTabStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OFFERED' | 'APPROVED' | 'REJECTED' | 'CONVERTED_TO_ORDER'>('ALL');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    addTab({
      id: 'quotes-sales',
      label: 'Satış Teklifleri',
      path: '/quotes/sales',
    });
  }, [addTab]);

  useEffect(() => {
    fetchQuotes();
  }, [searchTerm]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const params: any = {
        quoteType: 'SALE',
      };
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const response = await axios.get('/quotes', { params });
      setQuotes(response.data.data || []);
    } catch (error: any) {
      console.error('Teklif yükleme hatası:', error);
      if (error.response?.status === 404) {
        setQuotes([]);
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Teklifler yüklenirken hata oluştu';
        showSnackbar(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, quote: Quote) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuote(quote);
  };

  const handleMenuClose = (event?: {}, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    setAnchorEl(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedQuote) return;

    try {
      await axios.put(`/quotes/${selectedQuote.id}/status`, { status: newStatus });
      showSnackbar(`Teklif durumu "${statusTexts[newStatus]}" olarak güncellendi`, 'success');
      fetchQuotes();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Durum değiştirilirken hata oluştu', 'error');
    } finally {
      handleMenuClose();
    }
  };

  const handleConvertToSiparis = async () => {
    if (!selectedQuote) return;

    if (!confirm('Bu teklifi siparişe dönüştürmek istediğinizden emin misiniz?')) {
      handleMenuClose();
      return;
    }

    try {
      const response = await axios.post(`/quotes/${selectedQuote.id}/convert-to-order`);
      showSnackbar('Teklif başarıyla siparişe dönüştürüldü', 'success');
      setTimeout(() => {
        router.push(`/order/sales/edit/${response.data.orderId}`);
      }, 1500);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Teklif siparişe dönüştürülürken hata oluştu', 'error');
    } finally {
      handleMenuClose();
    }
  };



  const handlePrint = (quote: Quote) => {
    router.push(`/quotes/sales/print/${quote.id}`);
  };

  const handleDelete = async () => {
    if (!selectedQuote) return;

    if (!confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
      handleMenuClose();
      return;
    }

    try {
      await axios.delete(`/quotes/${selectedQuote.id}`);
      showSnackbar('Teklif başarıyla silindi', 'success');
      fetchQuotes();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Teklif silinirken hata oluştu', 'error');
    } finally {
      handleMenuClose();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <MainLayout>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, overflowX: 'auto', width: '100%', maxWidth: '100vw' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
          gap: { xs: 2, sm: 0 },
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}>
              Satış Teklifleri
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Müşterilere sunulan teklifleri yönetin
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/quotes/sales/yeni')}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Yeni Teklif
          </Button>
        </Box>

        <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 2 }}>
          <TextField
            id="satis-teklif-search"
            fullWidth
            placeholder="Teklif No, Cari Unvan veya Cari Kodu ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
            <Chip
              label="Tümü"
              color={statusFilter === 'ALL' ? 'primary' : 'default'}
              onClick={() => setStatusFilter('ALL')}
              size="small"
            />
            <Chip label="Teklif" color={statusFilter === 'OFFERED' ? 'primary' : 'default'} onClick={() => setStatusFilter('OFFERED')} size="small" />
            <Chip label="Onaylandı" color={statusFilter === 'APPROVED' ? 'primary' : 'default'} onClick={() => setStatusFilter('APPROVED')} size="small" />
            <Chip label="Reddedildi" color={statusFilter === 'REJECTED' ? 'primary' : 'default'} onClick={() => setStatusFilter('REJECTED')} size="small" />
            <Chip
              label="Siparişe Dönüştü"
              color={statusFilter === 'CONVERTED_TO_ORDER' ? 'primary' : 'default'}
              onClick={() => setStatusFilter('CONVERTED_TO_ORDER')}
              size="small"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            />
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
            }}
          >
            <Table sx={{ minWidth: { xs: '800px', sm: 'auto' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}>Teklif No</TableCell>
                  <TableCell sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    whiteSpace: 'nowrap',
                  }}>Tarih</TableCell>
                  <TableCell sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    whiteSpace: 'nowrap',
                    display: { xs: 'none', md: 'table-cell' },
                  }}>Geçerlilik Tarihi</TableCell>
                  <TableCell sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    whiteSpace: 'nowrap',
                  }}>Cari</TableCell>
                  <TableCell align="right" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    whiteSpace: 'nowrap',
                  }}>Tutar</TableCell>
                  <TableCell align="right" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    whiteSpace: 'nowrap',
                    display: { xs: 'none', lg: 'table-cell' },
                  }}>KDV</TableCell>
                  <TableCell align="right" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}>Genel Toplam</TableCell>
                  <TableCell sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    whiteSpace: 'nowrap',
                  }}>Durum</TableCell>
                  <TableCell align="center" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    whiteSpace: 'nowrap',
                  }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quotes.filter(t => statusFilter === 'ALL' ? true : t.status === statusFilter).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Teklif bulunamadı</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  quotes
                    .filter(t => statusFilter === 'ALL' ? true : t.status === statusFilter)
                    .map((quote) => (
                      <TableRow key={quote.id} hover>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Typography variant="body2" fontWeight="600">
                            {quote.quoteNo}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {formatDate(quote.date)}
                        </TableCell>
                        <TableCell sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'none', md: 'table-cell' },
                        }}>
                          {quote.validUntil ? formatDate(quote.validUntil) : '-'}
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {quote.account.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                            {quote.account.code}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {formatCurrency(quote.totalAmount)}
                        </TableCell>
                        <TableCell align="right" sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          display: { xs: 'none', lg: 'table-cell' },
                        }}>
                          {formatCurrency(quote.vatAmount)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {formatCurrency(quote.grandTotal)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <Chip
                            label={statusTexts[quote.status]}
                            color={statusColors[quote.status]}
                            size="small"
                            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/quotes/sales/duzenle/${quote.id}`)}
                            disabled={quote.status === 'CONVERTED_TO_ORDER' || quote.status === 'REJECTED'}
                            sx={{ p: { xs: 0.5, sm: 1 } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handlePrint(quote)}
                            color="primary"
                            sx={{ p: { xs: 0.5, sm: 1 } }}
                          >
                            <PrintIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, quote)}
                            sx={{ p: { xs: 0.5, sm: 1 } }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          disableAutoFocusItem
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {selectedQuote && selectedQuote.status !== 'CONVERTED_TO_ORDER' && (
            [
              selectedQuote.status === 'OFFERED' && (
                <MenuItem
                  key="onaylandi"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange('APPROVED');
                  }}
                >
                  Onaylandı Olarak İşaretle
                </MenuItem>
              ),
              selectedQuote.status === 'OFFERED' && (
                <MenuItem
                  key="reddedildi"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange('REJECTED');
                  }}
                >
                  Reddedildi Olarak İşaretle
                </MenuItem>
              ),
              selectedQuote.status === 'OFFERED' && (
                <MenuItem
                  key="siparise-donustur-teklif"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConvertToSiparis();
                  }}
                >
                  <ShoppingCart sx={{ mr: 1 }} fontSize="small" />
                  Siparişe Dönüştür
                </MenuItem>
              ),
              selectedQuote.status === 'APPROVED' && (
                <MenuItem
                  key="siparise-donustur-onaylandi"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConvertToSiparis();
                  }}
                >
                  <ShoppingCart sx={{ mr: 1 }} fontSize="small" />
                  Siparişe Dönüştür
                </MenuItem>
              ),
            ].filter(Boolean)
          )}
          {selectedQuote && selectedQuote.orderId && (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClose();
                router.push(`/order/sales/edit/${selectedQuote.orderId}`);
              }}
            >
              <Visibility sx={{ mr: 1 }} fontSize="small" />
              İlgili Siparişi Görüntüle
            </MenuItem>
          )}
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Sil
          </MenuItem>
        </Menu>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
}

