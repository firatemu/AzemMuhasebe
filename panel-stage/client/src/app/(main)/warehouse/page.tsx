'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { StandardPage } from '@/components/common';

export default function Page() {
  const moduleName = 'warehouse';
  const displayName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  
  return (
    <StandardPage maxWidth={false}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Depo Modülü
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Depo modülü içeriği buraya gelecek...
        </Typography>
      </Paper>
    </StandardPage>
  );
}
