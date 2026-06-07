'use client';

import React, { useState, useMemo } from 'react';
import {
    Box, Card, Typography, Button, IconButton, Chip,
    Divider, Tooltip, Stack, alpha, useTheme, Paper,
    CircularProgress, Alert, LinearProgress, Tab, Tabs,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useJournal, useDeleteJournal } from '@/hooks/use-journals';
import { CheckBillType, CheckBillStatus, PortfolioType } from '@/types/check-bill';
import { JOURNAL_TYPE_LABEL, STATUS_LABEL, STATUS_MUI_COLOR, PORTFOLIO_LABEL } from '@/lib/labels';
import { formatAmount, formatDate, isOverdue } from '@/lib/format';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import PaymentsIcon from '@mui/icons-material/Payments';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { DeleteConfirmDialog } from '@/components/checks/CheckDialogs';
import { useSnackbar } from 'notistack';

function StatCard({ label, value, subtitle, color = 'primary', icon }: {
    label: string; value: string; subtitle?: string;
    color?: 'primary' | 'success' | 'warning' | 'error' | 'info'; icon: React.ReactNode;
}) {
    const theme = useTheme();
    return (
        <Card variant="outlined" sx={{
            p: 2.5, height: '100%', borderRadius: 3,
            borderColor: 'var(--border)', bgcolor: 'var(--card)',
            position: 'relative', overflow: 'hidden',
        }}>
            <Box sx={{
                position: 'absolute', top: -16, right: -16, width: 80, height: 80,
                borderRadius: '50%', bgcolor: alpha(theme.palette[color].main, 0.08),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Box sx={{ color: `${color}.main`, opacity: 0.5, mt: 2, mr: 2 }}>{icon}</Box>
            </Box>
            <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={1}>
                {label}
            </Typography>
            <Typography variant="h5" fontWeight={900} color={`${color}.main`}>{value}</Typography>
            {subtitle && (
                <Typography variant="caption" color="text.secondary" mt={0.5} display="block">{subtitle}</Typography>
            )}
        </Card>
    );
}

export default function PayrollDetailClient({ journalId }: { journalId: string }) {
    const theme = useTheme();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { data: journal, isLoading } = useJournal(journalId);
    const deleteJournal = useDeleteJournal();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tab, setTab] = useState(0);

    const handleDeleteJournal = async () => {
        try {
            await deleteJournal.mutateAsync(journalId);
            enqueueSnackbar('Bordro silindi.', { variant: 'success' });
            router.push('/payroll');
        } catch {
            enqueueSnackbar('Silme başarısız oldu.', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    // İstatistikler
    const stats = useMemo(() => {
        const bills = journal?.checkBills ?? [];
        const total = bills.reduce((s, b) => s + Number(b.amount), 0);
        const remaining = bills.reduce((s, b) => s + Number(b.remainingAmount ?? b.amount), 0);
        const collected = total - remaining;
        const overdueCount = bills.filter(b =>
            isOverdue(b.dueDate) && b.status === CheckBillStatus.IN_PORTFOLIO
        ).length;
        const collectedCount = bills.filter(b =>
            b.status === CheckBillStatus.COLLECTED || b.status === CheckBillStatus.PAID
        ).length;
        const checkCount = bills.filter(b => b.type === CheckBillType.CHECK).length;
        const noteCount = bills.filter(b => b.type === CheckBillType.PROMISSORY_NOTE).length;

        return { total, remaining, collected, overdueCount, collectedCount, checkCount, noteCount, count: bills.length };
    }, [journal]);

    const progressPct = stats.total > 0 ? (stats.collected / stats.total) * 100 : 0;

    // DataGrid sütunları
    const columns: GridColDef[] = [
        {
            field: 'type', headerName: 'Tip', width: 78,
            renderCell: (params) => (
                <Chip size="small" variant="outlined"
                    label={params.value === CheckBillType.CHECK ? 'Çek' : 'Senet'}
                    icon={params.value === CheckBillType.CHECK ? <CreditCardIcon sx={{ fontSize: 14 }} /> : <LocalAtmIcon sx={{ fontSize: 14 }} />}
                    sx={{ fontWeight: 700, borderRadius: 1.5, fontSize: 11 }} />
            ),
        },
        {
            field: 'portfolioType', headerName: 'Portföy', width: 100,
            renderCell: (params) => (
                <Chip size="small" variant="outlined"
                    label={PORTFOLIO_LABEL[params.value as PortfolioType]}
                    color={params.value === PortfolioType.CREDIT ? 'primary' : 'secondary'}
                    sx={{ fontWeight: 800, borderRadius: 1.5, fontSize: 11 }} />
            ),
        },
        {
            field: 'checkNo', headerName: 'Evrak No', width: 130, renderCell: (params) => (
                <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace', letterSpacing: 0.5 }}>
                    {params.value || '—'}
                </Typography>
            )
        },
        {
            field: 'bank', headerName: 'Banka / Şube', width: 200,
            renderCell: (params) => !params.row.bank ? <Typography variant="body2" color="text.disabled">—</Typography> : (
                <Box>
                    <Typography variant="body2" fontWeight={700}>{params.row.bank}</Typography>
                    {params.row.branch && <Typography variant="caption" color="text.secondary">{params.row.branch}</Typography>}
                </Box>
            ),
        },
        {
            field: 'dueDate', headerName: 'Vade', width: 120,
            renderCell: (params) => {
                const overdue = isOverdue(params.value) && params.row.status === CheckBillStatus.IN_PORTFOLIO;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" fontWeight={700} color={overdue ? 'error.main' : 'text.primary'}>
                            {formatDate(params.value)}
                        </Typography>
                        {overdue && <WarningAmberIcon color="error" sx={{ fontSize: 14 }} />}
                    </Box>
                );
            },
        },
        {
            field: 'amount', headerName: 'Tutar', width: 140, align: 'right', headerAlign: 'right',
            renderCell: (params) => (
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight={800} color="primary.main">
                        {formatAmount(params.value)}
                    </Typography>
                    {Number(params.row.remainingAmount) !== Number(params.value) && (
                        <Typography variant="caption" color="text.secondary">
                            Kalan: {formatAmount(params.row.remainingAmount)}
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            field: 'status', headerName: 'Durum', width: 140,
            renderCell: (params) => (
                <Chip size="small" label={STATUS_LABEL[params.value as CheckBillStatus]}
                    color={STATUS_MUI_COLOR[params.value as CheckBillStatus] as any || 'default'}
                    sx={{ fontWeight: 800, borderRadius: 1.5, fontSize: 11 }} />
            ),
        },
        {
            field: 'actions', type: 'actions', headerName: '', width: 90,
            renderCell: (params) => <RowActions row={params.row} journalId={journalId} />,
        },
    ];

    // Evrak grupları (tab için)
    const bills = journal?.checkBills ?? [];
    const overdueRows = bills.filter(b => isOverdue(b.dueDate) && b.status === CheckBillStatus.IN_PORTFOLIO);
    const collectedRows = bills.filter(b => b.status === CheckBillStatus.COLLECTED || b.status === CheckBillStatus.PAID);
    const activeRows = bills.filter(b => !overdueRows.includes(b) && !collectedRows.includes(b));

    const getCurrentRows = () => {
        if (tab === 1) return overdueRows;
        if (tab === 2) return collectedRows;
        return bills;
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!journal) {
        return <Alert severity="error" sx={{ borderRadius: 2 }}>Bordro bulunamadı.</Alert>;
    }

    const counterpartyName = journal.account?.title || journal.bankAccount?.name || journal.cashbox?.name || '—';
    const counterpartyCode = journal.account?.code || '';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* ══ Üst Navigasyon ══════════════════════════════════════════════ */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/payroll')}
                    sx={{ fontWeight: 700, textTransform: 'none' }}>
                    Bordro Listesi
                </Button>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" startIcon={<PrintIcon />}
                        onClick={() => window.open(`/payroll/print/${journalId}`, '_blank')}
                        sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
                        Yazdır
                    </Button>
                    <Button variant="outlined" size="small" color="error" startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                        sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
                        Sil
                    </Button>
                </Stack>
            </Stack>

            {/* ══ Hero Kart ═════════════════════════════════════════════════ */}
            <Card variant="outlined" sx={{
                borderRadius: 3, overflow: 'hidden',
                borderColor: 'var(--border)', bgcolor: 'var(--card)',
            }}>
                {/* Başlık şeridi */}
                <Box sx={{
                    px: 3, py: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1,
                }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <DescriptionIcon color="primary" />
                        <Typography variant="subtitle2" fontWeight={900} letterSpacing={1}>
                            BORDRO — {journal.journalNo}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={JOURNAL_TYPE_LABEL[journal.type]} color="primary"
                            sx={{ fontWeight: 800, borderRadius: 1.5 }} size="small" />
                        <Chip label={formatDate(journal.date)} variant="outlined"
                            sx={{ fontWeight: 700, borderRadius: 1.5 }} size="small" />
                    </Stack>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="stretch">
                        {/* Muhatap */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 2,
                                p: 2, borderRadius: 2,
                                bgcolor: alpha(theme.palette.info.main, 0.04),
                                border: '1px solid', borderColor: alpha(theme.palette.info.main, 0.12),
                                height: '100%',
                            }}>
                                <Box sx={{
                                    p: 1.5, borderRadius: 2,
                                    bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main',
                                    display: 'flex', flexShrink: 0,
                                }}>
                                    {journal.bankAccount ? <AccountBalanceIcon sx={{ fontSize: 28 }} /> : <PersonIcon sx={{ fontSize: 28 }} />}
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">
                                        {journal.bankAccount ? 'BANKA HESABI' : 'CARİ HESAP'}
                                    </Typography>
                                    <Typography variant="h6" fontWeight={800} lineHeight={1.2}>{counterpartyName}</Typography>
                                    {counterpartyCode && (
                                        <Typography variant="body2" color="text.secondary">{counterpartyCode}</Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Toplam & kalan */}
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary">Toplam Tutar</Typography>
                                    <Typography variant="h4" fontWeight={900} color="primary.main">
                                        {formatAmount(stats.total)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary">Tahsil Edildi</Typography>
                                    <Typography variant="body1" fontWeight={800} color="success.main">
                                        {formatAmount(stats.collected)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary">Kalan Alacak</Typography>
                                    <Typography variant="body1" fontWeight={800} color="warning.main">
                                        {formatAmount(stats.remaining)}
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 0.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">Tahsilat İlerlemesi</Typography>
                                        <Typography variant="caption" color="success.main" fontWeight={800}>
                                            %{progressPct.toFixed(1)}
                                        </Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={Math.min(100, progressPct)}
                                        color="success"
                                        sx={{ height: 8, borderRadius: 4, bgcolor: alpha(theme.palette.success.main, 0.1) }} />
                                </Box>
                            </Box>
                        </Grid>

                        {/* Hızlı sayılar */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Stack spacing={1} height="100%" justifyContent="center">
                                {[
                                    { label: 'Toplam Evrak', value: stats.count, color: 'text.primary' },
                                    { label: 'Çek', value: stats.checkCount, color: 'text.secondary' },
                                    { label: 'Senet', value: stats.noteCount, color: 'text.secondary' },
                                    { label: 'Vadesi Geçmiş', value: stats.overdueCount, color: stats.overdueCount > 0 ? 'error.main' : 'text.disabled' },
                                    { label: 'Tahsil Edildi', value: stats.collectedCount, color: 'success.main' },
                                ].map((item) => (
                                    <Box key={item.label} sx={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        px: 1.5, py: 0.5, borderRadius: 1.5,
                                        bgcolor: alpha(theme.palette.divider, 0.3),
                                    }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.label}</Typography>
                                        <Typography variant="body2" fontWeight={800} color={item.color}>{item.value}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>

                    {journal.notes && (
                        <>
                            <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />
                            <Box sx={{
                                px: 2, py: 1.5, borderRadius: 2,
                                bgcolor: alpha(theme.palette.warning.main, 0.04),
                                border: '1px solid', borderColor: alpha(theme.palette.warning.main, 0.15),
                            }}>
                                <Typography variant="caption" fontWeight={800} color="warning.main" display="block" mb={0.5}>
                                    NOT
                                </Typography>
                                <Typography variant="body2" color="text.secondary">{journal.notes}</Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Card>

            {/* ══ Evrak Tablosu ════════════════════════════════════════════ */}
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', borderColor: 'var(--border)', bgcolor: 'var(--card)' }}>
                {/* Tab Bar */}
                <Box sx={{ borderBottom: '1px solid var(--border)', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Tabs value={tab} onChange={(_: any, v: any) => setTab(v)} sx={{ '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', minHeight: 48 } }}>
                        <Tab label={
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <span>Tümü</span>
                                <Chip label={bills.length} size="small" sx={{ height: 18, fontSize: 11, fontWeight: 800 }} />
                            </Stack>
                        } />
                        {overdueRows.length > 0 && (
                            <Tab label={
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <WarningAmberIcon sx={{ fontSize: 15, color: 'error.main' }} />
                                    <span>Vadesi Geçmiş</span>
                                    <Chip label={overdueRows.length} size="small" color="error" sx={{ height: 18, fontSize: 11, fontWeight: 800 }} />
                                </Stack>
                            } />
                        )}
                        {collectedRows.length > 0 && (
                            <Tab label={
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <CheckCircleIcon sx={{ fontSize: 15, color: 'success.main' }} />
                                    <span>Tahsil Edildi</span>
                                    <Chip label={collectedRows.length} size="small" color="success" sx={{ height: 18, fontSize: 11, fontWeight: 800 }} />
                                </Stack>
                            } />
                        )}
                    </Tabs>
                    <Typography variant="caption" color="text.secondary" sx={{ pr: 2, fontWeight: 700 }}>
                        {getCurrentRows().length} evrak gösteriliyor
                    </Typography>
                </Box>

                <Box sx={{ height: Math.max(320, Math.min(600, getCurrentRows().length * 52 + 110)), width: '100%' }}>
                    <DataGrid
                        rows={getCurrentRows()}
                        columns={columns}
                        disableRowSelectionOnClick
                        hideFooterPagination={getCurrentRows().length <= 100}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-row:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03) },
                            '& .MuiDataGrid-cell': { borderColor: 'var(--border)' },
                            '& .MuiDataGrid-columnHeaders': {
                                bgcolor: alpha(theme.palette.primary.main, 0.03),
                                borderRadius: 0,
                                fontWeight: 800,
                            },
                            '& .MuiDataGrid-row.overdue': { bgcolor: alpha(theme.palette.error.main, 0.04) },
                        }}
                        getRowClassName={(params) =>
                            isOverdue(params.row.dueDate) && params.row.status === CheckBillStatus.IN_PORTFOLIO ? 'overdue' : ''
                        }
                    />
                </Box>
            </Paper>

            {/* Silme Diyaloğu */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                title="Bordro Silinecek"
                description={`"${journal.journalNo}" bordrosu ve portföydeki bağlı evraklar silinecek. Bu işlem geri alınamaz.`}
                loading={deleteJournal.isPending}
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteJournal}
            />
        </Box>
    );
}

function RowActions({ row, journalId }: { row: any; journalId: string }) {
    const router = useRouter();
    return (
        <Stack direction="row" spacing={0.25}>
            <Tooltip title="Evrakı Görüntüle">
                <IconButton size="small" color="primary" onClick={() => router.push(`/checks/${row.id}`)}>
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            {row.portfolioType === PortfolioType.CREDIT && row.status === CheckBillStatus.IN_PORTFOLIO && (
                <Tooltip title="Tahsilat Ekle">
                    <IconButton size="small" color="success" onClick={() => router.push(`/checks/${row.id}/collection`)}>
                        <PaymentsIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            <Tooltip title="Makbuz">
                <IconButton size="small" onClick={() => window.open(`/payroll/print/${journalId}`, '_blank')}>
                    <PrintIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
