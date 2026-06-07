'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar,
    CircularProgress,
    Autocomplete,
    AutocompleteRenderInputParams,
    Stack,
    Tooltip,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    ArrowBack,
    AccountBalance,
    CreditCard,
    Visibility,
    Payments,
    History,
    AccountBalanceWallet,
} from '@mui/icons-material';
import MainLayout from '@/components/Layout/MainLayout';
import axios from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { turkiyeBankalari, kartTipleri } from '@/lib/banks';
import { CashboxMovementsClient } from './CashboxMovementsClient';
import { BankaHesabiHareketleri } from './BankAccountMovementsClient';

interface BankAccount {
    id: string;
    code: string;
    name: string;
    bankName: string;
    branchCode?: string;
    branchName?: string;
    accountNo?: string;
    iban?: string;
    type: 'VADESIZ' | 'POS';
    balance: number;
    isActive: boolean;
}

interface CompanyCreditCard {
    id: string;
    code: string;
    name: string;
    bankName: string;
    cardType?: string;
    lastFourDigits?: string;
    limit?: number;
    balance: number;
    cutoffDate?: string;
    dueDate?: string;
    isActive: boolean;
}

interface Kasa {
    id: string;
    code: string;
    name: string;
    type: 'CASH' | 'BANK' | 'COMPANY_CREDIT_CARD';
    balance: number;
    isActive: boolean;
    bankAccounts?: BankAccount[];
    companyCreditCards?: CompanyCreditCard[];
}

type DetailItem = BankAccount | CompanyCreditCard;

export default function CashboxDetailClient() {
    const params = useParams();
    const router = useRouter();
    const kasaId = params.id as string;

    const [kasa, setKasa] = useState<Kasa | null>(null);
    const [loading, setLoading] = useState(true);

    // Dialog States
    const [openBankDialog, setOpenBankDialog] = useState(false);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openHareketlerDialog, setOpenHareketlerDialog] = useState(false);

    const [selectedBankaHesabi, setSelectedBankaHesabi] = useState<BankAccount | null>(null);
    const [editingItem, setEditingItem] = useState<DetailItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<DetailItem | null>(null);
    const [deleteType, setDeleteType] = useState<'BANK' | 'CARD'>('BANK');

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({ open: false, message: '', severity: 'success' });

    // Bank Account Form
    const [bankaHesapForm, setBankaHesapForm] = useState({
        code: '',
        name: '',
        bankName: '',
        branchCode: '',
        branchName: '',
        accountNo: '',
        iban: '',
        type: 'VADESIZ' as 'VADESIZ' | 'POS',
        isActive: true,
    });

    // Credit Card Form
    const [firmaKartForm, setFirmaKartForm] = useState({
        code: '',
        name: '',
        bankName: '',
        cardType: '',
        lastFourDigits: '',
        limit: 0,
        cutoffDate: '',
        dueDate: '',
        isActive: true,
    });

    useEffect(() => {
        fetchKasa();
    }, [kasaId]);

    const fetchKasa = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/cashbox/${kasaId}`);
            setKasa(response.data);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Kasa yüklenemedi';
            setSnackbar({ open: true, message, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
        setSnackbar({ open: true, message, severity });
    };

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(value);
    };

    // Handlers for Bank Account
    const handleOpenBankDialog = (hesap?: BankAccount) => {
        if (hesap) {
            setEditingItem(hesap);
            setBankaHesapForm({
                code: hesap.code || '',
                name: hesap.name || '',
                bankName: hesap.bankName || '',
                branchCode: hesap.branchCode || '',
                branchName: hesap.branchName || '',
                accountNo: hesap.accountNo || '',
                iban: hesap.iban || '',
                type: hesap.type,
                isActive: hesap.isActive,
            });
        } else {
            setEditingItem(null);
            setBankaHesapForm({
                code: '',
                name: '',
                bankName: '',
                branchCode: '',
                branchName: '',
                accountNo: '',
                iban: '',
                type: 'VADESIZ',
                isActive: true,
            });
        }
        setOpenBankDialog(true);
    };

    const handleSaveBank = async () => {
        try {
            if (editingItem) {
                await axios.put(`/bank-accounts/${editingItem.id}`, bankaHesapForm);
                showSnackbar('Banka hesabı güncellendi', 'success');
            } else {
                await axios.post('/bank-accounts', { ...bankaHesapForm, cashboxId: kasaId });
                showSnackbar('Banka hesabı eklendi', 'success');
            }
            setOpenBankDialog(false);
            fetchKasa();
        } catch (error: any) {
            showSnackbar(error.response?.data?.message || 'İşlem başarısız', 'error');
        }
    };

    // Handlers for Credit Card
    const handleOpenCardDialog = (kart?: CompanyCreditCard) => {
        if (kart) {
            setEditingItem(kart);
            setFirmaKartForm({
                code: kart.code || '',
                name: kart.name || '',
                bankName: kart.bankName || '',
                cardType: kart.cardType || '',
                lastFourDigits: kart.lastFourDigits || '',
                limit: kart.limit || 0,
                cutoffDate: kart.cutoffDate ? new Date(kart.cutoffDate).toISOString().split('T')[0] : '',
                dueDate: kart.dueDate ? new Date(kart.dueDate).toISOString().split('T')[0] : '',
                isActive: kart.isActive,
            });
        } else {
            setEditingItem(null);
            setFirmaKartForm({
                code: '',
                name: '',
                bankName: '',
                cardType: '',
                lastFourDigits: '',
                limit: 0,
                cutoffDate: '',
                dueDate: '',
                isActive: true,
            });
        }
        setOpenCardDialog(true);
    };

    const handleSaveCard = async () => {
        try {
            if (editingItem) {
                await axios.put(`/company-credit-cards/${editingItem.id}`, firmaKartForm);
                showSnackbar('Firma kredi kartı güncellendi', 'success');
            } else {
                await axios.post('/company-credit-cards', { ...firmaKartForm, cashboxId: kasaId });
                showSnackbar('Firma kredi kartı eklendi', 'success');
            }
            setOpenCardDialog(false);
            fetchKasa();
        } catch (error: any) {
            showSnackbar(error.response?.data?.message || 'İşlem başarısız', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const endpoint = deleteType === 'BANK' ? `/bank-accounts/${deleteTarget.id}` : `/company-credit-cards/${deleteTarget.id}`;
            await axios.delete(endpoint);
            showSnackbar('Kayıt silindi', 'success');
            setOpenDeleteDialog(false);
            setDeleteTarget(null);
            fetchKasa();
        } catch (error: any) {
            showSnackbar(error.response?.data?.message || 'Silme başarısız', 'error');
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    if (!kasa) {
        return (
            <MainLayout>
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">Kasa bulunamadı</Alert>
                    <Button startIcon={<ArrowBack />} onClick={() => router.push('/cash')} sx={{ mt: 2 }}>
                        Kasalara Dön
                    </Button>
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <IconButton onClick={() => router.push('/cash')} size="small" sx={{ bgcolor: 'var(--muted)', '&:hover': { bgcolor: 'var(--border)' } }}>
                            <ArrowBack fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary">Kasa ve Bankalar / Detay</Typography>
                    </Stack>

                    <Grid container spacing={3} alignItems="flex-start">
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                                    color: 'var(--primary)',
                                    display: 'flex'
                                }}>
                                    {kasa.type === 'CASH' ? <AccountBalanceWallet fontSize="large" /> :
                                        kasa.type === 'BANK' ? <AccountBalance fontSize="large" /> :
                                            <CreditCard fontSize="large" />}
                                </Box>
                                <Box>
                                    <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-0.02em' }}>
                                        {kasa.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="body1" color="text.secondary" fontWeight="500">
                                            {kasa.code}
                                        </Typography>
                                        <Chip
                                            label={kasa.type === 'CASH' ? 'Nakit Kasa' : kasa.type === 'BANK' ? 'Banka Kasası' : 'Kredi Kartı Kasası'}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                                        />
                                    </Stack>
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Card sx={{
                                borderRadius: 4,
                                bgcolor: 'var(--card)',
                                border: '1px solid var(--border)',
                                boxShadow: '0 4px 20px color-mix(in srgb, var(--primary) 5%, transparent)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <Box sx={{
                                    position: 'absolute',
                                    right: -20,
                                    top: -20,
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    bgcolor: 'color-mix(in srgb, var(--success) 5%, transparent)',
                                    zIndex: 0
                                }} />
                                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.1em' }}>
                                        TOPLAM BAKİYE
                                    </Typography>
                                    <Typography variant="h3" fontWeight="900" color={kasa.balance >= 0 ? 'var(--success)' : 'var(--destructive)'} sx={{ mt: 0.5 }}>
                                        {formatMoney(kasa.balance)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                <Grid container spacing={3}>
                    {/* Left Column: Bank Accounts or Credit Cards */}
                    {(kasa.type === 'BANK' || kasa.type === 'COMPANY_CREDIT_CARD') && (
                        <Grid size={{ xs: 12 }}>
                            <Card sx={{ borderRadius: 4, border: '1px solid var(--border)', boxShadow: 'none' }}>
                                <Box sx={{ p: 3, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {kasa.type === 'BANK' ? <AccountBalance color="primary" /> : <CreditCard color="error" />}
                                        <Typography variant="h6" fontWeight="700">
                                            {kasa.type === 'BANK' ? 'Banka Hesapları' : 'Firma Kredi Kartları'}
                                        </Typography>
                                    </Stack>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => kasa.type === 'BANK' ? handleOpenBankDialog() : handleOpenCardDialog()}
                                        sx={{ borderRadius: 2, px: 3 }}
                                    >
                                        Yeni Ekle
                                    </Button>
                                </Box>
                                <CardContent sx={{ p: 0 }}>
                                    <Box sx={{ overflowX: 'auto' }}>
                                        {kasa.type === 'BANK' && (
                                            <Grid container component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <Box component="thead" sx={{ bgcolor: 'var(--muted)' }}>
                                                    <Box component="tr">
                                                        <Typography component="th" sx={{ p: 2, textAlign: 'left', fontWeight: 600 }}>Hesap</Typography>
                                                        <Typography component="th" sx={{ p: 2, textAlign: 'left', fontWeight: 600 }}>Tür / Bilgi</Typography>
                                                        <Typography component="th" sx={{ p: 2, textAlign: 'right', fontWeight: 600 }}>Bakiye</Typography>
                                                        <Typography component="th" sx={{ p: 2, textAlign: 'center', fontWeight: 600 }}>İşlemler</Typography>
                                                    </Box>
                                                </Box>
                                                <Box component="tbody">
                                                    {(!kasa.bankAccounts || kasa.bankAccounts.length === 0) && (
                                                        <Box component="tr">
                                                            <Box component="td" colSpan={4} sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                                                                Kayıtlı banka hesabı bulunamadı.
                                                            </Box>
                                                        </Box>
                                                    )}
                                                    {kasa.bankAccounts?.map((hesap: BankAccount) => (
                                                        <Box component="tr" key={hesap.id} sx={{ borderBottom: '1px solid var(--border)', '&:hover': { bgcolor: 'var(--muted)' } }}>
                                                            <Box component="td" sx={{ p: 2 }}>
                                                                <Typography fontWeight="600">{hesap.name || hesap.code}</Typography>
                                                                <Typography variant="caption" color="text.secondary">{hesap.bankName} - {hesap.branchName || 'Merkez'}</Typography>
                                                            </Box>
                                                            <Box component="td" sx={{ p: 2 }}>
                                                                <Chip label={hesap.type} size="small" color={hesap.type === 'POS' ? 'warning' : 'info'} sx={{ fontWeight: 700, mb: 0.5 }} />
                                                                <Typography variant="caption" display="block" color="text.secondary">{hesap.iban || hesap.accountNo || '-'}</Typography>
                                                            </Box>
                                                            <Box component="td" sx={{ p: 2, textAlign: 'right' }}>
                                                                <Typography fontWeight="700" color={hesap.balance >= 0 ? 'var(--success)' : 'var(--destructive)'}>
                                                                    {formatMoney(hesap.balance)}
                                                                </Typography>
                                                            </Box>
                                                            <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                                                                <Stack direction="row" spacing={0.5} justifyContent="center">
                                                                    <Tooltip title="Hareketler">
                                                                        <IconButton size="small" color="info" onClick={() => { setSelectedBankaHesabi(hesap); setOpenHareketlerDialog(true); }}>
                                                                            <History fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Düzenle">
                                                                        <IconButton size="small" color="warning" onClick={() => handleOpenBankDialog(hesap)}>
                                                                            <Edit fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Sil">
                                                                        <IconButton size="small" color="error" onClick={() => { setDeleteTarget(hesap); setDeleteType('BANK'); setOpenDeleteDialog(true); }}>
                                                                            <Delete fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Stack>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Grid>
                                        )}

                                        {kasa.type === 'COMPANY_CREDIT_CARD' && (
                                            <Grid container component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <Box component="thead" sx={{ bgcolor: 'var(--muted)' }}>
                                                    <Box component="tr">
                                                        <Typography component="th" sx={{ p: 2, textAlign: 'left', fontWeight: 600 }}>Kart</Typography>
                                                        <Typography component="th" sx={{ p: 2, textAlign: 'left', fontWeight: 600 }}>Limit / Kullanım</Typography>
                                                        <Typography component="th" sx={{ p: 2, textAlign: 'right', fontWeight: 600 }}>Kalan</Typography>
                                                        <Typography component="th" sx={{ p: 2, textAlign: 'center', fontWeight: 600 }}>İşlemler</Typography>
                                                    </Box>
                                                </Box>
                                                <Box component="tbody">
                                                    {(!kasa.companyCreditCards || kasa.companyCreditCards.length === 0) && (
                                                        <Box component="tr">
                                                            <Box component="td" colSpan={4} sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                                                                Kayıtlı firma kredi kartı bulunamadı.
                                                            </Box>
                                                        </Box>
                                                    )}
                                                    {kasa.companyCreditCards?.map((kart: CompanyCreditCard) => (
                                                        <Box component="tr" key={kart.id} sx={{ borderBottom: '1px solid var(--border)', '&:hover': { bgcolor: 'var(--muted)' } }}>
                                                            <Box component="td" sx={{ p: 2 }}>
                                                                <Typography fontWeight="600">{kart.name}</Typography>
                                                                <Typography variant="caption" color="text.secondary">{kart.bankName} - ****{kart.lastFourDigits}</Typography>
                                                            </Box>
                                                            <Box component="td" sx={{ p: 2 }}>
                                                                <Typography variant="caption" color="text.secondary">Limit: {formatMoney(kart.limit || 0)}</Typography>
                                                                <Typography variant="body2" fontWeight="600" color="var(--destructive)">Harcanan: {formatMoney(kart.balance)}</Typography>
                                                            </Box>
                                                            <Box component="td" sx={{ p: 2, textAlign: 'right' }}>
                                                                <Typography fontWeight="700" color="var(--success)">
                                                                    {formatMoney((kart.limit || 0) - kart.balance)}
                                                                </Typography>
                                                            </Box>
                                                            <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                                                                <Stack direction="row" spacing={0.5} justifyContent="center">
                                                                    <Tooltip title="Düzenle">
                                                                        <IconButton size="small" color="warning" onClick={() => handleOpenCardDialog(kart)}>
                                                                            <Edit fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Sil">
                                                                        <IconButton size="small" color="error" onClick={() => { setDeleteTarget(kart); setDeleteType('CARD'); setOpenDeleteDialog(true); }}>
                                                                            <Delete fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Stack>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Grid>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {/* Movements Section */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ mt: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <History color="action" />
                                <Typography variant="h6" fontWeight="700">İşlem Geçmişi</Typography>
                            </Stack>
                            <CashboxMovementsClient kasaId={kasaId} kasaType={kasa.type} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* DIALOGS */}

            {/* Bank Account Dialog */}
            <Dialog open={openBankDialog} onClose={() => setOpenBankDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editingItem ? 'Banka Hesabı Düzenle' : 'Yeni Banka Hesabı'}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Hesap Kodu" value={bankaHesapForm.code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankaHesapForm({ ...bankaHesapForm, code: e.target.value })} disabled={!!editingItem} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Hesap Adı" value={bankaHesapForm.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankaHesapForm({ ...bankaHesapForm, name: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Autocomplete
                                options={turkiyeBankalari}
                                value={bankaHesapForm.bankName}
                                onChange={(_: React.SyntheticEvent, val: string | null) => setBankaHesapForm({ ...bankaHesapForm, bankName: val || '' })}
                                renderInput={(p: AutocompleteRenderInputParams) => <TextField {...p} label="Banka" required />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Hesap Tipi</InputLabel>
                                <Select
                                    value={bankaHesapForm.type}
                                    label="Hesap Tipi"
                                    onChange={(e) => setBankaHesapForm({ ...bankaHesapForm, type: e.target.value as 'VADESIZ' | 'POS' })}
                                >
                                    <MenuItem value="VADESIZ">Vadesiz Hesap</MenuItem>
                                    <MenuItem value="POS">POS Hesabı</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="IBAN" value={bankaHesapForm.iban} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankaHesapForm({ ...bankaHesapForm, iban: e.target.value })} placeholder="TR..." />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Şube Kodu" value={bankaHesapForm.branchCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankaHesapForm({ ...bankaHesapForm, branchCode: e.target.value })} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Hesap No" value={bankaHesapForm.accountNo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankaHesapForm({ ...bankaHesapForm, accountNo: e.target.value })} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBankDialog(false)}>Vazgeç</Button>
                    <Button variant="contained" onClick={handleSaveBank} disabled={!bankaHesapForm.bankName}>Kaydet</Button>
                </DialogActions>
            </Dialog>

            {/* Credit Card Dialog */}
            <Dialog open={openCardDialog} onClose={() => setOpenCardDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>{editingItem ? 'Kredi Kartı Düzenle' : 'Yeni Kredi Kartı'}</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Kart Kodu" value={firmaKartForm.code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirmaKartForm({ ...firmaKartForm, code: e.target.value })} disabled={!!editingItem} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Kart Adı" value={firmaKartForm.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirmaKartForm({ ...firmaKartForm, name: e.target.value })} required />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Autocomplete
                                options={turkiyeBankalari}
                                value={firmaKartForm.bankName}
                                onChange={(_: React.SyntheticEvent, val: string | null) => setFirmaKartForm({ ...firmaKartForm, bankName: val || '' })}
                                renderInput={(p: AutocompleteRenderInputParams) => <TextField {...p} label="Banka" required />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Autocomplete
                                options={kartTipleri}
                                value={firmaKartForm.cardType}
                                onChange={(_: React.SyntheticEvent, val: string | null) => setFirmaKartForm({ ...firmaKartForm, cardType: val || '' })}
                                renderInput={(p: AutocompleteRenderInputParams) => <TextField {...p} label="Kart Tipi" />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth label="Son 4 Hane" value={firmaKartForm.lastFourDigits} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirmaKartForm({ ...firmaKartForm, lastFourDigits: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField fullWidth type="number" label="Kart Limiti" value={firmaKartForm.limit} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirmaKartForm({ ...firmaKartForm, limit: parseFloat(e.target.value) || 0 })} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCardDialog(false)}>Vazgeç</Button>
                    <Button variant="contained" onClick={handleSaveCard}>Kaydet</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Onay Gerekiyor</DialogTitle>
                <DialogContent>
                    <Typography><strong>{deleteTarget?.name}</strong> kaydını silmek istediğinizden emin misiniz?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Vazgeç</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>Sil</Button>
                </DialogActions>
            </Dialog>

            {/* Bank Movements Dialog */}
            <Dialog open={openHareketlerDialog} onClose={() => setOpenHareketlerDialog(false)} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {selectedBankaHesabi ? `${selectedBankaHesabi.bankName} - ${selectedBankaHesabi.name || selectedBankaHesabi.code} Hareketleri` : 'Banka Hareketleri'}
                </DialogTitle>
                <DialogContent dividers>
                    {selectedBankaHesabi && <BankaHesabiHareketleri bankaHesabiId={selectedBankaHesabi.id} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenHareketlerDialog(false)}>Kapat</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </MainLayout>
    );
}
