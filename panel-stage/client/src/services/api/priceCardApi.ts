import api from '@/lib/axios';
import {
    ICreatePriceCardRequest,
    IPaginatedResponse,
    IPriceCard,
    IPriceCardFilterParams,
    IUpdatePriceCardRequest,
    PriceCardStatus,
    PriceSource,
    PriceType,
} from '@/types/priceCard';

// ⚠️ MOCK_MODE: True ise backend'e gitmez, sahte veri döner.
// Backend uçları tamamlandığında burayı false yapabilirsiniz.
const MOCK_MODE = false;

// --- MOCK DATA ---
const mockData: IPriceCard[] = [
    {
        id: '1',
        tenantId: 'demo-tenant',
        productId: 'prod-1',
        salePrice: 1250.0,
        purchasePrice: 950.0,
        vatRate: 20,
        currency: 'TRY',
        effectiveFrom: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        effectiveTo: null, // Süresiz
        minQuantity: 1,
        priceType: PriceType.SALE,
        status: PriceCardStatus.ACTIVE,
        source: PriceSource.MANUAL,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
            id: 'prod-1',
            code: 'BRK-001',
            name: 'Ön Fren Balatası Takımı',
            brand: 'BOSCH',
        },
    },
    {
        id: '2',
        tenantId: 'demo-tenant',
        productId: 'prod-2',
        salePrice: 450.0,
        purchasePrice: 320.0,
        vatRate: 20,
        currency: 'TRY',
        effectiveFrom: new Date().toISOString(),
        effectiveTo: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        minQuantity: 10,
        priceType: PriceType.CAMPAIGN,
        status: PriceCardStatus.ACTIVE,
        source: PriceSource.FORMULA,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: 'Bahar Kampanyası (%10 İndirim)',
        product: {
            id: 'prod-2',
            code: 'FLT-012',
            name: 'Hava Filtresi',
            brand: 'MANN-FILTER',
        },
    },
    {
        id: '3',
        tenantId: 'demo-tenant',
        productId: 'prod-1',
        salePrice: 1400.0,
        purchasePrice: null,
        vatRate: 20,
        currency: 'TRY',
        effectiveFrom: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString(),
        effectiveTo: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        minQuantity: 1,
        priceType: PriceType.SALE,
        status: PriceCardStatus.EXPIRED,
        source: PriceSource.MANUAL,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
            id: 'prod-1',
            code: 'BRK-001',
            name: 'Ön Fren Balatası Takımı',
            brand: 'BOSCH',
        },
    },
];

export const priceCardApi = {
    getAll: async (params?: IPriceCardFilterParams): Promise<IPaginatedResponse<IPriceCard>> => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let filtered = [...mockData];
                    if (params?.status) {
                        filtered = filtered.filter((p) => p.status === params.status);
                    }
                    if (params?.priceType) {
                        filtered = filtered.filter((p) => p.priceType === params.priceType);
                    }
                    if (params?.q) {
                        filtered = filtered.filter(
                            (p) =>
                                p.product?.name.toLowerCase().includes(params.q!.toLowerCase()) ||
                                p.product?.code.toLowerCase().includes(params.q!.toLowerCase())
                        );
                    }
                    resolve({
                        data: filtered,
                        meta: {
                            total: filtered.length,
                            page: params?.page || 1,
                            limit: params?.limit || 50,
                            totalPages: 1,
                        },
                    });
                }, 600);
            });
        }
        const response = await api.get('/price-cards', { params });
        return response.data;
    },

    getById: async (id: string): Promise<IPriceCard> => {
        if (MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const item = mockData.find((p) => p.id === id);
                    if (item) resolve(item);
                    else reject(new Error('Record not found'));
                }, 300);
            });
        }
        const response = await api.get(`/price-cards/${id}`);
        return response.data;
    },

    create: async (data: ICreatePriceCardRequest): Promise<IPriceCard> => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newItem: IPriceCard = {
                        id: Math.random().toString(36).substr(2, 9),
                        tenantId: 'demo-tenant',
                        productId: data.productId,
                        salePrice: data.salePrice,
                        purchasePrice: data.purchasePrice ?? null,
                        vatRate: data.vatRate ?? 20,
                        currency: data.currency || 'TRY',
                        effectiveFrom: data.effectiveFrom,
                        effectiveTo: data.effectiveTo || null,
                        minQuantity: data.minQuantity ?? 1,
                        priceType: data.priceType,
                        status: data.status,
                        source: data.source || PriceSource.MANUAL,
                        createdBy: 'current-user',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        product: {
                            id: data.productId,
                            code: 'YENI-URUN',
                            name: 'Sistemden Seçilen Ürün',
                        },
                    };
                    resolve(newItem);
                }, 800);
            });
        }
        const response = await api.post('/price-cards', data);
        return response.data;
    },

    update: async (id: string, data: IUpdatePriceCardRequest): Promise<IPriceCard> => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const base = mockData.find((m) => m.id === id);
                    resolve({ ...base, ...data, updatedAt: new Date().toISOString() } as IPriceCard);
                }, 800);
            });
        }
        const response = await api.patch(`/price-cards/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        if (MOCK_MODE) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 500);
            });
        }
        await api.delete(`/price-cards/${id}`);
    },

    exportToExcel: async (params: { q?: string; status?: string; type?: string }) => {
        const response = await api.get('/price-cards/export/excel', {
            params,
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `fiyat_kartlari_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
