'use client';

import React, { useState } from 'react';
import { TextField, Box, Typography, Button, alpha, useTheme, Divider, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from '@/lib/axios';
import { usePosStore } from '@/stores/posStore';
import { SelectorBox } from './SelectorBox';
import { CartItemRow } from './CartItemRow';
import { ItemDiscountModal } from './ItemDiscountModal';
import { GlobalDiscountBar } from './GlobalDiscountBar';
import { PaymentModal } from './PaymentModal';
import type { CartItem, PosPayment, SelectedPerson } from '../types/pos.types';
import { AxiosError } from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Yardımcı
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

// ─────────────────────────────────────────────────────────────────────────────
// SVG İkonları
// ─────────────────────────────────────────────────────────────────────────────
function EmptyBagIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CartPanel
// ─────────────────────────────────────────────────────────────────────────────
export function CartPanel() {
  const theme = useTheme();
  const store = usePosStore();

  // Modal durumları
  const [discountItem, setDiscountItem] = useState<CartItem | null>(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'transfer' | 'other' | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  function showToast(msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
    enqueueSnackbar(msg, { variant: type });
  }

  // ── Müşteri Arama ─────────────────────────────────────────────────────────
  async function fetchCustomers(search: string): Promise<SelectedPerson[]> {
    try {
      const res = await axios.get('/account', {
        params: { search, limit: 20 },
      });
      const data = res.data?.data ?? res.data ?? [];
      return data.map((d: any) => ({
        id: d.id,
        code: d.code,
        title: d.title,
      }));
    } catch {
      return [];
    }
  }

  // ── Satış Elemanı Arama ───────────────────────────────────────────────────
  async function fetchSalespeople(search: string): Promise<SelectedPerson[]> {
    try {
      const res = await axios.get('/pos/sales-agents', {
        params: { search },
      });
      const data = res.data ?? [];
      return data.map((d: any) => ({
        id: d.id,
        code: '',
        title: d.fullName,
      }));
    } catch {
      return [];
    }
  }

  // ── İndirim Modal ─────────────────────────────────────────────────────────
  function openDiscountModal(productId: string) {
    const item = store.cart.find((i) => i.productId === productId);
    if (item) {
      setDiscountItem(item);
      setDiscountModalOpen(true);
    }
  }

  // ── Ödeme Modal ───────────────────────────────────────────────────────────
  function openPaymentModal(method: 'cash' | 'credit_card' | 'transfer' | 'other') {
    if (store.cart.length === 0) {
      showToast('Sepet boş', 'warning');
      return;
    }
    setPaymentMethod(method);
    setPaymentModalOpen(true);
  }

  function handlePaymentConfirm(payment: PosPayment) {
    store.addPayment(payment);
    showToast('Ödeme eklendi', 'success');
  }

  // ── Sepeti Temizle ────────────────────────────────────────────────────────
  function handleClearCart() {
    if (store.cart.length === 0) return;
    if (confirm('Sepet ve ödemeler temizlensin mi?')) {
      store.clearCart();
      showToast('Sepet temizlendi', 'info');
    }
  }

  // ── Ödeme Tamamla ─────────────────────────────────────────────────────────
  async function handleCheckout() {
    setLoading(true);
    try {
      await store.completeCheckout();
      showToast('Satış tamamlandı', 'success');
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message ?? err.message
          : err instanceof Error
            ? err.message
            : 'Satış tamamlanamadı';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── Ödeme durumu ──────────────────────────────────────────────────────────
  const totalPaid = store.payments.reduce((s, p) => s + p.amount, 0);
  const grandTotal = store.cartTotals.grandTotal;
  const isFullyPaid = store.payments.length > 0 && Math.abs(totalPaid - grandTotal) < 0.01;
  const canComplete =
    store.cart.length > 0 &&
    store.selectedCustomer !== null &&
    isFullyPaid;

  // Ödeme butonu renk tanımları
  const payBtnColor = {
    cash: { main: theme.palette.success.main, light: alpha(theme.palette.success.main, 0.08) },
    credit_card: { main: theme.palette.primary.main, light: alpha(theme.palette.primary.main, 0.08) },
    transfer: { main: theme.palette.warning.main, light: alpha(theme.palette.warning.main, 0.08) },
    other: { main: theme.palette.secondary.main, light: alpha(theme.palette.secondary.main, 0.08) },
  };

  function isMethodActive(method: string) {
    return store.payments.some((p) => p.method === method);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sol Kolon: Seçiciler + Sepet + Not */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid',
          borderColor: 'divider',
          minWidth: 0
        }}>
          {/* 1. Seçiciler */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <SelectorBox
              label="Cari Hesap"
              placeholder="Cari hesap seçin..."
              value={store.selectedCustomer}
              onSelect={store.setSelectedCustomer}
              onClear={() => store.setSelectedCustomer(null)}
              fetchOptions={fetchCustomers}
              accentColor="accent"
              icon="person"
            />
            <SelectorBox
              label="Satış Elemanı"
              placeholder="Satış elemanı seçin..."
              value={store.selectedSalesperson}
              onSelect={store.setSelectedSalesperson}
              onClear={() => store.setSelectedSalesperson(null)}
              fetchOptions={fetchSalespeople}
              accentColor="pink"
              icon="salesperson"
            />
          </Box>

          {/* 2. Sepet Öğeleri */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              bgcolor: alpha(theme.palette.background.default, 0.4)
            }}
          >
            {store.cart.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: 1.5,
                  opacity: 0.2,
                  color: 'text.secondary'
                }}
              >
                <EmptyBagIcon />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Sepet boş</Typography>
              </Box>
            ) : (
              store.cart.map((item) => (
                <CartItemRow
                  key={item.productId + (item.variantId ?? '')}
                  item={item}
                  onQuantityChange={store.updateQuantity}
                  onRemove={store.removeFromCart}
                  onDiscountClick={openDiscountModal}
                />
              ))
            )}
          </Box>

          {/* 3. Fatura Notu */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TextField
              multiline
              minRows={1}
              maxRows={2}
              fullWidth
              placeholder="Fatura notu ekle..."
              value={store.cartNote}
              onChange={(e) => store.setCartNote(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: alpha(theme.palette.background.default, 0.6),
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        </Box>

        {/* Sağ Kolon: İndirim + Toplam + Ödeme + Tamamla */}
        <Box sx={{
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(theme.palette.background.default, 0.2)
        }}>
          {/* 4. İndirim Barı */}
          <GlobalDiscountBar
            discount={store.globalDiscount}
            cartSubtotal={store.cartTotals.subtotal - store.cartTotals.itemDiscountTotal}
            onApply={store.applyGlobalDiscount}
            onClear={store.clearGlobalDiscount}
          />

          {/* 5. Toplamlar */}
          <Box
            sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.background.default, 0.8),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Ara toplam</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{fmt(store.cartTotals.subtotal)}</Typography>
            </Box>

            {store.cartTotals.totalDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 700 }}>İndirim</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.main' }}>−{fmt(store.cartTotals.totalDiscount)}</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>KDV</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{fmt(store.cartTotals.vatAmount)}</Typography>
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Genel Toplam</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>{fmt(store.cartTotals.grandTotal)}</Typography>
            </Box>
          </Box>

          {/* 6. Hızlı Ödeme */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', flex: 1, overflowY: 'auto' }}>
            <Typography variant="overline" sx={{ fontSize: 10, fontWeight: 800, color: 'text.secondary', mb: 1.5, display: 'block' }}>HIZLI ÖDEME</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.5 }}>
              {[
                { method: 'cash' as const, label: 'Nakit', icon: 'N' },
                { method: 'credit_card' as const, label: 'Kart', icon: 'K' },
                { method: 'transfer' as const, label: 'Havale', icon: 'H' },
                { method: 'other' as const, label: 'Diğer', icon: 'D' },
              ].map((p) => {
                const active = isMethodActive(p.method);
                return (
                  <Button
                    key={p.method}
                    onClick={() => openPaymentModal(p.method)}
                    variant={active ? 'contained' : 'outlined'}
                    color={p.method === 'cash' ? 'success' : p.method === 'credit_card' ? 'primary' : p.method === 'transfer' ? 'warning' : 'secondary'}
                    sx={{ height: 46, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                  >
                    {p.label}
                  </Button>
                );
              })}
            </Box>

            <Button
              fullWidth
              onClick={() => store.setPaymentDialogOpen(true)}
              variant="outlined"
              sx={{ mb: 2, height: 40, borderRadius: 2, borderStyle: 'dashed', textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
            >
              Parçalı / Karma Ödeme
            </Button>

            {store.payments.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {store.payments.map((p, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: alpha(theme.palette.background.default, 0.8), borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{p.label}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.8125rem' }}>{fmt(p.amount)}</Typography>
                      <Button size="small" sx={{ minWidth: 20, p: 0 }} onClick={() => store.removePayment(idx)}>✕</Button>
                    </Box>
                  </Box>
                ))}

                <Box sx={{ p: 1.5, borderRadius: 2, mt: 0.5, bgcolor: isFullyPaid ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.warning.main, 0.08), color: isFullyPaid ? 'success.main' : 'warning.main', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{isFullyPaid ? 'TAMAMLANDI' : 'KALAN'}</Typography>
                  {!isFullyPaid && <Typography sx={{ fontWeight: 900 }}>{fmt(store.remaining)}</Typography>}
                </Box>
              </Box>
            )}
          </Box>

          {/* 7. Tamamla */}
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Button
              fullWidth
              disabled={!canComplete || loading}
              onClick={handleCheckout}
              variant="contained"
              size="large"
              sx={{ py: 2, borderRadius: 3, fontWeight: 800, textTransform: 'none' }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
            >
              {loading ? 'İşleniyor...' : 'Satışı Tamamla'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Modaller */}
      <ItemDiscountModal
        open={discountModalOpen}
        item={discountItem}
        onClose={() => setDiscountModalOpen(false)}
        onApply={(productId, type, value) => {
          store.applyItemDiscount(productId, type, value);
          showToast('İndirim uygulandı', 'success');
        }}
      />

      <PaymentModal
        open={paymentModalOpen}
        method={paymentMethod}
        remaining={store.remaining}
        cartTotal={store.cartTotals.grandTotal}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
      />

    </Box>
  );
}