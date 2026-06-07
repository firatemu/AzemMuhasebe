'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import axios from '@/lib/axios';
import { useTabStore } from '@/stores/tabStore';
import {
  Add,
  Close,
  Delete,
  Edit,
  Print,
  Search,
  Visibility,
  Cancel,
  Download,
  RefreshOutlined,
  ArrowUpward,
  FilterList,
  ExpandMore,
  MoreVert,
  ContentCopy,
  Receipt,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
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
  Autocomplete,
  Menu,
  MenuItem,
  Paper,
  Select,
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
} from '@mui/material';
import { GridColDef, GridRenderCellParams, GridPaginationModel, GridSortModel, GridFilterModel } from '@mui/x-data-grid';
import KPIHeader from '@/components/Fatura/KPIHeader';
import InvoiceDataGrid from '@/components/Fatura/InvoiceDataGrid';
import StatusBadge from '@/components/Fatura/StatusBadge';
import { StandardCard, StandardPage } from '@/components/common';

interface Cari {
  id: string;
  accountCode: string;
  title: string;
  type: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
}

interface Fatura {
  id: string;
  invoiceNo: string;
  invoiceType: 'SALE' | 'PURCHASE' | 'SALES_RETURN' | 'PURCHASE_RETURN';
  date: string;
  dueDate: string | null;
  account: Cari;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  status: 'DRAFT' | 'PENDING' | 'OPEN' | 'APPROVED' | 'PARTIALLY_PAID' | 'CLOSED' | 'CANCELLED';
  iskonto?: number;
  description?: string;
  items?: any[];
  deliveryNote?: {
    id: string;
    deliveryNoteNo: string;
  };
  createdByUser?: { fullName?: string; username?: string };
  createdAt?: string;
  updatedByUser?: { fullName?: string; username?: string };
  updatedAt?: string;
  logs?: any[];
}

interface ReturnStats {
  monthlyReturns: { totalAmount: number; count: number };
  pendingReturns: { totalAmount: number; count: number };
  approvedReturns: { totalAmount: number; count: number };
}

export default function AlisIadeFaturalariPage() {
  const { addTab, setActiveTab } = useTabStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [faturalar, setFaturalar] = useState<Fatura[]>([]);
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [loading, setLoading] = useState(false);
  const [faturaDurumlari, setFaturaDurumlari] = useState<Record<string, string>>({});

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'createdAt', sort: 'desc' },
  ]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [rowCount, setRowCount] = useState(0);

  // Dialog states
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openIptal, setOpenIptal] = useState(false);
  const [openDurumOnay, setOpenDurumOnay] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [pendingDurum, setPendingDurum] = useState<{ faturaId: string; eskiDurum: string; yeniDurum: string } | null>(null);
  const [irsaliyeIptal, setIrsaliyeIptal] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuFaturaId, setMenuFaturaId] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState<ReturnStats | null>(null);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDurum, setFilterDurum] = useState<string[]>([]);
  const [filterCariId, setFilterCariId] = useState('');

  const fetchFaturalar = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        type: 'PURCHASE_RETURN',
        search: searchTerm,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: sortModel[0]?.field || 'createdAt',
        sortOrder: sortModel[0]?.sort || 'desc',
      };

      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/invoices', { params });
      const faturaData = response.data?.data || [];
      const totalCount = response.data?.meta?.total || response.data?.total || faturaData.length;

      setFaturalar(faturaData);
      setRowCount(totalCount);

      const durumMap: Record<string, string> = {};
      faturaData.forEach((f: Fatura) => { durumMap[f.id] = f.status; });
      setFaturaDurumlari(durumMap);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Faturalar yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
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
      const params: Record<string, any> = { type: 'PURCHASE_RETURN' };
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/invoices/stats', { params });
      setStats(response.data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  useEffect(() => {
    fetchFaturalar();
    fetchStats();
  }, [paginationModel, sortModel, filterModel, filterCariId, filterStartDate, filterEndDate, filterDurum, searchTerm]);

  useEffect(() => {
    fetchCariler();
    addTab({
      id: 'purchase-return-invoice',
      label: 'Alış İade Faturaları',
      path: '/invoice/return/purchase',
    });
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, faturaId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuFaturaId(faturaId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuFaturaId(null);
  };

  const handleExportExcel = async () => {
    try {
      const params: Record<string, string> = { type: 'PURCHASE_RETURN' };
      if (searchTerm) params.search = searchTerm;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/invoices/export/excel', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `alis_iade_faturalar_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSnackbar('Excel dosyası indirildi', 'success');
    } catch (error: any) {
      showSnackbar('Excel aktarımı başarısız', 'error');
    }
  };

  const handleClearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterDurum([]);
    setFilterCariId('');
    setSearchTerm('');
  };

  const handleAdd = () => {
    addTab({
      id: 'purchase-return-invoice-yeni',
      label: 'Yeni Alış İade Faturası',
      path: '/invoice/return/purchase/yeni'
    });
    setActiveTab('purchase-return-invoice-yeni');
    router.push('/invoice/return/purchase/yeni');
  };

  const handleEdit = (row: Fatura) => {
    const tabId = `purchase-return-invoice-edit-${row.id}`;
    addTab({
      id: tabId,
      label: `Düzenle: ${row.invoiceNo}`,
      path: `/invoice/return/purchase/duzenle/${row.id}`,
    });
    setActiveTab(tabId);
    router.push(`/invoice/return/purchase/duzenle/${row.id}`);
  };

  const handleView = (row: Fatura) => {
    openViewDialog(row);
  };

  const handleDelete = async () => {
    try {
      if (selectedFatura) {
        await axios.delete(`/invoices/${selectedFatura.id}`);
        showSnackbar('Fatura başarıyla silindi', 'success');
        setOpenDelete(false);
        fetchFaturalar();
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Silme işlemi başarısız', 'error');
    }
  };

  const openViewDialog = async (fatura: Fatura) => {
    try {
      const response = await axios.get(`/invoices/${fatura.id}`);
      setSelectedFatura(response.data);
      setOpenView(true);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Fatura yüklenirken hata oluştu', 'error');
    }
  };

  const openDeleteDialog = (fatura: Fatura) => { setSelectedFatura(fatura); setOpenDelete(true); };
  const openIptalDialog = (fatura: Fatura) => { setSelectedFatura(fatura); setOpenIptal(true); };

  const handleIptal = async () => {
    try {
      if (selectedFatura) {
        await axios.put(`/invoices/${selectedFatura.id}/cancel`, { deliveryNoteIptal: irsaliyeIptal });
        showSnackbar('İade faturası iptal edildi.', 'success');
        setOpenIptal(false);
        setIrsaliyeIptal(false);
        fetchFaturalar();
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İptal işlemi başarısız', 'error');
    }
  };

  const handleRevertToDraft = async (fatura: Fatura) => {
    try {
      await axios.put(`/invoices/${fatura.id}/status`, { status: 'DRAFT' });
      showSnackbar(`${fatura.invoiceNo} numaralı faturan taslağa çevrildi. Oluşan hareketler geri alındı.`, 'success');
      fetchFaturalar();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Taslağa çevirme işlemi başarısız', 'error');
    }
  };

  const handleDurumChangeRequest = (faturaId: string, eskiDurum: string, yeniDurum: string) => {
    const fatura = faturalar.find(f => f.id === faturaId);
    if (!fatura) return;
    setFaturaDurumlari((prev: Record<string, string>) => ({ ...prev, [faturaId]: yeniDurum }));
    setSelectedFatura(fatura);
    setPendingDurum({ faturaId, eskiDurum, yeniDurum });
    setOpenDurumOnay(true);
  };

  const handleDurumChangeConfirm = async () => {
    if (!pendingDurum) return;
    try {
      await axios.put(`/invoices/${pendingDurum.faturaId}/status`, { status: pendingDurum.yeniDurum });
      showSnackbar('Fatura durumu güncellendi', 'success');
      setOpenDurumOnay(false);
      setPendingDurum(null);
      fetchFaturalar();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Durum değiştirme başarısız', 'error');
      setOpenDurumOnay(false);
      setPendingDurum(null);
      fetchFaturalar();
    }
  };

  const handleDurumChangeCancel = () => {
    if (pendingDurum) {
      setFaturaDurumlari(prev => ({ ...prev, [pendingDurum.faturaId]: pendingDurum.eskiDurum }));
    }
    setOpenDurumOnay(false);
    setPendingDurum(null);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

  const kpiData = useMemo(() => stats ? {
    aylikSatis: { tutar: stats.monthlyReturns?.totalAmount || 0, adet: stats.monthlyReturns?.count || 0 },
    tahsilatBekleyen: { tutar: stats.pendingReturns?.totalAmount || 0, adet: stats.pendingReturns?.count || 0 },
    vadesiGecmis: { tutar: stats.approvedReturns?.totalAmount || 0, adet: stats.approvedReturns?.count || 0 },
  } : {
    aylikSatis: { tutar: 0, adet: 0 },
    tahsilatBekleyen: { tutar: 0, adet: 0 },
    vadesiGecmis: { tutar: 0, adet: 0 },
  }, [stats]);

  const pageGrandTotal = useMemo(() => faturalar.reduce((sum: number, f: Fatura) => sum + (f.grandTotal || 0), 0), [faturalar]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CLOSED': return 'Ödendi';
      case 'APPROVED': return 'Onaylandı';
      case 'OPEN': return 'Açık';
      case 'PENDING': return 'Beklemede';
      case 'DRAFT': return 'Taslak';
      case 'PARTIALLY_PAID': return 'Kısmen Ödendi';
      case 'CANCELLED': return 'İptal Edildi';
      default: return status;
    }
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'invoiceNo',
      headerName: 'Fatura No',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">{params.value}</Typography>
          {(params.row as any).earsiv && <Chip label="E-Arşiv" size="small" color="info" sx={{ height: 20, fontSize: '0.65rem' }} />}
          {(params.row as any).efatura && <Chip label="E-Fatura" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />}
        </Box>
      )
    },
    { field: 'date', headerName: 'Tarih', width: 120, valueFormatter: (value: any) => formatDate(value) },
    { field: 'accountCode', headerName: 'Cari Kod', width: 130, valueGetter: (_: any, row: Fatura) => row.account?.accountCode || '' },
    { field: 'account', headerName: 'Cari Ünvan', flex: 1.5, minWidth: 200, valueGetter: (account: any) => account?.title || '' },
    { field: 'grandTotal', headerName: 'Tutar', width: 150, align: 'right', headerAlign: 'right', valueFormatter: (value: any) => formatCurrency(value) },
    { field: 'status', headerName: 'Durum', width: 140, renderCell: (params: GridRenderCellParams) => <StatusBadge status={params.value as string} /> },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'İşlemler',
      width: 160,
      getActions: (params: any) => [
        <Tooltip title="Düzenle" key="edit"><IconButton size="small" onClick={() => handleEdit(params.row)}><Edit fontSize="small" /></IconButton></Tooltip>,
        <Tooltip title="Detay" key="view"><IconButton size="small" onClick={() => handleView(params.row)}><Visibility fontSize="small" /></IconButton></Tooltip>,
        <Tooltip title="Daha Fazla" key="more"><IconButton size="small" onClick={(e) => handleMenuOpen(e, params.row.id)}><MoreVert fontSize="small" /></IconButton></Tooltip>,
      ],
    },
  ], [handleEdit, handleView]);

  return (
    <StandardPage maxWidth={false}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'var(--chart-2-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt sx={{ color: 'var(--chart-2)', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight="700">Alış İade Faturaları</Typography>
        </Box>
        <Button variant="contained" size="small" startIcon={<Add />} onClick={handleAdd} sx={{ bgcolor: 'var(--chart-2)', '&:hover': { bgcolor: 'color-mix(in srgb, var(--chart-2) 85%, black)' } }}>Yeni İade Faturası</Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} color="info" />}
      <KPIHeader loading={loading} data={kpiData} type="IADE" />

      <StandardCard padding={0} sx={{ mt: 2 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Fatura Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ minWidth: 250 }} />
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setShowFilters(!showFilters)} color={showFilters ? 'primary' : 'default'}><FilterList /></IconButton>
            <IconButton onClick={handleExportExcel}><Download /></IconButton>
            <IconButton onClick={fetchFaturalar}><RefreshOutlined /></IconButton>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ p: 2, bgcolor: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth type="date" label="Başlangıç" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" /></Grid>
              <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth type="date" label="Bitiş" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" /></Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Durum</InputLabel>
                  <Select multiple value={filterDurum} onChange={(e) => setFilterDurum(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)} label="Durum">
                    <MenuItem value="OPEN">Beklemede</MenuItem>
                    <MenuItem value="APPROVED">Onaylandı</MenuItem>
                    <MenuItem value="CANCELLED">İptal Edildi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}><Button fullWidth variant="outlined" onClick={handleClearFilters}>Temizle</Button></Grid>
            </Grid>
          </Box>
        </Collapse>

        <Box sx={{ height: 600, width: '100%' }}>
          <InvoiceDataGrid
            rows={faturalar}
            columns={columns}
            loading={loading}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
          />
        </Box>
      </StandardCard>

      {/* Dialogs */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth>
        <DialogTitle>Fatura Detayı: {selectedFatura?.invoiceNo}</DialogTitle>
        <DialogContent dividers>
          {selectedFatura && (
            <Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}><Typography variant="caption">Cari</Typography><Typography variant="body1" fontWeight="bold">{selectedFatura.account.title}</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography variant="caption">Tarih</Typography><Typography variant="body1">{formatDate(selectedFatura.date)}</Typography></Grid>
              </Grid>
              <TableContainer component={Paper} sx={{ mt: 2 }} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ürün</TableCell>
                      <TableCell align="right">Miktar</TableCell>
                      <TableCell align="right">Birim Fiyat</TableCell>
                      <TableCell align="right">İskonto</TableCell>
                      <TableCell align="right">KDV</TableCell>
                      <TableCell align="right">Toplam</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedFatura.items?.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{item.product?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.product?.code}</Typography>
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell align="right">
                          {item.discountRate > 0 || item.discountAmount > 0 ? (
                            <Tooltip title={`Oran: %${item.discountRate || 0} / Tutar: ${formatCurrency(item.discountAmount || 0)}`}>
                              <Typography variant="caption" sx={{ cursor: 'help', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>
                                {item.discountRate > 0 ? `%${item.discountRate}` : formatCurrency(item.discountAmount)}
                              </Typography>
                            </Tooltip>
                          ) : '-'}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(item.vatAmount || 0)}</TableCell>
                        <TableCell align="right" fontWeight={600}>{formatCurrency((Number(item.amount) || 0) + (Number(item.vatAmount) || 0))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 1 }}>
                <Paper variant="outlined" sx={{ p: 2, minWidth: 250, bgcolor: 'action.hover' }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Ara Toplam:</Typography><Typography variant="body2">{formatCurrency(Number(selectedFatura.totalAmount || 0) + Number(selectedFatura.discount || 0))}</Typography></Box>
                    {Number(selectedFatura.discount) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Genel İskonto:</Typography><Typography variant="body2" color="error.main">-{formatCurrency(selectedFatura.discount)}</Typography></Box>
                    )}
                    {(Number(selectedFatura.sctTotal) > 0 || Number(selectedFatura.withholdingTotal) > 0) && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Net Ara Toplam:</Typography><Typography variant="body2">{formatCurrency(selectedFatura.totalAmount)}</Typography></Box>
                    )}
                    {Number(selectedFatura.sctTotal) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">ÖİV Toplamı:</Typography><Typography variant="body2">{formatCurrency(selectedFatura.sctTotal)}</Typography></Box>
                    )}
                    {Number(selectedFatura.withholdingTotal) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Tevkifat Toplamı:</Typography><Typography variant="body2" color="error.main">-{formatCurrency(selectedFatura.withholdingTotal)}</Typography></Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">KDV Toplamı:</Typography><Typography variant="body2">{formatCurrency(selectedFatura.vatAmount)}</Typography></Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="subtitle1" fontWeight={800}>GENEL TOPLAM:</Typography><Typography variant="subtitle1" fontWeight={800} color="var(--chart-2)">{formatCurrency(selectedFatura.grandTotal)}</Typography></Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="success.main">Ödenen:</Typography><Typography variant="body2" color="success.main">{formatCurrency(selectedFatura.paidAmount || 0)}</Typography></Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2" color="error.main" fontWeight={700}>Kalan:</Typography><Typography variant="body2" color="error.main" fontWeight={700}>{formatCurrency(selectedFatura.remainingAmount || 0)}</Typography></Box>
                  </Stack>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenView(false)}>Kapat</Button></DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Silme Onayı</DialogTitle>
        <DialogContent><Typography>Bu faturayı silmek istediğinizden emin misiniz?</Typography></DialogContent>
        <DialogActions><Button onClick={() => setOpenDelete(false)}>Vazgeç</Button><Button onClick={handleDelete} color="error" variant="contained">Sil</Button></DialogActions>
      </Dialog>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { const f = faturalar.find((x: Fatura) => x.id === menuFaturaId); if (f) handleView(f); handleMenuClose(); }}>Detay</MenuItem>
        <MenuItem onClick={() => { const f = faturalar.find((x: Fatura) => x.id === menuFaturaId); if (f) handleEdit(f); handleMenuClose(); }} disabled={!['DRAFT', 'PENDING'].includes(faturalar.find((x: Fatura) => x.id === menuFaturaId)?.status || '')}>Düzenle</MenuItem>
        <MenuItem onClick={() => { const f = faturalar.find((x: Fatura) => x.id === menuFaturaId); if (f) openIptalDialog(f); handleMenuClose(); }} sx={{ color: 'error.main' }}>İptal</MenuItem>
        <MenuItem onClick={() => { const f = faturalar.find((x: Fatura) => x.id === menuFaturaId); if (f) handleRevertToDraft(f); handleMenuClose(); }} disabled={faturalar.find((x: Fatura) => x.id === menuFaturaId)?.status !== 'APPROVED'}>Taslağa Çevir</MenuItem>
        <MenuItem onClick={() => { const f = faturalar.find((x: Fatura) => x.id === menuFaturaId); if (f) openDeleteDialog(f); handleMenuClose(); }} sx={{ color: 'error.main' }}>Sil</MenuItem>
      </Menu>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}
