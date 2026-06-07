'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Chip,
    IconButton,
    TextField,
    Tooltip,
    Typography,
    Stack,
    Avatar,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridPaginationModel,
    GridActionsCellItem,
} from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    FileDownload as ExportIcon,
    Search as SearchIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as ActiveIcon,
    Error as ExpiredIcon,
    Calculate as AverageIcon,
} from '@mui/icons-material';
import { priceCardApi } from '@/services/api/priceCardApi';
import { type IPriceCard, PriceCardStatus, PriceType } from '@/types/priceCard';
import AddEditPriceCardModal from './AddEditPriceCardModal';
import { useSnackbar } from 'notistack';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';

// KPI Card Component
const KPICard = ({ title, value, icon: Icon, colorVar }: { title: string; value: string | number; icon: any; colorVar: string }) => (
    <StandardCard padding={2} sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' } }}>
        <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: `color-mix(in srgb, ${colorVar} 15%, transparent)`, color: colorVar }}>
                <Icon fontSize="small" />
            </Avatar>
            <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {title}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {value}
                </Typography>
            </Box>
        </Stack>
    </StandardCard>
);

export default function PriceCardClient() {
    const { enqueueSnackbar } = useSnackbar();
    const [rows, setRows] = useState<IPriceCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const [statusFilter, setStatusFilter] = useState<PriceCardStatus | 'ALL'>('ALL');

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    // Metrics
    const [metrics, setMetrics] = useState({
        total: 0,
        active: 0,
        expired: 0,
        average: 0
    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchCards = async () => {
        setLoading(true);
        try {
            const result = await priceCardApi.getAll({
                page: page + 1,
                limit: pageSize,
                q: debouncedSearch,
                status: statusFilter === 'ALL' ? undefined : statusFilter,
            });

            setRows(result.data);
            setTotalRows(result.meta.total);

            // Calculate metrics (mocking or using data if backend supports)
            // In a real scenario, these would come from a separate /stats endpoint
            const active = result.data.filter(c => c.status === PriceCardStatus.ACTIVE).length;
            const expired = result.data.filter(c => c.status === PriceCardStatus.EXPIRED).length;
            const totalPrices = result.data.reduce((acc, curr) => acc + Number(curr.salePrice || 0), 0);

            setMetrics({
                total: result.meta.total,
                active: result.meta.total > 0 ? active : 0, // Simplified for demo
                expired: expired,
                average: result.data.length > 0 ? totalPrices / result.data.length : 0
            });
        } catch (error) {
            enqueueSnackbar('Fiyat kartları yüklenirken hata oluştu', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const filteredRows = useMemo(() => {
        if (timeFilter === 'all') return rows;
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = (() => {
            const day = now.getDay(); // 0 Pazar .. 6 Cumartesi
            const diffToMonday = (day === 0 ? -6 : 1 - day);
            const monday = new Date(now);
            monday.setDate(now.getDate() + diffToMonday);
            monday.setHours(0, 0, 0, 0);
            return monday;
        })();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const start = timeFilter === 'today' ? startOfDay : timeFilter === 'week' ? startOfWeek : startOfMonth;
        return rows.filter((r) => {
            const d = new Date(r.effectiveFrom as any);
            return !Number.isNaN(d.getTime()) && d >= start;
        });
    }, [rows, timeFilter]);

    const pagePriceWithVatTotal = useMemo(() => {
        return filteredRows.reduce((sum, r) => {
            const price = Number(r.salePrice || 0);
            const vatRate = Number(r.vatRate || 0);
            const priceWithVat = price * (1 + vatRate / 100);
            return sum + (Number.isFinite(priceWithVat) ? priceWithVat : 0);
        }, 0);
    }, [filteredRows]);

    useEffect(() => {
        fetchCards();
    }, [page, pageSize, debouncedSearch, statusFilter, timeFilter]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu fiyat kartını silmek istediğinize emin misiniz?')) {
            try {
                await priceCardApi.delete(id);
                enqueueSnackbar('Fiyat kartı silindi', { variant: 'success' });
                fetchCards();
            } catch (error) {
                enqueueSnackbar('Silme işlemi başarısız', { variant: 'error' });
            }
        }
    };

    const handleExport = async () => {
        try {
            await priceCardApi.exportToExcel({
                q: debouncedSearch,
                status: statusFilter === 'ALL' ? undefined : statusFilter,
            });
            enqueueSnackbar('Excel dosyası hazırlandı', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Dışa aktarma başarısız', { variant: 'error' });
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'product',
            headerName: 'Stok Bilgisi',
            flex: 2,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {params.row.product?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {params.row.product?.code} • {params.row.product?.brand || 'Markasız'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'priceType',
            headerName: 'Fiyat Tipi',
            width: 120,
            renderCell: (params: GridRenderCellParams) => {
                const colors: Record<string, string> = {
                    SALE: 'primary',
                    CAMPAIGN: 'warning',
                    LIST: 'info'
                };
                const labels: Record<string, string> = {
                    SALE: 'Satış',
                    CAMPAIGN: 'Kampanya',
                    LIST: 'Liste'
                };
                return (
                    <Chip
                        label={labels[params.value as string] || params.value}
                        size="small"
                        color={colors[params.value as string] as any || 'default'}
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                    />
                );
            }
        },
        {
            field: 'price',
            headerName: 'Birim Fiyat',
            width: 150,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: params.row.currency }).format(params.value as number)}
                </Typography>
            ),
        },
        {
            field: 'effectiveDates',
            headerName: 'Geçerlilik',
            width: 200,
            renderCell: (params: GridRenderCellParams) => {
                const from = params.row.effectiveFrom ? new Date(params.row.effectiveFrom).toLocaleDateString('tr-TR') : '-';
                const to = params.row.effectiveTo ? new Date(params.row.effectiveTo).toLocaleDateString('tr-TR') : 'Süresiz';
                return (
                    <Typography variant="caption" color="text.secondary">
                        {from} - {to}
                    </Typography>
                );
            }
        },
        {
            field: 'status',
            headerName: 'Durum',
            width: 120,
            renderCell: (params: GridRenderCellParams) => {
                const colors: Record<string, string> = {
                    ACTIVE: 'success',
                    EXPIRED: 'error',
                    PASSIVE: 'default'
                };
                const labels: Record<string, string> = {
                    ACTIVE: 'Aktif',
                    EXPIRED: 'Süresi Dolmuş',
                    PASSIVE: 'Pasif'
                };
                return (
                    <Chip
                        label={labels[params.value as string] || params.value}
                        size="small"
                        color={colors[params.value as string] as any || 'default'}
                        sx={{ fontSize: '0.75rem' }}
                    />
                );
            }
        },
        {
            field: 'createdByUser',
            headerName: 'Oluşturan',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2">
                    {params.row.createdByUser?.fullName || params.row.createdBy || '-'}
                </Typography>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Oluşturulma Tarihi',
            width: 140,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="caption" color="text.secondary">
                    {params.value ? new Date(params.value as string).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                </Typography>
            ),
        },
        {
            field: 'updatedAt',
            headerName: 'Son Güncelleme',
            width: 140,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="caption" color="text.secondary">
                    {params.value ? new Date(params.value as string).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                </Typography>
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'İşlemler',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon fontSize="small" />}
                    label="Düzenle"
                    onClick={() => { setSelectedCardId(params.id as string); setModalOpen(true); }}
                    color="primary"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon fontSize="small" />}
                    label="Sil"
                    onClick={() => handleDelete(params.id as string)}
                    color="primary"
                />,
            ],
        },
    ];

    return (
        <StandardPage
            title="Stok Fiyat Kartları"
            headerActions={
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { setSelectedCardId(null); setModalOpen(true); }}
                    sx={{ borderRadius: 'var(--radius)', px: 3 }}
                >
                    Yeni Ekle
                </Button>
            }
        >
            <Stack spacing={3}>
                {/* KPI Section */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <KPICard title="Toplam Kart" value={metrics.total} icon={TrendingUpIcon} colorVar="var(--chart-1)" />
                    <KPICard title="Aktif Kartlar" value={metrics.active} icon={ActiveIcon} colorVar="var(--chart-3)" />
                    <KPICard title="Süresi Dolanlar" value={metrics.expired} icon={ExpiredIcon} colorVar="var(--destructive)" />
                    <KPICard title="Ort. Satış Fiyatı" value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(metrics.average)} icon={AverageIcon} colorVar="var(--chart-2)" />
                </Stack>

                {/* Filters & Table Section */}
                <StandardCard padding={0}>
                    {/* Toolbar */}
                    <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                        <TextField
                            id="price-card-search-input"
                            size="small"
                            placeholder="Stok adı veya kodu ile ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ minWidth: 280 }}
                            InputProps={{
                                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />
                            }}
                        />

                        <Stack direction="row" spacing={1} sx={{ ml: { md: 'auto' }, flexWrap: 'wrap' }}>
                            <Chip
                                label="Tümü"
                                onClick={() => setTimeFilter('all')}
                                variant={timeFilter === 'all' ? 'filled' : 'outlined'}
                                size="small"
                                color={timeFilter === 'all' ? 'primary' : 'default'}
                            />
                            <Chip
                                label="Bugün"
                                onClick={() => setTimeFilter('today')}
                                variant={timeFilter === 'today' ? 'filled' : 'outlined'}
                                size="small"
                                color={timeFilter === 'today' ? 'primary' : 'default'}
                            />
                            <Chip
                                label="Bu Hafta"
                                onClick={() => setTimeFilter('week')}
                                variant={timeFilter === 'week' ? 'filled' : 'outlined'}
                                size="small"
                                color={timeFilter === 'week' ? 'primary' : 'default'}
                            />
                            <Chip
                                label="Bu Ay"
                                onClick={() => setTimeFilter('month')}
                                variant={timeFilter === 'month' ? 'filled' : 'outlined'}
                                size="small"
                                color={timeFilter === 'month' ? 'primary' : 'default'}
                            />
                        </Stack>

                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Tooltip title="Excel İndir">
                                <IconButton onClick={handleExport} size="small" sx={{ border: '1px solid var(--border)' }}>
                                    <ExportIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Yenile">
                                <IconButton onClick={fetchCards} size="small" sx={{ border: '1px solid var(--border)' }}>
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* DataGrid */}
                    <Box sx={{ width: '100%', height: 600 }}>
                        <DataGrid
                            rows={filteredRows}
                            columns={columns}
                            loading={loading}
                            rowCount={totalRows}
                            paginationMode="server"
                            paginationModel={{ page, pageSize }}
                            onPaginationModelChange={(model: GridPaginationModel) => {
                                setPage(model.page);
                                setPageSize(model.pageSize);
                            }}
                            pageSizeOptions={[25, 50, 100]}
                            disableRowSelectionOnClick
                            getRowHeight={() => 'auto'}
                            sx={{
                                border: 'none',
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid var(--border)',
                                    py: 1,
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'var(--muted)',
                                    borderBottom: '1px solid var(--border)',
                                    color: 'var(--muted-foreground)',
                                    fontWeight: 700,
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: '1px solid var(--border)',
                                }
                            }}
                        />
                    </Box>

                    {/* Footer sum */}
                    <Box
                        sx={{
                            p: 2,
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Bu sayfadaki toplam <b>KDV Dahil Fiyat</b>:
                        </Typography>
                        <Typography variant="body2" fontWeight={800} sx={{ color: 'var(--secondary)' }}>
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(pagePriceWithVatTotal)}
                        </Typography>
                    </Box>
                </StandardCard>
            </Stack>

            {modalOpen && (
                <AddEditPriceCardModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    cardId={selectedCardId}
                    onSuccess={fetchCards}
                />
            )}
        </StandardPage>
    );
}
