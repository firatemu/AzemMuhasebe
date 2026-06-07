'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  TextField,
  LinearProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  Collapse,
  Tooltip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Add,
  Search,
  RefreshOutlined,
  FilterList,
  Close,
  AccountBalance,
  AccountBalanceWallet,
  Visibility,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  Download,
  CreditCard,
  MoreVert,
  Print,
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { StandardPage, StandardCard } from '@/components/common';
import { useTabStore } from '@/stores/tabStore';
import * as XLSX from 'xlsx';

interface Bank {
  id: string;
  name: string;
  logo?: string;
}

interface BankAccount {
  id: string;
  name: string;
  code: string;
  type: 'VADESIZ' | 'POS' | 'KREDI' | 'FIRMA_KREDI_KARTI';
  accountNo?: string;
  iban?: string;
  balance: number;
  isActive: boolean;
  commissionRate?: number;
  creditLimit?: number;
  cardLimit?: number;
  billingDay?: number;
  dueDay?: number;
  bank: Bank;
  bankName?: string;
}

interface BankAccountMovement {
  id: string;
  movementType: 'INCOMING' | 'OUTGOING';
  movementSubType?: string;
  amount: number;
  commissionRate?: number;
  commissionAmount?: number;
  netAmount?: number;
  balance: number;
  notes?: string;
  referenceNo?: string;
  date: string;
  createdAt: string;
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  VADESIZ: 'Vadesiz Hesap',
  POS: 'POS Hesabı',
  KREDI: 'Ticari Kredi',
  FIRMA_KREDI_KARTI: 'Firma Kredi Kartı',
};

const MOVEMENT_SUBTYPE_LABELS: Record<string, string> = {
  HAVALE_GELEN: 'Gelen Havale',
  HAVALE_GIDEN: 'Giden Havale',
  POS_TAHSILAT: 'POS Tahsilat',
  KREDI_KULLANIM: 'Kredi Kullanım',
  KREDI_ODEME: 'Kredi Ödeme',
  KART_HARCAMA: 'Kart Harcama',
  KART_ODEME: 'Kart Ödeme',
};

export default function BankAccountsPage() {
  const router = useRouter();
  const { addTab, setActiveTab } = useTabStore();

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'createdAt', sort: 'desc' }]);
  const [rowCount, setRowCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterBankId, setFilterBankId] = useState('');
  const [filterType, setFilterType] = useState('');

  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [movements, setMovements] = useState<BankAccountMovement[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [movementsLoading, setMovementsLoading] = useState(false);

  const [actionsMenu, setActionsMenu] = useState<{ anchorEl: HTMLElement | null; row: BankAccount | null }>({ anchorEl: null, row: null });

  const [openDelete, setOpenDelete] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  useEffect(() => {
    addTab({ id: 'bank-accounts', label: 'Banka Hesapları', path: '/bank/accounts' });
  }, [addTab]);

  useEffect(() => {
    fetchAccounts();
    fetchBanks();
  }, [paginationModel, sortModel, filterBankId, filterType]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      };
      if (filterBankId) params.bankId = filterBankId;
      if (filterType) params.type = filterType;

      const response = await axios.get('/banks/accounts', { params });
      setAccounts(response.data || []);
      setRowCount(Array.isArray(response.data) ? response.data.length : 0);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Hesaplar yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await axios.get('/banks');
      setBanks(response.data || []);
    } catch (error: any) {
      console.error('Bankalar yüklenirken hata:', error);
    }
  };

  const fetchMovements = async (accountId: string) => {
    try {
      setMovementsLoading(true);
      const response = await axios.get(`/banks/accounts/${accountId}/movements`);
      setMovements(response.data || []);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Hareketler yüklenirken hata oluştu', 'error');
    } finally {
      setMovementsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleViewAccount = async (account: BankAccount) => {
    try {
      setSelectedAccount(account);
      setViewDialogOpen(true);
      await fetchMovements(account.id);
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Hesap yüklenemedi', 'error');
    }
  };

  const handleCloseActionsMenu = () => setActionsMenu({ anchorEl: null, row: null });

  const handleClearFilters = () => {
    setFilterBankId('');
    setFilterType('');
    setSearchTerm('');
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    try {
      await axios.delete(`/banks/accounts/${selectedAccount.id}`);
      showSnackbar('Hesap başarıyla silindi', 'success');
      setOpenDelete(false);
      fetchAccounts();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Silme işlemi başarısız', 'error');
    }
  };

  const handleExportExcel = async () => {
    try {
      const params: Record<string, any> = {};
      if (filterBankId) params.bankId = filterBankId;
      if (filterType) params.type = filterType;

      const response = await axios.get('/banks/accounts', { params: { ...params, limit: 10000, page: 1 }, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `banka_hesaplari_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSnackbar('Excel dosyası indirildi', 'success');
    } catch (error: any) {
      showSnackbar('Excel aktarımı başarısız', 'error');
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return accounts;
    const term = searchTerm.toLowerCase();
    return accounts.filter(a =>
      a.name?.toLowerCase().includes(term) ||
      a.code?.toLowerCase().includes(term) ||
      a.iban?.toLowerCase().includes(term) ||
      a.accountNo?.toLowerCase().includes(term) ||
      a.bank?.name?.toLowerCase().includes(term)
    );
  }, [accounts, searchTerm]);

  const pageTotals = useMemo(() => {
    return accounts.reduce(
      (acc, account) => ({
        balance: acc.balance + (account.balance || 0),
        creditLimit: acc.creditLimit + (account.type === 'KREDI' ? (account.creditLimit || 0) : 0),
        cardLimit: acc.cardLimit + (account.type === 'FIRMA_KREDI_KARTI' ? (account.cardLimit || 0) : 0),
      }),
      { balance: 0, creditLimit: 0, cardLimit: 0 }
    );
  }, [accounts]);

  const movementColumns: GridColDef[] = useMemo(() => [
    {
      field: 'date',
      headerName: 'Tarih',
      width: 160,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: 'movementType',
      headerName: 'Tip',
      width: 100,
      renderCell: (params) => (
        <Chip
          icon={params.value === 'INCOMING' ? <TrendingUp /> : <TrendingDown />}
          label={params.value === 'INCOMING' ? 'Gelen' : 'Giden'}
          color={params.value === 'INCOMING' ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'movementSubType',
      headerName: 'Alt Tip',
      width: 130,
      renderCell: (params) => MOVEMENT_SUBTYPE_LABELS[params.value as string] || params.value || '-',
    },
    {
      field: 'amount',
      headerName: 'Tutar',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => (
        <Typography fontWeight="600" color={params.row.movementType === 'INCOMING' ? 'success.main' : 'error.main'}>
          {params.row.movementType === 'INCOMING' ? '+' : '-'}{formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'commissionAmount',
      headerName: 'Komisyon',
      width: 110,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => value ? formatCurrency(value) : '-',
    },
    {
      field: 'balance',
      headerName: 'Bakiye',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => formatCurrency(Number(value)),
    },
    {
      field: 'notes',
      headerName: 'Açıklama',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'referenceNo',
      headerName: 'Referans',
      width: 120,
    },
  ], []);

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'name',
      headerName: 'Hesap Adı',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: alpha(params.row.type === 'KREDI' ? 'var(--chart-4)' : params.row.type === 'POS' ? 'var(--chart-2)' : 'var(--primary)', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {params.row.type === 'POS' ? <CreditCard sx={{ fontSize: 16 }} /> : params.row.type === 'KREDI' ? <AccountBalance sx={{ fontSize: 16 }} /> : <AccountBalanceWallet sx={{ fontSize: 16 }} />}
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="bold">{params.value}</Typography>
            <Typography variant="caption" color="text.secondary">{params.row.bank?.name || ''}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'code',
      headerName: 'Kod',
      width: 120,
      renderCell: (params) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{params.value}</Typography>,
    },
    {
      field: 'type',
      headerName: 'Tür',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={ACCOUNT_TYPE_LABELS[params.value] || params.value}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
        />
      ),
    },
    {
      field: 'bank',
      headerName: 'Banka',
      width: 150,
      renderCell: (params) => params.value?.name || '-',
    },
    {
      field: 'balance',
      headerName: 'Bakiye',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => formatCurrency(value),
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={700} sx={{ color: 'var(--primary)' }}>
          {formatCurrency(params.value)}
        </Typography>
      ),
    },
    {
      field: 'accountNo',
      headerName: 'Hesap No / IBAN',
      width: 180,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
          {params.value || (params.row.iban ? params.row.iban.substring(0, 26) + '...' : '-')}
        </Typography>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Durum',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Aktif' : 'Pasif'}
          size="small"
          color={params.value ? 'success' : 'default'}
          sx={{ fontWeight: 600, borderRadius: 1.5 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            setActionsMenu({ anchorEl: event.currentTarget, row: params.row });
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      ),
    },
  ], []);

  const getActionsForRow = (row: BankAccount) => [
    {
      id: 'view',
      label: 'Detayları Görüntüle',
      icon: <Visibility fontSize="small" />,
      onClick: () => { handleCloseActionsMenu(); handleViewAccount(row); },
    },
    {
      id: 'print',
      label: 'Yazdır',
      icon: <Print fontSize="small" />,
      onClick: () => { handleCloseActionsMenu(); window.open(`/bank/hesap/${row.id}?print=true`, '_blank'); },
    },
    {
      id: 'delete',
      label: 'Sil',
      icon: <Delete fontSize="small" sx={{ color: 'var(--destructive)' }} />,
      onClick: () => { handleCloseActionsMenu(); setSelectedAccount(row); setOpenDelete(true); },
    },
  ];

  return (
    <StandardPage maxWidth={false}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'color-mix(in srgb, var(--primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AccountBalanceWallet sx={{ color: 'var(--primary)', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight="700">Banka Hesapları</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<Download />} onClick={handleExportExcel}>
            Excel
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={() => router.push('/bank')}
            sx={{ bgcolor: 'var(--primary)' }}
          >
            Yeni Hesap
          </Button>
        </Stack>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2, height: 3 }} color="secondary" />}

      {/* Summary KPIs */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--primary)' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">Toplam Bakiye</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: 'var(--primary)' }}>
                {formatCurrency(pageTotals.balance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--chart-4)' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">Toplam Kredi Limiti</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: 'var(--chart-4)' }}>
                {formatCurrency(pageTotals.creditLimit)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--chart-2)' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">Toplam Kart Limiti</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: 'var(--chart-2)' }}>
                {formatCurrency(pageTotals.cardLimit)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <StandardCard padding={0} sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', gap: 1.5, alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            size="small"
            placeholder="Hesap ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <Close fontSize="small" />
                </IconButton>
              ),
            }}
          />
          <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
            <Tooltip title="Filtreler">
              <IconButton onClick={() => setShowFilters(!showFilters)} color={showFilters ? 'secondary' : 'default'}>
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Yenile">
              <IconButton onClick={fetchAccounts}>
                <RefreshOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ p: 2, bgcolor: 'action.hover', borderBottom: '1px solid var(--border)' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Banka</InputLabel>
                <Select value={filterBankId} onChange={(e) => setFilterBankId(e.target.value)} label="Banka">
                  <MenuItem value="">Tümü</MenuItem>
                  {banks.map((bank) => (
                    <MenuItem key={bank.id} value={bank.id}>{bank.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Hesap Türü</InputLabel>
                <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Hesap Türü">
                  <MenuItem value="">Tümü</MenuItem>
                  {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={handleClearFilters}>Temizle</Button>
            </Stack>
          </Box>
        </Collapse>

        <DataGrid
          rows={filteredAccounts}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          checkboxSelection={false}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: 'var(--muted)',
              borderBottom: '1px solid var(--border)',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid var(--border)',
              py: 1.5,
            },
            '& .MuiDataGrid-row:hover': {
              bgcolor: 'var(--secondary)',
              cursor: 'pointer',
            },
          }}
          onRowClick={(params) => handleViewAccount(params.row as BankAccount)}
        />
      </StandardCard>

      {/* Actions Menu */}
      <Dialog
        anchorEl={actionsMenu.anchorEl}
        open={Boolean(actionsMenu.anchorEl)}
        onClose={handleCloseActionsMenu}
      >
        <DialogTitle>İşlemler</DialogTitle>
        <DialogContent>
          {actionsMenu.row && getActionsForRow(actionsMenu.row).map((action) => (
            <Button
              key={action.id}
              startIcon={action.icon}
              onClick={action.onClick}
              fullWidth
              sx={{ justifyContent: 'flex-start', py: 1 }}
            >
              {action.label}
            </Button>
          ))}
        </DialogContent>
      </Dialog>

      {/* View Account Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle component="div" sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {selectedAccount?.name} - {selectedAccount?.bank?.name}
          </Box>
          <IconButton size="small" onClick={() => setViewDialogOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--primary)' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary">Güncel Bakiye</Typography>
                      <Typography variant="h5" fontWeight={800} sx={{ color: 'var(--primary)' }}>
                        {formatCurrency(selectedAccount.balance)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {selectedAccount.type === 'POS' && selectedAccount.commissionRate && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--chart-2)' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="caption" color="text.secondary">Komisyon Oranı</Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ color: 'var(--chart-2)' }}>
                          %{selectedAccount.commissionRate}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {selectedAccount.type === 'KREDI' && selectedAccount.creditLimit && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 2, border: '1px solid var(--border)', borderLeft: '4px solid var(--chart-4)' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="caption" color="text.secondary">Kredi Limiti</Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ color: 'var(--chart-4)' }}>
                          {formatCurrency(selectedAccount.creditLimit)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>

              <Box sx={{ mb: 2, display: 'flex', gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Hesap Kodu</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedAccount.code}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Tür</Typography>
                  <Typography variant="body1" fontWeight="bold">{ACCOUNT_TYPE_LABELS[selectedAccount.type]}</Typography>
                </Box>
                {selectedAccount.iban && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">IBAN</Typography>
                    <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>{selectedAccount.iban}</Typography>
                  </Box>
                )}
              </Box>

              {movementsLoading ? (
                <LinearProgress />
              ) : (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Son Hareketler</Typography>
                  <DataGrid
                    rows={movements}
                    columns={movementColumns}
                    autoHeight
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{
                      border: '1px solid var(--border)',
                      borderRadius: 2,
                      '& .MuiDataGrid-columnHeaders': { bgcolor: 'var(--muted)' },
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Hesap Sil</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{selectedAccount?.name}</strong> hesabını silmek istediğinize emin misiniz?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>Bu işlem geri alınamaz!</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>İptal</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Sil</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </StandardPage>
  );
}