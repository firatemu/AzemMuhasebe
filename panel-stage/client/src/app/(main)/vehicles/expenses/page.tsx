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
    DirectionsCar,
    LocalGasStation,
    Build,
    EventNote,
    Security,
    Shield,
    Warning,
    Toll,
    LocalParking,
    Wash,
    MoreHoriz,
    Close,
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import MainLayout from '@/components/Layout/MainLayout';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';

type VehicleExpenseType =
    | 'FUEL'
    | 'MAINTENANCE'
    | 'INSPECTION'
    | 'TRAFFIC_INSURANCE'
    | 'CASCO'
    | 'PENALTY'
    | 'HGS_OGS'
    | 'PARKING'
    | 'CAR_WASH'
    | 'OTHER';

interface Vehicle {
    id: string;
    plate: string;
    brand: string;
    model: string;
}

interface VehicleExpense {
    id: string;
    vehicleId: string;
    expenseType: VehicleExpenseType;
    date: string;
    amount: number;
    notes?: string;
    documentNo?: string;
    mileage?: number;
    vehicle?: Vehicle;
    createdAt: string;
    updatedAt: string;
}

interface CreateVehicleExpenseDto {
    vehicleId: string;
    expenseType: VehicleExpenseType;
    date?: string;
    amount: number;
    notes?: string;
    documentNo?: string;
    mileage?: number;
}

const VEHICLE_EXPENSE_TYPES: Record<VehicleExpenseType, { label: string; icon: React.ReactNode }> = {
    FUEL: { label: 'Yakıt', icon: <LocalGasStation /> },
    MAINTENANCE: { label: 'Bakım', icon: <Build /> },
    INSPECTION: { label: 'Muayene', icon: <EventNote /> },
    TRAFFIC_INSURANCE: { label: 'Trafik Sigortası', icon: <Security /> },
    CASCO: { label: 'Kasko', icon: <Shield /> },
    PENALTY: { label: 'Ceza', icon: <Warning /> },
    HGS_OGS: { label: 'HGS/OGS', icon: <Toll /> },
    PARKING: { label: 'Park', icon: <LocalParking /> },
    CAR_WASH: { label: 'Yıkama', icon: <Wash /> },
    OTHER: { label: 'Diğer', icon: <MoreHoriz /> },
};

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

interface VehicleExpenseFormDialogProps {
    open: boolean;
    editMode: boolean;
    initialData: VehicleExpense | null;
    vehicles: Vehicle[];
    loading: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const VehicleExpenseFormDialog = memo(({
    open,
    editMode,
    initialData,
    vehicles,
    loading,
    onClose,
    onSubmit,
}: VehicleExpenseFormDialogProps) => {
    const [formData, setFormData] = useState<CreateVehicleExpenseDto>({
        vehicleId: '',
        expenseType: 'FUEL',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        notes: '',
        documentNo: '',
        mileage: undefined,
    });

    React.useEffect(() => {
        if (open) {
            if (editMode && initialData) {
                setFormData({
                    vehicleId: initialData.vehicleId,
                    expenseType: initialData.expenseType,
                    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
                    amount: initialData.amount,
                    notes: initialData.notes || '',
                    documentNo: initialData.documentNo || '',
                    mileage: initialData.mileage,
                });
            } else {
                setFormData({
                    vehicleId: '',
                    expenseType: 'FUEL',
                    date: new Date().toISOString().split('T')[0],
                    amount: 0,
                    notes: '',
                    documentNo: '',
                    mileage: undefined,
                });
            }
        }
    }, [open, editMode, initialData]);

    const handleChange = (field: keyof CreateVehicleExpenseDto, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!open) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
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
                        bgcolor: 'color-mix(in srgb, var(--chart-1) 10%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--chart-1)',
                    }}>
                        <DirectionsCar sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--foreground)' }}>
                            {editMode ? 'Araç Masrafı Düzenle' : 'Yeni Araç Masrafı'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                            Araç gider bilgilerini girin
                        </Typography>
                    </Box>
                </Box>
                <IconButton size="small" onClick={onClose}>
                    <Close fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                    <FormControl fullWidth required>
                        <InputLabel>Araç</InputLabel>
                        <Select
                            value={formData.vehicleId}
                            onChange={(e) => handleChange('vehicleId', e.target.value)}
                            label="Araç"
                        >
                            {vehicles.map((v) => (
                                <MenuItem key={v.id} value={v.id}>
                                    {v.plate} - {v.brand} {v.model}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel>Masraf Tipi</InputLabel>
                        <Select
                            value={formData.expenseType}
                            onChange={(e) => handleChange('expenseType', e.target.value)}
                            label="Masraf Tipi"
                        >
                            {Object.entries(VEHICLE_EXPENSE_TYPES).map(([key, { label }]) => (
                                <MenuItem key={key} value={key}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Tutar"
                                value={formData.amount || ''}
                                onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                                }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Tarih"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Belge No"
                                value={formData.documentNo}
                                onChange={(e) => handleChange('documentNo', e.target.value)}
                                placeholder="Fiş/fatura no"
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Kilometre"
                                value={formData.mileage || ''}
                                onChange={(e) => handleChange('mileage', parseInt(e.target.value) || undefined)}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">km</InputAdornment>,
                                }}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        label="Notlar"
                        value={formData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        multiline
                        rows={2}
                        placeholder="Masraf hakkında not..."
                    />
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
                    onClick={onSubmit}
                    disabled={loading || !formData.vehicleId || !formData.amount}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                    {loading ? 'Kaydediliyor...' : (editMode ? 'Güncelle' : 'Kaydet')}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

VehicleExpenseFormDialog.displayName = 'VehicleExpenseFormDialog';

export default function VehicleExpensesPage() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 });
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<VehicleExpense | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<VehicleExpense | null>(null);

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: expensesData, isLoading, isFetching } = useQuery<{ data: VehicleExpense[] }>({
        queryKey: ['vehicle-expenses', debouncedSearch, paginationModel.page, paginationModel.pageSize],
        queryFn: async () => {
            const response = await axios.get('/vehicle-expenses');
            return { data: response.data || [] };
        },
    });

    const { data: vehiclesData } = useQuery<{ data: Vehicle[] }>({
        queryKey: ['company-vehicles'],
        queryFn: async () => {
            const response = await axios.get('/company-vehicles');
            return { data: response.data?.data || response.data || [] };
        },
    });

    const expenses = expensesData?.data || [];
    const vehicles = vehiclesData?.data || [];

    const filteredExpenses = useMemo(() => {
        if (!debouncedSearch) return expenses;
        const searchLower = debouncedSearch.toLowerCase();
        return expenses.filter(exp =>
            exp.vehicle?.plate?.toLowerCase().includes(searchLower) ||
            exp.vehicle?.brand?.toLowerCase().includes(searchLower) ||
            exp.notes?.toLowerCase().includes(searchLower)
        );
    }, [expenses, debouncedSearch]);

    const handleOpenDialog = useCallback((expense?: VehicleExpense) => {
        if (expense) {
            setEditMode(true);
            setSelectedExpense(expense);
        } else {
            setEditMode(false);
            setSelectedExpense(null);
        }
        setDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setEditMode(false);
        setSelectedExpense(null);
    }, []);

    const handleSubmit = async () => {
        try {
            setActionLoading(true);

            if (editMode && selectedExpense) {
                const updateData: any = {
                    expenseType: formData.expenseType,
                    amount: formData.amount,
                    notes: formData.notes || null,
                    documentNo: formData.documentNo || null,
                    mileage: formData.mileage || null,
                };
                if (formData.date) {
                    updateData.date = formData.date;
                }
                await axios.patch(`/vehicle-expenses/${selectedExpense.id}`, updateData);
                enqueueSnackbar('Araç masrafı güncellendi', { variant: 'success' });
            } else {
                await axios.post('/vehicle-expenses', formData);
                enqueueSnackbar('Araç masrafı eklendi', { variant: 'success' });
            }

            handleCloseDialog();
            queryClient.invalidateQueries({ queryKey: ['vehicle-expenses'] });
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'İşlem sırasında hata oluştu', { variant: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedForDelete) return;

        try {
            setActionLoading(true);
            await axios.delete(`/vehicle-expenses/${selectedForDelete.id}`);
            enqueueSnackbar('Araç masrafı silindi', { variant: 'success' });
            setDeleteDialogOpen(false);
            setSelectedForDelete(null);
            queryClient.invalidateQueries({ queryKey: ['vehicle-expenses'] });
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'Silme sırasında hata oluştu', { variant: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const [formData, setFormData] = useState<CreateVehicleExpenseDto>({
        vehicleId: '',
        expenseType: 'FUEL',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        notes: '',
        documentNo: '',
        mileage: undefined,
    });

    const columns = useMemo<GridColDef[]>(() => [
        {
            field: 'date',
            headerName: 'Tarih',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2">
                    {formatDate(params.value)}
                </Typography>
            ),
        },
        {
            field: 'vehicle',
            headerName: 'Araç',
            flex: 1,
            minWidth: 180,
            renderCell: (params: GridRenderCellParams) => {
                const vehicle = params.value as Vehicle;
                return (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{
                            p: 0.5,
                            borderRadius: 1,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            display: 'flex',
                        }}>
                            <DirectionsCar sx={{ fontSize: 16 }} />
                        </Box>
                        <Box>
                            <Typography variant="body2" fontWeight={700}>
                                {vehicle?.plate || '-'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {vehicle?.brand} {vehicle?.model}
                            </Typography>
                        </Box>
                    </Stack>
                );
            },
        },
        {
            field: 'expenseType',
            headerName: 'Masraf Tipi',
            width: 150,
            renderCell: (params: GridRenderCellParams) => {
                const type = params.value as VehicleExpenseType;
                const config = VEHICLE_EXPENSE_TYPES[type] || { label: type, icon: <MoreHoriz /> };
                return (
                    <Chip
                        icon={<Box sx={{ display: 'flex', '& > *': { fontSize: 16 } }}>{config.icon}</Box>}
                        label={config.label}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                );
            },
        },
        {
            field: 'amount',
            headerName: 'Tutar',
            width: 140,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" fontWeight={700} color="error.main">
                    {formatCurrency(params.value)}
                </Typography>
            ),
        },
        {
            field: 'documentNo',
            headerName: 'Belge No',
            width: 140,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    {params.value || '-'}
                </Typography>
            ),
        },
        {
            field: 'mileage',
            headerName: 'Kilometre',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" color="text.secondary">
                    {params.value ? `${params.value.toLocaleString('tr-TR')} km` : '-'}
                </Typography>
            ),
        },
        {
            field: 'notes',
            headerName: 'Notlar',
            flex: 1,
            minWidth: 150,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" color="text.secondary" noWrap>
                    {params.value || '-'}
                </Typography>
            ),
        },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as VehicleExpense;
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

    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <MainLayout>
            <StandardPage
                title="Araç Masrafları"
                subtitle="Şirket araçlarının giderlerini takip edin"
                breadcrumbs={[
                    { label: 'Araç Yönetimi', href: '/vehicles' },
                    { label: 'Araç Masrafları' },
                ]}
                headerActions={
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
                    >
                        Yeni Araç Masrafı
                    </Button>
                }
            >
                <Stack spacing={3}>
                    <StandardCard padding={0}>
                        <Box sx={{ p: 2, borderBottom: '1px solid var(--border)', display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                size="small"
                                placeholder="Araç plakası veya not ara..."
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
                            <Box sx={{ ml: 'auto' }}>
                                <Typography variant="caption" color="text.secondary">
                                    Toplam:{' '}
                                </Typography>
                                <Typography variant="subtitle2" fontWeight={800} color="error.main">
                                    {formatCurrency(totalAmount)}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ height: 600 }}>
                            <DataGrid
                                rows={filteredExpenses}
                                columns={columns}
                                loading={isLoading || isFetching}
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

            <VehicleExpenseFormDialog
                open={dialogOpen}
                editMode={editMode}
                initialData={selectedExpense}
                vehicles={vehicles}
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
                    Araç Masrafını Sil
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Bu araç masrafını silmek istediğinizden emin misiniz?
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
