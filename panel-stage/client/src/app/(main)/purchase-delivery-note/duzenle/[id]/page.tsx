'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { SatinAlmaIrsaliyeForm } from '../../yeni/page';
import MainLayout from '@/components/Layout/MainLayout';

export default function SatinalmaIrsaliyesiDuzenlePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <MainLayout>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }>
        <SatinAlmaIrsaliyeForm irsaliyeId={id} onBack={() => window.history.back()} />
      </Suspense>
    </MainLayout>
  );
}
