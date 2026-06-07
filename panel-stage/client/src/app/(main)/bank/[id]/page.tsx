'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleOff,
  CreditCard,
  Eye,
  Landmark,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  WalletCards,
  X,
} from 'lucide-react';

import MainLayout from '@/components/Layout/MainLayout';
import CreateAccountDialog from '@/components/Banka/CreateAccountDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { dataGridStyles } from '@/lib/datagrid-styles';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { getBankLogo } from '@/constants/bankalar';

type BankAccountType = 'DEMAND_DEPOSIT' | 'POS' | 'LOAN' | 'COMPANY_CREDIT_CARD' | 'TIME_DEPOSIT' | 'INVESTMENT' | 'GOLD' | 'CURRENCY' | 'OTHER';

interface BankLoanPlan {
  id: string;
  installmentNo: number;
  dueDate: string;
  paid?: number;
  status: string;
  amount: number | string;
}

interface BankLoan {
  id: string;
  amount: number | string;
  totalRepayment: number | string;
  description?: string;
  status: string;
  plans?: BankLoanPlan[];
}

interface BankAccount {
  id: string;
  name?: string | null;
  code?: string | null;
  type: BankAccountType;
  accountNo?: string | null;
  iban?: string | null;
  balance: number | string;
  isActive: boolean;
  commissionRate?: number | string | null;
  creditLimit?: number | string | null;
  usedCreditLimit?: number | string | null;
  usedLimit?: number | string | null;
  cardLimit?: number | string | null;
  statementDay?: number | null;
  paymentDueDay?: number | null;
  terminalNo?: string | null;
  loans?: BankLoan[];
}

interface Bank {
  id: string;
  name: string;
  branch?: string | null;
  city?: string | null;
  contactName?: string | null;
  phone?: string | null;
  logo?: string | null;
  isActive: boolean;
  accounts: BankAccount[];
  summary?: {
    totalBalance: number;
    typeBasedTotal: Record<string, number>;
  };
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  DEMAND_DEPOSIT: 'Vadesiz Hesap',
  POS: 'POS Hesabı',
  LOAN: 'Ticari Kredi',
  COMPANY_CREDIT_CARD: 'Firma Kredi Kartı',
  TIME_DEPOSIT: 'Vadeli Hesap',
  INVESTMENT: 'Yatırım',
  GOLD: 'Altın',
  CURRENCY: 'Döviz',
  OTHER: 'Diğer',
};

function formatCurrency(value: number | string | null | undefined): string {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'B';
}

function accountDisplayName(account: BankAccount): string {
  return account.name || account.accountNo || account.code || 'İsimsiz hesap';
}

function accountDisplayAmount(account: BankAccount): number {
  if (account.type === 'LOAN' && account.loans?.length) {
    return account.loans.reduce((sum, loan) => sum + Number(loan.totalRepayment ?? 0), 0);
  }

  return Number(account.balance ?? 0);
}

function accountLimitText(account: BankAccount): string {
  if (account.type === 'POS') {
    return account.commissionRate !== undefined && account.commissionRate !== null
      ? `%${Number(account.commissionRate).toLocaleString('tr-TR')}`
      : '-';
  }

  if (account.type === 'LOAN') return formatCurrency(account.creditLimit ?? 0);
  if (account.type === 'COMPANY_CREDIT_CARD') return formatCurrency(account.cardLimit ?? 0);
  return account.accountNo || '-';
}

function typeTone(type: string): string {
  if (type === 'POS') return 'border-[var(--income)] bg-[var(--income-muted)] text-[var(--income)]';
  if (type === 'LOAN') return 'border-[var(--warning)] bg-[var(--warning-muted)] text-[var(--warning)]';
  if (type === 'COMPANY_CREDIT_CARD') return 'border-[var(--expense)] bg-[var(--expense-muted)] text-[var(--expense)]';
  return 'border-[var(--info)] bg-[var(--info-muted)] text-[var(--info)]';
}

function MetricCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase text-muted-foreground">{title}</p>
            <p className="mt-2 truncate text-2xl font-semibold tabular-nums">{value}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <MainLayout>
      <div className="space-y-5 p-4 md:p-6">
        <div className="h-24 animate-pulse rounded-lg border bg-muted" />
        <div className="grid gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
        <div className="h-[560px] animate-pulse rounded-lg border bg-muted" />
      </div>
    </MainLayout>
  );
}

export default function BankaDetayPage() {
  const router = useRouter();
  const params = useParams();
  const bankaId = params.id as string;

  const [banka, setBanka] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHesapId, setSelectedHesapId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [selectedAccountForEdit, setSelectedAccountForEdit] = useState<BankAccount | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/banks/${bankaId}`);
      const data = response.data as Bank;
      setBanka(data);
      setSelectedAccountId((current) => current ?? data.accounts?.[0]?.id ?? null);
    } catch {
      showSnackbar('Banka bilgileri yüklenemedi', 'error');
      router.push('/bank');
    } finally {
      setLoading(false);
    }
  }, [bankaId, router, showSnackbar]);

  useEffect(() => {
    if (bankaId) void loadData();
  }, [bankaId, loadData]);

  const accounts = banka?.accounts ?? [];
  const activeAccounts = accounts.filter((account) => account.isActive !== false);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0] ?? null;

  const totals = useMemo(() => {
    const byType: Record<string, number> = {};
    let total = 0;

    accounts.forEach((account) => {
      const amount = accountDisplayAmount(account);
      total += amount;
      byType[account.type] = (byType[account.type] ?? 0) + amount;
    });

    return { total, byType };
  }, [accounts]);

  const typeCounts = useMemo(() => {
    return accounts.reduce<Record<string, number>>((acc, account) => {
      acc[account.type] = (acc[account.type] ?? 0) + 1;
      return acc;
    }, {});
  }, [accounts]);

  const handleDeleteAccount = async () => {
    if (!selectedHesapId) return;

    try {
      setActionLoading(true);
      await axios.delete(`/banks/accounts/${selectedHesapId}`);
      showSnackbar('Hesap silindi');
      setDeleteDialogOpen(false);
      setSelectedHesapId(null);
      setSelectedAccountId(null);
      await loadData();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Silme işlemi başarısız', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openCreateDialog = () => {
    setDialogMode('CREATE');
    setSelectedAccountForEdit(null);
    setDialogOpen(true);
  };

  const openEditDialog = (account: BankAccount) => {
    setSelectedAccountForEdit(account);
    setDialogMode('EDIT');
    setDialogOpen(true);
  };

  const columns = useMemo<GridColDef<BankAccount>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Hesap',
        minWidth: 240,
        flex: 1.2,
        renderCell: ({ row }: GridRenderCellParams<BankAccount>) => (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              {row.type === 'POS' ? <CreditCard className="size-4" /> : <Landmark className="size-4" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{accountDisplayName(row)}</p>
              <p className="mt-0.5 truncate text-xs font-medium tabular-nums text-muted-foreground">{row.code || row.accountNo || '-'}</p>
            </div>
          </div>
        ),
      },
      {
        field: 'type',
        headerName: 'Tip',
        minWidth: 150,
        flex: 0.7,
        renderCell: ({ row }: GridRenderCellParams<BankAccount>) => (
          <Badge variant="outline" className={cn('rounded-md', typeTone(row.type))}>
            {ACCOUNT_TYPE_LABELS[row.type] ?? row.type}
          </Badge>
        ),
      },
      {
        field: 'iban',
        headerName: 'IBAN / No',
        minWidth: 210,
        flex: 1,
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams<BankAccount>) => (
          <span className="truncate font-mono text-xs text-muted-foreground">{row.iban || row.accountNo || '-'}</span>
        ),
      },
      {
        field: 'limit',
        headerName: 'Limit / Oran',
        minWidth: 130,
        flex: 0.65,
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams<BankAccount>) => (
          <span className="text-sm font-medium tabular-nums">{accountLimitText(row)}</span>
        ),
      },
      {
        field: 'balance',
        headerName: 'Bakiye / Borç',
        minWidth: 150,
        flex: 0.75,
        align: 'right',
        headerAlign: 'right',
        valueGetter: (_value, row) => accountDisplayAmount(row),
        renderCell: ({ row }: GridRenderCellParams<BankAccount>) => {
          const amount = accountDisplayAmount(row);
          const negativeTone = amount < 0 || row.type === 'LOAN' || row.type === 'COMPANY_CREDIT_CARD';
          return (
            <span className={cn('w-full text-right text-sm font-semibold tabular-nums', negativeTone ? 'text-destructive' : 'text-[var(--income)]')}>
              {formatCurrency(amount)}
            </span>
          );
        },
      },
      {
        field: 'isActive',
        headerName: 'Durum',
        width: 95,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }: GridRenderCellParams<BankAccount>) => (
          <Badge variant="outline" className={cn('rounded-md', row.isActive ? 'border-[var(--income)] bg-[var(--income-muted)] text-[var(--income)]' : 'border-muted bg-muted text-muted-foreground')}>
            {row.isActive ? 'Aktif' : 'Pasif'}
          </Badge>
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 120,
        sortable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ row }: GridRenderCellParams<BankAccount>) => (
          <div className="flex w-full items-center justify-end gap-1">
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Hesabı düzenle" onClick={(event) => { event.stopPropagation(); openEditDialog(row); }}>
              <Pencil className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Hesap detayı" onClick={(event) => { event.stopPropagation(); router.push(`/bank/hesap/${row.id}`); }}>
              <Eye className="size-4" />
            </Button>
            <Button type="button" variant="destructive" size="icon-sm" aria-label="Hesabı sil" onClick={(event) => { event.stopPropagation(); setSelectedHesapId(row.id); setDeleteDialogOpen(true); }}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [router],
  );

  if (loading) return <LoadingState />;
  if (!banka) return null;

  const logo = getBankLogo(banka.name, banka.logo);

  return (
    <MainLayout>
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-col gap-4 border-b pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <Button type="button" variant="ghost" size="sm" onClick={() => router.push('/bank')} className="mb-3 px-0">
              <ArrowLeft className="size-4" />
              Bankalar
            </Button>
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background text-lg font-semibold text-muted-foreground">
                {logo ? <img src={logo} alt="" className="h-12 w-12 object-contain" /> : getInitials(banka.name)}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-semibold tracking-normal text-foreground">{banka.name}</h1>
                  <Badge variant="outline" className={cn('rounded-md', banka.isActive ? 'border-[var(--income)] bg-[var(--income-muted)] text-[var(--income)]' : 'border-muted bg-muted text-muted-foreground')}>
                    {banka.isActive ? <CheckCircle2 className="size-3" /> : <CircleOff className="size-3" />}
                    {banka.isActive ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {banka.branch || 'Merkez'}{banka.city ? ` / ${banka.city}` : ''}{banka.contactName ? ` · ${banka.contactName}` : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" onClick={() => void loadData()} disabled={actionLoading}>
              <RefreshCw className={cn('size-4', actionLoading && 'animate-spin')} />
              Yenile
            </Button>
            <Button type="button" onClick={openCreateDialog}>
              <Plus className="size-4" />
              Yeni Hesap
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <MetricCard title="Toplam Bakiye" value={formatCurrency(totals.total)} description="Hesapların toplam etkisi" icon={<Banknote className="size-5" />} />
          <MetricCard title="Hesap Sayısı" value={String(accounts.length)} description={`${activeAccounts.length} aktif hesap`} icon={<WalletCards className="size-5" />} />
          <MetricCard title="POS Hesabı" value={String(typeCounts.POS ?? 0)} description={formatCurrency(totals.byType.POS ?? 0)} icon={<CreditCard className="size-5" />} />
          <MetricCard title="Kredi / Kart" value={String((typeCounts.LOAN ?? 0) + (typeCounts.COMPANY_CREDIT_CARD ?? 0))} description="Borç ve limit takibi" icon={<ShieldCheck className="size-5" />} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/60 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Bankaya Bağlı Hesaplar</CardTitle>
                  <CardDescription>{accounts.length} hesap, {activeAccounts.length} aktif kayıt</CardDescription>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(typeCounts).map(([type, count]) => (
                    <Badge key={type} variant="outline" className={cn('rounded-md', typeTone(type))}>
                      {ACCOUNT_TYPE_LABELS[type] ?? type}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[620px]">
                <DataGrid<BankAccount>
                  rows={accounts}
                  columns={columns}
                  getRowId={(row) => row.id}
                  loading={actionLoading}
                  disableRowSelectionOnClick
                  rowHeight={56}
                  columnHeaderHeight={38}
                  pageSizeOptions={[15, 30, 50]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 15, page: 0 },
                    },
                  }}
                  localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                  onRowClick={(params) => setSelectedAccountId(params.row.id)}
                  onRowDoubleClick={(params) => router.push(`/bank/hesap/${params.row.id}`)}
                  sx={{
                    ...dataGridStyles,
                    '& .MuiDataGrid-cell': {
                      ...dataGridStyles['& .MuiDataGrid-cell'],
                      display: 'flex',
                      alignItems: 'center',
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seçili Hesap</CardTitle>
                <CardDescription>Hesap özeti ve hızlı aksiyonlar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAccount ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                        {selectedAccount.type === 'POS' ? <CreditCard className="size-5" /> : <Landmark className="size-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{accountDisplayName(selectedAccount)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{ACCOUNT_TYPE_LABELS[selectedAccount.type] ?? selectedAccount.type}</p>
                        <div className="mt-2">
                          <Badge variant="outline" className={cn('rounded-md', typeTone(selectedAccount.type))}>
                            {selectedAccount.isActive ? 'Aktif' : 'Pasif'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Bakiye / borç</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(accountDisplayAmount(selectedAccount))}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Limit / oran</span>
                        <span className="truncate font-medium tabular-nums">{accountLimitText(selectedAccount)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Hesap no</span>
                        <span className="truncate font-medium tabular-nums">{selectedAccount.accountNo || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">IBAN</span>
                        <span className="truncate font-mono text-xs">{selectedAccount.iban || '-'}</span>
                      </div>
                    </div>

                    {selectedAccount.type === 'COMPANY_CREDIT_CARD' ? (
                      <>
                        <Separator />
                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Hesap kesim</span>
                            <span className="font-medium">{selectedAccount.statementDay || '-'}.</span>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-muted-foreground">Son ödeme</span>
                            <span className="font-medium">{selectedAccount.paymentDueDay || '-'}.</span>
                          </div>
                        </div>
                      </>
                    ) : null}

                    {selectedAccount.type === 'LOAN' && selectedAccount.loans?.length ? (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-xs font-medium uppercase text-muted-foreground">Kredi Planı</p>
                          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-muted-foreground">Kredi adedi</span>
                              <span className="font-semibold">{selectedAccount.loans.length}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-3">
                              <span className="text-muted-foreground">İlk vade</span>
                              <span className="font-medium">
                                {formatDate(selectedAccount.loans.flatMap((loan) => loan.plans ?? [])[0]?.dueDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}

                    <div className="grid gap-2">
                      <Button type="button" onClick={() => router.push(`/bank/hesap/${selectedAccount.id}`)}>
                        <Eye className="size-4" />
                        Hesap Detayı
                      </Button>
                      <Button type="button" variant="outline" onClick={() => openEditDialog(selectedAccount)}>
                        <Pencil className="size-4" />
                        Düzenle
                      </Button>
                    </div>
                  </>
                ) : (
                  <Alert>
                    <WalletCards className="size-4" />
                    <AlertTitle>Hesap bulunamadı</AlertTitle>
                    <AlertDescription>Bu bankaya ilk hesabı ekleyerek hareket takibine başlayabilirsiniz.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Banka Bilgileri</CardTitle>
                <CardDescription>İletişim ve organizasyon detayı.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ['Şube', banka.branch || 'Merkez'],
                  ['Şehir', banka.city || '-'],
                  ['Yetkili', banka.contactName || '-'],
                  ['Telefon', banka.phone || '-'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 border-b pb-2 last:border-b-0 last:pb-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="truncate font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>

        <CreateAccountDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSuccess={loadData}
          bankaId={bankaId}
          bankaAdi={banka.name}
          mode={dialogMode}
          initialData={selectedAccountForEdit}
        />

        <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) setDeleteDialogOpen(false); }}>
          <DialogContent panelClassName="max-w-[500px]">
            <DialogHeader className="border-b px-5 py-4">
              <DialogTitle>Hesap Silinecek</DialogTitle>
              <DialogDescription>Seçili banka hesabı için silme onayı.</DialogDescription>
            </DialogHeader>
            <div className="px-5 py-4">
              <Alert variant="destructive">
                <Trash2 className="size-4" />
                <AlertTitle>Bu işlem hesap hareketlerine bağlıdır</AlertTitle>
                <AlertDescription>
                  Hesapta hareket varsa backend hesabı silmek yerine pasife alabilir veya işlemi engelleyebilir.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>Vazgeç</Button>
              <Button type="button" variant="destructive" onClick={() => void handleDeleteAccount()} disabled={actionLoading}>
                {actionLoading ? 'Siliniyor' : 'Sil'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {snackbar.open ? (
          <div className="fixed bottom-5 right-5 z-50 w-[min(420px,calc(100vw-2rem))]">
            <Alert variant={snackbar.severity === 'error' ? 'destructive' : 'default'} className="shadow-lg">
              <BadgeCheck className="size-4" />
              <AlertTitle>{snackbar.severity === 'error' ? 'İşlem başarısız' : 'İşlem bilgisi'}</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-3">
                <span>{snackbar.message}</span>
                <button type="button" onClick={() => setSnackbar((prev) => ({ ...prev, open: false }))} className="rounded-md p-1 hover:bg-muted" aria-label="Bildirimi kapat">
                  <X className="size-3.5" />
                </button>
              </AlertDescription>
            </Alert>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}
