'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { SatinAlmaFaturaForm } from '../../yeni/page';
import MainLayout from '@/components/Layout/MainLayout';

export default function SatinalmaFaturasiDuzenlePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <MainLayout>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }>
        <SatinAlmaFaturaForm faturaId={id} onBack={() => window.history.back()} />
      </Suspense>
    </MainLayout>
  );
}
