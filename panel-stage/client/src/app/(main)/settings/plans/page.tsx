'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  RocketLaunch as RocketIcon,
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';

interface Plan {
  id: string;
  name: string;
  price: number;
  maxCompanies: number;
  maxInvoices: number;
  features: string[];
}

const PLAN_COLORS: Record<string, string> = {
  FREE: '#6b7280',
  BASIC: '#3b82f6',
  PROFESSIONAL: '#8b5cf6',
  ENTERPRISE: '#f59e0b',
};

export default function PlansPage() {
  const theme = useTheme();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Planlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === -1) return 'Fiyatlandırma için iletişime geçin';
    if (price === 0) return 'Ücretsiz';
    return `₺${price.toLocaleString()}/ay`;
  };

  const formatLimit = (value: number) => {
    if (value === -1) return 'Sınırsız';
    return value.toLocaleString();
  };

  return (
    <StandardPage
      title="Abone Planları"
      breadcrumbs={[{ label: 'Ayarlar', href: '/settings' }, { label: 'Planlar' }]}
      subtitle="İşletmeniz için en uygun planı seçin"
    >
      <Box sx={{ maxWidth: 1200 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
          sx={{ alignItems: 'stretch' }}
        >
          {plans.map((plan, index) => {
            const isPopular = plan.name === 'PROFESSIONAL';
            const color = PLAN_COLORS[plan.id] || theme.palette.primary.main;

            return (
              <Card
                key={plan.id}
                variant="outlined"
                sx={{
                  flex: 1,
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.3s ease',
                  borderColor: isPopular ? color : 'divider',
                  borderWidth: isPopular ? 2 : 1,
                  bgcolor: isPopular ? alpha(color, 0.02) : 'background.paper',
                  '&:hover': {
                    borderColor: color,
                    boxShadow: `0 8px 30px ${alpha(color, 0.15)}`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {isPopular && (
                  <Chip
                    icon={<RocketIcon sx={{ fontSize: '16px !important' }} />}
                    label="En Popüler"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 800,
                      px: 2,
                      bgcolor: color,
                      color: '#fff',
                      '& .MuiChip-icon': { color: '#fff' },
                    }}
                  />
                )}

                <CardContent sx={{ p: 4 }}>
                  {/* Plan Header */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        letterSpacing: 2,
                        color: color,
                      }}
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{ fontWeight: 800, color: color, my: 2 }}
                    >
                      {formatPrice(plan.price)}
                    </Typography>
                  </Box>

                  {/* Limits */}
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.5) }}
                  >
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Şirket Limiti
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {formatLimit(plan.maxCompanies)}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Fatura Limiti/Ay
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {formatLimit(plan.maxInvoices)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Features */}
                  <Stack spacing={1.5}>
                    {plan.features.map((feature, i) => (
                      <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                        <CheckIcon sx={{ color: 'success.main', fontSize: 20, mt: 0.3 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {feature}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        {/* Enterprise CTA */}
        <Paper
          variant="outlined"
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.warning.main, 0.05),
            borderColor: 'warning.light',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Özel İhtiyaçlarınız mı var?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sınırsız şirket, API erişimi ve özel entegrasyonlar için Enterprise planı size özel çözümler sunar.
          </Typography>
          <Chip
            label="Fiyatlandırma için iletişime geçin"
            color="warning"
            sx={{ fontWeight: 800, px: 2, py: 2.5, fontSize: '0.9rem', borderRadius: 2 }}
          />
        </Paper>
      </Box>
    </StandardPage>
  );
}
