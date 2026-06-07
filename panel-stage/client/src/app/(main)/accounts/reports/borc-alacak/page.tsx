'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Tooltip,
    Pagination,
    InputAdornment,
} from '@mui/material';
import {
    Search,
    FilterList,
    Description,
    TableChart,
    AccountBalanceWallet,
    Refresh,
} from '@mui/icons-material';
import MainLayout from '@/components/Layout/MainLayout';
import axios from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';
import TableSkeleton from '@/components/Loading/TableSkeleton';
import { useTabStore } from '@/stores/tabStore';


// Types matching backend DTO
interface DebtCreditReportItem {
    id: string;
    code: string;
    title: string;
    tip: 'MUSTERI' | 'TEDARIKCI';
    aktif: boolean;
    balance: number;
    lastTransactionDate?: string;
    salesAgent?: string;
}

interface ReportSummary {
    totalDebt: number;
    totalCredit: number;
    netBalance: number;
    count: number;
}

interface ReportResponse {
    items: DebtCreditReportItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pageCount: number;
    };
    summary: ReportSummary;
}

export default function DebtCreditReportPage() {
    const { addTab, setActiveTab } = useTabStore();

    // States
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ReportResponse | null>(null);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [page, setPage] = useState(1);
    const [exportLoading, setExportLoading] = useState<'pdf' | 'excel' | null>(null);
    const [filters, setFilters] = useState({
        tip: '',
        satisElemaniId: '',
        durum: '',
    });
    const [satisElemanlari, setSatisElemanlari] = useState<any[]>([]);

    // Tab management
    useEffect(() => {
        addTab({
            id: 'accounts-reports-debit-credit',
            label: 'Borç Alacak Raporu',
            path: '/account/rapor/borc-alacak',
        });
        setActiveTab('accounts-reports-debit-credit');
    }, []);

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const params: any = {
                page,
                search: debouncedSearch,
                ...filters,
            };

            // Clean empty filters
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === null) {
                    delete params[key];
                }
            });

            const response = await axios.get('/account/report/debit-credit', { params });
            setData(response.data);
        } catch (error) {
            console.error('Rapor verisi alınamadı:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Salespersons
    useEffect(() => {
        const fetchSatisElemanlari = async () => {
            try {
                const response = await axios.get('/sales-agent');
                setSatisElemanlari(response.data || []);
            } catch (error) {
                console.error('Satış elemanları yüklenirken hata:', error);
            }
        };
        fetchSatisElemanlari();
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, debouncedSearch, filters]);

    const handleFilterChange = (field: string, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(1); // Reset page on filter change
    };

    const handleExport = async (type: 'pdf' | 'excel') => {
        try {
            setExportLoading(type);
            const params: any = {
                search: debouncedSearch,
                ...filters,
            };

            // Clean empty filters
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === null) {
                    delete params[key];
                }
            });

            const response = await axios.get(`/account/report/debit-credit/export/${type}`, {
                params,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `borc-alacak-raporu.${type === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`${type.toUpperCase()} dışa aktarma hatası:`, error);
        } finally {
            setExportLoading(null);
        }
    };

    // Helper for formatting currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <MainLayout>
            <Box sx={{ mb: 3 }}>
                {/* 1. Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                        }}>
                            <AccountBalanceWallet sx={{ fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                Borç Alacak Durum Raporu
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={exportLoading === 'excel' ? <CircularProgress size={12} color="inherit" /> : <TableChart sx={{ fontSize: 18 }} />}
                            onClick={() => handleExport('excel')}
                            disabled={!!exportLoading}
                            sx={{ borderColor: 'var(--border)', color: 'var(--foreground)', boxShadow: 'none', textTransform: 'none' }}
                        >
                            Excel
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={exportLoading === 'pdf' ? <CircularProgress size={12} color="inherit" /> : <Description sx={{ fontSize: 18 }} />}
                            onClick={() => handleExport('pdf')}
                            disabled={!!exportLoading}
                            sx={{ borderColor: 'var(--border)', color: 'var(--foreground)', boxShadow: 'none', textTransform: 'none' }}
                        >
                            PDF
                        </Button>
                        <IconButton
                            size="small"
                            onClick={fetchData}
                            sx={{ border: '1px solid var(--border)', borderRadius: 1.5, width: 32, height: 32 }}
                        >
                            <Refresh sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                </Box>

                {/* 2. Metrics Strip */}
                <Paper variant="outlined" sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', display: 'flex', bgcolor: 'var(--card)' }}>
                    <Box sx={{ flex: '1 1 120px', p: 1.5, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                            Toplam Alacak
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#059669' }}>
                            {formatCurrency(data?.summary.totalCredit || 0)}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 120px', p: 1.5, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                            Toplam Borç
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#dc2626' }}>
                            {formatCurrency(data?.summary.totalDebt || 0)}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 120px', p: 1.5, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                            Net Bakiye
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem', color: (data?.summary.netBalance || 0) >= 0 ? '#059669' : '#dc2626' }}>
                                {formatCurrency(Math.abs(data?.summary.netBalance || 0))}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.7 }}>
                                {(data?.summary.netBalance || 0) >= 0 ? '(A)' : '(B)'}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ flex: '1 1 120px', p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                            Cari Sayısı
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                            {data?.summary.count || 0}
                        </Typography>
                    </Box>
                </Paper>


                {/* 3. Integrated Table & Toolbar */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border)', bgcolor: 'var(--card)' }}>
                    {/* Integrated Toolbar */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, p: 2, borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                        <TextField
                            placeholder="Cari kodu veya ünvan ile ara..."
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ flex: '1 1 240px', maxWidth: 320 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ fontSize: 20, color: 'var(--muted-foreground)' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: search && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearch('')}>
                                            <Refresh sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <FormControl size="small" sx={{ width: 140 }}>
                            <InputLabel sx={{ fontSize: '0.85rem' }}>Cari Tipi</InputLabel>
                            <Select
                                value={filters.tip}
                                label="Cari Tipi"
                                onChange={(e) => handleFilterChange('tip', e.target.value)}
                                sx={{ fontSize: '0.85rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.85rem' }}>Tümü</MenuItem>
                                <MenuItem value="MUSTERI" sx={{ fontSize: '0.85rem' }}>Müşteri</MenuItem>
                                <MenuItem value="TEDARIKCI" sx={{ fontSize: '0.85rem' }}>Tedarikçi</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ width: 140 }}>
                            <InputLabel sx={{ fontSize: '0.85rem' }}>Durum</InputLabel>
                            <Select
                                value={filters.durum}
                                label="Durum"
                                onChange={(e) => handleFilterChange('durum', e.target.value)}
                                sx={{ fontSize: '0.85rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.85rem' }}>Tümü</MenuItem>
                                <MenuItem value="BORC" sx={{ fontSize: '0.85rem' }}>Borçlu</MenuItem>
                                <MenuItem value="ALACAK" sx={{ fontSize: '0.85rem' }}>Alacaklı</MenuItem>
                                <MenuItem value="SIFIR" sx={{ fontSize: '0.85rem' }}>Dengede</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ width: 180 }}>
                            <InputLabel sx={{ fontSize: '0.85rem' }}>Satış Elemanı</InputLabel>
                            <Select
                                value={filters.satisElemaniId}
                                label="Satış Elemanı"
                                onChange={(e) => handleFilterChange('satisElemaniId', e.target.value)}
                                sx={{ fontSize: '0.85rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.85rem' }}>Tümü</MenuItem>
                                {satisElemanlari.map((se) => (
                                    <MenuItem key={se.id} value={se.id} sx={{ fontSize: '0.85rem' }}>{se.adSoyad}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Tooltip title="Filtreleri Temizle">
                                <IconButton
                                    size="small"
                                    onClick={() => setFilters({ tip: '', satisElemaniId: '', durum: '' })}
                                    sx={{ border: '1px solid var(--border)', borderRadius: 1.5 }}
                                >
                                    <FilterList sx={{ fontSize: 18 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Summary Info Bar */}
                    <Box sx={{ display: 'flex', px: 2, py: 1, borderBottom: '1px solid var(--border)', bgcolor: '#f8fafc', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>
                            Toplam <b>{data?.meta.total || 0}</b> kayıt listeleniyor
                        </Typography>
                    </Box>

                    <TableContainer>
                        <Table size="small" sx={{
                            minWidth: 800,
                            '& .MuiTableCell-head': {
                                bgcolor: '#f8fafc',
                                borderBottom: '2px solid #e2e8f0',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                color: '#475569',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                py: 1.5
                            },
                            '& .MuiTableRow-root:nth-of-type(even)': {
                                bgcolor: '#fafafa'
                            },
                            '& .MuiTableRow-root:hover': {
                                bgcolor: '#f0fdf4 !important'
                            },
                            '& .MuiTableCell-root': {
                                borderBottom: '1px solid #f1f5f9',
                                py: 1.5
                            }
                        }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cari Kodu</TableCell>
                                    <TableCell>Ünvan</TableCell>
                                    <TableCell>Satış Elemanı</TableCell>
                                    <TableCell>Tip</TableCell>
                                    <TableCell align="right">Bakiye</TableCell>
                                    <TableCell align="center">Durum</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableSkeleton rows={10} columns={6} />
                                ) : data?.items.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>Kayıt bulunamadı</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.items.map((item) => {
                                        const isDebit = item.balance < 0;
                                        const isCredit = item.balance > 0;

                                        return (
                                            <TableRow key={item.id} hover>
                                                <TableCell sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                                    {item.code}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: 'var(--foreground)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.title}
                                                </TableCell>
                                                <TableCell sx={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>
                                                    {typeof item.salesAgent === 'object' ? (item.salesAgent as any)?.fullName : (item.salesAgent || '-')}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.tip === 'MUSTERI' ? 'Müşteri' : 'Tedarikçi'}
                                                        size="small"
                                                        sx={{
                                                            borderRadius: 1,
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            bgcolor: item.tip === 'MUSTERI' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                                            color: item.tip === 'MUSTERI' ? '#2563eb' : '#7c3aed',
                                                            border: item.tip === 'MUSTERI' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.2)'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem', color: isCredit ? '#059669' : isDebit ? '#dc2626' : 'inherit' }}>
                                                        {formatCurrency(Math.abs(item.balance))}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={isCredit ? 'Alacaklı' : isDebit ? 'Borçlu' : 'Dengeli'}
                                                        size="small"
                                                        sx={{
                                                            borderRadius: 1,
                                                            fontSize: '0.65rem',
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            bgcolor: isCredit ? 'rgba(16, 185, 129, 0.1)' : isDebit ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                                            color: isCredit ? '#059669' : isDebit ? '#dc2626' : '#4b5563',
                                                            border: isCredit ? '1px solid rgba(16, 185, 129, 0.2)' : isDebit ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(107, 114, 128, 0.2)',
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'flex-end', bgcolor: '#f8fafc', borderTop: '1px solid var(--border)' }}>
                        <Pagination
                            count={data?.meta.pageCount || 1}
                            page={page}
                            onChange={(_, p) => setPage(p)}
                            size="small"
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </Paper>
            </Box>
        </MainLayout>
    );
}
