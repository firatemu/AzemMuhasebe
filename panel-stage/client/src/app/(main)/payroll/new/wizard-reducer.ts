import { JournalType, CheckBillType, PortfolioType } from '@/types/check-bill';

export interface WizardDocument {
    id: string; // temp id for UI
    type: CheckBillType;
    portfolioType: PortfolioType;
    amount: number;
    dueDate: string;
    checkNo?: string;
    serialNo?: string;
    bank?: string;
    branch?: string;
    accountNo?: string;
    notes?: string;
}

export interface WizardState {
    activeStep: number;
    type: JournalType | null;
    date: string;
    accountId: string | null;
    bankAccountId: string | null;
    cashboxId: string | null;
    notes: string;
    journalNo: string;
    documents: WizardDocument[];
    selectedDocumentIds: string[];
}

export type WizardAction =
    | { type: 'NEXT_STEP' }
    | { type: 'PREV_STEP' }
    | { type: 'RESET' }
    | { type: 'SET_JOURNAL_TYPE'; payload: JournalType }
    | { type: 'SET_INFO'; payload: { date?: string; journalNo?: string; accountId?: string | null; bankAccountId?: string | null; cashboxId?: string | null; notes?: string } }
    | { type: 'ADD_DOCUMENT'; payload: WizardDocument }
    | { type: 'REMOVE_DOCUMENT'; payload: string }
    | { type: 'UPDATE_DOCUMENT'; payload: WizardDocument }
    | { type: 'SET_DOCUMENTS'; payload: WizardDocument[] }
    | { type: 'SET_SELECTED_DOCUMENTS'; payload: string[] };

const today = new Date().toISOString().split('T')[0];

export const initialState: WizardState = {
    activeStep: 0,
    type: null,
    date: today,
    accountId: null,
    bankAccountId: null,
    cashboxId: null,
    notes: '',
    journalNo: '',
    documents: [],
    selectedDocumentIds: [],
};

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case 'NEXT_STEP':
            return { ...state, activeStep: state.activeStep + 1 };
        case 'PREV_STEP':
            return { ...state, activeStep: Math.max(0, state.activeStep - 1) };
        case 'RESET':
            return initialState;
        case 'SET_JOURNAL_TYPE':
            return { ...state, type: action.payload, documents: [], selectedDocumentIds: [], journalNo: '', activeStep: 1 };
        case 'SET_INFO':
            return { ...state, ...action.payload };
        case 'SET_SELECTED_DOCUMENTS':
            return { ...state, selectedDocumentIds: action.payload };
        case 'ADD_DOCUMENT':
            return { ...state, documents: [...state.documents, action.payload] };
        case 'REMOVE_DOCUMENT':
            return { ...state, documents: state.documents.filter(d => d.id !== action.payload) };
        case 'UPDATE_DOCUMENT':
            return {
                ...state,
                documents: state.documents.map(d => d.id === action.payload.id ? action.payload : d)
            };
        case 'SET_DOCUMENTS':
            return { ...state, documents: action.payload };
        default:
            return state;
    }
}
