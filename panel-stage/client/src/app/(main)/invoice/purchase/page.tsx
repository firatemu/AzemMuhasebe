'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import axios from '@/lib/axios';
import { useTabStore } from '@/stores/tabStore';
import {
  Add,
  Assessment,
  CheckCircle,
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
  MoreHoriz,
  Receipt,
  Payments,
  History,
  AccountBalanceWallet,
  FileCopy,
  Undo,
  Warning,
  CalendarMonth,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
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
  Stack,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { GridColDef, GridRenderCellParams, GridPaginationModel, GridSortModel, GridFilterModel } from '@mui/x-data-grid';
import KPIHeader from '@/components/Fatura/KPIHeader';
import InvoiceDataGrid from '@/components/Fatura/InvoiceDataGrid';
import { StandardCard, StandardPage } from '@/components/common';
import { usePermission } from '@/hooks/usePermission';

interface Cari {
  id: string;
  accountCode?: string;
  code?: string;
  title: string;
}

interface FaturaKalemi {
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

interface Fatura {
  id: string;
  invoiceNo: string;
  invoiceType: 'SALE' | 'PURCHASE';
  date: string;
  dueDate: string | null;
  account: Cari;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  status: 'OPEN' | 'APPROVED' | 'PARTIALLY_PAID' | 'CLOSED' | 'CANCELLED';
  iskonto?: number;
  description?: string;
  items?: FaturaKalemi[];
  paidAmount?: number;
  remainingAmount?: number;
  purchaseDeliveryNoteId?: string;
  purchaseDeliveryNote?: { id: string; deliveryNoteNo: string };
  deliveryNote?: { id: string; deliveryNoteNo: string };
  createdByUser?: { fullName?: string; username?: string };
  createdAt?: string;
  updatedByUser?: { fullName?: string; username?: string };
  updatedAt?: string;
  logs?: Array<{ createdAt: string; message: string; actionType?: string; user?: any }>;
}

interface PurchaseStats {
  aylikAlis: { tutar: number; adet: number };
  odemeBekleyen: { tutar: number; adet: number };
  vadesiGecmis: { tutar: number; adet: number };
}

const statusConfig: Record<string, { label: string; color: any }> = {
  DRAFT: { label: 'Taslak', color: 'default' },
  PENDING: { label: 'Beklemede', color: 'warning' },
  OPEN: { label: 'Açık', color: 'info' },
  APPROVED: { label: 'Onaylandı', color: 'primary' },
  PARTIALLY_PAID: { label: 'Kısmi Ödendi', color: 'warning' },
  CLOSED: { label: 'Kapandı', color: 'success' },
  CANCELLED: { label: 'İptal', color: 'error' },
};

const EDITABLE_STATUSES = ['DRAFT', 'PENDING'];
const APPROVABLE_STATUSES = ['DRAFT', 'PENDING', 'OPEN'];
const CANCELLABLE_STATUSES = ['APPROVED', 'PARTIALLY_PAID'];

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PAID':
    case 'CLOSED':
      return 'Ödendi';
    case 'APPROVED':
      return 'Onaylandı';
    case 'OPEN':
      return 'Açık';
    case 'PENDING':
      return 'Beklemede';
    case 'DRAFT':
      return 'Taslak';
    case 'PARTIALLY_PAID':
      return 'Kısmen Ödendi';
    case 'CANCELLED':
      return 'İptal';
    default:
      return status;
  }
};

const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'PAID':
    case 'CLOSED':
      return 'success';
    case 'APPROVED':
      return 'info';
    case 'OPEN':
      return 'warning';
    case 'PENDING':
      return 'warning';
    case 'DRAFT':
      return 'default';
    case 'PARTIALLY_PAID':
      return 'primary';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

export default function AlisFaturalariPage() {
  const { addTab, setActiveTab } = useTabStore();
  const router = useRouter();
  const { can } = usePermission();
  const [searchTerm, setSearchTerm] = useState('');
  const [faturalar, setFaturalar] = useState<Fatura[]>([]);
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }]);
  const [rowCount, setRowCount] = useState(0);
  const [actionsMenu, setActionsMenu] = useState<{
    anchorEl: HTMLElement | null;
    row: Fatura | null;
  }>({ anchorEl: null, row: null });

  // Dialog states
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openIptal, setOpenIptal] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [irsaliyeIptal, setIrsaliyeIptal] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  // İstatistikler
  const [stats, setStats] = useState<PurchaseStats | null>(null);

  // Filtreler
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDurum, setFilterDurum] = useState<string[]>([]);
  const [filterCariId, setFilterCariId] = useState('');
  const [filterDueDate, setFilterDueDate] = useState<string>('');

  // Vade Analizi
  const [dueDateAnalysis, setDueDateAnalysis] = useState<{
    overdue: { count: number; total: number };
    dueToday: { count: number; total: number };
    dueThisWeek: { count: number; total: number };
    dueThisMonth: { count: number; total: number };
  } | null>(null);

  useEffect(() => {
    addTab({ id: 'invoice-purchase', label: 'Satın Alma Faturaları', path: '/invoice/purchase' });
  }, [addTab]);

  useEffect(() => {
    fetchFaturalar();
    fetchCariler();
    fetchStats();
  }, [paginationModel, sortModel, filterCariId, filterStartDate, filterEndDate, filterDurum]);

  useEffect(() => {
    fetchDueDateAnalysis();
  }, []);

  const fetchFaturalar = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        type: 'PURCHASE',
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
      if (filterDueDate) params.dueDateStatus = filterDueDate;

      const response = await axios.get('/invoices', { params });
      setFaturalar(response.data?.data || []);
      setRowCount(response.data?.meta?.total || 0);
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
    } catch (error) { console.error('Cariler hata:', error); }
  };

  const fetchStats = async () => {
    try {
      const params: Record<string, any> = { type: 'PURCHASE' };
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/invoices/stats', { params });
      setStats(response.data);
    } catch (error) { console.error('Stats hata:', error); }
  };

  const fetchDueDateAnalysis = async () => {
    try {
      const params: Record<string, any> = { type: 'PURCHASE' };
      const response = await axios.get('/invoices/due-date-analysis', { params });
      const data = response.data || {};
      setDueDateAnalysis({
        overdue: data.overdue || { count: 0, total: 0 },
        dueToday: data.dueToday || { count: 0, total: 0 },
        dueThisWeek: data.dueThisWeek || { count: 0, total: 0 },
        dueThisMonth: data.dueThisMonth || { count: 0, total: 0 },
      });
    } catch (error: any) {
      console.error('Vade analizi hata:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClearFilters = () => {
    setFilterStartDate(''); setFilterEndDate(''); setFilterDurum([]); setFilterCariId(''); setFilterDueDate(''); setSearchTerm('');
  };

  const handleExportExcel = async () => {
    try {
      const params: Record<string, string> = { type: 'PURCHASE' };
      if (searchTerm) params.search = searchTerm;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/invoices/export/excel', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `satin_alma_faturalari_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSnackbar('Excel dosyası indirildi', 'success');
    } catch (error: any) { showSnackbar('Excel aktarımı başarısız', 'error'); }
  };

  const handleDelete = async () => {
    if (!selectedFatura) return;
    try {
      await axios.delete(`/invoices/${selectedFatura.id}`);
      showSnackbar('Fatura başarıyla silindi', 'success');
      setOpenDelete(false); fetchFaturalar(); fetchStats();
    } catch (error: any) { showSnackbar(error.response?.data?.message || 'Silme işlemi başarısız', 'error'); }
  };

  const handleView = async (row: Fatura) => {
    try {
      const response = await axios.get(`/invoices/${row.id}`);
      setSelectedFatura(response.data);
      setOpenView(true);
    } catch (error: any) { showSnackbar('Fatura yüklenirken hata oluştu', 'error'); }
  };

  const handleEdit = (row: Fatura) => {
    const tabId = `purchase-invoice-edit-${row.id}`;
    addTab({ id: tabId, label: `Düzenle: ${row.invoiceNo}`, path: `/invoice/purchase/duzenle/${row.id}` });
    setActiveTab(tabId); router.push(`/invoice/purchase/duzenle/${row.id}`);
  };

  const handleApprove = async (row: Fatura) => {
    try {
      await axios.put(`/invoices/${row.id}/status`, { status: 'APPROVED' });
      showSnackbar(`${row.invoiceNo} numaralı fatura onaylanıp stok ve cari hareketleri oluşturuldu.`, 'success');
      fetchFaturalar(); fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Onaylama işlemi başarısız', 'error');
    }
  };

  const handleRevertToDraft = async (row: Fatura) => {
    try {
      await axios.put(`/invoices/${row.id}/status`, { status: 'DRAFT' });
      showSnackbar(`${row.invoiceNo} numaralı fatura taslağa çevrildi. Oluşan hareketler geri alındı.`, 'success');
      fetchFaturalar(); fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Taslağa çevirme işlemi başarısız', 'error');
    }
  };

  const closeActionsMenu = () => setActionsMenu({ anchorEl: null, row: null });

  const openIptalDialog = (fatura: Fatura) => {
    setSelectedFatura(fatura);
    setOpenIptal(true);
  };

  const handleIptal = async () => {
    try {
      if (selectedFatura) {
        await axios.put(`/invoices/${selectedFatura.id}/cancel`, {
          deliveryNoteIptal: irsaliyeIptal,
        });
        const mesaj = irsaliyeIptal
          ? 'Fatura ve bağlı irsaliye başarıyla iptal edildi. Stoklar ve cari bakiye güncellendi.'
          : 'Fatura başarıyla iptal edildi. Stoklar ve cari bakiye güncellendi.';
        showSnackbar(mesaj, 'success');
        setOpenIptal(false);
        setIrsaliyeIptal(false);
        fetchFaturalar();
        fetchStats();
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İptal işlemi başarısız', 'error');
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const kpiData = useMemo(() => stats ? {
    aylikSatis: { tutar: stats.aylikAlis?.tutar || 0, adet: stats.aylikAlis?.adet || 0 },
    tahsilatBekleyen: { tutar: stats.odemeBekleyen?.tutar || 0, adet: stats.odemeBekleyen?.adet || 0 },
    vadesiGecmis: { tutar: stats.vadesiGecmis?.tutar || 0, adet: stats.vadesiGecmis?.adet || 0 },
  } : null, [stats]);

  const pageGrandTotal = useMemo(() => faturalar.reduce((sum, i) => sum + (i.grandTotal || 0), 0), [faturalar]);

  const getLinkedDeliveryNote = (row: Fatura) =>
    row.deliveryNote ?? row.purchaseDeliveryNote;

  const getInvoiceRowMenuActions = (row: Fatura) => [
    {
      id: 'view',
      label: 'Detayları Görüntüle',
      icon: <Visibility fontSize="small" />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); handleView(row); },
      disabled: false,
    },
    {
      id: 'edit',
      label: 'Düzenle',
      icon: <Edit fontSize="small" />,
      color: EDITABLE_STATUSES.includes(row.status) ? 'var(--primary)' : 'var(--muted-foreground)',
      onClick: () => { closeActionsMenu(); handleEdit(row); },
      disabled: !EDITABLE_STATUSES.includes(row.status),
    },
    {
      id: 'approve',
      label: 'Onayla',
      icon: <CheckCircle fontSize="small" sx={{ color: 'var(--chart-3)' }} />,
      color: 'var(--chart-3)',
      onClick: () => { closeActionsMenu(); handleApprove(row); },
      disabled: !APPROVABLE_STATUSES.includes(row.status),
    },
    {
      id: 'revert',
      label: 'Taslağa Çevir',
      icon: <Undo fontSize="small" sx={{ color: 'var(--chart-4)' }} />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); handleRevertToDraft(row); },
      disabled: row.status !== 'APPROVED',
    },
    {
      id: 'payment',
      label: 'Ödeme Ekle',
      icon: <Payments fontSize="small" sx={{ color: 'var(--chart-2)' }} />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); router.push(`/payments/purchase/yeni?faturaId=${row.id}`); },
      disabled: false,
    },
    {
      id: 'print',
      label: 'Yazdır',
      icon: <Print fontSize="small" />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); window.open(`/invoice/purchase/print/${row.id}`, '_blank'); },
      disabled: false,
    },
    {
      id: 'copy',
      label: 'Kopyasını Oluştur',
      icon: <FileCopy fontSize="small" />,
      color: 'var(--foreground)',
      onClick: () => {
        closeActionsMenu();
        const path = `/invoice/purchase/yeni?kopyala=${row.id}`;
        const tabId = `purchase-invoice-copy-${row.id}`;
        addTab({ id: tabId, label: `Kopya: ${row.invoiceNo}`, path });
        setActiveTab(tabId);
        router.push(path);
      },
      disabled: false,
    },
    {
      id: 'cancel',
      label: 'İptal Et',
      icon: <Cancel fontSize="small" sx={{ color: 'var(--destructive)' }} />,
      color: 'var(--destructive)',
      onClick: () => { closeActionsMenu(); openIptalDialog(row); },
      disabled: !CANCELLABLE_STATUSES.includes(row.status),
    },
    {
      id: 'delete',
      label: 'Sil',
      icon: <Delete fontSize="small" sx={{ color: 'var(--destructive)' }} />,
      color: 'var(--destructive)',
      onClick: () => { closeActionsMenu(); setSelectedFatura(row); setOpenDelete(true); },
      disabled: !EDITABLE_STATUSES.includes(row.status),
    },
  ];

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'invoiceNo', headerName: 'Fatura No', width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" fontWeight="bold">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'date', headerName: 'Tarih', width: 110,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2">{formatDate(params.value)}</Typography>
        </Box>
      )
    },
    {
      field: 'account', headerName: 'Cari Ünvan', flex: 1, minWidth: 200,
      valueGetter: (_v, row: Fatura) => row.account?.title || '',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'grandTotal', headerName: 'Tutar', width: 140, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', height: '100%', width: '100%' }}>
          <ArrowUpward sx={{ fontSize: 14, color: 'var(--chart-2)' }} />
          <Typography variant="body2" fontWeight="700" sx={{ color: 'var(--chart-2)' }}>{formatCurrency(params.value)}</Typography>
        </Box>
      )
    },
    {
      field: 'paidAmount', headerName: 'Ödenen', width: 130, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '100%' }}>
          <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>{formatCurrency(params.value || 0)}</Typography>
        </Box>
      )
    },
    {
      field: 'remainingAmount', headerName: 'Kalan', width: 130, type: 'number', align: 'right', headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '100%' }}>
          <Typography variant="body2" sx={{ color: params.value > 0 ? 'error.main' : 'text.secondary', fontWeight: 700 }}>{formatCurrency(params.value || 0)}</Typography>
        </Box>
      )
    },
    {
      field: 'status', headerName: 'Durum', width: 130,
      renderCell: (params) => {
        const config = statusConfig[params.value] || { label: params.value, color: 'default' };
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', borderRadius: '6px' }} />
          </Box>
        );
      }
    },
    {
      field: 'actions', headerName: 'İşlemler', width: 80, sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              setActionsMenu({ anchorEl: event.currentTarget, row: params.row });
            }}
            sx={{
              borderRadius: 1.5,
              p: 0.75,
              color: actionsMenu.row?.id === params.row.id && actionsMenu.anchorEl
                ? 'var(--secondary-foreground)'
                : 'var(--muted-foreground)',
              bgcolor: actionsMenu.row?.id === params.row.id && actionsMenu.anchorEl
                ? 'var(--secondary)'
                : 'transparent',
              '&:hover': {
                bgcolor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              },
              '&:active': {
                bgcolor: 'var(--secondary)',
                transform: 'translateY(0)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <MoreHoriz fontSize="small" />
          </IconButton>
        </Box>
      ),
    }
  ], [actionsMenu.anchorEl, actionsMenu.row?.id]);

  return (
    <StandardPage maxWidth={false}>
      {/* Header & Aksiyon Butonları */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--ring) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt sx={{ color: 'var(--ring)', fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="700" color="text.primary">
              Satın Alma Faturaları
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tedarikçi faturalarınızı yönetin
            </Typography>
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Assessment />}
            onClick={() => router.push('/raporlama/satis-elemani')}
            sx={{ fontWeight: 600, fontSize: '0.8rem', px: 1.5, py: 0.75, minWidth: 0, boxShadow: 'none' }}
          >
            Raporlar
          </Button>
          {can('invoice', 'create') && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => {
                addTab({ id: 'purchase-invoice-yeni', label: 'Yeni Fatura', path: '/invoice/purchase/yeni' });
                setActiveTab('purchase-invoice-yeni');
                router.push('/invoice/purchase/yeni');
              }}
              sx={{
                bgcolor: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 1.5,
                py: 0.75,
                minWidth: 0,
                boxShadow: 'none',
                '&:hover': { bgcolor: 'color-mix(in srgb, var(--primary) 85%, var(--background))', boxShadow: 'none' },
              }}
            >
              Yeni Fatura
            </Button>
          )}
        </Stack>
      </Box>

      {/* Loading bar */}
      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1, height: 3 }} color="primary" />}

      {/* KPI Kartları */}
      <KPIHeader loading={loading} data={kpiData} type="ALIS" />

      {/* Vade Analizi */}
      {dueDateAnalysis && (
        <Paper
          elevation={0}
          variant="outlined"
          sx={{
            display: 'flex',
            borderRadius: 2,
            overflow: 'hidden',
            borderColor: 'var(--border)',
            mb: 2,
          }}
        >
          <Box sx={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRight: '1px solid var(--border)' }}>
            <Box sx={{ background: 'color-mix(in srgb, var(--destructive) 12%, transparent)', color: 'var(--destructive)', borderRadius: 1.5, p: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: 28, height: 28 }}>
              <Warning sx={{ fontSize: 14 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', lineHeight: 1.2 }}>Vadesi Geçmiş</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--destructive)', lineHeight: 1.3 }}>{dueDateAnalysis.overdue.count}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontSize: '0.68rem' }}>{formatCurrency(dueDateAnalysis.overdue.total)}</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRight: '1px solid var(--border)' }}>
            <Box sx={{ background: 'color-mix(in srgb, var(--chart-1) 12%, transparent)', color: 'var(--chart-1)', borderRadius: 1.5, p: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: 28, height: 28 }}>
              <CalendarMonth sx={{ fontSize: 14 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', lineHeight: 1.2 }}>Bugün Vadesi</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--chart-1)', lineHeight: 1.3 }}>{dueDateAnalysis.dueToday.count}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontSize: '0.68rem' }}>{formatCurrency(dueDateAnalysis.dueToday.total)}</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRight: '1px solid var(--border)' }}>
            <Box sx={{ background: 'color-mix(in srgb, var(--chart-3) 12%, transparent)', color: 'var(--chart-3)', borderRadius: 1.5, p: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: 28, height: 28 }}>
              <History sx={{ fontSize: 14 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', lineHeight: 1.2 }}>Bu Hafta</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.3 }}>{dueDateAnalysis.dueThisWeek.count}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontSize: '0.68rem' }}>{formatCurrency(dueDateAnalysis.dueThisWeek.total)}</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: '1 1 140px', display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
            <Box sx={{ background: 'color-mix(in srgb, var(--chart-4) 12%, transparent)', color: 'var(--chart-4)', borderRadius: 1.5, p: 0.75, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: 28, height: 28 }}>
              <CalendarMonth sx={{ fontSize: 14 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', lineHeight: 1.2 }}>Bu Ay</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.3 }}>{dueDateAnalysis.dueThisMonth.count}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontSize: '0.68rem' }}>{formatCurrency(dueDateAnalysis.dueThisMonth.total)}</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      <StandardCard padding={0} sx={{ boxShadow: 'none', overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'var(--card)' }}>
          <TextField
            id="alis-fatura-search"
            size="small"
            placeholder="Fatura Ara (No, Cari vb.)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm('')} edge="end">
                  <Close fontSize="small" />
                </IconButton>
              ),
            }}
          />
          {/* Hızlı Tarih Çipleri */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {['TÜMÜ', 'BUGÜN', 'BU HAFTA', 'BU AY', 'BU YIL'].map((label) => {
              const today = new Date();
              const toISODate = (d: Date) => d.toISOString().split('T')[0];
              const getQuickRange = (quickLabel: string) => {
                if (quickLabel === 'TÜMÜ') return { start: '', end: '' };
                if (quickLabel === 'BUGÜN') return { start: toISODate(today), end: toISODate(today) };
                if (quickLabel === 'BU HAFTA') {
                  const day = today.getDay();
                  const diffToMonday = (day === 0 ? -6 : 1 - day);
                  const monday = new Date(today);
                  monday.setDate(today.getDate() + diffToMonday);
                  const sunday = new Date(monday);
                  sunday.setDate(monday.getDate() + 6);
                  return { start: toISODate(monday), end: toISODate(sunday) };
                }
                if (quickLabel === 'BU AY') {
                  return { start: toISODate(new Date(today.getFullYear(), today.getMonth(), 1)), end: toISODate(today) };
                }
                if (quickLabel === 'BU YIL') {
                  return { start: toISODate(new Date(today.getFullYear(), 0, 1)), end: toISODate(today) };
                }
                return { start: '', end: '' };
              };
              const range = getQuickRange(label);
              const isSelected = label === 'TÜMÜ'
                ? !filterStartDate && !filterEndDate
                : filterStartDate === range.start && filterEndDate === range.end;
              return (
                <Chip
                  key={label}
                  label={label}
                  onClick={() => {
                    if (label === 'TÜMÜ') {
                      setFilterStartDate('');
                      setFilterEndDate('');
                      return;
                    }
                    setFilterStartDate(range.start);
                    setFilterEndDate(range.end);
                  }}
                  variant={isSelected ? 'filled' : 'outlined'}
                  color={isSelected ? 'primary' : 'default'}
                  sx={{ borderRadius: 2, cursor: 'pointer', fontWeight: 500, fontSize: '0.75rem' }}
                />
              )
            })}
          </Stack>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
            <Tooltip title={showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}>
              <IconButton
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  bgcolor: showFilters ? 'var(--primary)' : 'transparent',
                  color: showFilters ? 'var(--primary-foreground)' : 'text.secondary',
                  '&:hover': { bgcolor: showFilters ? 'var(--primary)' : 'var(--secondary)', color: showFilters ? 'var(--primary-foreground)' : 'var(--secondary-foreground)' },
                }}
              >
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excel İndir">
              <IconButton size="small" onClick={handleExportExcel}>
                <Download fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Yenile">
              <IconButton size="small" onClick={fetchFaturalar}>
                <RefreshOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ px: 2, py: 1.5, bgcolor: 'var(--muted)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              type="date"
              size="small"
              label="Başlangıç"
              value={filterStartDate}
              onChange={e => setFilterStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
            />
            <TextField
              type="date"
              size="small"
              label="Bitiş"
              value={filterEndDate}
              onChange={e => setFilterEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 140 }}
            />
            <Autocomplete
              size="small"
              options={cariler}
              getOptionLabel={o => o.title}
              value={cariler.find(c => c.id === filterCariId) || null}
              onChange={(_, v) => setFilterCariId(v?.id || '')}
              renderInput={p => <TextField {...p} label="Cari" sx={{ minWidth: 180 }} />}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Vade Durumu</InputLabel>
              <Select value={filterDueDate} onChange={(e) => setFilterDueDate(e.target.value)} label="Vade Durumu">
                <MenuItem value="">Tümü</MenuItem>
                <MenuItem value="OVERDUE">Vadesi Geçmiş</MenuItem>
                <MenuItem value="DUE_TODAY">Bugün Vadesi</MenuItem>
                <MenuItem value="DUE_THIS_WEEK">Bu Hafta</MenuItem>
                <MenuItem value="DUE_THIS_MONTH">Bu Ay</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              sx={{ borderRadius: 1, textTransform: 'none' }}
            >
              Temizle
            </Button>
          </Box>
        </Collapse>

        {/* Table Summary Bar */}
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
          <Typography variant="caption" color="text.secondary">
            <b>{rowCount}</b> fatura listeleniyor
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Toplam: <Box component="span" sx={{ fontWeight: 700, color: 'var(--chart-2)' }}>{formatCurrency(pageGrandTotal)}</Box>
          </Typography>
        </Box>

        <InvoiceDataGrid rows={faturalar} columns={columns} loading={loading} rowCount={rowCount} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} checkboxSelection={false} height={680} />
      </StandardCard>

      {/* View Dialog */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle component="div" sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Receipt sx={{ color: 'var(--secondary)', fontSize: 22 }} />
            <Typography variant="h6">Fatura Detayı</Typography>
            {selectedFatura && (
              <Chip
                label={getStatusLabel(selectedFatura.status)}
                color={getStatusColor(selectedFatura.status)}
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <IconButton size="small" onClick={() => setOpenView(false)}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedFatura && (
            <Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fatura No</Typography>
                  <Typography variant="body1" fontWeight={700}>{selectedFatura.invoiceNo}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tarih</Typography>
                  <Typography variant="body1" fontWeight={700}>{formatDate(selectedFatura.date)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Vade</Typography>
                  <Typography variant="body1" fontWeight={700} color="error.main">{selectedFatura.dueDate ? formatDate(selectedFatura.dueDate) : '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cari</Typography>
                  <Typography variant="body1" fontWeight={700}>{selectedFatura.account?.title}</Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Kalemler</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ürün</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Miktar</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Birim Fiyat</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>İskonto</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>KDV</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Toplam</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedFatura.items?.map((k, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>{k.product?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{k.product?.code}</Typography>
                        </TableCell>
                        <TableCell align="center">{k.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(k.unitPrice)}</TableCell>
                        <TableCell align="right">
                          {k.discountRate > 0 || k.discountAmount > 0 ? (
                            <Tooltip title={`Oran: %${k.discountRate || 0} / Tutar: ${formatCurrency(k.discountAmount || 0)}`}>
                              <Typography variant="caption" sx={{ cursor: 'help', bgcolor: 'var(--muted)', px: 1, py: 0.5, borderRadius: 0.75, display: 'inline-block' }}>
                                {k.discountRate > 0 ? `%${k.discountRate}` : formatCurrency(k.discountAmount)}
                              </Typography>
                            </Tooltip>
                          ) : '-'}
                        </TableCell>
                        <TableCell align="right">{formatCurrency(k.vatAmount || 0)}</TableCell>
                        <TableCell align="right" fontWeight={600}>{formatCurrency((Number(k.amount) || 0) + (Number(k.vatAmount) || 0))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Paper variant="outlined" sx={{ p: 2, minWidth: 260, borderRadius: 2 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Ara Toplam:</Typography>
                      <Typography variant="body2">{formatCurrency(Number(selectedFatura.totalAmount || 0) + Number(selectedFatura.discount || 0))}</Typography>
                    </Box>
                    {Number(selectedFatura.discount) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Genel İskonto:</Typography>
                        <Typography variant="body2" color="error.main">-{formatCurrency(selectedFatura.discount)}</Typography>
                      </Box>
                    )}
                    {(Number(selectedFatura.sctTotal) > 0 || Number(selectedFatura.withholdingTotal) > 0) && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Net Ara Toplam:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedFatura.totalAmount)}</Typography>
                      </Box>
                    )}
                    {Number(selectedFatura.sctTotal) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">ÖİV:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedFatura.sctTotal)}</Typography>
                      </Box>
                    )}
                    {Number(selectedFatura.withholdingTotal) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Tevkifat:</Typography>
                        <Typography variant="body2" color="error.main">-{formatCurrency(selectedFatura.withholdingTotal)}</Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">KDV:</Typography>
                      <Typography variant="body2">{formatCurrency(selectedFatura.vatAmount)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight={800}>GENEL TOPLAM:</Typography>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'var(--chart-2)' }}>{formatCurrency(selectedFatura.grandTotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="success.main">Ödenen:</Typography>
                      <Typography variant="body2" color="success.main">{formatCurrency(selectedFatura.paidAmount || 0)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="error.main" fontWeight={700}>Kalan:</Typography>
                      <Typography variant="body2" color="error.main" fontWeight={700}>{formatCurrency(selectedFatura.remainingAmount || 0)}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>

              <Accordion sx={{ boxShadow: 'none', border: '1px solid var(--border)', mt: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 } }}>
                  <History fontSize="small" sx={{ color: 'var(--muted-foreground)' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Denetim Logları</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                    Oluşturan: <strong>{selectedFatura.createdByUser?.fullName}</strong> ({formatDate(selectedFatura.createdAt || '')})
                  </Typography>
                  {selectedFatura.logs?.map((log, i) => (
                    <Typography key={i} variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                      • {formatDate(log.createdAt)}: {log.message}
                    </Typography>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenView(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={actionsMenu.anchorEl}
        open={Boolean(actionsMenu.anchorEl)}
        onClose={closeActionsMenu}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 288,
            mt: 1,
            borderRadius: 2,
            border: '1px solid var(--border)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            overflow: 'visible',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            '&:hover': {
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {actionsMenu.row ? (
          <Box>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                bgcolor: 'var(--muted)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>
                Fatura İşlemleri
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ mt: 0.25, color: 'var(--foreground)', fontSize: '0.875rem' }}>
                {actionsMenu.row.invoiceNo}
              </Typography>
            </Box>
            <Box sx={{ px: 1, pt: 1.5, pb: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  px: 0.5,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'var(--muted-foreground)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.7,
                }}
              >
                Hızlı İşlemler
              </Typography>
              {getInvoiceRowMenuActions(actionsMenu.row).slice(0, 5).map((action) => (
                <MenuItem
                  key={action.id}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  sx={{
                    px: 1.5,
                    py: 0.875,
                    borderRadius: 1.5,
                    my: 0.25,
                    mx: 0.5,
                    color: action.color,
                    transition: 'transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      bgcolor: 'var(--secondary)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    },
                    '&.Mui-disabled': { opacity: 0.5 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit', fontSize: 18 }}>{action.icon}</ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>{action.label}</Typography>
                </MenuItem>
              ))}
            </Box>
            <Divider sx={{ mx: 1.5, my: 0.5 }} />
            <Box sx={{ px: 1, pb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  px: 0.5,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'var(--muted-foreground)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.7,
                }}
              >
                Diğer İşlemler
              </Typography>
              {getInvoiceRowMenuActions(actionsMenu.row).slice(5).map((action) => (
                <MenuItem
                  key={action.id}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  sx={{
                    px: 1.5,
                    py: 0.875,
                    borderRadius: 1.5,
                    my: 0.25,
                    mx: 0.5,
                    color: action.color,
                    transition: 'transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      bgcolor: 'var(--secondary)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    },
                    '&.Mui-disabled': { opacity: 0.5 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit', fontSize: 18 }}>{action.icon}</ListItemIcon>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>{action.label}</Typography>
                </MenuItem>
              ))}
            </Box>
          </Box>
        ) : null}
      </Menu>

      <Dialog open={openIptal} onClose={() => { setOpenIptal(false); setIrsaliyeIptal(false); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{
          background: 'linear-gradient(135deg, var(--destructive) 0%, var(--destructive) 100%)',
          color: 'var(--primary-foreground)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Cancel sx={{ fontSize: 22 }} />
            Fatura İptal
          </Box>
          <IconButton size="small" onClick={() => { setOpenIptal(false); setIrsaliyeIptal(false); }} sx={{ color: 'var(--primary-foreground)' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedFatura && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Bu işlem geri alınamaz! Stoklar ve cari hareketleri etkilenecektir.
                </Typography>
              </Alert>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>{selectedFatura.invoiceNo}</strong> nolu faturayı iptal etmek istediğinizden emin misiniz?
              </Typography>
              {selectedFatura.deliveryNote && (
                <Box sx={{
                  p: 2,
                  bgcolor: 'var(--muted)',
                  borderRadius: 1,
                  mb: 2,
                  border: '1px solid var(--border)'
                }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Bu faturaya bağlı bir irsaliye bulunmaktadır:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    İrsaliye No: <strong>{selectedFatura.deliveryNote.deliveryNoteNo}</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="checkbox"
                      id="irsaliyeIptal"
                      checked={irsaliyeIptal}
                      onChange={(e) => setIrsaliyeIptal(e.target.checked)}
                      style={{ width: 18, height: 18, cursor: 'pointer' }}
                    />
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="irsaliyeIptal"
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      Bağlı irsaliyeyi de iptal et
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => { setOpenIptal(false); setIrsaliyeIptal(false); }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              },
            }}
          >
            Vazgeç
          </Button>
          <Button
            onClick={handleIptal}
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              },
            }}
          >
            İptal Et
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Delete sx={{ color: 'var(--destructive)', fontSize: 22 }} />
          Fatura Sil
        </DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{selectedFatura?.invoiceNo}</strong> nolu faturayı silmek istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Bu işlem geri alınamaz!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              },
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              },
            }}
          >
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
