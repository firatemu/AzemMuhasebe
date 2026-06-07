'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Tooltip,
    Pagination,
    Stack,
    InputAdornment,
    alpha,
    useTheme,
    Divider,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Description as DescriptionIcon,
    TableChart as ExcelIcon,
    AccountBalanceWallet as WalletIcon,
    Refresh as RefreshIcon,
    TrendingUp as UpIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';
import { useDebounce } from '@/hooks/useDebounce';
import TableSkeleton from '@/components/Loading/TableSkeleton';

interface RiskLimitReportItem {
    id: string;
    cariKodu: string;
    unvan: string;
    tip: 'MUSTERI' | 'TEDARIKCI';
    balance: number;
    debt: number;
    riskLimit: number;
    remainingLimit: number;
    satisElemani?: string;
}

interface ReportSummary {
    totalDebt: number;
    totalRiskLimit?: number;
    totalCreditLimit?: number;
    totalRemainingLimit: number;
    count: number;
}

interface ReportResponse {
    items: RiskLimitReportItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pageCount: number;
    };
    summary: ReportSummary;
}

export default function CariRiskLimitleriPage() {
    const theme = useTheme();

    // States
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ReportResponse | null>(null);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [exportLoading, setExportLoading] = useState<'pdf' | 'excel' | null>(null);
    const [filters, setFilters] = useState({
        salesAgentId: '',
        status: '' as '' | 'LIMIT_EXCEEDED' | 'NORMAL',
    });
    const [satisElemanlari, setSatisElemanlari] = useState<any[]>([]);

    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const params: Record<string, string | number> = {
                page,
                limit,
            };
            if (debouncedSearch) params.search = debouncedSearch;
            if (filters.salesAgentId) params.salesAgentId = filters.salesAgentId;
            if (filters.status) params.status = filters.status;

            const response = await axios.get('/account/report/credit-limits', { params });
            const raw = response.data;
            const items: RiskLimitReportItem[] = (raw?.items ?? []).map((item: Record<string, unknown>) => ({
                id: String(item.id ?? ''),
                cariKodu: String(item.cariKodu ?? item.code ?? ''),
                unvan: String(item.unvan ?? item.title ?? ''),
                tip: (item.tip ?? item.type ?? 'MUSTERI') as RiskLimitReportItem['tip'],
                balance: Number(item.balance ?? 0),
                debt: Number(item.debt ?? 0),
                riskLimit: Number(item.riskLimit ?? item.creditLimit ?? 0),
                remainingLimit: Number(item.remainingLimit ?? 0),
                satisElemani: (item.satisElemani ?? (item.salesAgent as { fullName?: string })?.fullName) as string | undefined,
            }));
            const summaryRaw = raw?.summary ?? {};
            setData({
                items,
                meta: raw?.meta ?? { total: items.length, page: 1, limit, pageCount: 1 },
                summary: {
                    totalDebt: Number(summaryRaw.totalDebt ?? 0),
                    totalRiskLimit: Number(summaryRaw.totalRiskLimit ?? summaryRaw.totalCreditLimit ?? 0),
                    totalRemainingLimit: Number(summaryRaw.totalRemainingLimit ?? 0),
                    count: Number(summaryRaw.count ?? raw?.meta?.total ?? items.length),
                },
            });
        } catch (error) {
            console.error('Risk limitleri raporu alınamadı:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, debouncedSearch, filters]);

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
    }, [fetchData]);

    const handleFilterChange = (field: string, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(1);
    };

    const handleExport = async (type: 'pdf' | 'excel') => {
        try {
            setExportLoading(type);
            const params: Record<string, string> = {};
            if (debouncedSearch) params.search = debouncedSearch;
            if (filters.salesAgentId) params.salesAgentId = filters.salesAgentId;
            if (filters.status) params.status = filters.status;
            const exportPath = type === 'excel' ? 'excel' : 'pdf';
            const response = await axios.get(`/account/report/credit-limits/export/${exportPath}`, {
                params,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `cari-risk-limitleri.${type === 'excel' ? 'xlsx' : 'pdf'}`);
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const stats = [
        { label: 'TOPLAM RİSK LİMİTİ', value: data?.summary.totalRiskLimit || 0, color: 'primary', icon: <WalletIcon /> },
        { label: 'GÜNCEL TOPLAM BORÇ', value: data?.summary.totalDebt || 0, color: 'error', icon: <UpIcon /> },
        { label: 'TOPLAM KALAN LİMİT', value: data?.summary.totalRemainingLimit || 0, color: 'success', icon: <CheckIcon /> },
        { label: 'LİSTELENEN CARİ', value: data?.summary.count || 0, color: 'info', icon: <FilterIcon />, isCurrency: false },
    ];

    return (
        <StandardPage
            title="Cari Risk Limitleri Raporu"
            breadcrumbs={[{ label: 'Raporlama', href: '/reporting' }, { label: 'Risk Limitleri' }]}
            headerActions={
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={exportLoading === 'excel' ? <CircularProgress size={16} color="inherit" /> : <ExcelIcon />}
                        onClick={() => handleExport('excel')}
                        disabled={!!exportLoading}
                        sx={{ fontWeight: 700, borderRadius: 3 }}
                    >
                        Excel
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={exportLoading === 'pdf' ? <CircularProgress size={16} color="inherit" /> : <DescriptionIcon />}
                        onClick={() => handleExport('pdf')}
                        disabled={!!exportLoading}
                        sx={{ fontWeight: 700, borderRadius: 3 }}
                    >
                        PDF
                    </Button>
                    <IconButton size="small" onClick={fetchData} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }}>
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Stack>
            }
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                    Müşterilerinizin tanımlı risk limitlerini ve kalan limit durumlarını güncel bakiyeleri üzerinden anlık olarak takip edin.
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {stats.map((stat, idx) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha(theme.palette[stat.color as any].main, 0.02) }}>
                            <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: alpha(theme.palette[stat.color as any].main, 0.1), color: `${stat.color}.main`, display: 'flex' }}>
                                {stat.icon}
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                                    {stat.isCurrency === false ? stat.value : formatCurrency(stat.value as number)}
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Filters */}
            <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Cari kodu, ünvan veya vergi no ile ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />,
                                sx: { borderRadius: 2.5, bgcolor: 'background.paper' }
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Satış Elemanı"
                            value={filters.salesAgentId}
                            onChange={(e) => handleFilterChange('salesAgentId', e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' } }}
                        >
                            <MenuItem value="">Tümü</MenuItem>
                            {satisElemanlari.map((se) => <MenuItem key={se.id} value={se.id}>{se.fullName}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Limit Durumu"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' } }}
                        >
                            <MenuItem value="">Tümü</MenuItem>
                            <MenuItem value="LIMIT_EXCEEDED">Limiti Aşanlar</MenuItem>
                            <MenuItem value="NORMAL">Limit Altındakiler</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <Button
                            fullWidth
                            startIcon={<ClearIcon />}
                            onClick={() => { setSearch(''); setFilters({ salesAgentId: '', status: '' }); }}
                            sx={{ fontWeight: 700 }}
                        >
                            Sıfırla
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Table */}
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800 }}>Cari Kodu / Ünvan</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Satış Elemanı</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Tanımlı Limit</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Güncel Borç</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Kalan Limit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableSkeleton rows={8} columns={5} />
                        ) : data?.items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Herhangi bir sonuç bulunamadı.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.items.map((item) => {
                                const isOverLimit = item.remainingLimit < 0;
                                return (
                                    <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.unvan}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{item.cariKodu}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{item.satisElemani || '-'}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{formatCurrency(item.riskLimit)}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>{formatCurrency(item.debt)}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                icon={isOverLimit ? <WarningIcon sx={{ fontSize: '14px !important' }} /> : <CheckIcon sx={{ fontSize: '14px !important' }} />}
                                                label={formatCurrency(item.remainingLimit)}
                                                size="small"
                                                color={isOverLimit ? 'error' : 'success'}
                                                sx={{
                                                    fontWeight: 900,
                                                    borderRadius: 1.5,
                                                    fontFamily: 'monospace',
                                                    width: 140,
                                                    justifyContent: 'flex-start'
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                {data && data.meta.total > 0 && (
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                        <Typography variant="body2" color="text.secondary">
                            Toplam {data.meta.total} cari · Sayfa {data.meta.page} / {data.meta.pageCount}
                        </Typography>
                        {data.meta.pageCount > 1 && (
                            <Pagination
                                count={data.meta.pageCount}
                                page={page}
                                onChange={(_, p) => setPage(p)}
                                color="primary"
                                shape="rounded"
                                size="medium"
                            />
                        )}
                    </Box>
                )}
            </TableContainer>
        </StandardPage>
    );
}
