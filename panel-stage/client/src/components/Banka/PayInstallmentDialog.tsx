import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Stack,
    Paper,
    Divider,
    Alert,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Autocomplete,
    Grid,
    InputAdornment
} from '@mui/material';
import {
    AccountBalance,
    AttachMoney,
    Close,
    PanTool,
    CheckCircle,
    Payments
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from '@/lib/axios';

interface LoanPlan {
    id: string;
    installmentNo: number;
    dueDate: string;
    amount: number;
    paidAmount: number;
    status: string;
}

interface BankAccount {
    id: string;
    name: string;
    bankName?: string;
    code: string;
    balance: number;
    type: string;
}

interface Cashbox {
    id: string;
    name: string;
    code: string;
    balance: number;
}

interface PayInstallmentDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    plan: LoanPlan;
}

type PaymentType = 'BANKA_HAVALESI' | 'CASH' | 'ELDEN';

export default function PayInstallmentDialog({ open, onClose, onSuccess, plan }: PayInstallmentDialogProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [paymentType, setPaymentType] = useState<PaymentType>('BANKA_HAVALESI');
    const [amount, setAmount] = useState<string>('');
    const [notes, setNotes] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [bankAccountId, setBankAccountId] = useState<string | null>(null);
    const [cashboxId, setCashboxId] = useState<string | null>(null);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [cashboxes, setCashboxes] = useState<Cashbox[]>([]);
    const [loading, setLoading] = useState(false);
    const [allowNegativeCashBalance, setAllowNegativeCashBalance] = useState(false);
    const [allowNegativeBankBalance, setAllowNegativeBankBalance] = useState(false);

    const remainingAmount = plan.amount - plan.paidAmount;

    useEffect(() => {
        if (open) {
            setAmount(remainingAmount.toString());
            fetchBankAccounts();
            fetchCashboxes();
            fetchSystemParameters();
        }
    }, [open]); // Sadece open değişince çalışsın

    const fetchSystemParameters = async () => {
        try {
            const response = await axios.get('/system-parameters');
            const allowNegativeCash = response.data.find((p: any) => p.key === 'ALLOW_NEGATIVE_CASH_BALANCE');
            const allowNegativeBank = response.data.find((p: any) => p.key === 'NEGATIVE_BANK_BALANCE_CONTROL');

            // Value boolean veya string olarak gelebilir
            const cashValue = allowNegativeCash?.value;
            const bankValue = allowNegativeBank?.value;

            console.log('System params loaded:');
            console.log('- allowNegativeCash:', cashValue, 'Type:', typeof cashValue);
            console.log('- allowNegativeBank:', bankValue, 'Type:', typeof bankValue);

            // Hem boolean hem string kontrolü yap
            const allowCash = cashValue === true || cashValue === 'true';
            const allowBank = bankValue === false || bankValue === 'false';

            console.log('- allowNegativeCashBalance will be:', allowCash);
            console.log('- allowNegativeBankBalance will be:', allowBank);

            setAllowNegativeCashBalance(allowCash);
            setAllowNegativeBankBalance(allowBank);
        } catch (error) {
            console.error('Sistem parametreleri yüklenemedi:', error);
            // Hata durumunda varsayılan olarak negatife izin ver
            setAllowNegativeCashBalance(true);
            setAllowNegativeBankBalance(true);
        }
    };

    const fetchBankAccounts = async () => {
        try {
            const response = await axios.get('/banks/summary');
            console.log('Banks summary response:', response.data);

            const vadesizHesaplar: BankAccount[] = [];
            response.data.bankalar?.forEach((banka: any) => {
                console.log(`Processing bank: ${banka.ad || banka.name}, hesaplar count: ${banka.hesaplar?.length || 0}`);
                const bankaAdi = banka.ad || banka.name;
                banka.hesaplar?.forEach((hesap: any) => {
                    console.log(`Checking account: ${hesap.hesapAdi}, hesapTipi: ${hesap.hesapTipi}`);

                    // Vadesiz hesap kontrolü - hesapTipi 'DEMAND_DEPOSIT' olmalı
                    const isVadesiz = hesap.hesapTipi === 'DEMAND_DEPOSIT';

                    console.log(`  -> isVadesiz: ${isVadesiz}`);

                    if (isVadesiz) {
                        vadesizHesaplar.push({
                            id: hesap.id,
                            name: hesap.hesapAdi,
                            bankName: bankaAdi,
                            code: hesap.hesapNo || hesap.iban || '',
                            balance: hesap.balance,
                            type: hesap.hesapTipi
                        });
                    }
                });
            });
            console.log('Vadesiz hesaplar found:', vadesizHesaplar.length);
            setBankAccounts(vadesizHesaplar);
        } catch (error) {
            console.error('Banka hesapları yüklenemedi:', error);
        }
    };

    const fetchCashboxes = async () => {
        try {
            const response = await axios.get('/cashbox');
            setCashboxes(response.data.filter((k: Cashbox) => k.name !== 'Silinen Kayıtlar'));
        } catch (error) {
            console.error('Kasalar yüklenemedi:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSubmit = async () => {
        console.log('PayInstallmentDialog handleSubmit called', {
            paymentType,
            amount,
            bankAccountId,
            cashboxId,
            allowNegativeCashBalance,
            allowNegativeBankBalance,
            remainingAmount
        });

        if (!amount || parseFloat(amount) <= 0) {
            enqueueSnackbar('Geçerli bir tutar giriniz', { variant: 'error' });
            return;
        }

        if (parseFloat(amount) > remainingAmount) {
            enqueueSnackbar('Ödeme tutarı kalan tutardan fazla olamaz', { variant: 'error' });
            return;
        }

        if (paymentType === 'BANKA_HAVALESI' && !bankAccountId) {
            enqueueSnackbar('Banka hesabı seçiniz', { variant: 'error' });
            return;
        }

        if (paymentType === 'CASH' && !cashboxId) {
            enqueueSnackbar('Kasa seçiniz', { variant: 'error' });
            return;
        }

        // Bakiye kontrolü - sistem parametresine göre
        if (paymentType === 'BANKA_HAVALESI' && !allowNegativeBankBalance) {
            const hesap = bankAccounts.find(h => h.id === bankAccountId);
            if (hesap && hesap.balance < parseFloat(amount)) {
                enqueueSnackbar('Banka hesabında yeterli bakiye yok', { variant: 'error' });
                return;
            }
        }

        if (paymentType === 'CASH' && !allowNegativeCashBalance) {
            const kasa = cashboxes.find(k => k.id === cashboxId);
            if (kasa && kasa.balance < parseFloat(amount)) {
                enqueueSnackbar('Kasada yeterli bakiye yok', { variant: 'error' });
                return;
            }
        }

        console.log('Validations passed, submitting payment...');

        setLoading(true);
        try {
            await axios.post(`/banks/loan-plans/${plan.id}/payments`, {
                paymentType,
                amount: parseFloat(amount),
                bankAccountId: paymentType === 'BANKA_HAVALESI' ? bankAccountId : undefined,
                cashboxId: paymentType === 'CASH' ? cashboxId : undefined,
                notes: notes || undefined,
                paymentDate
            });
            enqueueSnackbar('Ödeme başarıyla kaydedildi', { variant: 'success' });
            onSuccess();
            onClose();
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'Ödeme kaydedilemedi', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const selectedHesap = bankAccounts.find(h => h.id === bankAccountId);
    const selectedKasa = cashboxes.find(k => k.id === cashboxId);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle component="div" sx={{
                p: 2.5,
                pb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Payments sx={{ fontSize: 28 }} />
                    <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ lineHeight: 1.2 }}>Taksit Ödemesi</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>Kredi taksit ödeme işlemi</Typography>
                    </Box>
                </Box>
                <Button
                    onClick={onClose}
                    sx={{ color: 'white', minWidth: 'auto', p: 0.5 }}
                >
                    <Close />
                </Button>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Grid container sx={{ minHeight: 500 }}>
                    {/* SOL PANEL - Taksit Bilgileri */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{
                        bgcolor: 'grey.50',
                        p: 3,
                        borderRight: '1px solid',
                        borderColor: 'divider'
                    }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                            Taksit Bilgileri
                        </Typography>

                        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Taksit No</Typography>
                                <Typography variant="h4" fontWeight="700" color="primary">#{plan.installmentNo}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Vade Tarihi</Typography>
                                <Typography variant="body1" fontWeight="600">{formatDate(plan.dueDate)}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Taksit Tutarı</Typography>
                                <Typography variant="h5" fontWeight="700" color="primary.main">{formatCurrency(plan.amount)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>Kalan Tutar</Typography>
                                <Typography variant="h5" fontWeight="700" color="error.main">{formatCurrency(remainingAmount)}</Typography>
                            </Box>
                        </Paper>

                        {/* Durum */}
                        <Paper sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: plan.status === 'PAID' ? 'success.light' : 'warning.light',
                            border: '1px solid',
                            borderColor: plan.status === 'PAID' ? 'success.main' : 'warning.main'
                        }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                                {plan.status === 'PAID' ? 'ÖDENDİ' : plan.status === 'PARTIALLY_PAID' ? 'KISMİ ÖDENDİ' : 'BEKLEMEDİR'}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* SAĞ PANEL - Ödeme Formu */}
                    <Grid size={{ xs: 12, md: 8 }} sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                            Ödeme Yap
                        </Typography>

                        <Grid container spacing={2.5}>
                            {/* Ödeme Tipi Seçimi */}
                            <Grid size={{ xs: 12 }}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5 }}>Ödeme Yöntemi</FormLabel>
                                    <RadioGroup
                                        value={paymentType}
                                        onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                                        sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}
                                    >
                                        <Paper
                                            sx={{
                                                flex: 1,
                                                p: 1.5,
                                                border: '2px solid',
                                                borderColor: paymentType === 'BANKA_HAVALESI' ? 'primary.main' : 'divider',
                                                borderRadius: 2,
                                                bgcolor: paymentType === 'BANKA_HAVALESI' ? 'primary.50' : 'background.paper',
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: paymentType === 'BANKA_HAVALESI' ? 'primary.100' : 'action.hover' }
                                            }}
                                        >
                                            <FormControlLabel
                                                value="BANKA_HAVALESI"
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 0.5 }}>
                                                        <AccountBalance color="primary" />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="600">Banka</Typography>
                                                            <Typography variant="caption" color="text.secondary">Vadesiz hesaptan</Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                        <Paper
                                            sx={{
                                                flex: 1,
                                                p: 1.5,
                                                border: '2px solid',
                                                borderColor: paymentType === 'CASH' ? 'success.main' : 'divider',
                                                borderRadius: 2,
                                                bgcolor: paymentType === 'CASH' ? 'success.50' : 'background.paper',
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: paymentType === 'CASH' ? 'success.100' : 'action.hover' }
                                            }}
                                        >
                                            <FormControlLabel
                                                value="CASH"
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 0.5 }}>
                                                        <AttachMoney color="success" />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="600">Kasa</Typography>
                                                            <Typography variant="caption" color="text.secondary">Nakit ödeme</Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                        <Paper
                                            sx={{
                                                flex: 1,
                                                p: 1.5,
                                                border: '2px solid',
                                                borderColor: paymentType === 'ELDEN' ? 'warning.main' : 'divider',
                                                borderRadius: 2,
                                                bgcolor: paymentType === 'ELDEN' ? 'warning.50' : 'background.paper',
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: paymentType === 'ELDEN' ? 'warning.100' : 'action.hover' }
                                            }}
                                        >
                                            <FormControlLabel
                                                value="ELDEN"
                                                control={<Radio />}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 0.5 }}>
                                                        <PanTool color="warning" />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="600">Elden</Typography>
                                                            <Typography variant="caption" color="text.secondary">Bakiye hareketi yok</Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </Paper>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {/* Banka Hesabı Seçimi */}
                            {paymentType === 'BANKA_HAVALESI' && (
                                <Grid size={{ xs: 12 }}>
                                    <Autocomplete
                                        options={bankAccounts}
                                        getOptionLabel={(option) => `${option.bankName || ''} - ${option.name} (${option.code}) - Bakiye: ${formatCurrency(option.balance)}`}
                                        value={bankAccounts.find(h => h.id === bankAccountId) || null}
                                        onChange={(_, newValue) => setBankAccountId(newValue?.id || null)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Banka Hesabı"
                                                required
                                                fullWidth
                                                helperText={selectedHesap ? `Seçili hesap bakiyesi: ${formatCurrency(selectedHesap.balance)}` : 'Vadesiz hesaplar listelenir'}
                                                placeholder="Hesap seçin..."
                                            />
                                        )}
                                        noOptionsText="Vadesiz banka hesabı bulunamadı"
                                    />
                                </Grid>
                            )}

                            {/* Kasa Seçimi */}
                            {paymentType === 'CASH' && (
                                <Grid size={{ xs: 12 }}>
                                    <Autocomplete
                                        options={cashboxes}
                                        getOptionLabel={(option) => `${option.name} (${option.code}) - Bakiye: ${formatCurrency(option.balance)}`}
                                        value={cashboxes.find(k => k.id === cashboxId) || null}
                                        onChange={(_, newValue) => setCashboxId(newValue?.id || null)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Kasa"
                                                required
                                                fullWidth
                                                helperText={selectedKasa ? `Seçili kasa bakiyesi: ${formatCurrency(selectedKasa.balance)}` : 'Kasa seçin'}
                                                placeholder="Kasa seçin..."
                                            />
                                        )}
                                        noOptionsText="Kasa bulunamadı"
                                    />
                                </Grid>
                            )}

                            {/* Tutar ve Tarih - Yan yana */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Ödeme Tutarı"
                                    type="number"
                                    fullWidth
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                                    }}
                                    helperText={`Max: ${formatCurrency(remainingAmount)}`}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Ödeme Tarihi"
                                    type="date"
                                    fullWidth
                                    required
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Açıklama */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Açıklama (Opsiyonel)"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Ödeme ile ilgili notlar..."
                                />
                            </Grid>

                            {/* Bakiye Uyarısı - Sadece sistem parametresi kapalıyken göster */}
                            {paymentType === 'BANKA_HAVALESI' && !allowNegativeBankBalance && selectedHesap && selectedHesap.balance < parseFloat(amount || '0') && (
                                <Grid size={{ xs: 12 }}>
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        Banka hesabında yeterli bakiye yok! Gerekli: {formatCurrency(parseFloat(amount || '0') - selectedHesap.balance)}
                                    </Alert>
                                </Grid>
                            )}
                            {paymentType === 'CASH' && !allowNegativeCashBalance && selectedKasa && selectedKasa.balance < parseFloat(amount || '0') && (
                                <Grid size={{ xs: 12 }}>
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        Kasada yeterli bakiye yok! Gerekli: {formatCurrency(parseFloat(amount || '0') - selectedKasa.balance)}
                                    </Alert>
                                </Grid>
                            )}
                            {/* Negatif bakiye uyarısı - Bilgilendirme */}
                            {((paymentType === 'BANKA_HAVALESI' && allowNegativeBankBalance && selectedHesap && selectedHesap.balance < parseFloat(amount || '0')) ||
                              (paymentType === 'CASH' && allowNegativeCashBalance && selectedKasa && selectedKasa.balance < parseFloat(amount || '0'))) && (
                                <Grid size={{ xs: 12 }}>
                                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                        {paymentType === 'BANKA_HAVALESI' ? 'Banka hesabı' : 'Kasa'} bakiyesi eksiye düşecek! ({formatCurrency(parseFloat(amount || '0') - (paymentType === 'BANKA_HAVALESI' ? (selectedHesap?.balance ?? 0) : (selectedKasa?.balance ?? 0)))} açık verecek)
                                    </Alert>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>İptal</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={<CheckCircle />}
                    sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        px: 3
                    }}
                >
                    {loading ? 'Ödeniyor...' : 'Ödemeyi Kaydet'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
