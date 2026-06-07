// ─────────────────────────────────────────────────────────────────────────────
// OtoMuhasebe POS — Tip Tanımları
// ─────────────────────────────────────────────────────────────────────────────

export interface CartItem {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;        // orijinal birim fiyatı (indirim öncesi)
    vatRate: number;          // örn: 8 veya 20
    discountType: 'pct' | 'amt'; // yüzde veya sabit tutar / birim
    discountValue: number;    // indirim değeri (% veya ₺/birim)
    discountAmount: number;   // hesaplanan: bu satır için toplam indirim (adet × indirim)
    variantId?: string;
    variantName?: string;
}

export interface PosPayment {
    method: 'cash' | 'credit_card' | 'transfer' | 'other';
    label: string;
    amount: number;
    bankAccountId?: string;
    cashboxId?: string;
    giftCardId?: string;
    installmentCount?: number;
}

export interface GlobalDiscount {
    type: 'pct' | 'amt';
    value: number;
}

export interface SelectedPerson {
    id: string;
    code: string;
    title: string;
}

export interface CartTotals {
    subtotal: number;              // tüm indirimlerin öncesi (adet × birimFiyat) toplamı
    itemDiscountTotal: number;     // tüm ürün-seviyesi discountAmount'larının toplamı
    globalDiscountAmount: number;
    totalDiscount: number;         // itemDiscountTotal + globalDiscountAmount
    vatAmount: number;             // tüm indirimlerden sonra hesaplanan KDV
    grandTotal: number;            // ödenecek son tutar
}

export interface PosState {
    // Sepet
    cart: CartItem[];
    cartTotals: CartTotals;
    cartNote: string;

    // Seçimler
    selectedCustomer: SelectedPerson | null;
    selectedSalesperson: SelectedPerson | null;

    // Ödeme
    payments: PosPayment[];
    remaining: number;

    // Genel indirim
    globalDiscount: GlobalDiscount;

    // UI
    variantDialogOpen: boolean;
    receiptDialogOpen: boolean;
    paymentDialogOpen: boolean;
    selectedProductForVariant: AddToCartPayload | null;
    receiptData: any | null;
    cashboxId: string | null;
    warehouseId: string | null;

    // Eylemler — sepet
    addToCart: (product: AddToCartPayload) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, delta: number) => void;
    applyItemDiscount: (productId: string, type: 'pct' | 'amt', value: number) => void;
    applyGlobalDiscount: (type: 'pct' | 'amt', value: number) => void;
    clearGlobalDiscount: () => void;
    setCartNote: (note: string) => void;
    clearCart: () => void;

    // Eylemler — seçimler
    setSelectedCustomer: (customer: SelectedPerson | null) => void;
    setSelectedSalesperson: (person: SelectedPerson | null) => void;

    // Eylemler — ödeme
    addPayment: (payment: PosPayment) => void;
    removePayment: (index: number) => void;
    clearPayments: () => void;

    // Eylemler — oturum
    setCashbox: (id: string | null) => void;
    setWarehouse: (id: string | null) => void;
    setVariantDialogOpen: (open: boolean) => void;
    setSelectedProductForVariant: (product: AddToCartPayload | null) => void;
    setReceiptDialogOpen: (open: boolean) => void;
    setPaymentDialogOpen: (open: boolean) => void;

    // Eylemler — ödeme tamamlama
    completeCheckout: () => Promise<CheckoutResult>;
}

export interface AddToCartPayload {
    productId: string;
    name: string;
    unitPrice: number;
    vatRate: number;
    quantity?: number;
    variantId?: string;
    variantName?: string;
}

export interface CheckoutResult {
    invoiceId: string;
    invoiceNumber: string;
    grandTotal: number;
    status: string;
}
