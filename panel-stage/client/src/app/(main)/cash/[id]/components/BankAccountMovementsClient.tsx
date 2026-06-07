import React from 'react';
import { Box, Typography, CircularProgress, Chip, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export interface BankaHesabiHareketleriProps {
    bankaHesabiId: string;
}

export const BankaHesabiHareketleri: React.FC<BankaHesabiHareketleriProps> = ({ bankaHesabiId }) => {
    // Get account info
    const { data: hesapData, isLoading: hesapLoading } = useQuery<any>({
        queryKey: ['bank-account', bankaHesabiId],
        queryFn: async () => {
            const response = await axios.get(`/bank-accounts/${bankaHesabiId}`);
            return response.data;
        },
        enabled: !!bankaHesabiId,
    });

    // Get movements
    const { data: hareketlerData, isLoading: hareketlerLoading } = useQuery<{ movements: any[] }>({
        queryKey: ['bank-account', 'movements', bankaHesabiId],
        queryFn: async () => {
            const response = await axios.get(`/bank-accounts/${bankaHesabiId}`);
            return response.data;
        },
        enabled: !!bankaHesabiId,
    });

    const movements = hareketlerData?.movements || [];
    const isLoading = hesapLoading || hareketlerLoading;

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

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!hesapData) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    Banka hesabı bilgileri bulunamadı.
                </Typography>
            </Box>
        );
    }

    if (!movements || movements.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 2, p: 2, bgcolor: 'var(--muted)', borderRadius: 2, border: '1px solid var(--border)' }}>
                    <Typography variant="body2" color="text.secondary">
                        Mevcut Bakiye
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color={hesapData.balance >= 0 ? 'success.main' : 'error.main'}>
                        {formatMoney(hesapData.balance)}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" align="center">
                    Bu banka hesabı için henüz hareket bulunamadı.
                </Typography>
            </Box>
        );
    }

    const columns: GridColDef[] = [
        {
            field: 'tarih',
            headerName: 'Tarih',
            width: 120,
            renderCell: (params: any) => (
                <Typography variant="body2">{formatDate(params.row?.date)}</Typography>
            ),
            valueGetter: (params: any) => params.row?.date ? new Date(params.row.date).getTime() : 0,
        },
        {
            field: 'type',
            headerName: 'Tip',
            width: 160,
            renderCell: (params: any) => {
                const type = params.row.type;
                const labels: Record<string, string> = {
                    HAVALE_GELEN: 'Gelen Havale',
                    HAVALE_GIDEN: 'Giden Havale',
                    KREDI_KARTI_TAHSILAT: 'Kredi Kartı Tahsilat',
                    INCOMING: 'Giriş',
                    OUTGOING: 'Çıkış',
                };
                const colors: Record<string, { bg: string; color: string }> = {
                    HAVALE_GELEN: { bg: 'color-mix(in srgb, var(--success) 20%, transparent)', color: 'var(--success)' },
                    INCOMING: { bg: 'color-mix(in srgb, var(--success) 20%, transparent)', color: 'var(--success)' },
                    HAVALE_GIDEN: { bg: 'color-mix(in srgb, var(--warning) 20%, transparent)', color: 'var(--warning)' },
                    OUTGOING: { bg: 'color-mix(in srgb, var(--destructive) 20%, transparent)', color: 'var(--destructive)' },
                    KREDI_KARTI_TAHSILAT: { bg: 'color-mix(in srgb, var(--info) 20%, transparent)', color: 'var(--info)' },
                };
                const color = colors[type] || { bg: 'var(--muted)', color: 'var(--foreground)' };
                return (
                    <Chip
                        label={labels[type] || type}
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
            field: 'account',
            headerName: 'Cari',
            width: 250,
            renderCell: (params: any) => {
                const account = params.row.account;
                if (account) {
                    return (
                        <Typography variant="body2">{account.code} - {account.title}</Typography>
                    );
                }
                return <Typography variant="body2" color="text.secondary">-</Typography>;
            },
        },
        {
            field: 'amount',
            headerName: 'Tutar',
            width: 150,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params: any) => {
                const amount = params.row.amount || 0;
                const type = params.row.type;
                const isPositive = ['HAVALE_GELEN', 'KREDI_KARTI_TAHSILAT', 'INCOMING'].includes(type);
                return (
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        color={isPositive ? 'var(--success)' : 'var(--destructive)'}
                    >
                        {isPositive ? '+' : '-'}{formatMoney(amount)}
                    </Typography>
                );
            },
        },
        {
            field: 'balance',
            headerName: 'Bakiye',
            width: 150,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params: any) => {
                const balance = params.row.balance || 0;
                return (
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        color={balance >= 0 ? 'var(--success)' : 'var(--destructive)'}
                    >
                        {formatMoney(balance)}
                    </Typography>
                );
            },
        },
        {
            field: 'referenceNo',
            headerName: 'Referans/Evrak',
            width: 150,
            renderCell: (params: any) => (
                <Typography variant="body2">{params.row?.referenceNo || params.row?.documentNo || '-'}</Typography>
            ),
        },
        {
            field: 'notes',
            headerName: 'Açıklama',
            width: 250,
            renderCell: (params: any) => (
                <Typography variant="body2">{params.row?.notes || '-'}</Typography>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'var(--muted)', borderRadius: 2, border: '1px solid var(--border)' }}>
                <Typography variant="body2" color="text.secondary">
                    Toplam Bakiye
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={hesapData.balance >= 0 ? 'var(--success)' : 'var(--destructive)'}>
                    {formatMoney(hesapData.balance)}
                </Typography>
            </Box>
            <Paper sx={{ border: '1px solid var(--border)', borderRadius: 2, overflow: 'hidden', boxShadow: 'none' }}>
                <DataGrid
                    rows={movements}
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
        </Box>
    );
};
