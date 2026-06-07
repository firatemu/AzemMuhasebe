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
  ArrowUpward,
  FilterList,
  ExpandMore,
  MoreHoriz,
  Receipt,
  ShoppingCart,
  Assignment,
  LocalShipping,
  ContentCopy,
  CheckCircle,
  KeyboardArrowRight,
  Inventory,
  Undo,
  Restore,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Autocomplete,
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
  Avatar,
  alpha,
  useTheme,
} from '@mui/material';
import { GridColDef, GridRenderCellParams, GridPaginationModel, GridSortModel, GridFilterModel } from '@mui/x-data-grid';
import KPIHeader from '@/components/Fatura/KPIHeader';
import InvoiceDataGrid from '@/components/Fatura/InvoiceDataGrid';
import { StandardCard, StandardPage } from '@/components/common';

interface Cari {
  id: string;
  accountCode?: string;
  code?: string;
  title: string;
  type?: string;
}

interface SiparisKalemi {
  id: string;
  productId: string;
  product?: { id: string; name: string; code: string; unit?: string };
  quantity: number;
  receivedQuantity?: number;
  unitPrice: number;
  vatRate: number;
  discountRate?: number;
  discountAmount?: number;
  amount?: number;
  vatAmount?: number;
}

interface ProcurementOrder {
  id: string;
  orderNo: string;
  date: string;
  dueDate?: string | null;
  account: Cari;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  status: string;
  discount?: number;
  notes?: string;
  invoiceNo?: string | null;
  invoiceNos?: string[];
  deliveryNotes?: Array<{ id: string; deliveryNoteNo: string }>;
  items?: SiparisKalemi[];
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

const purchaseStatusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactElement }> = {
  PENDING: {
    label: 'Beklemede',
    color: '#d97706',
    bgColor: 'color-mix(in srgb, #d97706 15%, transparent)',
    icon: <Assignment sx={{ fontSize: 16 }} />,
  },
  APPROVED: {
    label: 'Onaylandı',
    color: '#2563eb',
    bgColor: 'color-mix(in srgb, #2563eb 15%, transparent)',
    icon: <CheckCircle sx={{ fontSize: 16 }} />,
  },
  PARTIALLY_RECEIVED: {
    label: 'Kısmi Teslim',
    color: '#0891b2',
    bgColor: 'color-mix(in srgb, #0891b2 15%, transparent)',
    icon: <LocalShipping sx={{ fontSize: 16 }} />,
  },
  COMPLETED: {
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
};

function PurchaseStatusBadge({ status }: { status: string }) {
  const config = purchaseStatusConfig[status] || {
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
        '& .MuiChip-icon': { color: 'inherit', ml: 0.5 },
      }}
    />
  );
}

export default function SatinAlmaSiparisleriPage() {
  const theme = useTheme();
  const { addTab, setActiveTab } = useTabStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [siparisler, setSiparisler] = useState<ProcurementOrder[]>([]);
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [rowCount, setRowCount] = useState(0);

  // Dialog states
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openIptal, setOpenIptal] = useState(false);
  const [openTeslim, setOpenTeslim] = useState(false);
  const [selectedSiparis, setSelectedSiparis] = useState<ProcurementOrder | null>(null);
  const [teslimSiparis, setTeslimSiparis] = useState<ProcurementOrder | null>(null);
  const [teslimMiktarlari, setTeslimMiktarlari] = useState<Record<string, number>>({});
  const [teslimNotes, setTeslimNotes] = useState('');
  const [savingTeslim, setSavingTeslim] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDurum, setFilterDurum] = useState<string[]>([]);
  const [filterCariId, setFilterCariId] = useState('');

  useEffect(() => {
    addTab({ id: 'orders-purchase', label: 'Satın Alma Siparişleri', path: '/purchase-orders' });
  }, [addTab]);

  useEffect(() => {
    fetchSiparisler();
    fetchCariler();
    fetchStats();
  }, [paginationModel, sortModel, filterModel, filterCariId, filterStartDate, filterEndDate, filterDurum]);

  const fetchSiparisler = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: sortModel[0]?.field || 'createdAt',
        sortOrder: sortModel[0]?.sort || 'desc',
      };
      if (searchTerm) params.search = searchTerm;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/purchase-orders', { params });
      setSiparisler(response.data?.data || []);
      setRowCount(response.data?.meta?.total ?? response.data?.total ?? 0);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Siparişler yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCariler = async () => {
    try {
      const response = await axios.get('/account', { params: { limit: 1000 } });
      setCariler(response.data?.data || []);
    } catch (error) { console.error('Cariler yüklenirken hata:', error); }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchStats = async () => {
    try {
      const params: Record<string, any> = {};
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;
      const response = await axios.get('/purchase-orders/stats', { params, validateStatus: () => true });
      if (response.status >= 200 && response.status < 300) {
        setStats(response.data);
      } else {
        setStats(null);
      }
    } catch {
      // Backend endpoint not available yet; silently skip stats
      setStats(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;
      const response = await axios.get('/purchase-orders/export/excel', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `satin_alma_siparisler_${new Date().toISOString().split('T')[0]}.xlsx`);
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
    setFilterStartDate(''); setFilterEndDate(''); setFilterDurum([]); setFilterCariId(''); setSearchTerm('');
  };

  const handleEdit = (row: ProcurementOrder) => {
    const tabId = `purchase-orders-edit-${row.id}`;
    addTab({ id: tabId, label: `Düzenle: ${row.orderNo}`, path: `/purchase-orders/duzenle/${row.id}` });
    setActiveTab(tabId);
    router.push(`/purchase-orders/duzenle/${row.id}`);
  };

  const handleCreate = () => {
    addTab({ id: 'purchase-orders-yeni', label: 'Yeni Satın Alma Siparişi', path: '/purchase-orders/yeni' });
    setActiveTab('purchase-orders-yeni');
    router.push('/purchase-orders/yeni');
  };

  const handleView = async (row: ProcurementOrder) => {
    try {
      const response = await axios.get(`/purchase-orders/${row.id}`);
      setSelectedSiparis(response.data);
      setOpenView(true);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Sipariş detayı yüklenirken hata oluştu', 'error');
    }
  };

  const handlePrint = (siparis: ProcurementOrder) => {
    window.open(`/purchase-orders/print/${siparis.id}`, '_blank');
  };

  const handleTeslimOpen = async (siparis: ProcurementOrder) => {
    try {
      const response = await axios.get(`/purchase-orders/${siparis.id}`);
      const detail = response.data;
      setTeslimSiparis(detail);
      const miktarlar: Record<string, number> = {};
      (detail.items || []).forEach((item: any) => {
        const remaining = (item.quantity || 0) - (item.receivedQuantity || 0);
        miktarlar[item.id] = remaining > 0 ? remaining : 0;
      });
      setTeslimMiktarlari(miktarlar);
      setTeslimNotes('');
      setOpenTeslim(true);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Sipariş detayı yüklenirken hata oluştu', 'error');
    }
  };

  const handleTeslimSubmit = async () => {
    if (!teslimSiparis) return;
    // receive endpoint expects productId-based items
    const itemsWithProductId = (teslimSiparis.items || [])
      .filter((kalem: any) => teslimMiktarlari[kalem.id] > 0)
      .map((kalem: any) => ({ productId: kalem.productId, quantity: teslimMiktarlari[kalem.id] }));
    if (itemsWithProductId.length === 0) {
      showSnackbar('Lütfen en az bir kalem için teslim miktarı girin', 'error');
      return;
    }
    setSavingTeslim(true);
    try {
      await axios.post(`/purchase-orders/${teslimSiparis.id}/receive`, {
        items: itemsWithProductId,
        notes: teslimNotes || undefined,
      });
      showSnackbar('Teslim alındı. İrsaliye oluşturuldu.', 'success');
      setOpenTeslim(false);
      setTeslimSiparis(null);
      fetchSiparisler();
      fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Teslim alma işlemi başarısız', 'error');
    } finally {
      setSavingTeslim(false);
    }
  };

  const handleConvertToInvoice = (siparis: ProcurementOrder) => {
    router.push(`/invoice/purchase/yeni?siparisId=${siparis.id}`);
  };

  const handleDelete = async () => {
    if (!selectedSiparis) return;
    try {
      await axios.delete(`/purchase-orders/${selectedSiparis.id}`);
      showSnackbar('Sipariş başarıyla silindi', 'success');
      setOpenDelete(false);
      fetchSiparisler(); fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Sipariş silinirken hata oluştu', 'error');
    }
  };

  const handleIptal = async () => {
    if (!selectedSiparis) return;
    try {
      await axios.put(`/purchase-orders/${selectedSiparis.id}/cancel`);
      showSnackbar('Sipariş başarıyla iptal edildi', 'success');
      setOpenIptal(false);
      fetchSiparisler(); fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İptal işlemi başarısız', 'error');
    }
  };

  const handleRestore = async (siparis: ProcurementOrder) => {
    try {
      await axios.put(`/purchase-orders/${siparis.id}/restore`);
      showSnackbar('Sipariş başarıyla geri yüklendi', 'success');
      fetchSiparisler(); fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Geri yükleme işlemi başarısız', 'error');
    }
  };

  const handleStatusChange = async (siparis: ProcurementOrder, newStatus: string) => {
    try {
      await axios.put(`/purchase-orders/${siparis.id}/status`, { status: newStatus });
      showSnackbar(`Sipariş durumu "${newStatus}" olarak güncellendi`, 'success');
      fetchSiparisler(); fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Durum güncelleme başarısız', 'error');
    }
  };

  const handleMarkInvoiced = async (siparis: ProcurementOrder) => {
    try {
      await axios.put(`/purchase-orders/${siparis.id}/invoiced`);
      showSnackbar('Sipariş faturalandı olarak işaretlendi', 'success');
      fetchSiparisler(); fetchStats();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Faturalandı işaretleme başarısız', 'error');
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  const getStatusLabel = (status: string) => purchaseStatusConfig[status]?.label || status;

  const kpiData = useMemo(() => stats ? {
    aylikSatis: { tutar: stats.monthlyOrders?.totalAmount || 0, adet: stats.monthlyOrders?.count || 0 },
    tahsilatBekleyen: { tutar: stats.pendingOrders?.totalAmount || 0, adet: stats.pendingOrders?.count || 0 },
    vadesiGecmis: { tutar: stats.completedOrders?.totalAmount || 0, adet: stats.completedOrders?.count || 0 },
  } : null, [stats]);

  const pageGrandTotal = useMemo(() => siparisler.reduce((sum, s) => sum + (s.grandTotal || 0), 0), [siparisler]);

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'orderNo', headerName: 'Sipariş No', width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Box><Typography variant="body2" fontWeight="bold">{params.value as string}</Typography></Box>
      ),
    },
    {
      field: 'deliveryNotes', headerName: 'İrsaliye No', width: 110,
      renderCell: (params: GridRenderCellParams<ProcurementOrder>) => {
        const dns = params.value as Array<{ id: string; deliveryNoteNo: string }> || [];
        if (dns.length === 0) return '-';
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {dns.map((dn) => (
              <Chip key={dn.id} label={dn.deliveryNoteNo} size="small"
                onClick={(e) => { e.stopPropagation(); router.push(`/purchase-delivery-note/${dn.id}`); }}
                sx={{ height: 20, fontSize: '0.7rem', cursor: 'pointer' }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      field: 'invoiceNo', headerName: 'Fatura No', width: 110,
      renderCell: (params: GridRenderCellParams<ProcurementOrder>) => {
        const invs = params.row.invoiceNos || [];
        if (invs.length === 0) return '-';
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {invs.map((inv) => (
              <Chip key={inv} label={inv} size="small"
                onClick={(e) => { e.stopPropagation(); showSnackbar(`Fatura No: ${inv}`, 'info'); }}
                sx={{ height: 20, fontSize: '0.7rem', cursor: 'pointer', bgcolor: 'primary.50', color: 'primary.main', border: '1px solid', borderColor: 'primary.200' }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      field: 'date', headerName: 'Tarih', width: 110,
      valueFormatter: (value) => new Date(value).toLocaleDateString('tr-TR'),
    },
    { field: 'accountCode', headerName: 'Cari Kod', width: 80, valueGetter: (_value: any, row: ProcurementOrder) => row.account?.code || '' },
    {
      field: 'account', headerName: 'Cari Ünvan', width: 250, flex: 1,
      valueGetter: (_value: any, row: ProcurementOrder) => row.account?.title || '',
      renderCell: (params) => <Typography variant="body2" fontWeight="medium">{params.value}</Typography>,
    },
    {
      field: 'receivedRatio', headerName: 'Alım Oranı', width: 100,
      valueGetter: (_value: any, row: ProcurementOrder) => {
        const items = row.items || [];
        if (items.length === 0) return 0;
        const totalQty = items.reduce((s, i) => s + (i.quantity || 0), 0);
        const totalRec = items.reduce((s, i) => s + (i.receivedQuantity || 0), 0);
        return totalQty > 0 ? (totalRec / totalQty) * 100 : 0;
      },
      renderCell: (params: GridRenderCellParams) => {
        const ratio = params.value as number;
        let color: 'error' | 'warning' | 'success' = 'error';
        if (ratio >= 99.9) color = 'success';
        else if (ratio > 0) color = 'warning';
        return (
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress variant="determinate" value={ratio} color={color} sx={{ height: 6, borderRadius: 3 }} />
            </Box>
            <Typography variant="caption" sx={{ minWidth: 35, fontWeight: 'bold' }}>%{Math.round(ratio)}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'dueDate', headerName: 'Vade', width: 110,
      valueFormatter: (value) => value ? new Date(value).toLocaleDateString('tr-TR') : '-',
    },
    {
      field: 'grandTotal', headerName: 'Tutar', width: 130, type: 'number', align: 'right', headerAlign: 'right',
      valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
          <ArrowUpward sx={{ fontSize: 14, color: 'var(--chart-2)' }} />
          <Typography variant="body2" fontWeight="700" sx={{ color: 'var(--chart-2)' }}>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status', headerName: 'Durum', width: 100,
      renderCell: (params) => <PurchaseStatusBadge status={params.value} />,
    },
    {
      field: 'actions', headerName: 'İşlemler', width: 100, sortable: false, pinned: 'right',
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const isOpen = Boolean(anchorEl);
        const row = params.row as ProcurementOrder;
        const id = isOpen ? 'purchase-action-popover' : undefined;

        const canEdit = row.status !== 'COMPLETED' && row.status !== 'CANCELLED' && row.status !== 'INVOICED';
        const canReceive = row.status === 'PENDING' || row.status === 'APPROVED' || row.status === 'PARTIALLY_RECEIVED';
        const canCancel = row.status !== 'CANCELLED' && row.status !== 'COMPLETED' && row.status !== 'INVOICED';
        const canDelete = row.status !== 'COMPLETED' && row.status !== 'CANCELLED' && row.status !== 'INVOICED';

        const ActionItem = ({ icon, label, description, onClick, disabled = false, color = 'default', showArrow = false }: {
          icon: React.ReactElement; label: string; description?: string; onClick: () => void;
          disabled?: boolean; color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default'; showArrow?: boolean;
        }) => {
          const colorMap = {
            primary: { bg: alpha('#1976d2', 0.08), hover: alpha('#1976d2', 0.16), icon: '#1976d2' },
            success: { bg: alpha('#059669', 0.08), hover: alpha('#059669', 0.16), icon: '#059669' },
            warning: { bg: alpha('#d97706', 0.08), hover: alpha('#d97706', 0.16), icon: '#d97706' },
            error: { bg: alpha('#dc2626', 0.08), hover: alpha('#dc2626', 0.16), icon: '#dc2626' },
            info: { bg: alpha('#0891b2', 0.08), hover: alpha('#0891b2', 0.16), icon: '#0891b2' },
            default: { bg: 'action.hover', hover: 'action.selected', icon: 'text.primary' },
          };
          const c = colorMap[color];
          return (
            <MenuItem onClick={onClick} disabled={disabled} sx={{ borderRadius: 2, py: 1, px: 1.5, mx: 0, bgcolor: c.bg, '&:hover': { bgcolor: c.hover }, '&.Mui-disabled': { opacity: 0.5, bgcolor: 'action.disabledBackground' } }}>
              <ListItemIcon sx={{ minWidth: 36, color: c.icon }}>{icon}</ListItemIcon>
              <ListItemText primary={label} secondary={description}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600, fontSize: '0.8rem' }}
                secondaryTypographyProps={{ variant: 'caption', fontSize: '0.7rem' }} />
              {showArrow && <KeyboardArrowRight sx={{ fontSize: 18, color: 'text.secondary' }} />}
            </MenuItem>
          );
        };

        return (
          <>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Tooltip title="Görüntüle" arrow>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleView(row); }}
                  sx={{ bgcolor: alpha('#1976d2', 0.08), '&:hover': { bgcolor: alpha('#1976d2', 0.2) } }}>
                  <Visibility sx={{ fontSize: 16, color: '#1976d2' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Düzenle" arrow>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(row); }} disabled={!canEdit}
                  sx={{ bgcolor: canEdit ? alpha('#059669', 0.08) : 'action.disabledBackground', '&:hover': canEdit ? { bgcolor: alpha('#059669', 0.2) } : {} }}>
                  <Edit sx={{ fontSize: 16, color: canEdit ? '#059669' : 'text.disabled' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Diğer İşlemler" arrow>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}
                  sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.12) } }}>
                  <MoreHoriz sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Popover id={id} open={isOpen} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { sx: { width: 280, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid', borderColor: 'divider', mt: 1 } } }}
              TransitionComponent={Fade} TransitionProps={{ timeout: 200 }}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'var(--chart-2)' }}>
                    <ShoppingCart sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{row.orderNo}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.account?.title?.substring(0, 30)}{(row.account?.title?.length || 0) > 30 ? '...' : ''}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => setAnchorEl(null)}><Close sx={{ fontSize: 18 }} /></IconButton>
                </Box>

                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ px: 1.5, py: 0.5, mb: 1, display: 'block', fontWeight: 700, fontSize: '0.65rem', letterSpacing: 0.5, textTransform: 'uppercase', color: 'primary.main', bgcolor: 'primary.50', borderRadius: 1 }}>Görüntüle &amp; Düzenle</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <ActionItem icon={<Visibility fontSize="small" />} label="Detayları Görüntüle" onClick={() => { setAnchorEl(null); handleView(row); }} />
                      <ActionItem icon={<Edit fontSize="small" />} label="Düzenle" onClick={() => { setAnchorEl(null); handleEdit(row); }} disabled={!canEdit} color="success" />
                      <ActionItem icon={<Print fontSize="small" />} label="Yazdır" onClick={() => { setAnchorEl(null); handlePrint(row); }} />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ px: 1.5, py: 0.5, mb: 1, display: 'block', fontWeight: 700, fontSize: '0.65rem', letterSpacing: 0.5, textTransform: 'uppercase', color: 'warning.main', bgcolor: 'warning.50', borderRadius: 1 }}>İşlem &amp; Dönüştür</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <ActionItem icon={<ContentCopy fontSize="small" />} label="Kopyasını Oluştur"
                        onClick={() => {
                          setAnchorEl(null);
                          const path = `/purchase-orders/yeni?kopyala=${row.id}`;
                          const tabId = `purchase-orders-kopyala-${row.id}`;
                          addTab({ id: tabId, label: `Kopya: ${row.orderNo}`, path });
                          setActiveTab(tabId);
                          router.push(path);
                        }} />
                      {canReceive && (
                        <ActionItem icon={<Inventory fontSize="small" />} label="Teslim Al" description="İrsaliye oluştur ve teslim al"
                          onClick={() => { setAnchorEl(null); handleTeslimOpen(row); }} color="info" showArrow />
                      )}
                      {(row.status === 'PARTIALLY_RECEIVED' || row.status === 'COMPLETED') && (
                        <ActionItem icon={<Receipt fontSize="small" />} label="Faturaya Çevir"
                          onClick={() => { setAnchorEl(null); handleConvertToInvoice(row); }} showArrow />
                      )}
                      {row.status === 'CANCELLED' && (
                        <ActionItem icon={<Undo fontSize="small" />} label="Geri Yükle"
                          onClick={() => { setAnchorEl(null); handleRestore(row); }} color="warning" />
                      )}
                      {row.status !== 'CANCELLED' && (
                        <ActionItem icon={<Assignment fontSize="small" />} label="Durumu Güncelle"
                          onClick={() => {
                            setAnchorEl(null);
                            const newStatus = row.status === 'PENDING' ? 'APPROVED' : 'PENDING';
                            handleStatusChange(row, newStatus);
                          }} color="info" />
                      )}
                      {row.status !== 'INVOICED' && (row.status === 'APPROVED' || row.status === 'PARTIALLY_RECEIVED') && (
                        <ActionItem icon={<Receipt fontSize="small" />} label="Faturalandı İşaretle"
                          onClick={() => { setAnchorEl(null); handleMarkInvoiced(row); }} color="success" />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ px: 1.5, py: 0.5, mb: 1, display: 'block', fontWeight: 700, fontSize: '0.65rem', letterSpacing: 0.5, textTransform: 'uppercase', color: 'error.main', bgcolor: 'error.50', borderRadius: 1 }}>Tehlikeli Bölge</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <ActionItem icon={<Cancel fontSize="small" />} label="İptal Et" onClick={() => { setAnchorEl(null); setSelectedSiparis(row); setOpenIptal(true); }} disabled={!canCancel} color="error" />
                      <ActionItem icon={<Delete fontSize="small" />} label="Sil" onClick={() => { setAnchorEl(null); setSelectedSiparis(row); setOpenDelete(true); }} disabled={!canDelete} color="error" />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Popover>
          </>
        );
      },
    },
  ], []);

  return (
    <StandardPage maxWidth={false}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--chart-1) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShoppingCart sx={{ color: 'var(--chart-1)', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="700" color="text.primary">Satın Alma Siparişleri</Typography>
            <Typography variant="caption" color="text.secondary">Tedarikçi siparişlerinizi yönetin</Typography>
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" size="small" startIcon={<Assessment />}
            onClick={() => router.push('/raporlama/satin-alma')}
            sx={{
              fontWeight: 600, fontSize: '0.8rem', px: 1.5, py: 0.75, minWidth: 0, boxShadow: 'none',
              borderColor: 'var(--border)', color: 'var(--foreground)',
              '&:hover': {
                borderColor: 'var(--chart-1)', bgcolor: 'color-mix(in srgb, var(--chart-1) 8%, transparent)', boxShadow: 'none',
              }
            }}>
            Raporlar
          </Button>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={handleCreate}
            sx={{
              bgcolor: 'var(--chart-1)', fontWeight: 600, fontSize: '0.8rem', px: 1.5, py: 0.75, minWidth: 0, boxShadow: 'none',
              color: 'var(--primary-foreground)',
              '&:hover': { bgcolor: 'color-mix(in srgb, var(--chart-1) 85%, var(--background))', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transform: 'translateY(-1px)' },
              transition: 'all 0.2s ease',
            }}>
            Yeni Sipariş
          </Button>
        </Stack>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1, height: 3 }} color="primary" />}

      <KPIHeader loading={loading} data={kpiData} type="ALIS" />

      <StandardCard padding={0} sx={{ boxShadow: 'none', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'var(--card)' }}>
          <TextField id="purchase-siparis-search" size="small" placeholder="Sipariş Ara (No, Cari vb.)"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
              endAdornment: searchTerm && (<IconButton size="small" onClick={() => setSearchTerm('')}><Close fontSize="small" /></IconButton>),
            }} />

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {['TÜMÜ', 'BUGÜN', 'BU HAFTA', 'BU AY', 'BU YIL'].map((label) => {
              const today = new Date();
              const toISODate = (d: Date) => d.toISOString().split('T')[0];
              const getRange = (l: string) => {
                if (l === 'TÜMÜ') return { start: '', end: '' };
                if (l === 'BUGÜN') return { start: toISODate(today), end: toISODate(today) };
                if (l === 'BU HAFTA') {
                  const day = today.getDay();
                  const monday = new Date(today);
                  monday.setDate(today.getDate() + (day === 0 ? -6 : 1 - day));
                  const sunday = new Date(monday);
                  sunday.setDate(monday.getDate() + 6);
                  return { start: toISODate(monday), end: toISODate(sunday) };
                }
                if (l === 'BU AY') return { start: toISODate(new Date(today.getFullYear(), today.getMonth(), 1)), end: toISODate(today) };
                if (l === 'BU YIL') return { start: toISODate(new Date(today.getFullYear(), 0, 1)), end: toISODate(today) };
                return { start: '', end: '' };
              };
              const range = getRange(label);
              const isSelected = label === 'TÜMÜ' ? !filterStartDate && !filterEndDate : filterStartDate === range.start && filterEndDate === range.end;
              return (
                <Chip key={label} label={label}
                  onClick={() => { if (label === 'TÜMÜ') { setFilterStartDate(''); setFilterEndDate(''); } else { setFilterStartDate(range.start); setFilterEndDate(range.end); } }}
                  variant={isSelected ? 'filled' : 'outlined'} color={isSelected ? 'secondary' : 'default'}
                  sx={{ borderRadius: 2, cursor: 'pointer', fontWeight: 500, fontSize: '0.75rem' }} />
              );
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
            <Tooltip title="Excel İndir"><IconButton size="small" onClick={handleExportExcel}><Download fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Yenile"><IconButton size="small" onClick={fetchSiparisler}><RefreshOutlined fontSize="small" /></IconButton></Tooltip>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ p: 2, bgcolor: 'var(--muted)', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField id="purchase-filter-start-date" fullWidth type="date" size="small" label="Başlangıç Tarihi"
                  value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField id="purchase-filter-end-date" fullWidth type="date" size="small" label="Bitiş Tarihi"
                  value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Durum</InputLabel>
                  <Select multiple value={filterDurum}
                    onChange={(e) => setFilterDurum(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                    label="Durum" renderValue={(selected: any) => (selected as string[]).map(s => getStatusLabel(s)).join(', ')}>
                    <MenuItem value="PENDING">Beklemede</MenuItem>
                    <MenuItem value="APPROVED">Onaylandı</MenuItem>
                    <MenuItem value="PARTIALLY_RECEIVED">Kısmi Teslim</MenuItem>
                    <MenuItem value="COMPLETED">Tamamlandı</MenuItem>
                    <MenuItem value="INVOICED">Faturalandı</MenuItem>
                    <MenuItem value="CANCELLED">İptal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete id="purchase-filter-cari-autocomplete" size="small" options={cariler}
                  getOptionLabel={(option: Cari) => `${option.code || option.accountCode || ''} - ${option.title}`}
                  value={cariler.find(c => c.id === filterCariId) || null}
                  onChange={(_: any, newValue: Cari | null) => setFilterCariId(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Cari" id="purchase-filter-cari" />} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button variant="outlined" color="secondary" fullWidth onClick={handleClearFilters} sx={{ height: '40px' }}>Filtreleri Temizle</Button>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">Toplam <b>{rowCount}</b> sipariş listeleniyor</Typography>
        </Box>

        <Box sx={{ width: '100%' }}>
          <InvoiceDataGrid rows={siparisler} columns={columns} loading={loading} rowCount={rowCount}
            paginationModel={paginationModel} onPaginationModelChange={setPaginationModel}
            sortModel={sortModel} onSortModelChange={setSortModel}
            onFilterModelChange={setFilterModel} checkboxSelection={false} height={900} />
        </Box>

        <Box sx={{ p: 2, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">Bu sayfadaki toplam <b>Tutar</b>:</Typography>
          <Typography variant="body2" fontWeight={800} sx={{ color: 'var(--chart-2)' }}>{formatCurrency(pageGrandTotal)}</Typography>
        </Box>
      </StandardCard>

      {/* View Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ fontWeight: 'bold' }}>Sipariş Detayı</DialogTitle>
        <DialogContent>
          {selectedSiparis && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">Sipariş No:</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedSiparis.orderNo}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">Tarih:</Typography>
                  <Typography variant="body1" fontWeight="bold">{formatDate(selectedSiparis.date)}</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Cari:</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedSiparis.account?.title}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Durum:</Typography>
                <PurchaseStatusBadge status={selectedSiparis.status} />
              </Box>

              {selectedSiparis.items && selectedSiparis.items.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Kalemler:</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Kod</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Stok</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Miktar</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Teslim Alınan</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Birim Fiyat</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>KDV %</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Tutar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedSiparis.items.map((kalem: any, index: any) => (
                          <TableRow key={index} hover>
                            <TableCell>{kalem.product?.code || '-'}</TableCell>
                            <TableCell>{kalem.product?.name || '-'}</TableCell>
                            <TableCell>{kalem.quantity}</TableCell>
                            <TableCell>{kalem.receivedQuantity || 0}</TableCell>
                            <TableCell>{formatCurrency(kalem.unitPrice)}</TableCell>
                            <TableCell>%{kalem.vatRate}</TableCell>
                            <TableCell align="right">{formatCurrency((Number(kalem.amount) || 0) + (Number(kalem.vatAmount) || 0))}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'var(--muted)', borderRadius: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  {[
                    { label: 'Ara Toplam:', value: formatCurrency(Number(selectedSiparis.totalAmount || 0)) },
                    { label: 'İskonto:', value: `-${formatCurrency(selectedSiparis.discount || 0)}`, color: 'error.main' },
                    { label: 'KDV Toplamı:', value: formatCurrency(selectedSiparis.vatAmount || 0) },
                  ].map(({ label, value, color }: any) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                      <Typography variant="body2" color="text.secondary">{label}</Typography>
                      <Typography variant="body2" fontWeight={500} color={color}>{value}</Typography>
                    </Box>
                  ))}
                  <Divider sx={{ width: '250px', my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                    <Typography variant="h6" fontWeight="bold">Genel Toplam:</Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--chart-2)' }}>{formatCurrency(selectedSiparis.grandTotal)}</Typography>
                  </Box>
                </Box>
              </Paper>

              <Accordion variant="outlined" sx={{ bgcolor: 'color-mix(in srgb, var(--chart-2) 10%, transparent)', mt: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore color="secondary" />} sx={{ minHeight: '48px', '& .MuiAccordionSummary-content': { my: 1 } }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--chart-2)' }}>📋 Denetim Bilgileri</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">Oluşturan:</Typography>
                      <Typography variant="body2" fontWeight="500">{selectedSiparis.createdByUser?.fullName || 'Sistem'}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">Oluşturma Tarihi:</Typography>
                      <Typography variant="body2" fontWeight="500">{selectedSiparis.createdAt ? new Date(selectedSiparis.createdAt).toLocaleString('tr-TR') : '-'}</Typography>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenView(false)}>Kapat</Button></DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ fontWeight: 'bold' }}>Sipariş Sil</DialogTitle>
        <DialogContent>
          <Typography><strong>{selectedSiparis?.orderNo}</strong> nolu siparişi silmek istediğinizden emin misiniz?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>Bu işlem geri alınamaz!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>İptal</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Sil</Button>
        </DialogActions>
      </Dialog>

      {/* İptal Dialog */}
      <Dialog open={openIptal} onClose={() => setOpenIptal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ background: 'linear-gradient(135deg, var(--destructive) 0%, var(--destructive) 100%)', color: 'var(--primary-foreground)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
          Sipariş İptal
          <IconButton size="small" onClick={() => setOpenIptal(false)} sx={{ color: 'var(--primary-foreground)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedSiparis && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}><Typography variant="body2" fontWeight="bold">Bu işlem geri alınamaz!</Typography></Alert>
              <Typography variant="body1"><strong>{selectedSiparis.orderNo}</strong> nolu siparişi iptal etmek istediğinizden emin misiniz?</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenIptal(false)}>Vazgeç</Button>
          <Button onClick={handleIptal} variant="contained" sx={{ background: 'linear-gradient(135deg, var(--destructive) 0%, var(--destructive) 100%)' }}>İptal Et</Button>
        </DialogActions>
      </Dialog>

      {/* Teslim Al Dialog */}
      <Dialog open={openTeslim} onClose={() => !savingTeslim && setOpenTeslim(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{ background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Inventory />
            Teslim Al — {teslimSiparis?.orderNo}
          </Box>
          <IconButton size="small" onClick={() => setOpenTeslim(false)} disabled={savingTeslim} sx={{ color: '#fff' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {teslimSiparis && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">Her kalem için teslim almak istediğiniz miktarı girin. Kalan miktar siparişte bekleyecek.</Typography>
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Cari: <strong>{teslimSiparis.account?.title}</strong></Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Ürün</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Miktar</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Teslim Alındı</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Kalan</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: '#0891b2' }}>Teslim Alınacak</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(teslimSiparis.items || []).map((kalem: any) => {
                      const remaining = (kalem.quantity || 0) - (kalem.receivedQuantity || 0);
                      return (
                        <TableRow key={kalem.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>{kalem.product?.name || '-'}</Typography>
                            <Typography variant="caption" color="text.secondary">{kalem.product?.code || ''}</Typography>
                          </TableCell>
                          <TableCell align="center">{kalem.quantity}</TableCell>
                          <TableCell align="center">{kalem.receivedQuantity || 0}</TableCell>
                          <TableCell align="center">
                            <Chip label={remaining} size="small" color={remaining > 0 ? 'warning' : 'success'} sx={{ fontWeight: 600 }} />
                          </TableCell>
                          <TableCell align="center" sx={{ width: 120 }}>
                            <TextField type="number" size="small"
                              value={teslimMiktarlari[kalem.id] ?? ''}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(remaining, parseInt(e.target.value) || 0));
                                setTeslimMiktarlari(prev => ({ ...prev, [kalem.id]: val }));
                              }}
                              inputProps={{ min: 0, max: remaining, style: { textAlign: 'center' } }}
                              disabled={remaining <= 0} sx={{ width: 90 }} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TextField fullWidth multiline rows={2} size="small" label="Teslim Notu (opsiyonel)"
                value={teslimNotes} onChange={(e) => setTeslimNotes(e.target.value)} placeholder="İrsaliye notları..." />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenTeslim(false)} disabled={savingTeslim}>Vazgeç</Button>
          <Button onClick={handleTeslimSubmit} variant="contained" disabled={savingTeslim}
            startIcon={savingTeslim ? <CircularProgress size={16} /> : <Inventory />}
            sx={{ bgcolor: '#0891b2', '&:hover': { bgcolor: '#0e7490' } }}>
            {savingTeslim ? 'Teslim Alınıyor...' : 'Teslim Al & İrsaliye Oluştur'}
          </Button>
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
