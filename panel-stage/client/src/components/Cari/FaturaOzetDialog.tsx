'use client';

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Grid,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface Product {
    name: string;
    code: string;
}

interface InvoiceItem {
    id: string;
    product: Product;
    quantity: number;
    unitPrice: string;
    vatRate: number;
    vatAmount: string;
    amount: string;
    unit?: string;
}

interface Invoice {
    id: string;
    invoiceNo: string;
    invoiceType: string;
    date: string;
    totalAmount: string;
    vatAmount: string;
    grandTotal: string;
    currency: string;
    notes?: string;
    status: string;
    items: InvoiceItem[];
}

interface FaturaOzetDialogProps {
    open: boolean;
    onClose: () => void;
    invoice: Invoice | null;
}

export default function FaturaOzetDialog({ open, onClose, invoice }: FaturaOzetDialogProps) {
    if (!invoice) return null;

    const formatCurrency = (val: string | number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: invoice.currency || 'TRY' }).format(Number(val));
    };

    const getInvoiceTypeLabel = (type: string) => {
        switch (type) {
            case 'SATIS': return 'Satış Faturası';
            case 'ALIS': return 'Alış Faturası';
            case 'SATIS_IADE': return 'Satış İade Faturası';
            case 'ALIS_IADE': return 'Alış İade Faturası';
            default: return type;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                bgcolor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5
            }}>
                <Typography variant="h6" fontWeight={700}>
                    Fatura Özeti: {invoice.invoiceNo}
                </Typography>
                <Button onClick={onClose} sx={{ color: 'white', minWidth: 'auto' }}>
                    <Close />
                </Button>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="caption" color="text.secondary" display="block">Tarih</Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {new Date(invoice.date).toLocaleDateString('tr-TR')}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="caption" color="text.secondary" display="block">Tür</Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {getInvoiceTypeLabel(invoice.invoiceType)}
                            </Typography>
                        </Grid>
                    </Grid>

                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, border: '1px solid var(--border)' }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: 'var(--muted)' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Ürün / Hizmet</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Miktar</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Birim Fiyat</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>KDV</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Toplam</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoice.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>{item.product?.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{item.product?.code}</Typography>
                                        </TableCell>
                                        <TableCell align="right">{item.quantity} {item.unit || 'Adet'}</TableCell>
                                        <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                                        <TableCell align="right">%{item.vatRate}</TableCell>
                                        <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ ml: 'auto', width: '250px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Ara Toplam:</Typography>
                            <Typography variant="body2" fontWeight={600}>{formatCurrency(invoice.totalAmount)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">KDV Toplamı:</Typography>
                            <Typography variant="body2" fontWeight={600}>{formatCurrency(invoice.vatAmount)}</Typography>
                        </Box>
                        <Divider sx={{ my: 1, borderColor: 'var(--border)' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" fontWeight={700}>Genel Toplam:</Typography>
                            <Typography variant="subtitle1" fontWeight={700} color="var(--primary)">
                                {formatCurrency(invoice.grandTotal)}
                            </Typography>
                        </Box>
                    </Box>

                    {invoice.notes && (
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'var(--muted)', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Notlar</Typography>
                            <Typography variant="body2">{invoice.notes}</Typography>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid var(--border)' }}>
                <Button onClick={onClose} variant="outlined" color="inherit">Kapat</Button>
            </DialogActions>
        </Dialog>
    );
}
