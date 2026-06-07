import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import { QK } from '../lib/query-keys';
import { Account, BankAccount, Cashbox } from '../types/check-bill';

export function useAccounts(search?: string) {
    return useQuery({
        queryKey: QK.accounts(search),
        queryFn: async () => {
            const params = search ? `?search=${encodeURIComponent(search)}` : '';
            const res = await axios.get<{ data: Account[] }>(`/account${params}`);
            return res.data.data;
        },
    });
}

export function useBankAccounts(type?: string) {
    return useQuery({
        queryKey: QK.bankAccounts({ type }),
        queryFn: async () => {
            const params = type ? `?type=${type}` : '';
            const res = await axios.get<BankAccount[]>(`/bank-accounts${params}`);
            return res.data;
        },
    });
}

export function useCashboxes(isRetail?: boolean) {
    return useQuery({
        queryKey: QK.cashboxes({ isRetail }),
        queryFn: async () => {
            const params = isRetail !== undefined ? `?isRetail=${isRetail}` : '';
            const res = await axios.get<Cashbox[]>(`/cashbox${params}`);
            return res.data;
        },
    });
}
