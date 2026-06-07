'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, TextField, alpha, useTheme, Divider } from '@mui/material';
import type { GlobalDiscount } from '../types/pos.types';

interface GlobalDiscountBarProps {
    discount: GlobalDiscount;
    cartSubtotal: number;
    onApply: (type: 'pct' | 'amt', value: number) => void;
    onClear: () => void;
}

export function GlobalDiscountBar({
    discount,
    cartSubtotal,
    onApply,
    onClear,
}: GlobalDiscountBarProps) {
    const theme = useTheme();
    const [inputVal, setInputVal] = useState(discount.value > 0 ? String(discount.value) : '');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setInputVal(discount.value > 0 ? String(discount.value) : '');
    }, [discount.value]);

    function handleTypeChange(type: 'pct' | 'amt') {
        const val = parseFloat(inputVal) || 0;
        onApply(type, val);
    }

    function handleInput(raw: string) {
        setInputVal(raw);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            let val = parseFloat(raw) || 0;
            if (discount.type === 'pct') val = Math.min(val, 100);
            if (discount.type === 'amt') val = Math.min(val, cartSubtotal);
            onApply(discount.type, val);
        }, 150);
    }

    function handleClear() {
        setInputVal('');
        onClear();
    }

    const hasDiscount = discount.value > 0;

    return (
        <Box
            sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                bgcolor: alpha(theme.palette.background.default, 0.4),
            }}
        >
            {/* Üst Satır: Başlık + Butonlar */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="overline" sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', lineHeight: 1 }}>
                    GENEL İNDİRİM
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, bgcolor: alpha(theme.palette.background.default, 0.8), p: 0.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Button
                        size="small"
                        onClick={() => handleTypeChange('pct')}
                        sx={{
                            minWidth: 32,
                            height: 32,
                            borderRadius: 1.5,
                            fontWeight: 800,
                            fontSize: '0.875rem',
                            bgcolor: discount.type === 'pct' ? 'warning.main' : 'transparent',
                            color: discount.type === 'pct' ? 'warning.contrastText' : 'text.disabled',
                            '&:hover': { bgcolor: discount.type === 'pct' ? 'warning.main' : alpha(theme.palette.warning.main, 0.1) }
                        }}
                    >
                        %
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handleTypeChange('amt')}
                        sx={{
                            minWidth: 32,
                            height: 32,
                            borderRadius: 1.5,
                            fontWeight: 800,
                            fontSize: '0.875rem',
                            bgcolor: discount.type === 'amt' ? 'warning.main' : 'transparent',
                            color: discount.type === 'amt' ? 'warning.contrastText' : 'text.disabled',
                            '&:hover': { bgcolor: discount.type === 'amt' ? 'warning.main' : alpha(theme.palette.warning.main, 0.1) }
                        }}
                    >
                        ₺
                    </Button>
                </Box>
            </Box>

            {/* Alt Satır: Input + Temizle */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="0.00"
                    value={inputVal}
                    onChange={(e) => handleInput(e.target.value.replace(/[^0-9.]/g, ''))}
                    autoComplete="off"
                    InputProps={{
                        startAdornment: (
                            <Typography sx={{ fontWeight: 800, color: 'text.disabled', mr: 1, fontSize: '1rem' }}>
                                {discount.type === 'pct' ? '%' : '₺'}
                            </Typography>
                        ),
                        sx: {
                            height: 48,
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            '& .MuiOutlinedInput-input': { textAlign: 'right' },
                        }
                    }}
                />

                <Button
                    onClick={handleClear}
                    disabled={!hasDiscount}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        minWidth: 80,
                        height: 48,
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': { color: 'error.main', borderColor: 'error.main', bgcolor: 'error.lighter' }
                    }}
                >
                    Sıfırla
                </Button>
            </Box>
        </Box>
    );
}
