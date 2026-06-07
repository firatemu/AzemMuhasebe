'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import {
    ArrowBack,
    CheckCircle,
    LocalShipping,
    Cancel as CancelIcon,
    Print as PrintIcon,
    SwapHoriz,
    Inventory,
    Person,
    History,
    Description,
} from '@mui/icons-material';
import { StandardPage, StandardCard } from '@/components/common';
import WarehouseTransferPrintForm from '@/components/PrintForm/WarehouseTransferPrintForm';
import axios from '@/lib/axios';
import { useSnackbar } from 'notistack';
import Grid from '@mui/material/Grid';

interface WarehouseTransferItem {
    id: string;
    stokId: string;
    stok: {
        stokKodu: string;
        stokAdi: string;
        birim: string;
    };
    miktar: number;
    fromLocation?: {
        code: string;
        name: string;
    };
    toLocation?: {
        code: string;
        name: string;
    };
}

interface WarehouseTransfer {
    id: string;
    transferNo: string;
    tarih: string;
    durum: 'HAZIRLANIYOR' | 'YOLDA' | 'TAMAMLANDI' | 'IPTAL';
    fromWarehouse: {
        id: string;
        name: string;
    };
    toWarehouse: {
        id: string;
        name: string;
    };
    driverName?: string;
    vehiclePlate?: string;
    aciklama?: string;
    kalemler: WarehouseTransferItem[];
    hazirlayanUser?: { fullName: string };
    onaylayanUser?: { fullName: string };
    teslimAlanUser?: { fullName: string };
    createdAt: string;
    logs: Array<{
        id: string;
        actionType: string;
        changes: string;
        createdAt: string;
        user: { fullName: string } | null;
    }>;
}

const statusConfig: Record<string, { label: string; color: any; icon: any }> = {
    HAZIRLANIYOR: { label: 'Hazırlanıyor', color: 'warning', icon: <Description sx={{ fontSize: 16 }} /> },
    YOLDA: { label: 'Yolda', color: 'info', icon: <LocalShipping sx={{ fontSize: 16 }} /> },
    TAMAMLANDI: { label: 'Tamamlandı', color: 'success', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
    IPTAL: { label: 'İptal', color: 'error', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
};

export default function WarehouseTransferDetayPage() {
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [transfer, setTransfer] = useState<WarehouseTransfer | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [printOpen, setPrintOpen] = useState(false);

    useEffect(() => {
        fetchTransfer();
    }, [id]);

    const fetchTransfer = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/warehouse-transfer/${id}`);
            setTransfer(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Transfer yüklenirken hata:', err);
            setError(err.response?.data?.message || 'Transfer yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: 'approve' | 'complete' | 'cancel') => {
        try {
            setActionLoading(true);
            if (action === 'cancel') {
                await axios.put(`/warehouse-transfer/${id}/cancel`, { reason: cancelReason });
                setCancelDialogOpen(false);
            } else {
                await axios.put(`/warehouse-transfer/${id}/${action}`);
            }
            await fetchTransfer();
        } catch (err: any) {
            enqueueSnackbar(err.response?.data?.message || 'İşlem başarısız', { variant: 'error' });
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR');
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('tr-TR');
    };

    if (loading) {
        return (
            <StandardPage>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                    <CircularProgress />
                </Box>
            </StandardPage>
        );
    }

    if (error || !transfer) {
        return (
            <StandardPage>
                <Box sx={{ p: 3 }}>
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error || 'Transfer bulunamadı'}</Alert>
                    <Button startIcon={<ArrowBack />} onClick={() => router.back()} variant="outlined" sx={{ borderRadius: 2 }}>Geri Dön</Button>
                </Box>
            </StandardPage>
        );
    }

    const config = statusConfig[transfer.durum] || { label: transfer.durum, color: 'default', icon: null };

    return (
        <StandardPage>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Geri
                    </Button>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                            <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.02em' }}>
                                Transfer Detayı
                            </Typography>
                            <Chip
                                icon={config.icon}
                                label={config.label}
                                color={config.color as any}
                                size="small"
                                variant="tonal"
                                sx={{ fontWeight: 700, borderRadius: 1.5 }}
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            {transfer.transferNo}
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                    {transfer.durum === 'HAZIRLANIYOR' && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleAction('approve')}
                            disabled={actionLoading}
                            sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                            Onayla & Sevk Et
                        </Button>
                    )}
                    {transfer.durum === 'YOLDA' && (
                        <Button
                            variant="contained"
                            color="info"
                            startIcon={<LocalShipping />}
                            onClick={() => handleAction('complete')}
                            disabled={actionLoading}
                            sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                            Transferi Tamamla
                        </Button>
                    )}
                    {(transfer.durum === 'HAZIRLANIYOR' || transfer.durum === 'YOLDA') && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => setCancelDialogOpen(true)}
                            disabled={actionLoading}
                            sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                            İptal Et
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={() => setPrintOpen(true)}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        Yazdır
                    </Button>
                </Stack>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StandardCard sx={{ height: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <Inventory sx={{ fontSize: 18 }} /> Genel Bilgiler
                        </Typography>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Transfer Tarihi</Typography>
                                <Typography variant="body2" fontWeight="700">
                                    {formatDate(transfer.tarih)}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Güzergah</Typography>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'action.hover', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="body2" fontWeight="700">{transfer.fromWarehouse.name}</Typography>
                                    </Box>
                                    <SwapHoriz color="disabled" />
                                    <Box sx={{ px: 1.5, py: 0.5, bgcolor: 'primary.lighter', borderRadius: 1.5, border: '1px solid', borderColor: 'primary.light' }}>
                                        <Typography variant="body2" fontWeight="700" color="primary.main">{transfer.toWarehouse.name}</Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <Divider sx={{ borderStyle: 'dashed' }} />

                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Lojistik</Typography>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalShipping sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            {transfer.driverName || '-'}
                                            {transfer.vehiclePlate && <Chip label={transfer.vehiclePlate} size="small" sx={{ ml: 1, height: 20, fontSize: '0.65rem', fontWeight: 700 }} />}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Açıklama</Typography>
                                <Typography variant="body2" sx={{ fontStyle: transfer.aciklama ? 'normal' : 'italic', color: transfer.aciklama ? 'text.primary' : 'text.disabled' }}>
                                    {transfer.aciklama || 'Açıklama belirtilmemiş'}
                                </Typography>
                            </Box>
                        </Stack>
                    </StandardCard>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <StandardCard sx={{ height: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <Person sx={{ fontSize: 18 }} /> Yetkili Bilgileri
                        </Typography>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Hazırlayan</Typography>
                                <Typography variant="body2" fontWeight="600">{transfer.hazirlayanUser?.fullName || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Onaylayan</Typography>
                                <Typography variant="body2" fontWeight="600">{transfer.onaylayanUser?.fullName || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Teslim Alan</Typography>
                                <Typography variant="body2" fontWeight="600">{transfer.teslimAlanUser?.fullName || '-'}</Typography>
                            </Box>
                        </Stack>
                    </StandardCard>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <StandardCard sx={{ height: '100%' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                            <History sx={{ fontSize: 18 }} /> İşlem Geçmişi
                        </Typography>
                        <Stack spacing={0}>
                            {transfer.logs.map((log: any, index: number) => (
                                <Box key={log.id} sx={{
                                    position: 'relative',
                                    pb: 1.5,
                                    pl: 2.5,
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: 0,
                                        top: 8,
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: index === 0 ? 'primary.main' : 'divider'
                                    },
                                    '&:after': {
                                        content: index === transfer.logs.length - 1 ? 'none' : '""',
                                        position: 'absolute',
                                        left: 3.5,
                                        top: 16,
                                        width: 1,
                                        height: 'calc(100% - 8px)',
                                        bgcolor: 'divider'
                                    }
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="caption" fontWeight={700} color={index === 0 ? 'primary.main' : 'text.primary'}>
                                            {log.actionType === 'CREATE' ? 'Kayıt Oluşturuldu' : log.actionType === 'UPDATE' ? 'Güncellendi' : log.actionType}
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            {formatDateTime(log.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        İşlemi Yapan: <strong>{log.user?.fullName || 'Sistem'}</strong>
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </StandardCard>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <StandardCard padding={0}>
                        <Box sx={{ p: 2.5 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <SwapHoriz sx={{ fontSize: 18 }} /> Transfer Kalemleri
                            </Typography>
                        </Box>
                        <Divider />
                        <TableContainer>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Stok Kodu</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Malzeme Adı</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Marka</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Çıkış Rafı</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Giriş Rafı</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Miktar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transfer.kalemler.map((item: WarehouseTransferItem) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{item.stok?.stokKodu || '-'}</TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{item.stok?.stokAdi || '-'}</TableCell>
                                            <TableCell>{(item.stok as any).marka || '-'}</TableCell>
                                            <TableCell>
                                                {item.fromLocation?.code ? (
                                                    <Chip label={item.fromLocation.code} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {item.toLocation?.code ? (
                                                    <Chip label={item.toLocation.code} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 800 }}>
                                                {item.miktar} {item.stok?.birim || ''}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </StandardCard>
                </Grid>
            </Grid>

            {/* İptal Dialog */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Transfer İptali</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>Bu transferi iptal etmek istediğinizden emin misiniz? Bu işlem stok hareketlerini geri alacaktır.</Typography>
                    <TextField
                        fullWidth
                        label="İptal Nedeni"
                        multiline
                        rows={3}
                        value={cancelReason}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCancelReason(e.target.value)}
                        placeholder="İptal sebebini buraya yazınız..."
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setCancelDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>Vazgeç</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleAction('cancel')}
                        disabled={!cancelReason || actionLoading}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        İptal Et
                    </Button>
                </DialogActions>
            </Dialog>

            <WarehouseTransferPrintForm
                open={printOpen}
                transfer={transfer}
                onClose={() => setPrintOpen(false)}
            />
        </StandardPage>
    );
}

