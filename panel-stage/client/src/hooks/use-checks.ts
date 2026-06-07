import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
import { QK } from '../lib/query-keys';
import {
    CheckBill,
    CheckBillFilters,
    CheckBillCollection,
    CheckBillEndorsement,
    ChecksListResponse,
    CheckBillTimelineResponse,
    CheckBillGlEntryRow,
    CheckBillDocumentsResponse,
} from '../types/check-bill';

function buildFilterParams(filters?: CheckBillFilters): Record<string, string> {
    const cleanFilters: Record<string, string> = {};
    if (!filters) return cleanFilters;
    Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
            if (Array.isArray(val)) {
                val.forEach((v) => {
                    cleanFilters[`${key}[]`] = String(v);
                });
            } else {
                cleanFilters[key] = String(val);
            }
        }
    });
    return cleanFilters;
}

/** Sayfalı liste — backend { items, total, skip, take } */
export function useChecks(filters?: CheckBillFilters) {
    return useQuery({
        queryKey: QK.checks(filters),
        queryFn: async () => {
            const params = new URLSearchParams(buildFilterParams(filters));
            const res = await axios.get<ChecksListResponse | CheckBill[]>(`/checks-promissory-notes?${params.toString()}`);
            const d = res.data;
            if (Array.isArray(d)) {
                return {
                    items: d,
                    total: d.length,
                    skip: filters?.skip ?? 0,
                    take: filters?.take ?? d.length,
                } satisfies ChecksListResponse;
            }
            return d as ChecksListResponse;
        },
    });
}

export function useCheckStatsSummary() {
    return useQuery({
        queryKey: QK.checkStatsSummary(),
        queryFn: async () => {
            const res = await axios.get(`/checks-promissory-notes/stats/summary`);
            return res.data as {
                byStatus: { status: string; _count: { _all: number } }[];
                byType: { type: string; _count: { _all: number } }[];
                byPortfolio: { portfolioType: string; _count: { _all: number } }[];
                totalFaceAmount: number | null;
                totalRemainingAmount: number | null;
            };
        },
    });
}

export function useCheckStatsAging() {
    return useQuery({
        queryKey: QK.checkStatsAging(),
        queryFn: async () => {
            const res = await axios.get(`/checks-promissory-notes/stats/aging`);
            return res.data;
        },
    });
}

export function useCheckStatsCashflow() {
    return useQuery({
        queryKey: QK.checkStatsCashflow(),
        queryFn: async () => {
            const res = await axios.get(`/checks-promissory-notes/stats/cashflow`);
            return res.data;
        },
    });
}

export function useCheck(id: string) {
    return useQuery({
        queryKey: QK.check(id),
        queryFn: async () => {
            const res = await axios.get<CheckBill>(`/checks-promissory-notes/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCheckEndorsements(id: string) {
    return useQuery({
        queryKey: QK.checkEndorsements(id),
        queryFn: async () => {
            const res = await axios.get<CheckBillEndorsement[]>(`/checks-promissory-notes/endorsements/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCheckCollections(id: string) {
    return useQuery({
        queryKey: QK.checkCollections(id),
        queryFn: async () => {
            const res = await axios.get<CheckBillCollection[]>(`/checks-promissory-notes/collections/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCheckTimeline(id: string) {
    return useQuery({
        queryKey: QK.checkTimeline(id),
        queryFn: async () => {
            const res = await axios.get<CheckBillTimelineResponse>(`/checks-promissory-notes/${id}/timeline`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCheckGlEntries(id: string) {
    return useQuery({
        queryKey: QK.checkGlEntries(id),
        queryFn: async () => {
            const res = await axios.get<CheckBillGlEntryRow[]>(`/checks-promissory-notes/${id}/gl-entries`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCheckDocuments(id: string) {
    return useQuery({
        queryKey: QK.checkDocuments(id),
        queryFn: async () => {
            const res = await axios.get<CheckBillDocumentsResponse>(`/checks-promissory-notes/${id}/documents`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useDeleteCheck() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await axios.delete(`/checks-promissory-notes/${id}`);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['checks'] });
            qc.invalidateQueries({ queryKey: QK.checkStatsSummary() });
            qc.invalidateQueries({ queryKey: QK.checkStatsAging() });
            qc.invalidateQueries({ queryKey: ['check-upcoming'] });
            qc.invalidateQueries({ queryKey: ['check-overdue'] });
            qc.invalidateQueries({ queryKey: ['check-at-risk'] });
        },
    });
}

export function useUpdateCheck() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: {
                checkNo?: string;
                bank?: string;
                branch?: string;
                accountNo?: string;
                dueDate?: string;
                notes?: string;
                amount?: number;
            };
        }) => {
            const res = await axios.put(`/checks-promissory-notes/${id}`, data);
            return res.data;
        },
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: QK.check(id) });
            qc.invalidateQueries({ queryKey: ['checks'] });
            qc.invalidateQueries({ queryKey: QK.checkTimeline(id) });
            qc.invalidateQueries({ queryKey: ['check-upcoming'] });
            qc.invalidateQueries({ queryKey: ['check-overdue'] });
            qc.invalidateQueries({ queryKey: ['check-at-risk'] });
        },
    });
}

export function useCheckAction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: {
            checkBillId: string;
            newStatus: string;
            date: string;
            transactionAmount: number;
            notes?: string;
            cashboxId?: string;
            bankAccountId?: string;
        }) => {
            const res = await axios.post('/checks-promissory-notes/action', payload);
            return res.data;
        },
        onSuccess: (_, variables) => {
            const id = variables.checkBillId;
            qc.invalidateQueries({ queryKey: ['checks'] });
            qc.invalidateQueries({ queryKey: QK.checkStatsSummary() });
            qc.invalidateQueries({ queryKey: QK.check(id) });
            qc.invalidateQueries({ queryKey: QK.checkTimeline(id) });
            qc.invalidateQueries({ queryKey: QK.checkEndorsements(id) });
            qc.invalidateQueries({ queryKey: QK.checkCollections(id) });
            qc.invalidateQueries({ queryKey: QK.checkGlEntries(id) });
            qc.invalidateQueries({ queryKey: ['check-upcoming'] });
            qc.invalidateQueries({ queryKey: ['check-overdue'] });
            qc.invalidateQueries({ queryKey: ['check-at-risk'] });
        },
    });
}

export function useBulkSoftDeleteChecks() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (checkBillIds: string[]) => {
            const res = await axios.post('/checks-promissory-notes/bulk-action', {
                action: 'soft_delete',
                checkBillIds,
            });
            return res.data as { ok: boolean; affected: number };
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['checks'] });
            qc.invalidateQueries({ queryKey: QK.checkStatsSummary() });
            qc.invalidateQueries({ queryKey: QK.checkStatsAging() });
            qc.invalidateQueries({ queryKey: ['check-upcoming'] });
            qc.invalidateQueries({ queryKey: ['check-overdue'] });
            qc.invalidateQueries({ queryKey: ['check-at-risk'] });
        },
    });
}

export function useCreateCheckBill() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: {
            accountId: string;
            portfolioType: string;
            type: string;
            checkNo: string;
            dueDate: string;
            amount: number;
            serialNo?: string;
            debtor?: string;
            bank?: string;
            branch?: string;
            accountNo?: string;
            notes?: string;
        }) => {
            const res = await axios.post<CheckBill>('/checks-promissory-notes', payload);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['checks'] });
            qc.invalidateQueries({ queryKey: QK.checkStatsSummary() });
            qc.invalidateQueries({ queryKey: QK.checkStatsAging() });
            qc.invalidateQueries({ queryKey: ['check-upcoming'] });
            qc.invalidateQueries({ queryKey: ['check-overdue'] });
            qc.invalidateQueries({ queryKey: ['check-at-risk'] });
        },
    });
}

    /** Mevcut filtrelerle Excel (XLSX) indir */
    export async function exportChecksCsv(filters?: CheckBillFilters): Promise<void> {
        const params = new URLSearchParams(buildFilterParams(filters));
        const res = await axios.get(`/checks-promissory-notes/export/excel?${params.toString()}`, {
            responseType: 'blob',
        });
        const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cek-senet-listesi.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    /** Mevcut filtrelerle PDF indir (CSV formatında PDF uzantısı ile) */
    export async function exportChecksPdf(filters?: CheckBillFilters): Promise<void> {
        const params = new URLSearchParams(buildFilterParams(filters));
        const res = await axios.get(`/checks-promissory-notes/export/pdf?${params.toString()}`, {
            responseType: 'blob',
        });
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cek-senet-listesi.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
    }

/** check-bill-reports */
/** Önümüzdeki N gün içinde vadeler (bugünden itibaren) */
export function useCheckUpcomingWindow(days = 30) {
    return useQuery({
        queryKey: QK.checkUpcoming(days),
        queryFn: async () => {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(end.getDate() + days);
            const params = new URLSearchParams({
                startDate: start.toISOString(),
                endDate: end.toISOString(),
            });
            const res = await axios.get<CheckBill[]>(`/checks-promissory-notes/upcoming?${params.toString()}`);
            return res.data;
        },
    });
}

export function useCheckOverdue() {
    return useQuery({
        queryKey: QK.checkOverdue(),
        queryFn: async () => {
            const res = await axios.get<CheckBill[]>(`/checks-promissory-notes/overdue`);
            return res.data;
        },
    });
}

export function useCheckAtRisk(minScore = 70) {
    return useQuery({
        queryKey: QK.checkAtRisk(minScore),
        queryFn: async () => {
            const res = await axios.get<CheckBill[]>(`/checks-promissory-notes/at-risk?minScore=${minScore}`);
            return res.data;
        },
    });
}

export function useCheckBillReportBankPosition() {
    return useQuery({
        queryKey: QK.checkBillReports('bank-position'),
        queryFn: async () => {
            const res = await axios.get('/check-bill-reports/bank-position');
            return res.data as { byStatus: { status: string; _count: number; _sum: { remainingAmount: number | null } }[] };
        },
    });
}

export function useCheckBillReportProtest() {
    return useQuery({
        queryKey: QK.checkBillReports('protest'),
        queryFn: async () => {
            const res = await axios.get('/check-bill-reports/protest-report');
            return res.data;
        },
    });
}

export function useCheckBillReportRiskExposure() {
    return useQuery({
        queryKey: QK.checkBillReports('risk'),
        queryFn: async () => {
            const res = await axios.get('/check-bill-reports/risk-exposure');
            return res.data;
        },
    });
}

export function useCheckBillReportReconciliation() {
    return useQuery({
        queryKey: QK.checkBillReports('reconciliation'),
        queryFn: async () => {
            const res = await axios.get('/check-bill-reports/reconciliation-status');
            return res.data;
        },
    });
}

export function useCheckBillReportPortfolioSummary() {
    return useQuery({
        queryKey: QK.checkBillReports('portfolio-summary'),
        queryFn: async () => {
            const res = await axios.get('/check-bill-reports/portfolio-summary');
            return res.data;
        },
    });
}

export function useCheckBillReportAging() {
    return useQuery({
        queryKey: QK.checkBillReports('aging-report'),
        queryFn: async () => {
            const res = await axios.get('/check-bill-reports/aging-report');
            return res.data;
        },
    });
}

export function useCheckBillReportCashflowForecast() {
    return useQuery({
        queryKey: QK.checkBillReports('cashflow-forecast'),
        queryFn: async () => {
            const res = await axios.get('/check-bill-reports/cashflow-forecast');
            return res.data;
        },
    });
}
