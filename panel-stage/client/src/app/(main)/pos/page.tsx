'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Box, Typography, alpha, useTheme, Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
import MainLayout from '@/components/Layout/MainLayout';
import ProductGrid from './components/ProductGrid';
import { CartPanel } from './components/CartPanel';
import { PosReceiptDialog } from './components/ReceiptDialog';
import PaymentDialog from './components/PaymentDialog';
import { usePosStore } from '@/stores/posStore';
import axios from '@/lib/axios';

// ─────────────────────────────────────────────────────────────────────────────
// Toast tipi
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Topbar — saatli başlık çubuğu
// ─────────────────────────────────────────────────────────────────────────────
function PosTopbar() {
  const theme = useTheme();
  const [clock, setClock] = useState('--:--');

  useEffect(() => {
    function tick() {
      setClock(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box
      sx={{
        height: 56,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 2,
        flexShrink: 0,
        zIndex: 100,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`
      }}
    >
      <Box
        sx={{
          fontSize: 16,
          fontWeight: 800,
          color: 'primary.main',
          letterSpacing: '-0.02e',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box sx={{
          width: 34,
          height: 34,
          borderRadius: 1.25,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          Oto<Box component="span" sx={{ color: 'primary.main' }}>Muhasebe</Box>
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, alignSelf: 'center' }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', opacity: 0.8 }}>Hızlı Satış Ekranı</Typography>

      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.2),
            borderRadius: 5,
            fontSize: 11,
            fontWeight: 800,
            color: 'primary.main',
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}
        >
          <Box
            sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: `0 0 8px ${theme.palette.primary.main}` }}
          />
          VARSAYILAN AMBAR
        </Box>

        <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />

        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: 'text.primary',
            minWidth: 45
          }}
        >
          {clock}
        </Typography>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POS Ana Sayfa
// ─────────────────────────────────────────────────────────────────────────────
export default function PosPage() {
  const theme = useTheme();
  const store = usePosStore();
  const { enqueueSnackbar } = useSnackbar();

  const bufferRef = useRef('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function showToast(message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') {
    enqueueSnackbar(message, { variant: severity });
  }

  // ── Barkod Tarayıcı Handler ─────────────────────────────────────────────
  const processBarcode = useCallback(
    async (barcode: string) => {
      if (!barcode.trim()) return;
      try {
        const res = await axios.get(`/pos/products/barcode/${encodeURIComponent(barcode)}`);
        const data: Array<{
          id: string;
          name: string;
          salePrice: number;
          vatRate: number;
          hasVariants?: boolean;
          productVariants?: unknown[];
          stock?: number;
        }> = Array.isArray(res.data) ? res.data : [res.data];

        if (data.length === 0) {
          showToast('Ürün bulunamadı', 'error');
          return;
        }

        const product = data[0];

        if (product.productVariants && product.productVariants.length > 0) {
          showToast('Varyantlı ürün — lütfen menüden seçin', 'info');
          return;
        }

        store.addToCart({
          productId: product.id,
          name: product.name,
          unitPrice: Number(product.salePrice) || 0,
          vatRate: product.vatRate ?? 20,
          quantity: 1,
        });
        showToast(`${product.name} sepete eklendi`, 'success');
      } catch {
        showToast('Ürün bulunamadı', 'error');
      }
    },
    [store]
  );

  // ── Klavye dinleyici (Barkod) ────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          (active as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (e.key === 'Enter') {
        if (bufferRef.current.length > 0) {
          e.preventDefault();
          const b = bufferRef.current;
          bufferRef.current = '';
          processBarcode(b);
        }
        return;
      }

      if (e.key === 'Escape') {
        bufferRef.current = '';
        return;
      }

      if (e.key.length === 1 && /^[a-zA-Z0-9]$/.test(e.key)) {
        bufferRef.current += e.key;
        timeoutRef.current = setTimeout(() => {
          if (bufferRef.current.length > 0) {
            const b = bufferRef.current;
            bufferRef.current = '';
            processBarcode(b);
          }
          timeoutRef.current = null;
        }, 500);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [processBarcode]);

  function handleReceiptClose() {
    store.setReceiptDialogOpen(false);
    store.clearCart();
  }

  return (
    <MainLayout>
      <Box
        id="pos-root"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 112px)',
          bgcolor: 'background.default',
          color: 'text.primary',
          overflow: 'hidden',
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <PosTopbar />

        <Box
          className="pos-main-split"
          sx={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* Sol: Ürün Kataloğu */}
          <Box
            className="pos-left-panel"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderRight: { xs: 'none', md: '1px solid' },
              borderBottom: { xs: '1px solid', md: 'none' },
              borderColor: 'divider',
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            <ProductGrid />
          </Box>

          {/* Sağ: Sepet */}
          <Box
            className="pos-right-panel"
            sx={{
              width: { xs: '100%', md: 520, lg: 620 },
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              bgcolor: 'background.paper'
            }}
          >
            <CartPanel />
          </Box>
        </Box>
      </Box>


      <PosReceiptDialog />

      <PaymentDialog />
    </MainLayout>
  );
}
