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
    Switch,
    FormControlLabel,
    IconButton,
    Tooltip,
    Chip,
    Alert,
    Snackbar,
    Grid,
    Stack,
    alpha,
    useTheme,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';

interface SatisElemani {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const SatisElemaniDialog = memo(({ open, initialData, isEditing, onClose, onSubmit }: any) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => { setFormData(initialData); }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ fontWeight: 800 }}>{isEditing ? 'Satış Elemanı Düzenle' : 'Yeni Satış Elemanı'}</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Ad Soyad"
                        value={formData.fullName || ''}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        required
                        placeholder="Örn: Ahmet Yılmaz"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                value={formData.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="0(5xx) xxx xx xx"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="E-posta"
                                value={formData.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="user@example.com"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ p: 2, bgcolor: alpha('#2e7d32', 0.05), borderRadius: 3 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive !== false}
                                    onChange={(e) => handleChange('isActive', e.target.checked)}
                                    color="success"
                                />
                            }
                            label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Satış Elemanı Aktif</Typography>}
                        />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700 }}>İptal</Button>
                <Button
                    variant="contained"
                    onClick={() => onSubmit(formData)}
                    disabled={!formData.fullName}
                    sx={{ fontWeight: 800, borderRadius: 2, px: 4 }}
                >
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

SatisElemaniDialog.displayName = 'SatisElemaniDialog';

export default function SatisElemanlariPage() {
    const theme = useTheme();
    const [data, setData] = useState<SatisElemani[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<SatisElemani>>({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/sales-agent');
            setData(response.data);
        } catch (error) {
            setSnackbar({ open: true, message: 'Veriler yüklenirken hata oluştu', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleOpenDialog = (item?: SatisElemani) => {
        if (item) {
            setEditingId(item.id);
            setFormData(item);
        } else {
            setEditingId(null);
            setFormData({ isActive: true });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async (submitData: Partial<SatisElemani>) => {
        try {
            if (editingId) {
                await axios.patch(`/sales-agent/${editingId}`, submitData);
                setSnackbar({ open: true, message: 'Satış elemanı güncellendi', severity: 'success' });
            } else {
                await axios.post('/sales-agent', submitData);
                setSnackbar({ open: true, message: 'Yeni satış elemanı eklendi', severity: 'success' });
            }
            setDialogOpen(false);
            fetchData();
        } catch (error) {
            setSnackbar({ open: true, message: 'İşlem başarısız', severity: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Satış elemanını silmek istediğinize emin misiniz?')) return;
        try {
            await axios.delete(`/sales-agent/${id}`);
            setSnackbar({ open: true, message: 'Satış elemanı silindi', severity: 'success' });
            fetchData();
        } catch (error) {
            setSnackbar({ open: true, message: 'Bu eleman kayıtlarda kullanıldığı için silinemez', severity: 'error' });
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'fullName',
            headerName: 'Satış Elemanı',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main', display: 'flex' }}>
                        <PersonIcon fontSize="small" />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{params.value}</Typography>
                </Stack>
            )
        },
        {
            field: 'phone',
            headerName: 'Telefon',
            width: 180,
            renderCell: (params: GridRenderCellParams) => params.value ? (
                <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{params.value}</Typography>
                </Stack>
            ) : '-'
        },
        {
            field: 'email',
            headerName: 'E-posta',
            width: 220,
            renderCell: (params: GridRenderCellParams) => params.value ? (
                <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{params.value}</Typography>
                </Stack>
            ) : '-'
        },
        {
            field: 'isActive',
            headerName: 'Durum',
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value ? 'Aktif' : 'Pasif'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                    sx={{ fontWeight: 800, borderRadius: 1.5 }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 100,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params: GridRenderCellParams) => (
                <Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ width: '100%' }}>
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog(params.row)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            )
        }
    ];

    return (
        <StandardPage
            title="Satış Elemanları (Plasiyer)"
            breadcrumbs={[{ label: 'Ayarlar', href: '/settings' }, { label: 'Satış Elemanları' }]}
            headerActions={
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}>
                    Yeni Eleman Ekle
                </Button>
            }
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                    Satış personellerinizi ve plasiyerlerinizi buradan yönetebilirsiniz.
                    Bu tanımlar fatura ve siparişlerde satış elemanı seçimi yapmanıza olanak tanır.
                </Typography>
            </Box>

            <Paper variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        loading={loading}
                        disableRowSelectionOnClick
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            },
                        }}
                    />
                </Box>
            </Paper>

            <SatisElemaniDialog
                open={dialogOpen}
                initialData={formData}
                isEditing={!!editingId}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleSubmit}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 700 }}>{snackbar.message}</Alert>
            </Snackbar>
        </StandardPage>
    );
}
