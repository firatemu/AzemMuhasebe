'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            gap={3}
        >
            <Typography variant="h1" fontWeight="bold" color="text.disabled">404</Typography>
            <Typography variant="h5">Aradığınız sayfa bulunamadı</Typography>
            <Typography variant="body1" color="text.secondary">
                Ulaşmaya çalıştığınız sayfa silinmiş veya taşınmış olabilir.
            </Typography>
            <Button variant="contained" onClick={() => router.push('/dashboard')}>
                Ana Sayfaya Dön
            </Button>
        </Box>
    );
}
