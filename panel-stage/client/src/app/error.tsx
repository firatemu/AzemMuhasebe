'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="50vh"
            gap={2}
        >
            <Typography variant="h4" color="error">Bir Sorun Oluştu</Typography>
            <Typography variant="body1" color="text.secondary">
                İşleminiz gerçekleştirilirken beklenmeyen bir hata ile karşılaşıldı.
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, fontFamily: 'monospace' }}>
                {error.message || 'Bilinmeyen Hata'}
            </Typography>
            <Button variant="contained" onClick={() => reset()} sx={{ mt: 2 }}>
                Tekrar Dene
            </Button>
        </Box>
    );
}
