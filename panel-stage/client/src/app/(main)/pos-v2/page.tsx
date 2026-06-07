'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  alpha,
  useTheme,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Tooltip,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  PointOfSale as PosIcon,
  QrCodeScanner as BarcodeIcon,
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  LocalOffer as DiscountIcon,
  PointOfSale,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import MainLayout from '@/components/Layout/MainLayout';
import axios from '@/lib/axios';

interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  discountType?: 'pct' | 'amt';
  discountValue?: number;
  discountAmount?: number;
  variantId?: string;
  variantName?: string;
}

interface CartTotals {
  subtotal: number;
  itemDiscountTotal: number;
  globalDiscountAmount: number;
  totalDiscount: number;
  vatAmount: number;
  grandTotal: number;
}

interface Payment {
  method: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'OTHER';
  amount: number;
  cashboxId?: string;
  bankAccountId?: string;
}

interface SalesAgent {
  id: string;
  fullName: string;
}

interface Cashbox {
  id: string;
  name: string;
  balance: number;
}

interface BankAccount {
  id: string;
  accountName: string;
  balance: number;
}

interface Product {
  id: string;
  name: string;
  barcode?: string;
  salePrice: number;
  vatRate: number;
  stock?: number;
  hasVariants?: boolean;
}

interface Session {
  id: string;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
  closedAt?: string;
}

export default function PosV2Page() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotals, setCartTotals] = useState<CartTotals>({
    subtotal: 0,
    itemDiscountTotal: 0,
    globalDiscountAmount: 0,
    totalDiscount: 0,
    vatAmount: 0,
    grandTotal: 0,
  });
  const [cartNote, setCartNote] = useState('');

  // Session state
  const [session, setSession] = useState<Session | null>(null);
  const [cashbox, setCashbox] = useState<Cashbox | null>(null);

  // Product lookup
  const [barcodeInput, setBarcodeInput] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // Payments
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER'>('CASH');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [cashboxes, setCashboxes] = useState<Cashbox[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedCashboxId, setSelectedCashboxId] = useState('');
  const [selectedBankAccountId, setSelectedBankAccountId] = useState('');

  // Sales agents
  const [salesAgents, setSalesAgents] = useState<SalesAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Receipt
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  // Session dialog
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);

  // Refs
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const bufferRef = useRef('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate totals
  const recalcTotals = useCallback((items: CartItem[], globalDiscount: { type: 'pct' | 'amt'; value: number }) => {
    let subtotal = 0;
    let itemDiscountTotal = 0;
    let vatAmount = 0;

    items.forEach((item) => {
      const lineRaw = item.quantity * item.unitPrice;
      let itemDisc = 0;
      if (item.discountType === 'pct') {
        itemDisc = lineRaw * ((item.discountValue || 0) / 100);
      } else if (item.discountType === 'amt') {
        itemDisc = Math.min((item.discountValue || 0) * item.quantity, lineRaw);
      }
      item.discountAmount = itemDisc;
      subtotal += lineRaw;
      itemDiscountTotal += itemDisc;

      const lineNetAfterDisc = lineRaw - itemDisc;
      const lineVat = lineNetAfterDisc * (item.vatRate / (100 + item.vatRate));
      vatAmount += lineVat;
    });

    const afterItemDisc = subtotal - itemDiscountTotal;
    let globalDiscountAmount = 0;
    if (globalDiscount.value > 0) {
      if (globalDiscount.type === 'pct') {
        globalDiscountAmount = afterItemDisc * (globalDiscount.value / 100);
      } else {
        globalDiscountAmount = Math.min(globalDiscount.value, afterItemDisc);
      }
    }

    const totalDiscount = itemDiscountTotal + globalDiscountAmount;
    const grandTotal = subtotal - totalDiscount;

    return { subtotal, itemDiscountTotal, globalDiscountAmount, totalDiscount, vatAmount, grandTotal };
  }, []);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Keyboard listener for barcode scanner
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)
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
          const barcode = bufferRef.current;
          bufferRef.current = '';
          handleBarcodeLookup(barcode);
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
            const barcode = bufferRef.current;
            bufferRef.current = '';
            handleBarcodeLookup(barcode);
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
  }, []);

  const loadInitialData = async () => {
    try {
      const [cashboxRes, agentsRes, activeCartsRes] = await Promise.all([
        axios.get('/pos/retail-cashbox'),
        axios.get('/pos/sales-agents'),
        axios.get('/pos/carts/active'),
      ]);

      if (cashboxRes.data) {
        setCashbox(cashboxRes.data);
        setSelectedCashboxId(cashboxRes.data.id);
      }
      setSalesAgents(agentsRes.data || []);

      // Check for active session from carts
      if (activeCartsRes.data && activeCartsRes.data.length > 0) {
        // There may be an active cart
      }
    } catch (error) {
      console.error('Initial data load error:', error);
    }
  };

  const handleBarcodeLookup = async (barcode: string) => {
    if (!barcode.trim()) return;
    try {
      const response = await axios.get(`/pos/products/barcode/${encodeURIComponent(barcode)}`);
      const products: Product[] = Array.isArray(response.data) ? response.data : [response.data];

      if (products.length === 0) {
        enqueueSnackbar('Ürün bulunamadı', { variant: 'error' });
        return;
      }

      const product = products[0];
      if (product.hasVariants) {
        enqueueSnackbar('Varyantlı ürün - lütfen ürün aramasından seçin', { variant: 'info' });
        return;
      }

      addToCart({
        productId: product.id,
        name: product.name,
        unitPrice: Number(product.salePrice) || 0,
        vatRate: product.vatRate ?? 20,
        quantity: 1,
      });
      enqueueSnackbar(`${product.name} sepete eklendi`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Ürün bulunamadı', { variant: 'error' });
    }
  };

  const addToCart = (product: Omit<CartItem, 'discountAmount'>) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.productId && i.variantId === product.variantId
      );

      let newCart: CartItem[];
      if (existing) {
        newCart = prev.map((i) =>
          i.productId === product.productId && i.variantId === product.variantId
            ? { ...i, quantity: i.quantity + (product.quantity ?? 1) }
            : i
        );
      } else {
        const newItem: CartItem = {
          ...product,
          discountType: 'pct',
          discountValue: 0,
          discountAmount: 0,
        };
        newCart = [...prev, newItem];
      }

      const totals = recalcTotals(newCart, { type: 'pct', value: 0 });
      setCartTotals(totals);
      return newCart;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const newCart = prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0);

      const totals = recalcTotals(newCart, { type: 'pct', value: 0 });
      setCartTotals(totals);
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter((i) => i.productId !== productId);
      const totals = recalcTotals(newCart, { type: 'pct', value: 0 });
      setCartTotals(totals);
      return newCart;
    });
  };

  const handleOpenSession = async () => {
    try {
      const response = await axios.post('/pos/session/open', {
        cashboxId: selectedCashboxId,
      });
      setSession(response.data);
      enqueueSnackbar('POS oturumu açıldı', { variant: 'success' });
      setSessionDialogOpen(false);
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Oturum açılamadı', { variant: 'error' });
    }
  };

  const handleCloseSession = async () => {
    try {
      await axios.post(`/pos/session/${session?.id}/close`, {
        cashboxId: selectedCashboxId,
      });
      setSession(null);
      enqueueSnackbar('POS oturumu kapatıldı', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Oturum kapatılamadı', { variant: 'error' });
    }
  };

  const handleSearchProducts = async () => {
    if (!productSearch.trim()) return;
    try {
      // Using a general product search endpoint
      const response = await axios.get(`/products?search=${encodeURIComponent(productSearch)}`);
      setSearchResults(response.data.results || response.data || []);
      setSearchDialogOpen(true);
    } catch (error) {
      enqueueSnackbar('Ürün aranamadı', { variant: 'error' });
    }
  };

  const handleAddPayment = () => {
    if (paymentAmount <= 0) {
      enqueueSnackbar('Geçerli bir tutar girin', { variant: 'warning' });
      return;
    }

    const payment: Payment = {
      method: paymentMethod,
      amount: paymentAmount,
    };

    if (paymentMethod === 'CASH') {
      payment.cashboxId = selectedCashboxId;
    } else if (paymentMethod === 'CREDIT_CARD' || paymentMethod === 'BANK_TRANSFER') {
      payment.bankAccountId = selectedBankAccountId;
    }

    setPayments((prev) => [...prev, payment]);
    setPaymentAmount(0);
    enqueueSnackbar('Ödeme eklendi', { variant: 'success' });
  };

  const handleRemovePayment = (index: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      enqueueSnackbar('Sepet boş', { variant: 'warning' });
      return;
    }

    if (payments.length === 0) {
      enqueueSnackbar('En az bir ödeme ekleyin', { variant: 'warning' });
      return;
    }

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid < cartTotals.grandTotal) {
      enqueueSnackbar('Ödeme tutarı toplamdan az', { variant: 'warning' });
      return;
    }

    try {
      // Step 1: Create draft cart
      const draftRes = await axios.post('/pos/cart/draft', {
        salesAgentId: selectedAgentId,
        cashboxId: selectedCashboxId,
        notes: cartNote,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          variantId: item.variantId,
        })),
      });

      const invoiceId = draftRes.data.id;

      // Step 2: Complete sale
      const completeRes = await axios.post(`/pos/cart/${invoiceId}/complete`, {
        payments: payments.map((p) => ({
          paymentMethod: p.method,
          amount: p.amount,
          cashboxId: p.cashboxId,
          bankAccountId: p.bankAccountId,
        })),
        cashboxId: selectedCashboxId,
      });

      setReceiptData(completeRes.data);
      setReceiptDialogOpen(true);
      handleClearCart();
      enqueueSnackbar('Satış tamamlandı', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || 'Satış tamamlanamadı', { variant: 'error' });
    }
  };

  const handleClearCart = () => {
    setCart([]);
    setCartTotals({
      subtotal: 0,
      itemDiscountTotal: 0,
      globalDiscountAmount: 0,
      totalDiscount: 0,
      vatAmount: 0,
      grandTotal: 0,
    });
    setCartNote('');
    setPayments([]);
  };

  const handleReturn = () => {
    // TODO: Implement return flow
    enqueueSnackbar('İade özelliği yakında eklenecek', { variant: 'info' });
  };

  const remaining = cartTotals.grandTotal - payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <MainLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 112px)',
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            height: 64,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            gap: 2,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PointOfSale />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>POS v2</Typography>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Session Status */}
          <Chip
            icon={session ? <StopIcon /> : <PlayIcon />}
            label={session ? `Oturum Açık (${new Date(session.openedAt).toLocaleTimeString('tr-TR')})` : 'Oturum Kapalı'}
            color={session ? 'success' : 'default'}
            sx={{ fontWeight: 800 }}
            onClick={() => setSessionDialogOpen(true)}
          />

          {cashbox && (
            <Chip
              label={cashbox.name}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          )}

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<BarcodeIcon />}
              onClick={() => {
                setProductSearch('');
                setSearchDialogOpen(true);
              }}
              sx={{ fontWeight: 700 }}
            >
              Ürün Ara
            </Button>
            {session ? (
              <Button
                variant="contained"
                size="small"
                color="error"
                startIcon={<StopIcon />}
                onClick={handleCloseSession}
                sx={{ fontWeight: 700 }}
              >
                Oturumu Kapat
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                startIcon={<PlayIcon />}
                onClick={() => setSessionDialogOpen(true)}
                sx={{ fontWeight: 700 }}
              >
                Oturum Aç
              </Button>
            )}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Panel - Product Search & Cart Input */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
          {/* Barcode Input */}
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField
              inputRef={barcodeInputRef}
              fullWidth
              placeholder="Barkod girin veya tarayın..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleBarcodeLookup(barcodeInput);
                  setBarcodeInput('');
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BarcodeIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            />
          </Box>

          {/* Cart Items */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <Stack spacing={1.5}>
              {cart.map((item) => (
                <Paper
                  key={`${item.productId}-${item.variantId || 'no-var'}`}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {item.name}
                      </Typography>
                      {item.variantName && (
                        <Typography variant="caption" color="text.secondary">
                          {item.variantName}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        ₺{item.unitPrice.toLocaleString()} × {item.quantity}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton size="small" onClick={() => updateQuantity(item.productId, -1)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 30, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item.productId, 1)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => removeFromCart(item.productId)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Paper>
              ))}

              {cart.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 800 }}>
                    Sepet Boş
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Barkod tarayarak veya ürün arayarak ürün ekleyin
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Right Panel - Cart Summary & Payments */}
        <Box
          sx={{
            width: { xs: '100%', md: 420, lg: 480 },
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          {/* Totals */}
          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.04), borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Ara Toplam (KDV Dahil)</Typography>
                <Typography sx={{ fontWeight: 700 }}>₺{cartTotals.subtotal.toLocaleString()}</Typography>
              </Box>
              {cartTotals.totalDiscount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="error.main">Toplam İndirim</Typography>
                  <Typography color="error.main" sx={{ fontWeight: 700 }}>
                                                        -₺{cartTotals.totalDiscount.toLocaleString()}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">KDV</Typography>
                <Typography sx={{ fontWeight: 700 }}>₺{cartTotals.vatAmount.toLocaleString()}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Genel Toplam</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ₺{cartTotals.grandTotal.toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Payments Summary */}
          {payments.length > 0 && (
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Ödemeler ({payments.length})
              </Typography>
              <Stack spacing={1}>
                {payments.map((p, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={p.method === 'CASH' ? 'Nakit' : p.method === 'CREDIT_CARD' ? 'Kredi Kartı' : 'Havale'}
                      size="small"
                      variant="outlined"
                    />
                    <Typography sx={{ fontWeight: 700 }}>₺{p.amount.toLocaleString()}</Typography>
                    <IconButton size="small" color="error" onClick={() => handleRemovePayment(i)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Kalan</Typography>
                <Typography
                  sx={{ fontWeight: 800, color: remaining > 0 ? 'error.main' : 'success.main' }}
                >
                  ₺{Math.abs(remaining).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setPaymentDialogOpen(true)}
                disabled={cart.length === 0}
                fullWidth
                sx={{ fontWeight: 800, borderRadius: 2, py: 1.5 }}
              >
                Ödeme Ekle
              </Button>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<ReceiptIcon />}
                  onClick={handleCompleteSale}
                  disabled={cart.length === 0 || payments.length === 0 || remaining > 0}
                  fullWidth
                  sx={{ fontWeight: 800, borderRadius: 2, py: 1.5 }}
                >
                  Satışı Tamamla
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  size="large"
                  onClick={handleReturn}
                  disabled={cart.length === 0}
                  sx={{ fontWeight: 800, borderRadius: 2 }}
                >
                  İade
                </Button>
              </Stack>

              <Button
                variant="text"
                color="error"
                onClick={handleClearCart}
                disabled={cart.length === 0}
                sx={{ fontWeight: 700 }}
              >
                Sepeti Temizle
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
      </Box>

      {/* Search Product Dialog */}
      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Ürün Ara</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Ürün adı veya barkod..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchProducts()}
              autoFocus
            />
            <Button variant="contained" onClick={handleSearchProducts} sx={{ fontWeight: 800 }}>
              Ara
            </Button>
          </Box>
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {searchResults.map((product) => (
              <ListItem
                key={product.id}
                component="button"
                onClick={() => {
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    unitPrice: Number(product.salePrice) || 0,
                    vatRate: product.vatRate ?? 20,
                    quantity: 1,
                  });
                  setSearchDialogOpen(false);
                  enqueueSnackbar(`${product.name} sepete eklendi`, { variant: 'success' });
                }}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 1 }}
              >
                <ListItemText
                  primary={product.name}
                  secondary={
                    <Stack direction="row" spacing={2}>
                      {product.barcode && <Typography variant="caption">{product.barcode}</Typography>}
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        ₺{Number(product.salePrice).toLocaleString()}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
            {searchResults.length === 0 && (
              <ListItem>
                <ListItemText secondary="Sonuç bulunamadı" />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)} sx={{ fontWeight: 700 }}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Ödeme Ekle</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Ödeme Yöntemi</InputLabel>
              <Select
                value={paymentMethod}
                label="Ödeme Yöntemi"
                onChange={(e) => setPaymentMethod(e.target.value as any)}
              >
                <MenuItem value="CASH">Nakit (Kasa)</MenuItem>
                <MenuItem value="CREDIT_CARD">Kredi Kartı</MenuItem>
                <MenuItem value="BANK_TRANSFER">Banka Havalesi</MenuItem>
              </Select>
            </FormControl>

            {paymentMethod === 'CASH' && (
              <FormControl fullWidth>
                <InputLabel>Kasa</InputLabel>
                <Select
                  value={selectedCashboxId}
                  label="Kasa"
                  onChange={(e) => setSelectedCashboxId(e.target.value)}
                >
                  {cashboxes.map((cb) => (
                    <MenuItem key={cb.id} value={cb.id}>
                      {cb.name} (₺{cb.balance})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {paymentMethod === 'CREDIT_CARD' || paymentMethod === 'BANK_TRANSFER' ? (
              <FormControl fullWidth>
                <InputLabel>Banka Hesabı</InputLabel>
                <Select
                  value={selectedBankAccountId}
                  label="Banka Hesabı"
                  onChange={(e) => setSelectedBankAccountId(e.target.value)}
                >
                  {bankAccounts.map((ba) => (
                    <MenuItem key={ba.id} value={ba.id}>
                      {ba.accountName} (₺{ba.balance})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}

            <TextField
              fullWidth
              label="Tutar"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
              autoFocus
              InputProps={{
                startAdornment: <InputAdornment position="start">₺</InputAdornment>,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPaymentDialogOpen(false)} sx={{ fontWeight: 700 }}>İptal</Button>
          <Button variant="contained" onClick={() => { handleAddPayment(); setPaymentDialogOpen(false); }} sx={{ fontWeight: 800 }}>
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialogOpen} onClose={() => setReceiptDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Fiş</DialogTitle>
        <DialogContent>
          {receiptData && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                Satış Tamamlandı
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'left' }}>
                <Typography variant="body2">Fatura No: {receiptData.invoiceNumber || receiptData.id}</Typography>
                <Typography variant="body2">Tarih: {new Date().toLocaleDateString('tr-TR')}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Toplam: ₺{cartTotals.grandTotal.toLocaleString()}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setReceiptDialogOpen(false)} variant="contained" sx={{ fontWeight: 800 }}>
            Tamam
          </Button>
        </DialogActions>
      </Dialog>

      {/* Session Dialog */}
      <Dialog open={sessionDialogOpen} onClose={() => setSessionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>POS Oturumu</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {session ? (
              <Alert severity="success">
                Aktif bir POS oturumunuz bulunmaktadır. Satış yapabilirsiniz.
              </Alert>
            ) : (
              <>
                <Alert severity="info">
                  Satış yapabilmek için bir POS oturumu açmanız gerekmektedir.
                </Alert>
                <FormControl fullWidth>
                  <InputLabel>Kasa</InputLabel>
                  <Select
                    value={selectedCashboxId}
                    label="Kasa"
                    onChange={(e) => setSelectedCashboxId(e.target.value)}
                  >
                    {cashboxes.map((cb) => (
                      <MenuItem key={cb.id} value={cb.id}>
                        {cb.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSessionDialogOpen(false)} sx={{ fontWeight: 700 }}>Kapat</Button>
          {!session && (
            <Button variant="contained" onClick={handleOpenSession} sx={{ fontWeight: 800 }}>
              Oturum Aç
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}
