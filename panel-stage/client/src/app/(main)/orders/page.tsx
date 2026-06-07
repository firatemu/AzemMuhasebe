'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { StandardPage } from '@/components/common';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Description } from '@mui/icons-material';

export default function SiparisPage() {
  const router = useRouter();

  return (
    <StandardPage maxWidth={false}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart sx={{ color: 'var(--primary-foreground)', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="var(--foreground)">
            Sipariş Yönetimi
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mt: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 400px', minWidth: '300px' }}>
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                bgcolor: 'var(--card)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  bgcolor: 'var(--muted)',
                  borderColor: 'var(--ring)',
                  boxShadow: 'var(--shadow-md)',
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => router.push('/orders/sales')}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 'var(--radius-md)',
                  bgcolor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <ShoppingCart sx={{ fontSize: 48, color: 'var(--primary)' }} />
              </Box>
              <Typography 
                variant="h5" 
                sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'var(--foreground)',
                  mb: 1,
                }}
              >
                Satış Siparişleri
              </Typography>
              <Typography 
                sx={{
                  color: 'var(--muted-foreground)',
                  fontSize: '0.875rem',
                }}
              >
                Müşterilerden gelen sipariş emirlerini yönetin
              </Typography>
            </Paper>
          </Box>
      </Box>
    </StandardPage>
  );
}
