'use client';

import React from 'react';
import { Typography, Grid, Card, CardContent, CardActionArea, Box, alpha, useTheme } from '@mui/material';
import { Inventory, Category, DirectionsCar, Calculate, Assessment, PriceChange, PointOfSale, Straighten, Warehouse } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { StandardPage, StandardCard } from '@/components/common';

const menuItems = [
  {
    title: 'Malzeme Listesi',
    description: 'Tüm stok kartlarını görüntüleyin, ekleyin ve temel özellikleri yönetin',
    icon: Inventory,
    href: '/stock/material-list',
    color: '#0ea5e9', // Blue
  },
  {
    title: 'Malzeme Hareketleri',
    description: 'Stok giriş, çıkış ve ambarlar arası hareket geçmişini inceleyin',
    icon: Assessment,
    href: '/stock/material-movements',
    color: '#6366f1', // Indigo
  },
  {
    title: 'Marka Yönetimi',
    description: 'Sistemde kullanılan stok markalarını tanımlayın ve düzenleyin',
    icon: DirectionsCar,
    href: '/stock/brand-management',
    color: '#f59e0b', // Amber
  },
  {
    title: 'Kategori Yönetimi',
    description: 'Ürün kategorilerini hiyerarşik olarak düzenleyin',
    icon: Category,
    href: '/stock/category-management',
    color: '#10b981', // Emerald
  },
  {
    title: 'Birim Setleri',
    description: 'Farklı birim kümeleri ve çevrim katsayılarını yönetin',
    icon: Straighten,
    href: '/stock/unit-sets',
    color: '#8b5cf6', // Violet
  },
  {
    title: 'Satış Fiyatları',
    description: 'Stok bazlı güncel satış fiyat listelerini yönetin',
    icon: PointOfSale,
    href: '/stock/sales-prices',
    color: '#ef4444', // Red
  },
  {
    title: 'Alış Fiyatları',
    description: 'Tedarikçi bazlı alış fiyatlarını ve maliyetleri takip edin',
    icon: PriceChange,
    href: '/stock/purchase-prices',
    color: '#ec4899', // Pink
  },
  {
    title: 'Maliyet Hesaplama',
    description: 'FIFO veya Ortalama maliyet yöntemleriyle stok değerleme',
    icon: Calculate,
    href: '/stock/costing',
    color: '#06b6d4', // Cyan
  },
];

export default function StokPage() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <StandardPage
      title="Stok Yönetimi"
      subtitle="Malzeme kartları, fiyat listeleri, kategoriler ve envanter hareketlerini buradan yönetebilirsiniz."
    >
      <Grid container spacing={3}>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <StandardCard
                noPadding
                sx={{
                  height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: theme.shadows[8],
                    borderColor: item.color,
                  }
                }}
              >
                <CardActionArea
                  onClick={() => router.push(item.href)}
                  sx={{ height: '100%', p: 3 }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '20px',
                        bgcolor: alpha(item.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        border: `1px solid ${alpha(item.color, 0.2)}`,
                        transition: 'all 0.3s ease',
                        '.MuiCardActionArea-root:hover &': {
                          bgcolor: item.color,
                          '& svg': { color: '#fff' }
                        }
                      }}
                    >
                      <IconComponent sx={{ fontSize: 32, color: item.color, transition: 'color 0.3s ease' }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        mb: 1,
                        fontSize: '1.1rem'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        px: 1
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </CardActionArea>
              </StandardCard>
            </Grid>
          );
        })}
      </Grid>
    </StandardPage>
  );
}
