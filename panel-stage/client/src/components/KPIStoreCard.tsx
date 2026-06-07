'use client';

import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface KPIStoreCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export default function KPIStoreCard({ title, value, icon, color }: KPIStoreCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      }}
    >
      <CardContent sx={{ p: '20px !important' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary', letterSpacing: '-0.5px' }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              background: `color-mix(in srgb, ${color} 15%, transparent)`,
              color: color,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
