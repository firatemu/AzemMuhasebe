'use client';

import React, { useState } from 'react';
import {
    Box, Card, Typography, Button, TextField, Stack, Paper,
    alpha, useTheme, Chip, CircularProgress, Alert, Divider,
    LinearProgress as MuiLinearProgress, Tooltip, ToggleButtonGroup, ToggleButton, MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useCheck } from '@/hooks/use-checks';
import { useCollectionAction } from '@/hooks/use-collection-action';
import { formatAmount, formatDate } from '@/lib/format';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PartialIcon from '@mui/icons-material/PlaylistAddCheck';
import TodayIcon from '@mui/icons-material/Today';
import { CheckBillStatus } from '@/types/check-bill';
import { useBankAccounts, useCashboxes } from '@/hooks/use-selects';
import { useSnackbar } from 'notistack';
import type { CheckPaymentMethod } from '@/hooks/use-collection-action';

export default function CollectionClient({ checkId }: { checkId: string }) {
    const router = useRouter();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { data: check, isLoading } = useCheck(checkId);
    const collectionAction = useCollectionAction();

    const [amount, setAmount] = useState<number | ''>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [method, setMethod] = useState<CheckPaymentMethod>('BANKA');
    const [cashboxId, setCashboxId] = useState<string | null>(null);
    const [bankAccountId, setBankAccountId] = useState<string | null>(null);
    const [notes, setNotes] = useState('');

    const { data: bankAccounts = [] } = useBankAccounts();
    const { data: cashboxes = [] } = useCashboxes();

    React.useEffect(() => {
        if (check && amount === '') {
            setAmount(Number(check.remainingAmount));
        }
    }, [check]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!check) {
        return <Alert severity="error" sx={{ borderRadius: 2 }}>Evrak bulunamadı.</Alert>;
    }

    if (check.status === CheckBillStatus.COLLECTED || check.status === CheckBillStatus.PAID) {
        return (
            <Box sx={{ maxWidth: 860, mx: 'auto', mt: 4 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ fontWeight: 700, mb: 2 }}>
                    Geri Dön
                </Button>
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    Bu evrak <strong>{check.status === CheckBillStatus.COLLECTED ? 'tahsil edilmiş' : 'ödenmiş'}</strong> durumda olduğundan tekrar tahsilat/ödeme yapılamaz.
                </Alert>
            </Box>
        );
    }

    const remaining = Number(check.remainingAmount);
    const total = Number(check.amount);
    const collected = total - remaining;
    const progressPct = total > 0 ? (collected / total) * 100 : 0;
    const enteredAmt = Number(amount);
    const isFullCollection = !!amount && enteredAmt === remaining;
    const isPartial = !!amount && enteredAmt > 0 && enteredAmt < remaining;
    const projectedProgress = total > 0 ? ((collected + enteredAmt) / total) * 100 : 0;

    const methodOk =
        method === 'ELDEN' ||
        (method === 'BANKA' && !!bankAccountId) ||
        (method === 'KASA' && !!cashboxId);

    const isFormValid =
        !!amount && enteredAmt > 0 && enteredAmt <= remaining && !!date && methodOk;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const newStatus = isFullCollection ? CheckBillStatus.COLLECTED : CheckBillStatus.PARTIAL_PAID;

        collectionAction.mutate(
            {
                checkBillId: checkId,
                transactionAmount: enteredAmt,
                date: new Date(date).toISOString(),
                newStatus,
                paymentMethod: method,
                cashboxId: method === 'KASA' ? (cashboxId ?? undefined) : undefined,
                bankAccountId: method === 'BANKA' ? (bankAccountId ?? undefined) : undefined,
                notes: notes || undefined,
            },
            {
                onSuccess: () => {
                    enqueueSnackbar(
                        isFullCollection ? 'Evrak tahsil edildi.' : 'Kısmi tahsilat kaydedildi.',
                        { variant: 'success' }
                    );
                    router.push(`/checks/${checkId}`);
                },
                onError: (err: any) => {
                    enqueueSnackbar(
                        err?.response?.data?.message ?? 'Tahsilat kaydedilirken hata oluştu.',
                        { variant: 'error' }
                    );
                },
            }
        );
    };

    return (
        <Box sx={{ maxWidth: 860, mx: 'auto' }}>
            {/* Üst bar */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}
                    sx={{ fontWeight: 700, textTransform: 'none' }}>
                    Geri Dön
                </Button>
                <Chip icon={<AccountBalanceIcon sx={{ fontSize: 16 }} />}
                    label="Tahsilat İşlemi" color="success" variant="filled"
                    sx={{ fontWeight: 800, px: 1 }} />
            </Stack>

            <Grid container spacing={3}>
                {/* ─── Sol: Evrak Özeti ─── */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card variant="outlined" sx={{
                        borderRadius: 3, height: '100%', display: 'flex',
                        flexDirection: 'column', borderColor: 'var(--border)', bgcolor: 'var(--card)', overflow: 'hidden',
                    }}>
                        <Box sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.success.main, 0.08), borderBottom: '1px solid var(--border)' }}>
                            <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1}>
                                TAHSİLAT YAPILACAK EVRAK
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>{check.account?.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                                {check.checkNo ? `Çek No: ${check.checkNo}` : 'Senet'}{check.bank ? ` · ${check.bank}` : ''}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Nominal Tutar</Typography>
                                    <Typography variant="body2" fontWeight={700}>{formatAmount(total)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Tahsil Edildi</Typography>
                                    <Typography variant="body2" fontWeight={700} color="success.main">{formatAmount(collected)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Kalan Alacak</Typography>
                                    <Typography variant="h6" fontWeight={900} color="warning.main">{formatAmount(remaining)}</Typography>
                                </Box>
                            </Stack>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <TodayIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Vade: <strong>{formatDate(check.dueDate)}</strong>
                                </Typography>
                            </Box>
                            {/* Mevcut ilerleme */}
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>İlerleme</Typography>
                                    <Typography variant="caption" color="success.main" fontWeight={800}>%{progressPct.toFixed(1)}</Typography>
                                </Box>
                                <MuiLinearProgress variant="determinate" value={Math.min(100, progressPct)} color="success"
                                    sx={{ height: 8, borderRadius: 4, bgcolor: alpha(theme.palette.success.main, 0.1) }} />
                                {enteredAmt > 0 && enteredAmt <= remaining && (
                                    <Box sx={{ mt: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">Bu işlem sonrası</Typography>
                                            <Typography variant="caption" color="primary.main" fontWeight={800}>
                                                %{Math.min(100, projectedProgress).toFixed(1)}
                                            </Typography>
                                        </Box>
                                        <MuiLinearProgress variant="determinate" value={Math.min(100, projectedProgress)} color="primary"
                                            sx={{ height: 6, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.08) }} />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ px: 3, py: 2, borderTop: '1px solid var(--border)' }}>
                            {isFullCollection ? (
                                <Alert icon={<CheckCircleOutlineIcon />} severity="success" sx={{ borderRadius: 2, py: 0.5 }}>
                                    <strong>Tam Tahsilat</strong> — Evrak kapatılacak
                                </Alert>
                            ) : isPartial ? (
                                <Alert icon={<PartialIcon />} severity="info" sx={{ borderRadius: 2, py: 0.5 }}>
                                    <strong>Kısmi Tahsilat</strong> — Kalan: {formatAmount(remaining - enteredAmt)}
                                </Alert>
                            ) : (
                                <Typography variant="caption" color="text.secondary">
                                    Tahsil tutarı girdikçe durum belirlenir.
                                </Typography>
                            )}
                        </Box>
                    </Card>
                </Grid>

                {/* ─── Sağ: Form ─── */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper variant="outlined" sx={{
                        borderRadius: 3, borderColor: 'var(--border)', bgcolor: 'var(--card)', overflow: 'hidden',
                    }}>
                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid var(--border)' }}>
                            <Typography variant="subtitle2" fontWeight={800} letterSpacing={0.5}>İşlem Detayları</Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    {/* Tutar */}
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={1}>
                                            TAHSİLAT TUTARI
                                        </Typography>
                                        <TextField fullWidth type="number" required value={amount}
                                            onChange={(e: any) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                            inputProps={{ step: '0.01', min: 0.01, max: remaining }}
                                            error={!!amount && (enteredAmt <= 0 || enteredAmt > remaining)}
                                            helperText={!!amount && enteredAmt > remaining ? `Maksimum: ${formatAmount(remaining)}` : null}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '1.3rem', fontWeight: 800 } }}
                                        />
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <Tooltip title="Tamamını gir">
                                                <Button size="small" variant="outlined" onClick={() => setAmount(remaining)}
                                                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, fontSize: 12 }}>
                                                    Tamamı — {formatAmount(remaining)}
                                                </Button>
                                            </Tooltip>
                                            {[75, 50, 25].map((pct) => (
                                                <Button key={pct} size="small" variant="text"
                                                    onClick={() => setAmount(Math.round(remaining * (pct / 100) * 100) / 100)}
                                                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, fontSize: 12, minWidth: 0 }}>
                                                    %{pct}
                                                </Button>
                                            ))}
                                        </Stack>
                                    </Box>

                                    {/* Tarih */}
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={1}>
                                            TAHSİLAT TARİHİ
                                        </Typography>
                                        <TextField fullWidth type="date" required value={date}
                                            onChange={(e: any) => setDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 700 } }} />
                                    </Box>

                                    {/* Ödeme Yöntemi */}
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={1}>
                                            TAHSİLAT YÖNTEMİ
                                        </Typography>
                                        <ToggleButtonGroup value={method} exclusive
                                            onChange={(_: any, v: any) => { if (v) setMethod(v); }}
                                            size="small" fullWidth sx={{ mb: 2 }}>
                                            <ToggleButton value="BANKA" sx={{ gap: 0.5, fontWeight: 700, textTransform: 'none' }}>
                                                <AccountBalanceIcon fontSize="small" /> Banka
                                            </ToggleButton>
                                            <ToggleButton value="KASA" sx={{ gap: 0.5, fontWeight: 700, textTransform: 'none' }}>
                                                <LocalAtmIcon fontSize="small" /> Nakit Kasa
                                            </ToggleButton>
                                            <ToggleButton value="ELDEN" sx={{ gap: 0.5, fontWeight: 700, textTransform: 'none' }}>
                                                <HandshakeIcon fontSize="small" /> Elden
                                            </ToggleButton>
                                        </ToggleButtonGroup>

                                        {method === 'BANKA' && (
                                            <TextField select fullWidth size="small" label="Banka Hesabı" value={bankAccountId ?? ''}
                                                onChange={(e: any) => setBankAccountId(e.target.value || null)} required>
                                                <MenuItem value="">— Seçin —</MenuItem>
                                                {(bankAccounts as any[]).map((b) => (
                                                    <MenuItem key={b.id} value={b.id}>{b.bankName} — {b.name}</MenuItem>
                                                ))}
                                            </TextField>
                                        )}

                                        {method === 'KASA' && (
                                            <TextField select fullWidth size="small" label="Kasa" value={cashboxId ?? ''}
                                                onChange={(e: any) => setCashboxId(e.target.value || null)} required>
                                                <MenuItem value="">— Seçin —</MenuItem>
                                                {(cashboxes as any[]).map((c) => (
                                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                                ))}
                                            </TextField>
                                        )}

                                        {method === 'ELDEN' && (
                                            <Alert severity="info" icon={<HandshakeIcon />} sx={{ borderRadius: 2, py: 0.5 }}>
                                                Elden tahsilat — kasa ve banka bakiyesi etkilenmez.
                                            </Alert>
                                        )}
                                    </Box>

                                    {/* Not */}
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={1}>
                                            AÇIKLAMA / NOT <span style={{ fontWeight: 400 }}>(opsiyonel)</span>
                                        </Typography>
                                        <TextField fullWidth multiline rows={2}
                                            placeholder="İşlem hakkında not ekleyebilirsiniz..."
                                            value={notes} onChange={(e: any) => setNotes(e.target.value)}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                    </Box>

                                    {collectionAction.isError && (
                                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                                            {(collectionAction.error as any)?.response?.data?.message ?? 'Tahsilat kaydedilemedi.'}
                                        </Alert>
                                    )}

                                    <Divider />
                                    <Stack direction="row" spacing={2}>
                                        <Button variant="outlined" startIcon={<ArrowBackIcon />}
                                            onClick={() => router.back()} disabled={collectionAction.isPending}
                                            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3 }}>
                                            Vazgeç
                                        </Button>
                                        <Button type="submit" variant="contained"
                                            color={isFullCollection ? 'success' : 'primary'}
                                            size="large" fullWidth
                                            disabled={!isFormValid || collectionAction.isPending}
                                            startIcon={collectionAction.isPending
                                                ? <CircularProgress size={20} color="inherit" />
                                                : isFullCollection ? <CheckCircleOutlineIcon /> : <PartialIcon />}
                                            sx={{ borderRadius: 2, fontWeight: 900, py: 1.4, textTransform: 'none', fontSize: '1rem' }}>
                                            {collectionAction.isPending
                                                ? 'İşleniyor...'
                                                : isFullCollection
                                                    ? 'Tam Tahsilat — Evrakı Kapat'
                                                    : isPartial
                                                        ? 'Kısmi Tahsilatı Kaydet'
                                                        : 'Tahsilatı Kaydet'}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </form>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
