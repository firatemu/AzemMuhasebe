'use client';

import React, { memo } from 'react';
import { Box, Typography, alpha, useTheme, IconButton, Button } from '@mui/material';
import type { CartItem } from '../types/pos.types';

interface CartItemRowProps {
    item: CartItem;
    onQuantityChange: (productId: string, delta: number) => void;
    onRemove: (productId: string) => void;
    onDiscountClick: (productId: string) => void;
}

const fmt = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

function TrashIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    );
}

export const CartItemRow = memo(function CartItemRow({
    item,
    onQuantityChange,
    onRemove,
    onDiscountClick,
}: CartItemRowProps) {
    const theme = useTheme();

    const lineRaw = item.quantity * item.unitPrice;
    const lineNet = lineRaw - item.discountAmount;
    const hasDiscount = item.discountValue > 0;

    const discLabel = hasDiscount
        ? item.discountType === 'pct'
            ? `${item.discountValue}%`
            : `−${fmt(item.discountValue)}`
        : '+ İndirim';

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.15s ease',
                '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                }
            }}
        >
            {/* Sol: İsim + Varyant */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {item.name}
                    {item.variantName && (
                        <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8125rem', ml: 1 }}>
                            • {item.variantName}
                        </Typography>
                    )}
                </Typography>
            </Box>

            {/* Orta: Fiyat ve İndirim */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexShrink: 0 }}>
                <Typography
                    sx={{
                        fontSize: '0.875rem',
                        color: 'text.secondary',
                        fontFamily: theme.typography.fontFamily,
                        fontWeight: 600
                    }}
                >
                    {fmt(item.unitPrice)}
                </Typography>

                <Button
                    size="small"
                    onClick={() => onDiscountClick(item.productId)}
                    sx={{
                        fontSize: '0.6875rem',
                        py: 0.25,
                        px: 1,
                        minWidth: 'auto',
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 700,
                        bgcolor: hasDiscount ? alpha(theme.palette.warning.main, 0.1) : 'transparent',
                        color: hasDiscount ? 'warning.main' : 'text.disabled',
                        border: '1px solid',
                        borderColor: hasDiscount ? alpha(theme.palette.warning.main, 0.3) : 'divider',
                        '&:hover': {
                            bgcolor: 'warning.main',
                            color: 'warning.contrastText',
                            borderColor: 'warning.main',
                        }
                    }}
                >
                    {discLabel}
                </Button>
            </Box>

            {/* Adet Kontrolleri */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, bgcolor: 'background.default', borderRadius: 2, p: 0.5 }}>
                <IconButton
                    size="small"
                    onClick={() => onQuantityChange(item.productId, -1)}
                    sx={{
                        width: 28,
                        height: 28,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1.5,
                        fontSize: 18,
                        fontWeight: 700,
                        '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                    }}
                >
                    −
                </IconButton>

                <Typography
                    sx={{
                        fontSize: '0.9375rem',
                        fontWeight: 800,
                        minWidth: 28,
                        textAlign: 'center',
                        color: 'text.primary'
                    }}
                >
                    {item.quantity}
                </Typography>

                <IconButton
                    size="small"
                    onClick={() => onQuantityChange(item.productId, 1)}
                    sx={{
                        width: 28,
                        height: 28,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1.5,
                        fontSize: 18,
                        fontWeight: 700,
                        '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                    }}
                >
                    +
                </IconButton>
            </Box>

            {/* Satır Tutarı */}
            <Box sx={{ minWidth: 90, textAlign: 'right', flexShrink: 0 }}>
                {hasDiscount && (
                    <Typography
                        sx={{
                            fontSize: '0.75rem',
                            color: 'text.disabled',
                            textDecoration: 'line-through',
                            lineHeight: 1
                        }}
                    >
                        {fmt(lineRaw)}
                    </Typography>
                )}
                <Typography
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 900,
                        color: 'text.primary',
                        lineHeight: 1.2
                    }}
                >
                    {fmt(lineNet)}
                </Typography>
            </Box>

            {/* Sil Butonu */}
            <IconButton
                onClick={() => onRemove(item.productId)}
                sx={{
                    width: 32,
                    height: 32,
                    color: 'text.disabled',
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: 'error.lighter', color: 'error.main' }
                }}
            >
                <TrashIcon />
            </IconButton>
        </Box>
    );
});
