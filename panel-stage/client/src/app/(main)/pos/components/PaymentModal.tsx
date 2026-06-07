'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, Box, Typography, TextField, MenuItem, CircularProgress, Alert, Button, alpha, useTheme, Grid } from '@mui/material';
import axios from '@/lib/axios';
import type { PosPayment } from '../types/pos.types';

interface PaymentModalProps {
    open: boolean;
    method: 'cash' | 'credit_card' | 'transfer' | 'other' | null;
    remaining: number;
    cartTotal: number;
    onClose: () => void;
    onConfirm: (payment: PosPayment) => void;
}

const METHOD_LABELS: Record<string, string> = {
    cash: 'Nakit',
    credit_card: 'Kredi Kartı',
    transfer: 'Havale / EFT',
    other: 'Diğer',
};

const fmt = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

export function PaymentModal({
    open,
    method,
    remaining,
    cartTotal,
    onClose,
    onConfirm,
}: PaymentModalProps) {
    const theme = useTheme();
    const [display, setDisplay] = useState('0');
    const [errorMsg, setErrorMsg] = useState('');
    const [loadingPaymentSource, setLoadingPaymentSource] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<Array<{
        id: string;
        accountName: string;
        iban?: string | null;
        bank?: { name?: string | null };
    }>>([]);
    const [selectedBankAccountId, setSelectedBankAccountId] = useState('');
    const [installmentCount, setInstallmentCount] = useState('1');
    const [retailCashboxId, setRetailCashboxId] = useState('');

    const effectiveRemaining = remaining > 0 ? remaining : cartTotal;

    useEffect(() => {
        if (open) {
            setDisplay(effectiveRemaining.toFixed(2));
            setErrorMsg('');
            setSelectedBankAccountId('');
            setInstallmentCount('1');
            setBankAccounts([]);
            setRetailCashboxId('');
        }
    }, [open, effectiveRemaining]);

    useEffect(() => {
        if (!open || !method) return;

        let cancelled = false;
        async function loadPaymentSource() {
            try {
                setLoadingPaymentSource(true);
                setErrorMsg('');

                if (method === 'cash') {
                    const res = await axios.get('/pos/retail-cashbox');
                    const cashbox = res.data;
                    if (!cashbox?.id) {
                        setErrorMsg('Lütfen Perakende satış kasası tanımlayınız');
                        return;
                    }
                    if (!cancelled) {
                        setRetailCashboxId(cashbox.id);
                    }
                    return;
                }

                if (method === 'credit_card' || method === 'transfer') {
                    const accountType = method === 'credit_card' ? 'POS' : 'DEMAND_DEPOSIT';
                    const res = await axios.get('/pos/bank-accounts', {
                        params: { type: accountType },
                    });
                    const rawAccounts = Array.isArray(res.data) ? res.data : [];
                    const accounts = rawAccounts.map((acc: any) => ({
                        id: acc.id,
                        accountName: acc.accountName || acc.name || '',
                        iban: acc.iban ?? null,
                        bank: { name: acc.bank?.name || '' },
                    }));
                    if (!cancelled) {
                        setBankAccounts(accounts);
                        if (accounts.length === 0) {
                            setErrorMsg(method === 'credit_card'
                                ? 'POS hesabı bulunamadı'
                                : 'Vadesiz hesap bulunamadı');
                        }
                    }
                }
            } catch {
                if (!cancelled) {
                    setErrorMsg('Ödeme kaynakları yüklenemedi');
                }
            } finally {
                if (!cancelled) {
                    setLoadingPaymentSource(false);
                }
            }
        }

        void loadPaymentSource();
        return () => {
            cancelled = true;
        };
    }, [open, method]);

    const handleNp = useCallback((key: string) => {
        setDisplay((prev) => {
            if (key === 'C') return '0';
            if (key === '⌫') return prev.length > 1 ? prev.slice(0, -1) : '0';
            if (key === '.') {
                if (prev.includes('.')) return prev;
                return prev + '.';
            }
            const dotIdx = prev.indexOf('.');
            if (dotIdx >= 0 && prev.length - dotIdx > 2) return prev;
            if (prev === '0') return key;
            return prev + key;
        });
        setErrorMsg('');
    }, []);

    useEffect(() => {
        if (!open) return;
        function onKeyDown(e: KeyboardEvent) {
            const k = e.key;
            if (k >= '0' && k <= '9') handleNp(k);
            else if (k === 'Backspace') handleNp('⌫');
            else if (k === 'Enter') handleConfirm();
            else if (k === 'Escape') onClose();
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, handleNp]);

    const baseChips = [50, 100, 200, 500].filter((a) => a >= effectiveRemaining);
    const chips = [...new Set([effectiveRemaining, ...baseChips])].filter((a) => a > 0).slice(0, 5);

    function handleConfirm() {
        if (!method) return;
        const amount = parseFloat(display);
        if (isNaN(amount) || amount <= 0) {
            setErrorMsg('Geçerli tutar girin');
            return;
        }
        const paid = effectiveRemaining;
        if (amount > paid + 0.001) {
            setErrorMsg('Toplam tutarı aşıyor');
            return;
        }

        if (method === 'cash' && !retailCashboxId) {
            setErrorMsg('Lütfen Perakende satış kasası tanımlayınız');
            return;
        }

        if ((method === 'credit_card' || method === 'transfer') && !selectedBankAccountId) {
            setErrorMsg('Lütfen banka hesabı seçin');
            return;
        }

        if (method === 'credit_card') {
            const parsedInstallment = Number(installmentCount);
            if (!Number.isInteger(parsedInstallment) || parsedInstallment < 1) {
                setErrorMsg('Taksit sayısı en az 1 olmalı');
                return;
            }
        }

        onConfirm({
            method,
            label: METHOD_LABELS[method] ?? method,
            amount,
            ...(method === 'cash' ? { cashboxId: retailCashboxId } : {}),
            ...(method === 'credit_card' || method === 'transfer'
                ? { bankAccountId: selectedBankAccountId }
                : {}),
            ...(method === 'credit_card' ? { installmentCount: Number(installmentCount) } : {}),
        });
        onClose();
    }

    const numpadKeys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', 'C', '0', '⌫'];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 4, overflow: 'hidden', bgcolor: 'background.paper', p: 3 },
            }}
        >
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                    {method ? METHOD_LABELS[method] : ''} Ödeme
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                    Kalan: <Typography component="span" sx={{ fontWeight: 800, color: 'primary.main' }}>{fmt(effectiveRemaining)}</Typography>
                </Typography>

                <TextField
                    fullWidth
                    readOnly
                    value={display}
                    InputProps={{
                        startAdornment: (
                            <Typography sx={{ fontWeight: 700, color: 'text.disabled', mr: 1, fontSize: '1.25rem' }}>₺</Typography>
                        ),
                        sx: {
                            height: 64,
                            fontSize: '2rem',
                            fontWeight: 900,
                            fontFamily: theme.typography.fontFamily,
                            '& .MuiOutlinedInput-input': { textAlign: 'right' },
                            borderRadius: 3,
                            mb: 2,
                            bgcolor: alpha(theme.palette.background.default, 0.4)
                        }
                    }}
                />

                {(method === 'credit_card' || method === 'transfer') && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                            {method === 'credit_card' ? 'POS HESABI' : 'VADESİZ HESAP'}
                        </Typography>
                        {loadingPaymentSource ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                                <CircularProgress size={16} />
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>Cihazlar yükleniyor...</Typography>
                            </Box>
                        ) : (
                            <TextField
                                select
                                fullWidth
                                size="small"
                                value={selectedBankAccountId}
                                onChange={(e) => setSelectedBankAccountId(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            >
                                <MenuItem value="">Hesap Seçin</MenuItem>
                                {bankAccounts.map((acc) => (
                                    <MenuItem key={acc.id} value={acc.id}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{acc.bank?.name} - {acc.accountName}</Typography>
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    </Box>
                )}

                {method === 'credit_card' && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>TAKSİT SAYISI</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={installmentCount}
                            onChange={(e) => setInstallmentCount(e.target.value)}
                            inputProps={{ min: 1 }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>
                )}

                {errorMsg && (
                    <Alert severity="warning" variant="filled" sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}>
                        {errorMsg}
                    </Alert>
                )}

                {chips.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {chips.map((a) => (
                            <Button
                                key={a}
                                size="small"
                                onClick={() => { setDisplay(a.toFixed(2)); setErrorMsg(''); }}
                                variant="outlined"
                                sx={{
                                    borderRadius: 10,
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    fontFamily: 'monospace',
                                    minWidth: 'auto',
                                    px: 1.5,
                                    borderColor: alpha(theme.palette.primary.main, 0.3),
                                    color: 'primary.main',
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05), borderColor: 'primary.main' }
                                }}
                            >
                                {fmt(a)}
                            </Button>
                        ))}
                    </Box>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 3 }}>
                    {numpadKeys.map((k) => (
                        <Button
                            key={k}
                            onClick={() => handleNp(k)}
                            sx={{
                                height: 56,
                                borderRadius: 2,
                                fontSize: '1.25rem',
                                fontWeight: 800,
                                fontFamily: 'monospace',
                                bgcolor: k === 'C' ? alpha(theme.palette.error.main, 0.05) : alpha(theme.palette.background.default, 0.4),
                                color: k === 'C' ? 'error.main' : 'text.primary',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: k === 'C' ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.background.default, 0.8),
                                    borderColor: 'primary.main'
                                }
                            }}
                        >
                            {k}
                        </Button>
                    ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        fullWidth
                        onClick={onClose}
                        sx={{
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 700,
                            color: 'text.secondary',
                            bgcolor: alpha(theme.palette.background.default, 0.6)
                        }}
                    >
                        Vazgeç
                    </Button>
                    <Button
                        fullWidth
                        disabled={loadingPaymentSource}
                        onClick={handleConfirm}
                        variant="contained"
                        sx={{
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 800,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`
                        }}
                    >
                        Ödeme Ekle
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
