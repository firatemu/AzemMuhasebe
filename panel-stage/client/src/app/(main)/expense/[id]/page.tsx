'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Divider,
    CircularProgress,
} from '@mui/material';
import {
    ArrowBack,
    ExpandMore,
    Edit,
    History,
    Close,
    CurrencyLira,
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import StandardPage from '@/components/common/StandardPage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

interface MasrafKategori {
    id: string;
    name: string;
    notes?: string;
}

interface Masraf {
    id: string;
    categoryId: string;
    referenceNo?: string;
    notes?: string;
    amount: number;
    date: string;
    paymentType?: string;
    createdAt: string;
    updatedAt: string;
    category: MasrafKategori;
    createdByUser?: { fullName?: string; username?: string };
    updatedByUser?: { fullName?: string; username?: string };
}

interface FormData {
    categoryId: string;
    referenceNo: string;
    notes: string;
    amount: string;
    date: string;
    paymentType: string;
}

const emptyFormData: FormData = {
    categoryId: '',
    referenceNo: '',
    notes: '',
    amount: '',
    date: '',
    paymentType: 'CASH',
};

const ODEME_TIPI_LABELS: Record<string, string> = {
    CASH: 'Nakit',
    CREDIT_CARD: 'Kredi Kartı',
    BANK_TRANSFER: 'Havale/EFT',
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
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch {
        return '-';
    }
};

const formatDateTime = (dateString: string | Date | undefined | null) => {
    if (!dateString) return '-';
    try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleString('tr-TR');
    } catch {
        return '-';
    }
};

const MasrafEditDialog = memo(({
    open,
    masraf,
    kategoriler,
    loading,
    onClose,
    onSubmit,
    onFormChange,
}: {
    open: boolean;
    masraf: Masraf | null;
    kategoriler: MasrafKategori[];
    loading: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onFormChange: (field: string, value: any) => void;
}) => {
    const [formData, setFormData] = useState<FormData>(emptyFormData);

    useEffect(() => {
        if (masraf && open) {
            setFormData({
                categoryId: masraf.categoryId,
                referenceNo: masraf.referenceNo || '',
                notes: masraf.notes || '',
                amount: String(masraf.amount),
                date: new Date(masraf.date).toISOString().split('T')[0],
                paymentType: masraf.paymentType || 'CASH',
            });
        } else if (open) {
            setFormData({
                ...emptyFormData,
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [masraf, open]);

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        onFormChange(field, value);
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
                        bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                    }}>
                        <Edit sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--foreground)' }}>
                            Masraf Düzenle
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                            Masraf bilgilerini güncelleyin
                        </Typography>
                    </Box>
                </Box>
                <IconButton size="small" onClick={onClose}>
                    <Close fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Masraf Kategorisi</InputLabel>
                            <Select
                                value={formData.categoryId}
                                onChange={(e) => handleChange('categoryId', e.target.value)}
                                label="Masraf Kategorisi"
                            >
                                {kategoriler.map((kat) => (
                                    <MenuItem key={kat.id} value={kat.id}>
                                        {kat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Fiş/Fatura No"
                            value={formData.referenceNo}
                            onChange={(e) => handleChange('referenceNo', e.target.value)}
                            placeholder="Örn: ABC20240001"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Tutar"
                            value={formData.amount}
                            onChange={(e) => handleChange('amount', e.target.value)}
                            inputProps={{ min: 0.01, step: 0.01 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Ödeme Tipi</InputLabel>
                            <Select
                                value={formData.paymentType}
                                onChange={(e) => handleChange('paymentType', e.target.value)}
                                label="Ödeme Tipi"
                            >
                                <MenuItem value="CASH">Nakit</MenuItem>
                                <MenuItem value="CREDIT_CARD">Kredi Kartı</MenuItem>
                                <MenuItem value="BANK_TRANSFER">Havale/EFT</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            type="date"
                            label="Harcama Tarihi"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Açıklama"
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Grid>
                </Grid>
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
                    disabled={loading || !formData.categoryId || !formData.amount}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </DialogActions>
        </Dialog>
    );
});

MasrafEditDialog.displayName = 'MasrafEditDialog';

export default function MasrafDetayPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params as { id: string };
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>(emptyFormData);

    const { data: masraf, isLoading } = useQuery<Masraf>({
        queryKey: ['expense-detail', id],
        queryFn: async () => {
            const response = await axios.get(`/expenses/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    const { data: kategoriler = [] } = useQuery<MasrafKategori[]>({
        queryKey: ['masraf-kategoriler'],
        queryFn: async () => {
            const response = await axios.get('/expenses/categoryler');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const handleFormChange = useCallback((field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleOpenEdit = useCallback(() => {
        if (masraf) {
            setFormData({
                categoryId: masraf.categoryId,
                referenceNo: masraf.referenceNo || '',
                notes: masraf.notes || '',
                amount: String(masraf.amount),
                date: new Date(masraf.date).toISOString().split('T')[0],
                paymentType: masraf.paymentType || 'CASH',
            });
        }
        setEditDialogOpen(true);
    }, [masraf]);

    const handleSubmitEdit = async () => {
        try {
            setActionLoading(true);
            const amountNumber = parseFloat(formData.amount);

            if (!formData.categoryId || !amountNumber || amountNumber <= 0) {
                enqueueSnackbar('Lütfen tüm zorunlu alanları doldurun', { variant: 'error' });
                return;
            }

            await axios.put(`/expenses/${id}`, {
                categoryId: formData.categoryId,
                referenceNo: formData.referenceNo || null,
                notes: formData.notes || null,
                amount: amountNumber,
                date: formData.date,
                paymentType: formData.paymentType || null,
            });

            enqueueSnackbar('Masraf kaydı güncellendi', { variant: 'success' });
            setEditDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['expense-detail', id] });
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'Güncelleme sırasında hata oluştu', { variant: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    if (!masraf) {
        return (
            <MainLayout>
                <Box p={3}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                        sx={{ mb: 2 }}
                    >
                        Geri
                    </Button>
                    <Typography variant="h6" color="error">
                        Masraf kaydı bulunamadı
                    </Typography>
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <StandardPage
                title="Masraf Detayı"
                breadcrumbs={[
                    { label: 'Gider Yönetimi', href: '/expense' },
                    { label: 'Masraf Detay' },
                ]}
                headerActions={
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => router.back()}
                        >
                            Geri
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={handleOpenEdit}
                        >
                            Düzenle
                        </Button>
                    </Stack>
                }
            >
                <Stack spacing={3}>
                    {/* Temel Bilgiler Kartı */}
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    bgcolor: 'color-mix(in srgb, var(--destructive) 10%, transparent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--destructive)',
                                }}>
                                    <CurrencyLira sx={{ fontSize: 22 }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight={800}>
                                        Temel Bilgiler
                                    </Typography>
                                </Box>
                                <Chip
                                    label={masraf.category?.name || 'Kategorisiz'}
                                    color="secondary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography color="text.secondary" variant="body2" fontWeight={600}>
                                        Tarih
                                    </Typography>
                                    <Typography fontWeight={700}>
                                        {formatDate(masraf.date)}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography color="text.secondary" variant="body2" fontWeight={600}>
                                        Tutar
                                    </Typography>
                                    <Typography fontWeight={800} variant="h6" color="error.main">
                                        {formatCurrency(masraf.amount)}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography color="text.secondary" variant="body2" fontWeight={600}>
                                        Ödeme Tipi
                                    </Typography>
                                    <Typography fontWeight={600}>
                                        {masraf.paymentType
                                            ? ODEME_TIPI_LABELS[masraf.paymentType] || masraf.paymentType
                                            : '-'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Typography color="text.secondary" variant="body2" fontWeight={600}>
                                        Fiş/Fatura No
                                    </Typography>
                                    <Typography fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                                        {masraf.referenceNo || '-'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography color="text.secondary" variant="body2" fontWeight={600}>
                                        Açıklama
                                    </Typography>
                                    <Typography fontWeight={500}>
                                        {masraf.notes || '-'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Denetim Bilgileri */}
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <History sx={{ color: 'var(--muted-foreground)', fontSize: 20 }} />
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        Denetim Bilgileri
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            Oluşturan
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {masraf.createdByUser?.fullName ?? masraf.createdByUser?.username ?? 'Sistem'}
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            Oluşturma Tarihi
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {formatDateTime(masraf.createdAt)}
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            Son Güncelleyen
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {masraf.updatedByUser?.fullName ?? masraf.updatedByUser?.username ?? '-'}
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            Son Güncelleme
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {masraf.updatedAt && masraf.updatedAt !== masraf.createdAt
                                                ? formatDateTime(masraf.updatedAt)
                                                : '-'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Card>
                </Stack>
            </StandardPage>

            <MasrafEditDialog
                open={editDialogOpen}
                masraf={masraf}
                kategoriler={kategoriler}
                loading={actionLoading}
                onClose={() => setEditDialogOpen(false)}
                onSubmit={handleSubmitEdit}
                onFormChange={handleFormChange}
            />
        </MainLayout>
    );
}
