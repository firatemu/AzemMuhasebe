'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    InputAdornment,
    Divider,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Paper,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridPaginationModel,
} from '@mui/x-data-grid';
import {
    Add,
    Edit,
    Delete,
    Search,
    AttachMoney,
    DateRange,
    Close,
    ToggleOn,
    ToggleOff,
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import MainLayout from '@/components/Layout/MainLayout';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';

interface PriceListItem {
    productId: string;
    price: number;
    discountRate?: number;
    product?: {
        id: string;
        code: string;
        name: string;
    };
}

interface PriceList {
    id: string;
    name: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    items?: PriceListItem[];
    createdAt: string;
    updatedAt: string;
}

interface CreatePriceListDto {
    name: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    items?: Array<{
        productId: string;
        price: number;
        discountRate?: number;
    }>;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(value);

const formatDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) return '-';
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('tr-TR');
    } catch {
        return '-';
    }
};

interface PriceListFormDialogProps {
    open: boolean;
    editMode: boolean;
    initialData: PriceList | null;
    loading: boolean;
    onClose: () => void;
    onSubmit: (formData: CreatePriceListDto) => void;
}

const PriceListFormDialog = memo(({
    open,
    editMode,
    initialData,
    loading,
    onClose,
    onSubmit,
}: PriceListFormDialogProps) => {
    const [formData, setFormData] = useState<CreatePriceListDto>({
        name: '',
        startDate: '',
        endDate: '',
        isActive: true,
        items: [],
    });

    React.useEffect(() => {
        if (open) {
            if (editMode && initialData) {
                setFormData({
                    name: initialData.name,
                    startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
                    endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
                    isActive: initialData.isActive ?? true,
                    items: initialData.items?.map(item => ({
                        productId: item.productId,
                        price: item.price,
                        discountRate: item.discountRate,
                    })) || [],
                });
            } else {
                setFormData({
                    name: '',
                    startDate: '',
                    endDate: '',
                    isActive: true,
                    items: [],
                });
            }
        }
    }, [open, editMode, initialData]);

    const handleChange = (field: keyof CreatePriceListDto, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        setFormData(prev => {
            const newItems = [...(prev.items || [])];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...(prev.items || []), { productId: '', price: 0, discountRate: 0 }],
        }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items?.filter((_, i) => i !== index) || [],
        }));
    };

    if (!open) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: 'var(--card)',
                    backgroundImage: 'none',
                },
            }}
        >
            <Box sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--secondary)',
                    }}>
                        <AttachMoney sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--foreground)' }}>
                            {editMode ? 'Fiyat Listesi Düzenle' : 'Yeni Fiyat Listesi'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                            Fiyat listesi bilgilerini girin
                        </Typography>
                    </Box>
                </Box>
                <IconButton size="small" onClick={onClose}>
                    <Close fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                required
                                label="Liste Adı"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Örn: Toplu Satış Fiyatları 2024"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Başlangıç Tarihi"
                                value={formData.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Bitiş Tarihi"
                                value={formData.endDate}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body2" fontWeight={600}>
                                    Aktif mi?
                                </Typography>
                                <Chip
                                    icon={formData.isActive ? <ToggleOn /> : <ToggleOff />}
                                    label={formData.isActive ? 'Aktif' : 'Pasif'}
                                    color={formData.isActive ? 'success' : 'default'}
                                    onClick={() => handleChange('isActive', !formData.isActive)}
                                    sx={{ cursor: 'pointer' }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={700}>
                                Fiyat Kalemleri
                            </Typography>
                            <Button
                                size="small"
                                startIcon={<Add />}
                                onClick={addItem}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                Kalem Ekle
                            </Button>
                        </Box>

                        {(!formData.items || formData.items.length === 0) ? (
                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                                Henüz fiyat kalemi eklenmemiş. "Kalem Ekle" butonu ile ürün ekleyin.
                            </Alert>
                        ) : (
                            <Stack spacing={2}>
                                {formData.items.map((item, index) => (
                                    <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid size={{ xs: 12, md: 5 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Ürün ID"
                                                    value={item.productId}
                                                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                                    placeholder="Ürün ID"
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 6, md: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Fiyat"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                                                    }}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 6, md: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="İndirim %"
                                                    value={item.discountRate || 0}
                                                    onChange={(e) => handleItemChange(index, 'discountRate', parseFloat(e.target.value) || 0)}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                    }}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 1 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => removeItem(index)}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid var(--border)', gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    İptal
                </Button>
                <Button
                    variant="contained"
                    onClick={() => onSubmit(formData)}
                    disabled={loading || !formData.name}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                    {loading ? 'Kaydediliyor...' : (editMode ? 'Güncelle' : 'Oluştur')}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

PriceListFormDialog.displayName = 'PriceListFormDialog';

export default function PriceListsPage() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedPriceList, setSelectedPriceList] = useState<PriceList | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<PriceList | null>(null);

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: priceListsData, isLoading, isFetching } = useQuery<{ data: PriceList[]; meta?: { total: number } }>({
        queryKey: ['price-lists', debouncedSearch, paginationModel.page, paginationModel.pageSize],
        queryFn: async () => {
            const response = await axios.get('/price-lists');
            const lists = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
            const filtered = debouncedSearch
                ? lists.filter((list: PriceList) =>
                    list.name?.toLowerCase().includes(debouncedSearch.toLowerCase()),
                )
                : lists;
            const start = paginationModel.page * paginationModel.pageSize;
            const paginated = filtered.slice(start, start + paginationModel.pageSize);
            return {
                data: paginated.map((list: PriceList & { _count?: { items: number } }) => ({
                    ...list,
                    items: list.items ?? [],
                    itemCount: list._count?.items ?? list.items?.length ?? 0,
                })),
                meta: { total: filtered.length },
            };
        },
    });

    const priceLists = priceListsData?.data || [];
    const totalRows = priceListsData?.meta?.total || 0;

    const handleOpenDialog = useCallback((priceList?: PriceList) => {
        if (priceList) {
            setEditMode(true);
            setSelectedPriceList(priceList);
        } else {
            setEditMode(false);
            setSelectedPriceList(null);
        }
        setDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setEditMode(false);
        setSelectedPriceList(null);
    }, []);

    const handleSubmit = async (formData: CreatePriceListDto) => {
        try {
            setActionLoading(true);

            if (editMode) {
                enqueueSnackbar('Fiyat listesi güncelleme henüz desteklenmiyor. Yeni liste oluşturun.', { variant: 'info' });
                return;
            }

            const payload: CreatePriceListDto = {
                name: formData.name,
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined,
                isActive: formData.isActive ?? true,
                items: (formData.items ?? []).filter(item => item.productId && item.price > 0),
            };

            await axios.post('/price-lists', payload);
            enqueueSnackbar('Fiyat listesi oluşturuldu', { variant: 'success' });

            handleCloseDialog();
            queryClient.invalidateQueries({ queryKey: ['price-lists'] });
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', { variant: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedForDelete) return;

        enqueueSnackbar('Fiyat listesi silme henüz desteklenmiyor.', { variant: 'info' });
        setDeleteDialogOpen(false);
        setSelectedForDelete(null);
    };

    const columns = useMemo<GridColDef[]>(() => [
        {
            field: 'name',
            headerName: 'Liste Adı',
            flex: 1,
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" fontWeight={700}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'startDate',
            headerName: 'Başlangıç',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" color="text.secondary">
                    {formatDate(params.value)}
                </Typography>
            ),
        },
        {
            field: 'endDate',
            headerName: 'Bitiş',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" color="text.secondary">
                    {formatDate(params.value)}
                </Typography>
            ),
        },
        {
            field: 'isActive',
            headerName: 'Durum',
            width: 100,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    icon={params.value ? <ToggleOn /> : <ToggleOff />}
                    label={params.value ? 'Aktif' : 'Pasif'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                />
            ),
        },
        {
            field: 'items',
            headerName: 'Kalem Sayısı',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" fontWeight={600}>
                    {params.row.itemCount ?? params.row.items?.length ?? 0}
                </Typography>
            ),
        },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 120,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as PriceList;
                return (
                    <Stack direction="row" spacing={0.5}>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(row)}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                                setSelectedForDelete(row);
                                setDeleteDialogOpen(true);
                            }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Stack>
                );
            },
        },
    ], [handleOpenDialog]);

    return (
        <MainLayout>
            <StandardPage
                title="Fiyat Listeleri"
                subtitle="Ürün fiyat listelerini yönetin"
                breadcrumbs={[
                    { label: 'Stok Yönetimi', href: '/stock' },
                    { label: 'Fiyat Listeleri' },
                ]}
                headerActions={
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
                    >
                        Yeni Fiyat Listesi
                    </Button>
                }
            >
                <Stack spacing={3}>
                    <StandardCard padding={0}>
                        <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
                            <TextField
                                size="small"
                                placeholder="Fiyat listesi ara..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ minWidth: 300 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ color: 'text.disabled' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ height: 600 }}>
                            <DataGrid
                                rows={priceLists}
                                columns={columns}
                                loading={isLoading || isFetching}
                                rowCount={totalRows}
                                paginationMode="server"
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                pageSizeOptions={[25, 50, 100]}
                                disableRowSelectionOnClick
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid var(--border)',
                                        py: 1,
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        bgcolor: 'var(--muted)',
                                        borderBottom: '1px solid var(--border)',
                                    },
                                }}
                            />
                        </Box>
                    </StandardCard>
                </Stack>
            </StandardPage>

            <PriceListFormDialog
                open={dialogOpen}
                editMode={editMode}
                initialData={selectedPriceList}
                loading={actionLoading}
                onClose={handleCloseDialog}
                onSubmit={handleSubmit}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 3 },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>
                    Fiyat Listesi Sil
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        "{selectedForDelete?.name}" fiyat listesini silmek istediğinizden emin misiniz?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                        İptal
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={actionLoading}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    >
                        {actionLoading ? 'Siliniyor...' : 'Sil'}
                    </Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
}
