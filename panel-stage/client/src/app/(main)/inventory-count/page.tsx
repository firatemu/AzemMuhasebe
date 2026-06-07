'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  alpha,
  useTheme,
  Paper,
  Stack
} from '@mui/material';
import StandardPage from '@/components/common/StandardPage';
import { useRouter } from 'next/navigation';
import {
  Inventory as InventoryIcon,
  QrCode2 as QrCodeIcon,
  ListAlt as ListIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';

const menuItems = [
  {
    title: 'Ürün Bazlı Sayım',
    description: 'Sadece ürün toplamını sayın, raf adresleri önemli değil. Depo genelindeki toplam stoku doğrulamak için idealdir.',
    icon: InventoryIcon,
    href: '/inventory-count/urun-bazli',
    color: 'primary',
    badge: 'Barkod Destekli',
  },
  {
    title: 'Raf Bazlı Sayım',
    description: 'Her rafta ne kadar ürün var detaylı olarak sayın. Adresli depo yönetimi için en sağlıklı yöntemdir.',
    icon: QrCodeIcon,
    href: '/inventory-count/raf-bazli',
    color: 'secondary',
    badge: 'Barkod Destekli',
  },
  {
    title: 'Sayım İşlemleri Listesi',
    description: 'Geçmiş sayımları görüntüleyin, fark raporlarını inceleyin ve stokları güncelleyerek onaylayın.',
    icon: ListIcon,
    href: '/inventory-count/liste',
    color: 'info',
    badge: null,
  },
];

export default function SayimPage() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <StandardPage
      title="Stok Sayım Yönetimi"
      breadcrumbs={[{ label: 'Stok' }, { label: 'Sayım İşlemleri' }]}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 800 }}>
          Deponuzdaki fiziksel stokları dijital verilerinizle eşitlemek için sayım yapabilirsiniz.
          Sayım sonucunda oluşan farklar otomatik olarak stok giriş/çıkış hareketleri ile düzeltilir.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const mainColor = (theme.palette as any)[item.color].main;

          return (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 5,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: mainColor,
                    bgcolor: alpha(mainColor, 0.02),
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px -10px ${alpha(mainColor, 0.2)}`,
                    '& .arrow-icon': { transform: 'translateX(4px)', opacity: 1 }
                  },
                }}
                onClick={() => router.push(item.href)}
              >
                {/* Background Decoration */}
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  opacity: 0.03,
                  color: item.color + '.main',
                  transform: 'rotate(-15deg)'
                }}>
                  <IconComponent sx={{ fontSize: 120 }} />
                </Box>

                <Stack spacing={3} alignItems="center" textAlign="center">
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3.5,
                      bgcolor: alpha(mainColor, 0.1),
                      color: mainColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 16px -4px ${alpha(mainColor, 0.1)}`,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 40 }} />
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, letterSpacing: -0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', px: 2, minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.description}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          bgcolor: alpha(mainColor, 0.08),
                          color: mainColor,
                          borderRadius: 1.5,
                          fontSize: '0.675rem',
                          height: 20
                        }}
                      />
                    )}
                    <Stack direction="row" spacing={0.5} alignItems="center" className="arrow-icon" sx={{ opacity: 0.5, transition: 'all 0.2s', color: mainColor }}>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>ŞİMDİ GİT</Typography>
                      <ArrowIcon sx={{ fontSize: 16 }} />
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </StandardPage>
  );
}
