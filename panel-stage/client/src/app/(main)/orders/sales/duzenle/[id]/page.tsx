'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { SatisSiparisForm } from '../../yeni/page';
import MainLayout from '@/components/Layout/MainLayout';

export default function DuzenleSatisSiparisiPage() {
  const params = useParams();
  const siparisId = params.id as string;

  return (
    <MainLayout>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }>
        <SatisSiparisForm siparisId={siparisId} onBack={() => window.history.back()} />
      </Suspense>
    </MainLayout>
  );
}
