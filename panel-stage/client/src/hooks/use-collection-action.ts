import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
import { QK } from '../lib/query-keys';

export type CheckPaymentMethod = 'KASA' | 'BANKA' | 'ELDEN';

export interface CheckActionDto {
    checkBillId: string;
    newStatus: string;
    date: string;
    transactionAmount?: number;
    paymentMethod?: CheckPaymentMethod;
    cashboxId?: string;
    bankAccountId?: string;
    toAccountId?: string;
    notes?: string;
}

export function useCheckAction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (dto: CheckActionDto) => {
            const res = await axios.post('/checks-promissory-notes/action', dto);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: QK.checks() });
            qc.invalidateQueries({ queryKey: QK.journals() });
        },
    });
}

// Backward-compat alias for CollectionClient
export function useCollectionAction() {
    return useCheckAction();
}
