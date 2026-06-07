import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
import { QK } from '../lib/query-keys';
import { CheckBillJournal, JournalFilters } from '../types/check-bill';

export function useJournals(filters?: JournalFilters) {
    return useQuery({
        queryKey: QK.journals(filters),
        queryFn: async () => {
            const params = new URLSearchParams(filters as Record<string, string>);
            const res = await axios.get<CheckBillJournal[]>(`/check-bill-journals?${params.toString()}`);
            return res.data;
        },
    });
}

export function useJournal(id: string) {
    return useQuery({
        queryKey: QK.journal(id),
        queryFn: async () => {
            const res = await axios.get<CheckBillJournal>(`/check-bill-journals/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useDeleteJournal() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const res = await axios.delete(`/check-bill-journals/${id}`);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QK.journals() });
        },
    });
}

export function useCreateJournal() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await axios.post('/check-bill-journals', data);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QK.journals() });
            qc.invalidateQueries({ queryKey: QK.checks() });
        },
    });
}
