import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import {
    CheckCircle,
    Cancel,
    HourglassEmpty,
    Warning,
    Paid,
    Drafts
} from '@mui/icons-material';

export type InvoiceStatus = 'OPEN' | 'APPROVED' | 'PARTIALLY_PAID' | 'CLOSED' | 'CANCELLED' | 'DRAFT';

interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
    status: string;
    showIcon?: boolean;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactElement }> = {
    OPEN: {
        label: 'Beklemede',
        color: '#d97706', // amber-600
        bgColor: 'color-mix(in srgb, var(--chart-2) 15%, transparent)',
        icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
    },
    APPROVED: {
        label: 'Onaylandı',
        color: '#2563eb', // blue-600
        bgColor: '#dbeafe', // blue-100
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
    },
    PARTIALLY_PAID: {
        label: 'Kısmen Ödendi',
        color: '#0891b2', // cyan-600
        bgColor: '#cffafe', // cyan-100
        icon: <Paid sx={{ fontSize: 16 }} />,
    },
    CLOSED: {
        label: 'Ödendi',
        color: '#059669', // emerald-600
        bgColor: '#d1fae5', // emerald-100
        icon: <Paid sx={{ fontSize: 16 }} />,
    },
    CANCELLED: {
        label: 'İptal Edildi',
        color: '#dc2626', // red-600
        bgColor: '#fee2e2', // red-100
        icon: <Cancel sx={{ fontSize: 16 }} />,
    },
    DRAFT: {
        label: 'Taslak',
        color: '#4b5563', // gray-600
        bgColor: 'var(--muted)',
        icon: <Drafts sx={{ fontSize: 16 }} />,
    },
    INVOICED: {
        label: 'Faturalandı',
        color: '#059669', // emerald-600
        bgColor: '#d1fae5', // emerald-100
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
    },
    NOT_INVOICED: {
        label: 'Faturalanmadı',
        color: '#d97706', // amber-600
        bgColor: '#fef3c7', // amber-100
        icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
    },
    // Satış İrsaliyesi durumları
    TESLIM_EDILDI: {
        label: 'Teslim Edildi',
        color: '#059669', // emerald-600
        bgColor: '#d1fae5', // emerald-100
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
    },
    BEKLEMEDE: {
        label: 'Beklemede',
        color: '#d97706', // amber-600
        bgColor: '#fef3c7', // amber-100
        icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
    },
    FATURAYA_BAGLANDI: {
        label: 'Faturaya Bağlandı',
        color: '#2563eb', // blue-600
        bgColor: '#dbeafe', // blue-100
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
    },
    IPTAL: {
        label: 'İptal',
        color: '#dc2626', // red-600
        bgColor: '#fee2e2', // red-100
        icon: <Cancel sx={{ fontSize: 16 }} />,
    },
};

export default function StatusBadge({ status, showIcon = true, sx, ...props }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        label: status,
        color: '#4b5563',
        bgColor: '#f3f4f6',
        icon: <Warning sx={{ fontSize: 16 }} />,
    };

    return (
        <Chip
            label={config.label}
            icon={showIcon ? config.icon : undefined}
            size="small"
            sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                color: config.color,
                bgcolor: config.bgColor,
                border: '1px solid',
                borderColor: `${config.color}30`, // 30% opacity
                borderRadius: '6px',
                '& .MuiChip-icon': {
                    color: 'inherit',
                    ml: 0.5,
                },
                ...sx,
            }}
            {...props}
        />
    );
}
