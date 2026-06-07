'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import axios from '@/lib/axios';
import { getProfitByInvoice, type ProfitByInvoiceResponse } from '@/services/invoiceProfitService';
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
  CloudUpload,
  TrendingUp,
  Description,
  Receipt,
  Download,
  RefreshOutlined,
  ArrowDownward,
  FilterList,
  ExpandMore,
  LocalShipping,
  Cancel,
  MoreHoriz,
  FileCopy,
  Undo,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardContent,
  Checkbox,
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
  Menu,
} from '@mui/material';
import { GridColDef, GridRenderCellParams, GridPaginationModel, GridSortModel, GridFilterModel } from '@mui/x-data-grid';
import KPIHeader from '@/components/Fatura/KPIHeader';
import InvoiceDataGrid from '@/components/Fatura/InvoiceDataGrid';
import StatusBadge from '@/components/Fatura/StatusBadge';
import { StandardCard, StandardPage } from '@/components/common';
import { usePermission } from '@/hooks/usePermission';

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

interface FaturaKalemi {
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
  currency?: string;
  exchangeRate?: number;
  currencyTotal?: number;
  status: 'DRAFT' | 'PENDING' | 'OPEN' | 'APPROVED' | 'PARTIALLY_PAID' | 'CLOSED' | 'PAID' | 'CANCELLED';
  iskonto?: number;
  description?: string;
  items?: FaturaKalemi[];
  paidAmount?: number;
  remainingAmount?: number;
  efaturaStatus?: 'PENDING' | 'SENT' | 'ERROR' | 'DRAFT';
  efaturaEttn?: string;
  deliveryNoteId?: string;
  salesAgentId?: string;
  salesAgent?: { id: string; fullName: string };
  deliveryNote?: {
    id: string;
    deliveryNoteNo: string;
    sourceOrder?: { id: string; orderNo: string };
  };
  orderNo?: string;
  createdByUser?: { fullName?: string; username?: string };
  createdAt?: string;
  updatedByUser?: { fullName?: string; username?: string };
  updatedAt?: string;
  logs?: Array<{ createdAt: string; message: string; actionType?: string; user?: any }>;
}

interface SalesStats {
  monthlySales: { totalAmount: number; count: number };
  pendingCollections: { totalAmount: number; count: number };
  overdueInvoices: { totalAmount: number; count: number };
}

interface PriceHistoryItem {
  invoiceNo: string;
  date: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

export default function SatisFaturalariPage() {
  const { addTab, setActiveTab } = useTabStore();
  const router = useRouter();
  const { can } = usePermission();
  const [searchTerm, setSearchTerm] = useState('');

  const [faturalar, setFaturalar] = useState<Fatura[]>([]);
  const [cariler, setCariler] = useState<Cari[]>([]);
  const [stoklar, setStoklar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [faturaDurumlari, setFaturaDurumlari] = useState<Record<string, string>>({});

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'date', sort: 'desc' },
  ]);
  const [actionsMenu, setActionsMenu] = useState<{
    anchorEl: HTMLElement | null;
    row: Fatura | null;
  }>({ anchorEl: null, row: null });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });
  const [rowCount, setRowCount] = useState(0);

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openIptal, setOpenIptal] = useState(false);
  const [openDurumOnay, setOpenDurumOnay] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [pendingDurum, setPendingDurum] = useState<{ faturaId: string; eskiDurum: string; yeniDurum: string } | null>(null);
  const [irsaliyeIptal, setIrsaliyeIptal] = useState(false);



  // Form data
  const [formData, setFormData] = useState({
    invoiceNo: '',
    invoiceType: 'SALE' as 'SALE' | 'PURCHASE',
    accountId: '',
    salesAgentId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    discountAmount: 0,
    description: '',
    items: [] as FaturaKalemi[],
  });

  const [satisElemanlari, setSatisElemanlari] = useState<any[]>([]);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  // E-Fatura gönderme state
  const [sendingEInvoice, setSendingEInvoice] = useState<string | null>(null);

  // Kar görüntüleme state
  const [openProfitDialog, setOpenProfitDialog] = useState(false);
  const [profitData, setProfitData] = useState<any>(null);
  const [loadingProfit, setLoadingProfit] = useState(false);

  // Ödeme planı state
  const [paymentPlanData, setPaymentPlanData] = useState<any>(null);
  const [loadingPaymentPlan, setLoadingPaymentPlan] = useState(false);

  // Summary Cards stats
  const [stats, setStats] = useState<SalesStats | null>(null);

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDurum, setFilterDurum] = useState<string[]>([]);
  const [filterCariId, setFilterCariId] = useState('');
  const [filterSatisElemaniId, setFilterSatisElemaniId] = useState('');


  // Price History
  const [priceHistoryAnchor, setPriceHistoryAnchor] = useState<null | HTMLElement>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([]);
  const [loadingPriceHistory, setLoadingPriceHistory] = useState(false);





  useEffect(() => {
    addTab({
      id: 'invoice-sales',
      label: 'Satış Faturaları',
      path: '/invoice/sales',
    });
  }, [addTab]);

  useEffect(() => {
    fetchFaturalar();
    fetchCariler();
    fetchStoklar();
    fetchSatisElemanlari();
    fetchStats();
  }, [paginationModel, sortModel, filterModel, filterCariId, filterSatisElemaniId, filterStartDate, filterEndDate, filterDurum]); // Trigger fetch on model changes

  const fetchFaturalar = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        type: 'SALE',
        search: searchTerm,
        page: paginationModel.page + 1, // API uses 1-based indexing
        limit: paginationModel.pageSize,
        sortBy: sortModel[0]?.field || 'createdAt',
        sortOrder: sortModel[0]?.sort || 'desc',
      };

      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;
      if (filterSatisElemaniId) params.salesAgentId = filterSatisElemaniId;

      const response = await axios.get('/invoices', { params });

      const faturaData = response.data?.data || [];
      const totalCount = response.data?.meta?.total || response.data?.total || faturaData.length; // Fallback

      setFaturalar(faturaData);
      setRowCount(totalCount);

      const durumMap: Record<string, string> = {};
      faturaData.forEach((fatura: Fatura) => {
        durumMap[fatura.id] = fatura.status;
      });
      setFaturaDurumlari(durumMap);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Faturalar yüklenirken hata oluştu', 'error');
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

  // Price History
  const fetchPriceHistory = async (event: React.MouseEvent<HTMLElement>, cariId: string, stokId: string) => {
    setPriceHistoryAnchor(event.currentTarget);
    setLoadingPriceHistory(true);
    try {
      const response = await axios.get('/invoices/price-history', {
        params: { accountId: cariId, productId: stokId },
      });
      setPriceHistory(response.data);
    } catch (error) {
      setPriceHistory([]);
    } finally {
      setLoadingPriceHistory(false);
    }
  };

  // Excel Export
  const handleExportExcel = async () => {
    try {
      const params: Record<string, string> = { type: 'SALE' };
      if (searchTerm) params.search = searchTerm;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterSatisElemaniId) params.salesAgentId = filterSatisElemaniId;

      const response = await axios.get('/invoices/export/excel', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `faturalar_${new Date().toISOString().split('T')[0]}.xlsx`);
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
    setFilterSatisElemaniId('');
    setFilterCariId('');
    setSearchTerm('');
  };


  const resetForm = () => {
    setFormData({
      invoiceNo: '',
      invoiceType: 'SALE',
      accountId: '',
      salesAgentId: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      discountAmount: 0,
      description: '',
      items: [],
    });
    setOpenAdd(false);
    setOpenEdit(false);
    setSelectedFatura(null);
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

  const handleKalemChange = (index: number, field: keyof FaturaKalemi, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      // Stok seçildiğinde fiyat ve KDV oranını otomatik doldur
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

    totalAmount -= formData.discountAmount || 0;
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

      if (selectedFatura) {
        await axios.put(`/invoices/${selectedFatura.id}`, formData);
        showSnackbar('Fatura başarıyla güncellendi', 'success');
        setOpenEdit(false);
      } else {
        await axios.post('/invoices', formData);
        showSnackbar('Fatura başarıyla oluşturuldu', 'success');
        setOpenAdd(false);
      }

      fetchFaturalar();
      resetForm();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', 'error');
    }
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

  const openAddDialog = async () => {
    resetForm();
    // Şablondan otomatik fatura numarası oluştur
    try {
      const response = await axios.get('/code-templates/preview-code/INVOICE_SALES');
      if (response.data?.nextCode) {
        setFormData(prev => ({
          ...prev,
          invoiceNo: response.data.nextCode,
        }));
      } else {
        // Fallback: Eski yöntem
        const lastFatura = faturalar[0];
        const lastNo = lastFatura ? parseInt(lastFatura.invoiceNo.split('-')[2] || '0') : 0;
        const newNo = (lastNo + 1).toString().padStart(3, '0');
        setFormData(prev => ({
          ...prev,
          invoiceNo: `SF-${new Date().getFullYear()}-${newNo}`,
        }));
      }
    } catch (error: any) {
      // Şablon yoksa veya hata varsa, eski yöntemi kullan
      const lastFatura = faturalar[0];
      const lastNo = lastFatura ? parseInt(lastFatura.invoiceNo.split('-')[2] || '0') : 0;
      const newNo = (lastNo + 1).toString().padStart(3, '0');
      setFormData(prev => ({
        ...prev,
        invoiceNo: `SF-${new Date().getFullYear()}-${newNo}`,
      }));
    }
    setOpenAdd(true);
  };

  const openEditDialog = async (fatura: Fatura) => {
    try {
      const response = await axios.get(`/invoices/${fatura.id}`);
      const fullFatura = response.data;

      setFormData({
        invoiceNo: fullFatura.invoiceNo,
        invoiceType: fullFatura.invoiceType,
        accountId: fullFatura.accountId,
        salesAgentId: fullFatura.salesAgentId || '',
        date: new Date(fullFatura.date).toISOString().split('T')[0],
        dueDate: fullFatura.dueDate ? new Date(fullFatura.dueDate).toISOString().split('T')[0] : '',
        discountAmount: fullFatura.discountAmount || 0,
        description: fullFatura.description || '',
        items: fullFatura.items.map((k: any) => ({
          productId: k.productId,
          quantity: k.quantity,
          unitPrice: k.unitPrice,
          vatRate: k.vatRate,
          discountRate: k.discountRate || 0,
          discountAmount: k.discountAmount || 0,
        })),
      });

      setSelectedFatura(fatura);
      setOpenEdit(true);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Fatura yüklenirken hata oluştu', 'error');
    }
  };

  const openViewDialog = async (fatura: Fatura) => {
    try {
      const response = await axios.get(`/invoices/${fatura.id}`);
      setSelectedFatura(response.data);
      setOpenView(true);

      // Ödeme planını yükle
      try {
        setLoadingPaymentPlan(true);
        const planResponse = await axios.get(`/invoices/${fatura.id}/payment-plan`);
        setPaymentPlanData(planResponse.data);
      } catch (planError) {
        // Ödeme planı yoksa hata verme
        setPaymentPlanData(null);
      } finally {
        setLoadingPaymentPlan(false);
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Fatura yüklenirken hata oluştu', 'error');
    }
  };

  const openDeleteDialog = (fatura: Fatura) => {
    setSelectedFatura(fatura);
    setOpenDelete(true);
  };

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
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İptal işlemi başarısız', 'error');
    }
  };

  const handleSendEInvoice = async (fatura: Fatura) => {
    if (!confirm(`"${fatura.invoiceNo}" nolu faturayı E-fatura olarak göndermek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      setSendingEInvoice(fatura.id);
      const response = await axios.post(`/invoices/${fatura.id}/send-einvoice`);

      if (response.data.success) {
        showSnackbar(`E-fatura başarıyla gönderildi. ETTN: ${response.data.ettn || 'N/A'}`, 'success');
        fetchFaturalar();
      } else {
        showSnackbar(response.data.message || 'E-fatura gönderilemedi', 'error');
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'E-fatura gönderme işlemi başarısız', 'error');
    } finally {
      setSendingEInvoice(null);
    }
  };

  const handleDurumChangeRequest = (faturaId: string, eskiDurum: string, yeniDurum: string) => {
    // Eğer aynı duruma geçilmeye çalışılıyorsa, işlem yapma
    if (eskiDurum === yeniDurum) {
      return;
    }

    // Faturayı bul
    const fatura = faturalar.find(f => f.id === faturaId);
    if (!fatura) {
      return;
    }

    // Select değerini anında güncelle (UI için)
    setFaturaDurumlari(prev => ({ ...prev, [faturaId]: yeniDurum }));

    // Onay dialogunu aç
    setSelectedFatura(fatura);
    setPendingDurum({ faturaId, eskiDurum, yeniDurum });
    setOpenDurumOnay(true);
  };

  const handleDurumChangeConfirm = async () => {
    if (!pendingDurum) {
      return;
    }

    try {
      await axios.put(`/invoices/${pendingDurum.faturaId}/status`, { status: pendingDurum.yeniDurum });

      let mesaj = 'Fatura durumu güncellendi';
      if (pendingDurum.yeniDurum === 'APPROVED') {
        mesaj = 'Fatura onaylandı. Stoklar düşüldü ve cari bakiye güncellendi.';
      } else if (pendingDurum.yeniDurum === 'CANCELLED') {
        mesaj = 'Fatura iptal edildi. Cari bakiye düzeltildi. (İptal faturalar stok hesaplamasında dikkate alınmaz)';
      } else if (pendingDurum.yeniDurum === 'OPEN') {
        mesaj = 'Fatura beklemeye alındı. Stok ve cari işlemleri geri alındı.';
      }

      showSnackbar(mesaj, 'success');
      setOpenDurumOnay(false);
      setPendingDurum(null);
      fetchFaturalar();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Durum değiştirme başarısız', 'error');
      setOpenDurumOnay(false);
      setPendingDurum(null);
      fetchFaturalar(); // Hata durumunda da listeyi yenile (eski duruma dön)
    }
  };

  const handleDurumChangeCancel = () => {
    if (pendingDurum) {
      // Select değerini eski duruma geri döndür
      setFaturaDurumlari(prev => ({ ...prev, [pendingDurum.faturaId]: pendingDurum.eskiDurum }));
    }
    setOpenDurumOnay(false);
    setPendingDurum(null);
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
          aylikSatis: { tutar: stats.monthlySales?.totalAmount || 0, adet: stats.monthlySales?.count || 0 },
          tahsilatBekleyen: { tutar: stats.pendingCollections?.totalAmount || 0, adet: stats.pendingCollections?.count || 0 },
          vadesiGecmis: { tutar: stats.overdueInvoices?.totalAmount || 0, adet: stats.overdueInvoices?.count || 0 },
        }
        : null,
    [stats]
  );

  const pageGrandTotal = useMemo(
    () => faturalar.reduce((sum, f) => sum + (f.grandTotal || 0), 0),
    [faturalar]
  );

  const fetchStats = async () => {
    try {
      const params: Record<string, any> = { type: 'SALE' };
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      if (filterDurum.length > 0) params.status = filterDurum.join(',');
      if (filterCariId) params.accountId = filterCariId;
      if (filterSatisElemaniId) params.salesAgentId = filterSatisElemaniId;

      const response = await axios.get('/invoices/stats', {
        params
      });
      setStats(response.data);
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const fetchSatisElemanlari = async () => {
    try {
      const response = await axios.get('/sales-agent'); // Correct endpoint based on SatisElemaniController
      setSatisElemanlari(response.data || []);
    } catch (error) {
      console.error('Satış elemanları yüklenirken hata:', error);
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
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const EDITABLE_STATUSES = ['DRAFT', 'PENDING'];
  const APPROVABLE_STATUSES = ['DRAFT', 'PENDING', 'OPEN'];
  const CANCELLABLE_STATUSES = ['APPROVED', 'PARTIALLY_PAID'];

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

  const renderFormDialog = () => {
    const { totalAmount, vatAmount, grandTotal } = calculateTotal();

    return (
      <Dialog
        open={openAdd || openEdit}
        onClose={() => { setOpenAdd(false); setOpenEdit(false); }}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle component="div" sx={{ fontWeight: 'bold' }}>
          {openAdd ? 'Yeni Satış Faturası' : 'Satış Faturası Düzenle'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="Fatura No"
                value={formData.invoiceNo}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNo: e.target.value }))}
                required
              />
              <TextField
                sx={{ flex: 1 }}
                type="date"
                label="Tarih"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                sx={{ flex: 1 }}
                type="date"
                label="Vade"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }} required>
                <InputLabel>Cari</InputLabel>
                <Select
                  value={formData.accountId}
                  onChange={async (e) => {
                    const accountId = e.target.value;
                    setFormData(prev => ({ ...prev, accountId }));
                    // Cari seçildiğinde varsayılan satış elemanını getir
                    try {
                      const response = await axios.get(`/account/${accountId}`);
                      if (response.data?.salesAgentId) {
                        setFormData(prev => ({ ...prev, salesAgentId: response.data.salesAgentId }));
                      }
                    } catch (error) {
                      console.error('Cari detayları yüklenirken hata:', error);
                    }
                  }}
                  label="Cari"
                >
                  {cariler.map((cari) => (
                    <MenuItem key={cari.id} value={cari.id}>
                      {cari.accountCode} - {cari.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Satış Elemanı</InputLabel>
                <Select
                  value={formData.salesAgentId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, salesAgentId: e.target.value }))}
                  label="Satış Elemanı"
                >
                  <MenuItem value=""><em>Seçiniz</em></MenuItem>
                  {satisElemanlari.map((se) => (
                    <MenuItem key={se.id} value={se.id}>
                      {se.fullName || se.adSoyad}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Kalemler */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Fatura Kalemleri</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddKalem}
                  sx={{
                    bgcolor: 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'var(--secondary-hover)',
                    },
                  }}
                >
                  Kalem Ekle
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width="25%">Stok</TableCell>
                      <TableCell width="10%">Miktar</TableCell>
                      <TableCell width="15%">Birim Fiyat</TableCell>
                      <TableCell width="10%">İsk (%)</TableCell>
                      <TableCell width="15%">İsk (₺)</TableCell>
                      <TableCell width="10%">KDV %</TableCell>
                      <TableCell width="15%" align="right">Satır Toplamı</TableCell>
                      <TableCell width="5%">İşlem</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Kalem eklenmedi
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.items.map((kalem, index) => {
                        const rawTutar = (kalem.quantity || 0) * (kalem.unitPrice || 0);
                        const lineIskonto = kalem.discountAmount || (rawTutar * (kalem.discountRate || 0)) / 100;
                        const lineNet = rawTutar - lineIskonto;
                        const lineKdv = (lineNet * (kalem.vatRate || 0)) / 100;
                        const lineTotal = lineNet + lineKdv;

                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <FormControl fullWidth size="small">
                                <Select
                                  value={kalem.productId}
                                  onChange={(e) => handleKalemChange(index, 'productId', e.target.value)}
                                >
                                  {stoklar.map((stok) => (
                                    <MenuItem key={stok.id} value={stok.id}>
                                      {stok.code} - {stok.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                type="number"
                                size="small"
                                value={kalem.quantity}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  handleKalemChange(index, 'quantity', isNaN(value) ? 1 : value);
                                }}
                                inputProps={{ min: 1 }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                type="number"
                                size="small"
                                value={kalem.unitPrice}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  handleKalemChange(index, 'unitPrice', isNaN(value) ? 0 : value);
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                type="number"
                                size="small"
                                value={kalem.discountRate}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  handleKalemChange(index, 'discountRate', isNaN(value) ? 0 : value);
                                }}
                                inputProps={{ min: 0, max: 100, step: 0.1 }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                type="number"
                                size="small"
                                value={kalem.discountAmount}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  handleKalemChange(index, 'discountAmount', isNaN(value) ? 0 : value);
                                }}
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                fullWidth
                                type="number"
                                size="small"
                                value={kalem.vatRate}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  handleKalemChange(index, 'vatRate', isNaN(value) ? 0 : value);
                                }}
                                inputProps={{ min: 0, max: 100 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold">
                                {formatCurrency(lineTotal)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveKalem(index)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                type="number"
                label="İskonto"
                value={formData.discountAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                sx={{ flex: 1 }}
                multiline
                rows={1}
                label="Açıklama"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Box>

            {/* Toplam */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'var(--muted)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}
                  >
                    Ara Toplam:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: 'var(--foreground)' }}
                  >
                    {formatCurrency(totalAmount)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}
                  >
                    KDV Toplamı:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: 'var(--foreground)' }}
                  >
                    {formatCurrency(vatAmount)}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}
                  >
                    Genel Toplam:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: 'var(--secondary)',
                    }}
                  >
                    {formatCurrency(grandTotal)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => { setOpenAdd(false); setOpenEdit(false); }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'var(--muted-foreground)',
              '&:hover': {
                bgcolor: 'var(--muted)',
              },
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              bgcolor: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'var(--secondary-hover)',
              },
            }}
          >
            {openAdd ? 'Oluştur' : 'Güncelle'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleEdit = (row: Fatura) => {
    const tabId = `invoice-sales-edit-${row.id}`;
    addTab({
      id: tabId,
      label: `Düzenle: ${row.invoiceNo}`,
      path: `/invoice/sales/duzenle/${row.id}`,
    });
    setActiveTab(tabId);
    router.push(`/invoice/sales/duzenle/${row.id}`);
  };

  const handleView = (row: Fatura) => {
    openViewDialog(row);
  };

  /* Profit Handler */
  const handleShowProfit = async (fatura: Fatura) => {
    setLoadingProfit(true);
    setOpenProfitDialog(true);
    try {
      const data = await getProfitByInvoice(fatura.id);
      setProfitData(data);
    } catch (error) {
      showSnackbar('Kar bilgisi alınamadı', 'error');
      setOpenProfitDialog(false);
    } finally {
      setLoadingProfit(false);
    }
  };

  const closeActionsMenu = () => setActionsMenu({ anchorEl: null, row: null });

  const getInvoiceRowMenuActions = (row: Fatura) => [
    {
      id: 'view',
      label: 'Detayları Görüntüle',
      icon: <Visibility fontSize="small" />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); handleView(row); },
      divider: false,
      disabled: false,
    },
    {
      id: 'edit',
      label: 'Düzenle',
      icon: <Edit fontSize="small" />,
      color: EDITABLE_STATUSES.includes(row.status) ? 'var(--primary)' : 'var(--muted-foreground)',
      onClick: () => { closeActionsMenu(); handleEdit(row); },
      divider: false,
      disabled: !EDITABLE_STATUSES.includes(row.status),
    },
    {
      id: 'approve',
      label: 'Onayla',
      icon: <CheckCircle fontSize="small" sx={{ color: 'var(--chart-3)' }} />,
      color: 'var(--chart-3)',
      onClick: () => { closeActionsMenu(); handleApprove(row); },
      divider: false,
      disabled: !APPROVABLE_STATUSES.includes(row.status),
    },
    {
      id: 'revert',
      label: 'Taslağa Çevir',
      icon: <Undo fontSize="small" sx={{ color: 'var(--chart-4)' }} />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); handleRevertToDraft(row); },
      divider: false,
      disabled: row.status !== 'APPROVED',
    },
    {
      id: 'print',
      label: 'Yazdır',
      icon: <Print fontSize="small" />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); window.open(`/invoice/sales/print/${row.id}`, '_blank'); },
      divider: true,
      disabled: false,
    },
    {
      id: 'profit',
      label: 'Kâr/Zarar Analizi',
      icon: <TrendingUp fontSize="small" sx={{ color: 'var(--chart-3)' }} />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); handleShowProfit(row); },
      divider: false,
      disabled: false,
    },
    {
      id: 'copy',
      label: 'Kopyasını Oluştur',
      icon: <FileCopy fontSize="small" />,
      color: 'var(--foreground)',
      onClick: () => {
        closeActionsMenu();
        const path = `/invoice/sales/yeni?kopyala=${row.id}`;
        const tabId = `fatura-satis-kopyala-${row.id}`;
        addTab({ id: tabId, label: `Kopya: ${row.invoiceNo}`, path });
        setActiveTab(tabId);
        router.push(path);
      },
      divider: false,
      disabled: false,
    },
    {
      id: 'template',
      label: 'Şablon Olarak Kullan',
      icon: <Description fontSize="small" />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); handleUseTemplate(); },
      divider: true,
      disabled: false,
    },
    {
      id: 'einvoice',
      label: row.efaturaStatus === 'SENT' ? 'E-Fatura Gönderildi' : 'E-Fatura Gönder',
      icon: sendingEInvoice === row.id ? <CircularProgress size={14} /> : <CloudUpload fontSize="small" sx={{ color: row.efaturaStatus === 'SENT' ? 'text.disabled' : 'var(--primary)' }} />,
      color: 'var(--foreground)',
      onClick: () => { closeActionsMenu(); handleSendEInvoice(row); },
      divider: false,
      disabled: row.efaturaStatus === 'SENT' || sendingEInvoice === row.id,
    },
    {
      id: 'cancel',
      label: 'İptal Et',
      icon: <Cancel fontSize="small" sx={{ color: 'var(--destructive)' }} />,
      color: 'var(--destructive)',
      onClick: () => { closeActionsMenu(); openIptalDialog(row); },
      divider: false,
      disabled: !CANCELLABLE_STATUSES.includes(row.status),
    },
    {
      id: 'delete',
      label: 'Sil',
      icon: <Delete fontSize="small" sx={{ color: 'var(--destructive)' }} />,
      color: 'var(--destructive)',
      onClick: () => { closeActionsMenu(); openDeleteDialog(row); },
      divider: false,
      disabled: !EDITABLE_STATUSES.includes(row.status) || !can('invoice', 'delete'),
    },
  ];

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'invoiceNo',
      headerName: 'Fatura No',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, height: '100%' }}>
          <Typography variant="body2" fontWeight="bold">{params.value}</Typography>
          {params.row.earsiv && <Chip label="E-Arşiv" size="small" color="info" sx={{ height: 20, fontSize: '0.65rem' }} />}
          {params.row.efatura && <Chip label="E-Fatura" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />}
        </Box>
      )
    },
    {
      field: 'date',
      headerName: 'Tarih',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2">{new Date(params.value).toLocaleDateString('tr-TR')}</Typography>
        </Box>
      )
    },
    {
      field: 'accountCode',
      headerName: 'Cari Kod',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" color="text.secondary">{params.row.account?.accountCode || ''}</Typography>
        </Box>
      )
    },
    {
      field: 'account',
      headerName: 'Cari Ünvan',
      flex: 1.5,
      minWidth: 200,
      valueGetter: (value, row) => row.account?.title || '',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'dueDate',
      headerName: 'Vade',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2">{params.value ? new Date(params.value).toLocaleDateString('tr-TR') : '-'}</Typography>
        </Box>
      )
    },
    {
      field: 'grandTotal',
      headerName: 'Tutar',
      width: 150,
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', height: '100%', width: '100%' }}>
          <ArrowDownward sx={{ fontSize: 14, color: 'var(--chart-3)' }} />
          <Typography variant="body2" fontWeight="700" sx={{ color: 'var(--chart-3)' }}>
            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(params.value)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Durum',
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <StatusBadge status={params.value} />
        </Box>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'İşlemler',
      width: 80,
      sortable: false,
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
    },
  ], [actionsMenu.anchorEl, actionsMenu.row?.id]);

  const handleUseTemplate = () => {
    showSnackbar('Bu özellik yakında eklenecektir.', 'info');
  };

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
              Satış Faturaları
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Müşteri satış faturalarınızı yönetin
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
                addTab({
                  id: 'invoice-sales-yeni',
                  label: 'Yeni Satış Faturası',
                  path: '/invoice/sales/yeni'
                });
                setActiveTab('invoice-sales-yeni');
                router.push('/invoice/sales/yeni');
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
      <KPIHeader loading={loading} data={kpiData} type="SATIS" />

      {/* Entegre Toolbar ve DataGrid */}
      <StandardCard padding={0} sx={{ boxShadow: 'none', overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'var(--card)' }}>
          <TextField
            id="satis-fatura-search"
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
          <Box sx={{ p: 2, bgcolor: 'var(--muted)', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <TextField
                  id="satis-fatura-filter-start-date"
                  fullWidth type="date" size="small" label="Başlangıç Tarihi"
                  value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <TextField
                  id="satis-fatura-filter-end-date"
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
                    <MenuItem value="OPEN">Beklemede</MenuItem>
                    <MenuItem value="APPROVED">Onaylandı</MenuItem>
                    <MenuItem value="PARTIALLY_PAID">Kısmen Ödendi</MenuItem>
                    <MenuItem value="CLOSED">Ödendi</MenuItem>
                    <MenuItem value="CANCELLED">İptal Edildi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <Autocomplete
                  size="small"
                  options={cariler}
                  getOptionLabel={(option: Cari) => `${option.accountCode} - ${option.title}`}
                  value={cariler.find(c => c.id === filterCariId) || null}
                  onChange={(_: any, newValue: Cari | null) => setFilterCariId(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Cari" id="invoice-sales-filter-cari" />}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                <Autocomplete
                  size="small"
                  options={satisElemanlari}
                  getOptionLabel={(option: any) => option.fullName || option.username || ''}
                  value={satisElemanlari.find(s => s.id === filterSatisElemaniId) || null}
                  onChange={(_: any, newValue: any) => setFilterSatisElemaniId(newValue?.id || '')}
                  renderInput={(params) => <TextField {...params} label="Satış Elemanı" id="invoice-sales-filter-sales-agent" />}
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
            Toplam <b>{rowCount}</b> fatura listeleniyor
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Bu sayfa: <b>{faturalar.length}</b> fatura — <b>{formatCurrency(pageGrandTotal)}</b>
          </Typography>
        </Box>

        {/* DataGrid */}
        <Box sx={{ width: '100%' }}>
          <InvoiceDataGrid
            rows={faturalar}
            columns={columns}
            loading={loading}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            onFilterModelChange={setFilterModel}
            checkboxSelection={false}
            height={680}
          />
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
                    Gelişmiş İşlemler
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
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          bgcolor:
                            action.id === 'cancel' || action.id === 'delete'
                              ? 'var(--destructive)'
                              : 'var(--secondary)',
                          color: action.id === 'cancel' || action.id === 'delete'
                            ? 'var(--primary-foreground)'
                            : action.color,
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
        </Box>
        {/* Tablo footer sum - sadece mevcut sayfadaki satırlara göre */}
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
          <Typography variant="body2" fontWeight={800} sx={{ color: 'var(--secondary)' }}>
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
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">Fatura No:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight="bold">{selectedFatura.invoiceNo}</Typography>
                    {selectedFatura.deliveryNoteId && selectedFatura.deliveryNote && (
                      <MuiLink
                        component={Link}
                        href={`/sales-delivery-note/${selectedFatura.deliveryNoteId}`}
                        onClick={(e: any) => {
                          e.stopPropagation();
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          textDecoration: 'none',
                          color: 'var(--secondary)',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        <LocalShipping fontSize="small" />
                        <Typography variant="body2" fontWeight={500}>
                          {selectedFatura.deliveryNote.deliveryNoteNo}
                        </Typography>
                      </MuiLink>
                    )}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">Tarih:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(selectedFatura.date)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Cari:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedFatura.account.title}
                </Typography>
              </Box>

              {selectedFatura.items && selectedFatura.items.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Kalemler:</Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Malzeme Kodu</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Stok</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Miktar</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Birim Fiyat</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>İndirim (%)</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>İndirim (₺)</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>KDV %</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Tutar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedFatura.items.map((kalem: any, index: any) => (
                          <TableRow key={index} hover>
                            <TableCell>{kalem.product?.code || '-'}</TableCell>
                            <TableCell>{kalem.product?.name || '-'}</TableCell>
                            <TableCell>{kalem.quantity}</TableCell>
                            <TableCell>{formatCurrency(kalem.unitPrice)}</TableCell>
                            <TableCell>%{kalem.discountRate || 0}</TableCell>
                            <TableCell>{formatCurrency(kalem.discountAmount || 0)}</TableCell>
                            <TableCell>%{kalem.vatRate}</TableCell>
                            <TableCell align="right">
                              {formatCurrency((Number(kalem.amount) || 0) + (Number(kalem.vatAmount) || 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'var(--muted)', borderRadius: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                    <Typography variant="body2" color="text.secondary">Ara Toplam:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrency(Number(selectedFatura.totalAmount || 0) + Number(selectedFatura.discount || selectedFatura.iskonto || 0))}
                    </Typography>
                  </Box>
                  {Number(selectedFatura.discount || selectedFatura.iskonto) > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                      <Typography variant="body2" color="text.secondary">Genel İskonto:</Typography>
                      <Typography variant="body2" fontWeight={500} color="error.main">
                        -{formatCurrency(selectedFatura.discount || selectedFatura.iskonto)}
                      </Typography>
                    </Box>
                  )}
                  {(Number(selectedFatura.sctTotal) > 0 || Number(selectedFatura.withholdingTotal) > 0) && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                      <Typography variant="body2" color="text.secondary">Net Ara Toplam:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(selectedFatura.totalAmount)}
                      </Typography>
                    </Box>
                  )}
                  {Number(selectedFatura.sctTotal) > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                      <Typography variant="body2" color="text.secondary">ÖİV Toplamı:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(selectedFatura.sctTotal)}
                      </Typography>
                    </Box>
                  )}
                  {Number(selectedFatura.withholdingTotal) > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                      <Typography variant="body2" color="text.secondary">Tevkifat Toplamı:</Typography>
                      <Typography variant="body2" fontWeight={500} color="error.main">
                        -{formatCurrency(selectedFatura.withholdingTotal)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                    <Typography variant="body2" color="text.secondary">KDV Toplamı:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrency(selectedFatura.vatAmount || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ width: '250px', my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                    <Typography variant="h6" fontWeight="bold">Genel Toplam:</Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {formatCurrency(selectedFatura.grandTotal)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Ödeme Planı */}
              {paymentPlanData && paymentPlanData.plans && paymentPlanData.plans.length > 0 && (
                <Accordion variant="outlined" sx={{ bgcolor: 'color-mix(in srgb, var(--chart-3) 10%, transparent)', mt: 2, '&:before': { display: 'none' } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore color="primary" />}
                    sx={{
                      minHeight: '48px',
                      '& .MuiAccordionSummary-content': { my: 1 }
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--primary)' }}>
                      💳 Ödeme Planı
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Özet Kartları */}
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Paper sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'var(--muted)' }}>
                          <Typography variant="caption" color="text.secondary">Toplam Taksit:</Typography>
                          <Typography variant="h6" fontWeight="bold">{paymentPlanData.summary.totalInstallments}</Typography>
                        </Paper>
                        <Paper sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'var(--muted)' }}>
                          <Typography variant="caption" color="text.secondary">Toplam Tutar:</Typography>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
                            {formatCurrency(paymentPlanData.summary.totalAmount)}
                          </Typography>
                        </Paper>
                        <Paper sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'color-mix(in srgb, var(--chart-3) 20%, transparent)' }}>
                          <Typography variant="caption" color="text.secondary">Ödenen:</Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--chart-3)' }}>
                            {formatCurrency(paymentPlanData.summary.totalPaid)}
                          </Typography>
                        </Paper>
                        <Paper sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'color-mix(in srgb, var(--chart-4) 20%, transparent)' }}>
                          <Typography variant="caption" color="text.secondary">Bekleyen:</Typography>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: 'var(--chart-4)' }}>
                            {formatCurrency(paymentPlanData.summary.totalPending)}
                          </Typography>
                        </Paper>
                      </Box>

                      {/* İlerleme Çubuğu */}
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Ödeme Durumu
                          </Typography>
                          <Typography variant="caption" fontWeight="bold" color="primary.main">
                            %{Math.round((paymentPlanData.summary.paidCount / paymentPlanData.summary.totalInstallments) * 100)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(paymentPlanData.summary.paidCount / paymentPlanData.summary.totalInstallments) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'var(--muted)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: 'var(--chart-3)',
                            },
                          }}
                        />
                      </Box>

                      {/* Taksit Tablosu */}
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: 'var(--muted)' }}>
                              <TableCell sx={{ fontWeight: 600 }}>Taksit</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Vade Tarihi</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Tutar</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Ödeme Tipi</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Ödendi</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {paymentPlanData.plans.map((plan: any, index: number) => {
                              const isOverdue = !plan.isPaid && new Date(plan.dueDate) < new Date();
                              return (
                                <TableRow
                                  key={plan.id}
                                  sx={{
                                    bgcolor: isOverdue ? 'color-mix(in srgb, var(--destructive) 10%, transparent)' : 'inherit',
                                  }}
                                >
                                  <TableCell>{index + 1}. Taksit</TableCell>
                                  <TableCell>
                                    {new Date(plan.dueDate).toLocaleDateString('tr-TR')}
                                    {isOverdue && (
                                      <Chip
                                        label="Gecikmiş"
                                        size="small"
                                        color="error"
                                        sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell>{formatCurrency(Number(plan.amount))}</TableCell>
                                  <TableCell>{plan.paymentType || '-'}</TableCell>
                                  <TableCell>
                                    {plan.isPaid ? (
                                      <Chip
                                        label="Ödendi"
                                        size="small"
                                        color="success"
                                        sx={{ fontSize: '0.75rem' }}
                                      />
                                    ) : (
                                      <Chip
                                        label="Bekliyor"
                                        size="small"
                                        color="warning"
                                        sx={{ fontSize: '0.75rem' }}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Checkbox
                                      checked={plan.isPaid}
                                      onChange={async (e) => {
                                        try {
                                          await axios.put(`/invoices/payment-plan/${plan.id}`, {
                                            isPaid: e.target.checked,
                                          });
                                          // Refresh payment plan
                                          const planResponse = await axios.get(`/invoices/${selectedFatura.id}/payment-plan`);
                                          setPaymentPlanData(planResponse.data);
                                          showSnackbar(
                                            e.target.checked ? 'Taksit ödendi olarak işaretlendi' : 'Taksit bekliyor olarak işaretlendi',
                                            'success'
                                          );
                                        } catch (error: any) {
                                          showSnackbar('İşlem başarısız', 'error');
                                        }
                                      }}
                                      size="small"
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Audit Bilgileri */}
              <Accordion variant="outlined" sx={{ bgcolor: 'color-mix(in srgb, var(--chart-1) 10%, transparent)', mt: 2, '&:before': { display: 'none' } }}>
                <AccordionSummary
                  expandIcon={<ExpandMore color="primary" />}
                  sx={{
                    minHeight: '48px',
                    '& .MuiAccordionSummary-content': { my: 1 }
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'var(--primary)' }}>
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
                          {selectedFatura.createdByUser?.fullName || 'Sistem'}
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                            ({selectedFatura.createdByUser?.username || '-'})
                          </Typography>
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Oluşturma Tarihi:
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {selectedFatura.createdAt
                            ? new Date(selectedFatura.createdAt).toLocaleString('tr-TR')
                            : '-'}
                        </Typography>
                      </Box>
                    </Box>

                    {selectedFatura.updatedByUser && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Son Güncelleyen:
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {selectedFatura.updatedByUser.fullName}
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                              ({selectedFatura.updatedByUser.username})
                            </Typography>
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Son Güncelleme:
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {selectedFatura.updatedAt
                              ? new Date(selectedFatura.updatedAt).toLocaleString('tr-TR')
                              : '-'}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {selectedFatura.logs && selectedFatura.logs.length > 0 && (
                      <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid var(--border)' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                          Son İşlemler:
                        </Typography>
                        {selectedFatura.logs.slice(0, 3).map((log: any, index: number) => (
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
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Kapat</Button>
        </DialogActions>
      </Dialog >

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
                      Bağlı olduğu irsaliye de iptal edilsin mi?
                    </Typography>
                  </Box>
                  {irsaliyeIptal && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        İrsaliye iptal edildiğinde, irsaliye durumu güncellenir. (Stok sadece onaylı faturalardan hesaplanır)
                      </Typography>
                    </Alert>
                  )}
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
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, var(--destructive) 0%, var(--destructive) 100%)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--destructive) 0%, var(--destructive) 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              },
            }}
          >
            İptal Et
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDurumOnay} onClose={handleDurumChangeCancel} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle component="div" sx={{
          background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
          color: 'var(--primary-foreground)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
        }}>
          Durum Değişikliği Onayı
          <IconButton size="small" onClick={handleDurumChangeCancel} sx={{ color: 'var(--primary-foreground)' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {pendingDurum && selectedFatura && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Bu işlem stok ve cari hareketlerini etkileyecektir!
                </Typography>
              </Alert>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>{selectedFatura.invoiceNo}</strong> nolu fatura durumunu değiştirmek istiyorsunuz.
              </Typography>
              <Box sx={{
                p: 2,
                bgcolor: 'var(--muted)',
                borderRadius: 1,
                mb: 2,
                border: '1px solid var(--border)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">Mevcut Durum:</Typography>
                    <Chip
                      label={getStatusLabel(pendingDurum.eskiDurum)}
                      color={getStatusColor(pendingDurum.eskiDurum)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  <Typography variant="h6" color="text.secondary">→</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">Yeni Durum:</Typography>
                    <Chip
                      label={getStatusLabel(pendingDurum.yeniDurum)}
                      color={getStatusColor(pendingDurum.yeniDurum)}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDurumChangeCancel}>İptal</Button>
          <Button
            onClick={handleDurumChangeConfirm}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              }
            }}
          >
            Onayla ve Değiştir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profit Dialog */}
      <Dialog
        open={openProfitDialog}
        onClose={() => {
          setOpenProfitDialog(false);
          setProfitData(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle component="div">
          <Box display="flex" alignItems="center" gap={2}>
            <TrendingUp sx={{ color: 'var(--chart-3)' }} />
            <Typography variant="h6">Fatura Karlılığı</Typography>
            {profitData?.fatura && (
              <Chip
                label={profitData.fatura.faturaNo}
                color="primary"
                size="small"
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {loadingProfit ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : profitData?.fatura ? (
            <Box>
              <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'var(--muted)' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Fatura Özeti
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Toplam Satış:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    }).format(profitData.fatura.toplamSatisTutari)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">Toplam Maliyet:</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    }).format(profitData.fatura.toplamMaliyet)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2" fontWeight="bold">Toplam Kar:</Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={profitData.fatura.toplamKar >= 0 ? 'success.main' : 'error.main'}
                  >
                    {new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                    }).format(profitData.fatura.toplamKar)}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Kar bilgisi bulunamadı
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenProfitDialog(false);
            setProfitData(null);
          }}>
            Kapat
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
