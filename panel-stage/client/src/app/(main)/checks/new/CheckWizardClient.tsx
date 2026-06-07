'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Stepper, Step, StepLabel, Button, Typography, Paper,
    TextField, MenuItem, IconButton, Stack, Divider, CircularProgress,
    Autocomplete, Alert, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, alpha, useTheme, Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { CheckBillType, PortfolioType } from '@/types/check-bill';
import { formatAmount, formatDate } from '@/lib/format';
import AccountSelect from '@/components/common/AccountSelect';
import { TURKISH_BANKS } from '@/constants/bankalar';
import { useSnackbar } from 'notistack';
import { useCreateCheckBill } from '@/hooks/use-checks';
import axios from '@/lib/axios';

const STEPS = ['Cari ve Portföy', 'Evrak Satırları', 'Onay ve Kayıt'];
const STORAGE_KEY = 'check-wizard-draft';

interface Line {
    type: CheckBillType;
    checkNo: string;
    issueDate: string;
    dueDate: string;
    amount: string;
    serialNo: string;
    bank: string;
    branch: string;
    accountNo: string;
    debtor: string;
    notes: string;
}

interface StoredState {
    activeStep: number;
    accountId: string | null;
    portfolioType: PortfolioType;
    lines: Line[];
}

const emptyForm = (): Line => ({
    type: CheckBillType.CHECK,
    checkNo: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    amount: '',
    serialNo: '',
    bank: '',
    branch: '',
    accountNo: '',
    debtor: '',
    notes: '',
});

function loadStoredState(): StoredState | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch { }
    return null;
}

function saveStoredState(state: StoredState) {
    if (typeof window === 'undefined') return;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { }
}

function clearStoredState() {
    if (typeof window === 'undefined') return;
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADIM 1: Cari ve Portföy
// ─────────────────────────────────────────────────────────────────────────────
function Step1({
    accountId, setAccountId, portfolioType, setPortfolioType,
}: {
    accountId: string | null;
    setAccountId: (v: string | null) => void;
    portfolioType: PortfolioType;
    setPortfolioType: (v: PortfolioType) => void;
}) {
    const theme = useTheme();
    return (
        <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: 'var(--border)', bgcolor: 'var(--card)' }}>
                <Typography variant="subtitle2" fontWeight={800} letterSpacing={0.5} mb={2}>
                    CARİ HESAP
                </Typography>
                <AccountSelect value={accountId} onChange={setAccountId} required />
            </Paper>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {[
                    {
                        value: PortfolioType.CREDIT,
                        label: 'Alacak Portföyü',
                        sublabel: 'Müşteriden alınan çek / senet',
                        icon: <TrendingUpIcon />,
                        color: theme.palette.primary.main,
                    },
                    {
                        value: PortfolioType.DEBIT,
                        label: 'Borç Portföyü',
                        sublabel: 'Firmamız tarafından verilen çek / senet',
                        icon: <TrendingDownIcon />,
                        color: theme.palette.secondary.main,
                    },
                ].map((option) => {
                    const selected = portfolioType === option.value;
                    return (
                        <Paper
                            key={option.value}
                            variant="outlined"
                            onClick={() => setPortfolioType(option.value)}
                            sx={{
                                flex: 1, p: 2.5, borderRadius: 3, cursor: 'pointer',
                                borderWidth: selected ? 2 : 1,
                                borderColor: selected ? option.color : 'var(--border)',
                                bgcolor: selected ? alpha(option.color, 0.04) : 'var(--card)',
                                transition: 'all 0.15s ease',
                                '&:hover': { borderColor: option.color, bgcolor: alpha(option.color, 0.03) },
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ color: selected ? option.color : 'text.disabled', display: 'flex' }}>
                                    {option.icon}
                                </Box>
                                <Box flex={1}>
                                    <Typography variant="body2" fontWeight={800}
                                        color={selected ? option.color : 'text.primary'}>
                                        {option.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">{option.sublabel}</Typography>
                                </Box>
                                {selected && <CheckCircleIcon sx={{ color: option.color, fontSize: 20 }} />}
                            </Stack>
                        </Paper>
                    );
                })}
            </Stack>
        </Stack>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADIM 2: Evrak Satırları
// ─────────────────────────────────────────────────────────────────────────────
function Step2({
    lines, setLines,
}: {
    lines: Line[];
    setLines: React.Dispatch<React.SetStateAction<Line[]>>;
}) {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = useState<Line>(emptyForm());
    const [loadingAutoNo, setLoadingAutoNo] = useState(false);

    const set = (k: keyof Line, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const fetchAutoNo = async () => {
        try {
            setLoadingAutoNo(true);
            const res = await axios.get('/code-templates/preview-code/CHECK_BILL_DOCUMENT');
            setForm((f) => ({ ...f, checkNo: res.data.nextCode }));
            enqueueSnackbar('Otomatik numara girildi.', { variant: 'success' });
        } catch {
            enqueueSnackbar('Numara şablonu bulunamadı.', { variant: 'error' });
        } finally {
            setLoadingAutoNo(false);
        }
    };

    const fillAllAutoNumbers = async () => {
        try {
            setLoadingAutoNo(true);
            const res = await axios.get('/code-templates/preview-code/CHECK_BILL_DOCUMENT');
            const base = res.data.nextCode as string;
            const match = base.match(/^(.*?)(\d+)$/);
            if (!match) { enqueueSnackbar('Numara formatı okunamadı.', { variant: 'error' }); return; }
            const [, prefix, numberStr] = match;
            const baseNum = parseInt(numberStr, 10);
            const len = numberStr.length;
            setLines((prev) => prev.map((l, i) => ({
                ...l, checkNo: prefix + String(baseNum + i).padStart(len, '0'),
            })));
            enqueueSnackbar('Tüm satırlara otomatik numara eklendi.', { variant: 'success' });
        } catch {
            enqueueSnackbar('Numara şablonu bulunamadı.', { variant: 'error' });
        } finally {
            setLoadingAutoNo(false);
        }
    };

    const addToLines = async () => {
        if (!form.checkNo || !form.dueDate || !form.amount || Number(form.amount) <= 0) {
            enqueueSnackbar('Evrak no, vade ve tutar zorunludur.', { variant: 'warning' });
            return;
        }
        setLines((prev) => [...prev, { ...form }]);

        // Listeye eklendikten sonra formu sıfırla ve yeni otomatik numara çek
        setForm(emptyForm());

        // Otomatik olarak bir sonraki numarayı çek
        try {
            const res = await axios.get('/code-templates/preview-code/CHECK_BILL_DOCUMENT');
            setForm((f) => ({ ...f, checkNo: res.data.nextCode }));
        } catch {
            // Numara çekilemezse sessizce geç
        }

        enqueueSnackbar('Evrak listeye eklendi.', { variant: 'success' });
    };

    const removeLine = (i: number) => setLines((prev) => prev.filter((_, idx) => idx !== i));

    const total = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    const isFormValid = !!form.checkNo && !!form.dueDate && !!form.amount && Number(form.amount) > 0;

    return (
        <Stack spacing={3}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
                💡 İpucu: Evrak numaralarını <strong>Ayarlar → Numara Şablonları</strong> sayfasından otomatik oluşturabilirsiniz.
            </Alert>

            {/* ══ Yeni Evrak Formu ══════════════════════════════════════════ */}
            <Paper variant="outlined" sx={{
                borderRadius: 3, overflow: 'hidden',
                borderColor: 'var(--border)', bgcolor: 'var(--card)',
            }}>
                {/* Başlık */}
                <Box sx={{
                    px: 3, py: 2,
                    borderBottom: '1px solid var(--border)',
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight={800}>Yeni Evrak Ekle</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Formu doldurun, ardından aşağıdaki <strong>Listeye Ekle</strong> butonuna tıklayın
                        </Typography>
                    </Box>
                    <Chip label={form.type === CheckBillType.CHECK ? 'ÇEK' : 'SENET'} size="small"
                        icon={form.type === CheckBillType.CHECK ? <CreditCardIcon sx={{ fontSize: 14 }} /> : <LocalAtmIcon sx={{ fontSize: 14 }} />}
                        color={form.type === CheckBillType.CHECK ? 'primary' : 'secondary'}
                        sx={{ fontWeight: 800, borderRadius: 1.5 }} />
                </Box>

                <Box sx={{ p: 3 }}>
                    {/* Satır 1: Zorunlu alanlar */}
                    <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={1.5}>
                        ZORUNLU BİLGİLER
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        {/* Tip */}
                        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                            <TextField select fullWidth label="Belge Tipi" value={form.type} size="small"
                                onChange={(e) => set('type', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                                <MenuItem value={CheckBillType.CHECK}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CreditCardIcon fontSize="small" />
                                        <span>Çek</span>
                                    </Stack>
                                </MenuItem>
                                <MenuItem value={CheckBillType.PROMISSORY}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <LocalAtmIcon fontSize="small" />
                                        <span>Senet</span>
                                    </Stack>
                                </MenuItem>
                            </TextField>
                        </Grid>

                        {/* Tanzim Tarihi */}
                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField fullWidth type="date" label="Tanzim Tarihi" value={form.issueDate} size="small"
                                onChange={(e) => set('issueDate', e.target.value)}
                                InputLabelProps={{ shrink: true }} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>

                        {/* Vade Tarihi */}
                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField fullWidth type="date" label="Vade Tarihi" value={form.dueDate} size="small"
                                onChange={(e) => set('dueDate', e.target.value)}
                                InputLabelProps={{ shrink: true }} required
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>

                        {/* Tutar */}
                        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                            <TextField fullWidth type="number" label="Tutar (₺)" value={form.amount} size="small"
                                onChange={(e) => set('amount', e.target.value)}
                                required
                                inputProps={{ step: '0.01', min: 0.01 }}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 700 },
                                    '& input[type=number]': { MozAppearance: 'textfield' },
                                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                        WebkitAppearance: 'none', margin: 0,
                                    },
                                }} />
                        </Grid>

                        {/* Evrak No + Otomatik No */}
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Stack direction="row" spacing={0.5}>
                                <TextField fullWidth label="Evrak / Çek No" value={form.checkNo} size="small"
                                    onChange={(e) => set('checkNo', e.target.value)}
                                    required
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                <Tooltip title="Otomatik numara al">
                                    <IconButton size="small" onClick={fetchAutoNo} disabled={loadingAutoNo}
                                        color="primary"
                                        sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), borderRadius: 2, width: 40 }}>
                                        {loadingAutoNo ? <CircularProgress size={14} /> : <AutoAwesomeIcon fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Satır 2: Banka bilgileri */}
                    <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={1.5}>
                        BANKA BİLGİLERİ <span style={{ fontWeight: 400 }}>(opsiyonel)</span>
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Autocomplete freeSolo options={TURKISH_BANKS} value={form.bank}
                                onChange={(_, v) => set('bank', v || '')}
                                onInputChange={(_, v) => set('bank', v)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Banka" fullWidth size="small"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                )} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField fullWidth label="Şube" value={form.branch} size="small"
                                onChange={(e) => set('branch', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField fullWidth label="Hesap No" value={form.accountNo} size="small"
                                onChange={(e) => set('accountNo', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField fullWidth label="Seri No" value={form.serialNo} size="small"
                                onChange={(e) => set('serialNo', e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        </Grid>
                    </Grid>

                    {/* Satır 3: Not */}
                    <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={1.5}>
                        NOT <span style={{ fontWeight: 400 }}>(opsiyonel)</span>
                    </Typography>
                    <TextField fullWidth multiline rows={2} label="Açıklama" value={form.notes} size="small"
                        onChange={(e) => set('notes', e.target.value)}
                        placeholder="Bu evrak hakkında not ekleyebilirsiniz..."
                        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />

                    {/* ── LİSTEYE EKLE butonu — formun en altında ── */}
                    <Divider sx={{ mb: 2.5 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<PlaylistAddIcon />}
                            onClick={addToLines}
                            disabled={!isFormValid}
                            sx={{
                                borderRadius: 2.5, fontWeight: 800, textTransform: 'none',
                                px: 4, py: 1.2, minWidth: 200,
                                background: isFormValid
                                    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                                    : undefined,
                                boxShadow: isFormValid ? `0 4px 16px ${alpha(theme.palette.primary.main, 0.35)}` : 'none',
                            }}
                        >
                            Listeye Ekle
                            {isFormValid && form.amount && (
                                <Chip
                                    label={formatAmount(Number(form.amount))}
                                    size="small"
                                    sx={{ ml: 1, height: 20, fontSize: 11, fontWeight: 800, bgcolor: 'rgba(255,255,255,0.25)', color: 'inherit' }}
                                />
                            )}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* ══ Evrak Listesi ══════════════════════════════════════════════ */}
            <Paper variant="outlined" sx={{
                borderRadius: 3, overflow: 'hidden',
                borderColor: lines.length > 0 ? alpha(theme.palette.success.main, 0.35) : 'var(--border)',
                bgcolor: 'var(--card)',
            }}>
                <Box sx={{
                    px: 3, py: 2,
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    bgcolor: lines.length > 0 ? alpha(theme.palette.success.main, 0.04) : 'transparent',
                }}>
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle1" fontWeight={800}>Evrak Listesi</Typography>
                            {lines.length > 0 && (
                                <Chip label={`${lines.length} evrak`} size="small" color="success"
                                    sx={{ fontWeight: 800, borderRadius: 1.5, height: 20 }} />
                            )}
                        </Stack>
                        {lines.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                Toplam nominal: <strong>{formatAmount(total)}</strong>
                            </Typography>
                        )}
                    </Box>
                    {lines.length > 0 && (
                        <Button size="small" variant="outlined" startIcon={loadingAutoNo ? <CircularProgress size={14} /> : <AutoAwesomeIcon />}
                            onClick={fillAllAutoNumbers} disabled={loadingAutoNo}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                            Tüm Satırlara Otomatik No
                        </Button>
                    )}
                </Box>
                <TableContainer>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow sx={{
                                '& th': {
                                    fontWeight: 800,
                                    color: 'text.secondary',
                                    fontSize: 11,
                                    letterSpacing: 1,
                                    textTransform: 'uppercase',
                                    borderBottom: '2px solid var(--border)',
                                    bgcolor: 'transparent',
                                    py: 2
                                }
                            }}>
                                <TableCell width={40}>#</TableCell>
                                <TableCell>Tip</TableCell>
                                <TableCell>Evrak No / Tarihler</TableCell>
                                <TableCell>Banka Bilgileri</TableCell>
                                <TableCell>Seri / Hesap No</TableCell>
                                <TableCell>Not</TableCell>
                                <TableCell align="right">Tutar</TableCell>
                                <TableCell width={60} align="center">İşlem</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lines.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8, borderBottom: 'none' }}>
                                        <Box sx={{
                                            maxWidth: 320, mx: 'auto', p: 4,
                                            border: '1px dashed', borderColor: 'divider',
                                            borderRadius: 4, bgcolor: alpha(theme.palette.background.default, 0.5)
                                        }}>
                                            <PlaylistAddIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.5, mb: 1.5 }} />
                                            <Typography variant="subtitle1" fontWeight={800} color="text.secondary">
                                                Kayıtlı evrak bulunamadı
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled" display="block" mt={0.5} lineHeight={1.5}>
                                                Yukarıdaki formu doldurup "Listeye Ekle" butonu ile evrak oluşturabilirsiniz.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                lines.map((line, idx) => {
                                    const isCheck = line.type === CheckBillType.CHECK;
                                    return (
                                        <TableRow key={idx} hover sx={{
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                                            '& td': { py: 1.5, borderBottom: '1px dashed var(--border)' },
                                        }}>
                                            <TableCell>
                                                <Typography variant="caption" fontWeight={800} color="text.disabled">{idx + 1}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip size="small" variant="outlined"
                                                    label={isCheck ? 'Çek' : 'Senet'}
                                                    icon={isCheck ? <CreditCardIcon sx={{ fontSize: 14 }} /> : <LocalAtmIcon sx={{ fontSize: 14 }} />}
                                                    color={isCheck ? 'primary' : 'secondary'}
                                                    sx={{ fontWeight: 800, borderRadius: 1.5, fontSize: 11, borderWidth: 1.5 }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={800} sx={{ fontFamily: 'monospace', letterSpacing: 0.5 }}>
                                                    {line.checkNo || '—'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                        Tanzim:
                                                    </Typography>
                                                    <Typography variant="caption" fontWeight={800}>
                                                        {formatDate(line.issueDate)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                        Vade:
                                                    </Typography>
                                                    <Typography variant="caption" fontWeight={800}>
                                                        {formatDate(line.dueDate)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {!line.bank ? <Typography variant="body2" color="text.disabled">—</Typography> : (
                                                    <>
                                                        <Typography variant="body2" fontWeight={700}>{line.bank}</Typography>
                                                        {line.branch && <Typography variant="caption" color="text.secondary">{line.branch} Şubesi</Typography>}
                                                    </>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {(!line.serialNo && !line.accountNo) ? <Typography variant="body2" color="text.disabled">—</Typography> : (
                                                    <Stack spacing={0.25}>
                                                        {line.serialNo && <Typography variant="caption" fontWeight={600} color="text.secondary">Seri: <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{line.serialNo}</span></Typography>}
                                                        {line.accountNo && <Typography variant="caption" fontWeight={600} color="text.secondary">Hesap: <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{line.accountNo}</span></Typography>}
                                                    </Stack>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 180 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{
                                                    overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3
                                                }}>
                                                    {line.notes || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body1" fontWeight={900} color="primary.main">
                                                    {formatAmount(Number(line.amount) || 0)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Satırı Sil" placement="top">
                                                    <IconButton size="small" color="error" onClick={() => removeLine(idx)}
                                                        sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) } }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Stack>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADIM 3: Onay ve Kayıt
// ─────────────────────────────────────────────────────────────────────────────
function Step3({ lines, total }: { lines: Line[]; total: number }) {
    const theme = useTheme();
    const checkCount = lines.filter(l => l.type === CheckBillType.CHECK).length;
    const noteCount = lines.filter(l => l.type !== CheckBillType.CHECK).length;
    return (
        <Stack spacing={3}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
                <strong>{lines.length} evrak</strong> kayıt için hazır. Bilgileri kontrol edin ve <strong>Tümünü Kaydet</strong>'e tıklayın.
            </Alert>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: 'var(--border)', bgcolor: 'var(--card)' }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">TOPLAM EVRAK</Typography>
                        <Typography variant="h4" fontWeight={900} color="primary.main">{lines.length}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">TOPLAM TUTAR</Typography>
                        <Typography variant="h4" fontWeight={900} color="success.main">{formatAmount(total)}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">ÇEK</Typography>
                        <Typography variant="h5" fontWeight={800}>{checkCount}</Typography>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} display="block">SENET</Typography>
                        <Typography variant="h5" fontWeight={800}>{noteCount}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2.5 }} />
                <Typography variant="body2" color="text.secondary">
                    Kayıt sonrası evraklar <strong>Portföy</strong>'de görünür. Toplu portföy girişi için <strong>Bordro Sihirbazı</strong>'nı kullanabilirsiniz.
                </Typography>
            </Paper>
        </Stack>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANA BİLEŞEN
// ─────────────────────────────────────────────────────────────────────────────
export default function CheckWizardClient() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const createOne = useCreateCheckBill();

    const storedState = loadStoredState();
    const [activeStep, setActiveStep] = useState(storedState?.activeStep ?? 0);
    const [accountId, setAccountId] = useState<string | null>(storedState?.accountId ?? null);
    const [portfolioType, setPortfolioType] = useState<PortfolioType>(storedState?.portfolioType ?? PortfolioType.CREDIT);
    const [lines, setLines] = useState<Line[]>(storedState?.lines ?? []);

    useEffect(() => {
        saveStoredState({ activeStep, accountId, portfolioType, lines });
    }, [activeStep, accountId, portfolioType, lines]);

    const total = lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);

    const next = () => {
        if (activeStep === 0 && !accountId) {
            enqueueSnackbar('Cari hesap seçin.', { variant: 'warning' }); return;
        }
        if (activeStep === 1) {
            if (lines.length === 0) { enqueueSnackbar('En az bir evrak ekleyin.', { variant: 'warning' }); return; }
            const bad = lines.find(l => !l.checkNo || !l.dueDate || !l.amount || Number(l.amount) <= 0);
            if (bad) { enqueueSnackbar('Her satırda no, vade ve tutar zorunludur.', { variant: 'warning' }); return; }
        }
        setActiveStep(s => s + 1);
    };

    const back = () => setActiveStep(s => Math.max(0, s - 1));

    const saveAll = async () => {
        if (!accountId) return;
        try {
            for (const line of lines) {
                await createOne.mutateAsync({
                    accountId, portfolioType,
                    type: line.type,
                    checkNo: line.checkNo,
                    issueDate: new Date(line.issueDate).toISOString(),
                    dueDate: new Date(line.dueDate).toISOString(),
                    amount: Number(line.amount),
                    serialNo: line.serialNo || undefined,
                    bank: line.bank || undefined,
                    branch: line.branch || undefined,
                    accountNo: line.accountNo || undefined,
                    debtor: line.debtor || undefined,
                    notes: line.notes || undefined,
                });
            }
            clearStoredState();
            enqueueSnackbar(`${lines.length} evrak oluşturuldu.`, { variant: 'success' });
            router.push('/checks');
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message ?? 'Kayıt başarısız.', { variant: 'error' });
        }
    };

    return (
        <Box sx={{ pb: 4, maxWidth: 1200, mx: 'auto' }}>
            {/* ══ Stepper ══════════════════════════════════════════════════ */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {STEPS.map((label, i) => (
                    <Step key={label} completed={activeStep > i}>
                        <StepLabel
                            StepIconProps={{ sx: { '&.Mui-active': { color: 'primary.main' } } }}
                            sx={{ '& .MuiStepLabel-label': { fontWeight: activeStep === i ? 800 : 600 } }}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* ══ Adım İçerikleri ══════════════════════════════════════════ */}
            {activeStep === 0 && (
                <Step1
                    accountId={accountId} setAccountId={setAccountId}
                    portfolioType={portfolioType} setPortfolioType={setPortfolioType}
                />
            )}
            {activeStep === 1 && (
                <Step2 lines={lines} setLines={setLines} />
            )}
            {activeStep === 2 && (
                <Step3 lines={lines} total={total} />
            )}

            {/* ══ Navigasyon Butonları ═══════════════════════════════════ */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => {
                        if (activeStep === 0) { clearStoredState(); router.push('/checks'); }
                        else back();
                    }}
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                >
                    {activeStep === 0 ? 'İptal' : 'Geri'}
                </Button>
                <Stack direction="row" spacing={1}>
                    {activeStep < STEPS.length - 1 && (
                        <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={next}
                            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', px: 3 }}>
                            İleri
                        </Button>
                    )}
                    {activeStep === STEPS.length - 1 && (
                        <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}
                            onClick={saveAll} disabled={createOne.isPending}
                            sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none', px: 4, minWidth: 180 }}>
                            {createOne.isPending ? <CircularProgress size={22} color="inherit" /> : `Tümünü Kaydet (${lines.length})`}
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
}
