'use client';

import { useEffect, useMemo, useState } from 'react';
import { AccountBalance, BusinessCenter, CreditCard, Payment } from '@mui/icons-material';
import axios from '@/lib/axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  BadgeCheck,
  CircleOff,
  Landmark,
  Percent,
  Terminal,
} from 'lucide-react';

interface CreateAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bankaId: string;
  bankaAdi: string;
  mode?: 'CREATE' | 'EDIT';
  initialData?: any;
}

type BankAccountType = 'DEMAND_DEPOSIT' | 'POS' | 'LOAN' | 'COMPANY_CREDIT_CARD';

interface AccountFormState {
  code: string;
  name: string;
  type: BankAccountType;
  accountNo: string;
  iban: string;
  isActive: boolean;
  commissionRate: string;
  terminalNo: string;
  creditLimit: string;
  cardLimit: string;
  statementDay: string;
  paymentDueDay: string;
}

export const accountTypes = [
  { value: 'DEMAND_DEPOSIT', label: 'Vadesiz Hesap', icon: AccountBalance, color: 'primary' },
  { value: 'POS', label: 'POS Hesabı', icon: CreditCard, color: 'success' },
  { value: 'LOAN', label: 'Ticari Kredi', icon: BusinessCenter, color: 'warning' },
  { value: 'COMPANY_CREDIT_CARD', label: 'Firma Kredi Kartı', icon: Payment, color: 'error' },
] as const;

const EMPTY_FORM: AccountFormState = {
  code: '',
  name: '',
  type: 'DEMAND_DEPOSIT',
  accountNo: '',
  iban: '',
  isActive: true,
  commissionRate: '',
  terminalNo: '',
  creditLimit: '',
  cardLimit: '',
  statementDay: '',
  paymentDueDay: '',
};

const LEGACY_TYPE_MAP: Record<string, BankAccountType> = {
  VADESIZ: 'DEMAND_DEPOSIT',
  KREDI: 'LOAN',
  FIRMA_KREDI_KARTI: 'COMPANY_CREDIT_CARD',
  DEMAND_DEPOSIT: 'DEMAND_DEPOSIT',
  POS: 'POS',
  LOAN: 'LOAN',
  COMPANY_CREDIT_CARD: 'COMPANY_CREDIT_CARD',
};

function normalizeType(value?: string): BankAccountType {
  return LEGACY_TYPE_MAP[value || ''] ?? 'DEMAND_DEPOSIT';
}

function toNumberOrUndefined(value: string) {
  if (value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getInitialForm(initialData?: any): AccountFormState {
  if (!initialData) return EMPTY_FORM;

  return {
    code: initialData.code || initialData.hesapKodu || '',
    name: initialData.name || initialData.hesapAdi || '',
    type: normalizeType(initialData.type || initialData.hesapTipi),
    accountNo: initialData.accountNo || initialData.hesapNo || '',
    iban: initialData.iban || '',
    isActive: initialData.isActive ?? initialData.aktif ?? true,
    commissionRate: initialData.commissionRate !== undefined ? String(initialData.commissionRate) : '',
    terminalNo: initialData.terminalNo || '',
    creditLimit: initialData.creditLimit !== undefined ? String(initialData.creditLimit) : '',
    cardLimit: initialData.cardLimit !== undefined ? String(initialData.cardLimit) : '',
    statementDay: (initialData.statementDay || initialData.billingDay || initialData.hesapKesimGunu) ? String(initialData.statementDay || initialData.billingDay || initialData.hesapKesimGunu) : '',
    paymentDueDay: (initialData.paymentDueDay || initialData.dueDay || initialData.sonOdemeGunu) ? String(initialData.paymentDueDay || initialData.dueDay || initialData.sonOdemeGunu) : '',
  };
}

function inputBaseClass(hasError = false) {
  return cn(hasError && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20');
}

export default function CreateAccountDialog({
  open,
  onClose,
  onSuccess,
  bankaId,
  bankaAdi,
  mode = 'CREATE',
  initialData,
}: CreateAccountDialogProps) {
  const [form, setForm] = useState<AccountFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(getInitialForm(initialData));
    setError('');
    setSuccessMessage('');
  }, [initialData, open]);

  const selectedType = useMemo(() => {
    return accountTypes.find((type) => type.value === form.type) ?? accountTypes[0];
  }, [form.type]);

  const requiresCardFields = form.type === 'COMPANY_CREDIT_CARD';
  const requiresPosFields = form.type === 'POS';
  const supportsIban = form.type === 'DEMAND_DEPOSIT' || form.type === 'POS' || form.type === 'LOAN';

  const setField = <K extends keyof AccountFormState>(field: K, value: AccountFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const validate = () => {
    if (!bankaId) return 'Banka seçimi bulunamadı';
    if (!form.name.trim()) return 'Hesap adı zorunludur';
    if (requiresCardFields && !form.cardLimit) return 'Firma kredi kartı için kart limiti zorunludur';
    if (requiresCardFields && !form.statementDay) return 'Firma kredi kartı için hesap kesim günü zorunludur';
    if (requiresCardFields && !form.paymentDueDay) return 'Firma kredi kartı için son ödeme günü zorunludur';

    const statementDay = toNumberOrUndefined(form.statementDay);
    const paymentDueDay = toNumberOrUndefined(form.paymentDueDay);
    if (statementDay !== undefined && (statementDay < 1 || statementDay > 31)) return 'Hesap kesim günü 1-31 arasında olmalıdır';
    if (paymentDueDay !== undefined && (paymentDueDay < 1 || paymentDueDay > 31)) return 'Son ödeme günü 1-31 arasında olmalıdır';

    return '';
  };

  const buildPayload = () => {
    const payload: Record<string, any> = {
      name: form.name.trim(),
      accountNo: form.accountNo.trim() || undefined,
      iban: form.iban.trim().toUpperCase() || undefined,
      isActive: form.isActive,
    };

    if (mode === 'CREATE') {
      payload.type = form.type;
      payload.code = form.code.trim() || undefined;
    }

    if (requiresPosFields) {
      payload.commissionRate = toNumberOrUndefined(form.commissionRate);
      payload.terminalNo = form.terminalNo.trim() || undefined;
    }

    if (form.type === 'LOAN') {
      payload.creditLimit = toNumberOrUndefined(form.creditLimit);
    }

    if (requiresCardFields) {
      payload.cardLimit = toNumberOrUndefined(form.cardLimit);
      payload.statementDay = toNumberOrUndefined(form.statementDay);
      payload.paymentDueDay = toNumberOrUndefined(form.paymentDueDay);
    }

    return payload;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setLoading(true);
      if (mode === 'EDIT' && initialData?.id) {
        await axios.put(`/banks/accounts/${initialData.id}`, buildPayload());
        setSuccessMessage('Hesap güncellendi');
      } else {
        await axios.post(`/banks/${bankaId}/accounts`, buildPayload());
        setSuccessMessage('Hesap oluşturuldu');
      }
      onSuccess();
      window.setTimeout(() => {
        onClose();
      }, 250);
    } catch (submitError: any) {
      setError(submitError.response?.data?.message || 'Hesap kaydı tamamlanamadı');
    } finally {
      setLoading(false);
    }
  };

  const ActiveIcon = selectedType.icon;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen && !loading) onClose(); }}>
      <DialogContent panelClassName="max-w-[760px]">
        <DialogHeader className="border-b px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <ActiveIcon fontSize="small" />
            </div>
            <div className="min-w-0">
              <DialogTitle>{mode === 'EDIT' ? 'Banka Hesabı Düzenle' : 'Banka Hesabı Ekle'}</DialogTitle>
              <DialogDescription className="mt-1">
                {bankaAdi ? `${bankaAdi} için backend uyumlu hesap tanımı.` : 'Banka için hesap tanımı.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[68vh] overflow-y-auto px-5 py-4">
            <div className="space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <CircleOff className="size-4" />
                  <AlertTitle>İşlem tamamlanamadı</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {successMessage ? (
                <Alert>
                  <BadgeCheck className="size-4" />
                  <AlertTitle>Başarılı</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-3 rounded-lg border bg-muted/40 p-3 sm:grid-cols-4">
                {accountTypes.map((type) => {
                  const Icon = type.icon;
                  const active = form.type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      disabled={mode === 'EDIT'}
                      onClick={() => setField('type', type.value)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70',
                        active && 'border-primary bg-primary/10 text-primary',
                      )}
                    >
                      <Icon fontSize="small" />
                      <span className="truncate font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-3 sm:grid-cols-[160px_minmax(0,1fr)]">
                <div className="grid gap-2">
                  <Label htmlFor="account-code">Hesap Kodu</Label>
                  <Input
                    id="account-code"
                    value={form.code}
                    onChange={(event) => setField('code', event.target.value)}
                    placeholder="Otomatik"
                    disabled={mode === 'EDIT'}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account-name">Hesap Adı</Label>
                  <Input
                    id="account-name"
                    value={form.name}
                    onChange={(event) => setField('name', event.target.value)}
                    placeholder="Örn. Ana vadesiz hesap"
                    className={inputBaseClass(!!error && !form.name.trim())}
                    autoFocus
                  />
                </div>
              </div>

              {supportsIban ? (
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="grid gap-2">
                    <Label htmlFor="account-iban">IBAN</Label>
                    <Input
                      id="account-iban"
                      value={form.iban}
                      onChange={(event) => setField('iban', event.target.value.toUpperCase())}
                      placeholder="TR..."
                      className="font-mono"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="account-no">Hesap No</Label>
                    <Input
                      id="account-no"
                      value={form.accountNo}
                      onChange={(event) => setField('accountNo', event.target.value)}
                      placeholder="Hesap no"
                    />
                  </div>
                </div>
              ) : null}

              {requiresPosFields ? (
                <>
                  <Separator />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="commission-rate">Komisyon Oranı</Label>
                      <div className="relative">
                        <Percent className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="commission-rate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={form.commissionRate}
                          onChange={(event) => setField('commissionRate', event.target.value)}
                          placeholder="0,00"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="terminal-no">Terminal No</Label>
                      <div className="relative">
                        <Terminal className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="terminal-no"
                          value={form.terminalNo}
                          onChange={(event) => setField('terminalNo', event.target.value)}
                          placeholder="POS terminal numarası"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {form.type === 'LOAN' ? (
                <>
                  <Separator />
                  <div className="grid gap-2 sm:max-w-xs">
                    <Label htmlFor="credit-limit">Kredi Limiti</Label>
                    <Input
                      id="credit-limit"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.creditLimit}
                      onChange={(event) => setField('creditLimit', event.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                </>
              ) : null}

              {requiresCardFields ? (
                <>
                  <Separator />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="card-limit">Kart Limiti</Label>
                      <Input
                        id="card-limit"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.cardLimit}
                        onChange={(event) => setField('cardLimit', event.target.value)}
                        placeholder="0,00"
                        className={inputBaseClass(!!error && requiresCardFields && !form.cardLimit)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="statement-day">Hesap Kesim Günü</Label>
                      <Input
                        id="statement-day"
                        type="number"
                        min="1"
                        max="31"
                        value={form.statementDay}
                        onChange={(event) => setField('statementDay', event.target.value)}
                        placeholder="1-31"
                        className={inputBaseClass(!!error && requiresCardFields && !form.statementDay)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="payment-due-day">Son Ödeme Günü</Label>
                      <Input
                        id="payment-due-day"
                        type="number"
                        min="1"
                        max="31"
                        value={form.paymentDueDay}
                        onChange={(event) => setField('paymentDueDay', event.target.value)}
                        placeholder="1-31"
                        className={inputBaseClass(!!error && requiresCardFields && !form.paymentDueDay)}
                      />
                    </div>
                  </div>
                </>
              ) : null}

              <label className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                <span>
                  <span className="block font-medium">Aktif hesap</span>
                  <span className="text-xs text-muted-foreground">Pasif hesaplar korunur fakat seçim listelerinde ayrıştırılır.</span>
                </span>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setField('isActive', event.target.checked)}
                  className="size-4 accent-primary"
                />
              </label>

              <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-3 text-xs text-muted-foreground">
                <Landmark className="size-4" />
                <span>Gönderilecek hesap tipi:</span>
                <Badge variant="outline" className="rounded-md">{form.type}</Badge>
                {mode === 'EDIT' ? <span>Tip ve kod güncellemede gönderilmez.</span> : null}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>İptal</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Kaydediliyor' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
