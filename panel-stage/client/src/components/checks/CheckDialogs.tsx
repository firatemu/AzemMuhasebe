'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    DialogContentText, Button, TextField, Typography, Alert,
    CircularProgress, Box, MenuItem, Divider, Stack, Chip,
    ToggleButtonGroup, ToggleButton, Autocomplete,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { CheckBill, CheckBillStatus } from '@/types/check-bill';
import { formatDate, formatAmount } from '@/lib/format';
import { STATUS_LABEL } from '@/lib/labels';
import { TURKISH_BANKS } from '@/constants/bankalar';
import { useBankAccounts, useCashboxes, useAccounts } from '@/hooks/use-selects';
import type { CheckPaymentMethod } from '@/hooks/use-collection-action';

// ─────────────────────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckStatusActionPayload {
    date: string;
    notes?: string;
    transactionAmount?: number;
    paymentMethod?: CheckPaymentMethod;
    cashboxId?: string;
    bankAccountId?: string;
    toAccountId?: string;
}

interface BaseProps {
    open: boolean;
    check: CheckBill | null;
    targetStatus: CheckBillStatus | null;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: (payload: CheckStatusActionPayload) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Silme Onay Dialogu
// ─────────────────────────────────────────────────────────────────────────────

export function DeleteConfirmDialog({
    open, title, description, loading, onCancel, onConfirm,
}: {
    open: boolean; title?: string; description?: string;
    loading?: boolean; onCancel: () => void; onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningAmberIcon color="error" />
                {title ?? 'Silme Onayı'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {description ?? 'Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} disabled={loading}>Vazgeç</Button>
                <Button
                    variant="contained" color="error"
                    startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
                    onClick={onConfirm} disabled={loading}
                >
                    {loading ? 'Siliniyor...' : 'Sil'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Evrak Düzenleme Dialogu
// ─────────────────────────────────────────────────────────────────────────────

export function CheckEditDialog({
    open, check, loading, onCancel, onConfirm,
}: {
    open: boolean; check: CheckBill | null; loading?: boolean;
    onCancel: () => void;
    onConfirm: (data: { checkNo?: string; bank?: string; branch?: string; accountNo?: string; dueDate?: string; notes?: string; amount?: number }) => void;
}) {
    const [form, setForm] = useState({ checkNo: '', bank: '', branch: '', accountNo: '', notes: '', dueDate: '', amount: '' });

    useEffect(() => {
        if (check) {
            setForm({
                checkNo: check.checkNo ?? '',
                bank: check.bank ?? '',
                branch: check.branch ?? '',
                accountNo: check.accountNo ?? '',
                notes: check.notes ?? '',
                dueDate: check.dueDate ? new Date(check.dueDate).toISOString().split('T')[0] : '',
                amount: check.amount !== undefined ? String(check.amount) : '',
            });
        }
    }, [check]);

    if (!check) return null;

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
            <DialogTitle>Evrak Düzenle</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} pt={1}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField fullWidth label="Çek / Senet No" value={form.checkNo}
                                onChange={(e) => setForm((f) => ({ ...f, checkNo: e.target.value }))} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField fullWidth type="date" label="Vade Tarihi" value={form.dueDate}
                                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                                InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth type="number" label="Tutar" value={form.amount}
                                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Autocomplete freeSolo options={TURKISH_BANKS} value={form.bank}
                                onChange={(_, v) => setForm((f) => ({ ...f, bank: v || '' }))}
                                onInputChange={(_, v) => setForm((f) => ({ ...f, bank: v }))}
                                renderInput={(params) => <TextField {...params} label="Banka" fullWidth />} />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField fullWidth label="Şube" value={form.branch}
                                onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth label="Hesap No" value={form.accountNo}
                                onChange={(e) => setForm((f) => ({ ...f, accountNo: e.target.value }))} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField fullWidth multiline rows={2} label="Notlar" value={form.notes}
                                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} disabled={loading}>Vazgeç</Button>
                <Button variant="contained" onClick={() => onConfirm({
                    checkNo: form.checkNo || undefined, bank: form.bank || undefined,
                    branch: form.branch || undefined, accountNo: form.accountNo || undefined,
                    notes: form.notes || undefined, dueDate: form.dueDate || undefined,
                    amount: form.amount ? Number(form.amount) : undefined,
                })} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : undefined}>
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dialog yardımcı bileşenler
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ check, targetStatus }: { check: CheckBill; targetStatus: CheckBillStatus }) {
    return (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            <strong>{check.checkNo || '—'}</strong> numaralı evrak:{' '}
            <Chip size="small" label={STATUS_LABEL[check.status]} sx={{ mx: 0.5, fontWeight: 700 }} />
            <SwapHorizIcon sx={{ fontSize: 14, verticalAlign: 'middle', mx: 0.5 }} />
            <Chip size="small" label={STATUS_LABEL[targetStatus]} color="primary" sx={{ mx: 0.5, fontWeight: 700 }} />
        </Alert>
    );
}

function DateNoteFields({
    date, setDate, notes, setNotes,
}: { date: string; setDate: (v: string) => void; notes: string; setNotes: (v: string) => void }) {
    return (
        <>
            <TextField fullWidth type="date" label="İşlem Tarihi" value={date}
                onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }}
                size="small" />
            <TextField fullWidth multiline rows={2} label="Not (opsiyonel)" value={notes}
                onChange={(e) => setNotes(e.target.value)} placeholder="Açıklama ekleyebilirsiniz..." size="small" />
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ödeme Yöntemi Seçici (Kasa / Banka / Elden)
// ─────────────────────────────────────────────────────────────────────────────

function PaymentMethodPicker({
    method, setMethod, cashboxId, setCashboxId, bankAccountId, setBankAccountId, isCollection,
}: {
    method: CheckPaymentMethod;
    setMethod: (m: CheckPaymentMethod) => void;
    cashboxId: string | null;
    setCashboxId: (v: string | null) => void;
    bankAccountId: string | null;
    setBankAccountId: (v: string | null) => void;
    isCollection: boolean;
}) {
    const { data: cashboxes = [] } = useCashboxes();
    const { data: bankAccounts = [] } = useBankAccounts();

    return (
        <Box>
            <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={1}>
                ÖDEME YÖNTEMİ
            </Typography>
            <ToggleButtonGroup
                value={method}
                exclusive
                onChange={(_, v) => { if (v) setMethod(v); }}
                size="small"
                fullWidth
                sx={{ mb: 2 }}
            >
                <ToggleButton value="KASA" sx={{ gap: 0.5, fontWeight: 700, textTransform: 'none' }}>
                    <LocalAtmIcon fontSize="small" />
                    Nakit Kasa
                </ToggleButton>
                <ToggleButton value="BANKA" sx={{ gap: 0.5, fontWeight: 700, textTransform: 'none' }}>
                    <AccountBalanceIcon fontSize="small" />
                    Banka
                </ToggleButton>
                <ToggleButton value="ELDEN" sx={{ gap: 0.5, fontWeight: 700, textTransform: 'none' }}>
                    <HandshakeIcon fontSize="small" />
                    Elden
                </ToggleButton>
            </ToggleButtonGroup>

            {method === 'KASA' && (
                <TextField select fullWidth size="small"
                    label="Kasa Seçin"
                    value={cashboxId ?? ''}
                    onChange={(e) => setCashboxId(e.target.value || null)}
                    required
                >
                    <MenuItem value="">— Seçin —</MenuItem>
                    {cashboxes.map((c: any) => (
                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                </TextField>
            )}

            {method === 'BANKA' && (
                <TextField select fullWidth size="small"
                    label="Banka Hesabı Seçin"
                    value={bankAccountId ?? ''}
                    onChange={(e) => setBankAccountId(e.target.value || null)}
                    required
                >
                    <MenuItem value="">— Seçin —</MenuItem>
                    {bankAccounts.map((b: any) => (
                        <MenuItem key={b.id} value={b.id}>{b.bankName} — {b.name}</MenuItem>
                    ))}
                </TextField>
            )}

            {method === 'ELDEN' && (
                <Alert severity="info" icon={<HandshakeIcon />} sx={{ borderRadius: 2, py: 0.5 }}>
                    Elden {isCollection ? 'tahsilat' : 'ödeme'} seçildi — kasa ve banka bakiyesi etkilenmez.
                </Alert>
            )}
        </Box>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Durum Aksiyon Dialogu (ana bileşen — aksiyon tipine göre fork)
// ─────────────────────────────────────────────────────────────────────────────

/** Basit aksiyon grupları */
const SIMPLE_STATUSES = new Set([
    CheckBillStatus.RETURNED,
    CheckBillStatus.CANCELLED,
    CheckBillStatus.WITHOUT_COVERAGE,
    CheckBillStatus.PROTESTED,
    CheckBillStatus.LEGAL_FOLLOWUP,
    CheckBillStatus.WRITTEN_OFF,
    CheckBillStatus.RECOURSE,
    CheckBillStatus.IN_PORTFOLIO,
]);

const PAYMENT_STATUSES = new Set([
    CheckBillStatus.COLLECTED,
    CheckBillStatus.PARTIAL_PAID,
    CheckBillStatus.PAID,
]);

export function CheckStatusActionDialog(props: BaseProps & { showCashBank?: boolean }) {
    const { open, check, targetStatus, loading, onCancel, onConfirm } = props;

    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<CheckPaymentMethod>('BANKA');
    const [cashboxId, setCashboxId] = useState<string | null>(null);
    const [bankAccountId, setBankAccountId] = useState<string | null>(null);
    const [toAccountId, setToAccountId] = useState<string | null>(null);

    const { data: accounts = [] } = useAccounts();
    const { data: bankAccounts = [] } = useBankAccounts();

    useEffect(() => {
        if (open && check) {
            setDate(new Date().toISOString().split('T')[0]);
            setAmount(String(check.remainingAmount ?? check.amount ?? ''));
            setNotes('');
            setMethod('BANKA');
            setCashboxId(null);
            setBankAccountId(null);
            setToAccountId(null);
        }
    }, [open, check, targetStatus]);

    if (!check || !targetStatus) return null;

    const handleConfirm = () => {
        const base: CheckStatusActionPayload = { date, notes: notes || undefined };

        if (targetStatus === CheckBillStatus.IN_BANK_COLLECTION || targetStatus === CheckBillStatus.IN_BANK_GUARANTEE) {
            if (!bankAccountId) return;
            onConfirm({ ...base, bankAccountId });
        } else if (PAYMENT_STATUSES.has(targetStatus)) {
            const amt = Number(amount);
            if (!amt || amt <= 0) return;
            if (method === 'KASA' && !cashboxId) return;
            if (method === 'BANKA' && !bankAccountId) return;
            onConfirm({
                ...base,
                transactionAmount: amt,
                paymentMethod: method,
                cashboxId: method === 'KASA' ? (cashboxId ?? undefined) : undefined,
                bankAccountId: method === 'BANKA' ? (bankAccountId ?? undefined) : undefined,
            });
        } else if (targetStatus === CheckBillStatus.ENDORSED) {
            if (!toAccountId) return;
            onConfirm({ ...base, toAccountId });
        } else {
            onConfirm(base);
        }
    };

    const isDebit = check.portfolioType === 'DEBIT';
    const isCollection = !isDebit;

    // ── Başlık & Renk ──
    const titleMap: Partial<Record<CheckBillStatus, string>> = {
        [CheckBillStatus.IN_BANK_COLLECTION]: 'Bankaya Tahsilata Ver',
        [CheckBillStatus.IN_BANK_GUARANTEE]: 'Bankaya Teminata Ver',
        [CheckBillStatus.ENDORSED]: 'Ciro Et',
        [CheckBillStatus.COLLECTED]: 'Tahsilat Yap',
        [CheckBillStatus.PARTIAL_PAID]: 'Kısmi Tahsilat',
        [CheckBillStatus.PAID]: 'Ödeme Yap',
        [CheckBillStatus.RETURNED]: 'İade Et',
        [CheckBillStatus.CANCELLED]: 'İptal Et',
        [CheckBillStatus.WITHOUT_COVERAGE]: 'Karşılıksız İşle',
        [CheckBillStatus.PROTESTED]: 'Protesto Et',
        [CheckBillStatus.LEGAL_FOLLOWUP]: 'Hukuki Takibe Al',
        [CheckBillStatus.IN_PORTFOLIO]: 'Portföye Al',
    };
    const title = titleMap[targetStatus] ?? STATUS_LABEL[targetStatus];

    // ── Form İçeriği ──
    const isPayment = PAYMENT_STATUSES.has(targetStatus);
    const isSimple = SIMPLE_STATUSES.has(targetStatus);
    const isEndorse = targetStatus === CheckBillStatus.ENDORSED;
    const isBankOnly = targetStatus === CheckBillStatus.IN_BANK_COLLECTION || targetStatus === CheckBillStatus.IN_BANK_GUARANTEE;

    let canSubmit = false;
    if (isSimple) canSubmit = true;
    else if (isBankOnly) {
        canSubmit = !!bankAccountId;
    } else if (isPayment) {
        const amt = Number(amount);
        const amtOk = amt > 0 && amt <= Number(check.remainingAmount);
        const methodOk = method === 'ELDEN' || (method === 'KASA' && !!cashboxId) || (method === 'BANKA' && !!bankAccountId);
        canSubmit = amtOk && methodOk;
    } else if (isEndorse) {
        canSubmit = !!toAccountId;
    }

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth
            PaperProps={{ sx: { bgcolor: 'var(--card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' } }}>
            <DialogTitle sx={{ pb: 1, fontWeight: 800 }}>
                <Stack direction="row" alignItems="center" gap={1}>
                    {isPayment && <CheckCircleOutlineIcon color="success" />}
                    {isEndorse && <SwapHorizIcon color="primary" />}
                    {isBankOnly && <AccountBalanceIcon color="info" />}
                    {title}
                </Stack>
            </DialogTitle>
            <DialogContent>
                <StatusBadge check={check} targetStatus={targetStatus} />

                {/* Evrak tutarı özeti */}
                <Stack direction="row" spacing={2} sx={{ mb: 2, px: 1 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Nominal</Typography>
                        <Typography variant="body2" fontWeight={800}>{formatAmount(Number(check.amount))}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Kalan</Typography>
                        <Typography variant="body2" fontWeight={800} color="warning.main">{formatAmount(Number(check.remainingAmount))}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Vade</Typography>
                        <Typography variant="body2" fontWeight={700}>{formatDate(check.dueDate)}</Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                    {/* ── Sadece Tarih+Not (İade/İptal/vs.) ── */}
                    {isSimple && (
                        <>
                            {targetStatus === CheckBillStatus.RETURNED && (
                                <Alert severity="warning" sx={{ borderRadius: 2, py: 0.5 }}>
                                    İade işleminde bakiye hareketi oluşturulmaz.
                                </Alert>
                            )}
                            {targetStatus === CheckBillStatus.CANCELLED && (
                                <Alert severity="error" sx={{ borderRadius: 2, py: 0.5 }}>
                                    İptal işlemi geri alınamaz.
                                </Alert>
                            )}
                            <DateNoteFields date={date} setDate={setDate} notes={notes} setNotes={setNotes} />
                        </>
                    )}

                    {/* ── Bankaya Ver (IN_BANK_*) ── */}
                    {isBankOnly && (
                        <>
                            <TextField select fullWidth size="small"
                                label="Banka Hesabı"
                                value={bankAccountId ?? ''}
                                onChange={(e) => setBankAccountId(e.target.value || null)}
                                required
                            >
                                <MenuItem value="">— Seçin —</MenuItem>
                                {(bankAccounts as any[]).map((b) => (
                                    <MenuItem key={b.id} value={b.id}>
                                        {b.bankName} — {b.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <DateNoteFields date={date} setDate={setDate} notes={notes} setNotes={setNotes} />
                        </>
                    )}

                    {/* ── Ciro Et ── */}
                    {isEndorse && (
                        <>
                            <TextField select fullWidth size="small"
                                label="Devredilecek Cari Hesap"
                                value={toAccountId ?? ''}
                                onChange={(e) => setToAccountId(e.target.value || null)}
                                required
                            >
                                <MenuItem value="">— Seçin —</MenuItem>
                                {(accounts as any[]).map((a) => (
                                    <MenuItem key={a.id} value={a.id}>
                                        {a.title}{a.code ? ` (${a.code})` : ''}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <DateNoteFields date={date} setDate={setDate} notes={notes} setNotes={setNotes} />
                        </>
                    )}

                    {/* ── Tahsilat / Ödeme ── */}
                    {isPayment && (
                        <>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 7 }}>
                                    <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={0.5}>
                                        {isCollection ? 'TAHSİLAT TUTARI' : 'ÖDEME TUTARI'}
                                    </Typography>
                                    <TextField fullWidth type="number" size="small"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        inputProps={{ step: '0.01', min: 0.01, max: Number(check.remainingAmount) }}
                                        error={!!amount && Number(amount) > Number(check.remainingAmount)}
                                        helperText={!!amount && Number(amount) > Number(check.remainingAmount)
                                            ? `Maks: ${formatAmount(Number(check.remainingAmount))}` : undefined}
                                        required
                                    />
                                    <Stack direction="row" spacing={0.5} mt={0.5}>
                                        <Button size="small" variant="text" sx={{ fontSize: 11, textTransform: 'none', minWidth: 0 }}
                                            onClick={() => setAmount(String(check.remainingAmount))}>
                                            Tamamı
                                        </Button>
                                        {[50, 25].map((p) => (
                                            <Button key={p} size="small" variant="text" sx={{ fontSize: 11, textTransform: 'none', minWidth: 0 }}
                                                onClick={() => setAmount(String(Math.round(Number(check.remainingAmount) * (p / 100) * 100) / 100))}>
                                                %{p}
                                            </Button>
                                        ))}
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 5 }}>
                                    <Typography variant="caption" fontWeight={800} color="text.secondary" letterSpacing={1} display="block" mb={0.5}>
                                        TARİH
                                    </Typography>
                                    <TextField fullWidth type="date" size="small"
                                        value={date} onChange={(e) => setDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }} required />
                                </Grid>
                            </Grid>

                            <PaymentMethodPicker
                                method={method} setMethod={setMethod}
                                cashboxId={cashboxId} setCashboxId={setCashboxId}
                                bankAccountId={bankAccountId} setBankAccountId={setBankAccountId}
                                isCollection={isCollection}
                            />

                            <TextField fullWidth multiline rows={2} size="small"
                                label="Not (opsiyonel)" value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Açıklama ekleyebilirsiniz..." />
                        </>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} disabled={loading}>Vazgeç</Button>
                <Button
                    variant="contained"
                    color={targetStatus === CheckBillStatus.CANCELLED ? 'error' : targetStatus === CheckBillStatus.RETURNED ? 'warning' : 'primary'}
                    onClick={handleConfirm}
                    disabled={!canSubmit || loading}
                    startIcon={loading ? <CircularProgress size={16} /> : undefined}
                >
                    {loading ? 'İşleniyor...' : title}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
