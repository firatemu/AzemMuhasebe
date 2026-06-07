import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/lib/axios';
import type {
  CartItem,
  CartTotals,
  GlobalDiscount,
  PosPayment,
  PosState,
  SelectedPerson,
  AddToCartPayload,
  CheckoutResult,
} from '@/app/(main)/pos/types/pos.types';

// ─────────────────────────────────────────────────────────────────────────────
// Yeniden hesaplama fonksiyonu — güncel recalcTotals mantığı
// ─────────────────────────────────────────────────────────────────────────────
function recalcTotals(
  cart: CartItem[],
  globalDiscount: GlobalDiscount
): CartTotals {
  let subtotal = 0; // KDV dahil brüt ara toplam
  let itemDiscountTotal = 0;
  let vatAmount = 0;

  cart.forEach((item) => {
    // unitPrice artık KDV DAHİL
    const lineRaw = item.quantity * item.unitPrice;

    // Ürün seviyesinde indirim (Brüt tutar üzerinden)
    let itemDisc = 0;
    if (item.discountType === 'pct') {
      itemDisc = lineRaw * (item.discountValue / 100);
    } else {
      // 'amt' = birim başı indirim, satır toplamıyla sınırlandırılır
      itemDisc = Math.min(item.discountValue * item.quantity, lineRaw);
    }
    item.discountAmount = itemDisc; // yerinde güncelle

    subtotal += lineRaw;
    itemDiscountTotal += itemDisc;

    // KDV, brüt net tutar üzerinden iç yüzde ile hesaplanır
    // Formül: Tutar * (KDV_Oranı / (100 + KDV_Oranı))
    const lineNetAfterDisc = lineRaw - itemDisc;
    const lineVat = lineNetAfterDisc * (item.vatRate / (100 + item.vatRate));
    vatAmount += lineVat;
  });

  // Genel indirim (Brüt tutara uygulanır)
  const afterItemDisc = subtotal - itemDiscountTotal;
  let globalDiscountAmount = 0;
  if (globalDiscount.value > 0) {
    if (globalDiscount.type === 'pct') {
      globalDiscountAmount = afterItemDisc * (globalDiscount.value / 100);
    } else {
      globalDiscountAmount = Math.min(globalDiscount.value, afterItemDisc);
    }

    // Genel indirim oransal olarak KDV'yi de düşürür
    if (afterItemDisc > 0) {
      vatAmount = vatAmount * (1 - globalDiscountAmount / afterItemDisc);
    }
  }

  const totalDiscount = itemDiscountTotal + globalDiscountAmount;
  const grandTotal = subtotal - totalDiscount; // Zaten brüt üzerinden gidiyoruz

  return {
    subtotal,
    itemDiscountTotal,
    globalDiscountAmount,
    totalDiscount,
    vatAmount,
    grandTotal,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Boş toplam değerleri
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_TOTALS: CartTotals = {
  subtotal: 0,
  itemDiscountTotal: 0,
  globalDiscountAmount: 0,
  totalDiscount: 0,
  vatAmount: 0,
  grandTotal: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────
export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      // ── Başlangıç Durumu ──────────────────────────────────────────────────
      cart: [],
      cartTotals: EMPTY_TOTALS,
      cartNote: '',

      selectedCustomer: null,
      selectedSalesperson: null,

      payments: [],
      remaining: 0,

      globalDiscount: { type: 'pct', value: 0 },

      variantDialogOpen: false,
      receiptDialogOpen: false,
      paymentDialogOpen: false,
      selectedProductForVariant: null,
      receiptData: null,
      cashboxId: null,
      warehouseId: null,

      // ── Sepet Eylemleri ──────────────────────────────────────────────────
      addToCart: (product: AddToCartPayload) =>
        set((state) => {
          const existing = state.cart.find(
            (i) => i.productId === product.productId && i.variantId === product.variantId
          );

          let newCart: CartItem[];
          if (existing) {
            newCart = state.cart.map((i) =>
              i.productId === product.productId && i.variantId === product.variantId
                ? { ...i, quantity: i.quantity + (product.quantity ?? 1) }
                : i
            );
          } else {
            const newItem: CartItem = {
              productId: product.productId,
              name: product.name,
              quantity: product.quantity ?? 1,
              unitPrice: product.unitPrice,
              vatRate: product.vatRate,
              discountType: 'pct',
              discountValue: 0,
              discountAmount: 0,
              variantId: product.variantId,
              variantName: product.variantName,
            };
            newCart = [...state.cart, newItem];
          }

          const cartTotals = recalcTotals(newCart, state.globalDiscount);
          const totalPaid = state.payments.reduce((s, p) => s + p.amount, 0);

          return {
            cart: newCart,
            cartTotals,
            remaining: Math.max(0, cartTotals.grandTotal - totalPaid),
          };
        }),

      removeFromCart: (productId: string) =>
        set((state) => {
          const newCart = state.cart.filter((i) => i.productId !== productId);
          const cartTotals = recalcTotals(newCart, state.globalDiscount);
          const totalPaid = state.payments.reduce((s, p) => s + p.amount, 0);
          return {
            cart: newCart,
            cartTotals,
            remaining: Math.max(0, cartTotals.grandTotal - totalPaid),
          };
        }),

      updateQuantity: (productId: string, delta: number) =>
        set((state) => {
          const newCart = state.cart.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, i.quantity + delta) }
              : i
          );
          const cartTotals = recalcTotals(newCart, state.globalDiscount);
          const totalPaid = state.payments.reduce((s, p) => s + p.amount, 0);
          return {
            cart: newCart,
            cartTotals,
            remaining: Math.max(0, cartTotals.grandTotal - totalPaid),
          };
        }),

      applyItemDiscount: (productId: string, type: 'pct' | 'amt', value: number) =>
        set((state) => {
          const newCart = state.cart.map((i) =>
            i.productId === productId
              ? { ...i, discountType: type, discountValue: value }
              : i
          );
          const cartTotals = recalcTotals(newCart, state.globalDiscount);
          const totalPaid = state.payments.reduce((s, p) => s + p.amount, 0);
          return {
            cart: newCart,
            cartTotals,
            remaining: Math.max(0, cartTotals.grandTotal - totalPaid),
          };
        }),

      applyGlobalDiscount: (type: 'pct' | 'amt', value: number) =>
        set((state) => {
          const globalDiscount: GlobalDiscount = { type, value };
          const cartTotals = recalcTotals(state.cart, globalDiscount);
          const totalPaid = state.payments.reduce((s, p) => s + p.amount, 0);
          return {
            globalDiscount,
            cartTotals,
            remaining: Math.max(0, cartTotals.grandTotal - totalPaid),
          };
        }),

      clearGlobalDiscount: () =>
        set((state) => {
          const globalDiscount: GlobalDiscount = { type: 'pct', value: 0 };
          const cartTotals = recalcTotals(state.cart, globalDiscount);
          const totalPaid = state.payments.reduce((s, p) => s + p.amount, 0);
          return {
            globalDiscount,
            cartTotals,
            remaining: Math.max(0, cartTotals.grandTotal - totalPaid),
          };
        }),

      setCartNote: (note: string) => set({ cartNote: note }),

      clearCart: () =>
        set({
          cart: [],
          cartTotals: EMPTY_TOTALS,
          cartNote: '',
          payments: [],
          remaining: 0,
          globalDiscount: { type: 'pct', value: 0 },
          selectedCustomer: null,
          selectedSalesperson: null,
          paymentDialogOpen: false,
        }),

      // ── Seçim Eylemleri ──────────────────────────────────────────────────
      setSelectedCustomer: (customer: SelectedPerson | null) =>
        set({ selectedCustomer: customer }),

      setSelectedSalesperson: (person: SelectedPerson | null) =>
        set({ selectedSalesperson: person }),

      // ── Ödeme Eylemleri ──────────────────────────────────────────────────
      addPayment: (payment: PosPayment) =>
        set((state) => {
          const newPayments = [...state.payments, payment];
          const totalPaid = newPayments.reduce((s, p) => s + p.amount, 0);
          return {
            payments: newPayments,
            remaining: Math.max(0, state.cartTotals.grandTotal - totalPaid),
          };
        }),

      removePayment: (index: number) =>
        set((state) => {
          const newPayments = state.payments.filter((_, i) => i !== index);
          const totalPaid = newPayments.reduce((s, p) => s + p.amount, 0);
          return {
            payments: newPayments,
            remaining: Math.max(0, state.cartTotals.grandTotal - totalPaid),
          };
        }),

      clearPayments: () =>
        set((state) => ({
          payments: [],
          remaining: state.cartTotals.grandTotal,
        })),

      // ── Oturum Eylemleri ─────────────────────────────────────────────────
      setCashbox: (id: string | null) => set({ cashboxId: id }),
      setWarehouse: (id: string | null) => set({ warehouseId: id }),
      setVariantDialogOpen: (open: boolean) => set({ variantDialogOpen: open }),
      setSelectedProductForVariant: (product) =>
        set({ selectedProductForVariant: product }),
      setReceiptDialogOpen: (open: boolean) => set({ receiptDialogOpen: open }),
      setPaymentDialogOpen: (open: boolean) => set({ paymentDialogOpen: open }),

      // ── Ödeme Tamamlama ──────────────────────────────────────────────────
      completeCheckout: async (): Promise<CheckoutResult> => {
        const state = get();

        if (state.cart.length === 0) {
          throw new Error('Sepet boş');
        }
        if (!state.selectedCustomer) {
          throw new Error('Lütfen bir müşteri seçiniz.');
        }

        // Adım 1: Taslak oluştur
        const draftRes = await axios.post('/pos/cart/draft', {
          accountId: state.selectedCustomer.id,
          salesAgentId: state.selectedSalesperson?.id ?? null,
          salespersonId: state.selectedSalesperson?.id ?? null, // backup
          warehouseId: state.warehouseId,
          cashboxId: state.cashboxId,
          notes: state.cartNote || undefined,
          note: state.cartNote || undefined, // backup
          items: state.cart.map((item) => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            vatRate: item.vatRate,
            discountType: item.discountType === 'amt' ? 'fixed' : item.discountType,
            discountValue: item.discountValue,
            variantId: item.variantId ?? undefined,
          })),
          globalDiscount:
            state.globalDiscount.value > 0
              ? {
                type: state.globalDiscount.type === 'amt' ? 'fixed' : state.globalDiscount.type,
                value: state.globalDiscount.value
              }
              : undefined,
        });

        const invoiceId: string = draftRes.data.id;
        console.log('Draft created:', draftRes.data);
        console.log('Completing checkout for invoiceId:', invoiceId);

        // Adım 2: Tamamla
        const completeRes = await axios.post(`/pos/cart/${invoiceId}/complete`, {
          payments: state.payments.map((p) => ({
            paymentMethod: p.method === 'credit_card'
              ? 'CREDIT_CARD'
              : p.method === 'transfer'
                ? 'BANK_TRANSFER'
                : p.method === 'other'
                  ? 'LOAN_ACCOUNT'
                  : p.method.toUpperCase(),
            amount: p.amount,
            ...(p.bankAccountId && { bankAccountId: p.bankAccountId }),
            ...(p.cashboxId && { cashboxId: p.cashboxId }),
            ...(p.giftCardId && { giftCardId: p.giftCardId }),
            ...(p.installmentCount && { installmentCount: p.installmentCount }),
          })),
          ...(state.cashboxId && { cashboxId: state.cashboxId }),
        });

        // Başarılı
        set({ receiptData: completeRes.data });
        state.clearCart();
        state.setReceiptDialogOpen(true);
        return {
          invoiceId: completeRes.data.invoiceId,
          invoiceNumber: completeRes.data.invoiceNumber,
          grandTotal: completeRes.data.grandTotal,
          status: 'success',
        };
      },
    }),
    {
      name: 'pos-v2',
    }
  )
);
