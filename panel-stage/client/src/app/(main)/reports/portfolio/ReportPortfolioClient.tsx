'use client';

import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    LinearProgress,
    Chip,
    alpha,
    useTheme
} from '@mui/material';
import { useChecks } from '@/hooks/use-checks';
import { CheckBillStatus } from '@/types/check-bill';
import { STATUS_LABEL, STATUS_MUI_COLOR } from '@/lib/labels';
import { formatAmount } from '@/lib/format';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import StandardCard from '@/components/common/StandardCard';

export default function ReportPortfolioClient() {
    const theme = useTheme();
    const { data: checksList, isLoading } = useChecks();
    const checks = checksList?.items ?? [];

    const chartData = useMemo(() => {
        if (!checks.length) return [];

        const grouped = checks.reduce((acc, curr) => {
            const status = curr.status;
            if (!acc[status]) {
                acc[status] = { status, count: 0, amount: 0 };
            }
            acc[status].count += 1;
            acc[status].amount += curr.amount;
            return acc;
        }, {} as Record<string, { status: CheckBillStatus; count: number; amount: number }>);

        const dataArray = Object.values(grouped).sort((a, b) => b.amount - a.amount);
        const totalAmount = dataArray.reduce((sum, item) => sum + item.amount, 0);

        return dataArray.map(item => ({
            ...item,
            label: STATUS_LABEL[item.status],
            color: getThemeColorByName(STATUS_MUI_COLOR[item.status], theme),
            percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0
        }));

    }, [checks, theme]);

    const totalPortfolioAmount = chartData.reduce((sum, d) => sum + d.amount, 0);

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Rapor yükleniyor...</Typography>
        </Box>
    );

    if (!checks || checks.length === 0) return (
        <StandardCard title="Bilgi">
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Raporlanacak kayıt bulunamadı.
            </Typography>
        </StandardCard>
    );

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 5 }}>
                <StandardCard title="Portföy Dağılımı" sx={{ height: '100%' }}>
                    <Box sx={{ height: 400, width: '100%', position: 'relative', mt: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="amount"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={140}
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value: number) => formatAmount(value)}
                                    contentStyle={{
                                        borderRadius: 12,
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--card)',
                                        color: 'var(--foreground)',
                                        boxShadow: 'var(--shadow-lg)'
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value: string) => <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--muted-foreground)' }}>{value.toUpperCase()}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box
                            position="absolute"
                            top="45%"
                            left="0"
                            width="100%"
                            textAlign="center"
                            sx={{ pointerEvents: 'none' }}
                        >
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 1 }}>TOPLAM HACİM</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', mt: 0.5 }}>{formatAmount(totalPortfolioAmount)}</Typography>
                        </Box>
                    </Box>
                </StandardCard>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
                <StandardCard title="Durum Dağılım Tablosu" sx={{ height: '100%' }}>
                    <Table size="medium" sx={{ mt: 1 }}>
                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 }}>DURUM</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 }}>EVRAK SAYISI</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 }}>TOPLAM TUTAR</TableCell>
                                <TableCell width="25%" sx={{ fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem', letterSpacing: 1 }}>ORAN</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {chartData.map((row) => (
                                <TableRow key={row.status} hover>
                                    <TableCell>
                                        <Chip
                                            label={row.label}
                                            size="small"
                                            color={STATUS_MUI_COLOR[row.status] || 'default'}
                                            variant="outlined"
                                            sx={{ fontWeight: 800, borderRadius: 1.5 }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800 }}>{row.count}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{formatAmount(row.amount)}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={row.percentage}
                                                color={STATUS_MUI_COLOR[row.status] === 'default' ? 'inherit' : STATUS_MUI_COLOR[row.status] as any}
                                                sx={{ flexGrow: 1, borderRadius: 4, height: 6, opacity: 0.8 }}
                                            />
                                            <Typography variant="caption" sx={{ fontWeight: 800, minWidth: 40, textAlign: 'right' }}>{row.percentage.toFixed(1)}%</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StandardCard>
            </Grid>
        </Grid>
    );
}

// Helper to get theme colors
function getThemeColorByName(colorName: string, theme: any): string {
    switch (colorName) {
        case 'primary': return theme.palette.primary.main;
        case 'secondary': return theme.palette.secondary.main;
        case 'success': return theme.palette.success.main;
        case 'error': return theme.palette.error.main;
        case 'warning': return theme.palette.warning.main;
        case 'info': return theme.palette.info.main;
        default: return theme.palette.grey[500];
    }
}
