import React from 'react';
import { Box, Card, Typography, Grid, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import EmptyState from '../common/EmptyState';
import { Inventory2Outlined } from '@mui/icons-material';

interface InventoryOverviewProps {
    criticalStock: Array<{ id: string; name: string; stock: number; minStock: number; unit: string }>;
    categoryDistribution: Array<{ name: string; value: number; color: string }>;
    loading: boolean;
}

export default function InventoryOverview({ criticalStock, categoryDistribution, loading }: InventoryOverviewProps) {
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

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Ürün Adı',
            flex: 1,
            renderCell: (params: any) => (
                <Typography variant="body2" fontWeight={500} sx={{ color: 'var(--foreground)' }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'stock',
            headerName: 'Mevcut',
            width: 90,
            renderCell: (params: any) => (
                <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ color: params.value <= 0 ? 'var(--destructive)' : 'var(--chart-4)' }}
                >
                    {params.value} {params.row.unit}
                </Typography>
            ),
        },
        {
            field: 'status',
            headerName: 'Durum',
            width: 100,
            renderCell: (params: any) => (
                <Chip
                    label="Kritik"
                    size="small"
                    sx={{
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: 'color-mix(in srgb, var(--destructive) 10%, transparent)',
                        color: 'var(--destructive)',
                        borderRadius: '6px',
                    }}
                />
            ),
        },
    ];

    const COLORS = ['#0F172A', '#334155', '#64748B', '#94A3B8'];

    return (
        <Card sx={{ height: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                    sx={{
                        width: 4,
                        height: 24,
                        borderRadius: '4px',
                        bgcolor: 'var(--chart-4)', // Amber/Orange
                    }}
                />
                <Box>
                    <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                        Stok Durumu
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', fontWeight: 400 }}>
                        Kritik stoklar ve kategori dağılımı
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Kritik Seviyedeki Ürünler
                    </Typography>
                    <Box sx={{ height: 250, width: '100%' }}>
                        {criticalStock.length > 0 ? (
                            <DataGrid
                                rows={criticalStock}
                                columns={columns}
                                getRowId={(row: any) => row.id}
                                hideFooter
                                disableColumnMenu
                                density="compact" // Maximum density for this small widget
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-cell': { borderBottom: '1px solid var(--border)' },
                                    '& .MuiDataGrid-columnHeaders': {
                                        bgcolor: 'var(--background)',
                                        borderBottom: '1px solid var(--border)',
                                        minHeight: '40px !important',
                                        maxHeight: '40px !important',
                                    },
                                    '& .MuiDataGrid-virtualScroller': { overflowY: 'hidden' }, // Hide scroll if few items
                                }}
                            />
                        ) : (
                            <EmptyState
                                title="Stoklar Güvende"
                                description="Kritik seviyede ürün bulunmuyor."
                                compact
                            />
                        )}
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Kategori Dağılımı
                    </Typography>
                    <Box ref={chartContainerRef} sx={{ height: 250, minHeight: 250, width: '100%', position: 'relative', minWidth: 0 }}>
                        {hasDimensions && (
                            <ResponsiveContainer width="100%" height={250} minWidth={0} minHeight={0} debounce={50}>
                                <PieChart>
                                    <Pie
                                        data={categoryDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            backgroundColor: 'var(--card)',
                                            boxShadow: 'var(--shadow-md)',
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 600, color: 'var(--foreground)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
}
