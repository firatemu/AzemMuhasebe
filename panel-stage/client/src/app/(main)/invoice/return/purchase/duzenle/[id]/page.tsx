'use client';

import React, { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { AlisIadeFaturaForm } from '../../yeni/page';
import MainLayout from '@/components/Layout/MainLayout';

export default function AlisIadeFaturaDuzenlePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    return (
        <MainLayout>
            <Suspense fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            }>
                <AlisIadeFaturaForm faturaId={id} onBack={() => router.push('/invoice/return/purchase')} />
            </Suspense>
        </MainLayout>
    );
}
