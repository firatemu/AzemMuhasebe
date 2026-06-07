'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Box, Typography, Button, TextField, alpha, useTheme, Divider } from '@mui/material';
import type { CartItem } from '../types/pos.types';

interface ItemDiscountModalProps {
    open: boolean;
    item: CartItem | null;
    onClose: () => void;
    onApply: (productId: string, type: 'pct' | 'amt', value: number) => void;
}

const fmt = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

export function ItemDiscountModal({ open, item, onClose, onApply }: ItemDiscountModalProps) {
    const theme = useTheme();
    const [discType, setDiscType] = useState<'pct' | 'amt'>('pct');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && item) {
            setDiscType(item.discountType);
            setValue(item.discountValue > 0 ? String(item.discountValue) : '');
            setError('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open, item]);

    const numVal = parseFloat(value) || 0;
    const lineRaw = item ? item.quantity * item.unitPrice : 0;
    const discAmt =
        item && numVal > 0
            ? discType === 'pct'
                ? lineRaw * (numVal / 100)
                : Math.min(numVal * item.quantity, lineRaw)
            : 0;
    const lineNet = lineRaw - discAmt;
    const showPreview = numVal > 0 && item != null;

    function validate(): boolean {
        if (numVal <= 0) {
            setError('Geçerli bir değer girin');
            return false;
        }
        if (discType === 'pct' && numVal > 100) {
            setError('Yüzde 100\'den büyük olamaz');
            return false;
        }
        if (discType === 'amt' && item && numVal > item.unitPrice) {
            setError(`Tutar birim fiyatı aşamaz (${fmt(item.unitPrice)})`);
            return false;
        }
        setError('');
        return true;
    }

    function handleApply() {
        if (!item || !validate()) return;
        onApply(item.productId, discType, numVal);
        onClose();
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleApply();
        if (e.key === 'Escape') onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    p: 3,
                },
            }}
        >
            <Box onKeyDown={handleKeyDown}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                    Ürün İndirimi
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                    İndirim türü ve miktarını seçin
                </Typography>

                {item && (
                    <Box
                        sx={{
                            p: 1.5,
                            bgcolor: alpha(theme.palette.background.default, 0.6),
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            mb: 2.5,
                        }}
                    >
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                            SEÇİLİ ÜRÜN
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.primary' }}>
                            {item.name}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                    <Button
                        fullWidth
                        onClick={() => { setDiscType('pct'); setError(''); }}
                        variant={discType === 'pct' ? 'contained' : 'outlined'}
                        color="warning"
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, py: 1 }}
                    >
                        Yüzdesel (%)
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => { setDiscType('amt'); setError(''); }}
                        variant={discType === 'amt' ? 'contained' : 'outlined'}
                        color="warning"
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, py: 1 }}
                    >
                        Tutar (₺)
                    </Button>
                </Box>

                <TextField
                    inputRef={inputRef}
                    fullWidth
                    type="number"
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        setError('');
                    }}
                    error={!!error}
                    helperText={error}
                    InputProps={{
                        startAdornment: (
                            <Typography sx={{ fontWeight: 700, color: 'text.disabled', mr: 1, fontSize: '1.25rem' }}>
                                {discType === 'pct' ? '%' : '₺'}
                            </Typography>
                        ),
                        sx: {
                            height: 64,
                            fontSize: '1.875rem',
                            fontWeight: 900,
                            fontFamily: theme.typography.fontFamily,
                            '& .MuiOutlinedInput-input': { textAlign: 'right' },
                            borderRadius: 3,
                        }
                    }}
                />

                {showPreview && !error && (
                    <Box sx={{ mt: 2.5, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha(theme.palette.warning.main, 0.1) }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Eski Fiyat</Typography>
                            <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>{fmt(lineRaw)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 700 }}>İndirim Tutarı</Typography>
                            <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 700 }}>−{fmt(discAmt)}</Typography>
                        </Box>
                        <Divider sx={{ my: 1, borderColor: alpha(theme.palette.warning.main, 0.2) }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>Yeni Fiyat</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary' }}>{fmt(lineNet)}</Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                    <Button
                        fullWidth
                        onClick={onClose}
                        sx={{
                            py: 1.5,
                            borderRadius: 2.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            color: 'text.secondary',
                            bgcolor: alpha(theme.palette.background.default, 0.6),
                            '&:hover': { bgcolor: alpha(theme.palette.background.default, 0.8) }
                        }}
                    >
                        Vazgeç
                    </Button>
                    <Button
                        fullWidth
                        onClick={handleApply}
                        variant="contained"
                        color="warning"
                        sx={{
                            py: 1.5,
                            borderRadius: 2.5,
                            textTransform: 'none',
                            fontWeight: 800,
                            boxShadow: `0 8px 16px ${alpha(theme.palette.warning.main, 0.25)}`,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 12px 20px ${alpha(theme.palette.warning.main, 0.35)}`,
                            }
                        }}
                    >
                        Uygula
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
