'use client';

import React, { useReducer, useState, useEffect } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    IconButton,
    Autocomplete,
    alpha,
    useTheme,
    Divider,
    Paper,
    Stack,
    Alert
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { QK } from '@/lib/query-keys';
import { JournalType, CheckBillType, PortfolioType, CheckBillStatus } from '@/types/check-bill';
import { JOURNAL_TYPE_LABEL, JOURNAL_TYPE_DESCRIPTION, TYPE_LABEL } from '@/lib/labels';
import { formatAmount, formatDate } from '@/lib/format';
import { wizardReducer, initialState, WizardDocument } from './wizard-reducer';
import AccountSelect from '@/components/common/AccountSelect';
import BankAccountSelect from '@/components/common/BankAccountSelect';
import { TURKISH_BANKS } from '@/constants/bankalar';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {
    Delete as DeleteIcon,
    ChevronRight as NextIcon,
    ChevronLeft as BackIcon,
    CheckCircle as ConfirmIcon,
    Add as AddIcon,
    Assignment as InfoIcon,
    ListAlt as ListIcon
} from '@mui/icons-material';
import { useChecks } from '@/hooks/use-checks';

const STEPS = ['Bordro Türü', 'Genel Bilgiler', 'Evrak Listesi', 'Onay'];

const AVAILABLE_TYPES = [
    JournalType.CUSTOMER_DOCUMENT_ENTRY,
    JournalType.CUSTOMER_DOCUMENT_EXIT,
    JournalType.OWN_DOCUMENT_ENTRY,
    JournalType.BANK_COLLECTION_ENDORSEMENT,
    JournalType.BANK_GUARANTEE_ENDORSEMENT,
    JournalType.ACCOUNT_DOCUMENT_ENDORSEMENT
];

export default function PayrollWizardClient() {
    const theme = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const qc = useQueryClient();
    const [state, dispatch] = useReducer(wizardReducer, initialState);

    const isSelectionMode = state.type && [
        JournalType.CUSTOMER_DOCUMENT_EXIT,
        JournalType.BANK_COLLECTION_ENDORSEMENT,
        JournalType.BANK_GUARANTEE_ENDORSEMENT,
        JournalType.ACCOUNT_DOCUMENT_ENDORSEMENT
    ].includes(state.type);

    // Fetch portfolio documents for selection mode
    const { data: checksList, isLoading: isPortfolioLoading } = useChecks(
        isSelectionMode
            ? {
                  status: CheckBillStatus.IN_PORTFOLIO,
                  portfolioType: PortfolioType.CREDIT,
                  take: 500,
                  sortBy: 'dueDate',
                  sortOrder: 'asc',
              }
            : undefined
    );
    const portfolioChecks = checksList?.items ?? [];

    useEffect(() => {
        const typeParam = searchParams.get('type') as JournalType;
        if (typeParam && AVAILABLE_TYPES.includes(typeParam) && !state.type) {
            dispatch({ type: 'SET_JOURNAL_TYPE', payload: typeParam });
        }
    }, [searchParams, state.type]);

    useEffect(() => {
        if (state.type && !state.journalNo) {
            axios.get('/code-templates/next-code/CHECK_BILL_JOURNAL')
                .then(res => {
                    if (res.data?.nextCode) {
                        dispatch({
                            type: 'SET_INFO',
                            payload: { journalNo: res.data.nextCode }
                        });
                    }
                })
                .catch(err => console.error('Error:', err));
        }
    }, [state.type, state.journalNo]);

    const [currentDoc, setCurrentDoc] = useState<Partial<WizardDocument>>({
        type: CheckBillType.CHECK,
        dueDate: state.date,
        amount: 0,
        checkNo: '',
        serialNo: '',
        bank: '',
        branch: '',
        accountNo: '',
        notes: ''
    });

    useEffect(() => {
        if (state.activeStep === 2 && !isSelectionMode && !currentDoc.checkNo) {
            axios.get('/code-templates/preview-code/CHECK_BILL_DOCUMENT')
                .then(res => {
                    if (res.data?.nextCode) {
                        setCurrentDoc(prev => ({ ...prev, checkNo: res.data.nextCode }));
                    }
                })
                .catch(err => console.error('Error:', err));
        }
    }, [state.activeStep, isSelectionMode, currentDoc.checkNo === '']);

    const createMutation = useMutation({
        mutationFn: async (payload: any) => {
            const res = await axios.post('/check-bill-journals', payload);
            return res.data;
        },
        onSuccess: (data: any) => {
            qc.invalidateQueries({ queryKey: QK.journals() });
            router.push(`/payroll/${data.id}`);
        }
    });

    const handleNext = () => dispatch({ type: 'NEXT_STEP' });
    const handleBack = () => dispatch({ type: 'PREV_STEP' });

    const isStep2Valid = state.date && (
        (state.type === JournalType.CUSTOMER_DOCUMENT_ENTRY && state.accountId) ||
        (state.type === JournalType.OWN_DOCUMENT_ENTRY && state.accountId) ||
        (state.type === JournalType.BANK_COLLECTION_ENDORSEMENT && state.bankAccountId) ||
        ((state.type === JournalType.CUSTOMER_DOCUMENT_EXIT || state.type === JournalType.ACCOUNT_DOCUMENT_ENDORSEMENT) && state.accountId)
    );

    const handleSubmit = () => {
        createMutation.mutate({
            type: state.type,
            journalNo: state.journalNo,
            date: new Date(state.date).toISOString(),
            accountId: state.accountId,
            bankAccountId: state.bankAccountId,
            cashboxId: state.cashboxId,
            notes: state.notes,
            selectedDocumentIds: isSelectionMode ? state.selectedDocumentIds : [],
            newDocuments: !isSelectionMode ? state.documents.map((doc: any) => ({
                type: doc.type,
                portfolioType: doc.portfolioType,
                amount: Number(doc.amount),
                dueDate: new Date(doc.dueDate).toISOString(),
                checkNo: doc.checkNo || '',
                serialNo: doc.serialNo || '',
                bank: doc.bank,
                branch: doc.branch,
                accountNo: doc.accountNo,
                notes: doc.notes
            })) : []
        });
    };

    const handleAddDocument = () => {
        if (!currentDoc.amount || currentDoc.amount <= 0) return;
        dispatch({
            type: 'ADD_DOCUMENT',
            payload: {
                id: Math.random().toString(36).substring(7),
                type: currentDoc.type || CheckBillType.CHECK,
                portfolioType: state.type === JournalType.OWN_DOCUMENT_ENTRY ? PortfolioType.DEBIT : PortfolioType.CREDIT,
                amount: Number(currentDoc.amount),
                dueDate: currentDoc.dueDate || state.date,
                checkNo: currentDoc.checkNo,
                serialNo: currentDoc.serialNo,
                bank: currentDoc.bank,
                branch: currentDoc.branch,
                accountNo: currentDoc.accountNo,
                notes: currentDoc.notes
            }
        });
        setCurrentDoc({
            type: currentDoc.type,
            dueDate: currentDoc.dueDate,
            amount: 0,
            checkNo: '',
            serialNo: '',
            bank: '',
            branch: '',
            accountNo: '',
            notes: ''
        });
    };

    const documentColumns: GridColDef[] = [
        {
            field: 'type',
            headerName: 'Tip',
            flex: 1,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    {TYPE_LABEL[params.value as CheckBillType] || params.value}
                </Typography>
            )
        },
        {
            field: 'dueDate',
            headerName: 'Vade',
            flex: 1,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatDate(params.value)}
                </Typography>
            )
        },
        { field: 'checkNo', headerName: 'Evrak No', flex: 1 },
        {
            field: 'amount',
            headerName: 'Tutar',
            flex: 1,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {formatAmount(params.value)}
                </Typography>
            )
        },
        { field: 'bank', headerName: 'Banka', flex: 1 },
        {
            field: 'actions',
            headerName: '',
            width: 60,
            renderCell: (params) => (
                <IconButton size="small" color="error" onClick={() => dispatch({ type: 'REMOVE_DOCUMENT', payload: params.row.id })}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )
        }
    ];

    const pickColumns: GridColDef[] = [
        { field: 'checkNo', headerName: 'Evrak No', flex: 1 },
        { field: 'type', headerName: 'Tip', flex: 0.8, valueFormatter: (value) => TYPE_LABEL[value as CheckBillType] || value },
        { field: 'dueDate', headerName: 'Vade', flex: 1, valueFormatter: (value) => formatDate(value) },
        { field: 'amount', headerName: 'Tutar', flex: 1, type: 'number', valueFormatter: (value) => formatAmount(value) },
        { field: 'bank', headerName: 'Banka', flex: 1.2 },
        { field: 'branch', headerName: 'Şube', flex: 1 },
    ];

    const renderStep1 = () => (
        <Grid container spacing={2.5}>
            {AVAILABLE_TYPES.map(type => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={type}>
                    <Card
                        variant="outlined"
                        sx={{
                            cursor: 'pointer',
                            height: '100%',
                            borderRadius: 4,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderColor: state.type === type ? 'primary.main' : 'divider',
                            borderWidth: state.type === type ? 2 : 1,
                            bgcolor: state.type === type ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
                            boxShadow: state.type === type ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
                            '&:hover': {
                                borderColor: 'primary.light',
                                transform: 'translateY(-4px)'
                            }
                        }}
                        onClick={() => dispatch({ type: 'SET_JOURNAL_TYPE', payload: type })}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: state.type === type ? 'primary.main' : 'text.primary', mb: 1, letterSpacing: '-0.02e' }}>
                                {JOURNAL_TYPE_LABEL[type]}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                                {JOURNAL_TYPE_DESCRIPTION[type]}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    const renderStep2 = () => (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    fullWidth
                    label="Bordro Tarihi"
                    type="date"
                    required
                    value={state.date}
                    onChange={(e) => dispatch({ type: 'SET_INFO', payload: { date: e.target.value } })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    fullWidth
                    label="Bordro Numarası"
                    placeholder="Otomatik üretilir..."
                    value={state.journalNo}
                    onChange={(e) => dispatch({ type: 'SET_INFO', payload: { journalNo: e.target.value } })}
                    helperText="Şablona göre otomatik üretilir, isterseniz elle değiştirebilirsiniz."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
            </Grid>

            {(state.type === JournalType.CUSTOMER_DOCUMENT_ENTRY || state.type === JournalType.OWN_DOCUMENT_ENTRY || state.type === JournalType.CUSTOMER_DOCUMENT_EXIT || state.type === JournalType.ACCOUNT_DOCUMENT_ENDORSEMENT) && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <AccountSelect
                        value={state.accountId}
                        onChange={(val) => dispatch({ type: 'SET_INFO', payload: { accountId: val } })}
                        required
                        helperText="İşlemin yapılacağı cari hesabı seçin"
                    />
                </Grid>
            )}

            {(state.type === JournalType.BANK_COLLECTION_ENDORSEMENT || state.type === JournalType.BANK_GUARANTEE_ENDORSEMENT) && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <BankAccountSelect
                        value={state.bankAccountId}
                        onChange={(val) => dispatch({ type: 'SET_INFO', payload: { bankAccountId: val } })}
                        required
                        helperText="Gönderilecek banka hesabını seçin"
                    />
                </Grid>
            )}

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bordro Açıklaması (Opsiyonel)"
                    placeholder="Bu bordro ile ilgili notlarınızı buraya yazabilirsiniz..."
                    value={state.notes}
                    onChange={(e) => dispatch({ type: 'SET_INFO', payload: { notes: e.target.value } })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
            </Grid>
        </Grid>
    );

    const renderStep3 = () => (
        <Box>
            {isSelectionMode ? (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Portföyden Evrak Seçimi</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Lütfen işlem yapmak istediğiniz evrakları listeden seçiniz. Sadece portföyünüzde bulunan müşteri evrakları listelenmektedir.
                        </Typography>
                    </Box>
                    <Paper variant="outlined" sx={{ height: 450, width: '100%', mb: 2, borderRadius: 3, overflow: 'hidden' }}>
                        <DataGrid
                            rows={portfolioChecks || []}
                            columns={pickColumns}
                            loading={isPortfolioLoading}
                            checkboxSelection
                            disableRowSelectionOnClick
                            onRowSelectionModelChange={(newModel: GridRowSelectionModel) => {
                                dispatch({
                                    type: 'SET_SELECTED_DOCUMENTS',
                                    payload: Array.from(newModel.ids) as string[]
                                });
                            }}
                            rowSelectionModel={{
                                type: 'include',
                                ids: new Set(state.selectedDocumentIds)
                            }}
                            sx={{ border: 'none' }}
                        />
                    </Paper>
                    <Box display="flex" justifyContent="flex-end" sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>
                            Seçilen Toplam: {formatAmount((portfolioChecks || [])
                                .filter(c => state.selectedDocumentIds.includes(c.id))
                                .reduce((acc, curr) => acc + curr.amount, 0))}
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Yeni Evrak Ekleme</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Bordroya dahil edilecek çek veya senet bilgilerini girerek listeye ekleyin.
                        </Typography>
                    </Box>

                    <Paper variant="outlined" sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: alpha(theme.palette.background.paper, 0.4) }}>
                        <Grid container spacing={2.5}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Evrak Tipi"
                                    value={currentDoc.type}
                                    onChange={(e) => setCurrentDoc({ ...currentDoc, type: e.target.value as CheckBillType })}
                                    SelectProps={{ native: true }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                >
                                    <option value={CheckBillType.CHECK}>{TYPE_LABEL[CheckBillType.CHECK]}</option>
                                    <option value={CheckBillType.PROMISSORY}>{TYPE_LABEL[CheckBillType.PROMISSORY]}</option>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Vade Tarihi"
                                    value={currentDoc.dueDate || ''}
                                    onChange={(e) => setCurrentDoc({ ...currentDoc, dueDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Evrak No"
                                    value={currentDoc.checkNo || ''}
                                    onChange={(e) => setCurrentDoc({ ...currentDoc, checkNo: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                    helperText="Otomatik üretilir veya el ile girilebilir."
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Tutar"
                                    value={currentDoc.amount || ''}
                                    onChange={(e) => setCurrentDoc({ ...currentDoc, amount: Number(e.target.value) })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                />
                            </Grid>

                            {currentDoc.type === CheckBillType.CHECK && (
                                <>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Autocomplete
                                            fullWidth
                                            options={TURKISH_BANKS}
                                            value={currentDoc.bank || ''}
                                            onChange={(_, newValue) => setCurrentDoc({ ...currentDoc, bank: newValue || '' })}
                                            onInputChange={(_, newInputValue) => {
                                                if (newInputValue !== currentDoc.bank) {
                                                    setCurrentDoc(prev => ({ ...prev, bank: newInputValue }));
                                                }
                                            }}
                                            freeSolo
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Banka"
                                                    placeholder="Seçin veya yazın..."
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Şube"
                                            value={currentDoc.branch || ''}
                                            onChange={(e) => setCurrentDoc({ ...currentDoc, branch: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Hesap No"
                                            value={currentDoc.accountNo || ''}
                                            onChange={(e) => setCurrentDoc({ ...currentDoc, accountNo: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Seri No"
                                            value={currentDoc.serialNo || ''}
                                            onChange={(e) => setCurrentDoc({ ...currentDoc, serialNo: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                        />
                                    </Grid>
                                </>
                            )}
                            <Grid size={{ xs: 12, md: 10 }}>
                                <TextField
                                    fullWidth
                                    label="Evrak Açıklaması (Opsiyonel)"
                                    value={currentDoc.notes || ''}
                                    onChange={(e) => setCurrentDoc({ ...currentDoc, notes: e.target.value })}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex' }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<AddIcon />}
                                    onClick={handleAddDocument}
                                    disabled={!currentDoc.amount || !currentDoc.dueDate || !currentDoc.checkNo}
                                    sx={{ height: '100%', borderRadius: 3, fontWeight: 800 }}
                                >
                                    Listeye Ekle
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.disabled', letterSpacing: 2, mb: 2 }}>GİRİLEN EVRAKLAR</Typography>
                    <Paper variant="outlined" sx={{ height: 350, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
                        <DataGrid
                            rows={state.documents}
                            columns={documentColumns}
                            disableRowSelectionOnClick
                            hideFooter
                            sx={{ border: 'none' }}
                        />
                    </Paper>
                </>
            )}
        </Box>
    );

    const renderStep4 = () => {
        const totalAmount = isSelectionMode
            ? (portfolioChecks || []).filter(c => state.selectedDocumentIds.includes(c.id)).reduce((acc, curr) => acc + curr.amount, 0)
            : state.documents.reduce((acc, curr: any) => acc + Number(curr.amount), 0);

        const totalCount = isSelectionMode ? state.selectedDocumentIds.length : state.documents.length;

        return (
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Önizleme ve Onay</Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.disabled', letterSpacing: 2, mb: 3 }}>BORDRO BİLGİLERİ</Typography>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Bordro Türü</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{state.type ? JOURNAL_TYPE_LABEL[state.type] : '-'}</Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Tarih</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{formatDate(state.date)}</Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Bordro No</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{state.journalNo}</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.04), borderColor: 'primary.light', height: '100%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 2, mb: 3 }}>ÖZET</Typography>
                            <Stack spacing={3} sx={{ height: 'calc(100% - 40px)', justifyContent: 'center' }}>
                                <Box textAlign="center">
                                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>{formatAmount(totalAmount)}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Toplam Tutar</Typography>
                                </Box>
                                <Divider />
                                <Box textAlign="center">
                                    <Typography variant="h4" sx={{ fontWeight: 900 }}>{totalCount}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Toplam Evrak Adedi</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }}>
                    <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
                        Kaydet butonuna tıkladığınızda bordro ve evrak hareketleri işlenecektir. Bu işlem geri alınabilir fakat evrak durumlarının manuel düzeltilmesi gerekebilir.
                    </Alert>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        color="primary"
                        startIcon={<ConfirmIcon />}
                        onClick={handleSubmit}
                        disabled={createMutation.isPending || totalCount === 0}
                        sx={{ py: 2, borderRadius: 4, fontWeight: 900, fontSize: '1.1rem', boxShadow: theme.shadows[8] }}
                    >
                        {createMutation.isPending ? 'Kaydediliyor...' : 'Bordroyu Onayla ve Kaydet'}
                    </Button>
                </Box>
            </Box>
        );
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0: return renderStep1();
            case 1: return renderStep2();
            case 2: return renderStep3();
            case 3: return renderStep4();
            default: return null;
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 6, bgcolor: 'background.paper' }}>
                <Stepper activeStep={state.activeStep} alternativeLabel sx={{ mb: 6 }}>
                    {STEPS.map((label) => (
                        <Step key={label}>
                            <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 800, fontSize: '0.85rem' } }}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ minHeight: 400 }}>
                    {getStepContent(state.activeStep)}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                        disabled={state.activeStep === 0}
                        onClick={handleBack}
                        startIcon={<BackIcon />}
                        sx={{ fontWeight: 800, borderRadius: 2 }}
                    >
                        Geri
                    </Button>
                    {state.activeStep < STEPS.length - 1 && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            endIcon={<NextIcon />}
                            disabled={
                                (state.activeStep === 0 && !state.type) ||
                                (state.activeStep === 1 && !isStep2Valid) ||
                                (state.activeStep === 2 && (isSelectionMode ? state.selectedDocumentIds.length === 0 : state.documents.length === 0))
                            }
                            sx={{ fontWeight: 900, borderRadius: 3, px: 4 }}
                        >
                            Devam Et
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
