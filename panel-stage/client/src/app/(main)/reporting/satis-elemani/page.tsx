'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem,
    alpha,
    useTheme,
    Divider,
    IconButton,
} from '@mui/material';
import {
    Assessment as AssessmentIcon,
    People as PeopleIcon,
    TrendingDown as DownIcon,
    TrendingUp as UpIcon,
    ShoppingCart as SalesIcon,
    Event as DateIcon,
    Payments as PaymentIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';

interface SalespersonPerformance {
    satisElemaniId: string;
    adSoyad: string;
    toplamSatis: number;
    satisAdedi: number;
    toplamTahsilat: number;
    tahsilatAdedi: number;
}

interface PerformanceResponse {
    range: {
        startDate: string;
        endDate: string;
        preset: string;
    };
    performance: SalespersonPerformance[];
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0);

const formatNumber = (value: number) =>
    new Intl.NumberFormat('tr-TR').format(value || 0);

const formatDateLabel = (input: string) =>
    new Date(input).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });

type PresetKey = 'today' | 'last7' | 'last30' | 'thisMonth' | 'custom';

const presetOptions: Array<{ value: PresetKey; label: string }> = [
    { value: 'today', label: 'Bugün' },
    { value: 'last7', label: 'Son 7 Gün' },
    { value: 'last30', label: 'Son 30 Gün' },
    { value: 'thisMonth', label: 'Bu Ay' },
    { value: 'custom', label: 'Özel Tarih Aralığı' },
];

export default function SatisElemaniRaporPage() {
    const theme = useTheme();
    const [data, setData] = useState<PerformanceResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preset, setPreset] = useState<PresetKey>('last30');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');

    const fetchPerformance = useCallback(
        async (options?: { preset?: PresetKey; startDate?: string; endDate?: string }) => {
            try {
                setLoading(true);
                setError(null);

                const selectedPreset = options?.preset ?? preset;
                const start = options?.startDate ?? customStart;
                const end = options?.endDate ?? customEnd;

                const params: Record<string, string> = { preset: selectedPreset };

                if (selectedPreset === 'custom') {
                    if (!start || !end) {
                        setError('Başlangıç ve bitiş tarihlerini seçiniz.');
                        setLoading(false);
                        return;
                    }
                    params.startDate = start;
                    params.endDate = end;
                }

                const response = await axios.get<PerformanceResponse>('/raporlama/salesperson-performance', { params });
                setData(response.data);
            } catch (err: any) {
                console.error('Veri alınamadı:', err);
                setError('Performans raporu yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        },
        [preset, customStart, customEnd],
    );

    useEffect(() => {
        if (preset !== 'custom') fetchPerformance({ preset });
    }, [fetchPerformance, preset]);

    // Totals for summary cards
    const summary = data?.performance.reduce((acc, curr) => ({
        toplamSatis: acc.toplamSatis + curr.toplamSatis,
        toplamTahsilat: acc.toplamTahsilat + curr.toplamTahsilat,
        satisAdedi: acc.satisAdedi + curr.satisAdedi,
        tahsilatAdedi: acc.tahsilatAdedi + curr.tahsilatAdedi,
    }), { toplamSatis: 0, toplamTahsilat: 0, satisAdedi: 0, tahsilatAdedi: 0 });

    const stats = [
        { label: 'TOPLAM SATIŞ', value: summary?.toplamSatis || 0, icon: <UpIcon />, color: 'success' },
        { label: 'TOPLAM TAHSİLAT', value: summary?.toplamTahsilat || 0, icon: <PaymentIcon />, color: 'primary' },
        { label: 'SATIŞ ADEDİ', value: summary?.satisAdedi || 0, icon: <SalesIcon />, color: 'info', isCurrency: false },
        { label: 'AKTİF PLASİYER', value: data?.performance.length || 0, icon: <PeopleIcon />, color: 'warning', isCurrency: false },
    ];

    return (
        <StandardPage
            title="Satış Elemanı Performansı"
            breadcrumbs={[{ label: 'Raporlama', href: '/reporting' }, { label: 'Plasiyer Performansı' }]}
            headerActions={
                <IconButton onClick={() => fetchPerformance()} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }}>
                    <RefreshIcon fontSize="small" />
                </IconButton>
            }
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                    Belirlenen tarih aralığında satış personellerinizin ciro ve tahsilat başarılarını karşılaştırmalı olarak analiz edin.
                </Typography>
            </Box>

            {/* Filters Row */}
            <Paper variant="outlined" sx={{ p: 2.5, mb: 4, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        select
                        size="small"
                        label="Zaman Aralığı"
                        value={preset}
                        onChange={(e) => setPreset(e.target.value as PresetKey)}
                        sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' } }}
                    >
                        {presetOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </TextField>

                    {preset === 'custom' && (
                        <Stack direction="row" spacing={1.5}>
                            <TextField
                                type="date"
                                size="small"
                                label="Başlangıç"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' } }}
                            />
                            <TextField
                                type="date"
                                size="small"
                                label="Bitiş"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: 'background.paper' } }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => fetchPerformance({ preset: 'custom' })}
                                disabled={loading}
                                sx={{ borderRadius: 2.5, px: 4, fontWeight: 800 }}
                            >
                                Sorgula
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress size={40} /></Box>
            ) : (
                <>
                    {/* Summary Stats */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {stats.map((stat, idx) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha(theme.palette[stat.color as any].main, 0.02) }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: alpha(theme.palette[stat.color as any].main, 0.1), color: `${stat.color}.main`, display: 'flex' }}>
                                        {stat.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                                            {stat.isCurrency === false ? formatNumber(stat.value as number) : formatCurrency(stat.value as number)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Main Performance Table */}
                    <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
                        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <DateIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                    PERFORMANS DETAYI ({data ? `${formatDateLabel(data.range.startDate)} - ${formatDateLabel(data.range.endDate)}` : '-'})
                                </Typography>
                            </Stack>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 800 }}>Plasiyer / Satış Elemanı</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800 }}>Satış Adedi</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800 }}>Toplam Satış (Ciro)</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800 }}>Tahsilat Adedi</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800 }}>Toplam Tahsilat</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!data || data.performance.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Bu tarih aralığında veri bulunamadı.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.performance.map((item, index) => (
                                            <TableRow key={item.satisElemaniId || index} hover>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main', display: 'flex' }}>
                                                            <PeopleIcon fontSize="small" />
                                                        </Box>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{item.adSoyad}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatNumber(item.satisAdedi)}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={formatCurrency(item.toplamSatis)}
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 900, borderRadius: 1.5, fontFamily: 'monospace', minWidth: 120, justifyContent: 'flex-start' }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatNumber(item.tahsilatAdedi)}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={formatCurrency(item.toplamTahsilat)}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 900, borderRadius: 1.5, fontFamily: 'monospace', minWidth: 120, justifyContent: 'flex-start' }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}
        </StandardPage>
    );
}
