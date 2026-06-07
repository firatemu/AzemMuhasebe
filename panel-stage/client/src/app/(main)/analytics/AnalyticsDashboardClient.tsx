'use client';

import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    alpha,
    useTheme,
    Chip,
} from '@mui/material';
import {
    TrendingUp,
    People,
    Cancel,
    AttachMoney,
    Subscriptions,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { formatAmount, formatDate } from '@/lib/format';
import StandardCard from '@/components/common/StandardCard';

interface DashboardMetrics {
    totalUsers: number;
    totalTenants: number;
    activeSubscriptions: number;
    totalRevenue: number;
}

interface RevenueData {
    month: string;
    revenue: number;
}

interface UserGrowthData {
    month: string;
    count: number;
}

interface ChurnData {
    cancelled: number;
    total: number;
    churnRate: number;
}

interface SubscriptionDistribution {
    status: string;
    count: number;
}

interface PlanDistribution {
    planId: string;
    planName: string;
    planSlug: string;
    count: number;
}

interface RecentPayment {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    subscription: {
        tenant: { name: string; subdomain: string };
        plan: { name: string; slug: string };
    };
}

export default function AnalyticsDashboardClient() {
    const theme = useTheme();

    const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
        queryKey: ['analytics-dashboard'],
        queryFn: async () => {
            const res = await axios.get('/analytics/dashboard');
            return res.data;
        },
    });

    const { data: revenue, isLoading: revenueLoading } = useQuery<RevenueData[]>({
        queryKey: ['analytics-revenue'],
        queryFn: async () => {
            const res = await axios.get('/analytics/revenue');
            return res.data;
        },
    });

    const { data: userGrowth, isLoading: userGrowthLoading } = useQuery<UserGrowthData[]>({
        queryKey: ['analytics-user-growth'],
        queryFn: async () => {
            const res = await axios.get('/analytics/users-growth');
            return res.data;
        },
    });

    const { data: churn, isLoading: churnLoading } = useQuery<ChurnData>({
        queryKey: ['analytics-churn'],
        queryFn: async () => {
            const res = await axios.get('/analytics/churn');
            return res.data;
        },
    });

    const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery<SubscriptionDistribution[]>({
        queryKey: ['analytics-subscriptions-distribution'],
        queryFn: async () => {
            const res = await axios.get('/analytics/subscriptions/distribution');
            return res.data;
        },
    });

    const { data: plans, isLoading: plansLoading } = useQuery<PlanDistribution[]>({
        queryKey: ['analytics-plans-distribution'],
        queryFn: async () => {
            const res = await axios.get('/analytics/plans/distribution');
            return res.data;
        },
    });

    const { data: recentPayments, isLoading: paymentsLoading } = useQuery<RecentPayment[]>({
        queryKey: ['analytics-recent-payments'],
        queryFn: async () => {
            const res = await axios.get('/analytics/payments/recent', { params: { limit: 10 } });
            return res.data;
        },
    });

    const kpiCards = [
        {
            label: 'TOPLAM GELİR',
            value: formatAmount(metrics?.totalRevenue ?? 0),
            icon: <AttachMoney />,
            color: theme.palette.success.main,
        },
        {
            label: 'TOPLAM KULLANICI',
            value: metrics?.totalUsers ?? 0,
            icon: <People />,
            color: theme.palette.primary.main,
        },
        {
            label: 'AKTİF ABONELİK',
            value: metrics?.activeSubscriptions ?? 0,
            icon: <Subscriptions />,
            color: theme.palette.info.main,
        },
        {
            label: 'CHURN ORANI',
            value: churn ? `${churn.churnRate.toFixed(1)}%` : '-',
            icon: <Cancel />,
            color: theme.palette.error.main,
        },
    ];

    return (
        <Box sx={{ pb: 4 }}>
            {/* KPI Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {kpiCards.map((card, idx) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                bgcolor: 'background.paper',
                            }}
                        >
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: alpha(card.color, 0.1),
                                    color: card.color,
                                    display: 'flex',
                                }}
                            >
                                {card.icon}
                            </Box>
                            <Box>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 900, lineHeight: 1.1 }}
                                >
                                    {metricsLoading ? <CircularProgress size={20} /> : card.value}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 800,
                                        color: 'text.secondary',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    {card.label}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Revenue Over Time */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <StandardCard title="Gelir Trendi">
                        {revenueLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>AY</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>GELİR</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(revenue ?? []).slice(-12).map((row) => (
                                        <TableRow key={row.month}>
                                            <TableCell>{row.month}</TableCell>
                                            <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                                                {formatAmount(row.revenue)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </StandardCard>
                </Grid>

                {/* User Growth */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <StandardCard title="Kullanıcı Büyümesi">
                        {userGrowthLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>AY</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>YENİ KULLANICI</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(userGrowth ?? []).slice(-12).map((row) => (
                                        <TableRow key={row.month}>
                                            <TableCell>{row.month}</TableCell>
                                            <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                                                {row.count}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </StandardCard>
                </Grid>

                {/* Subscription Distribution */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <StandardCard title="Abonelik Dağılımı">
                        {subscriptionsLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>DURUM</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>ADET</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(subscriptions ?? []).map((sub) => (
                                        <TableRow key={sub.status}>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={sub.status}
                                                    variant="outlined"
                                                    sx={{ fontWeight: 800 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                                                {sub.count}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </StandardCard>
                </Grid>

                {/* Plan Distribution */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <StandardCard title="Plan Dağılımı">
                        {plansLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>PLAN</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>ABONE SAYISI</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(plans ?? []).map((plan) => (
                                        <TableRow key={plan.planId}>
                                            <TableCell sx={{ fontWeight: 800 }}>{plan.planName}</TableCell>
                                            <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                                                {plan.count}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </StandardCard>
                </Grid>

                {/* Recent Payments */}
                <Grid size={{ xs: 12 }}>
                    <StandardCard title="Son Ödemeler">
                        {paymentsLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>TARİH</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>TENANT</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>PLAN</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>TUTAR</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>DURUM</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(recentPayments ?? []).map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{formatDate(payment.createdAt)}</TableCell>
                                            <TableCell sx={{ fontWeight: 800 }}>
                                                {payment.subscription?.tenant?.name ?? '-'}
                                            </TableCell>
                                            <TableCell>
                                                {payment.subscription?.plan?.name ?? '-'}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                                                {formatAmount(Number(payment.amount))}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={payment.status}
                                                    color={payment.status === 'SUCCESS' ? 'success' : 'error'}
                                                    variant="outlined"
                                                    sx={{ fontWeight: 800 }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </StandardCard>
                </Grid>
            </Grid>
        </Box>
    );
}
