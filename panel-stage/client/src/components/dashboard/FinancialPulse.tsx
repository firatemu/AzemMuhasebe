import React from 'react';
import { Box, Card, Typography, Grid, Stack, Skeleton } from '@mui/material';
import {
    TrendingUpOutlined,
    TrendingDownOutlined,
    AccountBalanceWalletOutlined,
    AttachMoneyOutlined,
} from '@mui/icons-material';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell
} from 'recharts';

interface FinancialPulseProps {
    data: {
        nakitDurumu: number;
        bankaDurumu: number;
        alacaklar: number;
        borclar: number;
        aylikNakitAkisi: Array<{ name: string; giris: number; cikis: number }>;
    };
    loading: boolean;
}

export default function FinancialPulse({ data, loading }: FinancialPulseProps) {
    const [isMounted, setIsMounted] = React.useState(false);
    const [hasDimensions, setHasDimensions] = React.useState(false);
    const chartContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (!isMounted || !chartContainerRef.current) return;
        const el = chartContainerRef.current;
        const check = () => {
            const { width, height } = el.getBoundingClientRect();
            if (width > 0 && height > 0) setHasDimensions(true);
        };
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, [isMounted]);

    if (!isMounted) {
        return <Card sx={{ height: '100%', minHeight: 400, p: 3 }} />;
    }

    const totalLiquidity = data.nakitDurumu + data.bankaDurumu;
    const netPosition = data.alacaklar - data.borclar;

    const summaryCards = [
        {
            title: 'Toplam Likidite',
            value: totalLiquidity,
            subtext: 'Kasa + Banka',
            icon: AccountBalanceWalletOutlined,
            color: 'var(--chart-3)', // Emerald
        },
        {
            title: 'Net Alacak/Borç',
            value: netPosition,
            subtext: 'Alacak - Borç',
            icon: AttachMoneyOutlined,
            color: netPosition >= 0 ? 'var(--chart-2)' : 'var(--destructive)', // Blue or Red
        },
    ];

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            maximumFractionDigits: 0,
        }).format(val);

    return (
        <Card sx={{ height: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                    sx={{
                        width: 4,
                        height: 24,
                        borderRadius: '4px',
                        bgcolor: 'var(--chart-3)', // Green accent for Finance
                    }}
                />
                <Box>
                    <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                        Finansal Nabız
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', fontWeight: 400 }}>
                        Anlık nakit akışı ve likidite durumu
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Summary Cards */}
                {summaryCards.map((card, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                bgcolor: 'var(--background)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: '10px',
                                    bgcolor: `color-mix(in srgb, ${card.color} 10%, transparent)`,
                                    color: card.color,
                                    display: 'flex',
                                }}
                            >
                                <card.icon fontSize="small" />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    {card.title}
                                </Typography>
                                <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>
                                    {loading ? <Skeleton width={80} /> : formatCurrency(card.value)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}

                {/* Cash Flow Chart */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, mt: 1, fontWeight: 600, color: 'text.secondary' }}>
                        Son 6 Ay Nakit Akışı
                    </Typography>
                    <Box ref={chartContainerRef} sx={{ height: 200, minHeight: 200, width: '100%', position: 'relative', minWidth: 0 }}>
                        {loading ? (
                            <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2 }} />
                        ) : hasDimensions ? (
                            <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={0} debounce={50}>
                                <BarChart data={data.aylikNakitAkisi} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            backgroundColor: 'var(--card)',
                                            boxShadow: 'var(--shadow-md)',
                                            padding: '8px 12px',
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Bar
                                        dataKey="giris"
                                        name="Giriş"
                                        fill="var(--chart-3)" // Emerald
                                        radius={[4, 4, 0, 0]}
                                        barSize={8}
                                        animationDuration={1500}
                                    />
                                    <Bar
                                        dataKey="cikis"
                                        name="Çıkış"
                                        fill="var(--destructive)" // Red
                                        radius={[4, 4, 0, 0]}
                                        barSize={8}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : null}
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
}
