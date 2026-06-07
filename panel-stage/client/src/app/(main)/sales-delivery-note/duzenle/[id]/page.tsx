'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { SatisIrsaliyeForm } from '../../yeni/page';
import MainLayout from '@/components/Layout/MainLayout';

export default function DuzenleSatisIrsaliyesiPage() {
  const params = useParams();
  const irsaliyeId = params.id as string;

  return (
    <MainLayout>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }>
        <SatisIrsaliyeForm irsaliyeId={irsaliyeId} onBack={() => window.history.back()} />
      </Suspense>
    </MainLayout>
  );
}
