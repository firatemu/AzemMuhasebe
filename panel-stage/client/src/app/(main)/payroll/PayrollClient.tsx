'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    InputAdornment,
    Card,
    CardContent,
    Typography,
    Paper,
    Stack,
    Chip,
    IconButton,
    Tooltip,
    alpha,
    useTheme,
    Grid,
    Divider,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid';
import { useJournals } from '@/hooks/use-journals';
import { JournalType } from '@/types/check-bill';
import { JOURNAL_TYPE_LABEL, JOURNAL_TYPE_DESCRIPTION } from '@/lib/labels';
import { formatAmount, formatDate } from '@/lib/format';
import { useRouter } from 'next/navigation';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    ReceiptLong as ReceiptLongIcon,
    History as HistoryIcon,
    AccountBalance as BankIcon,
    Person as PersonIcon,
    PointOfSale as EntryIcon,
    LocalShipping as ExitIcon
} from '@mui/icons-material';
import StandardPage from '@/components/common/StandardPage';

const AVAILABLE_TYPES = [
    JournalType.CUSTOMER_DOCUMENT_ENTRY,
    JournalType.CUSTOMER_DOCUMENT_EXIT,
    JournalType.OWN_DOCUMENT_ENTRY,
    JournalType.BANK_COLLECTION_ENDORSEMENT,
    JournalType.BANK_GUARANTEE_ENDORSEMENT,
    JournalType.ACCOUNT_DOCUMENT_ENDORSEMENT
];

export default function PayrollClient() {
    const theme = useTheme();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [type, setType] = useState<string>('');

    // Fetch logic with react-query
    const { data: journalsResponse, isLoading, refetch } = useJournals({
        search: search.length >= 3 ? search : undefined,
        type: type ? (type as JournalType) : undefined,
    });

    const journals = Array.isArray(journalsResponse) ? journalsResponse : [];

    const columns: GridColDef[] = [
        {
            field: 'journalNo',
            headerName: 'Bordro No',
            width: 140,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => router.push(`/payroll/${params.row.id}`)}
                    sx={{ fontWeight: 800, textTransform: 'none' }}
                >
                    {params.value}
                </Button>
            ),
        },
        {
            field: 'type',
            headerName: 'İşlem Türü',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {JOURNAL_TYPE_LABEL[params.value as JournalType] || params.value}
                </Typography>
            )
        },
        {
            field: 'date',
            headerName: 'Tarih',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(params.value)}
                </Typography>
            )
        },
        {
            field: 'account',
            headerName: 'Cari / Banka',
            width: 250,
            renderCell: (params) => {
                const title = params.row.account?.title || params.row.bankAccount?.name || '-';
                const isBank = !!params.row.bankAccount;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isBank ? <BankIcon sx={{ fontSize: 16, color: 'info.main' }} /> : <PersonIcon sx={{ fontSize: 16, color: 'warning.main' }} />}
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{title}</Typography>
                    </Box>
                );
            }
        },
        {
            field: 'documentCount',
            headerName: 'Evrak',
            width: 90,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Chip
                    label={`${params.value} Adet`}
                    size="small"
                    sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.divider, 0.4) }}
                />
            )
        },
        {
            field: 'totalAmount',
            headerName: 'Toplam Tutar',
            width: 150,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {formatAmount(params.value)}
                </Typography>
            )
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'İşlemler',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    key="view"
                    icon={<VisibilityIcon />}
                    label="Görüntüle"
                    onClick={() => router.push(`/payroll/${params.row.id}`)}
                />
            ],
        },
    ];

    return (
        <Box>
            {/* KPI Stats Strip */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
                {[
                    { label: 'Toplam Bordro', value: journals.length, color: 'primary.main', icon: <ReceiptLongIcon /> },
                    { label: 'Bu Ay Oluşturulan', value: 0, color: 'info.main', icon: <HistoryIcon /> },
                    { label: 'İşlemdeki Evrak', value: journals.reduce((acc, curr) => acc + (curr.documentCount || 0), 0), color: 'warning.main', icon: <VisibilityIcon /> },
                    { label: 'Genel Toplam', value: journals.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0), color: 'success.main', icon: <Typography variant="h6" sx={{ fontWeight: 900 }}>₺</Typography>, isPrice: true },
                ].map((kpi, idx) => (
                    <Box key={idx} sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.background.paper, 0.4),
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Box sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: kpi.color
                        }}>
                            {kpi.icon}
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', lineHeight: 1 }}>{kpi.label}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: kpi.color }}>
                                {kpi.isPrice ? formatAmount(kpi.value as number) : kpi.value}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Quick Actions Grid */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.disabled', letterSpacing: 2, mb: 2, display: 'block' }}>HIZLI BORDRO OLUŞTUR</Typography>
                <Grid container spacing={2}>
                    {AVAILABLE_TYPES.map(t => (
                        <Grid key={t} size={{ xs: 12, sm: 4, md: 2 }}>
                            <Card
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer',
                                    borderRadius: 3,
                                    bgcolor: 'background.paper',
                                    transition: 'all 0.2s',
                                    '&:hover': { transform: 'translateY(-2px)', borderColor: 'primary.main', boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.08)}` }
                                }}
                                onClick={() => router.push(`/payroll/new?type=${t}`)}
                            >
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, display: 'block', mb: 0.5, opacity: 0.8 }}>
                                        {JOURNAL_TYPE_LABEL[t].split(' ')[0]}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '0.75rem' }}>
                                        {JOURNAL_TYPE_LABEL[t]}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Filter Toolbar */}
            <Box sx={{
                mb: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <TextField
                    id="payroll-search"
                    size="small"
                    placeholder="Bordro no, cari veya banka ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 320, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }
                    }}
                />

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="payroll-type-label">İşlem Türü</InputLabel>
                    <Select
                        labelId="payroll-type-label"
                        id="payroll-type-select"
                        value={type}
                        onChange={(e) => setType(e.target.value as string)}
                        label="İşlem Türü"
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="">Tümü</MenuItem>
                        {Object.keys(JOURNAL_TYPE_LABEL).map((key) => (
                            <MenuItem key={key} value={key}>
                                {JOURNAL_TYPE_LABEL[key as JournalType]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Stack direction="row" spacing={1}>
                    <Chip label="Bugün" size="small" variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 700, cursor: 'pointer' }} />
                    <Chip label="Bu Ay" size="small" variant="outlined" sx={{ borderRadius: 1.5, fontWeight: 700, cursor: 'pointer' }} />
                </Stack>

                {(search || type) && (
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => { setSearch(''); setType(''); }}
                        sx={{ fontWeight: 800, textTransform: 'none' }}
                    >
                        Temizle
                    </Button>
                )}
            </Box>

            {/* DataGrid */}
            <Box sx={{
                height: 600,
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                <DataGrid
                    rows={journals}
                    columns={columns}
                    loading={isLoading}
                    pageSizeOptions={[25, 50, 100]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                        sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
                    }}
                    disableRowSelectionOnClick
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        },
                        '& .MuiDataGrid-cell': {
                            borderColor: 'divider',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 900,
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            letterSpacing: 1,
                        }
                    }}
                />
            </Box>
        </Box>
    );
}
