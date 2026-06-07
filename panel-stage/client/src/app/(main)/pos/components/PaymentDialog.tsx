'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  AlertTitle,
  alpha,
  useTheme
} from '@mui/material';
import { Close, Warning } from '@mui/icons-material';
import { usePosStore } from '@/stores/posStore';
import type { PosPayment } from '@/app/(main)/pos/types/pos.types';

function mapUiCodeToPosPayment(code: string): Pick<PosPayment, 'method' | 'label'> {
  switch (code) {
    case 'NAKIT':
      return { method: 'cash', label: 'Nakit' };
    case 'KREDI_KARTI':
      return { method: 'credit_card', label: 'Kredi Kartı' };
    case 'BANKA_HAVALESI':
      return { method: 'transfer', label: 'Banka Havale' };
    case 'CEK':
      return { method: 'other', label: 'Çek' };
    case 'SENET':
      return { method: 'other', label: 'Senet' };
    case 'HEDIYE_KARTI':
      return { method: 'other', label: 'Hediye Kartı' };
    case 'KREDI_HESABI':
      return { method: 'other', label: 'Kredi Hesabı' };
    default:
      return { method: 'other', label: code || 'Diğer' };
  }
}

const fmt = (n: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

export default function PaymentDialog() {
  const theme = useTheme();
  const {
    paymentDialogOpen,
    setPaymentDialogOpen,
    cartTotals,
    payments,
    remaining,
    addPayment,
    removePayment,
    clearPayments,
  } = usePosStore();

  const cartTotal = cartTotals.grandTotal;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [cashboxId, setCashboxId] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');
  const [giftCardId, setGiftCardId] = useState('');
  const [error, setError] = useState('');

  const handleAddPayment = () => {
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Lütfen geçerli bir tutar girin.');
      return;
    }

    const paymentAmount = parseFloat(amount);
    const currentTotalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const newTotalPaid = currentTotalPaid + paymentAmount;

    if (newTotalPaid > cartTotal + 0.001) {
      setError(`Ödenen tutar (${fmt(newTotalPaid)}) sepet toplamından (${fmt(cartTotal)}) büyük olamaz!`);
      return;
    }

    const { method, label } = mapUiCodeToPosPayment(paymentMethod);
    const payment: PosPayment = {
      method,
      label,
      amount: paymentAmount,
      ...(cashboxId && { cashboxId }),
      ...(bankAccountId && { bankAccountId }),
      ...(giftCardId && { giftCardId }),
    };

    addPayment(payment);

    setPaymentMethod('');
    setAmount('');
    setCashboxId('');
    setBankAccountId('');
    setGiftCardId('');

    if (Math.abs(cartTotal - newTotalPaid) < 0.01) {
      setPaymentDialogOpen(false);
    }
  };

  const handleClose = () => {
    setPaymentDialogOpen(false);
    setPaymentMethod('');
    setAmount('');
    setCashboxId('');
    setBankAccountId('');
    setGiftCardId('');
    setError('');
  };

  return (
    <Dialog
      open={paymentDialogOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, bgcolor: 'background.paper', p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem' }}>
        Parçalı / Karma Ödeme
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert
            severity="warning"
            variant="filled"
            sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>
            ÖDEME BEKLEYEN TUTAR
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
            {fmt(remaining)}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>ÖDEME YÖNTEMİ</Typography>
            <Select
              fullWidth
              size="small"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as string)}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="" disabled>Yöntem Seçin</MenuItem>
              <MenuItem value="NAKIT">Nakit</MenuItem>
              <MenuItem value="KREDI_KARTI">Kredi Kartı</MenuItem>
              <MenuItem value="BANKA_HAVALESI">Banka Havalesi</MenuItem>
              <MenuItem value="CEK">Çek</MenuItem>
              <MenuItem value="SENET">Senet</MenuItem>
              <MenuItem value="HEDIYE_KARTI">Hediye Kartı</MenuItem>
              <MenuItem value="KREDI_HESABI">Cari Kredi</MenuItem>
            </Select>
          </Grid>

          <Grid size={12}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>TUTAR</Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                sx: { borderRadius: 2, fontWeight: 700 }
              }}
            />
          </Grid>

          {paymentMethod === 'NAKIT' && (
            <Grid size={12}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>KASA</Typography>
              <Select
                fullWidth
                size="small"
                value={cashboxId}
                onChange={(e) => setCashboxId(e.target.value as string)}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">Varsayılan Kasa</MenuItem>
              </Select>
            </Grid>
          )}

          {paymentMethod === 'BANKA_HAVALESI' && (
            <Grid size={12}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>BANKA HESABI</Typography>
              <Select
                fullWidth
                size="small"
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value as string)}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">Hesap Seçin</MenuItem>
              </Select>
            </Grid>
          )}

          {paymentMethod === 'HEDIYE_KARTI' && (
            <Grid size={12}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>KART NO</Typography>
              <TextField
                fullWidth
                size="small"
                value={giftCardId}
                onChange={(e) => setGiftCardId(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1.5, display: 'block' }}>
            EKLENEN ÖDEMELER
          </Typography>
          {payments.length === 0 ? (
            <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>Henüz ödeme eklenmedi.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {payments.map((payment, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    bgcolor: alpha(theme.palette.background.default, 0.6),
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>{payment.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{fmt(payment.amount)}</Typography>
                  </Box>
                  <IconButton size="small" onClick={() => removePayment(index)} sx={{ color: 'error.main' }}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ py: 1.25, px: 3, borderRadius: 2.5, fontWeight: 700, textTransform: 'none', color: 'text.secondary' }}
        >
          Kapat
        </Button>
        <Button
          onClick={() => {
            if (confirm('Tüm ödemeler silinsin mi?')) clearPayments();
          }}
          variant="outlined"
          color="error"
          sx={{ py: 1.25, px: 2, borderRadius: 2.5, fontWeight: 700, textTransform: 'none' }}
        >
          Temizle
        </Button>
        <Button
          onClick={handleAddPayment}
          variant="contained"
          disabled={!amount || parseFloat(amount) <= 0}
          sx={{ py: 1.25, px: 4, borderRadius: 2.5, fontWeight: 800, textTransform: 'none' }}
        >
          Ödeme Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
}
