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
    Inventory2Outlined,
    PeopleAltOutlined,
    ReceiptOutlined,
    TrendingUpOutlined,
    ArrowUpward,
    ArrowDownward,
} from '@mui/icons-material';

interface StatsProps {
    stats: {
        toplamStok: number;
        cariSayisi: number;
        aylikSatis: number;
        karMarji: number;
    };
    loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsProps) {
    const statsCards = [
        {
            title: 'Toplam Stok',
            value: loading ? '...' : stats.toplamStok.toLocaleString('tr-TR'),
            icon: Inventory2Outlined,
            color: 'var(--chart-5)', // Indigo
            trend: 2.5,
            trendLabel: 'Geçen aya göre',
        },
        {
            title: 'Aktif Cari',
            value: loading ? '...' : stats.cariSayisi.toLocaleString('tr-TR'),
            icon: PeopleAltOutlined,
            color: 'var(--chart-4)', // Violet/Purple
            trend: 12,
            trendLabel: 'Yeni müşteri',
        },
        {
            title: 'Aylık Ciro',
            value: loading
                ? '...'
                : `₺${stats.aylikSatis.toLocaleString('tr-TR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                })}`,
            icon: ReceiptOutlined,
            color: 'var(--chart-3)', // Emerald
            trend: 15.2,
            trendLabel: 'Hedef üzeri',
        },
        {
            title: 'Tahmini Kâr',
            value: loading
                ? '...'
                : `₺${(stats.aylikSatis * 0.15).toLocaleString('tr-TR', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                })}`,
            icon: TrendingUpOutlined,
            color: 'var(--primary)', // Dark Slate
            trend: 15, // Marj
            trendLabel: 'Ortalama marj',
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
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 'var(--shadow-ambient)',
                                borderColor: 'var(--border)', // Hover border color override if needed
                            }
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box
                                sx={{
                                    bgcolor: `color-mix(in srgb, ${card.color} 10%, transparent)`,
                                    color: card.color,
                                    borderRadius: '10px',
                                    p: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <card.icon fontSize="small" />
                            </Box>
                            {/* Trend Indicator */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    color: card.trend >= 0 ? 'var(--chart-3)' : 'var(--destructive)',
                                    bgcolor: card.trend >= 0 ? 'color-mix(in srgb, var(--chart-3) 5%, transparent)' : 'color-mix(in srgb, var(--destructive) 5%, transparent)',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: '6px'
                                }}
                            >
                                {card.trend >= 0 ? <ArrowUpward sx={{ fontSize: 12 }} /> : <ArrowDownward sx={{ fontSize: 12 }} />}
                                <Typography variant="caption" fontWeight={700}>
                                    {Math.abs(card.trend)}%
                                </Typography>
                            </Box>
                        </Stack>

                        <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5, letterSpacing: '-0.02em' }}>
                            {loading ? <Skeleton width={100} /> : card.value}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {card.title}
                        </Typography>

                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
