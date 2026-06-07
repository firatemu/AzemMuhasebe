'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Menu,
  MenuItem,
  Tooltip,
  Collapse,
  InputAdornment,
  Grid,
  Divider,
  alpha,
  useTheme,
  Stack,
  ListItemIcon,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import {
  Add,
  Edit,
  Delete,
  Search,
  Close,
  AccountBalance,
  MoreVert,
  Refresh,
  ToggleOn,
  ToggleOff,
  ArrowDownward,
  ArrowUpward,
  BarChart,
  Person,
  Business,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Phone,
  Email,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';
import { useTabStore } from '@/stores/tabStore';
import NewCariDialog from '@/components/cari/NewCariDialog';
import EditCariDialog from '@/components/cari/EditCariDialog';
import { StandardPage, StandardCard } from '@/components/common';

export default function CariPage() {
  const theme = useTheme();
  const router = useRouter();
  const { tabs, addTab, removeTab, setActiveTab } = useTabStore();
  const [cariler, setCariler] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [loading, setLoading] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [selectedCari, setSelectedCari] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [showChart, setShowChart] = useState(false);
  const [selectedTipFilter, setSelectedTipFilter] = useState<'all' | 'CUSTOMER' | 'SUPPLIER' | 'BOTH'>('all');
  const [selectedBalanceFilter, setSelectedBalanceFilter] = useState<'all' | 'borclu' | 'alacakli'>('all');

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    addTab({
      id: 'accounts-list',
      label: 'Cari Listesi',
      path: '/accounts',
    });
  }, []);

  const handleCloseAdd = useCallback(() => {
    setOpenAdd(false);
    removeTab('yeni-cari');
    setActiveTab('accounts-list');
  }, [removeTab, setActiveTab]);

  useEffect(() => {
    if (openAdd && !tabs.some((t) => t.id === 'yeni-cari')) {
      setOpenAdd(false);
    }
  }, [tabs, openAdd]);

  const fetchCariler = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/account', {
        params: {
          search: debouncedSearch || undefined,
          page: 1,
          limit: 100,
          isActive: showInactive ? undefined : true,
        },
      });
      const result = response.data;
      setCariler(result.data || []);
    } catch (error) {
      console.error('Cari verisi alınamadı:', error);
      showSnackbar('Cari listesi yüklenemedi', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, showInactive]);

  useEffect(() => {
    fetchCariler();
  }, [fetchCariler]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/account/${selectedCari.id}`);
      showSnackbar('Cari başarıyla silindi', 'success');
      setOpenDelete(false);
      setSelectedCari(null);
      fetchCariler();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Cari silinemedi', 'error');
    }
  };

  const handleDeactivate = async () => {
    try {
      await axios.patch(`/account/${selectedCari.id}`, {
        isActive: false,
      });
      showSnackbar('Cari kullanım dışı yapıldı', 'success');
      setOpenDeactivate(false);
      setSelectedCari(null);
      fetchCariler();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İşlem başarısız', 'error');
    }
  };

  const handleActivate = async (cari: any) => {
    try {
      await axios.patch(`/account/${cari.id}`, {
        isActive: true,
      });
      showSnackbar('Cari yeniden aktif edildi', 'success');
      fetchCariler();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'İşlem başarısız', 'error');
    }
  };

  const openEditDialog = (cari: any) => {
    setSelectedCari(cari);
    setOpenEdit(true);
  };

  const openDeleteDialog = (cari: any) => {
    setSelectedCari(cari);
    setOpenDelete(true);
  };

  const filteredCariler = useMemo(() => {
    let result = cariler;

    // Filter by type
    if (selectedTipFilter !== 'all') {
      result = result.filter((cari) => cari.type === selectedTipFilter);
    }

    // Filter by balance
    if (selectedBalanceFilter === 'borclu') {
      result = result.filter((cari) => parseFloat(cari.balance || 0) > 0);
    } else if (selectedBalanceFilter === 'alacakli') {
      result = result.filter((cari) => parseFloat(cari.balance || 0) < 0);
    }

    return result;
  }, [cariler, selectedTipFilter, selectedBalanceFilter]);

  // Metrics calculation
  const totalCari = useMemo(() => filteredCariler.length, [filteredCariler]);
  const totalBakiye = useMemo(() => {
    return filteredCariler.reduce((sum, cari) => sum + (parseFloat(cari.balance || 0)), 0);
  }, [filteredCariler]);
  const borcluCari = useMemo(() => {
    return filteredCariler.filter(c => parseFloat(c.balance || 0) > 0).length;
  }, [filteredCariler]);
  const alacakliCari = useMemo(() => {
    return filteredCariler.filter(c => parseFloat(c.balance || 0) < 0).length;
  }, [filteredCariler]);
  const bakiyeBosCari = useMemo(() => {
    return filteredCariler.filter(c => parseFloat(c.balance || 0) === 0).length;
  }, [filteredCariler]);

  // Custom Toolbar Component
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        bgcolor: 'var(--card)'
      }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </Box>
      </GridToolbarContainer>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Tip',
      width: 80,
      renderCell: (params: GridRenderCellParams) => {
        const type = params.value;
        const typeConfig = {
          CUSTOMER: { label: 'M', icon: Person, color: 'var(--chart-1)', fullLabel: 'Müşteri' },
          SUPPLIER: { label: 'T', icon: Business, color: 'var(--primary)', fullLabel: 'Tedarikçi' },
          BOTH: { label: 'MT', icon: CreditCard, color: 'var(--chart-2)', fullLabel: 'Müşteri & Tedarikçi' },
        };
        const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.CUSTOMER;
        const Icon = config.icon;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 2,
                bgcolor: 'color-mix(in srgb, var(--card), transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
              }}
            >
              <Icon sx={{ fontSize: 14, color: config.color }} />
            </Box>
            <Typography variant="caption" fontWeight={700} sx={{ color: config.color }}>
              {config.label}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'code',
      headerName: 'Cari Kodu',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight={700} sx={{ color: 'var(--primary)' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'title',
      headerName: 'Ünvan',
      flex: 2,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'contactInfo',
      headerName: '\u0130leti\u015fim',
      flex: 1.5,
      minWidth: 180,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const phone = params.row.phone || params.row.telefon;
        const email = params.row.email;
        if (!phone && !email) {
          return <Typography variant="caption" sx={{ color: 'text.disabled' }}>-</Typography>;
        }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
            {phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, minWidth: 0 }}>
                <Phone sx={{ fontSize: 11, color: 'text.secondary', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {phone}
                </Typography>
              </Box>
            )}
            {phone && email && (
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>\u00b7</Typography>
            )}
            {email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, minWidth: 0, overflow: 'hidden' }}>
                <Email sx={{ fontSize: 11, color: 'text.secondary', flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email}
                </Typography>
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      field: 'balance',
      headerName: 'Bakiye',
      type: 'number',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => {
        const balance = parseFloat(params.value || 0);
        return (
          <Typography variant="body2" sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 0.5,
            fontWeight: 700
          }}>
            {balance > 0 && (
              <Box component="span" sx={{ color: 'var(--success)', fontWeight: 800, mr: 0.5 }}>
                (B)
              </Box>
            )}
            {balance < 0 && (
              <Box component="span" sx={{ color: 'var(--error)', fontWeight: 800, mr: 0.5 }}>
                (A)
              </Box>
            )}
            ₺{Math.abs(balance).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        );
      },
    },
    {
      field: 'isActive',
      headerName: 'Durum',
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        const isActive = params.value !== undefined ? params.value : (params.row.aktif !== undefined ? params.row.aktif : true);
        return (
          <Chip
            label={isActive ? 'Aktif' : 'Pasif'}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              bgcolor: isActive ? 'color-mix(in srgb, var(--success) 15%, transparent)' : 'color-mix(in srgb, var(--muted) 30%, transparent)',
              color: isActive ? 'var(--success)' : 'var(--muted-foreground)',
              border: `1px solid ${isActive ? 'var(--success)' : 'var(--border)'}`,
            }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const row = params.row as any;

        const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        const hasMovement = row.hareketSayisi && row.hareketSayisi > 0;
        const isActive = row.isActive !== undefined ? row.isActive : (row.aktif !== undefined ? row.aktif : true);

        const menuActions = [
          {
            id: 'movements',
            label: 'Hareketler',
            icon: <AccountBalance fontSize="small" sx={{ color: 'var(--primary)' }} />,
            color: 'var(--foreground)',
            onClick: () => { handleClose(); router.push(`/accounts/${row.id}?tab=1`); },
            disabled: false,
          },
          {
            id: 'edit',
            label: 'Düzenle',
            icon: <Edit fontSize="small" />,
            color: 'var(--foreground)',
            onClick: () => { handleClose(); openEditDialog(row); },
            disabled: false,
          },
        ];

        // Deactivate option for active cariler with movements
        if (isActive && hasMovement) {
          menuActions.push({
            id: 'deactivate',
            label: 'Kullanım Dışı Yap',
            icon: <Block fontSize="small" sx={{ color: 'var(--warning)' }} />,
            color: 'var(--foreground)',
            onClick: () => { handleClose(); setSelectedCari(row); setOpenDeactivate(true); },
            disabled: false,
          });
        }

        // Activate option for inactive cariler
        if (!isActive) {
          menuActions.push({
            id: 'activate',
            label: 'Yeniden Aktif Yap',
            icon: <CheckCircle fontSize="small" sx={{ color: 'var(--success)' }} />,
            color: 'var(--foreground)',
            onClick: () => { handleClose(); handleActivate(row); },
            disabled: false,
          });
        }

        // Delete option only for cariler without movements
        if (!hasMovement) {
          menuActions.push({
            id: 'delete',
            label: 'Sil',
            icon: <Delete fontSize="small" sx={{ color: 'var(--destructive)' }} />,
            color: 'var(--destructive)',
            onClick: () => { handleClose(); openDeleteDialog(row); },
            disabled: false,
          });
        }

        return (
          <>
            <IconButton
              size="small"
              onClick={handleToggle}
              sx={{
                bgcolor: open ? 'var(--secondary)' : 'transparent',
                color: open ? 'var(--secondary-foreground)' : 'text.secondary',
                '&:hover': {
                  bgcolor: 'var(--secondary)',
                  color: 'var(--secondary-foreground)',
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
                elevation: 8,
                sx: {
                  minWidth: 280,
                  mt: 1,
                  borderRadius: 3,
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  overflow: 'visible',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
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
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Cari İşlemleri
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                  {row.code || row.cariKodu}
                </Typography>
              </Box>

              <Box sx={{ px: 1.5, py: 1 }}>
                {menuActions.map((action) => (
                  <MenuItem
                    key={action.id}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      my: 0.25,
                      color: action.color,
                      '&:hover': {
                        bgcolor: action.id === 'delete'
                          ? 'var(--destructive)'
                          : action.id === 'deactivate'
                            ? 'var(--warning)'
                            : 'var(--secondary)',
                      },
                      '&.Mui-disabled': {
                        opacity: 0.5,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                      {action.icon}
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {action.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>
            </Menu>
          </>
        );
      },
    },
  ];

  const headerActions = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AccountBalance />}
        onClick={() => router.push('/accounts/invoice-closing')}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          textTransform: 'none',
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          boxShadow: 'none',
          '&:hover': {
            borderColor: 'var(--primary)',
            color: 'var(--primary)',
            boxShadow: 'none',
          },
        }}
      >
        Analiz & Ekstre
      </Button>
      <Button
        variant="contained"
        size="small"
        startIcon={<Add />}
        onClick={() => {
          setOpenAdd(true);
          addTab({
            id: 'yeni-cari',
            label: 'Yeni Cari Ekle',
            path: '/accounts',
          });
          setActiveTab('yeni-cari');
        }}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          textTransform: 'none',
          bgcolor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: 'var(--primary)',
            opacity: 0.9,
            boxShadow: 'none',
          },
        }}
      >
        Yeni Cari
      </Button>
    </Box>
  );

  return (
    <StandardPage title="Cari Yönetimi" headerActions={headerActions}>

      {/* 2. KPI METRICS - MODERN CARDS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Toplam Cari', value: totalCari, icon: Person, color: theme.palette.primary.main },
          { label: 'Toplam Bakiye', value: `₺${totalBakiye.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, icon: AccountBalance, color: theme.palette.success.main },
          { label: 'Alacaklı Cari (A)', value: alacakliCari, icon: TrendingDown, color: theme.palette.error.main },
          { label: 'Borçlu Cari (B)', value: borcluCari, icon: TrendingUp, color: theme.palette.info.main },
        ].map((item, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <StandardCard>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: alpha(item.color as string, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <item.icon sx={{ color: item.color }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="800">
                    {item.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              </Stack>
            </StandardCard>
          </Grid>
        ))}
      </Grid>

      {/* 3. FILTER & ACTION TOOLBAR */}
      <StandardCard sx={{ mb: 2, p: 0 }}>
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', background: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(8px)' }}>
          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Cari kodu, ünvan veya yetkili ara..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            sx={{
              minWidth: { xs: '100%', md: 280 },
              '& .MuiInputBase-root': {
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.8),
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearch('')} edge="end">
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Quick Type Filters */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              size="small"
              variant={selectedTipFilter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTipFilter('all')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                bgcolor: selectedTipFilter === 'all' ? theme.palette.primary.main : 'transparent',
                color: selectedTipFilter === 'all' ? theme.palette.primary.contrastText : theme.palette.text.primary,
                borderColor: selectedTipFilter === 'all' ? theme.palette.primary.main : theme.palette.divider,
              }}
            >
              Hepsi
            </Button>
            <Button
              size="small"
              variant={selectedTipFilter === 'CUSTOMER' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTipFilter('CUSTOMER')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                bgcolor: selectedTipFilter === 'CUSTOMER' ? theme.palette.primary.main : 'transparent',
                color: selectedTipFilter === 'CUSTOMER' ? theme.palette.primary.contrastText : theme.palette.text.primary,
                borderColor: selectedTipFilter === 'CUSTOMER' ? theme.palette.primary.main : theme.palette.divider,
              }}
            >
              Müşteri
            </Button>
            <Button
              size="small"
              variant={selectedTipFilter === 'SUPPLIER' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTipFilter('SUPPLIER')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                bgcolor: selectedTipFilter === 'SUPPLIER' ? theme.palette.primary.main : 'transparent',
                color: selectedTipFilter === 'SUPPLIER' ? theme.palette.primary.contrastText : theme.palette.text.primary,
                borderColor: selectedTipFilter === 'SUPPLIER' ? theme.palette.primary.main : theme.palette.divider,
              }}
            >
              Tedarikçi
            </Button>
          </Stack>

          {/* Balance Filters */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              size="small"
              variant={selectedBalanceFilter === 'borclu' ? 'contained' : 'outlined'}
              onClick={() => setSelectedBalanceFilter(selectedBalanceFilter === 'borclu' ? 'all' : 'borclu')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                bgcolor: selectedBalanceFilter === 'borclu' ? theme.palette.info.main : 'transparent',
                color: selectedBalanceFilter === 'borclu' ? theme.palette.info.contrastText : theme.palette.text.primary,
                borderColor: selectedBalanceFilter === 'borclu' ? theme.palette.info.main : theme.palette.divider,
              }}
            >
              Borçlular
            </Button>
            <Button
              size="small"
              variant={selectedBalanceFilter === 'alacakli' ? 'contained' : 'outlined'}
              onClick={() => setSelectedBalanceFilter(selectedBalanceFilter === 'alacakli' ? 'all' : 'alacakli')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: 'none',
                bgcolor: selectedBalanceFilter === 'alacakli' ? theme.palette.error.main : 'transparent',
                color: selectedBalanceFilter === 'alacakli' ? theme.palette.error.contrastText : theme.palette.text.primary,
                borderColor: selectedBalanceFilter === 'alacakli' ? theme.palette.error.main : theme.palette.divider,
              }}
            >
              Alacaklılar
            </Button>
          </Stack>

          {/* Right Tools */}
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title={showInactive ? 'Aktif Carileri Göster' : 'Pasif Carileri Göster'}>
              <IconButton
                size="small"
                onClick={() => setShowInactive(!showInactive)}
                sx={{
                  color: showInactive ? theme.palette.error.main : theme.palette.success.main,
                  bgcolor: alpha(showInactive ? theme.palette.error.main : theme.palette.success.main, 0.1),
                  borderRadius: 1.5,
                }}
              >
                {showInactive ? <ToggleOff fontSize="small" /> : <ToggleOn fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Listeyi Yenile">
              <IconButton
                size="small"
                onClick={fetchCariler}
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1.5 }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />
            <Tooltip title="Grafik Göster/Gizle">
              <IconButton
                size="small"
                onClick={() => setShowChart(!showChart)}
                sx={{
                  bgcolor: showChart ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.05),
                  color: showChart ? theme.palette.primary.contrastText : 'inherit',
                  borderRadius: 1.5
                }}
              >
                <BarChart fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </StandardCard>

      {/* 4. CHART SECTION */}
      <Collapse in={showChart}>
        <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Cari Tipi Dağılımı
          </Typography>
          <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Grafik entegrasyonu için placeholder
            </Typography>
          </Box>
        </Paper>
      </Collapse>

      {/* 5. SUMMARY INFO BAR */}
      <Box sx={{ py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredCariler.length} cari gösteriliyor
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Toplam Cari: <Typography component="span" variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>{totalCari.toLocaleString('tr-TR')}</Typography>
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Bakiye: <Typography component="span" variant="body2" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>₺{totalBakiye.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Typography>
          </Typography>
        </Box>
      </Box>

      {/* 6. DATAGRID */}
      <StandardCard padding={0} sx={{ mb: 2 }}>
        <Box sx={{ height: 'auto', minHeight: 600, width: '100%' }}>
          <DataGrid
            rows={filteredCariler}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            disableRowSelectionOnClick
            loading={loading}
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            rowHeight={44}
            columnHeaderHeight={40}
            density="compact"
            slots={{
              toolbar: CustomToolbar,
              loadingOverlay: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 1.5 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Y\u00fckleniyor...</Typography>
                </Box>
              ),
            }}
            sx={{
              border: 'none',
              fontSize: '0.8125rem',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderBottom: `1px solid ${theme.palette.divider}`,
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: theme.palette.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.05,
                },
              },
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                py: 0,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                fontSize: '0.8125rem',
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                minHeight: 40,
              },
            }}
          />
        </Box>
      </StandardCard>

      {/* Cari Sil Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: '1px solid var(--border)',
            bgcolor: 'var(--card)',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle component="div" sx={{
          bgcolor: 'var(--error)',
          color: 'var(--error-foreground)',
          fontWeight: 700,
          py: 2.5,
          px: 2.5,
          borderBottom: '1px solid var(--border)',
        }}>
          ⚠️ Cari Sil
        </DialogTitle>
        <DialogContent sx={{ mt: 2, bgcolor: 'var(--background)', px: 2.5 }}>
          <Alert
            severity="warning"
            sx={{
              mb: 2,
              bgcolor: 'color-mix(in srgb, var(--warning) 15%, transparent)',
              border: '1px solid var(--warning)',
              borderRadius: 2,
            }}
          >
            Bu işlem geri alınamaz!
          </Alert>
          <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
            <strong>{selectedCari?.title}</strong> carisini silmek istediğinizden emin misiniz?
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            Not: Bu cari hesabında henüz hareket olmadığı için silinebilir.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 2, bgcolor: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
          <Button
            onClick={() => setOpenDelete(false)}
            sx={{
              borderRadius: 2,
              border: '1px solid var(--border)',
              color: 'var(--muted-foreground)',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              '&:hover': { bgcolor: 'var(--card)' },
            }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 2px 8px color-mix(in srgb, var(--error) 30%, transparent)',
              bgcolor: 'var(--error)',
              color: 'var(--error-foreground)',
              px: 2.5,
              '&:hover': {
                bgcolor: 'var(--error)',
                opacity: 0.9,
                boxShadow: '0 4px 12px color-mix(in srgb, var(--error) 40%, transparent)',
              },
            }}
          >
            🗑️ Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cari Kullanım Dışı Yap Dialog */}
      <Dialog
        open={openDeactivate}
        onClose={() => setOpenDeactivate(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: '1px solid var(--border)',
            bgcolor: 'var(--card)',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle component="div" sx={{
          bgcolor: 'var(--warning)',
          color: 'var(--warning-foreground)',
          fontWeight: 700,
          py: 2.5,
          px: 2.5,
          borderBottom: '1px solid var(--border)',
        }}>
          ⚠️ Kullanım Dışı Yap
        </DialogTitle>
        <DialogContent sx={{ mt: 2, bgcolor: 'var(--background)', px: 2.5 }}>
          <Alert
            severity="info"
            sx={{
              mb: 2,
              bgcolor: 'color-mix(in srgb, var(--info) 15%, transparent)',
              border: '1px solid var(--info)',
              borderRadius: 2,
            }}
          >
            Bu cari hesabı hareketsiz yapılacak ancak veriler korunacak.
          </Alert>
          <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
            <strong>{selectedCari?.title}</strong> carisini kullanım dışı yapmak istediğinizden emin misiniz?
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            Not: Hareketi olan cariler silinemez, sadece kullanım dışı yapılabilir.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 2, bgcolor: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
          <Button
            onClick={() => setOpenDeactivate(false)}
            sx={{
              borderRadius: 2,
              border: '1px solid var(--border)',
              color: 'var(--muted-foreground)',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              '&:hover': { bgcolor: 'var(--card)' },
            }}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleDeactivate}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: '0 2px 8px color-mix(in srgb, var(--warning) 30%, transparent)',
              bgcolor: 'var(--warning)',
              color: 'var(--warning-foreground)',
              px: 2.5,
              '&:hover': {
                bgcolor: 'var(--warning)',
                opacity: 0.9,
                boxShadow: '0 4px 12px color-mix(in srgb, var(--warning) 40%, transparent)',
              },
            }}
          >
            Kullanım Dışı Yap
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <NewCariDialog
        open={openAdd}
        onClose={handleCloseAdd}
        onSuccess={fetchCariler}
        showSnackbar={showSnackbar}
      />

      <EditCariDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={fetchCariler}
        showSnackbar={showSnackbar}
        cari={selectedCari}
      />
    </StandardPage>
  );
}
