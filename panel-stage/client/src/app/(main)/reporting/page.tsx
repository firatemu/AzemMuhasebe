'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  useTheme,
  alpha,
  Paper,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  Timeline as ChartIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  ArrowForward as ArrowForwardIcon,
  AccountBalanceWallet as FinanceIcon,
  Inventory as StockIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  AutoGraph as AnalyticsIcon,
  Dashboard as DashboardIcon,
  CompareArrows as FlowIcon,
  AssignmentTurnedIn as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import StandardPage from '@/components/common/StandardPage';
import axios from '@/lib/axios';
import { formatAmount } from '@/lib/format';

interface OverviewData {
  range: { startDate: string; endDate: string; preset: string };
  financialSummary: {
    totalSales: number;
    totalSalesReturns: number;
    totalPurchases: number;
    totalPurchaseReturns: number;
    grossProfit: number;
    collections: number;
    payments: number;
    expenses: number;
    netCashFlow: number;
  };
  receivables: { total: number; overdue: number };
  payables: { total: number; overdue: number };
}

export default function RaporlamaPage() {
  const theme = useTheme();
  const router = useRouter();

  const { data: overview, isLoading } = useQuery<OverviewData>({
    queryKey: ['reporting-overview'],
    queryFn: async () => {
      const res = await axios.get('/reporting/overview');
      return res.data;
    },
  });

  const reportCategories = [
    {
      title: 'Finansal Raporlar',
      icon: <FinanceIcon />,
      color: theme.palette.primary.main,
      description: 'İşletmenizin nakit akışı, mizan ve finansal sağlığına dair derinlemesine analizler.',
      items: [
        { title: 'Genel Mizan', description: 'Tüm hesapların borç/alacak bakiye özeti', path: '/reports/mizan' },
        { title: 'Kasa/Banka Durumu', description: 'Likidite ve nakit akışı raporu', path: '/reports/cash-flow' },
        { title: 'Cari Risk Limitleri', description: 'Müşteri bazlı risk ve limit analizi', path: '/reporting/cari-risk-limitleri' },
        { title: 'Vade Analizi', description: 'Ödeme ve tahsilat vade projeksiyonu', path: '/maturity-analysis' },
      ]
    },
    {
      title: 'Satış & Pazarlama',
      icon: <AnalyticsIcon />,
      color: theme.palette.success.main,
      description: 'Satış performansı, personel verimliliği ve müşteri alışkanlıklarını takip edin.',
      items: [
        { title: 'Satış Elemanı Performansı', description: 'Personel bazlı satış ve prim takibi', path: '/reporting/satis-elemani' },
        { title: 'En Çok Satan Ürünler', description: 'Ürün bazlı karlılık ve hacim analizi', path: '/reports/best-sellers' },
        { title: 'Müşteri Sadakati', description: 'Sürekli müşterilerin alışveriş alışkanlıkları', path: '/reports/customer-loyalty' },
      ]
    },
    {
      title: 'Stok & Depo',
      icon: <StockIcon />,
      color: theme.palette.warning.main,
      description: 'Envanter yönetimi, kritik seviyeler ve depo bazlı stok hareketleri.',
      items: [
        { title: 'Kritik Stok Seviyeleri', description: 'Azalan ve tükenmek üzere olan ürünler', path: '/reports/critical-stocks' },
        { title: 'Depo Bazlı Envanter', description: 'Lokasyon bazlı stok miktarları ve değerleri', path: '/reports/warehouse-inventory' },
        { title: 'Stok Hareket Analizi', description: 'Ürün giriş-çıkış hızı ve rotasyon', path: '/reports/stock-velocity' },
      ]
    },
    {
      title: 'Yönetsel Özetler',
      icon: <DashboardIcon />,
      color: theme.palette.info.main,
      description: 'Kar/zarar analizi, gider dağılımı ve üst düzey operasyonel özetler.',
      items: [
        { title: 'Günlük Özet (Snapshot)', description: 'Günün tüm operasyonel verilerinin özeti', path: '/dashboard' },
        { title: 'Kar/Zarar Analizi', description: 'Dönemsel net karlılık hesaplamaları', path: '/reports/profit-loss' },
        { title: 'Gider Dağılımı', description: 'Kategori bazlı masraf ve gider analizi', path: '/reports/expense-distribution' },
      ]
    }
  ];

  return (
    <StandardPage
      title="Raporlama ve Analiz Merkezi"
      breadcrumbs={[{ label: 'Raporlama' }]}
      headerActions={
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SearchIcon />}
            sx={{ fontWeight: 800, borderRadius: 2.5, px: 2, border: '1.5px solid', borderColor: 'divider' }}
          >
            Rapor Bul
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<StarIcon />}
            sx={{ fontWeight: 900, borderRadius: 2.5, px: 3, boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}` }}
          >
            Favoriler
          </Button>
        </Stack>
      }
    >
      <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5, letterSpacing: -0.5 }}>İşletmenizi Verilerle Yönetin</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 700, lineHeight: 1.6 }}>
            Finansal durumunuzdan stok hareketlerine kadar tüm verilerinizi gerçek zamanlı olarak izleyin. Eksiksiz raporlama araçlarıyla stratejik kararlarınızı sağlam temellere oturtun.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100, bgcolor: alpha(theme.palette.success.main, 0.05), borderColor: alpha(theme.palette.success.main, 0.1) }}>
            <VerifiedIcon color="success" sx={{ mb: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 900 }}>GÜNCEL</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100, bgcolor: alpha(theme.palette.info.main, 0.05), borderColor: alpha(theme.palette.info.main, 0.1) }}>
            <AnalyticsIcon color="info" sx={{ mb: 1 }} />
            <Typography variant="caption" sx={{ fontWeight: 900 }}>ANALİTİK</Typography>
          </Paper>
        </Box>
      </Box>

      {/* KPI Stats Strip - from API */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              bgcolor: 'background.paper',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <Box sx={{ p: 1.8, borderRadius: 3, bgcolor: alpha(theme.palette.success.main, 0.12), color: 'success.main', display: 'flex' }}>
              <TrendingUpIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1, mb: 0.5, letterSpacing: -1 }}>
                {isLoading ? <CircularProgress size={18} /> : formatAmount(overview?.financialSummary?.totalSales ?? 0)}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 0.5 }}>TOPLAM SATIŞ</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              bgcolor: 'background.paper',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <Box sx={{ p: 1.8, borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.12), color: 'info.main', display: 'flex' }}>
              <FlowIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1, mb: 0.5, letterSpacing: -1 }}>
                {isLoading ? <CircularProgress size={18} /> : formatAmount(overview?.financialSummary?.netCashFlow ?? 0)}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 0.5 }}>NET NAKİT AKIŞI</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              bgcolor: 'background.paper',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <Box sx={{ p: 1.8, borderRadius: 3, bgcolor: alpha(theme.palette.warning.main, 0.12), color: 'warning.main', display: 'flex' }}>
              <ReportIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1, mb: 0.5, letterSpacing: -1 }}>
                {isLoading ? <CircularProgress size={18} /> : formatAmount(overview?.receivables?.total ?? 0)}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 0.5 }}>ALACAKLAR</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              bgcolor: 'background.paper',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <Box sx={{ p: 1.8, borderRadius: 3, bgcolor: alpha(theme.palette.error.main, 0.12), color: 'error.main', display: 'flex' }}>
              <WarningIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1, mb: 0.5, letterSpacing: -1 }}>
                {isLoading ? <CircularProgress size={18} /> : formatAmount(overview?.payables?.total ?? 0)}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 0.5 }}>BORÇLAR</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.85rem', color: 'text.secondary' }}>
        <Box sx={{ width: 40, height: 2, bgcolor: 'primary.main', borderRadius: 1 }} />
        Rapor Katalogları
      </Typography>

      <Grid container spacing={4}>
        {reportCategories.map((category, idx) => (
          <Grid size={{ xs: 12, md: 6 }} key={idx}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 6,
                border: '1.5px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                height: '100%',
                bgcolor: 'background.paper',
                boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.03)}`
              }}
            >
              <Box sx={{ px: 4, py: 3, bgcolor: alpha(category.color, 0.04), borderBottom: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(category.color, 0.1), color: category.color, display: 'flex' }}>
                    {React.cloneElement(category.icon as any, { sx: { fontSize: 24 } })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>{category.title}</Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{category.description}</Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Stack divider={<Divider sx={{ mx: 4 }} />}>
                  {category.items.map((item, itemIdx) => (
                    <Box
                      key={itemIdx}
                      sx={{
                        px: 4,
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: alpha(category.color, 0.03),
                          '& .arrow-icon': { transform: 'translateX(6px)', color: category.color },
                          '& .report-title': { color: category.color }
                        }
                      }}
                      onClick={() => router.push(item.path)}
                    >
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <Typography variant="subtitle1" className="report-title" sx={{ fontWeight: 800, transition: 'color 0.2s', mb: 0.25 }}>{item.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 500 }}>{item.description}</Typography>
                      </Box>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <IconButton size="small" sx={{ p: 1, bgcolor: alpha(theme.palette.action.disabledBackground, 0.1) }}>
                          <DownloadIcon sx={{ fontSize: 18, opacity: 0.6 }} />
                        </IconButton>
                        <ArrowForwardIcon className="arrow-icon" sx={{ fontSize: 20, color: 'text.disabled', transition: 'all 0.3s' }} />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper
        variant="outlined"
        sx={{
          mt: 8,
          p: 6,
          borderRadius: 6,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          border: '2px dashed',
          borderColor: alpha(theme.palette.primary.main, 0.15),
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}>
          <AnalyticsIcon sx={{ fontSize: 200 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 950, mb: 1, letterSpacing: -0.5 }}>Özel Rapor Çözümleri</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 600, mx: 'auto', fontWeight: 500 }}>
          İşletmenize özel verinin farklı bir perspektiften analizi mi gerekiyor? Size özel veri setleri ve görselleştirmeler tasarlayabiliriz.
        </Typography>
        <Button
          variant="contained"
          sx={{ fontWeight: 900, px: 5, py: 1.5, borderRadius: 3, boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}` }}
          startIcon={<ReportIcon />}
        >
          Rapor Tasarım Talebi Oluştur
        </Button>
      </Paper>
    </StandardPage>
  );
}
