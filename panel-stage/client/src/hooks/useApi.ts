import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';

// Stok hooks
export function useStoklar(search?: string, limit = 20) {
  return useQuery({
    queryKey: ['stoklar', search, limit],
    queryFn: async () => {
      const response = await axios.get('/products', {
        params: { search, limit },
      });
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000, // 2 dakika
  });
}

// Cari hooks
export function useCariler(tip?: string, limit = 1000) {
  return useQuery({
    queryKey: ['cariler', tip, limit],
    queryFn: async () => {
      const response = await axios.get('/account', {
        params: { tip, limit },
      });
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    },
    staleTime: 3 * 60 * 1000, // 3 dakika
  });
}

// Kasa hooks
export function useKasalar(aktif = true) {
  return useQuery({
    queryKey: ['kasalar', aktif],
    queryFn: async () => {
      const response = await axios.get('/cashbox', {
        params: { aktif },
      });
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 dakika
  });
}

// Fatura hooks
export function useFaturalar(params: {
  type?: string;
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  accountId?: string;
  salesAgentId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['faturalar', params],
    queryFn: async () => {
      const response = await axios.get('/invoices', { params });
      return response.data;
    },
    staleTime: 60 * 1000, // 1 dakika
  });
}

export function useFatura(id: string) {
  return useQuery({
    queryKey: ['fatura', id],
    queryFn: async () => {
      const response = await axios.get(`/invoices/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Tahsilat hooks
export function useTahsilatlar(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['tahsilatlar', page, limit],
    queryFn: async () => {
      const response = await axios.get('/collections', {
        params: { page, limit },
      });
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    },
    staleTime: 60 * 1000,
  });
}

// Stok Hareket hooks
export function useStokHareketler(stokId?: string, hareketTipi?: string, limit = 100, enabled = true) {
  return useQuery({
    queryKey: ['stok-hareketler', stokId, hareketTipi, limit],
    queryFn: async () => {
      if (!stokId) return [];
      const response = await axios.get(`/products/${stokId}/stock-movements`, {
        params: { limit },
      });
      const data = response.data?.data || response.data;
      // Hareket tipi filtresini client-side yap
      const movements = Array.isArray(data) ? data : [];
      if (hareketTipi) {
        return movements.filter((m: any) => m.movementType === hareketTipi);
      }
      return movements;
    },
    staleTime: 60 * 1000,
    enabled: enabled && !!stokId,
  });
}

// Personel hooks
export function usePersoneller() {
  return useQuery({
    queryKey: ['personeller'],
    queryFn: async () => {
      const response = await axios.get('/employees');
      // Personel API returns a direct array, not wrapped in { data: [...] }
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
}

// Mutation hooks
export function useCreateStok() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/products', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stoklar'] });
    },
  });
}

export function useCreateCari() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/account', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cariler'] });
    },
  });
}

export function useCreateFatura() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/invoices', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faturalar'] });
    },
  });
}

