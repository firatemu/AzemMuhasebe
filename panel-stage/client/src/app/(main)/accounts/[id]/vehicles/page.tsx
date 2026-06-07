'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    IconButton,
    Tooltip,
    Chip,
    Alert,
    Snackbar,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    InputAdornment,
    CircularProgress,
    Grid,
    Divider,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridPaginationModel,
} from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    DirectionsCar as CarIcon,
    Upload as UploadIcon,
    Image as ImageIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    ArrowBack,
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import StandardPage from '@/components/common/StandardPage';
import StandardCard from '@/components/common/StandardCard';
import axios from '@/lib/axios';

interface CustomerVehicle {
    id: string;
    accountId: string;
    plate: string;
    chassisno?: string;
    year?: number;
    mileage?: number;
    brand: string;
    model: string;
    engineSize?: string;
    fuelType?: string;
    registrationNo?: string;
    registrationOwner?: string;
    registrationDate?: string;
    enginePower?: number;
    transmission?: string;
    color?: string;
    notes?: string;
    ruhsatPhotoUrl?: string;
    account?: { id: string; code: string; title: string };
    createdAt: string;
    updatedAt: string;
}

interface VehicleFormData {
    plaka: string;
    saseno: string;
    yil: number | '';
    km: number | '';
    aracMarka: string;
    aracModel: string;
    aracMotorHacmi: string;
    aracYakitTipi: string;
    ruhsatNo: string;
    ruhsatSahibi: string;
    motorGucu: number | '';
    sanziman: string;
    renk: string;
    tescilTarihi: string;
    notes: string;
}

const emptyFormData: VehicleFormData = {
    plaka: '',
    saseno: '',
    yil: '',
    km: '',
    aracMarka: '',
    aracModel: '',
    aracMotorHacmi: '',
    aracYakitTipi: '',
    ruhsatNo: '',
    ruhsatSahibi: '',
    motorGucu: '',
    sanziman: '',
    renk: '',
    tescilTarihi: '',
    notes: '',
};

const FUEL_TYPES = ['Benzin', 'Dizel', 'LPG', 'Elektrik', 'Hibrit', 'Doğalgaz'];
const TRANSMISSION_TYPES = ['Manuel', 'Otomatik', 'Yarı Otomatik'];

const VehicleDialog = memo(({
    open,
    initialData,
    isEditing,
    onClose,
    onSubmit,
}: {
    open: boolean;
    initialData: VehicleFormData;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (data: VehicleFormData) => void;
}) => {
    const [formData, setFormData] = useState<VehicleFormData>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (field: keyof VehicleFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isValid = formData.plaka && formData.aracMarka && formData.aracModel;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ fontWeight: 800 }}>
                {isEditing ? 'Araç Düzenle' : 'Yeni Araç Ekle'}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Plaka *"
                                value={formData.plaka}
                                onChange={(e) => handleChange('plaka', e.target.value.toUpperCase())}
                                required
                                placeholder="Örn: 34ABC123"
                                autoFocus
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Şasi No (SASENO)"
                                value={formData.saseno}
                                onChange={(e) => handleChange('saseno', e.target.value.toUpperCase())}
                                placeholder="Örn: WBAPH5C55AA123456"
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                        Araç Bilgileri
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Marka *"
                                value={formData.aracMarka}
                                onChange={(e) => handleChange('aracMarka', e.target.value)}
                                required
                                placeholder="Örn: Toyota, BMW, Mercedes"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Model *"
                                value={formData.aracModel}
                                onChange={(e) => handleChange('aracModel', e.target.value)}
                                required
                                placeholder="Örn: Corolla, 3.20, C200"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Motor Hacmi"
                                value={formData.aracMotorHacmi}
                                onChange={(e) => handleChange('aracMotorHacmi', e.target.value)}
                                placeholder="Örn: 1.6, 2.0, 1800"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">cc</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth>
                                <InputLabel>Yakıt Tipi</InputLabel>
                                <Select
                                    value={formData.aracYakitTipi}
                                    label="Yakıt Tipi"
                                    onChange={(e) => handleChange('aracYakitTipi', e.target.value)}
                                >
                                    {FUEL_TYPES.map(ft => (
                                        <MenuItem key={ft} value={ft}>{ft}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Renk"
                                value={formData.renk}
                                onChange={(e) => handleChange('renk', e.target.value)}
                                placeholder="Örn: Beyaz, Siyah, Gri"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Yıl"
                                type="number"
                                value={formData.yil}
                                onChange={(e) => handleChange('yil', e.target.value ? parseInt(e.target.value) : '')}
                                placeholder="Örn: 2020"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Kilometre"
                                type="number"
                                value={formData.km}
                                onChange={(e) => handleChange('km', e.target.value ? parseInt(e.target.value) : '')}
                                placeholder="Örn: 50000"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">km</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Motor Gücü"
                                type="number"
                                value={formData.motorGucu}
                                onChange={(e) => handleChange('motorGucu', e.target.value ? parseInt(e.target.value) : '')}
                                placeholder="Örn: 120"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">hp</InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth>
                                <InputLabel>Şanzıman</InputLabel>
                                <Select
                                    value={formData.sanziman}
                                    label="Şanzıman"
                                    onChange={(e) => handleChange('sanziman', e.target.value)}
                                >
                                    {TRANSMISSION_TYPES.map(t => (
                                        <MenuItem key={t} value={t}>{t}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                        Ruhsat Bilgileri
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Ruhsat No"
                                value={formData.ruhsatNo}
                                onChange={(e) => handleChange('ruhsatNo', e.target.value)}
                                placeholder="Örn: A1234567"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Ruhsat Sahibi"
                                value={formData.ruhsatSahibi}
                                onChange={(e) => handleChange('ruhsatSahibi', e.target.value)}
                                placeholder="Örn: Ahmet Yılmaz"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Tescil Tarihi"
                                type="date"
                                value={formData.tescilTarihi}
                                onChange={(e) => handleChange('tescilTarihi', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Notlar"
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                placeholder="Ek notlar..."
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700 }}>İptal</Button>
                <Button
                    variant="contained"
                    onClick={() => onSubmit(formData)}
                    disabled={!isValid}
                    sx={{ fontWeight: 800, borderRadius: 2, px: 4 }}
                >
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

VehicleDialog.displayName = 'VehicleDialog';

interface RuhsatUploadDialogProps {
    open: boolean;
    onClose: () => void;
    vehicleId: string;
    currentUrl?: string;
    onSuccess: (url: string) => void;
}

const RuhsatUploadDialog = memo(({ open, onClose, vehicleId, currentUrl, onSuccess }: RuhsatUploadDialogProps) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentUrl || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (open) {
            setPreview(currentUrl || null);
            setSelectedFile(null);
        }
    }, [open, currentUrl]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const response = await axios.post('/customer-vehicles/upload-ruhsat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onSuccess(response.data.url);
            onClose();
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ fontWeight: 800 }}>Ruhsat Fotoğrafı Yükle</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }} alignItems="center">
                    <Box sx={{ width: '100%' }}>
                        {preview ? (
                            <Box sx={{ border: '1px solid var(--border)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                                <img src={preview} alt="Ruhsat preview" style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }} />
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    border: '2px dashed var(--border)',
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'var(--muted)' },
                                }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                <Typography color="text.secondary">Ruhsat fotoğrafı seçin</Typography>
                            </Box>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ width: '100%' }}
                    >
                        {preview ? 'Farklı Fotoğraf Seç' : 'Fotoğraf Seç'}
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700 }}>İptal</Button>
                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
                    sx={{ fontWeight: 800, borderRadius: 2, px: 4 }}
                >
                    {uploading ? 'Yükleniyor...' : 'Kaydet'}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

RuhsatUploadDialog.displayName = 'RuhsatUploadDialog';

export default function CustomerVehiclesPage() {
    const params = useParams();
    const router = useRouter();
    const accountId = params.id as string;

    const [data, setData] = useState<CustomerVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<VehicleFormData>(emptyFormData);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [ruhsatDialogOpen, setRuhsatDialogOpen] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [currentRuhsatUrl, setCurrentRuhsatUrl] = useState<string | undefined>(undefined);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/customer-vehicles', {
                params: {
                    page: page + 1,
                    limit: pageSize,
                    search: debouncedSearch || undefined,
                    accountId: accountId,
                },
            });
            setData(response.data.data || []);
            setTotalRows(response.data.total || 0);
        } catch (error) {
            console.error('Araç verileri yüklenemedi:', error);
            setSnackbar({ open: true, message: 'Veriler yüklenirken hata oluştu', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, debouncedSearch, accountId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenDialog = (item?: CustomerVehicle) => {
        if (item) {
            setEditingId(item.id);
            setFormData({
                plaka: item.plaka || '',
                saseno: item.chassisno || '',
                yil: item.year || '',
                km: item.mileage || '',
                aracMarka: item.brand || '',
                aracModel: item.model || '',
                aracMotorHacmi: item.engineSize || '',
                aracYakitTipi: item.fuelType || '',
                ruhsatNo: item.registrationNo || '',
                ruhsatSahibi: item.registrationOwner || '',
                motorGucu: item.enginePower || '',
                sanziman: item.transmission || '',
                renk: item.color || '',
                tescilTarihi: item.registrationDate ? item.registrationDate.split('T')[0] : '',
                notes: item.notes || '',
            });
        } else {
            setEditingId(null);
            setFormData(emptyFormData);
        }
        setDialogOpen(true);
    };

    const handleSubmit = async (submitData: VehicleFormData) => {
        try {
            const payload = {
                accountId,
                plaka: submitData.plaka,
                saseno: submitData.saseno || undefined,
                yil: submitData.yil || undefined,
                km: submitData.km || undefined,
                aracMarka: submitData.aracMarka,
                aracModel: submitData.aracModel,
                aracMotorHacmi: submitData.aracMotorHacmi || undefined,
                aracYakitTipi: submitData.aracYakitTipi || undefined,
                ruhsatNo: submitData.ruhsatNo || undefined,
                ruhsatSahibi: submitData.ruhsatSahibi || undefined,
                tescilTarihi: submitData.tescilTarihi || undefined,
                motorGucu: submitData.motorGucu || undefined,
                sanziman: submitData.sanziman || undefined,
                renk: submitData.renk || undefined,
                notes: submitData.notes || undefined,
            };

            if (editingId) {
                await axios.patch(`/customer-vehicles/${editingId}`, payload);
                setSnackbar({ open: true, message: 'Araç başarıyla güncellendi', severity: 'success' });
            } else {
                await axios.post('/customer-vehicles', payload);
                setSnackbar({ open: true, message: 'Yeni araç eklendi', severity: 'success' });
            }
            setDialogOpen(false);
            fetchData();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'İşlem başarısız';
            setSnackbar({ open: true, message: msg, severity: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu aracı silmek istediğinize emin misiniz?')) return;
        try {
            await axios.delete(`/customer-vehicles/${id}`);
            setSnackbar({ open: true, message: 'Araç silindi', severity: 'success' });
            fetchData();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Silme işlemi başarısız';
            setSnackbar({ open: true, message: msg, severity: 'error' });
        }
    };

    const handleOpenRuhsatUpload = (vehicle: CustomerVehicle) => {
        setSelectedVehicleId(vehicle.id);
        setCurrentRuhsatUrl(vehicle.ruhsatPhotoUrl);
        setRuhsatDialogOpen(true);
    };

    const handleRuhsatSuccess = (url: string) => {
        setSnackbar({ open: true, message: 'Ruhsat fotoğrafı yüklendi', severity: 'success' });
        fetchData();
    };

    const columns: GridColDef[] = [
        {
            field: 'plate',
            headerName: 'Plaka',
            flex: 1,
            minWidth: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                    }}>
                        <CarIcon fontSize="small" />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {params.value}
                    </Typography>
                </Stack>
            ),
        },
        {
            field: 'brand',
            headerName: 'Marka / Model',
            flex: 1,
            minWidth: 160,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {params.row.brand}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {params.row.model}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'chassisno',
            headerName: 'Şasi No',
            width: 160,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {params.value || '-'}
                </Typography>
            ),
        },
        {
            field: 'year',
            headerName: 'Yıl',
            width: 80,
            align: 'center',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2">{params.value || '-'}</Typography>
            ),
        },
        {
            field: 'fuelType',
            headerName: 'Yakıt',
            width: 100,
            renderCell: (params: GridRenderCellParams) => params.value ? (
                <Chip label={params.value} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
            ) : '-',
        },
        {
            field: 'registrationNo',
            headerName: 'Ruhsat No',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2" color="text.secondary">
                    {params.value || '-'}
                </Typography>
            ),
        },
        {
            field: 'ruhsatPhotoUrl',
            headerName: 'Ruhsat',
            width: 100,
            align: 'center',
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip title="Ruhsat fotoğrafı yükle">
                    <IconButton
                        size="small"
                        color={params.value ? 'success' : 'default'}
                        onClick={() => handleOpenRuhsatUpload(params.row as CustomerVehicle)}
                    >
                        {params.value ? <ImageIcon fontSize="small" /> : <UploadIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            ),
        },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 100,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog(params.row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            ),
        },
    ];

    return (
        <StandardPage
            title="Müşteri Araçları"
            subtitle="Bu carinin kayıtlı araçları."
            breadcrumbs={[
                { label: 'Cari Hesaplar', href: '/accounts' },
                { label: 'Araçlar' },
            ]}
            headerActions={
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => router.push(`/accounts/${accountId}`)}
                    >
                        Cariye Dön
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
                    >
                        Yeni Araç Ekle
                    </Button>
                </Stack>
            }
        >
            <Stack spacing={3}>
                <StandardCard padding={0}>
                    <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                        <TextField
                            size="small"
                            placeholder="Plaka, şasi no veya marka ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ minWidth: 260 }}
                            InputProps={{
                                startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />,
                            }}
                        />

                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Tooltip title="Yenile">
                                <IconButton onClick={fetchData} size="small" sx={{ border: '1px solid var(--border)' }}>
                                    <RefreshIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%', height: 600 }}>
                        <DataGrid
                            rows={data}
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

            <VehicleDialog
                open={dialogOpen}
                initialData={formData}
                isEditing={!!editingId}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleSubmit}
            />

            {selectedVehicleId && (
                <RuhsatUploadDialog
                    open={ruhsatDialogOpen}
                    onClose={() => setRuhsatDialogOpen(false)}
                    vehicleId={selectedVehicleId}
                    currentUrl={currentRuhsatUrl}
                    onSuccess={handleRuhsatSuccess}
                />
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 700 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </StandardPage>
    );
}