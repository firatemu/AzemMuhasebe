import { create } from 'zustand';
import { DocumentItem } from '@/components/Form/DocumentItemTable';

export type InvoiceDraft = any; // Inconsistent naming across modules (faturaNo vs invoiceNo etc)

export type InvoiceDraftType =
    | 'sales'
    | 'purchase'
    | 'sales_return'
    | 'purchase_return'
    | 'sales_order'
    | 'purchase_order'
    | 'sales_delivery_note'
    | 'purchase_delivery_note';

interface InvoiceDraftState {
    drafts: Record<InvoiceDraftType, InvoiceDraft | null>;
    setDraft: (type: InvoiceDraftType, draft: InvoiceDraft | null) => void;
    updateDraft: (type: InvoiceDraftType, update: Partial<InvoiceDraft>) => void;
    clearDraft: (type: InvoiceDraftType) => void;
}

export const useInvoiceDraftStore = create<InvoiceDraftState>((set) => ({
    drafts: {
        sales: null,
        purchase: null,
        sales_return: null,
        purchase_return: null,
        sales_order: null,
        purchase_order: null,
        sales_delivery_note: null,
        purchase_delivery_note: null,
    },
    setDraft: (type, draft) => set((state) => ({
        drafts: { ...state.drafts, [type]: draft }
    })),
    updateDraft: (type, update) => set((state) => ({
        drafts: {
            ...state.drafts,
            [type]: state.drafts[type] ? { ...state.drafts[type]!, ...update } : (update as InvoiceDraft)
        }
    })),
    clearDraft: (type) => set((state) => ({
        drafts: { ...state.drafts, [type]: null }
    })),
}));
