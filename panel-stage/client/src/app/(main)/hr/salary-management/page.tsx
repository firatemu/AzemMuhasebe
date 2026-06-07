'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Stack,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Add,
    Visibility,
    Search,
    FilterList,
    Delete,
    FileDownload,
    Receipt,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { StandardPage } from '@/components/common';
import axios from '@/lib/axios';

interface MaasPlan {
    id: string;
    personelId: string;
    personel: {
        id: string;
        ad: string;
        soyad: string;
        personelKodu: string;
    };
    yil: number;
    ay: number;
    maas: number;
    prim: number;
    toplam: number;
    odenenTutar: number;
    kalanTutar: number;
    durum: 'ODENMEDI' | 'KISMI_ODENDI' | 'TAMAMEN_ODENDI';
    aktif: boolean;
    odemeler?: any[];
}

type MaasDurum = 'ODENMEDI' | 'KISMI_ODENDI' | 'TAMAMEN_ODENDI';

function mapSalaryStatus(status?: string): MaasDurum {
    switch (status) {
        case 'FULLY_PAID':
            return 'TAMAMEN_ODENDI';
        case 'PARTIALLY_PAID':
            return 'KISMI_ODENDI';
        default:
            return 'ODENMEDI';
    }
}

function mapSalaryPlan(plan: any): MaasPlan {
    return {
        id: plan.id,
        personelId: plan.employeeId,
        personel: {
            id: plan.employee?.id ?? plan.employeeId,
            ad: plan.employee?.firstName ?? '',
            soyad: plan.employee?.lastName ?? '',
            personelKodu: plan.employee?.employeeCode ?? '',
        },
        yil: plan.year,
        ay: plan.month,
        maas: Number(plan.salary ?? 0),
        prim: Number(plan.bonus ?? 0),
        toplam: Number(plan.total ?? 0),
        odenenTutar: Number(plan.paidAmount ?? 0),
        kalanTutar: Number(plan.remainingAmount ?? 0),
        durum: mapSalaryStatus(plan.status),
        aktif: plan.isActive ?? true,
    };
}

function mapPaymentMethod(odemeTipi: string) {
    return odemeTipi === 'NAKIT' ? 'CASH' : 'BANK_TRANSFER';
}

function buildSalaryPaymentPayload(data: {
    planId?: string;
    personelId?: string;
    tutar: number;
    aciklama?: string;
    odemeDetaylari: Array<{
        odemeTipi: string;
        tutar: number;
        kasaId?: string;
        bankaHesapId?: string;
        referansNo?: string;
        aciklama?: string;
    }>;
}) {
    return {
        salaryPlanId: data.planId,
        employeeId: data.personelId,
        amount: data.tutar,
        notes: data.aciklama,
        paymentDetails: data.odemeDetaylari.map((detay) => ({
            paymentMethod: mapPaymentMethod(detay.odemeTipi),
            amount: Number(detay.tutar),
            cashboxId: detay.kasaId || undefined,
            bankAccountId: detay.bankaHesapId || undefined,
            referenceNo: detay.referansNo || undefined,
            notes: detay.aciklama || undefined,
        })),
    };
}

const PlanDetailDialog = React.memo(({ open, onClose, plan }: { open: boolean, onClose: () => void, plan: MaasPlan | null }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (open && plan) {
            fetchHistory();
        }
    }, [open, plan]);

    const fetchHistory = async () => {
        try {
            const [odemelerRes, avanslarRes] = await Promise.all([
                axios.get(`/salary-payments/plan/${plan?.id}`),
                axios.get(`/advances/employee/${plan?.personelId}`)
            ]);

            const salaryOdemeler = (odemelerRes.data ?? []).map((o: any) => ({
                id: o.id,
                tarih: o.paymentDate ?? o.createdAt,
                tip: 'MAAS_ODEME',
                tutar: Number(o.totalAmount ?? o.amount ?? 0),
                aciklama: o.notes || 'Maaş Ödemesi',
                makbuz: true
            }));

            const filteredAvanslar: any[] = [];
            avanslarRes.data.forEach((avans: any) => {
                // Find reconciliations for this plan
                const mahsuplar = avans.mahsuplasmalar?.filter((m: any) => m.planId === plan?.id) || [];
                mahsuplar.forEach((m: any) => {
                    filteredAvanslar.push({
                        id: m.id,
                        tarih: m.createdAt,
                        tip: 'AVANS_MAHSUP',
                        tutar: m.tutar,
                        aciklama: `Avans Mahsup (${avans.aciklama || 'Avans'})`
                    });
                });

                // Show advances given in this month as well
                const avansDate = new Date(avans.tarih);
                if (avansDate.getFullYear() === plan?.yil && (avansDate.getMonth() + 1) === plan?.ay) {
                    filteredAvanslar.push({
                        id: avans.id,
                        tarih: avans.tarih,
                        tip: 'AVANS_VERILDI',
                        tutar: avans.tutar,
                        aciklama: avans.aciklama || 'Avans Verildi'
                    });
                }
            });

            // Remove duplicated "AVANS_VERILDI" if multiple mahsups exist? No, they are separate events.
            // But we should ensure we don't double count if we were showing a balance.
            // For now, just listing all movements is fine.

            const combined = [...salaryOdemeler, ...filteredAvanslar].sort((a, b) =>
                new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
            );

            setHistory(combined);
        } catch (error) {
            console.error('İşlem geçmişi yüklenemedi');
        }
    };

    const handleDownloadMakbuz = async (odemeId: string) => {
        try {
            const response = await axios.get(`/salary-payments/makbuz/${odemeId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `odeme-makbuzu-${odemeId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            enqueueSnackbar('Makbuz indirilemedi', { variant: 'error' });
        }
    };

    const getTipLabel = (tip: string) => {
        switch (tip) {
            case 'MAAS_ODEME': return 'Maaş Ödemesi';
            case 'AVANS_VERILDI': return 'Avans Verildi';
            case 'AVANS_MAHSUP': return 'Avans Mahsup';
            default: return tip;
        }
    };

    const getTipColor = (tip: string) => {
        switch (tip) {
            case 'MAAS_ODEME': return 'success';
            case 'AVANS_VERILDI': return 'error';
            case 'AVANS_MAHSUP': return 'info';
            default: return 'default';
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle component="div">Maaş & Ödeme Detayları (İşlem Geçmişi)</DialogTitle>
            <DialogContent dividers>
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>{plan?.personel.ad} {plan?.personel.soyad} - {plan?.yil}/{plan?.ay}</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 3 }}>
                            <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                                <Typography variant="caption" color="textSecondary">Maaş + Prim</Typography>
                                <Typography variant="body1" fontWeight="bold">₺{Number(plan?.toplam).toLocaleString()}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 3 }}>
                            <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: '#f0fdf4' }}>
                                <Typography variant="caption" color="textSecondary">Ödenen</Typography>
                                <Typography variant="body1" fontWeight="bold" color="success.main">₺{Number(plan?.odenenTutar).toLocaleString()}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 3 }}>
                            <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: '#fef2f2' }}>
                                <Typography variant="caption" color="textSecondary">Kalan</Typography>
                                <Typography variant="body1" fontWeight="bold" color="error.main">₺{Number(plan?.kalanTutar).toLocaleString()}</Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 3 }}>
                            <Chip
                                label={plan?.durum.replace('_', ' ')}
                                color={plan?.durum === 'TAMAMEN_ODENDI' ? 'success' : plan?.durum === 'KISMI_ODENDI' ? 'warning' : 'error'}
                                sx={{ width: '100%', height: '100%', borderRadius: 1 }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>İşlem Geçmişi</Typography>
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell>Tarih</TableCell>
                                <TableCell>İşlem Türü</TableCell>
                                <TableCell>Açıklama</TableCell>
                                <TableCell align="right">Tutar</TableCell>
                                <TableCell align="right">İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{new Date(item.tarih).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getTipLabel(item.tip)}
                                            size="small"
                                            color={getTipColor(item.tip) as any}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{item.aciklama}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        ₺{Number(item.tutar).toLocaleString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.makbuz && (
                                            <Button
                                                size="small"
                                                variant="text"
                                                startIcon={<Receipt />}
                                                onClick={() => handleDownloadMakbuz(item.id)}
                                            >
                                                Makbuz
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {history.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 2 }}>İşlem kaydı bulunamadı</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Kapat</Button>
            </DialogActions>
        </Dialog>
    );
});

interface MaasOdemeDialogProps {
    open: boolean;
    onClose: () => void;
    plan: MaasPlan | null;
    kasalar: any[];
    bankaHesaplari: any[];
    onSave: (data: any) => void;
}

const MaasOdemeDialog = React.memo(({ open, onClose, plan, kasalar, bankaHesaplari, onSave }: MaasOdemeDialogProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const [tutar, setTutar] = useState<number>(0);
    const [aciklama, setAciklama] = useState('');
    const [odemeDetaylari, setOdemeDetaylari] = useState<any[]>([]);

    // Yeni detay için state
    const [yeniDetay, setYeniDetay] = useState({
        odemeTipi: 'NAKIT',
        tutar: 0,
        kasaId: '',
        bankaHesapId: '',
        referansNo: '',
        aciklama: ''
    });

    useEffect(() => {
        if (open && plan) {
            setTutar(Number(plan.kalanTutar));
            setAciklama(`${plan.yil}/${plan.ay} Maaş Ödemesi`);
            setOdemeDetaylari([]);
            setYeniDetay({
                odemeTipi: 'NAKIT',
                tutar: Number(plan.kalanTutar),
                kasaId: '',
                bankaHesapId: '',
                referansNo: '',
                aciklama: ''
            });
        }
    }, [open, plan]);

    const handleAddDetay = () => {
        if (yeniDetay.tutar <= 0) return enqueueSnackbar('Tutar 0 dan büyük olmalı', { variant: 'warning' });
        if (yeniDetay.odemeTipi === 'NAKIT' && !yeniDetay.kasaId) return enqueueSnackbar('Kasa seçiniz', { variant: 'warning' });
        if (yeniDetay.odemeTipi === 'BANKA_HAVALESI' && !yeniDetay.bankaHesapId) return enqueueSnackbar('Banka hesabı seçiniz', { variant: 'warning' });

        setOdemeDetaylari([...odemeDetaylari, { ...yeniDetay }]);

        // Reset yeni detay
        const kalanDetay = Math.max(0, tutar - ([...odemeDetaylari, yeniDetay].reduce((a: number, b: any) => a + Number(b.tutar), 0)));
        setYeniDetay({
            ...yeniDetay,
            tutar: kalanDetay,
            kasaId: '',
            bankaHesapId: '',
            referansNo: ''
        });
    };

    const handleRemoveDetay = (index: number) => {
        const newDetaylar = [...odemeDetaylari];
        newDetaylar.splice(index, 1);
        setOdemeDetaylari(newDetaylar);
    };

    const handleSubmit = () => {
        if (odemeDetaylari.length === 0) {
            return enqueueSnackbar('Lütfen en az bir ödeme ekleyiniz', { variant: 'warning' });
        }

        const toplamDetay = odemeDetaylari.reduce((a: number, b: any) => a + Number(b.tutar), 0);

        const sanitizedDetaylari = odemeDetaylari.map(detay => ({
            ...detay,
            kasaId: detay.kasaId === '' ? undefined : detay.kasaId,
            bankaHesapId: detay.bankaHesapId === '' ? undefined : detay.bankaHesapId,
            referansNo: detay.referansNo === '' ? undefined : detay.referansNo,
            aciklama: detay.aciklama === '' ? undefined : detay.aciklama,
        }));

        onSave({
            planId: plan?.id,
            personelId: plan?.personelId,
            tutar: toplamDetay,
            aciklama,
            odemeDetaylari: sanitizedDetaylari
        });
    };

    const detayToplam = odemeDetaylari.reduce((a: number, b: any) => a + Number(b.tutar), 0);
    const kalan = tutar - detayToplam;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle component="div">Maaş Ödemesi Yap</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {plan?.personel.ad} {plan?.personel.soyad} - {plan?.yil}/{plan?.ay}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <Chip label={`Kalan Tutar: ₺${Number(plan?.kalanTutar).toLocaleString()}`} color="warning" />
                            <Chip label={`Ödenecek Tutar: ₺${tutar.toLocaleString()}`} color="primary" />
                        </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Ödeme Tutarı"
                            type="number"
                            value={tutar}
                            onChange={(e: any) => setTutar(Number(e.target.value))}
                            autoFocus
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Açıklama"
                            value={aciklama}
                            onChange={(e: any) => setAciklama(e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'var(--muted)' }}>
                            <Typography variant="subtitle2" gutterBottom>Ödeme Kalemi Ekle</Typography>
                            <Grid container spacing={2} alignItems="flex-end">
                                <Grid size={{ xs: 3 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Tür</InputLabel>
                                        <Select
                                            value={yeniDetay.odemeTipi}
                                            label="Tür"
                                            onChange={(e: any) => setYeniDetay({ ...yeniDetay, odemeTipi: e.target.value })}
                                        >
                                            <MenuItem value="NAKIT">Nakit (Kasa)</MenuItem>
                                            <MenuItem value="BANKA_HAVALESI">Banka Havalesi</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    {yeniDetay.odemeTipi === 'NAKIT' ? (
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Kasa</InputLabel>
                                            <Select
                                                value={yeniDetay.kasaId}
                                                label="Kasa"
                                                onChange={(e: any) => setYeniDetay({ ...yeniDetay, kasaId: e.target.value })}
                                            >
                                                {kasalar.map(k => (
                                                    <MenuItem key={k.id} value={k.id}>{k.kasaAdi} (₺{k.bakiye})</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Banka Hesabı</InputLabel>
                                            <Select
                                                value={yeniDetay.bankaHesapId}
                                                label="Banka Hesabı"
                                                onChange={(e: any) => setYeniDetay({ ...yeniDetay, bankaHesapId: e.target.value })}
                                            >
                                                {bankaHesaplari.map(b => (
                                                    <MenuItem key={b.id} value={b.id}>{b.hesapAdi} (₺{b.bakiye})</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </Grid>
                                <Grid size={{ xs: 3 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Tutar"
                                        type="number"
                                        value={yeniDetay.tutar}
                                        onChange={(e: any) => setYeniDetay({ ...yeniDetay, tutar: Number(e.target.value) })}
                                    />
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                    <Button variant="contained" size="small" onClick={handleAddDetay} fullWidth>
                                        Ekle
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tür</TableCell>
                                        <TableCell>Kaynak</TableCell>
                                        <TableCell align="right">Tutar</TableCell>
                                        <TableCell align="right">İşlem</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {odemeDetaylari.map((detay: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{detay.odemeTipi === 'NAKIT' ? 'Nakit' : 'Havale'}</TableCell>
                                            <TableCell>
                                                {detay.odemeTipi === 'NAKIT'
                                                    ? kasalar.find(k => k.id === detay.kasaId)?.kasaAdi
                                                    : bankaHesaplari.find(b => b.id === detay.bankaHesapId)?.hesapAdi}
                                            </TableCell>
                                            <TableCell align="right">₺{Number(detay.tutar).toLocaleString()}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => handleRemoveDetay(index)} color="error">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>Toplam:</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>₺{Number(detayToplam).toLocaleString()}</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>İptal</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={odemeDetaylari.length === 0}
                >
                    Ödemeyi Tamamla
                </Button>
            </DialogActions>
        </Dialog>
    );
});

interface CreatePlanDialogProps {
    open: boolean;
    onClose: () => void;
    personelList: { id: string; ad: string; soyad: string; personelKodu: string }[];
    onSave: (personelId: string, yil: number) => void;
}

const CreatePlanDialog = React.memo(({ open, onClose, personelList, onSave }: CreatePlanDialogProps) => {
    const [selectedPersonelId, setSelectedPersonelId] = useState<string>('');
    const [targetYil, setTargetYil] = useState<number>(new Date().getFullYear());

    const handleSave = () => {
        if (selectedPersonelId && targetYil) {
            onSave(selectedPersonelId, targetYil);
            setSelectedPersonelId('');
            setTargetYil(new Date().getFullYear());
        }
    };

    useEffect(() => {
        if (open) {
            setSelectedPersonelId('');
            setTargetYil(new Date().getFullYear());
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle component="div">Yeni Maaş Planı Oluştur</DialogTitle>
            <DialogContent dividers>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="personel-select-label">Personel</InputLabel>
                    <Select
                        labelId="personel-select-label"
                        value={selectedPersonelId}
                        label="Personel"
                        onChange={(e: any) => setSelectedPersonelId(e.target.value as string)}
                        autoFocus
                    >
                        {personelList.map((personel) => (
                            <MenuItem key={personel.id} value={personel.id}>
                                {personel.ad} {personel.soyad} ({personel.personelKodu})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="yil-select-label">Yıl</InputLabel>
                    <Select
                        labelId="yil-select-label"
                        value={targetYil}
                        label="Yıl"
                        onChange={(e: any) => setTargetYil(Number(e.target.value))}
                    >
                        {[2023, 2024, 2025, 2026, 2027].map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>İptal</Button>
                <Button onClick={handleSave} variant="contained" disabled={!selectedPersonelId}>Oluştur</Button>
            </DialogActions>
        </Dialog>
    );
});

export default function MaasYonetimiPage() {
    const { enqueueSnackbar } = useSnackbar();
    const [plans, setPlans] = useState<MaasPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [yil, setYil] = useState(new Date().getFullYear());
    const [ay, setAy] = useState(new Date().getMonth() + 1);

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [personelList, setPersonelList] = useState<any[]>([]);

    const [kasalar, setKasalar] = useState<any[]>([]);
    const [bankaHesaplari, setBankaHesaplari] = useState<any[]>([]);
    const [openOdemeDialog, setOpenOdemeDialog] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<MaasPlan | null>(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);

    useEffect(() => {
        fetchPlans();
        fetchPersonelList();
        fetchFinansData();
    }, [yil, ay]);

    const fetchFinansData = async () => {
        try {
            const [kasaRes, bankaRes] = await Promise.all([
                axios.get('/cashbox?aktif=true'),
                axios.get('/bank-accounts?isActive=true')
            ]);
            setKasalar(kasaRes.data);
            setBankaHesaplari(bankaRes.data);
        } catch (error) {
            console.error('Finans verileri yüklenemedi:', error);
        }
    };

    const handleOpenOdeme = (plan: MaasPlan) => {
        setSelectedPlan(plan);
        setOpenOdemeDialog(true);
    };

    const handleOpenDetail = (plan: MaasPlan) => {
        setSelectedPlan(plan);
        setOpenDetailDialog(true);
    };

    const handleExportExcel = async () => {
        try {
            const response = await axios.get(`/salary-payments/export/excel/${yil}/${ay}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `maas-listesi-${yil}-${ay}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            enqueueSnackbar('Excel raporu oluşturulamadı', { variant: 'error' });
        }
    };

    const handleOdemeYap = async (data: any) => {
        try {
            await axios.post('/salary-payments/create', buildSalaryPaymentPayload(data));
            setOpenOdemeDialog(false);
            fetchPlans();
            enqueueSnackbar('Ödeme başarıyla gerçekleşti', { variant: 'success' });
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'Ödeme yapılırken hata oluştu', { variant: 'error' });
        }
    };

    const fetchPlans = async () => {
        try {
            setLoading(true);
            // Backend'den ödenecek maaşları çekelim (salary-plans API)
            const response = await axios.get(`/salary-plans/odenecek/${yil}/${ay}`);
            setPlans((response.data?.planlar ?? []).map(mapSalaryPlan));
        } catch (error) {
            console.error('Planlar yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPersonelList = async () => {
        try {
            const response = await axios.get('/employees?isActive=true');
            const employees = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
            setPersonelList(employees.map((employee: any) => ({
                id: employee.id,
                ad: employee.firstName ?? employee.ad ?? '',
                soyad: employee.lastName ?? employee.soyad ?? '',
                personelKodu: employee.employeeCode ?? employee.personelKodu ?? '',
            })));
        } catch (error) {
            console.error('Personel listesi yüklenemedi:', error);
        }
    };

    const handleCreatePlan = async (personelId: string, targetYil: number) => {
        try {
            await axios.post('/salary-plans/create', {
                employeeId: personelId,
                year: targetYil,
            });
            fetchPlans();
            setOpenCreateDialog(false);
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'Plan oluşturulurken hata oluştu', { variant: 'error' });
        }
    };

    return (
        <StandardPage maxWidth={false}>
            <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">Maaş Yönetimi</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenCreateDialog(true)}
                    >
                        Yeni Plan Oluştur
                    </Button>
                </Stack>

                <CreatePlanDialog
                    open={openCreateDialog}
                    onClose={() => setOpenCreateDialog(false)}
                    personelList={personelList}
                    onSave={handleCreatePlan}
                />

                <MaasOdemeDialog
                    open={openOdemeDialog}
                    onClose={() => setOpenOdemeDialog(false)}
                    plan={selectedPlan}
                    kasalar={kasalar}
                    bankaHesaplari={bankaHesaplari}
                    onSave={handleOdemeYap}
                />

                <PlanDetailDialog
                    open={openDetailDialog}
                    onClose={() => setOpenDetailDialog(false)}
                    plan={selectedPlan}
                />

                {/* Filtreler */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Yıl</InputLabel>
                                <Select
                                    value={yil}
                                    label="Yıl"
                                    onChange={(e: any) => setYil(Number(e.target.value))}
                                >
                                    {[2024, 2025, 2026, 2027].map((y) => (
                                        <MenuItem key={y} value={y}>{y}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Ay</InputLabel>
                                <Select
                                    value={ay}
                                    label="Ay"
                                    onChange={(e: any) => setAy(Number(e.target.value))}
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                        <MenuItem key={m} value={m}>{m}. Ay</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        <Button
                            variant="outlined"
                            startIcon={<FileDownload />}
                            onClick={handleExportExcel}
                        >
                            Excel'e Aktar
                        </Button>
                    </Stack>
                </Paper>

                {/* Tablo */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Personel</TableCell>
                                <TableCell>Dönem</TableCell>
                                <TableCell align="right">Maaş</TableCell>
                                <TableCell align="right">Prim</TableCell>
                                <TableCell align="right">Toplam</TableCell>
                                <TableCell align="right">Ödenen</TableCell>
                                <TableCell align="right">Kalan</TableCell>
                                <TableCell>Durum</TableCell>
                                <TableCell align="right">İşlemler</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plans.map((plan: MaasPlan) => (
                                <TableRow key={plan.id}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {plan.personel.ad} {plan.personel.soyad}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {plan.personel.personelKodu}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{plan.yil} / {plan.ay}</TableCell>
                                    <TableCell align="right">₺{Number(plan.maas).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right">₺{Number(plan.prim).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right">₺{Number(plan.toplam).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                        ₺{Number(plan.odenenTutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                        ₺{Number(plan.kalanTutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={plan.durum.replace('_', ' ')}
                                            color={
                                                plan.durum === 'TAMAMEN_ODENDI' ? 'success' :
                                                    plan.durum === 'KISMI_ODENDI' ? 'warning' : 'error'
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {plan.kalanTutar > 0 && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="success"
                                                onClick={() => handleOpenOdeme(plan)}
                                                sx={{ mr: 1 }}
                                            >
                                                Ödeme Yap
                                            </Button>
                                        )}
                                        <Tooltip title="Detay">
                                            <IconButton size="small" onClick={() => handleOpenDetail(plan)}>
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {plans.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                        Veri bulunamadı
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </StandardPage>
    );
}
