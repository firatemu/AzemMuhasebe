'use client';

import MainLayout from '@/components/Layout/MainLayout';
import {
    getProfitList,
    getProfitByProduct,
    getProfitDetail,
    type ProfitListItem,
    type ProfitByProductItem,
    type ProfitDetailItem,
} from '@/services/invoiceProfitService';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Chip,
    TextField,
    Button,
    Collapse,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    LinearProgress,
} from '@mui/material';
import {
    TrendingUp,
    ExpandMore,
    ExpandLess,
    Search,
    Description,
    CalendarToday,
    Clear,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import React from 'react';
import axios from '@/lib/axios';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profit-tabpanel-${index}`}
            aria-labelledby={`profit-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
        </div>
    );
}

// Quick date chip helpers
const getQuickDateRange = (type: 'ALL' | 'WEEK' | 'MONTH' | 'YEAR') => {
    const today = new Date();
    let start = '';
    let end = '';

    if (type === 'WEEK') {
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        start = monday.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
    } else if (type === 'MONTH') {
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
    } else if (type === 'YEAR') {
        start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
    }

    return { start, end };
};

// KPIHeader component
interface KPIHeaderProps {
    loading: boolean;
    totals: {
        satis: number;
        maliyet: number;
        kar: number;
        karOrani: number;
    };
}

function ProfitKPIHeader({ loading, totals }: KPIHeaderProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const items = [
        {
            title: 'Toplam Satış',
            value: totals.satis,
            icon: <TrendingUp sx={{ fontSize: 16 }} />,
            color: 'var(--chart-3)',
            bgColor: 'color-mix(in srgb, var(--chart-3) 12%, transparent)',
            borderColor: 'var(--chart-3)',
        },
        {
            title: 'Toplam Maliyet',
            value: totals.maliyet,
            icon: <TrendingUp sx={{ fontSize: 16 }} />,
            color: 'var(--chart-2)',
            bgColor: 'color-mix(in srgb, var(--chart-2) 12%, transparent)',
            borderColor: 'var(--chart-2)',
        },
        {
            title: 'Toplam Kar',
            value: totals.kar,
            icon: <TrendingUp sx={{ fontSize: 16 }} />,
            color: totals.kar >= 0 ? 'var(--success)' : 'var(--destructive)',
            bgColor: totals.kar >= 0 ? 'color-mix(in srgb, var(--success) 12%, transparent)' : 'color-mix(in srgb, var(--destructive) 12%, transparent)',
            borderColor: totals.kar >= 0 ? 'var(--success)' : 'var(--destructive)',
        },
        {
            title: 'Kar Oranı',
            value: totals.karOrani,
            isPercent: true,
            icon: <TrendingUp sx={{ fontSize: 16 }} />,
            color: totals.karOrani >= 15 ? 'var(--success)' : totals.karOrani >= 5 ? 'var(--warning)' : 'var(--destructive)',
            bgColor: totals.karOrani >= 15 ? 'color-mix(in srgb, var(--success) 12%, transparent)' : totals.karOrani >= 5 ? 'color-mix(in srgb, var(--warning) 12%, transparent)' : 'color-mix(in srgb, var(--destructive) 12%, transparent)',
            borderColor: totals.karOrani >= 15 ? 'var(--success)' : totals.karOrani >= 5 ? 'var(--warning)' : 'var(--destructive)',
        },
    ];

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                display: 'flex',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                borderColor: 'var(--border)',
                mb: 2,
            }}
        >
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <Box
                        sx={{
                            flex: '1 1 160px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 2,
                            position: 'relative',
                            borderLeft: '4px solid',
                            borderLeftColor: item.borderColor,
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 'var(--shadow-md)',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                background: item.bgColor,
                                color: item.color,
                                borderRadius: 1.5,
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            {item.icon}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'var(--muted-foreground)',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    display: 'block',
                                    lineHeight: 1.2,
                                }}
                            >
                                {item.title}
                            </Typography>
                            {loading ? (
                                <Box sx={{ width: 80, height: 24 }} />
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: 'var(--foreground)',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {item.isPercent
                                        ? `${item.value.toFixed(2)}%`
                                        : formatCurrency(item.value)}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    {index < items.length - 1 && (
                        <Box sx={{ width: '1px', bgcolor: 'var(--border)' }} />
                    )}
                </React.Fragment>
            ))}
        </Paper>
    );
}

// LinearProgress for profit rate
function ProfitRateBar({ rate }: { rate: number }) {
    const getColor = () => {
        if (rate >= 15) return 'var(--success)';
        if (rate >= 5) return 'var(--warning)';
        return 'var(--destructive)';
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
            <LinearProgress
                variant="determinate"
                value={Math.min(Math.max(rate, 0), 100)}
                sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'color-mix(in srgb, var(--muted) 30%, transparent)',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: getColor(),
                    },
                }}
            />
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: getColor(),
                    minWidth: 45,
                    textAlign: 'right',
                }}
            >
                {rate.toFixed(1)}%
            </Typography>
        </Box>
    );
}

export default function InvoiceProfitabilityClient() {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fatura bazlı state
    const [profitList, setProfitList] = useState<ProfitListItem[]>([]);
    const [expandedFaturas, setExpandedFaturas] = useState<Set<string>>(new Set());
    const [faturaDetails, setFaturaDetails] = useState<Record<string, ProfitDetailItem[]>>({});
    const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());

    // Ürün bazlı state
    const [productProfits, setProductProfits] = useState<ProfitByProductItem[]>([]);
    const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

    // Filtreler
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        accountId: '',
        status: '',
        stokSearch: '',
    });
    const [cariler, setCariler] = useState<any[]>([]);
    const [activeQuickDate, setActiveQuickDate] = useState<string>('ALL');

    // KPI totals
    const [totals, setTotals] = useState({ satis: 0, maliyet: 0, kar: 0, karOrani: 0 });

    useEffect(() => {
        fetchCariler();
    }, []);

    useEffect(() => {
        if (activeTab === 0) {
            fetchProfitList();
        } else {
            fetchProductProfits();
        }
    }, [activeTab, filters]);

    // Calculate totals when profitList changes
    useEffect(() => {
        if (profitList.length > 0) {
            const satis = profitList.reduce((sum, item) => sum + item.toplamSatisTutari, 0);
            const maliyet = profitList.reduce((sum, item) => sum + item.toplamMaliyet, 0);
            const kar = profitList.reduce((sum, item) => sum + item.toplamKar, 0);
            const karOrani = satis > 0 ? (kar / satis) * 100 : 0;
            setTotals({ satis, maliyet, kar, karOrani });
        } else {
            setTotals({ satis: 0, maliyet: 0, kar: 0, karOrani: 0 });
        }
    }, [profitList]);

    const fetchCariler = async () => {
        try {
            const response = await axios.get('/account', { params: { limit: 1000 } });
            setCariler(response.data.data || []);
        } catch (error) {
            console.error('Cariler yüklenirken hata:', error);
        }
    };

    const fetchProfitList = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProfitList({
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined,
                accountId: filters.accountId || undefined,
                status: filters.status || undefined,
            });
            setProfitList(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Kar listesi yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductProfits = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProfitByProduct({
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined,
                stokId: undefined,
            });
            setProductProfits(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ürün kar listesi yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleFaturaExpand = async (faturaId: string) => {
        if (expandedFaturas.has(faturaId)) {
            const newExpanded = new Set(expandedFaturas);
            newExpanded.delete(faturaId);
            setExpandedFaturas(newExpanded);
            return;
        }

        setLoadingDetails((prev) => new Set(prev).add(faturaId));
        try {
            const details = await getProfitDetail(faturaId);
            setFaturaDetails((prev) => ({ ...prev, [faturaId]: details }));
            setExpandedFaturas((prev) => new Set(prev).add(faturaId));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Fatura detayları yüklenirken hata oluştu');
        } finally {
            setLoadingDetails((prev) => {
                const newSet = new Set(prev);
                newSet.delete(faturaId);
                return newSet;
            });
        }
    };

    const handleProductExpand = (stokId: string) => {
        const newExpanded = new Set(expandedProducts);
        if (newExpanded.has(stokId)) {
            newExpanded.delete(stokId);
        } else {
            newExpanded.add(stokId);
        }
        setExpandedProducts(newExpanded);
    };

    const handleQuickDateChange = (type: 'ALL' | 'WEEK' | 'MONTH' | 'YEAR') => {
        setActiveQuickDate(type);
        const { start, end } = getQuickDateRange(type);
        setFilters((prev) => ({ ...prev, startDate: start, endDate: end }));
    };

    const clearFilters = () => {
        setActiveQuickDate('ALL');
        setFilters({
            startDate: '',
            endDate: '',
            accountId: '',
            status: '',
            stokSearch: '',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const filteredProductProfits = productProfits.filter((product) => {
        if (!filters.stokSearch) return true;
        const search = filters.stokSearch.toLowerCase();
        return (
            product.stok.stokKodu.toLowerCase().includes(search) ||
            product.stok.stokAdi.toLowerCase().includes(search)
        );
    });

    return (
        <Box>
            {/* Premium Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 0.5,
                            bgcolor: 'color-mix(in srgb, var(--chart-3) 12%, transparent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <TrendingUp sx={{ fontSize: 24, color: 'var(--chart-3)' }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight={700} sx={{ color: 'var(--foreground)' }}>
                            Fatura Karlılığı
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                            Karlılık Analizi
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Description />}
                    sx={{
                        borderRadius: 'var(--radius)',
                        textTransform: 'none',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)',
                        '&:hover': {
                            borderColor: 'var(--primary)',
                            bgcolor: 'color-mix(in srgb, var(--primary) 8%, transparent)',
                        },
                    }}
                >
                    Raporlar
                </Button>
            </Box>

            {/* KPI Header */}
            <ProfitKPIHeader loading={loading} totals={totals} />

            {/* Premium Toolbar */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                {/* Quick Date Chips */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {[
                        { label: 'TÜMÜ', value: 'ALL' },
                        { label: 'BU HAFTA', value: 'WEEK' },
                        { label: 'BU AY', value: 'MONTH' },
                        { label: 'BU YIL', value: 'YEAR' },
                    ].map((chip) => (
                        <Chip
                            key={chip.value}
                            label={chip.label}
                            onClick={() => handleQuickDateChange(chip.value as any)}
                            variant={activeQuickDate === chip.value ? 'filled' : 'outlined'}
                            size="small"
                            sx={{
                                borderRadius: 1,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 28,
                                backgroundColor:
                                    activeQuickDate === chip.value
                                        ? 'var(--primary)'
                                        : 'transparent',
                                color:
                                    activeQuickDate === chip.value
                                        ? 'white'
                                        : 'var(--foreground)',
                                borderColor: 'var(--border)',
                                '&:hover': {
                                    backgroundColor:
                                        activeQuickDate === chip.value
                                            ? 'var(--primary)'
                                            : 'color-mix(in srgb, var(--primary) 10%, transparent)',
                                },
                            }}
                        />
                    ))}
                </Box>

                <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
                    <TextField
                        label="Başlangıç"
                        type="date"
                        size="small"
                        value={filters.startDate}
                        onChange={(e) => {
                            setActiveQuickDate('ALL');
                            setFilters((prev) => ({ ...prev, startDate: e.target.value }));
                        }}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            minWidth: 160,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                            },
                        }}
                    />
                    <TextField
                        label="Bitiş"
                        type="date"
                        size="small"
                        value={filters.endDate}
                        onChange={(e) => {
                            setActiveQuickDate('ALL');
                            setFilters((prev) => ({ ...prev, endDate: e.target.value }));
                        }}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            minWidth: 160,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                            },
                        }}
                    />
                    {activeTab === 0 && (
                        <>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <InputLabel sx={{ fontSize: '0.875rem' }}>Cari</InputLabel>
                                <Select
                                    value={filters.accountId}
                                    label="Cari"
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, accountId: e.target.value }))
                                    }
                                    sx={{ borderRadius: 1.5, fontSize: '0.875rem' }}
                                >
                                    <MenuItem value="">Tümü</MenuItem>
                                    {cariler.map((cari) => (
                                        <MenuItem key={cari.id} value={cari.id}>
                                            {cari.unvan}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel sx={{ fontSize: '0.875rem' }}>Durum</InputLabel>
                                <Select
                                    value={filters.status}
                                    label="Durum"
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, status: e.target.value }))
                                    }
                                    sx={{ borderRadius: 1.5, fontSize: '0.875rem' }}
                                >
                                    <MenuItem value="">Tümü</MenuItem>
                                    <MenuItem value="OPEN">Açık</MenuItem>
                                    <MenuItem value="APPROVED">Onaylandı</MenuItem>
                                    <MenuItem value="CLOSED">Kapalı</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                    {activeTab === 1 && (
                        <TextField
                            label="Ürün Ara"
                            size="small"
                            value={filters.stokSearch}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, stokSearch: e.target.value }))
                            }
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
                                endAdornment: filters.stokSearch ? (
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setFilters((prev) => ({ ...prev, stokSearch: '' }))
                                        }
                                    >
                                        <Clear sx={{ fontSize: 16 }} />
                                    </IconButton>
                                ) : null,
                            }}
                            sx={{
                                minWidth: 240,
                                flex: 1,
                                maxWidth: 300,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                },
                            }}
                        />
                    )}
                    <Button
                        variant="outlined"
                        onClick={clearFilters}
                        startIcon={<Clear sx={{ fontSize: 18 }} />}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            borderColor: 'var(--border)',
                            color: 'var(--muted-foreground)',
                            '&:hover': {
                                borderColor: 'var(--destructive)',
                                color: 'var(--destructive)',
                                bgcolor: 'color-mix(in srgb, var(--destructive) 8%, transparent)',
                            },
                        }}
                    >
                        Temizle
                    </Button>
                </Stack>
            </Paper>

            {/* Tabs */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    centered
                    sx={{
                        borderBottom: '1px solid var(--border)',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            color: 'var(--muted-foreground)',
                            '&.Mui-selected': {
                                color: 'var(--primary)',
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'var(--primary)',
                            height: 3,
                            borderRadius: '3px 3px 0 0',
                        },
                    }}
                >
                    <Tab label="Fatura Bazlı" />
                    <Tab label="Ürün Bazlı" />
                </Tabs>

                {/* Fatura Bazlı Tab */}
                <TabPanel value={activeTab} index={0}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" sx={{ m: 2 }}>
                            {error}
                        </Alert>
                    ) : profitList.length === 0 ? (
                        <Alert severity="info" sx={{ m: 2 }}>
                            Fatura bulunamadı
                        </Alert>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            backgroundColor: 'var(--muted)',
                                            '& th': {
                                                textTransform: 'uppercase',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: 'var(--muted-foreground)',
                                                letterSpacing: '0.05em',
                                                py: 1.5,
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 1,
                                            },
                                        }}
                                    >
                                        <TableCell width="50px"></TableCell>
                                        <TableCell>Fatura No</TableCell>
                                        <TableCell>Tarih</TableCell>
                                        <TableCell>Cari Kod</TableCell>
                                        <TableCell>Cari Ünvan</TableCell>
                                        <TableCell align="right">Toplam Satış</TableCell>
                                        <TableCell align="right">Toplam Maliyet</TableCell>
                                        <TableCell align="right">Toplam Kar</TableCell>
                                        <TableCell>Kar Oranı</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {profitList.map((item, index) => (
                                        <React.Fragment key={item.fatura.id}>
                                            <TableRow
                                                hover
                                                sx={{
                                                    cursor: 'pointer',
                                                    backgroundColor:
                                                        index % 2 === 0 ? 'transparent' : 'var(--muted)',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--accent)',
                                                    },
                                                    '& td': {
                                                        borderColor: 'var(--border)',
                                                    },
                                                }}
                                                onClick={() => handleFaturaExpand(item.fatura.id)}
                                            >
                                                <TableCell>
                                                    <IconButton size="small">
                                                        {expandedFaturas.has(item.fatura.id) ? (
                                                            <ExpandLess />
                                                        ) : (
                                                            <ExpandMore />
                                                        )}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {item.fatura.faturaNo}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(item.fatura.tarih)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.fatura.cari.cariKodu}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {item.fatura.cari.unvan}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {formatCurrency(item.toplamSatisTutari)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatCurrency(item.toplamMaliyet)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    sx={{
                                                        color: item.toplamKar >= 0 ? 'var(--success)' : 'var(--destructive)',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {formatCurrency(item.toplamKar)}
                                                </TableCell>
                                                <TableCell>
                                                    <ProfitRateBar rate={item.karOrani} />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell
                                                    colSpan={9}
                                                    sx={{ py: 0, border: 0, backgroundColor: 'var(--muted)' }}
                                                >
                                                    <Collapse
                                                        in={expandedFaturas.has(item.fatura.id)}
                                                        timeout="auto"
                                                        unmountOnExit
                                                    >
                                                        {loadingDetails.has(item.fatura.id) ? (
                                                            <Box display="flex" justifyContent="center" py={3}>
                                                                <CircularProgress size={24} />
                                                            </Box>
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    p: 2,
                                                                    background:
                                                                        'linear-gradient(135deg, var(--muted) 0%, color-mix(in srgb, var(--muted) 80%, var(--accent)) 100%)',
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    mb={2}
                                                                    fontWeight={700}
                                                                    sx={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}
                                                                >
                                                                    Kalem Detayları
                                                                </Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Ürün Kodu</TableCell>
                                                                            <TableCell>Stok Adı</TableCell>
                                                                            <TableCell align="right">Miktar</TableCell>
                                                                            <TableCell align="right">Birim Fiyat</TableCell>
                                                                            <TableCell align="right">Birim Maliyet</TableCell>
                                                                            <TableCell align="right">Toplam Satış</TableCell>
                                                                            <TableCell align="right">Toplam Maliyet</TableCell>
                                                                            <TableCell align="right">Kar</TableCell>
                                                                            <TableCell>Kar Oranı</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {faturaDetails[item.fatura.id]?.map((detail, idx) => (
                                                                            <TableRow
                                                                                key={`${detail.id}-${idx}`}
                                                                                sx={{
                                                                                    backgroundColor:
                                                                                        idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.5)',
                                                                                }}
                                                                            >
                                                                                <TableCell>
                                                                                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                                                                                        {detail.stok?.stokKodu || '-'}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                                        {detail.stok?.stokAdi || '-'}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell align="right">
                                                                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                                        {detail.miktar}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell align="right">
                                                                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                                        {formatCurrency(detail.birimFiyat)}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell align="right">
                                                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                                                        {formatCurrency(detail.birimMaliyet)}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell align="right">
                                                                                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.8rem' }}>
                                                                                        {formatCurrency(detail.toplamSatisTutari)}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell align="right">
                                                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                                                        {formatCurrency(detail.toplamMaliyet)}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                    align="right"
                                                                    sx={{
                                                                        color: detail.kar >= 0 ? 'var(--success)' : 'var(--destructive)',
                                                                        fontWeight: 700,
                                                                        fontSize: '0.8rem',
                                                                    }}
                                                                >
                                                                    {formatCurrency(detail.kar)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <ProfitRateBar rate={detail.karOrani} />
                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        )}
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </TabPanel>

                {/* Ürün Bazlı Tab */}
                <TabPanel value={activeTab} index={1}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" sx={{ m: 2 }}>
                            {error}
                        </Alert>
                    ) : filteredProductProfits.length === 0 ? (
                        <Alert severity="info" sx={{ m: 2 }}>
                            Ürün bulunamadı
                        </Alert>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            backgroundColor: 'var(--muted)',
                                            '& th': {
                                                textTransform: 'uppercase',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: 'var(--muted-foreground)',
                                                letterSpacing: '0.05em',
                                                py: 1.5,
                                                position: 'sticky',
                                                top: 0,
                                                zIndex: 1,
                                            },
                                        }}
                                    >
                                        <TableCell width="50px"></TableCell>
                                        <TableCell>Ürün Kodu</TableCell>
                                        <TableCell>Ürün Adı</TableCell>
                                        <TableCell align="right">Toplam Miktar</TableCell>
                                        <TableCell align="right">Toplam Satış</TableCell>
                                        <TableCell align="right">Toplam Maliyet</TableCell>
                                        <TableCell align="right">Toplam Kar</TableCell>
                                        <TableCell>Kar Oranı</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProductProfits.map((product, index) => (
                                        <React.Fragment key={product.stok.id}>
                                            <TableRow
                                                hover
                                                sx={{
                                                    cursor: 'pointer',
                                                    backgroundColor:
                                                        index % 2 === 0 ? 'transparent' : 'var(--muted)',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--accent)',
                                                    },
                                                    '& td': {
                                                        borderColor: 'var(--border)',
                                                    },
                                                }}
                                                onClick={() => handleProductExpand(product.stok.id)}
                                            >
                                                <TableCell>
                                                    <IconButton size="small">
                                                        {expandedProducts.has(product.stok.id) ? (
                                                            <ExpandLess />
                                                        ) : (
                                                            <ExpandMore />
                                                        )}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {product.stok.stokKodu}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {product.stok.stokAdi}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" color="text.secondary">
                                                        {product.toplamMiktar.toLocaleString('tr-TR')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {formatCurrency(product.toplamSatisTutari)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatCurrency(product.toplamMaliyet)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    sx={{
                                                        color: product.toplamKar >= 0 ? 'var(--success)' : 'var(--destructive)',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {formatCurrency(product.toplamKar)}
                                                </TableCell>
                                                <TableCell>
                                                    <ProfitRateBar rate={product.karOrani} />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell
                                                    colSpan={8}
                                                    sx={{ py: 0, border: 0, backgroundColor: 'var(--muted)' }}
                                                >
                                                    <Collapse
                                                        in={expandedProducts.has(product.stok.id)}
                                                        timeout="auto"
                                                        unmountOnExit
                                                    >
                                                        <Box
                                                            sx={{
                                                                p: 2,
                                                                background:
                                                                    'linear-gradient(135deg, var(--muted) 0%, color-mix(in srgb, var(--muted) 80%, var(--accent)) 100%)',
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="subtitle2"
                                                                mb={2}
                                                                fontWeight={700}
                                                                sx={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}
                                                            >
                                                                Fatura Detayları
                                                            </Typography>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Fatura No</TableCell>
                                                                        <TableCell>Tarih</TableCell>
                                                                        <TableCell>Cari Kod</TableCell>
                                                                        <TableCell>Cari Ünvan</TableCell>
                                                                        <TableCell align="right">Miktar</TableCell>
                                                                        <TableCell align="right">Satış Tutarı</TableCell>
                                                                        <TableCell align="right">Maliyet</TableCell>
                                                                        <TableCell align="right">Kar</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {product.faturalar.map((fatura) => (
                                                                        <TableRow key={fatura.faturaId}>
                                                                            <TableCell>
                                                                                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                                                                                    {fatura.faturaNo}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                                    {formatDate(fatura.tarih)}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                                                    {(fatura.cari as any).cariKodu || '-'}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                                    {fatura.cari.unvan}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                                    {fatura.miktar}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.8rem' }}>
                                                                                    {formatCurrency(fatura.satisTutari)}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                                                    {formatCurrency(fatura.maliyet)}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="right"
                                                                                sx={{
                                                                                    color: fatura.kar >= 0 ? 'var(--success)' : 'var(--destructive)',
                                                                                    fontWeight: 700,
                                                                                    fontSize: '0.8rem',
                                                                                }}
                                                                            >
                                                                                {formatCurrency(fatura.kar)}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </TabPanel>
            </Paper>

            {/* Page Summary */}
            {profitList.length > 0 && activeTab === 0 && (
                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 'var(--radius)',
                        background: 'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 85%, var(--chart-3)) 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: 'var(--shadow-lg)',
                    }}
                >
                    <Typography variant="body2" fontWeight={600} sx={{ opacity: 0.9 }}>
                        Toplam {profitList.length} Fatura
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                                Toplam Satış
                            </Typography>
                            <Typography variant="body1" fontWeight={700}>
                                {formatCurrency(totals.satis)}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                                Toplam Maliyet
                            </Typography>
                            <Typography variant="body1" fontWeight={700}>
                                {formatCurrency(totals.maliyet)}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                                Toplam Kar
                            </Typography>
                            <Typography variant="body1" fontWeight={700}>
                                {formatCurrency(totals.kar)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}