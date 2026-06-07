'use client';

import React from 'react';
import { Box, Divider, Paper, Skeleton, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, HourglassEmpty, Dangerous } from '@mui/icons-material';

interface StatsProps {
    loading: boolean;
    data: {
        aylikSatis: { tutar: number; adet: number };
        tahsilatBekleyen: { tutar: number; adet: number };
        vadesiGecmis: { tutar: number; adet: number };
    } | null;
    type: 'SATIS' | 'ALIS' | 'IADE';
}

export default function KPIHeader({ loading, data, type }: StatsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const isSatis = type === 'SATIS';

    const items = [
        {
            title: type === 'IADE' ? 'Aylık İade' : (isSatis ? 'Bu Ay Satış' : 'Bu Ay Alış'),
            value: data?.aylikSatis?.tutar || 0,
            count: data?.aylikSatis?.adet || 0,
            icon: isSatis ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />,
            color: isSatis ? 'var(--chart-3)' : 'var(--chart-2)',
            bgColor: isSatis ? 'color-mix(in srgb, var(--chart-3) 12%, transparent)' : 'color-mix(in srgb, var(--chart-2) 12%, transparent)',
            borderColor: isSatis ? 'var(--chart-3)' : 'var(--chart-2)',
            accentColor: 'var(--chart-4)',
        },
        {
            title: isSatis ? 'Tahsilat Bekleyen' : 'Ödeme Bekleyen',
            value: data?.tahsilatBekleyen?.tutar || 0,
            count: data?.tahsilatBekleyen?.adet || 0,
            icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
            color: 'var(--chart-1)',
            bgColor: 'color-mix(in srgb, var(--chart-1) 12%, transparent)',
            borderColor: 'var(--chart-1)',
            accentColor: 'var(--chart-1)',
        },
        {
            title: 'Vadesi Geçmiş',
            value: data?.vadesiGecmis?.tutar || 0,
            count: data?.vadesiGecmis?.adet || 0,
            icon: <Dangerous sx={{ fontSize: 16 }} />,
            color: 'var(--destructive)',
            bgColor: 'color-mix(in srgb, var(--destructive) 12%, transparent)',
            borderColor: 'var(--destructive)',
            accentColor: 'var(--destructive)',
        },
    ];

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                display: 'flex',
                borderRadius: 2,
                overflow: 'hidden',
                borderColor: 'var(--border)',
                mb: 2,
            }}
        >
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <Box
                        sx={{
                            flex: '1 1 140px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            position: 'relative',
                            borderLeft: '4px solid',
                            borderLeftColor: item.borderColor,
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                background: item.bgColor,
                                color: item.color,
                                borderRadius: 1.5,
                                p: 0.75,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            {item.icon}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'var(--muted-foreground)',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    display: 'block',
                                    lineHeight: 1.2,
                                }}
                            >
                                {item.title}
                            </Typography>
                            {loading ? (
                                <Skeleton width={80} height={24} />
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '0.9rem',
                                        color: 'var(--foreground)',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {formatCurrency(item.value)}
                                </Typography>
                            )}
                            {loading ? (
                                <Skeleton width={50} height={14} />
                            ) : (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'var(--muted-foreground)',
                                        fontSize: '0.7rem',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {item.count} {isSatis ? 'fatura' : 'işlem'}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    {index < items.length - 1 && (
                        <Divider orientation="vertical" flexItem sx={{ mx: 0 }} />
                    )}
                </React.Fragment>
            ))}
        </Paper>
    );
}