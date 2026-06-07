'use client';

import React from 'react';
import { Dialog, Box, Typography, Button, Divider, alpha, useTheme } from '@mui/material';
import { usePosStore } from '@/stores/posStore';

// ─────────────────────────────────────────────────────────────────────────────
// Tipler
// ─────────────────────────────────────────────────────────────────────────────
export interface ReceiptItem {
    name: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    lineTotal: number;
}

export interface ReceiptData {
    invoiceNumber: string;
    date: Date;
    customerName: string;
    salespersonName?: string;
    items: ReceiptItem[];
    subtotal: number;
    totalDiscount: number;
    vatAmount: number;
    grandTotal: number;
    payments: { label: string; amount: number }[];
    note?: string;
}

interface ReceiptDialogProps {
    open: boolean;
    data: ReceiptData | null;
    onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Yardımcı
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

// ─────────────────────────────────────────────────────────────────────────────
// ReceiptDialog
// ─────────────────────────────────────────────────────────────────────────────
export function ReceiptDialog({ open, data, onClose }: ReceiptDialogProps) {
    const theme = useTheme();

    if (!data) return null;

    const dateStr = data.date.toLocaleDateString('tr-TR');
    const timeStr = data.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { background: 'transparent', boxShadow: 'none', overflow: 'visible' },
            }}
            BackdropProps={{
                sx: { backdropFilter: 'blur(8px)', background: alpha(theme.palette.background.default, 0.4) },
            }}
        >
            <Box
                sx={{
                    bgcolor: '#fff', // Receipt is always light for readability
                    color: '#1a1a1a',
                    width: 'min(320px, 92vw)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    fontFamily: theme.typography.fontFamily,
                }}
            >
                {/* Başlık Bölümü */}
                <Box
                    sx={{
                        bgcolor: '#f8fafc',
                        px: 3,
                        py: 4,
                        textAlign: 'center',
                        borderBottom: '2px solid',
                        borderColor: '#e2e8f0',
                    }}
                >
                    <Typography sx={{ fontSize: '1.125rem', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase' }}>
                        OtoMuhasebe
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', mt: 0.5 }}>
                        {dateStr} • {timeStr}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '0.6875rem',
                            fontFamily: 'monospace',
                            color: '#94a3b8',
                            mt: 1,
                            letterSpacing: 0.5
                        }}
                    >
                        {data.invoiceNumber}
                    </Typography>
                </Box>

                {/* İçerik Bölümü */}
                <Box sx={{ p: 3 }}>
                    {/* Müşteri Bilgisi */}
                    <Box
                        sx={{
                            pb: 1.5,
                            mb: 2,
                            borderBottom: '1px dashed #e2e8f0',
                        }}
                    >
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', display: 'block', mb: 0.25 }}>MÜŞTERİ</Typography>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700 }}>{data.customerName}</Typography>
                    </Box>

                    {/* Ürün Listesi */}
                    <Box sx={{ mb: 2 }}>
                        {data.items.map((it, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    py: 1,
                                    borderBottom: '1px solid #f1f5f9',
                                }}
                            >
                                <Box sx={{ flex: 1, pr: 2 }}>
                                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.2 }}>
                                        {it.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                                        {it.quantity} adet × {fmt(it.unitPrice)}
                                    </Typography>
                                    {it.discountAmount > 0 && (
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.warning.main, ml: 1 }}>
                                            Ind.: −{fmt(it.discountAmount)}
                                        </Typography>
                                    )}
                                </Box>
                                <Typography sx={{ fontSize: '0.875rem', fontWeight: 800 }}>
                                    {fmt(it.lineTotal)}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Alt Toplamlar */}
                    <Box sx={{ mt: 2, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
                        {data.totalDiscount > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>Genel İndirim</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>−{fmt(data.totalDiscount)}</Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>Toplam KDV</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{fmt(data.vatAmount)}</Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                pt: 1.5,
                                mt: 1,
                                borderTop: '2px solid #1e293b',
                            }}
                        >
                            <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>TOPLAM</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.25rem' }}>{fmt(data.grandTotal)}</Typography>
                        </Box>
                    </Box>

                    {/* Ödemeler */}
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', display: 'block', mb: 1 }}>ÖDEME DETAYI</Typography>
                        {data.payments.map((p, idx) => (
                            <Box
                                key={idx}
                                sx={{ display: 'flex', justifyContent: 'space-between', py: 0.25 }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>{p.label}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>{fmt(p.amount)}</Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Not Bölümü */}
                    {data.note && (
                        <Box sx={{ mt: 2, px: 1 }}>
                            <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#94a3b8', fontSize: '0.6875rem' }}>
                                Not: {data.note}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Footer */}
                <Box sx={{ p: 3, pt: 1, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', mb: 2 }}>
                        Bizi tercih ettiğiniz için teşekkürler!
                    </Typography>
                    <Button
                        fullWidth
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            py: 2,
                            borderRadius: 3,
                            fontWeight: 900,
                            textTransform: 'none',
                            bgcolor: '#1e293b',
                            color: '#fff',
                            '&:hover': { bgcolor: '#0f172a' }
                        }}
                    >
                        Tamam
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PosReceiptDialog Wrapper
// ─────────────────────────────────────────────────────────────────────────────
export function PosReceiptDialog() {
    const store = usePosStore();

    const data: ReceiptData | null = store.receiptData ? {
        invoiceNumber: store.receiptData.invoiceNumber,
        date: new Date(store.receiptData.createdAt),
        customerName: store.receiptData.customer?.title || 'Perakende Müşteri',
        salespersonName: store.receiptData.salesAgent?.fullName,
        items: (store.receiptData.items || []).map((it: any) => ({
            name: it.name,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            discountAmount: it.discountTotal || 0,
            lineTotal: it.netTotal
        })),
        subtotal: store.receiptData.subtotal,
        totalDiscount: store.receiptData.discountTotal,
        vatAmount: store.receiptData.taxTotal,
        grandTotal: store.receiptData.grandTotal,
        payments: (store.receiptData.payments || []).map((p: any) => ({
            label: p.method === 'cash' ? 'Nakit' : p.method === 'credit_card' ? 'Kredi Kartı' : p.method === 'transfer' ? 'Havale' : 'Diğer',
            amount: p.amount
        })),
        note: store.receiptData.note
    } : null;

    function handleClose() {
        store.setReceiptDialogOpen(false);
        store.clearCart();
    }

    return (
        <ReceiptDialog
            open={store.receiptDialogOpen}
            data={data}
            onClose={handleClose}
        />
    );
}
