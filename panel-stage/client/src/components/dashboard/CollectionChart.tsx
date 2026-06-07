import React from 'react';
import { Box, Card, Typography, Select, MenuItem, Stack } from '@mui/material';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend
} from 'recharts';

interface CollectionChartProps {
    data: Array<{ name: string; tahsilat: number; odeme: number }>;
    period: 'daily' | 'weekly' | 'monthly';
    loading: boolean;
}

export default function CollectionChart({ data, period, loading }: CollectionChartProps) {
    const [isMounted, setIsMounted] = React.useState(false);
    const [hasDimensions, setHasDimensions] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (!isMounted || !containerRef.current) return;
        const el = containerRef.current;
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
        return <Card sx={{ height: '100%', minHeight: 400, p: 3, borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }} />;
    }

    const totalCollection = data.reduce((acc, curr) => acc + (curr.tahsilat || 0), 0);
    const totalPayment = data.reduce((acc, curr) => acc + (curr.odeme || 0), 0);
    const periodName = period === 'daily' ? 'Günlük' : period === 'weekly' ? 'Haftalık' : 'Aylık';

    return (
        <Card sx={{ height: '100%', minHeight: 400, p: 3, borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 5,
                            height: 28,
                            borderRadius: '4px',
                            bgcolor: '#3b82f6',
                        }}
                    />
                    <Box>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography variant="h6" sx={{ lineHeight: 1.2, fontWeight: 700 }}>
                                {periodName} Akış Analizi
                            </Typography>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.8 }}>
                            {period === 'daily' ? 'Saatlik para trafiği' : 'Periyodik giriş ve çıkış dengesi'}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box ref={containerRef} sx={{ height: 320, minHeight: 320, width: '100%', position: 'relative', minWidth: 0 }}>
                {hasDimensions && (
                    <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={0} debounce={50}>
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--border)"
                                vertical={false}
                                strokeOpacity={0.6}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'var(--muted-foreground)',
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'var(--muted-foreground)',
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                                tickFormatter={(value: number) => `₺${(value / 1000).toFixed(0)}k`}
                            />
                            <RechartsTooltip
                                contentStyle={{
                                    borderRadius: '14px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(8px)',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    padding: '12px',
                                }}
                                itemStyle={{ fontWeight: 700, fontSize: '13px' }}
                                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                                formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`}
                            />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600 }} />
                            <Bar
                                dataKey="tahsilat"
                                name="Tahsilat"
                                fill="#10b981"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={period === 'daily' ? 15 : 40}
                                animationDuration={1200}
                            />
                            <Bar
                                dataKey="odeme"
                                name="Ödeme"
                                fill="#ef4444"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={period === 'daily' ? 15 : 40}
                                animationDuration={1200}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Card>
    );
}
