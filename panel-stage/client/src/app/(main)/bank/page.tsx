'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import {
  BadgeCheck,
  Banknote,
  Building2,
  CheckCircle2,
  CircleOff,
  Eye,
  Landmark,
  Pencil,
  Plus,
  RefreshCw,
  Search,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { dataGridStyles } from '@/lib/datagrid-styles';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';
import { TURKISH_BANKS, getBankLogo } from '@/constants/bankalar';

type BankAccountType = 'DEMAND_DEPOSIT' | 'POS' | 'LOAN' | 'COMPANY_CREDIT_CARD' | 'TIME_DEPOSIT' | 'INVESTMENT' | 'GOLD' | 'CURRENCY' | 'OTHER';

interface BankAccount {
  id: string;
  name?: string | null;
  code?: string | null;
  type: BankAccountType;
  accountNo?: string | null;
  iban?: string | null;
  balance?: number | string | null;
  isActive?: boolean;
}

interface Banka {
  id: string;
  name: string;
  branch?: string | null;
  city?: string | null;
  contactName?: string | null;
  phone?: string | null;
  logo?: string | null;
  isActive: boolean;
  accounts?: BankAccount[];
  _count?: {
    accounts: number;
  };
}

interface BankFormState {
  name: string;
  branch: string;
  city: string;
  contactName: string;
  phone: string;
  isActive: boolean;
}

const EMPTY_BANK_FORM: BankFormState = {
  name: '',
  branch: '',
  city: '',
  contactName: '',
  phone: '',
  isActive: true,
};

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  DEMAND_DEPOSIT: 'Vadesiz',
  POS: 'POS',
  LOAN: 'Kredi',
  COMPANY_CREDIT_CARD: 'Firma Kartı',
  TIME_DEPOSIT: 'Vadeli',
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

function bankBalance(bank: Banka): number {
  return (bank.accounts ?? []).reduce((sum, account) => sum + Number(account.balance ?? 0), 0);
}

function bankAccountCount(bank: Banka): number {
  return bank._count?.accounts ?? bank.accounts?.length ?? 0;
}

function activeAccountCount(bank: Banka): number {
  return (bank.accounts ?? []).filter((account) => account.isActive !== false).length;
}

function accountTypeBreakdown(bank: Banka) {
  return (bank.accounts ?? []).reduce<Record<string, number>>((acc, account) => {
    acc[account.type] = (acc[account.type] ?? 0) + 1;
    return acc;
  }, {});
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'B';
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

export default function BankaPage() {
  const router = useRouter();

  const [bankalar, setBankalar] = useState<Banka[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [selectedBanka, setSelectedBanka] = useState<Banka | null>(null);
  const [bankForm, setBankForm] = useState<BankFormState>(EMPTY_BANK_FORM);
  const [formError, setFormError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadBankalar = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/banks');
      const rows = Array.isArray(response.data) ? response.data : [];
      setBankalar(rows);
      setSelectedBankId((current) => current ?? rows[0]?.id ?? null);
    } catch {
      showSnackbar('Bankalar yüklenirken bir hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    void loadBankalar();
  }, [loadBankalar]);

  const filteredBankalar = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return bankalar;

    return bankalar.filter((bank) => (
      bank.name.toLowerCase().includes(term)
      || (bank.branch ?? '').toLowerCase().includes(term)
      || (bank.city ?? '').toLowerCase().includes(term)
      || (bank.contactName ?? '').toLowerCase().includes(term)
      || (bank.phone ?? '').toLowerCase().includes(term)
    ));
  }, [bankalar, searchQuery]);

  const selectedBank = useMemo(() => {
    return filteredBankalar.find((bank) => bank.id === selectedBankId) ?? filteredBankalar[0] ?? null;
  }, [filteredBankalar, selectedBankId]);

  const totalAccounts = useMemo(() => bankalar.reduce((sum, bank) => sum + bankAccountCount(bank), 0), [bankalar]);
  const activeBanks = useMemo(() => bankalar.filter((bank) => bank.isActive).length, [bankalar]);
  const totalBalance = useMemo(() => bankalar.reduce((sum, bank) => sum + bankBalance(bank), 0), [bankalar]);

  const openCreateBankDialog = () => {
    setSelectedBanka(null);
    setBankForm(EMPTY_BANK_FORM);
    setFormError('');
    setBankDialogOpen(true);
  };

  const openEditBankDialog = (bank: Banka) => {
    setSelectedBanka(bank);
    setBankForm({
      name: bank.name,
      branch: bank.branch ?? '',
      city: bank.city ?? '',
      contactName: bank.contactName ?? '',
      phone: bank.phone ?? '',
      isActive: bank.isActive,
    });
    setFormError('');
    setBankDialogOpen(true);
  };

  const handleBankSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = bankForm.name.trim();

    if (!name) {
      setFormError('Banka adı zorunludur');
      return;
    }

    const payload = {
      name,
      branch: bankForm.branch.trim() || undefined,
      city: bankForm.city.trim() || undefined,
      contactName: bankForm.contactName.trim() || undefined,
      phone: bankForm.phone.trim() || undefined,
      logo: getBankLogo(name),
      isActive: bankForm.isActive,
    };

    try {
      setSaving(true);
      if (selectedBanka) {
        await axios.put(`/banks/${selectedBanka.id}`, payload);
        showSnackbar('Banka güncellendi');
      } else {
        await axios.post('/banks', payload);
        showSnackbar('Banka oluşturuldu');
      }
      setBankDialogOpen(false);
      setSelectedBanka(null);
      setBankForm(EMPTY_BANK_FORM);
      await loadBankalar();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Banka kaydı tamamlanamadı', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBanka) return;

    try {
      setSaving(true);
      await axios.delete(`/banks/${selectedBanka.id}`);
      showSnackbar('Banka silindi');
      setDeleteDialogOpen(false);
      setSelectedBanka(null);
      setSelectedBankId(null);
      await loadBankalar();
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || 'Banka silinemedi', 'error');
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<GridColDef<Banka>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Banka',
        minWidth: 230,
        flex: 1.2,
        renderCell: ({ row }: GridRenderCellParams<Banka>) => {
          const logo = getBankLogo(row.name, row.logo);
          return (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background text-xs font-semibold text-muted-foreground">
                {logo ? <img src={logo} alt="" className="h-7 w-7 object-contain" /> : getInitials(row.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{row.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.city || row.branch ? `${row.branch || 'Merkez'}${row.city ? ` / ${row.city}` : ''}` : 'Şube bilgisi yok'}</p>
              </div>
            </div>
          );
        },
      },
      {
        field: 'contactName',
        headerName: 'Yetkili',
        minWidth: 150,
        flex: 0.75,
        renderCell: ({ row }: GridRenderCellParams<Banka>) => (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{row.contactName || '-'}</p>
            <p className="truncate text-xs text-muted-foreground">{row.phone || '-'}</p>
          </div>
        ),
      },
      {
        field: 'accounts',
        headerName: 'Hesap',
        width: 110,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams<Banka>) => (
          <Badge variant="outline" className="rounded-md">
            <WalletCards className="size-3" />
            {bankAccountCount(row)}
          </Badge>
        ),
      },
      {
        field: 'balance',
        headerName: 'Toplam Bakiye',
        minWidth: 150,
        flex: 0.7,
        align: 'right',
        headerAlign: 'right',
        valueGetter: (_value, row) => bankBalance(row),
        renderCell: ({ row }: GridRenderCellParams<Banka>) => (
          <span className={cn('w-full text-right text-sm font-semibold tabular-nums', bankBalance(row) < 0 ? 'text-destructive' : 'text-[var(--income)]')}>
            {formatCurrency(bankBalance(row))}
          </span>
        ),
      },
      {
        field: 'isActive',
        headerName: 'Durum',
        width: 100,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }: GridRenderCellParams<Banka>) => (
          <Badge variant="outline" className={cn('rounded-md', row.isActive ? 'border-[var(--income)] bg-[var(--income-muted)] text-[var(--income)]' : 'border-muted bg-muted text-muted-foreground')}>
            {row.isActive ? <CheckCircle2 className="size-3" /> : <CircleOff className="size-3" />}
            {row.isActive ? 'Aktif' : 'Pasif'}
          </Badge>
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 150,
        sortable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ row }: GridRenderCellParams<Banka>) => (
          <div className="flex w-full items-center justify-end gap-1">
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Detay" onClick={(event) => { event.stopPropagation(); router.push(`/bank/${row.id}`); }}>
              <Eye className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Banka düzenle" onClick={(event) => { event.stopPropagation(); openEditBankDialog(row); }}>
              <Pencil className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Hesap ekle" onClick={(event) => { event.stopPropagation(); setSelectedBanka(row); setAccountDialogOpen(true); }}>
              <Plus className="size-4" />
            </Button>
            <Button type="button" variant="destructive" size="icon-sm" aria-label="Banka sil" onClick={(event) => { event.stopPropagation(); setSelectedBanka(row); setDeleteDialogOpen(true); }}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [router],
  );

  return (
    <MainLayout>
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-col gap-4 border-b pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Finans</span>
              <span>/</span>
              <span className="text-foreground">Bankalar</span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal text-foreground">Banka Yönetimi</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Bankaları, bağlı hesapları ve bakiye dağılımını tek ekrandan yönetin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" onClick={() => void loadBankalar()} disabled={loading}>
              <RefreshCw className={cn('size-4', loading && 'animate-spin')} />
              Yenile
            </Button>
            <Button type="button" onClick={openCreateBankDialog}>
              <Plus className="size-4" />
              Yeni Banka
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard title="Toplam Banka" value={String(bankalar.length)} description={`${activeBanks} aktif banka`} icon={<Building2 className="size-5" />} />
          <MetricCard title="Toplam Hesap" value={String(totalAccounts)} description="Bankalara bağlı hesap sayısı" icon={<WalletCards className="size-5" />} />
          <MetricCard title="Toplam Bakiye" value={formatCurrency(totalBalance)} description="Tüm banka hesapları" icon={<Banknote className="size-5" />} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/60 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Banka Listesi</CardTitle>
                  <CardDescription>{filteredBankalar.length} kayıt gösteriliyor</CardDescription>
                </div>
                <div className="flex w-full items-center gap-2 lg:w-auto">
                  <div className="relative w-full lg:w-80">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Banka, şube, şehir veya yetkili ara..."
                      className="pl-8 pr-8"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Aramayı temizle"
                      >
                        <X className="size-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[620px]">
                <DataGrid<Banka>
                  rows={filteredBankalar}
                  columns={columns}
                  getRowId={(row) => row.id}
                  loading={loading}
                  disableRowSelectionOnClick
                  rowHeight={58}
                  columnHeaderHeight={38}
                  pageSizeOptions={[15, 30, 50]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 15, page: 0 },
                    },
                  }}
                  localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                  onRowClick={(params) => setSelectedBankId(params.row.id)}
                  sx={{
                    ...dataGridStyles,
                    '& .MuiDataGrid-cell': {
                      ...dataGridStyles['& .MuiDataGrid-cell'],
                      display: 'flex',
                      alignItems: 'center',
                    },
                    '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover': {
                      backgroundColor: 'var(--muted)',
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seçili Banka</CardTitle>
                <CardDescription>Hızlı durum ve hesap dağılımı.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedBank ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-background text-sm font-semibold text-muted-foreground">
                        {getBankLogo(selectedBank.name, selectedBank.logo)
                          ? <img src={getBankLogo(selectedBank.name, selectedBank.logo)!} alt="" className="h-9 w-9 object-contain" />
                          : getInitials(selectedBank.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{selectedBank.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {selectedBank.branch || 'Merkez'}{selectedBank.city ? ` / ${selectedBank.city}` : ''}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="outline" className="rounded-md">{selectedBank.isActive ? 'Aktif' : 'Pasif'}</Badge>
                          <Badge variant="outline" className="rounded-md">{activeAccountCount(selectedBank)} aktif hesap</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Toplam bakiye</span>
                        <span className={cn('font-semibold tabular-nums', bankBalance(selectedBank) < 0 ? 'text-destructive' : 'text-[var(--income)]')}>{formatCurrency(bankBalance(selectedBank))}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Yetkili</span>
                        <span className="truncate font-medium">{selectedBank.contactName || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Telefon</span>
                        <span className="truncate font-medium tabular-nums">{selectedBank.phone || '-'}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase text-muted-foreground">Hesap Tipleri</p>
                      {Object.entries(accountTypeBreakdown(selectedBank)).length ? (
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(accountTypeBreakdown(selectedBank)).map(([type, count]) => (
                            <Badge key={type} variant="outline" className="rounded-md">
                              {ACCOUNT_TYPE_LABELS[type] ?? type}: {count}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Bu banka için hesap eklenmemiş.</p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Button type="button" onClick={() => { setSelectedBanka(selectedBank); setAccountDialogOpen(true); }}>
                        <Plus className="size-4" />
                        Hesap Ekle
                      </Button>
                      <Button type="button" variant="outline" onClick={() => router.push(`/bank/${selectedBank.id}`)}>
                        <Eye className="size-4" />
                        Detaya Git
                      </Button>
                    </div>
                  </>
                ) : (
                  <Alert>
                    <Landmark className="size-4" />
                    <AlertTitle>Banka bulunamadı</AlertTitle>
                    <AlertDescription>Yeni bir banka ekleyerek hesap tanımlamaya başlayabilirsiniz.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>İş Akışı</CardTitle>
                <CardDescription>Banka tanımı ve hesap ekleme sırası.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ['1', 'Banka kaydını oluşturun'],
                  ['2', 'Vadesiz, POS, kredi veya firma kartı hesabını ekleyin'],
                  ['3', 'Hareketleri banka detayından izleyin'],
                ].map(([step, text]) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-semibold">{step}</span>
                    <span className="text-muted-foreground">{text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>

        <Dialog open={bankDialogOpen} onOpenChange={(open) => { if (!open) setBankDialogOpen(false); }}>
          <DialogContent panelClassName="max-w-[720px]">
            <DialogHeader className="border-b px-5 py-4">
              <DialogTitle>{selectedBanka ? 'Banka Düzenle' : 'Yeni Banka Ekle'}</DialogTitle>
              <DialogDescription>
                Backend banka kaydı yalnızca ad, şube, şehir, yetkili, telefon, logo ve aktiflik alanlarını kabul eder.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBankSubmit}>
              <div className="grid gap-4 px-5 py-4">
                {formError ? (
                  <Alert variant="destructive">
                    <CircleOff className="size-4" />
                    <AlertTitle>Eksik bilgi</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="grid gap-2">
                  <Label htmlFor="bank-name">Banka Adı</Label>
                  <Input
                    id="bank-name"
                    list="turkish-bank-options"
                    value={bankForm.name}
                    onChange={(event) => {
                      setBankForm((prev) => ({ ...prev, name: event.target.value }));
                      setFormError('');
                    }}
                    placeholder="Örn. Ziraat Bankası"
                    autoFocus
                  />
                  <datalist id="turkish-bank-options">
                    {TURKISH_BANKS.map((bank) => <option key={bank} value={bank} />)}
                  </datalist>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="bank-branch">Şube</Label>
                    <Input id="bank-branch" value={bankForm.branch} onChange={(event) => setBankForm((prev) => ({ ...prev, branch: event.target.value }))} placeholder="Merkez" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bank-city">Şehir</Label>
                    <Input id="bank-city" value={bankForm.city} onChange={(event) => setBankForm((prev) => ({ ...prev, city: event.target.value }))} placeholder="İstanbul" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="bank-contact">Yetkili</Label>
                    <Input id="bank-contact" value={bankForm.contactName} onChange={(event) => setBankForm((prev) => ({ ...prev, contactName: event.target.value }))} placeholder="Yetkili kişi" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bank-phone">Telefon</Label>
                    <Input id="bank-phone" value={bankForm.phone} onChange={(event) => setBankForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="0 (___) ___ __ __" />
                  </div>
                </div>

                <label className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                  <span>
                    <span className="block font-medium">Aktif banka</span>
                    <span className="text-xs text-muted-foreground">Pasif bankalar listede kalır ancak yeni akışlarda ayrıştırılır.</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={bankForm.isActive}
                    onChange={(event) => setBankForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                    className="size-4 accent-primary"
                  />
                </label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setBankDialogOpen(false)} disabled={saving}>İptal</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Kaydediliyor' : 'Kaydet'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) setDeleteDialogOpen(false); }}>
          <DialogContent panelClassName="max-w-[500px]">
            <DialogHeader className="border-b px-5 py-4">
              <DialogTitle>Banka Silinecek</DialogTitle>
              <DialogDescription>{selectedBanka?.name ?? 'Seçili banka'} için silme onayı.</DialogDescription>
            </DialogHeader>
            <div className="px-5 py-4">
              <Alert variant="destructive">
                <Trash2 className="size-4" />
                <AlertTitle>Bu işlem bağlı hesapları etkileyebilir</AlertTitle>
                <AlertDescription>
                  Backend işlem görmüş hesap bulunan bankalarda silmeyi engeller. Böyle bir kayıt varsa bankayı pasife almanız gerekir.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={saving}>Vazgeç</Button>
              <Button type="button" variant="destructive" onClick={() => void handleDelete()} disabled={saving}>{saving ? 'Siliniyor' : 'Sil'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CreateAccountDialog
          open={accountDialogOpen}
          onClose={() => setAccountDialogOpen(false)}
          onSuccess={loadBankalar}
          bankaId={selectedBanka?.id || selectedBank?.id || ''}
          bankaAdi={selectedBanka?.name || selectedBank?.name || ''}
        />

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
