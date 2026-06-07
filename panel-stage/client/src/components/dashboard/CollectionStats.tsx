import React from 'react';
import {
    Box,
    Card,
    Typography,
    Grid,
    Stack,
    Skeleton,
} from '@mui/material';
import {
    TrendingUpOutlined,
    TrendingDownOutlined,
    AccountBalanceWalletOutlined,
    ShowChartOutlined,
} from '@mui/icons-material';

interface CollectionStatsProps {
    data: {
        currentMonthCollection: number;
        currentMonthPayment: number;
        previousMonthCollection: number;
        previousMonthPayment: number;
    };
    period: 'daily' | 'weekly' | 'monthly';
    loading: boolean;
}

export default function CollectionStats({ data, period, loading }: CollectionStatsProps) {
    const netBalance = data.currentMonthCollection - data.currentMonthPayment;
    const prevNetBalance = data.previousMonthCollection - data.previousMonthPayment;

    const collectionGrowth = data.previousMonthCollection > 0
        ? ((data.currentMonthCollection - data.previousMonthCollection) / data.previousMonthCollection) * 100
        : 0;

    const paymentGrowth = data.previousMonthPayment > 0
        ? ((data.currentMonthPayment - data.previousMonthPayment) / data.previousMonthPayment) * 100
        : 0;

    const periodLabel = period === 'daily' ? 'Güne' : period === 'weekly' ? 'Haftaya' : 'Aya';

    const statsCards = [
        {
            title: `${period === 'daily' ? 'Günlük' : period === 'weekly' ? 'Haftalık' : 'Aylık'} Tahsilat`,
            value: loading ? '...' : `₺${data.currentMonthCollection.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            icon: TrendingUpOutlined,
            color: '#10b981',
            trend: collectionGrowth,
            trendLabel: `Geçen ${periodLabel} göre`,
        },
        {
            title: `${period === 'daily' ? 'Günlük' : period === 'weekly' ? 'Haftalık' : 'Aylık'} Ödeme`,
            value: loading ? '...' : `₺${data.currentMonthPayment.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            icon: TrendingDownOutlined,
            color: '#ef4444',
            trend: paymentGrowth,
            trendLabel: `Geçen ${periodLabel} göre`,
        },
        {
            title: `Net Akış (${period === 'daily' ? 'Bugün' : period === 'weekly' ? 'Bu Hafta' : 'Bu Ay'})`,
            value: loading ? '...' : `₺${netBalance.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            icon: AccountBalanceWalletOutlined,
            color: netBalance >= 0 ? '#3b82f6' : '#f59e0b',
            trend: prevNetBalance !== 0 ? ((netBalance - prevNetBalance) / Math.abs(prevNetBalance || 1)) * 100 : 0,
            trendLabel: 'Fark',
        },
        {
            title: 'Tahsilat Oranı',
            value: loading ? '...' : `%${((data.currentMonthCollection / (data.currentMonthCollection + data.currentMonthPayment || 1)) * 100).toFixed(1)}`,
            icon: ShowChartOutlined,
            color: '#8b5cf6',
            trend: 0,
            trendLabel: 'Operasyonel veri',
        },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsCards.map((card, index) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                    <Card
                        sx={{
                            p: 3,
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '16px',
                            border: '1px solid var(--border)',
                            background: 'var(--card)',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
                                borderColor: card.color,
                            },
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box
                                sx={{
                                    bgcolor: `color-mix(in srgb, ${card.color} 12%, transparent)`,
                                    color: card.color,
                                    borderRadius: '12px',
                                    p: 1.25,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <card.icon fontSize="small" />
                            </Box>
                            {card.trend !== 0 && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        color: card.trend >= 0 ? '#10b981' : '#ef4444',
                                        bgcolor: card.trend >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: '8px'
                                    }}
                                >
                                    <Typography variant="caption" fontWeight={700}>
                                        {card.trend >= 0 ? '+' : ''}{card.trend.toFixed(1)}%
                                    </Typography>
                                </Box>
                            )}
                        </Stack>

                        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-0.04em' }}>
                            {loading ? <Skeleton width={100} /> : card.value}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ opacity: 0.8 }}>
                            {card.title}
                        </Typography>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
