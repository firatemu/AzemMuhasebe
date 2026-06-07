'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    Paper,
    Stack,
    CircularProgress,
    useTheme,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    useCheck,
    useCheckEndorsements,
    useCheckCollections,
    useDeleteCheck,
    useUpdateCheck,
    useCheckAction,
    useCheckTimeline,
    useCheckGlEntries,
    useCheckDocuments,
} from '@/hooks/use-checks';
import { CheckBill, CheckBillStatus, CheckBillType } from '@/types/check-bill';
import { STATUS_LABEL, STATUS_MUI_COLOR, TYPE_LABEL, PORTFOLIO_LABEL } from '@/lib/labels';
import { formatAmount, formatDate, isOverdue } from '@/lib/format';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TimelineIcon from '@mui/icons-material/Timeline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DeleteConfirmDialog, CheckStatusActionDialog, CheckEditDialog, CheckStatusActionPayload } from '@/components/checks/CheckDialogs';
import { useSnackbar } from 'notistack';
import { getAllowedNextStatuses } from '@/lib/check-bill-transitions';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export default function CheckDetailClient({ checkId }: { checkId: string }) {
    const router = useRouter();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { data: check, isLoading } = useCheck(checkId);
    const { data: endorsements, isLoading: endorsementsLoading } = useCheckEndorsements(checkId);
    const { data: collections, isLoading: collectionsLoading } = useCheckCollections(checkId);
    const { data: timeline, isLoading: timelineLoading } = useCheckTimeline(checkId);
    const { data: glRows, isLoading: glLoading } = useCheckGlEntries(checkId);
    const { data: documents, isLoading: documentsLoading } = useCheckDocuments(checkId);

    const deleteCheck = useDeleteCheck();
    const updateCheck = useUpdateCheck();
    const checkAction = useCheckAction();

    const [tab, setTab] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [actionDialog, setActionDialog] = useState<{ open: boolean; targetStatus: CheckBillStatus | null }>({
        open: false,
        targetStatus: null,
    });
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    if (isLoading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!check) {
        return (
            <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" color="text.secondary">Evrak bulunamadı.</Typography>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.push('/checks')}>
                    Listeye Dön
                </Button>
            </Box>
        );
    }

    const handleDelete = async () => {
        try {
            await deleteCheck.mutateAsync(checkId);
            enqueueSnackbar('Evrak başarıyla silindi.', { variant: 'success' });
            router.push('/checks');
        } catch {
            enqueueSnackbar('Silme işlemi başarısız oldu.', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const handleEdit = async (data: Parameters<typeof updateCheck.mutateAsync>[0]['data']) => {
        try {
            await updateCheck.mutateAsync({ id: checkId, data });
            enqueueSnackbar('Evrak güncellendi.', { variant: 'success' });
            setEditDialogOpen(false);
        } catch {
            enqueueSnackbar('Güncelleme başarısız oldu.', { variant: 'error' });
        }
    };

    const handleStatusAction = async (payload: CheckStatusActionPayload) => {
        if (!actionDialog.targetStatus) return;
        try {
            await checkAction.mutateAsync({
                checkBillId: checkId,
                newStatus: actionDialog.targetStatus,
                date: payload.date,
                transactionAmount: payload.transactionAmount,
                paymentMethod: payload.paymentMethod,
                cashboxId: payload.cashboxId,
                bankAccountId: payload.bankAccountId,
                toAccountId: payload.toAccountId,
                notes: payload.notes || undefined,
            });
            enqueueSnackbar('Evrak durumu güncellendi.', { variant: 'success' });
        } catch (err: any) {
            let errorMsg = 'İşlem başarısız oldu.';
            if (err?.response?.data?.message) {
                const msg = err.response.data.message;
                errorMsg = Array.isArray(msg) ? msg.join(', ') : msg;
            }
            enqueueSnackbar(errorMsg, { variant: 'error' });
        } finally {
            setActionDialog({ open: false, targetStatus: null });
        }
    };

    const openAction = (status: CheckBillStatus) => {
        setMenuAnchorEl(null);
        setActionDialog({ open: true, targetStatus: status });
    };

    const collectionColumns: GridColDef[] = [
        {
            field: 'collectionDate',
            headerName: 'Tarih',
            width: 130,
            valueFormatter: (_v, row) => formatDate((row as any).collectionDate),
        },
        {
            field: 'collectedAmount',
            headerName: 'Tutar',
            flex: 1,
            align: 'right',
            headerAlign: 'right',
            valueFormatter: (_v, row) => formatAmount((row as any).collectedAmount),
        },
        {
            field: 'paymentLocation',
            headerName: 'Kasa / Banka',
            flex: 2,
            valueGetter: (_v, row: any) =>
                row?.cashbox?.name || row?.bankAccount?.name || 'Belirtilmedi',
        },
    ];

    const endorsementColumns: GridColDef[] = [
        { field: 'sequence', headerName: 'Sıra', width: 70 },
        {
            field: 'endorsedAt',
            headerName: 'Tarih',
            flex: 1,
            valueFormatter: (_v, row) => formatDate((row as any).endorsedAt),
        },
        {
            field: 'fromAccount',
            headerName: 'Çıkış',
            flex: 2,
            valueGetter: (_v, row: any) => row?.fromAccount?.title || 'Bilinmiyor',
        },
        {
            field: 'toAccount',
            headerName: 'Varış',
            flex: 2,
            valueGetter: (_v, row: any) => row?.toAccount?.title || 'Bilinmiyor',
        },
    ];

    const allowed = getAllowedNextStatuses(check.status, check.portfolioType).filter(
        (st) => ![CheckBillStatus.COLLECTED, CheckBillStatus.PAID, CheckBillStatus.PARTIAL_PAID].includes(st)
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <IconButton size="small" onClick={() => router.push('/checks')} sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.contrastText' }}>
                            <AccountBalanceWalletIcon fontSize="small" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>
                                {check.checkNo || 'Senet'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {(TYPE_LABEL as Record<string, string>)[check.type]} · {(PORTFOLIO_LABEL as Record<string, string>)[check.portfolioType]}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={(STATUS_LABEL as Record<string, string>)[check.status]} color={(STATUS_MUI_COLOR as Record<string, any>)[check.status]} size="small" sx={{ fontWeight: 600 }} />
                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon fontSize="small" />}
                        onClick={() => window.open(`/checks/${checkId}/receipt`, '_blank')}
                        sx={{ bgcolor: 'var(--card)' }}
                    >
                        Makbuz
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                        startIcon={<MoreHorizIcon />}
                    >
                        İşlemler
                    </Button>
                </Stack>
            </Box>

            {/* Action Menu (Creative Design) */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        minWidth: 280,
                        mt: 1,
                        borderRadius: 3,
                        border: '1px solid var(--border)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        overflow: 'visible',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            borderTop: '1px solid var(--border)',
                            borderLeft: '1px solid var(--border)',
                        },
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1.5, bgcolor: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Evrak İşlemleri
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                            {check.checkNo || 'Senet'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatAmount(check.amount)}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ px: 1.5, py: 1 }}>
                    <Typography variant="caption" sx={{ px: 1, fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Hızlı İşlemler
                    </Typography>
                    <MenuItem
                        onClick={() => { router.push(`/checks/${check.id}/collection`); setMenuAnchorEl(null); }}
                        disabled={check.status === CheckBillStatus.COLLECTED || check.status === CheckBillStatus.PAID}
                        sx={{ px: 1.5, py: 1, borderRadius: 2, my: 0.25, color: 'var(--chart-3)', '&:hover': { bgcolor: 'color-mix(in srgb, var(--chart-3) 10%, transparent)' }, '&.Mui-disabled': { opacity: 0.5 } }}
                    >
                        <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><PaymentsIcon fontSize="small" /></ListItemIcon>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Tahsilat / Ödeme Yap</Typography>
                    </MenuItem>
                    <MenuItem
                        onClick={() => { setEditDialogOpen(true); setMenuAnchorEl(null); }}
                        disabled={![CheckBillStatus.IN_PORTFOLIO, CheckBillStatus.PARTIAL_PAID].includes(check.status)}
                        sx={{ px: 1.5, py: 1, borderRadius: 2, my: 0.25, color: 'var(--primary)', '&:hover': { bgcolor: 'var(--secondary)' }, '&.Mui-disabled': { opacity: 0.5 } }}
                    >
                        <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><EditIcon fontSize="small" /></ListItemIcon>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Evrakı Düzenle</Typography>
                    </MenuItem>
                </Box>

                <Divider sx={{ mx: 2, my: 0.5 }} />

                <Box sx={{ px: 1.5, py: 1 }}>
                    <Typography variant="caption" sx={{ px: 1, fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Durum Geçişleri
                    </Typography>
                    {allowed.length === 0 ? (
                        <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 1, display: 'block' }}>
                            Mevcut durumdan başka işlem yapılamaz.
                        </Typography>
                    ) : (
                        allowed.map((st) => {
                            const actionLabel: Partial<Record<CheckBillStatus, string>> = {
                                [CheckBillStatus.IN_BANK_COLLECTION]: 'Bankaya Tahsilata Ver',
                                [CheckBillStatus.IN_BANK_GUARANTEE]: 'Bankaya Teminata Ver',
                                [CheckBillStatus.ENDORSED]: 'Ciro Et',
                                [CheckBillStatus.RETURNED]: 'İade Et',
                                [CheckBillStatus.CANCELLED]: 'İptal Et',
                                [CheckBillStatus.WITHOUT_COVERAGE]: 'Karşılıksız İşle',
                                [CheckBillStatus.PROTESTED]: 'Protesto Et',
                                [CheckBillStatus.LEGAL_FOLLOWUP]: 'Hukuki Takibe Al',
                                [CheckBillStatus.IN_PORTFOLIO]: 'Portföye Al',
                            };
                            return (
                                <MenuItem
                                    key={st}
                                    onClick={() => openAction(st)}
                                    sx={{ px: 1.5, py: 1, borderRadius: 2, my: 0.25, color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>→ {actionLabel[st] ?? (STATUS_LABEL as Record<string, string>)[st]}</Typography>
                                </MenuItem>
                            );
                        })
                    )}
                </Box>

                <Divider sx={{ mx: 2, my: 0.5 }} />

                <Box sx={{ px: 1.5, py: 1 }}>
                    <Typography variant="caption" sx={{ px: 1, fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Gelişmiş İşlemler
                    </Typography>
                    <MenuItem
                        onClick={() => { setDeleteDialogOpen(true); setMenuAnchorEl(null); }}
                        disabled={check.status !== CheckBillStatus.IN_PORTFOLIO}
                        sx={{ px: 1.5, py: 1, borderRadius: 2, my: 0.25, color: 'var(--destructive)', '&:hover': { bgcolor: 'var(--destructive)', color: 'white', '& .MuiListItemIcon-root': { color: 'white' } }, '&.Mui-disabled': { opacity: 0.5 } }}
                    >
                        <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><DeleteIcon fontSize="small" color="inherit" /></ListItemIcon>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Evrakı Sil</Typography>
                    </MenuItem>
                </Box>
            </Menu>

            <Grid container spacing={3}>
                {/* Left Column: Summary */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 3, boxShadow: 'var(--shadow-sm)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ borderBottom: '1px solid var(--border)', pb: 1, mb: 2 }}>
                                Evrak Bilgileri
                            </Typography>

                            <Stack spacing={2.5}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                        Cari Hesap
                                    </Typography>
                                    <Typography variant="body1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                        {check.account?.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {check.account?.code}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                            Tutar
                                        </Typography>
                                        <Typography variant="h6" color="primary.main" fontWeight={800}>
                                            {formatAmount(check.amount)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                            Kalan Tutar
                                        </Typography>
                                        <Typography variant="h6" color="var(--chart-3)" fontWeight={800}>
                                            {formatAmount(check.remainingAmount)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                            Vade Tarihi
                                        </Typography>
                                        <Typography variant="body1" fontWeight={700} color={isOverdue(check.dueDate) && check.status === CheckBillStatus.IN_PORTFOLIO ? 'error.main' : 'inherit'}>
                                            {formatDate(check.dueDate)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                            Banka / Şube
                                        </Typography>
                                        <Typography variant="body1" fontWeight={700}>
                                            {check.bank || '—'} / {check.branch || '—'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {check.notes && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                            Açıklama / Not
                                        </Typography>
                                        <Typography variant="body2" sx={{ p: 1.5, bgcolor: 'var(--muted)', borderRadius: 2 }}>
                                            {check.notes}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column: Tabs */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 3, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                        <Tabs
                            value={tab}
                            onChange={(_, v) => setTab(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ borderBottom: '1px solid var(--border)', px: 2, pt: 1, bgcolor: 'var(--muted)' }}
                        >
                            <Tab label="Zaman Çizelgesi" icon={<TimelineIcon fontSize="small" />} iconPosition="start" sx={{ minHeight: 48, fontWeight: 600 }} />
                            <Tab label="Tahsilat / Ödeme Geçmişi" sx={{ minHeight: 48, fontWeight: 600 }} />
                            <Tab label="Ciro Geçmişi" sx={{ minHeight: 48, fontWeight: 600 }} />
                            <Tab label="Muhasebe Kayıtları" sx={{ minHeight: 48, fontWeight: 600 }} />
                            <Tab label="Belge & Referans" sx={{ minHeight: 48, fontWeight: 600 }} />
                        </Tabs>

                        <Box sx={{ px: 3 }}>
                            {/* Timeline Tab */}
                            <TabPanel value={tab} index={0}>
                                {timelineLoading ? (
                                    <CircularProgress size={28} />
                                ) : (
                                    <Stack spacing={2} sx={{ position: 'relative', '&::before': { content: '""', position: 'absolute', top: 0, bottom: 0, left: 16, width: 2, bgcolor: 'var(--border)' } }}>
                                        {(timeline?.events ?? []).map((ev: any, i: number) => (
                                            <Box key={i} sx={{ display: 'flex', gap: 2, position: 'relative' }}>
                                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main', border: '2px solid var(--card)', position: 'relative', zIndex: 1, mt: 1, ml: 1.3 }} />
                                                <Paper variant="outlined" sx={{ flex: 1, p: 2, borderRadius: 2, borderColor: 'var(--border)', bgcolor: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2" fontWeight={800}>
                                                            {ev.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(ev.at)}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                                        {ev.kind}
                                                    </Typography>
                                                    {ev.payload && (
                                                        <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', m: 0, p: 1, bgcolor: 'var(--muted)', borderRadius: 1 }}>
                                                            {JSON.stringify(ev.payload, null, 2)}
                                                        </Typography>
                                                    )}
                                                </Paper>
                                            </Box>
                                        ))}
                                        {(timeline?.events ?? []).length === 0 && (
                                            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Hareket kaydı bulunamadı.</Typography>
                                        )}
                                    </Stack>
                                )}
                            </TabPanel>

                            {/* Collections Tab */}
                            <TabPanel value={tab} index={1}>
                                <Box sx={{ height: 360, width: '100%' }}>
                                    <DataGrid
                                        rows={collections || []}
                                        columns={collectionColumns}
                                        loading={collectionsLoading}
                                        getRowId={(r: any) => r.id}
                                        disableRowSelectionOnClick
                                        hideFooter
                                        sx={{ border: 'none', '& .MuiDataGrid-cell': { borderBottom: '1px solid var(--border)' } }}
                                        localeText={{ noRowsLabel: 'Tahsilat veya ödeme hareketi yok.' }}
                                    />
                                </Box>
                            </TabPanel>

                            {/* Endorsements Tab */}
                            <TabPanel value={tab} index={2}>
                                <Box sx={{ height: 360, width: '100%' }}>
                                    <DataGrid
                                        rows={endorsements || []}
                                        columns={endorsementColumns}
                                        loading={endorsementsLoading}
                                        getRowId={(r: any) => r.id}
                                        disableRowSelectionOnClick
                                        hideFooter
                                        sx={{ border: 'none', '& .MuiDataGrid-cell': { borderBottom: '1px solid var(--border)' } }}
                                        localeText={{ noRowsLabel: 'Ciro hareketi yok.' }}
                                    />
                                </Box>
                            </TabPanel>

                            {/* GL Entries Tab */}
                            <TabPanel value={tab} index={3}>
                                {glLoading ? (
                                    <CircularProgress size={28} />
                                ) : (
                                    <Box sx={{ overflowX: 'auto' }}>
                                        <Table size="small">
                                            <TableHead sx={{ bgcolor: 'var(--muted)' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Fiş No</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Borç Hesap</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Alacak Hesap</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Borç</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Alacak</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Açıklama</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(glRows ?? []).map((r: any) => (
                                                    <TableRow key={r.id} sx={{ '&:last-child td': { border: 0 } }}>
                                                        <TableCell>{formatDate(r.accountingDate)}</TableCell>
                                                        <TableCell>{r.glJournalNo ?? '—'}</TableCell>
                                                        <TableCell>{r.debitAccountCode ?? '—'}</TableCell>
                                                        <TableCell>{r.creditAccountCode ?? '—'}</TableCell>
                                                        <TableCell align="right">
                                                            {r.debitAmount != null ? formatAmount(Number(r.debitAmount)) : '—'}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {r.creditAmount != null ? formatAmount(Number(r.creditAmount)) : '—'}
                                                        </TableCell>
                                                        <TableCell>{r.description || '—'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                )}
                                {!glLoading && (glRows ?? []).length === 0 && (
                                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>Muhasebe satırı bulunamadı.</Typography>
                                )}
                            </TabPanel>

                            {/* Documents Tab */}
                            <TabPanel value={tab} index={4}>
                                {documentsLoading ? (
                                    <CircularProgress size={28} />
                                ) : (
                                    <Stack spacing={3}>
                                        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                                    Dahili Referans
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {documents?.internalRef ?? '—'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                                    Harici Referans
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {documents?.externalRef ?? '—'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" gutterBottom>
                                                    Etiketler
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {(documents?.tags ?? []).length ? (
                                                        documents?.tags.map((tag: string) => (
                                                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                                                        ))
                                                    ) : (
                                                        <Typography variant="body2" fontWeight={500}>—</Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ borderBottom: '1px solid var(--border)', pb: 1, mb: 2 }}>
                                                Ekli Belgeler
                                            </Typography>
                                            {Array.isArray(documents?.attachmentUrls) && (documents?.attachmentUrls as string[]).length > 0 ? (
                                                <Stack spacing={1}>
                                                    {(documents!.attachmentUrls as string[]).map((url, i) => (
                                                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', p: 1.5, border: '1px solid var(--border)', borderRadius: 2, bgcolor: 'var(--muted)' }}>
                                                            <Link href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 500, fontSize: '0.875rem' }}>
                                                                {url.split('/').pop() || `Ek ${i + 1}`}
                                                            </Link>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'var(--muted)', borderRadius: 2, border: '1px dashed var(--border)' }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Bu evraka ait herhangi bir ek bulunamadı.
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Stack>
                                )}
                            </TabPanel>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Dialogs */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                title="Evrak Silinecek"
                description={`"${check.checkNo || 'Bu evrak'}" numaralı kayıt silinecek.`}
                loading={deleteCheck.isPending}
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
            />

            <CheckEditDialog
                open={editDialogOpen}
                check={check as CheckBill}
                loading={updateCheck.isPending}
                onCancel={() => setEditDialogOpen(false)}
                onConfirm={handleEdit}
            />

            <CheckStatusActionDialog
                open={actionDialog.open}
                targetStatus={actionDialog.targetStatus}
                checkBill={check as CheckBill}
                loading={checkAction.isPending}
                onCancel={() => setActionDialog({ open: false, targetStatus: null })}
                onConfirm={handleStatusAction}
            />
        </Box>
    );
}
