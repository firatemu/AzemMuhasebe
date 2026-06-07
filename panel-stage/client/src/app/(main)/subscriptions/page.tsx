'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Chip,
    Alert,
    Stack,
    Paper,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    alpha,
    useTheme,
    LinearProgress,
} from '@mui/material';
import {
    CreditCard,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
    CheckCircle,
    Warning,
    Schedule,
    TrendingUp,
    AccessTime,
    Start as StartIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';
import StandardPage from '@/components/common/StandardPage';
import { StandardCard } from '@/components/common';

interface Subscription {
    id: string;
    tenantId: string;
    planId: string;
    plan?: {
        id: string;
        name: string;
        slug: string;
        description?: string;
        price: number;
        billingType: string;
    };
    status: 'ACTIVE' | 'TRIALING' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
    startDate: string;
    endDate: string;
    trialEndsAt?: string;
    nextBillingDate?: string;
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Plan {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    billingType: string;
    features?: any;
}

export default function SubscriptionsPage() {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const { data: subscription, isLoading } = useQuery<Subscription>({
        queryKey: ['subscription-current'],
        queryFn: async () => {
            const response = await axios.get('/subscriptions/current');
            return response.data;
        },
    });

    const { data: allSubscriptions = [] } = useQuery<Subscription[]>({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const response = await axios.get('/subscriptions');
            return response.data;
        },
    });

    const startTrialMutation = useMutation({
        mutationFn: () => axios.post('/subscriptions/start-trial'),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['subscription-current'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            enqueueSnackbar('Deneme başlatıldı!', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'Deneme başlatılamadı', { variant: 'error' });
        },
    });

    const cancelMutation = useMutation({
        mutationFn: (id: string) => axios.post(`/subscriptions/${id}/cancel`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription-current'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            enqueueSnackbar('Abonelik iptal edildi', { variant: 'success' });
            setCancelDialogOpen(false);
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'İşlem başarısız', { variant: 'error' });
        },
    });

    const reactivateMutation = useMutation({
        mutationFn: (id: string) => axios.post(`/subscriptions/${id}/reactivate`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription-current'] });
            queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
            enqueueSnackbar('Abonelik yeniden aktive edildi', { variant: 'success' });
        },
        onError: (error: any) => {
            enqueueSnackbar(error.response?.data?.message || 'İşlem başarısız', { variant: 'error' });
        },
    });

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { color: string; bgcolor: string; icon: React.ReactNode; label: string }> = {
            ACTIVE: { color: 'success.main', bgcolor: alpha(theme.palette.success.main, 0.1), icon: <CheckCircle sx={{ fontSize: 16 }} />, label: 'Aktif' },
            TRIALING: { color: 'info.main', bgcolor: alpha(theme.palette.info.main, 0.1), icon: <AccessTime sx={{ fontSize: 16 }} />, label: 'Deneme' },
            PENDING: { color: 'warning.main', bgcolor: alpha(theme.palette.warning.main, 0.1), icon: <Schedule sx={{ fontSize: 16 }} />, label: 'Beklemede' },
            CANCELLED: { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1), icon: <CancelIcon sx={{ fontSize: 16 }} />, label: 'İptal Edildi' },
            EXPIRED: { color: 'text.disabled', bgcolor: alpha(theme.palette.action.disabled, 0.1), icon: <Warning sx={{ fontSize: 16 }} />, label: 'Süresi Doldu' },
        };
        return configs[status] || configs.PENDING;
    };

    const getDaysRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const getTrialDaysRemaining = (trialEndsAt: string) => {
        const end = new Date(trialEndsAt);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    if (isLoading) {
        return (
            <StandardPage title="Abonelik Yönetimi">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <CircularProgress size={40} thickness={5} />
                </Box>
            </StandardPage>
        );
    }

    const statusConfig = subscription ? getStatusConfig(subscription.status) : null;
    const daysRemaining = subscription?.endDate ? getDaysRemaining(subscription.endDate) : 0;
    const trialDaysRemaining = subscription?.trialEndsAt ? getTrialDaysRemaining(subscription.trialEndsAt) : 0;

    return (
        <StandardPage
            title="Abonelik Yönetimi"
            breadcrumbs={[
                { label: 'Ayarlar', href: '/settings' },
                { label: 'Abonelik' },
            ]}
            headerActions={
                subscription?.status === 'CANCELLED' ? (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<RefreshIcon />}
                        onClick={() => subscription && reactivateMutation.mutate(subscription.id)}
                        disabled={reactivateMutation.isPending}
                        sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
                    >
                        Yeniden Aktive Et
                    </Button>
                ) : subscription?.status === 'TRIALING' ? (
                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<CreditCard />}
                        sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
                    >
                        Planı Yükselt
                    </Button>
                ) : null
            }
        >
            <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
                    Mevcut abonelik planınızı görüntüleyin, iptal edin veya yeniden aktive edin.
                </Typography>
            </Box>

            {!subscription ? (
                <Paper variant="outlined" sx={{ p: 6, borderRadius: 4, textAlign: 'center', border: '2px dashed', borderColor: 'divider' }}>
                    <CreditCard sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                        Abonelik Bulunamadı
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                        Henüz bir aboneliğiniz yok. Başlamak için deneme sürümünü başlatabilirsiniz.
                    </Typography>
                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<StartIcon />}
                        onClick={() => startTrialMutation.mutate()}
                        disabled={startTrialMutation.isPending}
                        sx={{ fontWeight: 800, borderRadius: 3, px: 4 }}
                    >
                        {startTrialMutation.isPending ? 'Başlatılıyor...' : '14 Gün Ücretsiz Dene'}
                    </Button>
                </Paper>
            ) : (
                <Stack spacing={4}>
                    {/* Current Plan Card */}
                    <StandardCard>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Stack direction="row" spacing={3} alignItems="center">
                                <Box sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
                                    <CreditCard sx={{ fontSize: 32 }} />
                                </Box>
                                <Box>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 900 }}>
                                            {subscription.plan?.name || 'Plan'}
                                        </Typography>
                                        {statusConfig && (
                                            <Chip
                                                icon={statusConfig.icon as React.ReactElement}
                                                label={statusConfig.label}
                                                size="small"
                                                sx={{
                                                    fontWeight: 800,
                                                    borderRadius: 1.5,
                                                    bgcolor: statusConfig.bgcolor,
                                                    color: statusConfig.color,
                                                    '& .MuiChip-icon': { color: 'inherit' },
                                                }}
                                            />
                                        )}
                                    </Stack>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {subscription.plan?.description || 'Aktif plan'}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={1.5}>
                                {subscription.status === 'ACTIVE' && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => setCancelDialogOpen(true)}
                                        sx={{ fontWeight: 700, borderRadius: 3 }}
                                    >
                                        İptal Et
                                    </Button>
                                )}
                                {subscription.status === 'TRIALING' && (
                                    <Button
                                        variant="contained"
                                        color="info"
                                        startIcon={<CreditCard />}
                                        sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
                                    >
                                        Planı Yükselt
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    </StandardCard>

                    {/* Stats Grid */}
                    <Grid container spacing={3}>
                        {subscription.status === 'TRIALING' && trialDaysRemaining > 0 && (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StandardCard>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <AccessTime sx={{ fontSize: 18, color: 'info.main' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                                Deneme Süresi
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'info.main' }}>
                                            {trialDaysRemaining} <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>gün kaldı</Typography>
                                        </Typography>
                                        <LinearProgress variant="determinate" value={(trialDaysRemaining / 14) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.1), '& .MuiLinearProgress-bar': { bgcolor: 'info.main', borderRadius: 3 } }} />
                                    </Stack>
                                </StandardCard>
                            </Grid>
                        )}
                        {subscription.status === 'ACTIVE' && (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StandardCard>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Schedule sx={{ fontSize: 18, color: 'warning.main' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                                Kalan Gün
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h4" sx={{ fontWeight: 900 }}>
                                            {daysRemaining} <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>gün</Typography>
                                        </Typography>
                                        <LinearProgress variant="determinate" value={Math.min(100, (daysRemaining / 365) * 100)} sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.1), '& .MuiLinearProgress-bar': { bgcolor: 'warning.main', borderRadius: 3 } }} />
                                    </Stack>
                                </StandardCard>
                            </Grid>
                        )}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StandardCard>
                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CreditCard sx={{ fontSize: 18, color: 'primary.main' }} />
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                            Fatura Tipi
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'capitalize' }}>
                                        {subscription.plan?.billingType === 'annual' || subscription.plan?.billingType === 'yearly' ? 'Yıllık' : 'Aylık'}
                                    </Typography>
                                </Stack>
                            </StandardCard>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StandardCard>
                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <TrendingUp sx={{ fontSize: 18, color: subscription.autoRenew ? 'success.main' : 'text.disabled' }} />
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                            Otomatik Yenileme
                                        </Typography>
                                    </Stack>
                                    <Chip
                                        label={subscription.autoRenew ? 'Aktif' : 'Pasif'}
                                        size="small"
                                        color={subscription.autoRenew ? 'success' : 'default'}
                                        sx={{ fontWeight: 700, borderRadius: 1.5, alignSelf: 'flex-start' }}
                                    />
                                </Stack>
                            </StandardCard>
                        </Grid>
                        {subscription.nextBillingDate && (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StandardCard>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CreditCard sx={{ fontSize: 18, color: 'primary.main' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                                Sonraki Fatura
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body1" sx={{ fontWeight: 800 }}>
                                            {new Date(subscription.nextBillingDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </Typography>
                                    </Stack>
                                </StandardCard>
                            </Grid>
                        )}
                    </Grid>

                    {/* Billing Period */}
                    <StandardCard>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 3 }}>
                            Fatura Dönemi
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                            Başlangıç
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                            {new Date(subscription.startDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                            Bitiş
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                            {new Date(subscription.endDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </StandardCard>

                    {/* Cancelled state info */}
                    {subscription.status === 'CANCELLED' && (
                        <Alert severity="warning" variant="outlined" sx={{ borderRadius: 3 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                Aboneliğiniz iptal edilmiş.
                            </Typography>
                            <Typography variant="caption">
                                {daysRemaining > 0
                                    ? `${daysRemaining} gün daha erişiminiz var. Yeniden aktive etmek için yukarıdaki butonu kullanın.`
                                    : 'Abonelik süreniz dolmuş.'}
                            </Typography>
                        </Alert>
                    )}
                </Stack>
            )}

            {/* Cancel Dialog */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CancelIcon color="error" /> Aboneliği İptal Et
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ borderRadius: 2, mb: 2 }}>
                        {daysRemaining > 0
                            ? `Aboneliğiniz ${daysRemaining} gün daha aktif kalacak. Bu süre sonunda erişiminiz kısıtlanacak.`
                            : 'Abonelik süreniz dolmak üzere.'}
                    </Alert>
                    <Typography>
                        Aboneliği iptal etmek istediğinizden emin misiniz?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setCancelDialogOpen(false)} sx={{ fontWeight: 700 }}>Vazgeç</Button>
                    <Button
                        onClick={() => subscription && cancelMutation.mutate(subscription.id)}
                        variant="contained"
                        color="error"
                        disabled={cancelMutation.isPending}
                        sx={{ borderRadius: 2, fontWeight: 800 }}
                    >
                        {cancelMutation.isPending ? 'İşleniyor...' : 'İptal Et'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </StandardPage>
    );
}
