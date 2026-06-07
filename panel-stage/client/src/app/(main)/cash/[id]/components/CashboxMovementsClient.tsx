import React, { useMemo } from 'react';
import { Box, Typography, CircularProgress, Chip, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

// Reusable interfaces
export interface Tahsilat {
    id: string;
    type: 'COLLECTION' | 'PAYMENT';
    amount: number;
    date: string;
    paymentMethod: 'CASH' | 'CREDIT_CARD';
    notes?: string;
    account: { code: string; title: string };
    cashbox: { code: string; name: string; type: string } | null;
}

export interface KasaHareketi {
    id: string;
    hareketTipi: 'TAHSILAT' | 'ODEME' | 'GELEN_HAVALE' | 'GIDEN_HAVALE';
    tutar: number;
    tarih: string | Date;
    cari?: { cariKodu: string; unvan: string } | null;
    aciklama?: string;
    odemeTipi?: 'CASH' | 'CREDIT_CARD';
    referansNo?: string;
}

export interface KasaHareketleriProps {
    kasaId: string;
    kasaType: 'CASH' | 'BANK' | 'COMPANY_CREDIT_CARD';
}

export const CashboxMovementsClient: React.FC<KasaHareketleriProps> = ({ kasaId, kasaType }) => {
    // 1. Tahsilat/Ödeme hareketleri
    const { data: tahsilatHareketleri, isLoading: tahsilatLoading } = useQuery<Tahsilat[]>({
        queryKey: ['tahsilat', 'kasa', kasaId],
        queryFn: async () => {
            const response = await axios.get('/collections', {
                params: { page: 1, limit: 1000, cashboxId: kasaId },
            });
            return response.data?.data ?? [];
        },
        enabled: !!kasaId,
    });

    // 2. Banka havale hareketleri (sadece BANKA kasası için)
    const { data: havaleHareketleri, isLoading: havaleLoading } = useQuery<any[]>({
        queryKey: ['bank-account-movement', 'kasa', kasaId],
        queryFn: async () => {
            const response = await axios.get('/bank-accounts', {
                params: { cashboxId: kasaId },
            });
            return response.data ?? [];
        },
        enabled: !!kasaId && kasaType === 'BANK',
    });

    // Birleştirilmiş hareketler
    const hareketler: KasaHareketi[] = useMemo(() => {
        const allHareketler: KasaHareketi[] = [];

        // Tahsilat/Ödeme hareketlerini ekle
        if (tahsilatHareketleri) {
            tahsilatHareketleri.forEach((tahsilat) => {
                allHareketler.push({
                    id: `tahsilat-${tahsilat.id}`,
                    hareketTipi: tahsilat.type === 'COLLECTION' ? 'TAHSILAT' : 'ODEME',
                    tutar: tahsilat.amount,
                    tarih: tahsilat.date,
                    cari: {
                        cariKodu: tahsilat.account.code,
                        unvan: tahsilat.account.title,
                    },
                    aciklama: tahsilat.notes,
                    odemeTipi: tahsilat.paymentMethod as 'CASH' | 'CREDIT_CARD',
                });
            });
        }

        // Banka havale hareketlerini ekle (sadece BANKA kasası için)
        if (kasaType === 'BANK' && havaleHareketleri) {
            havaleHareketleri.forEach((havale) => {
                allHareketler.push({
                    id: `havale-${havale.id}`,
                    hareketTipi: havale.type === 'GELEN' ? 'GELEN_HAVALE' : 'GIDEN_HAVALE',
                    tutar: havale.amount,
                    tarih: havale.date,
                    cari: havale.account ? {
                        cariKodu: havale.account.code,
                        unvan: havale.account.title,
                    } : null,
                    aciklama: havale.notes,
                    referansNo: havale.referenceNo,
                });
            });
        }

        // Tarihe göre sırala (yeni -> eski)
        return allHareketler.sort((a, b) => {
            const dateA = new Date(a.tarih).getTime();
            const dateB = new Date(b.tarih).getTime();
            return dateB - dateA;
        });
    }, [tahsilatHareketleri, havaleHareketleri, kasaType]);

    const isLoading = tahsilatLoading || (kasaType === 'BANK' && havaleLoading);

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(value);
    };

    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const columns: GridColDef[] = [
        {
            field: 'tarih',
            headerName: 'Tarih',
            width: 120,
            renderCell: (params: any) => (
                <Typography variant="body2">{formatDate(params.row?.tarih as string)}</Typography>
            ),
            valueGetter: (params: any) => params.row?.tarih ? new Date(params.row.tarih).getTime() : 0,
        },
        {
            field: 'hareketTipi',
            headerName: 'Tip',
            width: 140,
            renderCell: (params: any) => {
                const tip = params.row.hareketTipi;
                const labels: Record<string, string> = {
                    TAHSILAT: 'Tahsilat',
                    ODEME: 'Ödeme',
                    GELEN_HAVALE: 'Gelen Havale',
                    GIDEN_HAVALE: 'Giden Havale',
                };
                const colors: Record<string, { bg: string; color: string }> = {
                    TAHSILAT: { bg: 'color-mix(in srgb, var(--success) 20%, transparent)', color: 'var(--success)' },
                    ODEME: { bg: 'color-mix(in srgb, var(--destructive) 20%, transparent)', color: 'var(--destructive)' },
                    GELEN_HAVALE: { bg: 'color-mix(in srgb, var(--info) 20%, transparent)', color: 'var(--info)' },
                    GIDEN_HAVALE: { bg: 'color-mix(in srgb, var(--warning) 20%, transparent)', color: 'var(--warning)' },
                };
                const color = colors[tip] || { bg: 'var(--muted)', color: 'var(--foreground)' };
                return (
                    <Chip
                        label={labels[tip] || tip}
                        size="small"
                        sx={{
                            bgcolor: color.bg,
                            color: color.color,
                            fontWeight: 600,
                        }}
                    />
                );
            },
        },
        {
            field: 'cari',
            headerName: 'Cari',
            width: 250,
            renderCell: (params: any) => {
                const row = params.row as KasaHareketi;
                if (row?.cari) {
                    return (
                        <Typography variant="body2">{row.cari.cariKodu} - {row.cari.unvan}</Typography>
                    );
                }
                return <Typography variant="body2" color="text.secondary">-</Typography>;
            },
            valueGetter: (params: any) => params.row?.cari ? `${params.row.cari.cariKodu} - ${params.row.cari.unvan}` : '',
        },
        {
            field: 'tutar',
            headerName: 'Tutar',
            width: 150,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params: any) => {
                const row = params.row as KasaHareketi;
                const tutar = row?.tutar || 0;
                const tip = row?.hareketTipi;
                const isPositive = tip === 'TAHSILAT' || tip === 'GELEN_HAVALE';
                return (
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        color={isPositive ? 'var(--success)' : 'var(--destructive)'}
                    >
                        {isPositive ? '+' : '-'}{formatMoney(tutar)}
                    </Typography>
                );
            },
            valueGetter: (params: any) => params?.row?.tutar || 0,
        },
        {
            field: 'odemeTipi',
            headerName: 'Ödeme Tipi',
            width: 130,
            renderCell: (params: any) => {
                const tip = params.row.odemeTipi;
                if (!tip) return null;
                return (
                    <Chip
                        label={tip === 'CASH' ? 'Nakit' : 'Kredi Kartı'}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: 'var(--border)' }}
                    />
                );
            },
        },
        {
            field: 'aciklama',
            headerName: 'Açıklama',
            width: 250,
            renderCell: (params: any) => (
                <Typography variant="body2">{params.row?.aciklama || '-'}</Typography>
            ),
        },
        {
            field: 'referansNo',
            headerName: 'Referans No',
            width: 150,
            renderCell: (params: any) => (
                <Typography variant="body2">{params.row?.referansNo || '-'}</Typography>
            ),
        },
    ];

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!hareketler || hareketler.length === 0) {
        return (
            <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid var(--border)', boxShadow: 'none' }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    Bu kasa için henüz hareket bulunamadı
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ border: '1px solid var(--border)', borderRadius: 2, overflow: 'hidden', boxShadow: 'none' }}>
            <DataGrid
                rows={hareketler}
                columns={columns}
                getRowId={(row) => row.id}
                autoHeight
                disableRowSelectionOnClick
                density="compact"
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                        bgcolor: 'var(--muted)',
                        borderBottom: '1px solid var(--border)',
                    },
                    '& .MuiDataGrid-row:hover': {
                        bgcolor: 'var(--muted)',
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid var(--border)',
                    }
                }}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'tarih', sort: 'desc' }],
                    },
                }}
            />
        </Paper>
    );
};
