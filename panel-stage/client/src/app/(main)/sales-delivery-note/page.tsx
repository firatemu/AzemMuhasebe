'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
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
  ArrowDownward,
  FilterList,
  ExpandMore,
  MoreVert,
  LocalShipping,
  Receipt,
  ContentCopy,
  Description,
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
  Autocomplete,
  Link as MuiLink,
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
} from '@mui/material';
import { GridColDef, GridPaginationModel, GridSortModel, GridFilterModel } from '@mui/x-data-grid';
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

interface IrsaliyeKalemi {
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discountRate: number;
  discountAmount: number;
  amount?: number;
  vatAmount?: number;
}

interface SatisIrsaliyesi {
  id: string;
  deliveryNoteNo: string;
  date: string;
  account: Cari;
  totalAmount: number;
  vatAmount: number;
  grandTotal: number;
  subtotal?: number;
  status: 'NOT_INVOICED' | 'PARTIALLY_INVOICED' | 'INVOICED' | 'CANCELLED';
  orderNo?: string | null;
  invoiceNos?: string[] | null;
  description?: string;
  items?: IrsaliyeKalemi[];
  sourceType: 'ORDER' | 'DIRECT' | 'INVOICE_AUTO';
  sourceOrder?: {
    id: string;
    orderNo: string;
  };
  relatedInvoiceId?: string;
  relatedInvoice?: {
    id: string;
    invoiceNo: string;
  };
  createdByUser?: { fullName?: string; username?: string };
  createdAt?: string;
  updatedByUser?: { fullName?: string; username?: string };
  updatedAt?: string;
  logs?: Array<{ createdAt: string; message: string; actionType?: string; user?: any }>;
}

interface DeliveryNoteStats {
  monthlyNotes: { totalAmount: number; count: number };
  pendingNotes: { totalAmount: number; count: number };
  deliveredNotes: { totalAmount: number; count: number };
}

export default function SatisIrsaliyeleriPage() {
  const { addTab, setActiveTab } = useTabStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const [irsaliyeler, setIrsaliyeler] = useState<SatisIrsaliyesi[]>([]);
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
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedIrsaliye, setSelectedIrsaliye] = useState<SatisIrsaliyesi | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    deliveryNoteNo: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    items: [] as IrsaliyeKalemi[],
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });


  // Summary Cards stats
  const [stats, setStats] = useState<DeliveryNoteStats | null>(null);

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDurum, setFilterDurum] = useState<string[]>([]);
  const [filterCariId, setFilterCariId] = useState('');

  useEffect(() => {
    addTab({
      id: 'sales-delivery-note-list',
      label: 'Satış İrsaliyeleri',
      path: '/sales-delivery-note',
    });
  }, [addTab]);

  useEffect(() => {
    fetchIrsaliyeler();
    fetchCariler();
    fetchStoklar();
    fetchStats();
  }, [paginationModel, sortModel, filterModel, filterCariId, filterStartDate, filterEndDate, filterDurum]);

  const fetchIrsaliyeler = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        type: 'SATIS_IRSALIYE',
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

      const response = await axios.get('/sales-waybills', { params });

      const irsaliyeData = response.data?.data || [];
      const totalCount = response.data?.meta?.total || response.data?.total || irsaliyeData.length;

      setIrsaliyeler(irsaliyeData);
      setRowCount(totalCount);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İrsaliyeler yüklenirken hata oluştu', 'error');
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
      const params: Record<string, string> = { type: 'SATIS_IRSALIYE' };
      if (searchTerm) params.search = searchTerm;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/delivery-notes/export/excel', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `satis_irsaliyeleri_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  const resetForm = () => {
    setFormData({
      deliveryNoteNo: '',
      accountId: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      items: [],
    });
    setOpenAdd(false);
    setOpenEdit(false);
    setSelectedIrsaliye(null);
  };

  const handleAddKalem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: '',
        quantity: 1,
        unitPrice: 0,
        vatRate: 20,
        discountRate: 0,
        discountAmount: 0
      }],
    }));
  };

  const handleRemoveKalem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleKalemChange = (index: number, field: keyof IrsaliyeKalemi, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === 'productId') {
        const stok = stoklar.find(s => s.id === value);
        if (stok) {
          newItems[index].unitPrice = stok.satisFiyati;
          newItems[index].vatRate = stok.kdvOrani;
        }
      }

      return { ...prev, items: newItems };
    });
  };

  const calculateTotal = () => {
    let totalAmount = 0;
    let vatAmount = 0;

    formData.items.forEach(item => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const rawTutar = quantity * unitPrice;

      const discountRate = item.discountRate || 0;
      const discountAmount = item.discountAmount || (rawTutar * discountRate) / 100;
      const amount = rawTutar - discountAmount;

      const itemVat = (amount * (item.vatRate || 0)) / 100;

      totalAmount += amount;
      vatAmount += itemVat;
    });

    const grandTotal = totalAmount + vatAmount;

    return { totalAmount, vatAmount, grandTotal };
  };

  const handleSave = async () => {
    try {
      if (!formData.accountId) {
        showSnackbar('Cari seçimi zorunludur', 'error');
        return;
      }

      if (formData.items.length === 0) {
        showSnackbar('En az bir kalem eklemelisiniz', 'error');
        return;
      }

      if (selectedIrsaliye) {
        await axios.put(`/delivery-notes/${selectedIrsaliye.id}`, formData);
        showSnackbar('İrsaliye başarıyla güncellendi', 'success');
        setOpenEdit(false);
      } else {
        await axios.post('/delivery-notes', formData);
        showSnackbar('İrsaliye başarıyla oluşturuldu', 'success');
        setOpenAdd(false);
      }

      fetchIrsaliyeler();
      resetForm();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedIrsaliye) {
        await axios.delete(`/delivery-notes/${selectedIrsaliye.id}`);
        showSnackbar('İrsaliye başarıyla silindi', 'success');
        setOpenDelete(false);
        fetchIrsaliyeler();
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Silme işlemi başarısız', 'error');
    }
  };

  const openAddDialog = async () => {
    resetForm();
    try {
      const response = await axios.get('/code-templates/preview-code/DELIVERY_NOTE_SALES');
      if (response.data?.nextCode) {
        setFormData(prev => ({
          ...prev,
          deliveryNoteNo: response.data.nextCode,
        }));
      } else {
        const lastIrsaliye = irsaliyeler[0];
        const lastNo = lastIrsaliye ? parseInt(lastIrsaliye.deliveryNoteNo.split('-')[2] || '0') : 0;
        const newNo = (lastNo + 1).toString().padStart(3, '0');
        setFormData(prev => ({
          ...prev,
          deliveryNoteNo: `SI-${new Date().getFullYear()}-${newNo}`,
        }));
      }
    } catch (error: any) {
      const lastIrsaliye = irsaliyeler[0];
      const lastNo = lastIrsaliye ? parseInt(lastIrsaliye.deliveryNoteNo.split('-')[2] || '0') : 0;
      const newNo = (lastNo + 1).toString().padStart(3, '0');
      setFormData(prev => ({
        ...prev,
        deliveryNoteNo: `SI-${new Date().getFullYear()}-${newNo}`,
      }));
    }
    setOpenAdd(true);
  };

  const openEditDialog = async (irsaliye: SatisIrsaliyesi) => {
    try {
      const response = await axios.get(`/delivery-notes/${irsaliye.id}`);
      const fullIrsaliye = response.data;

      setFormData({
        deliveryNoteNo: fullIrsaliye.deliveryNoteNo,
        accountId: fullIrsaliye.accountId,
        date: new Date(fullIrsaliye.date).toISOString().split('T')[0],
        description: fullIrsaliye.description || '',
        items: fullIrsaliye.items.map((k: any) => ({
          productId: k.productId,
          quantity: k.quantity,
          unitPrice: k.unitPrice,
          vatRate: k.vatRate,
          discountRate: k.discountRate || 0,
          discountAmount: k.discountAmount || 0,
        })),
      });

      setSelectedIrsaliye(irsaliye);
      setOpenEdit(true);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İrsaliye yüklenirken hata oluştu', 'error');
    }
  };

  const openViewDialog = async (irsaliye: SatisIrsaliyesi) => {
    try {
      const response = await axios.get(`/delivery-notes/${irsaliye.id}`);
      setSelectedIrsaliye(response.data);
      setOpenView(true);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İrsaliye yüklenirken hata oluştu', 'error');
    }
  };

  const openDeleteDialog = (irsaliye: SatisIrsaliyesi) => {
    setSelectedIrsaliye(irsaliye);
    setOpenDelete(true);
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

  const kpiData = useMemo(
    () =>
      stats
        ? {
          aylikSatis: { tutar: stats.monthlyNotes?.totalAmount || 0, adet: stats.monthlyNotes?.count || 0 },
          tahsilatBekleyen: { tutar: stats.pendingNotes?.totalAmount || 0, adet: stats.pendingNotes?.count || 0 },
          vadesiGecmis: { tutar: stats.deliveredNotes?.totalAmount || 0, adet: stats.deliveredNotes?.count || 0 },
        }
        : null,
    [stats]
  );

  const pageGrandTotal = useMemo(
    () => irsaliyeler.reduce((sum, i) => sum + (i.grandTotal || 0), 0),
    [irsaliyeler]
  );

  const fetchStats = async () => {
    try {
      const params: Record<string, any> = { type: 'SATIS_IRSALIYE' };
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;

      const response = await axios.get('/delivery-notes/stats', {
        params
      });
      setStats(response.data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NOT_INVOICED':
        return 'Faturalanmadı';
      case 'PARTIALLY_INVOICED':
        return 'Kısmi Faturalandı';
      case 'INVOICED':
        return 'Faturalandı';
      case 'CANCELLED':
        return 'İptal Edildi';
      // Backward compat
      case 'TESLIM_EDILDI':
        return 'Teslim Edildi';
      case 'BEKLEMEDE':
        return 'Beklemede';
      case 'FATURAYA_BAGLANDI':
        return 'Faturaya Bağlandı';
      case 'IPTAL':
        return 'İptal';
      default:
        return status;
    }
  };


  const handleView = (row: SatisIrsaliyesi) => {
    const tabId = `sales-delivery-note-view-${row.id}`;
    addTab({
      id: tabId,
      label: `İrsaliye: ${row.deliveryNoteNo}`,
      path: `/sales-delivery-note/detay/${row.id}`,
    });
    setActiveTab(tabId);
    router.push(`/sales-delivery-note/detay/${row.id}`);
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'deliveryNoteNo',
      headerName: 'İrsaliye No',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'date',
      headerName: 'Tarih',
      width: 120,
      valueFormatter: (value) => new Date(value).toLocaleDateString('tr-TR'),
    },
    {
      field: 'accountCode',
      headerName: 'Cari Kod',
      width: 130,
      valueGetter: (value, row) => row.account?.accountCode || '',
    },
    {
      field: 'account',
      headerName: 'Cari Ünvan',
      flex: 1.5,
      minWidth: 200,
      valueGetter: (value, row) => row.account?.title || '',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
      )
    },
    {
      field: 'grandTotal',
      headerName: 'Tutar',
      width: 150,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      valueGetter: (value, row) => {
        const amount = value !== undefined && value !== null ? value : (row.genelToplam || 0);
        return Number(amount) || 0;
      },
      valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
          <ArrowDownward sx={{ fontSize: 14, color: 'var(--ring)' }} />
          <Typography variant="body2" fontWeight="700" sx={{ color: 'var(--ring)' }}>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(params.value)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Durum',
      width: 140,
      renderCell: (params) => {
        const statusMap: Record<string, { color: any; label: string }> = {
          'NOT_INVOICED': { color: 'warning' as const, label: 'Faturalanmadı' },
          'PARTIALLY_INVOICED': { color: 'info' as const, label: 'Kısmi Faturalandı' },
          'INVOICED': { color: 'success' as const, label: 'Faturalandı' },
          'CANCELLED': { color: 'error' as const, label: 'İptal' },
        };
        const statusInfo = statusMap[params.value] || { color: 'default' as const, label: params.value };
        return <Chip label={statusInfo.label} color={statusInfo.color} size="small" sx={{ fontWeight: 600, fontSize: '0.75rem', borderRadius: '6px' }} />;
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'İşlemler',
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const row = params.row as SatisIrsaliyesi;

        const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        const canEdit = row.status === 'NOT_INVOICED';
        const canInvoice = row.status === 'NOT_INVOICED' || row.status === 'PARTIALLY_INVOICED';

        const menuActions = [
          {
            id: 'view',
            label: 'Detayları Görüntüle',
            icon: <Visibility fontSize="small" />,
            color: 'var(--foreground)',
            onClick: () => { handleClose(); handleView(row); },
            disabled: false,
          },
          {
            id: 'invoice',
            label: 'Faturaya Çevir',
            icon: <Receipt fontSize="small" sx={{ color: 'var(--primary)' }} />,
            color: 'var(--foreground)',
            onClick: () => { handleClose(); router.push(`/invoice/sales/yeni?irsaliyeId=${row.id}`); },
            disabled: !canInvoice,
          },
          {
            id: 'print',
            label: 'Yazdır',
            icon: <Print fontSize="small" />,
            color: 'var(--foreground)',
            onClick: () => { handleClose(); window.open(`/sales-delivery-note/print/${row.id}`, '_blank'); },
            disabled: false,
          },
          {
            id: 'copy',
            label: 'Kopyasını Oluştur',
            icon: <ContentCopy fontSize="small" />,
            color: 'var(--foreground)',
            onClick: () => {
              handleClose();
              const path = `/sales-delivery-note/yeni?kopyala=${row.id}`;
              const tabId = `irsaliye-kopyala-${row.id}`;
              addTab({ id: tabId, label: `Kopya: ${row.deliveryNoteNo}`, path });
              setActiveTab(tabId);
              router.push(path);
            },
            disabled: false,
          },
          {
            id: 'delete',
            label: 'Sil',
            icon: <Delete fontSize="small" sx={{ color: 'var(--destructive)' }} />,
            color: 'var(--destructive)',
            onClick: () => { handleClose(); openDeleteDialog(row); },
            disabled: !canEdit,
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
                borderRadius: 1.5,
                '&:hover': {
                  bgcolor: 'var(--secondary)',
                  color: 'var(--secondary-foreground)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                },
                transition: 'all 0.2s ease',
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
                elevation: 0,
                sx: {
                  minWidth: 280,
                  mt: 1,
                  borderRadius: 2,
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                  overflow: 'visible',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 8,
                    height: 8,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    borderTop: '1px solid var(--border)',
                    borderLeft: '1px solid var(--border)',
                  },
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
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  İrsaliye İşlemleri
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.25 }}>
                  {row.deliveryNoteNo}
                </Typography>
              </Box>

              <Box sx={{ px: 1, py: 0.75 }}>
                {menuActions.map((action, idx) => (
                  <MenuItem
                    key={action.id}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    sx={{
                      px: 1.5,
                      py: 0.875,
                      borderRadius: 1.5,
                      my: 0.125,
                      color: action.color,
                      '&:hover': {
                        bgcolor: action.id === 'delete'
                          ? 'var(--destructive)'
                          : 'var(--secondary)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                      },
                      '&.Mui-disabled': {
                        opacity: 0.5,
                      },
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                      {action.icon}
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                      {action.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>
            </Menu>
          </>
        );
      }
    },
  ], []);

  return (
    <StandardPage maxWidth={false}>
      {/* Header & Aksiyon Butonları */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: 'color-mix(in srgb, var(--chart-4) 12%, transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <LocalShipping sx={{ color: 'var(--chart-4)', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="700" color="text.primary" sx={{ letterSpacing: '-0.01em' }}>
              Satış İrsaliyeleri
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Müşteri irsaliyelerinizi yönetin
            </Typography>
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={handleExportExcel}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              px: 2,
              py: 0.75,
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              borderRadius: 2,
              '&:hover': {
                borderColor: 'var(--ring)',
                bgcolor: 'color-mix(in srgb, var(--ring) 8%, transparent)',
                transform: 'translateY(-1px)',
                boxShadow: 'var(--shadow-sm)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Raporlar
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              addTab({
                id: 'sales-delivery-note-yeni',
                label: 'Yeni Satış İrsaliyesi',
                path: '/sales-delivery-note/yeni'
              });
              setActiveTab('sales-delivery-note-yeni');
              router.push('/sales-delivery-note/yeni');
            }}
            sx={{
              bgcolor: 'var(--primary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              px: 2,
              py: 0.75,
              minWidth: 0,
              boxShadow: 'none',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'var(--primary)',
                boxShadow: 'var(--shadow-md)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Yeni İrsaliye
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
            id="satis-irsaliye-search"
            size="small"
            placeholder="İrsaliye Ara (No, Cari vb.)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 260, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: 'text.secondary' }}>
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
                  sx={{
                    borderRadius: 1,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    letterSpacing: '0.02em',
                    height: 26,
                    px: 0.5,
                    '&.MuiChip-outlined': {
                      borderColor: 'var(--border)',
                    },
                  }}
                />
              )
            })}
          </Stack>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
            <Tooltip title="Filtreler">
              <IconButton
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  color: showFilters ? 'var(--primary)' : 'text.secondary',
                  bgcolor: showFilters ? 'color-mix(in srgb, var(--primary) 12%, transparent)' : 'transparent',
                  borderRadius: 1.5,
                  '&:hover': {
                    bgcolor: showFilters
                      ? 'color-mix(in srgb, var(--primary) 18%, transparent)'
                      : 'var(--secondary)',
                  },
                  transition: 'all 0.2s ease',
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
              <IconButton size="small" onClick={fetchIrsaliyeler}>
                <RefreshOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ p: 2, bgcolor: 'var(--muted)', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  id="satis-irsaliye-filter-start-date"
                  fullWidth type="date" size="small" label="Başlangıç Tarihi"
                  value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  id="satis-irsaliye-filter-end-date"
                  fullWidth type="date" size="small" label="Bitiş Tarihi"
                  value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Durum</InputLabel>
                  <Select
                    multiple
                    value={filterDurum}
                    onChange={(e) => setFilterDurum(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                    label="Durum"
                    renderValue={(selected: any) => (selected as string[]).map(s => getStatusLabel(s)).join(', ')}
                  >
                    <MenuItem value="BEKLEMEDE">Beklemede</MenuItem>
                    <MenuItem value="TESLIM_EDILDI">Teslim Edildi</MenuItem>
                    <MenuItem value="FATURAYA_BAGLANDI">Faturaya Bağlandı</MenuItem>
                    <MenuItem value="IPTAL">İptal</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  id="sales-waybills-filter-cari-autocomplete"
                  size="small"
                  options={cariler}
                  getOptionLabel={(option: Cari) => `${option.accountCode} - ${option.title}`}
                  value={cariler.find(c => c.id === filterCariId) || null}
                  onChange={(_: any, newValue: Cari | null) => setFilterCariId(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Cari" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            Toplam <b>{rowCount}</b> irsaliye listeleniyor
          </Typography>
        </Box>

        {/* DataGrid */}
        <Box sx={{ width: '100%' }}>
          <InvoiceDataGrid
            rows={irsaliyeler}
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
          <Typography variant="body2" fontWeight={800} sx={{ color: 'var(--ring)' }}>
            {formatCurrency(pageGrandTotal)}
          </Typography>
        </Box>
      </StandardCard>

      {/* View Dialog */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid var(--border)',
          bgcolor: 'var(--card)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'color-mix(in srgb, var(--chart-4) 12%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <LocalShipping sx={{ color: 'var(--chart-4)', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="700" color="text.primary">
                İrsaliye Detayı
              </Typography>
              {selectedIrsaliye && (
                <Typography variant="caption" color="text.secondary">
                  {selectedIrsaliye.deliveryNoteNo}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedIrsaliye && (
              <Chip
                label={getStatusLabel(selectedIrsaliye.status)}
                color={
                  selectedIrsaliye.status === 'INVOICED' ? 'success' :
                  selectedIrsaliye.status === 'PARTIALLY_INVOICED' ? 'info' :
                  selectedIrsaliye.status === 'CANCELLED' ? 'error' : 'warning'
                }
                size="small"
                sx={{ fontWeight: 600, fontSize: '0.7rem', borderRadius: 1 }}
              />
            )}
            <IconButton size="small" onClick={() => setOpenView(false)} sx={{ color: 'text.secondary' }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          {selectedIrsaliye && (
            <Box sx={{ mt: 0 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, p: 3, borderBottom: '1px solid var(--border)' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>İrsaliye No</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="body2" fontWeight="700">{selectedIrsaliye.deliveryNoteNo}</Typography>
                    {selectedIrsaliye.relatedInvoice && (
                      <MuiLink
                        component={Link}
                        href={`/invoice/sales/${selectedIrsaliye.relatedInvoice.id}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          textDecoration: 'none',
                          color: 'var(--primary)',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        <Receipt fontSize="small" />
                      </MuiLink>
                    )}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>Tarih</Typography>
                  <Typography variant="body2" fontWeight="600" sx={{ mt: 0.5 }}>
                    {formatDate(selectedIrsaliye.date)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>Cari Kod</Typography>
                  <Typography variant="body2" fontWeight="600" sx={{ mt: 0.5 }}>
                    {selectedIrsaliye.account?.accountCode || '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>Cari Ünvan</Typography>
                  <Typography variant="body2" fontWeight="600" sx={{ mt: 0.5 }}>
                    {selectedIrsaliye.account?.title || '-'}
                  </Typography>
                </Box>
              </Box>

              {selectedIrsaliye.sourceOrder && (
                <Box sx={{ px: 3, py: 2, borderBottom: '1px solid var(--border)', bgcolor: 'var(--muted)' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>Satış Sipariş No</Typography>
                  <MuiLink
                    component={Link}
                    href={`/orders/sales?id=${selectedIrsaliye.sourceOrder.id}`}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      textDecoration: 'none',
                      color: 'var(--primary)',
                      mt: 0.5,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <Description fontSize="small" />
                    <Typography variant="body2" fontWeight="600">
                      {selectedIrsaliye.sourceOrder.orderNo}
                    </Typography>
                  </MuiLink>
                </Box>
              )}

              {selectedIrsaliye.items && selectedIrsaliye.items.length > 0 && (
                <Box sx={{ px: 3, py: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'var(--foreground)' }}>Kalemler</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, border: '1px solid var(--border)' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Malzeme Kodu</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Stok</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Miktar</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Birim Fiyat</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>İnd. %</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>İnd. ₺</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>KDV %</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Tutar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedIrsaliye.items.map((kalem: any, index: any) => (
                          <TableRow
                            key={index}
                            hover
                            sx={{
                              '&:nth-of-type(even)': { bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' },
                            }}
                          >
                            <TableCell sx={{ fontSize: '0.8rem' }}>{kalem.product?.code || '-'}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{kalem.product?.name || '-'}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{kalem.quantity}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{formatCurrency(kalem.unitPrice)}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>%{kalem.discountRate || 0}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem' }}>{formatCurrency(kalem.discountAmount || 0)}</TableCell>
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

              <Box sx={{ px: 3, py: 2, position: 'sticky', bottom: 0, bgcolor: 'background.paper', borderTop: '1px solid var(--border)' }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'linear-gradient(135deg, var(--muted) 0%, color-mix(in srgb, var(--primary) 5%, var(--muted)) 100%)',
                    borderRadius: 2,
                    border: '1px solid var(--border)',
                    background: 'linear-gradient(135deg, var(--muted) 0%, color-mix(in srgb, var(--primary) 5%, var(--muted)) 100%)',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.75 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                      <Typography variant="body2" color="text.secondary">Ara Toplam:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(Number(selectedIrsaliye.totalAmount || 0))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '280px' }}>
                      <Typography variant="body2" color="text.secondary">KDV Toplamı:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(selectedIrsaliye.vatAmount || 0)}
                      </Typography>
                    </Box>
                    <Divider sx={{ width: '280px', my: 0.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '280px', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="700">Genel Toplam:</Typography>
                      <Typography variant="h6" fontWeight="900" sx={{ color: 'var(--chart-4)' }}>
                        {formatCurrency(selectedIrsaliye.grandTotal)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>

              {/* Audit Bilgileri */}
              <Accordion variant="outlined" sx={{ mx: 3, mb: 2, bgcolor: 'color-mix(in srgb, var(--primary) 5%, transparent)', '&:before': { display: 'none' }, borderRadius: '8px !important' }}>
                <AccordionSummary
                  expandIcon={<ExpandMore color="primary" />}
                  sx={{
                    minHeight: '44px',
                    '& .MuiAccordionSummary-content': { my: 1 }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.8rem' }}>
                    Denetim Bilgileri
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                          Oluşturan
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {selectedIrsaliye.createdByUser?.fullName || 'Sistem'}
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                            ({selectedIrsaliye.createdByUser?.username || '-'})
                          </Typography>
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                          Oluşturma Tarihi
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {selectedIrsaliye.createdAt
                            ? new Date(selectedIrsaliye.createdAt).toLocaleString('tr-TR')
                            : '-'}
                        </Typography>
                      </Box>
                    </Box>

                    {selectedIrsaliye.updatedByUser && (
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                            Son Güncelleyen
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {selectedIrsaliye.updatedByUser.fullName}
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                              ({selectedIrsaliye.updatedByUser.username})
                            </Typography>
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                            Son Güncelleme
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {selectedIrsaliye.updatedAt
                              ? new Date(selectedIrsaliye.updatedAt).toLocaleString('tr-TR')
                              : '-'}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {selectedIrsaliye.logs && selectedIrsaliye.logs.length > 0 && (
                      <Box sx={{ pt: 1, borderTop: '1px solid var(--border)' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.65rem' }}>
                          Son İşlemler
                        </Typography>
                        {selectedIrsaliye.logs.slice(0, 3).map((log: any, index: number) => (
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
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid var(--border)' }}>
          <Button
            onClick={() => setOpenView(false)}
            variant="outlined"
            sx={{ borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: 1.5 }}
          >
            Kapat
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
        <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'color-mix(in srgb, var(--destructive) 12%, transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Delete sx={{ color: 'var(--destructive)', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="700" color="text.primary">
              İrsaliye Sil
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {selectedIrsaliye?.deliveryNoteNo}
            </Typography>
          </Box>
        </Box>
        <DialogContent sx={{ pt: 2.5 }}>
          <Typography sx={{ mb: 1.5 }}>
            <strong>{selectedIrsaliye?.deliveryNoteNo}</strong> numaralı irsaliyeyi silmek istediğinizden emin misiniz?
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
            Bu işlem geri alınamaz!
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid var(--border)', gap: 1 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            sx={{ borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            İptal
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<Delete fontSize="small" />}
            sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'var(--shadow-md)' } }}
          >
            Sil
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
