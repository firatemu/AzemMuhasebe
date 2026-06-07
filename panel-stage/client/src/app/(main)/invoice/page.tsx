'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActionArea, Stack } from '@mui/material';
import { Receipt, ShoppingCart, CloudDownload, Description } from '@mui/icons-material';
import { StandardPage } from '@/components/common';
import { useRouter } from 'next/navigation';

const menuItems = [
  {
    title: 'Satış Faturaları',
    description: 'Müşterilerinize kestiğiniz faturaları görüntüleyin ve yönetin',
    icon: Receipt,
    href: '/invoice/sales',
    color: 'var(--primary)',
  },
  {
    title: 'Satın Alma Faturaları',
    description: 'Tedarikçilerden aldığınız faturaları görüntüleyin ve yönetin',
    icon: ShoppingCart,
    href: '/invoice/purchase',
    color: 'var(--secondary)',
  },
  {
    title: 'Fatura Arşivi',
    description: 'Tüm faturalarınızı tek bir yerden arayın ve yönetin',
    icon: Description,
    href: '/invoice/archive',
    color: 'var(--chart-2)',
  },
];

export default function FaturaPage() {
  const router = useRouter();

  return (
    <StandardPage maxWidth={false}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt sx={{ color: 'var(--primary-foreground)', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="var(--foreground)">
            Fatura Yönetimi
          </Typography>
        </Box>
      </Box>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          mb: 3,
          color: 'var(--muted-foreground)',
        }}
      >
        Lütfen işlem yapmak istediğiniz fatura türünü seçiniz
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Grid key={index} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  bgcolor: 'var(--card)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'var(--shadow-md)',
                    borderColor: 'var(--ring)',
                  }
                }}
              >
                <CardActionArea onClick={() => router.push(item.href)}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 'var(--radius-md)',
                        bgcolor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      <IconComponent sx={{ fontSize: 40, color: item.color }} />
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
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--muted-foreground)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </StandardPage>
  );
}
