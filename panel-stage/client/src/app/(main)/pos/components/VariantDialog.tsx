'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    alpha,
    useTheme
} from '@mui/material';
import { usePosStore } from '@/stores/posStore';

export default function VariantDialog() {
    const theme = useTheme();
    const {
        variantDialogOpen,
        setVariantDialogOpen,
        selectedProductForVariant,
        addToCart
    } = usePosStore();

    if (!selectedProductForVariant) return null;

    const handleVariantSelect = (variant: any) => {
        addToCart({
            productId: (selectedProductForVariant as any).id,
            name: (selectedProductForVariant as any).name,
            quantity: 1,
            unitPrice: parseFloat(variant.salePrice || variant.satisFiyati || (selectedProductForVariant as any).salePrice || 0),
            vatRate: (selectedProductForVariant as any).vatRate || 20,
            variantId: variant.id,
            variantName: variant.name || variant.title
        });
        setVariantDialogOpen(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(amount);
    };

    return (
        <Dialog
            open={variantDialogOpen}
            onClose={() => setVariantDialogOpen(false)}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    boxShadow: theme.shadows[24]
                }
            }}
        >
            <DialogTitle sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 900,
                textAlign: 'center',
                py: 3
            }}>
                Varyant Seçimi
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, fontWeight: 700 }}>
                    {(selectedProductForVariant as any).name}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <List sx={{ py: 1 }}>
                    {((selectedProductForVariant as any).productVariants || []).map((variant: any, index: number) => (
                        <React.Fragment key={variant.id}>
                            <ListItemButton
                                onClick={() => handleVariantSelect(variant)}
                                sx={{
                                    py: 2,
                                    px: 3,
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        '& .variant-price': { color: 'primary.main' }
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>
                                            {variant.name || variant.title || `Seçenek ${index + 1}`}
                                        </Typography>
                                    }
                                    secondary={
                                        variant.sku ? <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled' }}>SKU: {variant.sku}</Typography> : null
                                    }
                                />
                                <Typography
                                    className="variant-price"
                                    sx={{
                                        fontWeight: 900,
                                        color: 'text.secondary',
                                        transition: 'all 0.2s',
                                        fontSize: '1.125rem',
                                        fontFamily: theme.typography.fontFamily
                                    }}
                                >
                                    {formatCurrency(parseFloat(variant.salePrice || variant.satisFiyati || (selectedProductForVariant as any).salePrice || 0))}
                                </Typography>
                            </ListItemButton>
                            {index < (selectedProductForVariant as any).productVariants.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: alpha(theme.palette.background.default, 0.4) }}>
                <Button
                    fullWidth
                    onClick={() => setVariantDialogOpen(false)}
                    sx={{
                        py: 1.25,
                        borderRadius: 2.5,
                        fontWeight: 800,
                        color: 'text.secondary',
                        textTransform: 'none',
                        '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.05) }
                    }}
                >
                    İptal
                </Button>
            </DialogActions>
        </Dialog>
    );
}
