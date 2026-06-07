'use client';

import React from 'react';
import Link from 'next/link';
import {
    Box,
    Typography,
    Stack,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Button,
    Tabs,
    Tab,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    useCheckBillReportBankPosition,
    useCheckBillReportProtest,
    useCheckBillReportRiskExposure,
    useCheckBillReportReconciliation,
    useCheckBillReportPortfolioSummary,
    useCheckBillReportAging,
    useCheckBillReportCashflowForecast,
} from '@/hooks/use-checks';
import { STATUS_LABEL } from '@/lib/labels';
import { formatAmount } from '@/lib/format';
import { CheckBillStatus } from '@/types/check-bill';
import StandardCard from '@/components/common/StandardCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`checks-report-tabpanel-${index}`}
            aria-labelledby={`checks-report-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ChecksReportsClient() {
    const [activeTab, setActiveTab] = React.useState(0);

    const bank = useCheckBillReportBankPosition();
    const protest = useCheckBillReportProtest();
    const risk = useCheckBillReportRiskExposure();
    const recon = useCheckBillReportReconciliation();
    const portfolio = useCheckBillReportPortfolioSummary();
    const aging = useCheckBillReportAging();
    const cashflow = useCheckBillReportCashflowForecast();

    return (
        <Box sx={{ pb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={800} color="var(--foreground)">
                    Çek / Senet raporları
                </Typography>
                <Button component={Link} href="/checks" startIcon={<ArrowBackIcon />} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                    Listeye dön
                </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Özet KPI'lar tüm portföy içindir; tablolar check-bill-reports API uçlarından yüklenir.
            </Typography>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Portföy Özeti" />
                    <Tab label="Yaşlandırma Analizi" />
                    <Tab label="Nakit Akışı" />
                    <Tab label="Banka Pozisyonu" />
                </Tabs>
            </Box>

            {/* Portfolio Summary Tab */}
            <TabPanel value={activeTab} index={0}>
                {portfolio.isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <StandardCard title="Portföy Özeti">
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">TOPLAM TUTAR</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 900 }}>
                                            {formatAmount(Number((portfolio.data as any)?.totalFaceAmount ?? 0))}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">KALAN TUTAR</Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 900 }}>
                                            {formatAmount(Number((portfolio.data as any)?.totalRemainingAmount ?? 0))}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </StandardCard>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <StandardCard title="Durum Dağılımı">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Durum</TableCell>
                                            <TableCell align="right">Adet</TableCell>
                                            <TableCell align="right">Kalan tutar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {((portfolio.data as any)?.byStatus ?? []).map((row: any) => (
                                            <TableRow key={row.status}>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={STATUS_LABEL[row.status as CheckBillStatus] ?? row.status}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{row._count._all}</TableCell>
                                                <TableCell align="right">
                                                    {formatAmount(Number(row._sum?.remainingAmount ?? 0))}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </StandardCard>
                        </Grid>
                    </Grid>
                )}
            </TabPanel>

            {/* Aging Analysis Tab */}
            <TabPanel value={activeTab} index={1}>
                {aging.isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <StandardCard title="Vade Yaşlandırma Analizi">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Vade Aralığı</TableCell>
                                    <TableCell align="right">Adet</TableCell>
                                    <TableCell align="right">Tutar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(Array.isArray(aging.data) ? aging.data : []).map((row: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell sx={{ fontWeight: 800 }}>{row_bucket(row.bucket)}</TableCell>
                                        <TableCell align="right">{row.count ?? row._count ?? 0}</TableCell>
                                        <TableCell align="right">
                                            {formatAmount(Number(row.amount ?? row._sum?.remainingAmount ?? 0))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StandardCard>
                )}
            </TabPanel>

            {/* Cashflow Forecast Tab */}
            <TabPanel value={activeTab} index={2}>
                {cashflow.isLoading ? (
                    <CircularProgress size={24} />
                ) : (
                    <StandardCard title="Nakit Akışı Tahmini">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tarih</TableCell>
                                    <TableCell align="right">Tahmini Tutar</TableCell>
                                    <TableCell>Durum</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(Array.isArray(cashflow.data) ? cashflow.data : []).map((row: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell>{row.date ?? row.dueDate ?? '-'}</TableCell>
                                        <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>
                                            {formatAmount(Number(row.amount ?? row.projectedAmount ?? 0))}
                                        </TableCell>
                                        <TableCell>
                                            <Chip size="small" label={row.status ?? ' Bekleniyor'} variant="outlined" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StandardCard>
                )}
            </TabPanel>

            {/* Bank Position Tab */}
            <TabPanel value={activeTab} index={3}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <StandardCard>
                            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                                Banka pozisyonu (durum bazlı)
                            </Typography>
                            {bank.isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Durum</TableCell>
                                            <TableCell align="right">Adet</TableCell>
                                            <TableCell align="right">Kalan tutar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(bank.data?.byStatus ?? []).map((row) => (
                                            <TableRow key={row.status}>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={STATUS_LABEL[row.status as CheckBillStatus] ?? row.status}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{row._count}</TableCell>
                                                <TableCell align="right">
                                                    {formatAmount(Number(row._sum?.remainingAmount ?? 0))}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </StandardCard>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <StandardCard>
                            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                                Mutabakat özeti
                            </Typography>
                            {recon.isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Durum</TableCell>
                                            <TableCell align="right">Kayıt</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {((recon.data as { status: string; _count: number }[] | undefined) ?? []).map(
                                            (row) => (
                                                <TableRow key={row.status}>
                                                    <TableCell>{row.status}</TableCell>
                                                    <TableCell align="right">{row._count}</TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </StandardCard>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <StandardCard>
                            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                                Protesto takibi (son kayıtlar)
                            </Typography>
                            {protest.isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tarih</TableCell>
                                            <TableCell>Not</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(Array.isArray(protest.data) ? protest.data : []).slice(0, 20).map((row: any) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.protestDate ? String(row.protestDate) : '—'}</TableCell>
                                                <TableCell>{row.notes ?? '—'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </StandardCard>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <StandardCard>
                            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                                Risk limiti / maruziyet
                            </Typography>
                            {risk.isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cari</TableCell>
                                            <TableCell align="right">Limit</TableCell>
                                            <TableCell align="right">Maruziyet</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(Array.isArray(risk.data) ? risk.data : []).map((row: any) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.account?.title ?? row.accountId}</TableCell>
                                                <TableCell align="right">{formatAmount(Number(row.limitAmount ?? 0))}</TableCell>
                                                <TableCell align="right">{formatAmount(Number(row.currentExposure ?? 0))}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </StandardCard>
                    </Grid>
                </Grid>
            </TabPanel>
        </Box>
    );
}

function row_bucket(bucket: string | number | undefined): string {
    if (!bucket) return '-';
    switch (String(bucket)) {
        case '0': return 'Vadesiz';
        case '1': return '1-30 gün';
        case '2': return '31-60 gün';
        case '3': return '61-90 gün';
        case '4': return '90+ gün';
        default: return String(bucket);
    }
}
