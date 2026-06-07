'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  DialogActions,
  Button,
  IconButton,
  Divider,
  Grid,
  alpha,
  useTheme
} from '@mui/material';
import { Close, Print } from '@mui/icons-material';

interface ReceiptComponentProps {
  open: boolean;
  onClose: () => void;
  receiptData: {
    invoiceNumber: string;
    date: Date;
    items: Array<{
      productName: string;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>;
    subtotal: number;
    vatAmount: number;
    discount: number;
    grandTotal: number;
    paymentMethods: string[];
    cashierName?: string;
  };
}

export default function ReceiptComponent({
  open,
  onClose,
  receiptData,
}: ReceiptComponentProps) {
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, bgcolor: 'background.paper' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Satış Fişi</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 0 }}>
        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.4), borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: 1 }}>
              OtoMuhasebe
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>BILGI FIŞI</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Invoice Info */}
          <Box sx={{ mb: 2, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Fatura No</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{receiptData.invoiceNumber}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Tarih</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatDate(receiptData.date)}</Typography>
            </Box>
            {receiptData.cashierName && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Kasiyer</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{receiptData.cashierName}</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Items */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, display: 'block' }}>ÜRÜNLER</Typography>
            {receiptData.items.map((item, index) => (
              <Box key={index} sx={{ py: 1, borderBottom: '1px dashed', borderColor: 'divider' }}>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 800, mb: 0.5 }}>{item.productName}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {item.quantity} adet × {formatCurrency(item.unitPrice)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 800 }}>{formatCurrency(item.amount)}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Totals */}
          <Box sx={{ mb: 2, pt: 1, gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Ara Toplam</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatCurrency(receiptData.subtotal)}</Typography>
            </Box>
            {receiptData.discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.main' }}>İndirim</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.main' }}>−{formatCurrency(receiptData.discount)}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>KDV</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatCurrency(receiptData.vatAmount)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: '2px solid', borderColor: 'text.primary' }}>
              <Typography sx={{ fontWeight: 900, fontSize: '0.875rem' }}>GENEL TOPLAM</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', color: 'primary.main' }}>{formatCurrency(receiptData.grandTotal)}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Payment Methods */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 0.5, display: 'block' }}>ÖDEME YÖNTEMLERI</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {receiptData.paymentMethods.map((method, index) => (
                <Typography key={index} variant="caption" sx={{ fontWeight: 700, bgcolor: 'action.hover', px: 1, py: 0.25, borderRadius: 1 }}>
                  {method}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic', display: 'block', lineHeight: 1.4 }}>
              * Bilgi amaçlıdır, mali değeri yoktur.
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic', display: 'block', lineHeight: 1.4 }}>
              * İade ve değişim fiş ile yapılır.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<Print />}
          onClick={() => window.print()}
          sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, textTransform: 'none' }}
        >
          Yazdır
        </Button>
        <Button
          onClick={onClose}
          sx={{ py: 1.5, px: 3, borderRadius: 3, fontWeight: 700, textTransform: 'none', color: 'text.secondary', border: '1px solid', borderColor: 'divider' }}
        >
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
}
