'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
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
  Cancel,
  Download,
  RefreshOutlined,
  ArrowDownward,
  ArrowUpward,
  FilterList,
  ExpandMore,
  Description,
  MoreVert,
  MoreHoriz,
  Receipt,
  ShoppingCart,
  Assignment,
  LocalShipping,
  Inventory,
  ContentCopy,
  CheckCircle,
  KeyboardArrowRight,
  StarBorder,
  ArrowForward,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Autocomplete,
  Link as MuiLink,
  Menu,
  MenuItem,
  Paper,
  Popover,
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
  Fade,
  Zoom,
  Badge,
  Avatar,
  alpha,
  useTheme,
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
  satisFiyati: number;
  kdvOrani: number;
}

interface SiparisKalemi {
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discountRate: number;
  discountAmount: number;
  amount?: number;
  vatAmount?: number;
  sevkEdilenMiktar?: number;
}

interface Siparis {
  id: string;
  orderNo: string;
  type?: string;
  date: string;
  dueDate: string | null;
  account: Cari;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  status: string;
  discount?: number;
  notes?: string;
  invoiceNo?: string | null;
  invoiceNos?: string[];
  deliveryNoteId?: string | null;
  deliveryNote?: {
    id: string;
    deliveryNoteNo: string;
  };
  deliveryNotes?: Array<{
    id: string;
    deliveryNoteNo: string;
  }>;
  items?: Array<{
    id: string;
    quantity: number;
    deliveredQuantity: number;
  }>;
  createdByUser?: { fullName?: string; username?: string };
  createdAt?: string;
  updatedByUser?: { fullName?: string; username?: string };
  updatedAt?: string;
  logs?: Array<{ createdAt: string; message: string; actionType?: string; user?: any }>;
}

interface OrderStats {
  monthlyOrders: { totalAmount: number; count: number };
  pendingOrders: { totalAmount: number; count: number };
  completedOrders: { totalAmount: number; count: number };
}

const orderStatusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactElement }> = {
  PENDING: {
    label: 'Beklemede',
    color: '#d97706',
    bgColor: 'color-mix(in srgb, #d97706 15%, transparent)',
    icon: <Assignment sx={{ fontSize: 16 }} />,
  },
  PREPARING: {
    label: 'Onaylandı',
    color: '#2563eb',
    bgColor: 'color-mix(in srgb, #2563eb 15%, transparent)',
    icon: <CheckCircle sx={{ fontSize: 16 }} />,
  },
  PARTIALLY_SHIPPED: {
    label: 'Kısmi İhalet',
    color: '#0891b2',
    bgColor: 'color-mix(in srgb, #0891b2 15%, transparent)',
    icon: <LocalShipping sx={{ fontSize: 16 }} />,
  },
  SHIPPED: {
    label: 'Tamamlandı',
    color: '#059669',
    bgColor: 'color-mix(in srgb, #059669 15%, transparent)',
    icon: <CheckCircle sx={{ fontSize: 16 }} />,
  },
  CANCELLED: {
    label: 'İptal',
    color: '#dc2626',
    bgColor: 'color-mix(in srgb, #dc2626 15%, transparent)',
    icon: <Cancel sx={{ fontSize: 16 }} />,
  },
  INVOICED: {
    label: 'Faturalandı',
    color: '#7c3aed',
    bgColor: 'color-mix(in srgb, #7c3aed 15%, transparent)',
    icon: <Receipt sx={{ fontSize: 16 }} />,
  },
  PREPARED: {
    label: 'Hazırlandı',
    color: '#059669',
    bgColor: 'color-mix(in srgb, #059669 15%, transparent)',
    icon: <CheckCircle sx={{ fontSize: 16 }} />,
  },
};

function OrderStatusBadge({ status }: { status: string }) {
  const config = orderStatusConfig[status] || {
    label: status,
    color: '#4b5563',
    bgColor: 'var(--muted)',
    icon: <Assignment sx={{ fontSize: 16 }} />,
  };

  return (
    <Chip
      label={config.label}
      icon={config.icon}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        color: config.color,
        bgcolor: config.bgColor,
        border: '1px solid',
        borderColor: `${config.color}30`,
        borderRadius: '6px',
        '& .MuiChip-icon': {
          color: 'inherit',
          ml: 0.5,
        },
      }}
    />
  );
}

export default function SatisSiparisleriPage() {
  const theme = useTheme();
  const { addTab, setActiveTab } = useTabStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const [siparisler, setSiparisler] = useState<Siparis[]>([]);
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [stoklar, setStoklar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

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
  const [openSevk, setOpenSevk] = useState(false);
  const [selectedSiparis, setSelectedSiparis] = useState<Siparis | null>(null);
  const [sevkSiparis, setSevkSiparis] = useState<Siparis | null>(null);
  const [sevkMiktarlari, setSevkMiktarlari] = useState<Record<string, number>>({});
  const [sevkNotes, setSevkNotes] = useState('');
  const [savingSevk, setSavingSevk] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });


  // Summary Cards stats
  const [stats, setStats] = useState<OrderStats | null>(null);

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDurum, setFilterDurum] = useState<string[]>([]);
  const [filterCariId, setFilterCariId] = useState('');

  useEffect(() => {
    addTab({
      id: 'orders-sales',
      label: 'Satış Siparişleri',
      path: '/orders/sales',
    });
  }, [addTab]);

  useEffect(() => {
    fetchSiparisler();
    fetchCariler();
    fetchStoklar();
    fetchStats();
  }, [paginationModel, sortModel, filterModel, filterCariId, filterStartDate, filterEndDate, filterDurum]);

  const fetchSiparisler = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        orderType: 'SALE',
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
      params.siparisTipi = 'SATIS';

      const response = await axios.get('/orders', { params });

      const siparisData = response.data?.data || [];
      const totalCount = response.data?.meta?.total || response.data?.total || siparisData.length;

      setSiparisler(siparisData);
      setRowCount(totalCount);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Siparişler yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCariler = async () => {
    try {
      const response = await axios.get('/account', {
        params: { limit: 1000 },
      });
      setCariler(response.data.data || []);
    } catch (error) {
      console.error('Cariler yüklenirken hata:', error);
    }
  };

  const fetchStoklar = async () => {
    try {
      const response = await axios.get('/products', {
        params: { limit: 1000 },
      });
      setStoklar(response.data.data || []);
    } catch (error) {
      console.error('Stoklar yüklenirken hata:', error);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Excel Export
  const handleExportExcel = async () => {
    try {
      const params: Record<string, string> = { siparisTipi: 'SATIS' };
      if (searchTerm) params.search = searchTerm;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/orders/export/excel', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `satis_siparisler_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSnackbar('Excel dosyası indirildi', 'success');
    } catch (error: any) {
      showSnackbar('Excel aktarımı başarısız', 'error');
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterDurum([]);
    setFilterCariId('');
    setSearchTerm('');
  };

  const handleEdit = (row: Siparis) => {
    const tabId = `orders-sales-edit-${row.id}`;
    addTab({
      id: tabId,
      label: `Düzenle: ${row.orderNo}`,
      path: `/orders/sales/duzenle/${row.id}`,
    });
    setActiveTab(tabId);
    router.push(`/orders/sales/duzenle/${row.id}`);
  };

  const handleCreate = () => {
    addTab({ id: 'orders-sales-yeni', label: 'Yeni Satış Siparişi', path: '/orders/sales/yeni' });
    setActiveTab('orders-sales-yeni');
    router.push('/orders/sales/yeni');
  };

  const handleView = async (row: Siparis) => {
    try {
      const response = await axios.get(`/orders/${row.id}`);
      setSelectedSiparis(response.data);
      setOpenView(true);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Sipariş detayı yüklenirken hata oluştu', 'error');
    }
  };

  const handlePrint = (siparis: Siparis) => {
    window.open(`/orders/sales/print/${siparis.id}`, '_blank');
  };

  const handleHazirlama = (siparis: Siparis) => {
    router.push(`/orders/sales/hazirlama/${siparis.id}`);
  };

  const handleSevkOpen = async (siparis: Siparis) => {
    try {
      const response = await axios.get(`/orders/${siparis.id}`);
      const detail = response.data;
      setSevkSiparis(detail);
      // Pre-populate with remaining quantities
      const miktarlar: Record<string, number> = {};
      (detail.items || []).forEach((item: any) => {
        const remaining = (item.quantity || 0) - (item.deliveredQuantity || 0);
        miktarlar[item.id] = remaining > 0 ? remaining : 0;
      });
      setSevkMiktarlari(miktarlar);
      setSevkNotes('');
      setOpenSevk(true);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Sipariş detayı yüklenirken hata oluştu', 'error');
    }
  };

  const handleSevkSubmit = async () => {
    if (!sevkSiparis) return;
    const items = (Object.entries(sevkMiktarlari) as [string, number][])
      .filter(([, qty]) => qty > 0)
      .map(([itemId, shippedQuantity]) => ({ itemId, shippedQuantity }));
    if (items.length === 0) {
      showSnackbar('Lütfen en az bir kalem için sevk miktarı girin', 'error');
      return;
    }
    setSavingSevk(true);
    try {
      await axios.post(`/orders/${sevkSiparis.id}/ship`, {
        items,
        notes: sevkNotes || undefined,
      });
      showSnackbar('Sipariş başarıyla sevk edildi. İrsaliye oluşturuldu.', 'success');
      setOpenSevk(false);
      setSevkSiparis(null);
      fetchSiparisler();
      fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Sevk işlemi başarısız', 'error');
    } finally {
      setSavingSevk(false);
    }
  };

  const handleCreateIrsaliye = async (siparis: Siparis) => {
    try {
      setLoading(true);
      const response = await axios.post(`/orders/${siparis.id}/delivery-note`);
      showSnackbar('İrsaliye başarıyla oluşturuldu', 'success');
      router.push(`/sales-delivery-note/${response.data.id}`);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İrsaliye oluşturulurken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToInvoice = (siparis: Siparis) => {
    router.push(`/invoice/sales/yeni?siparisId=${siparis.id}`);
  };

  const handleDurumChange = async (yeniDurum: string) => {
    if (!selectedSiparis) return;
    try {
      await axios.put(`/orders/${selectedSiparis.id}/status`, { status: yeniDurum });
      showSnackbar(`Sipariş durumu "${orderStatusConfig[yeniDurum]?.label || yeniDurum}" olarak güncellendi`, 'success');
      fetchSiparisler();
      fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Durum değiştirilirken hata oluştu', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedSiparis) return;
    try {
      await axios.delete(`/orders/${selectedSiparis.id}`);
      showSnackbar('Sipariş başarıyla silindi', 'success');
      setOpenDelete(false);
      fetchSiparisler();
      fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Sipariş silinirken hata oluştu', 'error');
    }
  };

  const openIptalDialog = (siparis: Siparis) => {
    setSelectedSiparis(siparis);
    setOpenIptal(true);
  };

  const openDeleteDialog = (siparis: Siparis) => {
    setSelectedSiparis(siparis);
    setOpenDelete(true);
  };

  const handleIptal = async () => {
    if (!selectedSiparis) return;
    try {
      await axios.put(`/orders/${selectedSiparis.id}/cancel`);
      showSnackbar('Sipariş başarıyla iptal edildi', 'success');
      setOpenIptal(false);
      fetchSiparisler();
      fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İptal işlemi başarısız', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const getStatusLabel = (status: string) => {
    return orderStatusConfig[status]?.label || status;
  };

  const kpiData = useMemo(
    () =>
      stats
        ? {
          aylikSatis: { tutar: stats.monthlyOrders?.totalAmount || 0, adet: stats.monthlyOrders?.count || 0 },
          tahsilatBekleyen: { tutar: stats.pendingOrders?.totalAmount || 0, adet: stats.pendingOrders?.count || 0 },
          vadesiGecmis: { tutar: stats.completedOrders?.totalAmount || 0, adet: stats.completedOrders?.count || 0 },
        }
        : null,
    [stats]
  );

  const pageGrandTotal = useMemo(
    () => siparisler.reduce((sum, s) => sum + (s.grandTotal || 0), 0),
    [siparisler]
  );

  const fetchStats = async () => {
    try {
      const params: Record<string, any> = { orderType: 'SALE' };
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/orders/stats', {
        params
      });
      setStats(response.data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'orderNo',
      headerName: 'Sipariş No',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">{(params.value as string)}</Typography>
        </Box>
      )
    },
    {
      field: 'deliveryNotes',
      headerName: 'İrsaliye No',
      width: 110,
      renderCell: (params: GridRenderCellParams<Siparis>) => {
        const dns = params.value as Array<{ id: string, deliveryNoteNo: string }> || [];
        if (dns.length === 0) return '-';
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {dns.map((dn) => (
              <Chip
                key={dn.id}
                label={dn.deliveryNoteNo}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/sales-delivery-note/${dn.id}`);
                }}
                sx={{ height: 20, fontSize: '0.7rem', cursor: 'pointer' }}
              />
            ))}
          </Box>
        );
      }
    },
    {
      field: 'invoiceNo',
      headerName: 'Fatura No',
      width: 110,
      renderCell: (params: GridRenderCellParams<Siparis>) => {
        const row = params.row;
        const invs = row.invoiceNos || [];

        if (invs.length === 0) return '-';

        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {invs.map((inv) => (
              <Chip
                key={inv}
                label={inv}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  showSnackbar(`Fatura No: ${inv} - Fatura detayına yönlendiriliyor...`, 'info');
                }}
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'primary.200',
                  '&:hover': { bgcolor: 'primary.100' }
                }}
              />
            ))}
          </Box>
        );
      }
    },
    {
      field: 'date',
      headerName: 'Tarih',
      width: 110,
      valueFormatter: (value) => new Date(value).toLocaleDateString('tr-TR'),
    },
    {
      field: 'accountCode',
      headerName: 'Cari Kod',
      width: 80,
      valueGetter: (value, row) => row.account?.code || '',
    },
    {
      field: 'account',
      headerName: 'Cari Ünvan',
      width: 250,
      flex: 1,
      valueGetter: (value, row) => row.account?.title || '',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
      )
    },
    {
      field: 'shipmentRatio',
      headerName: 'Sevk Oranı',
      width: 100,
      valueGetter: (value: any, row: Siparis) => {
        const items = row.items || [];
        if (items.length === 0) return 0;
        const totalQuantity = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
        const totalDelivered = items.reduce((sum: number, item: any) => sum + (item.deliveredQuantity || 0), 0);
        return totalQuantity > 0 ? (totalDelivered / totalQuantity) * 100 : 0;
      },
      renderCell: (params: GridRenderCellParams) => {
        const ratio = params.value as number;
        let color: 'error' | 'warning' | 'success' | 'info' = 'error';
        if (ratio >= 99.9) color = 'success';
        else if (ratio > 0) color = 'warning';

        return (
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={ratio}
                color={color}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
            <Typography variant="caption" sx={{ minWidth: 35, fontWeight: 'bold' }}>
              %{Math.round(ratio)}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'dueDate',
      headerName: 'Vade',
      width: 110,
      valueFormatter: (value) => value ? new Date(value).toLocaleDateString('tr-TR') : '-',
    },
    {
      field: 'grandTotal',
      headerName: 'Tutar',
      width: 130,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
          <ArrowDownward sx={{ fontSize: 14, color: 'var(--chart-1)' }} />
          <Typography variant="body2" fontWeight="700" sx={{ color: 'var(--chart-1)' }}>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(params.value)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Durum',
      width: 100,
      renderCell: (params) => <OrderStatusBadge status={params.value} />
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 100,
      sortable: false,
      pinned: 'right',
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const isOpen = Boolean(anchorEl);
        const row = params.row as Siparis;
        const id = isOpen ? 'action-popover' : undefined;

        const canEdit = row.status !== 'SHIPPED' && row.status !== 'CANCELLED' && row.status !== 'INVOICED';
        const canShip = row.status === 'PENDING' || row.status === 'PREPARING' || row.status === 'PARTIALLY_SHIPPED';
        const canCancel = row.status !== 'CANCELLED' && row.status !== 'SHIPPED' && row.status !== 'INVOICED';
        const canDelete = row.status !== 'SHIPPED' && row.status !== 'CANCELLED' && row.status !== 'INVOICED';

        const ActionGroup = ({ title, children, color = 'default' }: { title: string; children: React.ReactNode; color?: 'primary' | 'success' | 'warning' | 'error' | 'default' }) => (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                py: 0.5,
                mb: 1,
                display: 'block',
                fontWeight: 700,
                fontSize: '0.65rem',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                color: color === 'primary' ? 'primary.main' : color === 'success' ? 'success.main' : color === 'warning' ? 'warning.main' : color === 'error' ? 'error.main' : 'text.secondary',
                bgcolor: color === 'primary' ? 'primary.50' : color === 'success' ? 'success.50' : color === 'warning' ? 'warning.50' : color === 'error' ? 'error.50' : 'action.hover',
                borderRadius: 1,
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {children}
            </Box>
          </Box>
        );

        const ActionItem = ({ icon, label, description, onClick, disabled, color = 'default', showArrow = false }: {
          icon: React.ReactElement;
          label: string;
          description?: string;
          onClick: () => void;
          disabled?: boolean;
          color?: 'primary' | 'success' | 'warning' | 'error' | 'default' | 'info';
          showArrow?: boolean;
        }) => {
          const colors = {
            primary: { bg: alpha('#1976d2', 0.08), hover: alpha('#1976d2', 0.16), icon: '#1976d2' },
            success: { bg: alpha('#059669', 0.08), hover: alpha('#059669', 0.16), icon: '#059669' },
            warning: { bg: alpha('#d97706', 0.08), hover: alpha('#d97706', 0.16), icon: '#d97706' },
            error: { bg: alpha('#dc2626', 0.08), hover: alpha('#dc2626', 0.16), icon: '#dc2626' },
            info: { bg: alpha('#0891b2', 0.08), hover: alpha('#0891b2', 0.16), icon: '#0891b2' },
            default: { bg: 'action.hover', hover: 'action.selected', icon: 'text.primary' },
          };
          const themeColor = colors[color];

          return (
            <MenuItem
              onClick={onClick}
              disabled={disabled}
              sx={{
                borderRadius: 2,
                py: 0.875,
                px: 1.5,
                mx: 0.5,
                mb: 0.5,
                bgcolor: themeColor.bg,
                '&:hover': {
                  bgcolor: themeColor.hover,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                },
                '&.Mui-disabled': { opacity: 0.5, bgcolor: 'action.disabledBackground' },
                transition: 'all 0.15s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: themeColor.icon }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                secondary={description}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600, fontSize: '0.8rem' }}
                secondaryTypographyProps={{ variant: 'caption', fontSize: '0.7rem' }}
              />
              {showArrow && <KeyboardArrowRight sx={{ fontSize: 18, color: 'text.secondary' }} />}
            </MenuItem>
          );
        };

        return (
          <>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Tooltip title="Görüntüle" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleView(row); }}
                  sx={{
                    bgcolor: alpha('#1976d2', 0.08),
                    '&:hover': { bgcolor: alpha('#1976d2', 0.2) },
                  }}
                >
                  <Visibility sx={{ fontSize: 16, color: '#1976d2' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Düzenle" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
                  disabled={!canEdit}
                  sx={{
                    bgcolor: canEdit ? alpha('#059669', 0.08) : 'action.disabledBackground',
                    '&:hover': canEdit ? { bgcolor: alpha('#059669', 0.2) } : {},
                  }}
                >
                  <Edit sx={{ fontSize: 16, color: canEdit ? '#059669' : 'text.disabled' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Diğer İşlemler" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                  }}
                  sx={{
                    bgcolor: alpha(theme.palette.text.primary, 0.05),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.text.primary, 0.12),
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    },
                    transition: 'all 0.15s ease',
                  }}
                >
                  <MoreHoriz sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Popover
              id={id}
              open={isOpen}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  sx: {
                    width: 280,
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    border: '1px solid',
                    borderColor: 'divider',
                    mt: 1,
                    elevation: 0,
                  },
                },
              }}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 200 }}
            >
              <Box sx={{ p: 2 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'var(--chart-1)' }}>
                    <ShoppingCart sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{row.orderNo}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.account?.title?.substring(0, 30)}{row.account?.title?.length > 30 ? '...' : ''}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => setAnchorEl(null)}>
                    <Close sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {/* Görüntüle & Düzenle */}
                  <ActionGroup title="Görüntüle & Düzenle" color="primary">
                    <ActionItem
                      icon={<Visibility fontSize="small" />}
                      label="Detayları Görüntüle"
                      description="Sipariş detaylarını görüntüle"
                      onClick={() => { setAnchorEl(null); handleView(row); }}
                    />
                    <ActionItem
                      icon={<Edit fontSize="small" />}
                      label="Düzenle"
                      description="Sipariş bilgilerini güncelle"
                      onClick={() => handleEdit(row)}
                      disabled={!canEdit}
                      color="primary"
                    />
                    <ActionItem
                      icon={<Print fontSize="small" />}
                      label="Yazdır"
                      description="Siparişi yazdır"
                      onClick={() => { setAnchorEl(null); handlePrint(row); }}
                    />
                  </ActionGroup>

                  {/* İşlem & Dönüştür */}
                  <ActionGroup title="İşlem & Dönüştür" color="warning">
                    <ActionItem
                      icon={<ContentCopy fontSize="small" />}
                      label="Kopyasını Oluştur"
                      description="Bu siparişten kopya oluştur"
                      onClick={() => {
                        setAnchorEl(null);
                        const path = `/orders/sales/yeni?kopyala=${row.id}`;
                        const tabId = `siparis-satis-kopyala-${row.id}`;
                        addTab({ id: tabId, label: `Kopya: ${row.orderNo}`, path });
                        setActiveTab(tabId);
                        router.push(path);
                      }}
                    />
                    {canShip && (
                      <ActionItem
                        icon={<LocalShipping fontSize="small" />}
                        label="Sevk Et"
                        description="İrsaliye oluştur ve sevk et"
                        onClick={() => { setAnchorEl(null); handleSevkOpen(row); }}
                        color="info"
                        showArrow
                      />
                    )}
                    {row.status === 'PREPARING' && (
                      <ActionItem
                        icon={<Inventory fontSize="small" />}
                        label="Sipariş Hazırla"
                        description="Hazırlama listesine git"
                        onClick={() => { setAnchorEl(null); handleHazirlama(row); }}
                        showArrow
                      />
                    )}
                    {(row.status === 'PREPARING' || row.status === 'PARTIALLY_SHIPPED') && (
                      <>
                        {(() => {
                          // Sevk oranını hesapla
                          const items = row.items || [];
                          const totalQuantity = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
                          const totalDelivered = items.reduce((sum: number, item: any) => sum + (item.deliveredQuantity || 0), 0);
                          const shipmentRatio = totalQuantity > 0 ? (totalDelivered / totalQuantity) * 100 : 0;
                          const isFullyShipped = shipmentRatio >= 99.9;

                          return (
                            <ActionItem
                              icon={<Receipt fontSize="small" />}
                              label="Faturaya Çevir"
                              description={!isFullyShipped ? `Sipariş %%${Math.round(shipmentRatio)} sevk edilmiş` : 'Fatura oluştur'}
                              onClick={() => { setAnchorEl(null); handleConvertToInvoice(row); }}
                              disabled={!isFullyShipped}
                              showArrow
                            />
                          );
                        })()}
                        <ActionItem
                          icon={<LocalShipping fontSize="small" />}
                          label="İrsaliye Oluştur"
                          description="Yeni irsaliye oluştur"
                          onClick={() => { setAnchorEl(null); handleCreateIrsaliye(row); }}
                          showArrow
                        />
                      </>
                    )}
                  </ActionGroup>

                  {/* Tehlikeli Bölge */}
                  <ActionGroup title="Tehlikeli Bölge" color="error">
                    <ActionItem
                      icon={<Cancel fontSize="small" />}
                      label="İptal Et"
                      description="Siparişi iptal et"
                      onClick={() => { setAnchorEl(null); openIptalDialog(row); }}
                      disabled={!canCancel}
                      color="error"
                    />
                    <ActionItem
                      icon={<Delete fontSize="small" />}
                      label="Sil"
                      description="Siparişi kalıcı olarak sil"
                      onClick={() => { setAnchorEl(null); openDeleteDialog(row); }}
                      disabled={!canDelete}
                      color="error"
                    />
                  </ActionGroup>
                </Box>
              </Box>
            </Popover>
          </>
        );
      }
    },
  ], []);

  return (
    <StandardPage maxWidth={false}>
      {/* Header & Aksiyon Butonları */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-1) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShoppingCart sx={{ color: 'var(--chart-1)', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="700" color="text.primary">
              Satış Siparişleri
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Müşteri siparişlerinizi yönetin
            </Typography>
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Assessment />}
            onClick={() => router.push('/raporlama/satis-elemani')}
            sx={{
              fontWeight: 600,
              fontSize: '0.8rem',
              px: 1.5,
              py: 0.75,
              minWidth: 0,
              boxShadow: 'none',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              '&:hover': {
                borderColor: 'var(--chart-1)',
                bgcolor: 'color-mix(in srgb, var(--chart-1) 8%, transparent)',
                boxShadow: 'none',
              }
            }}
          >
            Raporlar
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              bgcolor: 'var(--chart-1)',
              fontWeight: 600,
              fontSize: '0.8rem',
              px: 1.5,
              py: 0.75,
              minWidth: 0,
              boxShadow: 'none',
              color: 'var(--primary-foreground)',
              '&:hover': {
                bgcolor: 'color-mix(in srgb, var(--chart-1) 85%, var(--background))',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Yeni Sipariş
          </Button>
        </Stack>
      </Box>

      {/* Loading bar */}
      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1, height: 3 }} color="primary" />}

      {/* KPI Kartları */}
      <KPIHeader loading={loading} data={kpiData} type="SATIS" />

      {/* Entegre Toolbar ve DataGrid */}
      <StandardCard padding={0} sx={{ boxShadow: 'none', overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'var(--card)' }}>
          <TextField
            id="satis-siparis-search"
            size="small"
            placeholder="Sipariş Ara (No, Cari vb.)"
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
                  sx={{ borderRadius: 1, cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}
                />
              )
            })}
          </Stack>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
            <Tooltip title={showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}>
              <IconButton size="small" onClick={() => setShowFilters(!showFilters)} sx={showFilters ? {
                bgcolor: 'color-mix(in srgb, var(--chart-1) 12%, transparent)',
                color: 'var(--chart-1)',
                '&:hover': { bgcolor: 'color-mix(in srgb, var(--chart-1) 20%, transparent)' }
              } : {}}>
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excel İndir">
              <IconButton size="small" onClick={handleExportExcel}>
                <Download fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Yenile">
              <IconButton size="small" onClick={fetchSiparisler}>
                <RefreshOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ p: 2, bgcolor: 'var(--muted)', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <TextField
                  id="satis-siparis-filter-start-date"
                  fullWidth type="date" size="small" label="Başlangıç Tarihi"
                  value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <TextField
                  id="satis-siparis-filter-end-date"
                  fullWidth type="date" size="small" label="Bitiş Tarihi"
                  value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <FormControl fullWidth size="small">
                  <InputLabel>Durum</InputLabel>
                  <Select
                    multiple
                    value={filterDurum}
                    onChange={(e) => setFilterDurum(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                    label="Durum"
                    renderValue={(selected: any) => (selected as string[]).map(s => getStatusLabel(s)).join(', ')}
                  >
                    <MenuItem value="PENDING">Beklemede</MenuItem>
                    <MenuItem value="PREPARING">Onaylandı</MenuItem>
                    <MenuItem value="PARTIALLY_SHIPPED">Kısmi İhalet</MenuItem>
                    <MenuItem value="SHIPPED">Tamamlandı</MenuItem>
                    <MenuItem value="INVOICED">Faturalandı</MenuItem>
                    <MenuItem value="CANCELLED">İptal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <Autocomplete
                  id="sales-filter-cari-autocomplete"
                  size="small"
                  options={cariler}
                  getOptionLabel={(option: Cari) => `${option.accountCode} - ${option.title}`}
                  value={cariler.find(c => c.id === filterCariId) || null}
                  onChange={(_: any, newValue: Cari | null) => setFilterCariId(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Cari" id="sales-filter-cari" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <Button variant="outlined" color="secondary" fullWidth onClick={handleClearFilters} sx={{ height: '40px' }}>
                  Filtreleri Temizle
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* Tablo Satır Özeti */}
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Toplam <b>{rowCount}</b> sipariş listeleniyor
          </Typography>
        </Box>

        {/* DataGrid */}
        <Box sx={{ width: '100%' }}>
          <InvoiceDataGrid
            rows={siparisler}
            columns={columns}
            loading={loading}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onFilterModelChange={setFilterModel}
            checkboxSelection={false}
            height={900}
          />
        </Box>
        {/* Tablo footer sum */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Bu sayfadaki toplam <b>Tutar</b>:
          </Typography>
          <Typography variant="body2" fontWeight={800} sx={{ color: 'var(--chart-1)' }}>
            {formatCurrency(pageGrandTotal)}
          </Typography>
        </Box>
      </StandardCard>

      {/* Dialogs */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle component="div" sx={{
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          py: 1.5,
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--chart-1) 8%, var(--card)) 0%, var(--card) 100%)',
          borderBottom: '1px solid var(--border)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-1) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart sx={{ color: 'var(--chart-1)', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="700" sx={{ color: 'var(--foreground)' }}>Sipariş Detayı</Typography>
              <Typography variant="caption" color="text.secondary">{selectedSiparis?.orderNo}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedSiparis && <OrderStatusBadge status={selectedSiparis.status} />}
            <IconButton size="small" onClick={() => setOpenView(false)} edge="end">
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedSiparis && (
            <Box sx={{ mt: 0 }}>
              {/* 4-kolonlu grid header */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderBottom: '1px solid var(--border)' }}>
                <Box sx={{ p: 2, borderRight: '1px solid var(--border)' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>Tarih</Typography>
                  <Typography variant="body2" fontWeight="600">{formatDate(selectedSiparis.date)}</Typography>
                </Box>
                <Box sx={{ p: 2, borderRight: '1px solid var(--border)' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>Vade</Typography>
                  <Typography variant="body2" fontWeight="600">{selectedSiparis.dueDate ? formatDate(selectedSiparis.dueDate) : '-'}</Typography>
                </Box>
                <Box sx={{ p: 2, borderRight: '1px solid var(--border)' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>Cari Kod</Typography>
                  <Typography variant="body2" fontWeight="600">{selectedSiparis.account?.code || '-'}</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>Cari Ünvan</Typography>
                  <Typography variant="body2" fontWeight="600">{selectedSiparis.account?.title || '-'}</Typography>
                </Box>
              </Box>

              {selectedSiparis.items && selectedSiparis.items.length > 0 && (
                <Box sx={{ mb: 0 }}>
                  <Typography variant="subtitle2" sx={{ p: 1.5, pb: 1, fontWeight: 700, color: 'var(--foreground)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Kalemler</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ mx: 1.5, borderRadius: 2, boxShadow: 'none', border: '1px solid var(--border)' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Malzeme Kodu</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Stok</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Miktar</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sevk Edilen</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Birim Fiyat</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>KDV %</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tutar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedSiparis.items.map((kalem: any, index: any) => (
                          <TableRow key={index} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#fafafa' } }}>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{kalem.product?.code || '-'}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{kalem.product?.name || '-'}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{kalem.quantity}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{kalem.deliveredQuantity || 0}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{formatCurrency(kalem.unitPrice)}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>%{kalem.vatRate}</TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                              {formatCurrency((Number(kalem.amount) || 0) + (Number(kalem.vatAmount) || 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              <Paper variant="outlined" sx={{ m: 1.5, p: 2.5, bgcolor: 'var(--card)', borderRadius: 2, border: '1px solid var(--border)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--chart-1) 5%, var(--card)) 0%, var(--card) 100%)', position: 'sticky', bottom: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                    <Typography variant="body2" color="text.secondary">Ara Toplam:</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formatCurrency(Number(selectedSiparis.totalAmount || 0))}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                    <Typography variant="body2" color="text.secondary">İskonto:</Typography>
                    <Typography variant="body2" fontWeight="600" color="error.main">
                      -{formatCurrency(selectedSiparis.discount || 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                    <Typography variant="body2" color="text.secondary">KDV Toplamı:</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {formatCurrency(selectedSiparis.vatAmount || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ width: '280px', my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '280px', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="800">Genel Toplam:</Typography>
                    <Typography variant="h6" fontWeight="900" sx={{ color: 'var(--chart-1)' }}>
                      {formatCurrency(selectedSiparis.grandTotal)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Audit Bilgileri */}
              <Accordion variant="outlined" sx={{ bgcolor: 'color-mix(in srgb, var(--chart-1) 10%, transparent)', mt: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary
                  expandIcon={<ExpandMore color="primary" />}
                  sx={{
                    minHeight: '48px',
                    '& .MuiAccordionSummary-content': { my: 1 }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--chart-1)' }}>
                    📋 Denetim Bilgileri
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Oluşturan:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {selectedSiparis.createdByUser?.fullName || 'Sistem'}
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                            ({selectedSiparis.createdByUser?.username || '-'})
                          </Typography>
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Oluşturma Tarihi:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {selectedSiparis.createdAt
                            ? new Date(selectedSiparis.createdAt).toLocaleString('tr-TR')
                            : '-'}
                        </Typography>
                      </Box>
                    </Box>

                    {selectedSiparis.updatedByUser && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Son Güncelleyen:
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {selectedSiparis.updatedByUser.fullName}
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                              ({selectedSiparis.updatedByUser.username})
                            </Typography>
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Son Güncelleme:
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {selectedSiparis.updatedAt
                              ? new Date(selectedSiparis.updatedAt).toLocaleString('tr-TR')
                              : '-'}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {selectedSiparis.logs && selectedSiparis.logs.length > 0 && (
                      <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid var(--border)' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                          Son İşlemler:
                        </Typography>
                        {selectedSiparis.logs.slice(0, 3).map((log: any, index: number) => (
                          <Typography key={index} variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
                            • {new Date(log.createdAt).toLocaleString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} - {log.actionType || log.message}
                            {log.user && ` (${log.user.fullName})`}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5, borderTop: '1px solid var(--border)' }}>
          <Button onClick={() => setOpenView(false)} variant="outlined" sx={{ borderColor: 'var(--border)' }}>Kapat</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
        <DialogTitle component="div" sx={{
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1.5,
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--destructive) 10%, var(--card)) 0%, var(--card) 100%)',
          borderBottom: '1px solid var(--border)',
        }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--destructive) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Delete sx={{ color: 'var(--destructive)', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight="700">Sipariş Sil</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <Typography>
            <strong>{selectedSiparis?.orderNo}</strong> nolu siparişi silmek istediğinizden emin misiniz?
          </Typography>
          <Typography variant="body2" color="error.main" sx={{ mt: 2 }}>
            Bu işlem geri alınamaz!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 2, gap: 1 }}>
          <Button onClick={() => setOpenDelete(false)} variant="outlined" sx={{ borderColor: 'var(--border)', minWidth: 90 }}>İptal</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ minWidth: 90 }}>
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openIptal} onClose={() => setOpenIptal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{
          background: 'linear-gradient(135deg, var(--destructive) 0%, var(--destructive) 100%)',
          color: 'var(--primary-foreground)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
        }}>
          Sipariş İptal
          <IconButton size="small" onClick={() => setOpenIptal(false)} sx={{ color: 'var(--primary-foreground)' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedSiparis && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Bu işlem geri alınamaz!
                </Typography>
              </Alert>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>{selectedSiparis.orderNo}</strong> nolu siparişi iptal etmek istediğinizden emin misiniz?
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenIptal(false)}>Vazgeç</Button>
          <Button
            onClick={handleIptal}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, var(--destructive) 0%, var(--destructive) 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--destructive) 0%, var(--destructive) 100%)',
              }
            }}
          >
            İptal Et
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sevk Et Diyaloğu */}
      <Dialog
        open={openSevk}
        onClose={() => !savingSevk && setOpenSevk(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle component="div" sx={{
          background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping />
            Sipariş Sevk Et — {sevkSiparis?.orderNo}
          </Box>
          <IconButton size="small" onClick={() => setOpenSevk(false)} disabled={savingSevk} sx={{ color: '#fff' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {sevkSiparis && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Her kalem için sevk etmek istediğiniz miktarı girin. Kalan miktar siparişte bekleyecek.
                </Typography>
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Cari: <strong>{sevkSiparis.account?.title}</strong>
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Ürün</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Birim</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Sipariş Miktarı</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Daha Önce Sevk</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Kalan</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: '#0891b2' }}>Sevk Edilecek</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(sevkSiparis.items || []).map((kalem: any) => {
                      const remaining = (kalem.quantity || 0) - (kalem.deliveredQuantity || 0);
                      return (
                        <TableRow key={kalem.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>{kalem.product?.name || '-'}</Typography>
                            <Typography variant="caption" color="text.secondary">{kalem.product?.code || ''}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">{kalem.product?.unit || '-'}</Typography>
                          </TableCell>
                          <TableCell align="center">{kalem.quantity}</TableCell>
                          <TableCell align="center">{kalem.deliveredQuantity || 0}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={remaining}
                              size="small"
                              color={remaining > 0 ? 'warning' : 'success'}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ width: 120 }}>
                            <TextField
                              type="number"
                              size="small"
                              value={sevkMiktarlari[kalem.id] ?? ''}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(remaining, parseInt(e.target.value) || 0));
                                setSevkMiktarlari(prev => ({ ...prev, [kalem.id]: val }));
                              }}
                              inputProps={{ min: 0, max: remaining, style: { textAlign: 'center' } }}
                              disabled={remaining <= 0}
                              sx={{ width: 90 }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Sevk Notu (opsiyonel)"
                value={sevkNotes}
                onChange={(e) => setSevkNotes(e.target.value)}
                placeholder="İrsaliye notları..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenSevk(false)} disabled={savingSevk}>Vazgeç</Button>
          <Button
            onClick={handleSevkSubmit}
            variant="contained"
            disabled={savingSevk}
            startIcon={savingSevk ? <CircularProgress size={16} /> : <LocalShipping />}
            sx={{ bgcolor: '#0891b2', '&:hover': { bgcolor: '#0e7490' } }}
          >
            {savingSevk ? 'Sevk Ediliyor...' : 'Sevk Et & İrsaliye Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StandardPage>
  );
}
