import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Typography,
    Box,
    Card,
    CardContent,
    Divider,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Close as CloseIcon } from '@mui/icons-material';

// Enum for Loan Types (Aligning with Backend)
enum LoanType {
    EQUAL_INSTALLMENT = 'EQUAL_INSTALLMENT',
    REVOLVING = 'REVOLVING'
}

const schema = z.object({
    loanType: z.nativeEnum(LoanType),
    amount: z.number().min(1, 'Tutar 0 dan büyük olmalıdır'),
    annualInterestRate: z.number().min(0, 'Faiz oranı 0 dan küçük olamaz'),
    installmentCount: z.number().min(1, 'Taksit sayısı en az 1 olmalıdır'),
    paymentFrequency: z.number().min(1).optional(), // Rotatif için
    installmentAmount: z.number().min(1, 'Taksit tutarı zorunludur'),
    startDate: z.string(),
    firstInstallmentDate: z.string(),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateCreditDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
    loading?: boolean;
}

export default function CreateCreditDialog({ open, onClose, onSubmit, loading }: CreateCreditDialogProps) {
    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            loanType: LoanType.EQUAL_INSTALLMENT,
            amount: 0,
            annualInterestRate: 0,
            installmentCount: 12,
            paymentFrequency: 3,
            installmentAmount: 0,
            startDate: new Date().toISOString().split('T')[0],
            firstInstallmentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
            notes: '',
        }
    });

    const watchedValues = useWatch({ control });

    // Live Calculation Logic (Installment * Count)
    const calculateSummary = () => {
        const P = watchedValues.amount || 0;
        const installment = watchedValues.installmentAmount || 0;
        const n = watchedValues.installmentCount || 1;
        const type = watchedValues.loanType;
        const freq = watchedValues.paymentFrequency || 1;

        let monthlyPayment = installment;
        let totalRepayment = 0;
        let totalInterest = 0;

        if (installment > 0) {
            if (type === LoanType.EQUAL_INSTALLMENT) {
                totalRepayment = installment * n;
            } else if (type === LoanType.REVOLVING) {
                // Rotatif: Tek bir ödeme (Taksit Tutarı kadar)
                totalRepayment = installment;
            }
            totalInterest = totalRepayment - P;
        }

        return {
            monthlyPayment,
            totalRepayment,
            totalInterest
        };
    };

    const summary = calculateSummary();

    const handleFormSubmit = (data: FormData) => {
        // Rotatif kredide vade her zaman 1 (tek ödeme) olarak gönderilmeli
        if (data.loanType === LoanType.REVOLVING) {
            data.installmentCount = 1;
        }
        onSubmit(data);
    };

    // Format currency
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
    };

    useEffect(() => {
        if (!open) reset();
    }, [open, reset]);

    // Auto-calculate First Installment Date based on Payment Frequency
    useEffect(() => {
        if (watchedValues.startDate) {
            const date = new Date(watchedValues.startDate);
            const monthsToAdd = watchedValues.loanType === LoanType.REVOLVING
                ? (watchedValues.paymentFrequency || 1)
                : 1;
            date.setMonth(date.getMonth() + monthsToAdd);
            setValue('firstInstallmentDate', date.toISOString().split('T')[0]);
        }
    }, [watchedValues.loanType, watchedValues.paymentFrequency, watchedValues.startDate, setValue]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle component="div">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Yeni Kredi Kullanımı (Manuel Plan)</Typography>
                    <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
                </Box>
            </DialogTitle>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        {/* LEFT COLUMN: Inputs */}
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="loanType"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Kredi Türü"
                                                fullWidth
                                                error={!!errors.loanType}
                                                helperText={errors.loanType?.message}
                                            >
                                                <MenuItem value={LoanType.EQUAL_INSTALLMENT}>Eşit Taksitli Kredi</MenuItem>
                                                <MenuItem value={LoanType.REVOLVING}>Rotatif (Dönemsel Ödemeli) Kredi</MenuItem>
                                            </TextField>
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="amount"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Kredi kullanım tutarı"
                                                fullWidth
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                                                }}
                                                error={!!errors.amount}
                                                helperText={errors.amount?.message}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="installmentAmount"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Taksit Tutarı (Ödenecek Tutar)"
                                                fullWidth
                                                type="number"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                                                }}
                                                error={!!errors.installmentAmount}
                                                helperText="Her bir taksitte ödenecek tutar"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name="annualInterestRate"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Yıllık Faiz Oranı (%)"
                                                fullWidth
                                                type="number"
                                                helperText="Sadece bilgi amaçlıdır"
                                                error={!!errors.annualInterestRate}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        )}
                                    />
                                </Grid>

                                {watchedValues.loanType !== LoanType.REVOLVING && (
                                    <Grid size={{ xs: 6 }}>
                                        <Controller
                                            name="installmentCount"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Vade (Ay)"
                                                    fullWidth
                                                    type="number"
                                                    error={!!errors.installmentCount}
                                                    helperText={errors.installmentCount?.message}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            )}
                                        />
                                    </Grid>
                                )}

                                {watchedValues.loanType === LoanType.REVOLVING && (
                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            name="paymentFrequency"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="Ödeme Sıklığı"
                                                    fullWidth
                                                    helperText="Ödemeler kaç ayda bir yapılacak?"
                                                >
                                                    <MenuItem value={1}>Her Ay</MenuItem>
                                                    <MenuItem value={3}>3 Ayda Bir</MenuItem>
                                                    <MenuItem value={6}>6 Ayda Bir</MenuItem>
                                                    <MenuItem value={12}>12 Ayda Bir</MenuItem>
                                                </TextField>
                                            )}
                                        />
                                    </Grid>
                                )}

                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Kullanım Tarihi"
                                                fullWidth
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                error={!!errors.startDate}
                                                helperText="Paranın hesaba girdiği tarih"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 6 }}>
                                    <Controller
                                        name="firstInstallmentDate"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="İlk Taksit Tarihi"
                                                fullWidth
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                error={!!errors.firstInstallmentDate}
                                                helperText="Ödemenin başlayacağı tarih"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="notes"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Açıklama"
                                                fullWidth
                                                multiline
                                                rows={2}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* RIGHT COLUMN: Summary Card */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Card variant="outlined" sx={{ height: '100%', bgcolor: 'grey.50', borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">
                                        Ödeme Planı Özeti
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Hesaplanan Toplam Geri Ödeme
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                                            {formatCurrency(summary.totalRepayment)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Toplam Maliyet (Faiz + Masraf)
                                        </Typography>
                                        <Typography variant="h6" fontWeight="medium" color="error.main">
                                            {formatCurrency(summary.totalInterest)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 3, p: 2, bgcolor: '#1e293b', borderRadius: 2, color: '#fff' }}>
                                        <Typography variant="caption" sx={{ opacity: 0.9 }} color="white">
                                            {watchedValues.loanType === LoanType.REVOLVING
                                                ? `${watchedValues.paymentFrequency} Ayda Bir Ödenecek Tutar`
                                                : "Aylık Taksit Tutarı"}
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold" color="white">
                                            {formatCurrency(summary.monthlyPayment)}
                                        </Typography>
                                    </Box>

                                    {/* Plana Özel Önizleme */}
                                    {watchedValues.installmentCount && watchedValues.installmentCount > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" sx={{ mb: 1 }}>
                                                TAKSİT PLANI ÖNİZLEME ({watchedValues.installmentCount || 0} Taksit)
                                            </Typography>
                                            <Box sx={{
                                                maxHeight: 200,
                                                overflowY: 'auto',
                                                bgcolor: 'white',
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                '&::-webkit-scrollbar': { width: '4px' },
                                                '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '4px' }
                                            }}>
                                                {[...Array(Math.min(watchedValues.installmentCount || 0, 48))].map((_, i) => {
                                                    const d = new Date(watchedValues.firstInstallmentDate || new Date());
                                                    const freq = watchedValues.loanType === LoanType.REVOLVING ? (watchedValues.paymentFrequency || 1) : 1;
                                                    d.setMonth(d.getMonth() + (i * freq));
                                                    return (
                                                        <Box key={i} sx={{
                                                            p: 1.5,
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            borderBottom: (i === (watchedValues.installmentCount || 0) - 1) ? 'none' : '1px solid',
                                                            borderColor: 'divider',
                                                            bgcolor: i % 2 === 0 ? 'transparent' : 'grey.50'
                                                        }}>
                                                            <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                                                {i + 1}. Taksit
                                                            </Typography>
                                                            <Box sx={{ textAlign: 'right' }}>
                                                                <Typography variant="caption" fontWeight="bold" display="block">
                                                                    {d.toLocaleDateString('tr-TR')}
                                                                </Typography>
                                                                <Typography variant="caption" color="primary.main" fontWeight="bold">
                                                                    {formatCurrency(watchedValues.installmentAmount || 0)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                    )}

                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                                        * Hesaplamalar yaklaşık değerlerdir. Banka planıyla kuruş farkları olabilir.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} color="inherit">
                        İptal
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading} size="large">
                        {loading ? 'İşleniyor...' : 'Krediyi Kullan'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
