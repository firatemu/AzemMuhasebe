import React from 'react';
import { Box, Card, Typography, Select, MenuItem, Stack } from '@mui/material';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend
} from 'recharts';
import { TrendingUpOutlined } from '@mui/icons-material';

interface SalesChartProps {
    data: Array<{ name: string; buyil: number; gecenyil: number }>;
    loading: boolean;
}

export default function SalesChart({ data, loading }: SalesChartProps) {
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
        return <Card sx={{ height: '100%', minHeight: 400, p: 3 }} />;
    }

    const totalSales = data.reduce((acc, curr) => acc + (curr.buyil || 0), 0);
    const lastYearTotal = data.reduce((acc, curr) => acc + (curr.gecenyil || 0), 0);
    const growth = lastYearTotal > 0 ? ((totalSales - lastYearTotal) / lastYearTotal) * 100 : 0;

    return (
        <Card sx={{ height: '100%', minHeight: 400, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 4,
                            height: 24,
                            borderRadius: '4px',
                            bgcolor: 'var(--chart-1)', // Dark Slate
                        }}
                    />
                    <Box>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                                Satış Performansı
                            </Typography>
                            {growth > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'color-mix(in srgb, var(--chart-3) 10%, transparent)', px: 1, py: 0.5, borderRadius: '6px' }}>
                                    <TrendingUpOutlined sx={{ fontSize: 14, color: 'var(--chart-3)' }} />
                                    <Typography variant="caption" fontWeight={700} color="var(--chart-3)">
                                        +{growth.toFixed(1)}%
                                    </Typography>
                                </Box>
                            )}
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', fontWeight: 400 }}>
                            Geçen yıl ile karşılaştırmalı ciro analizi
                        </Typography>
                    </Box>
                </Box>

                {/* Period Selector (Mock) */}
                <Select
                    value={6}
                    size="small"
                    sx={{
                        fontSize: '0.875rem',
                        height: 32,
                        borderRadius: '8px',
                        '& .MuiSelect-select': { py: 0.5 }
                    }}
                >
                    <MenuItem value={6}>Son 6 Ay</MenuItem>
                    <MenuItem value={12}>Son 1 Yıl</MenuItem>
                </Select>
            </Box>

            <Box ref={containerRef} sx={{ height: 320, minHeight: 320, width: '100%', position: 'relative', minWidth: 0 }}>
                {hasDimensions && (
                    <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={0} debounce={50}>
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorBuYil" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorGecenYil" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="var(--border)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'var(--muted-foreground)',
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'var(--muted-foreground)',
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                tickFormatter={(value: number) => `₺${(value / 1000).toFixed(0)}k`}
                            />
                            <RechartsTooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--card)',
                                    boxShadow: 'var(--shadow-md)',
                                    padding: '12px',
                                }}
                                itemStyle={{ fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}
                                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                                formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`}
                            />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                            <Area
                                type="monotone"
                                dataKey="buyil"
                                name="Bu Yıl"
                                stroke="var(--chart-1)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorBuYil)"
                                animationDuration={1500}
                            />
                            <Area
                                type="monotone"
                                dataKey="gecenyil"
                                name="Geçen Yıl"
                                stroke="var(--muted-foreground)"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                fillOpacity={1}
                                fill="url(#colorGecenYil)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Card>
    );
}
