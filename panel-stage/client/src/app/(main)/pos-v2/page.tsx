'use client';

import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { usePosStore } from '@/stores/posStore';
import axios from '@/lib/axios';
import { CartItemRow } from '../pos/components/CartItemRow';
import { ItemDiscountModal } from '../pos/components/ItemDiscountModal';
import { GlobalDiscountBar } from '../pos/components/GlobalDiscountBar';
import { PaymentModal } from '../pos/components/PaymentModal';
import PaymentDialog from '../pos/components/PaymentDialog';
import { ReceiptSlip, ReceiptData } from '../pos/components/ReceiptSlip';
import Dialog from '@mui/material/Dialog';
import { SelectorBox } from '../pos/components/SelectorBox';
import type { CartItem, PosPayment, SelectedPerson } from '../pos/types/pos.types';
import { AxiosError } from 'axios';
import { useReactToPrint } from 'react-to-print';

// ─────────────────────────────────────────────────────────────────────────────
// Yardımcılar
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);

import { useSnackbar } from 'notistack';

interface ProductResult {
    id: string;
    name: string;
    salePrice: number;
    vatRate: number;
    barcode?: string;
    sku?: string;
    stock?: number;
    hasVariants?: boolean;
    productVariants?: unknown[];
}

// ─────────────────────────────────────────────────────────────────────────────
// POS V2 Ana Sayfa
// ─────────────────────────────────────────────────────────────────────────────
export default function PosV2Page() {
    const store = usePosStore();
    const { enqueueSnackbar } = useSnackbar();
    const [clock, setClock] = useState('--:--');

    // Arama durumu
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ProductResult[]>([]);

    const receiptPrintRef = useRef<HTMLDivElement>(null);
    const handlePrintReceipt = useReactToPrint({
        contentRef: receiptPrintRef,
        documentTitle: 'Bilgi-Fisi',
    });

    // Fiş Önizleme Verisi
    const previewReceiptData: ReceiptData | null = useMemo(() => {
        if (!store.receiptDialogOpen || store.cart.length === 0) return null;

        const now = new Date();
        const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return {
            companyName: 'AZEM YAZILIM',
            companySubtitle: 'Hızlı Satış Noktası · POS V2',
            date: dateStr,
            time: timeStr,
            cashRegister: 'Kasa #1',
            documentNo: 'FIS-ONIZLEME-' + Math.floor(Math.random() * 10000),
            currentAccount: store.selectedCustomer?.title || null,
            items: store.cart.map(item => ({
                name: item.name + (item.variantName ? ` (${item.variantName})` : ''),
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                originalPrice: item.discountValue > 0 ? (item.discountType === 'pct' ? item.unitPrice / (1 - item.discountValue / 100) : item.unitPrice + item.discountValue) : null,
                discountRate: item.discountType === 'pct' ? item.discountValue : null,
                lineTotal: item.quantity * item.unitPrice - item.discountAmount
            })),
            subtotal: store.cartTotals.subtotal,
            generalDiscount: store.cartTotals.globalDiscountAmount > 0 ? store.cartTotals.globalDiscountAmount : null,
            generalDiscountRate: store.globalDiscount.type === 'pct' ? store.globalDiscount.value : null,
            vatAmount: store.cartTotals.vatAmount,
            vatRate: 20,
            grandTotal: store.cartTotals.grandTotal,
            paymentMethod: 'Önizleme',
            amountPaid: null, // Henüz ödeme yapılmadı
            companyFullName: 'AZEM YAZILIM Ltd. Şti.',
            address: 'Adana Teknokent, No:12 · Seyhan / ADANA',
            phone: '(0322) 000 00 00'
        };
    }, [store.receiptDialogOpen, store.cart, store.cartTotals, store.globalDiscount, store.selectedCustomer]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Modal durumları
    const [discountItem, setDiscountItem] = useState<CartItem | null>(null);
    const [discountModalOpen, setDiscountModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'transfer' | 'other' | null>(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

    // Barkod buffer
    const bufferRef = useRef('');
    const barcodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Saat
    useEffect(() => {
        const tick = () => {
            setClock(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    // ── Toast ────────────────────────────────────────────────────────────────
    function showToast(message: string, type: ToastState['type'] = 'info') {
        enqueueSnackbar(message, { variant: type });
    }

    // ── Ürün arama (API) ─────────────────────────────────────────────────────
    const searchProducts = useCallback(async (query: string) => {
        if (!query.trim() || query.length < 2) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        try {
            const res = await axios.get('/products', { params: { search: query, limit: 12, page: 1 } });
            const data = res.data?.data || res.data || [];
            setSearchResults(Array.isArray(data) ? data : []);
        } catch {
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (searchQuery.length >= 2) {
            searchTimeoutRef.current = setTimeout(() => searchProducts(searchQuery), 280);
        } else {
            setSearchResults([]);
        }
        return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
    }, [searchQuery, searchProducts]);

    // ── Barkodla ürün getirme ─────────────────────────────────────────────────
    const processBarcode = useCallback(async (barcode: string) => {
        if (!barcode.trim()) return;
        try {
            const res = await axios.get(`/pos/products/barcode/${encodeURIComponent(barcode)}`);
            const data: ProductResult[] = Array.isArray(res.data) ? res.data : [res.data];
            if (!data.length) { showToast('Ürün bulunamadı', 'error'); return; }
            const product = data[0];
            if (product.productVariants && product.productVariants.length > 0) {
                showToast('Varyantlı ürün — listeden seçin', 'info');
                setSearchQuery(barcode);
                searchRef.current?.focus();
                return;
            }
            addProductToCart(product);
        } catch {
            showToast('Barkod bulunamadı', 'error');
        }
    }, []);

    // ── Sepete ürün ekle ──────────────────────────────────────────────────────
    function addProductToCart(product: ProductResult) {
        store.addToCart({
            productId: product.id,
            name: product.name,
            unitPrice: Number(product.salePrice) || 0,
            vatRate: product.vatRate ?? 20,
            quantity: 1,
        });
        setSearchQuery('');
        setSearchResults([]);
        searchRef.current?.focus();
        showToast(`✓ ${product.name} eklendi`, 'success');
    }

    // ── Klavye barkod tarayıcı ────────────────────────────────────────────────
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)) return;
            if (barcodeTimeoutRef.current) { clearTimeout(barcodeTimeoutRef.current); barcodeTimeoutRef.current = null; }
            if (e.key === 'Enter') {
                if (bufferRef.current.length > 0) { e.preventDefault(); const b = bufferRef.current; bufferRef.current = ''; processBarcode(b); }
                return;
            }
            if (e.key === 'Escape') { bufferRef.current = ''; return; }
            if (e.key.length === 1 && /^[a-zA-Z0-9]$/.test(e.key)) {
                bufferRef.current += e.key;
                barcodeTimeoutRef.current = setTimeout(() => {
                    if (bufferRef.current.length > 0) { const b = bufferRef.current; bufferRef.current = ''; processBarcode(b); }
                    barcodeTimeoutRef.current = null;
                }, 500);
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => { window.removeEventListener('keydown', onKeyDown); if (barcodeTimeoutRef.current) clearTimeout(barcodeTimeoutRef.current); };
    }, [processBarcode]);

    // ── Dışarı tıklandığında dropdown kapat ──────────────────────────────────
    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                searchRef.current && !searchRef.current.contains(e.target as Node)
            ) {
                setSearchFocused(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // ── Müşteri / Satış elemanı ───────────────────────────────────────────────
    async function fetchCustomers(search: string): Promise<SelectedPerson[]> {
        try {
            const res = await axios.get('/account', { params: { search, limit: 20 } });
            const data = res.data?.data ?? res.data ?? [];
            return data.map((d: { id: string; code: string; title: string }) => ({ id: d.id, code: d.code, title: d.title }));
        } catch { return []; }
    }
    async function fetchSalespeople(search: string): Promise<SelectedPerson[]> {
        try {
            const res = await axios.get('/pos/sales-agents', { params: { search } });
            const data = res.data ?? [];
            return data.map((d: { id: string; fullName: string }) => ({ id: d.id, code: '', title: d.fullName }));
        } catch { return []; }
    }

    // ── Ödeme ─────────────────────────────────────────────────────────────────
    function openPaymentModal(method: 'cash' | 'credit_card' | 'transfer' | 'other') {
        if (store.cart.length === 0) { showToast('Sepet boş', 'warning'); return; }
        setPaymentMethod(method);
        setPaymentModalOpen(true);
    }
    function handlePaymentConfirm(payment: PosPayment) {
        store.addPayment(payment);
        showToast('Ödeme eklendi', 'success');
    }
    async function handleCheckout() {
        setCheckoutLoading(true);
        try {
            await store.completeCheckout();
            showToast('✓ Satış tamamlandı', 'success');
        } catch (err: unknown) {
            const msg = err instanceof AxiosError ? err.response?.data?.message ?? err.message : err instanceof Error ? err.message : 'Satış tamamlanamadı';
            showToast(msg, 'error');
        } finally {
            setCheckoutLoading(false);
        }
    }
    function handleClearCart() {
        if (store.cart.length === 0) return;
        if (confirm('Sepet ve ödemeler temizlensin mi?')) { store.clearCart(); showToast('Sepet temizlendi', 'info'); }
    }

    // ── Hesaplamalar ──────────────────────────────────────────────────────────
    const totalPaid = store.payments.reduce((s, p) => s + p.amount, 0);
    const grandTotal = store.cartTotals.grandTotal;
    const isFullyPaid = store.payments.length > 0 && Math.abs(totalPaid - grandTotal) < 0.01;
    const canComplete = store.cart.length > 0 && store.selectedCustomer !== null && isFullyPaid;
    const cartCount = store.cart.reduce((s, i) => s + i.quantity, 0);
    const showDropdown = searchFocused && (searchResults.length > 0 || searchLoading) && searchQuery.length >= 2;

    const paymentMethods = useMemo(() => [
        {
            method: 'cash' as const, label: 'Nakit', emoji: '💵',
            activeColor: '#10b981', activeBg: 'rgba(16,185,129,0.1)', activeBorder: 'rgba(16,185,129,0.4)'
        },
        {
            method: 'credit_card' as const, label: 'Kredi Kartı', emoji: '💳',
            activeColor: '#3b82f6', activeBg: 'rgba(59,130,246,0.1)', activeBorder: 'rgba(59,130,246,0.4)'
        },
        {
            method: 'transfer' as const, label: 'Havale', emoji: '🏦',
            activeColor: '#f59e0b', activeBg: 'rgba(245,158,11,0.1)', activeBorder: 'rgba(245,158,11,0.4)'
        },
        {
            method: 'other' as const, label: 'Diğer', emoji: '🔄',
            activeColor: '#8b5cf6', activeBg: 'rgba(139,92,246,0.1)', activeBorder: 'rgba(139,92,246,0.4)'
        },
    ], []);

    return (
        <MainLayout>
            <div id="posv2-root" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 112px)', background: 'var(--bg)', color: 'var(--text)', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>

                {/* ── TOPBAR ── */}
                <header style={{ height: 54, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, flexShrink: 0, zIndex: 50 }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>POS <span style={{ color: '#6366f1' }}>V2</span></div>
                            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.05em', marginTop: 4 }}>HIZLI SATIŞ</div>
                        </div>
                    </div>

                    {/* Orta: Durumlar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>AKTİF</span>
                        </div>
                        {store.selectedCustomer && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1' }}>👤 {store.selectedCustomer.title}</span>
                            </div>
                        )}
                    </div>

                    {/* Sağ: Sepet özet + Saat */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                        {cartCount > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ padding: '6px 14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#6366f1' }}>
                                    🛒 {cartCount} ürün
                                </div>
                                <div style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: '#10b981' }}>
                                    {fmt(grandTotal)}
                                </div>
                            </div>
                        )}
                        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 600, color: 'var(--muted)' }}>{clock}</div>
                    </div>
                </header>

                {/* ── ANA İÇERİK (İKİ SÜTUN) ── */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* ====== SOL SÜTUN: ARAMA + SEPET ====== */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

                        {/* Cari + Satış Elemanı */}
                        <div style={{ padding: '14px 20px 0', flexShrink: 0, display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <SelectorBox
                                    label="Cari Hesap"
                                    placeholder="Cari hesap ara..."
                                    value={store.selectedCustomer}
                                    onSelect={store.setSelectedCustomer}
                                    onClear={() => store.setSelectedCustomer(null)}
                                    fetchOptions={fetchCustomers}
                                    accentColor="accent"
                                    icon="person"
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <SelectorBox
                                    label="Satış Elemanı"
                                    placeholder="Satış elemanı ara..."
                                    value={store.selectedSalesperson}
                                    onSelect={store.setSelectedSalesperson}
                                    onClear={() => store.setSelectedSalesperson(null)}
                                    fetchOptions={fetchSalespeople}
                                    accentColor="pink"
                                    icon="salesperson"
                                />
                            </div>
                        </div>

                        {/* ── ARAMA ALANI ── */}
                        <div style={{ padding: '14px 20px', flexShrink: 0, position: 'relative' }}>
                            {/* Arama Kutusu */}
                            <div style={{ position: 'relative' }}>
                                {/* Barkod ikonu */}
                                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M3 5v14M7 5v14M11 5v14M15 5v10M19 5v10M17 17l2 2 4-4" />
                                    </svg>
                                </div>

                                <input
                                    ref={searchRef}
                                    id="posv2-search"
                                    type="text"
                                    placeholder="Barkod okutun veya ürün adı/kodu girin..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && searchResults.length > 0) {
                                            e.preventDefault();
                                            addProductToCart(searchResults[0]);
                                        }
                                        if (e.key === 'Escape') {
                                            setSearchQuery('');
                                            setSearchFocused(false);
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        height: 60,
                                        padding: '0 20px 0 48px',
                                        background: 'var(--surface)',
                                        border: searchFocused ? '2px solid #6366f1' : '1.5px solid var(--border)',
                                        borderRadius: 14,
                                        fontSize: 18,
                                        fontWeight: 500,
                                        color: 'var(--text)',
                                        fontFamily: "'DM Sans', sans-serif",
                                        outline: 'none',
                                        transition: 'all .18s',
                                        boxSizing: 'border-box',
                                        boxShadow: searchFocused ? '0 0 0 4px rgba(99,102,241,0.12), 0 2px 8px rgba(2,6,23,0.08)' : '0 1px 3px rgba(2,6,23,0.06)',
                                    }}
                                />

                                {/* Yükleniyor */}
                                {searchLoading && (
                                    <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" style={{ animation: 'posv2-spin 1s linear infinite' }}>
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                        </svg>
                                    </div>
                                )}

                                {/* Temizle butonu */}
                                {searchQuery && !searchLoading && (
                                    <button
                                        onClick={() => { setSearchQuery(''); setSearchResults([]); searchRef.current?.focus(); }}
                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 18, padding: 4, lineHeight: 1 }}
                                    >×</button>
                                )}
                            </div>

                            {/* Hint */}
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--muted)' }}>
                                <span>⌨️ Barkod tarayıcıyla otomatik algılar</span>
                                <span>↵ İlk sonucu eklemek için Enter</span>
                            </div>

                            {/* ── DROPDOWN SONUÇLAR ── */}
                            {showDropdown && (
                                <div
                                    ref={dropdownRef}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 20,
                                        right: 20,
                                        background: 'var(--surface)',
                                        border: '1.5px solid rgba(99,102,241,0.25)',
                                        borderRadius: 14,
                                        boxShadow: '0 16px 40px rgba(2,6,23,0.14)',
                                        zIndex: 99,
                                        overflow: 'hidden',
                                        maxHeight: 380,
                                        overflowY: 'auto',
                                    }}
                                >
                                    {searchResults.map((product, idx) => {
                                        const price = Number(product.salePrice) || 0;
                                        return (
                                            <div
                                                key={product.id}
                                                onClick={() => { addProductToCart(product); setSearchFocused(false); }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '12px 16px',
                                                    cursor: 'pointer',
                                                    borderBottom: idx < searchResults.length - 1 ? '1px solid var(--border)' : 'none',
                                                    transition: 'background .1s',
                                                    gap: 12,
                                                }}
                                                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--surface2)'}
                                                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                                            >
                                                {/* Ürün renk avatarı */}
                                                <div style={{ width: 38, height: 38, borderRadius: 10, background: `hsl(${(product.name.charCodeAt(0) * 137) % 360}, 55%, ${getComputedStyle(document.documentElement).getPropertyValue('color-scheme').includes('dark') ? '30' : '88'}%)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>
                                                    {product.name[0]?.toUpperCase()}
                                                </div>
                                                {/* Bilgiler */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {product.name}
                                                        {product.hasVariants && <span style={{ marginLeft: 6, fontSize: 12, padding: '2px 6px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: 4, fontWeight: 700 }}>VARYANT</span>}
                                                    </div>
                                                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                                                        {product.barcode && <span>📊 {product.barcode}</span>}
                                                        {product.sku && <span style={{ marginLeft: 8 }}>SKU: {product.sku}</span>}
                                                        {product.stock !== undefined && <span style={{ marginLeft: 8, color: product.stock > 0 ? '#10b981' : '#ef4444' }}>Stok: {product.stock}</span>}
                                                    </div>
                                                </div>
                                                {/* Fiyat */}
                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 700, color: '#6366f1' }}>{fmt(price)}</div>
                                                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>+KDV %{product.vatRate}</div>
                                                </div>
                                                {/* Ekle anı */}
                                                <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontSize: 20, fontWeight: 700 }}>+</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ── SEPET ÖĞELERİ ── */}
                        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                            {/* Sepet başlık */}
                            <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--surface)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                                        </svg>
                                    </div>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Sepet</span>
                                    {cartCount > 0 && (
                                        <div style={{ padding: '2px 10px', background: '#6366f1', color: '#fff', borderRadius: 20, fontSize: 14, fontWeight: 700 }}>{cartCount}</div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        onClick={() => { if (store.cart.length === 0) return; store.setReceiptDialogOpen(true); }}
                                        style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}
                                    >
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                                        Önizle
                                    </button>
                                    <button
                                        onClick={handleClearCart}
                                        style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                    >
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                        Temizle
                                    </button>
                                </div>
                            </div>

                            {/* Liste */}
                            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}>
                                {store.cart.length === 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, padding: 40 }}>
                                        <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--surface2)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.2">
                                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                                            </svg>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>Sepet Boş</div>
                                            <div style={{ fontSize: 13, color: 'var(--dim)' }}>Yukarıdan ürün arayın veya barkod okutun</div>
                                        </div>
                                    </div>
                                ) : (
                                    store.cart.map(item => (
                                        <CartItemRow
                                            key={item.productId + (item.variantId ?? '')}
                                            item={item}
                                            onQuantityChange={store.updateQuantity}
                                            onRemove={store.removeFromCart}
                                            onDiscountClick={(productId) => {
                                                const found = store.cart.find(i => i.productId === productId);
                                                if (found) { setDiscountItem(found); setDiscountModalOpen(true); }
                                            }}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Fatura Notu */}
                            {store.cart.length > 0 && (
                                <div style={{ padding: '10px 20px 14px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--surface)' }}>
                                    <input
                                        type="text"
                                        placeholder="Fatura notu..."
                                        value={store.cartNote}
                                        onChange={e => store.setCartNote(e.target.value)}
                                        style={{ width: '100%', padding: '8px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text)', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ====== SAĞ SÜTUN: ÖZET + ÖDEME ====== */}
                    <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden' }}>

                        {/* Genel İndirim */}
                        <GlobalDiscountBar
                            discount={store.globalDiscount}
                            cartSubtotal={store.cartTotals.subtotal - store.cartTotals.itemDiscountTotal}
                            onApply={store.applyGlobalDiscount}
                            onClear={store.clearGlobalDiscount}
                        />

                        {/* ── TOPLAMLAR ── */}
                        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(180deg, var(--surface2) 0%, var(--surface) 100%)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 15, color: 'var(--muted)' }}>Ara Toplam</span>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: 'var(--muted)' }}>{fmt(store.cartTotals.subtotal)}</span>
                                </div>
                                {store.cartTotals.totalDiscount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 15, color: '#f59e0b', fontWeight: 600 }}>İndirim</span>
                                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: '#f59e0b', fontWeight: 600 }}>−{fmt(store.cartTotals.totalDiscount)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 15, color: 'var(--muted)' }}>KDV</span>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: 'var(--muted)' }}>{fmt(store.cartTotals.vatAmount)}</span>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Genel Toplam</span>
                                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 32, fontWeight: 800, color: grandTotal > 0 ? '#6366f1' : 'var(--muted)' }}>
                                            {fmt(grandTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── ÖDEME YÖNTEMLERİ ── */}
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>Ödeme Yöntemi</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {paymentMethods.map(({ method, label, emoji, activeColor, activeBg, activeBorder }) => {
                                    const active = store.payments.some(p => p.method === method);
                                    return (
                                        <button
                                            key={method}
                                            onClick={() => openPaymentModal(method)}
                                            style={{
                                                padding: '12px 10px',
                                                background: active ? activeBg : 'var(--surface2)',
                                                border: `1.5px solid ${active ? activeBorder : 'var(--border)'}`,
                                                borderRadius: 12,
                                                cursor: 'pointer',
                                                fontSize: 15,
                                                fontWeight: 700,
                                                color: active ? activeColor : 'var(--muted)',
                                                fontFamily: "'DM Sans', sans-serif",
                                                transition: 'all .15s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 6,
                                                boxShadow: active ? `0 0 0 3px ${activeBorder}` : 'none',
                                            }}
                                        >
                                            <span style={{ fontSize: 28 }}>{emoji}</span>
                                            <span style={{ fontSize: 14 }}>{label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Parçalı / Karma Ödeme */}
                            <button
                                onClick={() => setPaymentDialogOpen(true)}
                                style={{
                                    width: '100%', marginTop: 8, padding: '8px 12px',
                                    background: 'transparent',
                                    border: '1.5px dashed var(--border)',
                                    borderRadius: 12, cursor: 'pointer',
                                    fontSize: 13, fontWeight: 700, color: 'var(--muted)',
                                    fontFamily: "'DM Sans', sans-serif",
                                    transition: 'all .15s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                                Parçalı / Karma Ödeme
                            </button>

                            {/* Eklenen ödemeler */}
                            {store.payments.length > 0 && (
                                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {store.payments.map((p, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }}>
                                            <span style={{ color: 'var(--muted)', fontWeight: 500 }}>{p.label}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: 'var(--text)' }}>{fmt(p.amount)}</span>
                                                <button onClick={() => store.removePayment(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dim)', fontSize: 16, padding: 0, lineHeight: 1, transition: 'color .1s' }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--dim)'}>×</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Kalan tutar badge */}
                            {store.payments.length > 0 && grandTotal > 0 && (
                                <div style={{
                                    marginTop: 10, padding: '10px 14px', borderRadius: 10, fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    background: isFullyPaid ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                    border: `1px solid ${isFullyPaid ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                                    color: isFullyPaid ? '#10b981' : '#f59e0b',
                                }}>
                                    <span style={{ fontWeight: 700 }}>{isFullyPaid ? '✓ Ödeme Tam' : 'Kalan Tutar'}</span>
                                    {!isFullyPaid && <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 800 }}>{fmt(store.remaining)}</span>}
                                </div>
                            )}
                        </div>

                        {/* ── TAMAMLA ── */}
                        <div style={{ padding: '16px 20px', marginTop: 'auto' }}>
                            <button
                                disabled={!canComplete || checkoutLoading}
                                onClick={handleCheckout}
                                style={{
                                    width: '100%', padding: 22,
                                    background: canComplete
                                        ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                                        : 'var(--surface3)',
                                    border: 'none', borderRadius: 16,
                                    color: '#fff', fontSize: 20, fontWeight: 800,
                                    fontFamily: "'DM Sans', sans-serif",
                                    cursor: canComplete && !checkoutLoading ? 'pointer' : 'not-allowed',
                                    opacity: canComplete ? 1 : 0.4,
                                    transition: 'all .2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    boxShadow: canComplete ? '0 8px 24px rgba(99,102,241,0.35)' : 'none',
                                    letterSpacing: '-0.01em',
                                }}
                                onMouseEnter={e => { if (canComplete && !checkoutLoading) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(99,102,241,0.45)'; } }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = canComplete ? '0 8px 24px rgba(99,102,241,0.35)' : 'none'; }}
                            >
                                {checkoutLoading ? (
                                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'posv2-spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> İşleniyor...</>
                                ) : (
                                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg> Satışı Tamamla</>
                                )}
                            </button>

                            {/* Koşul mesajları */}
                            {!store.selectedCustomer && (
                                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--amber)', textAlign: 'center', fontWeight: 500 }}>⚠ Cari hesap seçin</div>
                            )}
                            {store.cart.length > 0 && store.selectedCustomer && !isFullyPaid && (
                                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--amber)', textAlign: 'center', fontWeight: 500 }}>⚠ Ödeme yöntemi ekleyin</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── MODALLER ── */}
                <ItemDiscountModal
                    open={discountModalOpen}
                    item={discountItem}
                    onClose={() => setDiscountModalOpen(false)}
                    onApply={(productId, type, value) => { store.applyItemDiscount(productId, type, value); showToast('İndirim uygulandı', 'success'); }}
                />
                <PaymentModal
                    open={paymentModalOpen}
                    method={paymentMethod}
                    remaining={store.remaining}
                    cartTotal={store.cartTotals.grandTotal}
                    onClose={() => setPaymentModalOpen(false)}
                    onConfirm={handlePaymentConfirm}
                />
                <PaymentDialog />
                <Dialog
                    open={store.receiptDialogOpen}
                    onClose={() => store.setReceiptDialogOpen(false)}
                    PaperProps={{
                        sx: { background: 'transparent', boxShadow: 'none', overflow: 'visible' },
                    }}
                    BackdropProps={{
                        sx: { backdropFilter: 'blur(6px)', background: 'var(--backdrop)' },
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <div style={{ background: '#d6d2cc', padding: '24px', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                            <div ref={receiptPrintRef}>
                                {previewReceiptData && <ReceiptSlip data={previewReceiptData} />}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }} className="no-print">
                            <button
                                onClick={() => store.setReceiptDialogOpen(false)}
                                style={{
                                    padding: '10px 20px', background: 'var(--surface)', border: '1px solid var(--border)',
                                    borderRadius: 8, color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                                }}
                            >
                                Kapat
                            </button>
                            <button
                                onClick={handlePrintReceipt}
                                style={{
                                    padding: '10px 20px', background: '#6366f1', border: 'none',
                                    borderRadius: 8, color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                                }}
                            >
                                Yazdır
                            </button>
                        </div>
                    </div>
                    <style>{`
                        @media print {
                            .no-print { display: none !important; }
                        }
                    `}</style>
                </Dialog>
            </div>

            <style>{`
        #posv2-root {
          --bg: #f7fafc; --surface: #ffffff; --surface2: #f3f6fb; --surface3: #e9eef7;
          --border: rgba(15,23,42,0.10); --border-h: rgba(99,102,241,0.28);
          --text: #0f172a; --muted: rgba(15,23,42,0.62); --dim: rgba(15,23,42,0.42);
          --accent: #6366f1; --accent-g: rgba(99,102,241,0.10);
          --green: #10b981; --green-d: rgba(16,185,129,0.10);
          --amber: #f59e0b; --amber-d: rgba(245,158,11,0.10);
          --red: #ef4444; --red-d: rgba(239,68,68,0.10);
          --blue: #3b82f6; --blue-d: rgba(59,130,246,0.10);
          --pink: #ec4899; --pink-d: rgba(236,72,153,0.10);
          --shadow-sm: 0 1px 2px rgba(2,6,23,0.06);
          --shadow-md: 0 10px 20px rgba(2,6,23,0.10);
          --r: 12px; --rs: 8px; --rl: 16px;
          --receipt-paper: #fff; --receipt-ink: #0f172a; --receipt-ink-muted: rgba(15,23,42,0.60);
          --receipt-header: #0b1220;
        }
        .dark #posv2-root {
          --bg: #0b1220; --surface: #0f172a; --surface2: #111c32; --surface3: #162444;
          --border: rgba(148,163,184,0.14); --text: rgba(241,245,249,0.92);
          --muted: rgba(241,245,249,0.62); --dim: rgba(241,245,249,0.40);
          --accent: #818cf8; --accent-g: rgba(129,140,248,0.14);
          --green-d: rgba(16,185,129,0.14); --amber-d: rgba(245,158,11,0.14);
          --red-d: rgba(239,68,68,0.14); --blue-d: rgba(59,130,246,0.14);
          --pink-d: rgba(236,72,153,0.14);
          --shadow-md: 0 12px 22px rgba(0,0,0,0.42);
          --receipt-paper: #0f172a; --receipt-ink: rgba(241,245,249,0.92);
          --receipt-ink-muted: rgba(241,245,249,0.62); --receipt-header: #070b14;
        }
        @keyframes posv2-spin { to { transform: rotate(360deg); } }
        @keyframes posv2-fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        #posv2-search::placeholder { color: var(--muted); opacity: 1; }
      `}</style>
        </MainLayout>
    );
}
