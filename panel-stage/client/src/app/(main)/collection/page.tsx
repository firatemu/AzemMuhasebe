'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  CreditCard,
  Download,
  Eraser,
  Eye,
  FileText,
  Landmark,
  Plus,
  Printer,
  ReceiptText,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  WalletCards,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

import MainLayout from '@/components/Layout/MainLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { dataGridStyles } from '@/lib/datagrid-styles';
import { resolveDefaultCashboxId } from '@/lib/defaultCashbox';
import { cn } from '@/lib/utils';
import axios from '@/lib/axios';

import CaprazOdemeDialog from './components/CaprazOdemeDialog';
import TahsilatFormDialog from './components/TahsilatFormDialog';
import type { BankaHesap, CaprazOdemeFormData, Cari, Kasa, TahsilatFormData } from './types';

type CollectionKind = 'COLLECTION' | 'PAYMENT';
type LegacyPaymentMethod = 'NAKIT' | 'KREDI_KARTI' | 'HAVALE_EFT' | 'CEK' | 'SENET';

interface Tahsilat {
  id: string;
  tip: CollectionKind;
  tutar: number;
  tarih: string;
  odemeTipi: LegacyPaymentMethod | 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CHECK' | 'PROMISSORY_NOTE';
  aciklama?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  cari: {
    cariKodu: string;
    unvan: string;
  };
  kasa: {
    kasaKodu: string;
    kasaAdi: string;
    kasaTipi: string;
  } | null;
  bankaHesap?: {
    id: string;
    hesapAdi: string;
    bankaAdi: string;
  } | null;
  firmaKrediKarti?: {
    id: string;
    kartAdi: string;
    bankaAdi: string;
    kartTipi: string;
  } | null;
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  tone?: 'default' | 'income' | 'expense' | 'warning' | 'info';
}

const EMPTY_STATS = {
  totalCollection: 0,
  totalPayment: 0,
  monthlyCollection: 0,
  monthlyPayment: 0,
  cashCollection: 0,
  creditCardCollection: 0,
};

function toDateInputValue(date = new Date()): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function initialMonthRange() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    start: toDateInputValue(start),
    end: toDateInputValue(today),
  };
}

function normalizeCollectionRow(row: any): Tahsilat {
  const type = (row.tip || row.type || 'COLLECTION') as CollectionKind;
  const amount = Number(row.tutar ?? row.amount ?? 0);
  const dateValue = row.tarih || row.date || row.createdAt || new Date().toISOString();
  const paymentMethod = String(row.odemeTipi || row.paymentType || 'CASH');

  return {
    id: String(row.id),
    tip: type,
    tutar: Number.isFinite(amount) ? amount : 0,
    tarih: String(dateValue),
    odemeTipi: paymentMethod as Tahsilat['odemeTipi'],
    aciklama: row.aciklama || row.notes || '',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    createdBy: row.createdBy || null,
    updatedBy: row.updatedBy || null,
    cari: row.cari || (row.account ? {
      cariKodu: row.account.code || row.account.cariKodu || '',
      unvan: row.account.title || row.account.unvan || '',
    } : { cariKodu: '', unvan: '' }),
    kasa: row.kasa || (row.cashbox ? {
      kasaKodu: row.cashbox.code || row.cashbox.kasaKodu || '',
      kasaAdi: row.cashbox.name || row.cashbox.kasaAdi || '',
      kasaTipi: row.cashbox.type || row.cashbox.kasaTipi || '',
    } : null),
    bankaHesap: row.bankaHesap || (row.bankAccount ? {
      id: row.bankAccount.id,
      hesapAdi: row.bankAccount.name || row.bankAccount.hesapAdi || '',
      bankaAdi: row.bankAccount.bank?.name || row.bankAccount.bankaAdi || '',
    } : null),
    firmaKrediKarti: row.firmaKrediKarti || (row.companyCreditCard ? {
      id: row.companyCreditCard.id,
      kartAdi: row.companyCreditCard.cardName || row.companyCreditCard.name || row.companyCreditCard.kartAdi || '',
      bankaAdi: row.companyCreditCard.bankName || row.companyCreditCard.bankaAdi || '',
      kartTipi: row.companyCreditCard.cardType || row.companyCreditCard.kartTipi || '',
    } : null),
  };
}

function mapAccountToCari(row: any): Cari {
  return {
    id: String(row.id),
    cariKodu: String(row.cariKodu ?? row.code ?? ''),
    unvan: String(row.unvan ?? row.title ?? row.name ?? ''),
    bakiye: Number(row.bakiye ?? row.balance ?? 0),
    satisElemaniId: row.satisElemaniId ?? row.salesAgentId,
  };
}

function mapCashbox(row: any): Kasa {
  return {
    id: String(row.id),
    kasaKodu: String(row.kasaKodu ?? row.code ?? ''),
    kasaAdi: String(row.kasaAdi ?? row.name ?? ''),
    bakiye: Number(row.bakiye ?? row.balance ?? 0),
    kasaTipi: row.type === 'CASH'
      ? 'NAKIT'
      : row.type === 'COMPANY_CREDIT_CARD'
        ? 'FIRMA_KREDI_KARTI'
        : row.type === 'POS'
          ? 'POS'
          : row.type === 'BANK'
            ? 'BANKA'
            : row.kasaTipi ?? row.type,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function paymentMethodLabel(value: string): string {
  const labels: Record<string, string> = {
    NAKIT: 'Nakit',
    CASH: 'Nakit',
    KREDI_KARTI: 'Kart',
    CREDIT_CARD: 'Kart',
    HAVALE_EFT: 'Havale/EFT',
    BANK_TRANSFER: 'Havale/EFT',
    CEK: 'Çek',
    CHECK: 'Çek',
    SENET: 'Senet',
    PROMISSORY_NOTE: 'Senet',
    POS: 'POS',
  };

  return labels[value] ?? value;
}

function paymentMethodIcon(value: string): ReactNode {
  if (value === 'KREDI_KARTI' || value === 'CREDIT_CARD' || value === 'POS') return <CreditCard className="size-3.5" />;
  if (value === 'BANK_TRANSFER' || value === 'HAVALE_EFT') return <Landmark className="size-3.5" />;
  return <Banknote className="size-3.5" />;
}

function toneClass(tone: MetricCardProps['tone'] = 'default'): string {
  const tones = {
    default: 'border-border bg-muted text-muted-foreground',
    income: 'border-[var(--income)] bg-[var(--income-muted)] text-[var(--income)]',
    expense: 'border-[var(--expense)] bg-[var(--expense-muted)] text-[var(--expense)]',
    warning: 'border-[var(--warning)] bg-[var(--warning-muted)] text-[var(--warning)]',
    info: 'border-[var(--info)] bg-[var(--info-muted)] text-[var(--info)]',
  };

  return tones[tone];
}

function paymentSourceText(row: Tahsilat): string {
  if (row.kasa) return row.kasa.kasaAdi || row.kasa.kasaKodu || '-';
  if (row.bankaHesap) return `${row.bankaHesap.bankaAdi} ${row.bankaHesap.hesapAdi}`.trim();
  if (row.firmaKrediKarti) return row.firmaKrediKarti.kartAdi || row.firmaKrediKarti.bankaAdi || '-';
  return '-';
}

function EmptyRowsOverlay({ activeTab }: { activeTab: 0 | 1 }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
        <ReceiptText className="size-5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold">
          {activeTab === 0 ? 'Tahsilat kaydı bulunamadı' : 'Ödeme kaydı bulunamadı'}
        </p>
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          Tarih aralığını veya arama filtresini genişletin.
        </p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, description, icon, tone = 'default' }: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase text-muted-foreground">{title}</p>
            <p className="mt-2 truncate text-2xl font-semibold tabular-nums">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg border', toneClass(tone))}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CollectionPage() {
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState(false);
  const [openCaprazOdemeDialog, setOpenCaprazOdemeDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTahsilat, setSelectedTahsilat] = useState<Tahsilat | null>(null);
  const [auditRow, setAuditRow] = useState<Tahsilat | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [denseMode, setDenseMode] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [quickFilter, setQuickFilter] = useState('BU_AY');
  const [dateRange, setDateRange] = useState(initialMonthRange);

  const [initialFormData, setInitialFormData] = useState<TahsilatFormData>({
    cariId: '',
    tip: 'COLLECTION',
    tutar: '',
    tarih: toDateInputValue(),
    odemeTipi: 'NAKIT',
    kasaId: '',
    bankaHesapId: '',
    aciklama: '',
    kartSahibi: '',
    kartSonDort: '',
    bankaAdi: '',
    firmaKrediKartiId: '',
    installmentCount: 1,
  });

  const [caprazOdemeFormData, setCaprazOdemeFormData] = useState<CaprazOdemeFormData>({
    tahsilatCariId: '',
    odemeCariId: '',
    tutar: 0,
    tarih: toDateInputValue(),
    aciklama: '',
  });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleQuickFilter = useCallback((filter: string) => {
    setQuickFilter(filter);
    const today = new Date();

    if (filter === 'BUGUN') {
      const todayValue = toDateInputValue(today);
      setDateRange({ start: todayValue, end: todayValue });
      return;
    }

    if (filter === 'BU_HAFTA') {
      const start = new Date(today);
      const day = start.getDay();
      start.setDate(start.getDate() - day + (day === 0 ? -6 : 1));
      setDateRange({ start: toDateInputValue(start), end: toDateInputValue(today) });
      return;
    }

    if (filter === 'BU_AY') {
      setDateRange(initialMonthRange());
      return;
    }

    if (filter === 'BU_YIL') {
      const start = new Date(today.getFullYear(), 0, 1);
      setDateRange({ start: toDateInputValue(start), end: toDateInputValue(today) });
      return;
    }

    setDateRange({ start: '', end: '' });
  }, []);

  const {
    data: tahsilatData = [],
    isLoading: tahsilatLoading,
    isFetching: tahsilatFetching,
    refetch,
  } = useQuery<Tahsilat[]>({
    queryKey: ['collection', 'list', dateRange.start, dateRange.end],
    queryFn: async () => {
      const params: Record<string, string | number> = { page: 1, limit: 1000 };
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const response = await axios.get('/collections', { params });
      const rows = response.data?.data ?? [];
      return Array.isArray(rows) ? rows.map(normalizeCollectionRow) : [];
    },
  });

  const { data: stats = EMPTY_STATS, isFetching: statsFetching } = useQuery<typeof EMPTY_STATS>({
    queryKey: ['collection', 'stats'],
    queryFn: async () => {
      const response = await axios.get('/collections/stats');
      const data = response.data ?? {};

      return {
        totalCollection: Number(data.totalCollection ?? 0),
        totalPayment: Number(data.totalPayment ?? 0),
        monthlyCollection: Number(data.monthlyCollection ?? 0),
        monthlyPayment: Number(data.monthlyPayment ?? 0),
        cashCollection: Number(data.cashCollection ?? 0),
        creditCardCollection: Number(data.creditCardCollection ?? 0),
      };
    },
    initialData: EMPTY_STATS,
  });

  const {
    data: cariler = [],
    isLoading: carilerLoading,
  } = useQuery<Cari[]>({
    queryKey: ['cari', 'collection'],
    queryFn: async () => {
      const response = await axios.get('/account', { params: { limit: 1000 } });
      const rows = response.data?.data ?? response.data ?? [];
      return Array.isArray(rows) ? rows.map(mapAccountToCari) : [];
    },
    enabled: openDialog || openCaprazOdemeDialog,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: bankaHesaplari = [],
    isLoading: bankaHesaplariLoading,
  } = useQuery<BankaHesap[]>({
    queryKey: ['bank', 'accounts', 'collection'],
    queryFn: async () => {
      const response = await axios.get('/banks/summary');
      const hesaplar: BankaHesap[] = [];

      response.data?.bankalar?.forEach((banka: any) => {
        banka.hesaplar?.forEach((hesap: any) => {
          hesaplar.push({
            id: hesap.id,
            hesapAdi: hesap.hesapAdi ?? hesap.name ?? '',
            bankaAdi: banka.ad ?? banka.bankaAdi ?? banka.name ?? '',
            hesapNo: hesap.hesapNo ?? hesap.accountNo ?? '',
            iban: hesap.iban ?? '',
            paraBirimi: hesap.paraBirimi ?? hesap.currency ?? 'TRY',
            hesapTipi: hesap.hesapTipi ?? hesap.type ?? '',
            hesapKodu: hesap.hesapKodu ?? hesap.code ?? '',
          });
        });
      });

      return hesaplar;
    },
    enabled: openDialog || openCaprazOdemeDialog,
  });

  const {
    data: kasalar = [],
    isLoading: kasalarLoading,
  } = useQuery<Kasa[]>({
    queryKey: ['cashbox', 'collection'],
    queryFn: async () => {
      const response = await axios.get('/cashbox', { params: { aktif: true } });
      const rows = response.data ?? [];
      return Array.isArray(rows) ? rows.map(mapCashbox) : [];
    },
    enabled: openDialog || openCaprazOdemeDialog,
  });

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('tr-TR');

    return tahsilatData
      .filter((row) => (activeTab === 0 ? row.tip === 'COLLECTION' : row.tip === 'PAYMENT'))
      .filter((row) => {
        if (!query) return true;
        const haystack = [
          row.cari?.unvan,
          row.cari?.cariKodu,
          row.tutar,
          row.aciklama,
          row.kasa?.kasaAdi,
          row.bankaHesap?.hesapAdi,
          row.bankaHesap?.bankaAdi,
          row.firmaKrediKarti?.kartAdi,
          paymentMethodLabel(row.odemeTipi),
        ]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase('tr-TR');

        return haystack.includes(query);
      })
      .sort((a, b) => {
        const dateSort = new Date(b.tarih).getTime() - new Date(a.tarih).getTime();
        if (dateSort !== 0) return dateSort;
        if (a.createdAt && b.createdAt) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return b.id.localeCompare(a.id);
      });
  }, [activeTab, searchQuery, tahsilatData]);

  const collections = useMemo(() => tahsilatData.filter((row) => row.tip === 'COLLECTION'), [tahsilatData]);
  const payments = useMemo(() => tahsilatData.filter((row) => row.tip === 'PAYMENT'), [tahsilatData]);
  const collectionTotal = useMemo(() => collections.reduce((sum, row) => sum + Number(row.tutar || 0), 0), [collections]);
  const paymentTotal = useMemo(() => payments.reduce((sum, row) => sum + Number(row.tutar || 0), 0), [payments]);
  const filteredTotal = useMemo(() => filteredData.reduce((sum, row) => sum + Number(row.tutar || 0), 0), [filteredData]);
  const netBalance = collectionTotal - paymentTotal;
  const isLoading = tahsilatLoading || tahsilatFetching;

  const chartData = useMemo(() => {
    const dateMap = new Map<string, { date: string; label: string; tahsilat: number; odeme: number }>();

    tahsilatData.forEach((row) => {
      const date = row.tarih.slice(0, 10);
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          date,
          label: new Date(row.tarih).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
          tahsilat: 0,
          odeme: 0,
        });
      }

      const entry = dateMap.get(date)!;
      if (row.tip === 'COLLECTION') entry.tahsilat += Number(row.tutar || 0);
      else entry.odeme += Number(row.tutar || 0);
    });

    return [...dateMap.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  }, [tahsilatData]);

  const handleOpenDialog = useCallback((tip: CollectionKind) => {
    const defaultKasaId = resolveDefaultCashboxId(
      kasalar.map((kasa) => ({ id: kasa.id, kasaTipi: kasa.kasaTipi })),
      { nakitOnly: true },
    );

    setInitialFormData({
      cariId: '',
      tip,
      tutar: '',
      tarih: toDateInputValue(),
      odemeTipi: 'NAKIT',
      kasaId: defaultKasaId,
      bankaHesapId: '',
      aciklama: '',
      kartSahibi: '',
      kartSonDort: '',
      bankaAdi: '',
      firmaKrediKartiId: '',
      installmentCount: 1,
    });
    setOpenDialog(true);
  }, [kasalar]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedTahsilat(null);
  }, []);

  const invalidateAll = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['collection'] }),
      queryClient.invalidateQueries({ queryKey: ['cari'] }),
      queryClient.invalidateQueries({ queryKey: ['cashbox'] }),
    ]);
  }, [queryClient]);

  const handleSubmit = useCallback(async (submitFormData: TahsilatFormData) => {
    try {
      const amount = typeof submitFormData.tutar === 'string'
        ? Number.parseFloat(submitFormData.tutar)
        : submitFormData.tutar;

      if (!submitFormData.cariId || !amount || amount <= 0) {
        showSnackbar('Lütfen tüm zorunlu alanları doldurun', 'warning');
        return;
      }

      if (submitFormData.odemeTipi === 'KREDI_KARTI' && submitFormData.tip === 'COLLECTION') {
        if (!submitFormData.bankaHesapId) {
          showSnackbar('POS tahsilat için banka hesabı seçimi zorunludur', 'warning');
          return;
        }
      } else if (!submitFormData.kasaId) {
        showSnackbar('Kasa seçimi zorunludur', 'warning');
        return;
      }

      setActionLoading(true);

      const payload: Record<string, unknown> = {
        accountId: submitFormData.cariId,
        type: submitFormData.tip,
        amount,
        date: submitFormData.tarih,
        paymentMethod: submitFormData.odemeTipi === 'NAKIT'
          ? 'CASH'
          : submitFormData.odemeTipi === 'KREDI_KARTI'
            ? 'CREDIT_CARD'
            : submitFormData.odemeTipi,
        cashboxId: submitFormData.kasaId || null,
        notes: submitFormData.aciklama,
      };

      if (submitFormData.firmaKrediKartiId) payload.companyCreditCardId = submitFormData.firmaKrediKartiId;
      if (submitFormData.bankaHesapId) payload.bankAccountId = submitFormData.bankaHesapId;
      if (submitFormData.odemeTipi === 'KREDI_KARTI') payload.installmentCount = Number(submitFormData.installmentCount || 1);

      await axios.post('/collections', payload);
      showSnackbar(`${submitFormData.tip === 'COLLECTION' ? 'Tahsilat' : 'Ödeme'} başarıyla kaydedildi`, 'success');
      handleCloseDialog();
      await invalidateAll();
    } catch (error: any) {
      showSnackbar(error?.response?.data?.message || 'İşlem başarısız', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [handleCloseDialog, invalidateAll, showSnackbar]);

  const handleDelete = useCallback(async () => {
    if (!selectedTahsilat) return;

    try {
      setActionLoading(true);
      await axios.delete(`/collections/${selectedTahsilat.id}`);
      showSnackbar('Kayıt silindi', 'success');
      setOpenDeleteDialog(false);
      setSelectedTahsilat(null);
      await invalidateAll();
    } catch (error: any) {
      showSnackbar(error?.response?.data?.message || 'Silme başarısız', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [invalidateAll, selectedTahsilat, showSnackbar]);

  const handleCaprazOdeme = useCallback(async () => {
    try {
      if (!caprazOdemeFormData.tahsilatCariId || !caprazOdemeFormData.odemeCariId) {
        showSnackbar('Tahsilat ve ödeme carisi seçilmelidir', 'error');
        return;
      }

      if (caprazOdemeFormData.tahsilatCariId === caprazOdemeFormData.odemeCariId) {
        showSnackbar('Tahsilat ve ödeme carileri farklı olmalıdır', 'error');
        return;
      }

      const amount = typeof caprazOdemeFormData.tutar === 'string'
        ? Number.parseFloat(caprazOdemeFormData.tutar)
        : caprazOdemeFormData.tutar;

      if (!amount || amount <= 0) {
        showSnackbar("Tutar 0'dan büyük olmalıdır", 'error');
        return;
      }

      setActionLoading(true);
      await axios.post('/collections/capraz-odeme', {
        collectionAccountId: caprazOdemeFormData.tahsilatCariId,
        paymentAccountId: caprazOdemeFormData.odemeCariId,
        amount,
        date: caprazOdemeFormData.tarih,
        notes: caprazOdemeFormData.aciklama,
      });

      showSnackbar('Çapraz ödeme başarıyla oluşturuldu', 'success');
      setOpenCaprazOdemeDialog(false);
      setCaprazOdemeFormData({
        tahsilatCariId: '',
        odemeCariId: '',
        tutar: 0,
        tarih: toDateInputValue(),
        aciklama: '',
      });
      await invalidateAll();
    } catch (error: any) {
      showSnackbar(error?.response?.data?.message || 'Çapraz ödeme oluşturulamadı', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [caprazOdemeFormData, invalidateAll, showSnackbar]);

  const exportCsv = useCallback(() => {
    const rows = filteredData.map((row) => [
      formatDate(row.tarih),
      row.tip === 'COLLECTION' ? 'Tahsilat' : 'Ödeme',
      row.cari?.cariKodu ?? '',
      row.cari?.unvan ?? '',
      paymentMethodLabel(row.odemeTipi),
      paymentSourceText(row),
      String(row.tutar).replace('.', ','),
      row.aciklama ?? '',
    ]);

    const csv = [
      ['Tarih', 'Tip', 'Cari Kodu', 'Cari Ünvan', 'Yöntem', 'Kasa/Hesap', 'Tutar', 'Açıklama'],
      ...rows,
    ]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tahsilat-odeme-${toDateInputValue()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredData]);

  const columns = useMemo<GridColDef<Tahsilat>[]>(
    () => [
      {
        field: 'tarih',
        headerName: 'Tarih',
        width: 92,
        minWidth: 82,
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            <span>{formatDate(row.tarih)}</span>
          </div>
        ),
      },
      {
        field: 'cariKodu',
        headerName: 'Cari Kod',
        width: 92,
        minWidth: 82,
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <div className="flex min-w-0 items-center gap-1.5">
            <ReceiptText className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-xs font-semibold tabular-nums text-foreground">{row.cari?.cariKodu || '-'}</span>
          </div>
        ),
      },
      {
        field: 'cariUnvan',
        headerName: 'Cari Ünvan',
        minWidth: 160,
        flex: 1.25,
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <div className="flex min-w-0 items-center">
            <span className="truncate text-xs font-semibold text-foreground">{row.cari?.unvan || '-'}</span>
          </div>
        ),
      },
      {
        field: 'tip',
        headerName: 'Tip',
        width: 82,
        minWidth: 74,
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <Badge
            variant="outline"
            className={cn(
              'h-5 rounded-md px-1.5 text-[11px]',
              row.tip === 'COLLECTION' ? toneClass('income') : toneClass('expense'),
            )}
          >
            {row.tip === 'COLLECTION' ? <ArrowDownLeft className="size-3" /> : <ArrowUpRight className="size-3" />}
            {row.tip === 'COLLECTION' ? 'Tahsilat' : 'Ödeme'}
          </Badge>
        ),
      },
      {
        field: 'odemeTipi',
        headerName: 'Yöntem',
        width: 88,
        minWidth: 78,
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <Badge variant="outline" className="h-5 rounded-md px-1.5 text-[11px]">
            {paymentMethodIcon(row.odemeTipi)}
            {paymentMethodLabel(row.odemeTipi)}
          </Badge>
        ),
      },
      {
        field: 'source',
        headerName: 'Kasa / Hesap',
        minWidth: 150,
        flex: 1,
        sortable: false,
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <div className="flex min-w-0 items-center gap-1.5">
            <WalletCards className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-xs font-medium text-foreground">{paymentSourceText(row)}</span>
          </div>
        ),
      },
      {
        field: 'tutar',
        headerName: 'Tutar',
        width: 116,
        minWidth: 104,
        align: 'right',
        headerAlign: 'right',
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <div className="flex w-full items-center justify-end gap-1.5">
            {row.tip === 'COLLECTION'
              ? <ArrowDownLeft className="size-3.5 text-[var(--income)]" />
              : <ArrowUpRight className="size-3.5 text-[var(--expense)]" />}
            <span
              className={cn(
                'text-xs font-semibold tabular-nums',
                row.tip === 'COLLECTION' ? 'text-[var(--income)]' : 'text-[var(--expense)]',
              )}
            >
              {formatCurrency(row.tutar)}
            </span>
          </div>
        ),
      },
      {
        field: 'aciklama',
        headerName: 'Açıklama',
        minWidth: 86,
        flex: 0.7,
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <span className="truncate text-xs text-muted-foreground">{row.aciklama || '-'}</span>
        ),
      },
      {
        field: 'audit',
        headerName: '',
        width: 42,
        minWidth: 40,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setAuditRow(row)} aria-label="Denetim bilgisi">
            <Eye className="size-3.5" />
          </Button>
        ),
      },
      {
        field: 'actions',
        headerName: '',
        width: 66,
        minWidth: 62,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }: GridRenderCellParams<Tahsilat>) => (
          <div className="flex items-center justify-center gap-0.5">
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => window.open(`/collection/print/${row.id}`, '_blank')} aria-label="Makbuz yazdır">
              <Printer className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              onClick={() => {
                setSelectedTahsilat(row);
                setOpenDeleteDialog(true);
              }}
              disabled={actionLoading}
              aria-label="Kaydı sil"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [actionLoading],
  );

  return (
    <MainLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 border-b pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Finans</span>
              <span>/</span>
              <span className="text-foreground">Tahsilat & Ödeme</span>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-card shadow-sm">
                <WalletCards className="size-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold">Tahsilat & Ödeme</h1>
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                  Cari nakit akışını, ödeme yöntemlerini ve makbuz hareketlerini tek ekranda yönetin.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => handleOpenDialog('COLLECTION')} disabled={actionLoading}>
              <Plus className="size-4" />
              Tahsilat
            </Button>
            <Button type="button" variant="destructive" onClick={() => handleOpenDialog('PAYMENT')} disabled={actionLoading}>
              <Plus className="size-4" />
              Ödeme
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpenCaprazOdemeDialog(true)} disabled={actionLoading}>
              <Sparkles className="size-4" />
              Çapraz
            </Button>
          </div>
        </div>

        {isLoading ? <div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full w-1/2 animate-pulse rounded-full bg-primary" /></div> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Net Akış"
            value={formatCurrency(Math.abs(netBalance))}
            description={netBalance >= 0 ? 'Dönem tahsilat lehine' : 'Dönem ödeme lehine'}
            icon={<ShieldCheck className="size-4" />}
            tone={netBalance >= 0 ? 'income' : 'expense'}
          />
          <MetricCard
            title="Dönem Tahsilat"
            value={formatCurrency(collectionTotal)}
            description={`${collections.length} kayıt`}
            icon={<ArrowDownLeft className="size-4" />}
            tone="income"
          />
          <MetricCard
            title="Dönem Ödeme"
            value={formatCurrency(paymentTotal)}
            description={`${payments.length} kayıt`}
            icon={<ArrowUpRight className="size-4" />}
            tone="expense"
          />
          <MetricCard
            title="Nakit / Kart"
            value={formatCurrency(stats.cashCollection + stats.creditCardCollection)}
            description={statsFetching ? 'Güncelleniyor' : 'Toplam tahsilat kanalı'}
            icon={<CreditCard className="size-4" />}
            tone="info"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <CardTitle>Finans Akışı</CardTitle>
                    <CardDescription>Seçili tarih aralığındaki tahsilat ve ödeme kayıtları.</CardDescription>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => void refetch()} disabled={tahsilatFetching}>
                      <RefreshCw className={cn('size-4', tahsilatFetching && 'animate-spin')} />
                      Yenile
                    </Button>
                    <Button type="button" variant="outline" onClick={exportCsv} disabled={filteredData.length === 0}>
                      <Download className="size-4" />
                      CSV
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowChart((value) => !value)}>
                      {showChart ? 'Grafiği Gizle' : 'Grafiği Göster'}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="inline-flex w-fit rounded-lg bg-muted p-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={activeTab === 0 ? 'default' : 'ghost'}
                      onClick={() => setActiveTab(0)}
                    >
                      <ArrowDownLeft className="size-4" />
                      Tahsilat
                      <span className="tabular-nums">{collections.length}</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={activeTab === 1 ? 'default' : 'ghost'}
                      onClick={() => setActiveTab(1)}
                    >
                      <ArrowUpRight className="size-4" />
                      Ödeme
                      <span className="tabular-nums">{payments.length}</span>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Cari, tutar veya açıklama ara..."
                        className="w-full pl-8 sm:w-[280px]"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        handleQuickFilter('BU_AY');
                      }}
                    >
                      <Eraser className="size-4" />
                      Temizle
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: 'BUGUN', label: 'Bugün' },
                      { key: 'BU_HAFTA', label: 'Hafta' },
                      { key: 'BU_AY', label: 'Ay' },
                      { key: 'BU_YIL', label: 'Yıl' },
                      { key: 'TUMU', label: 'Tümü' },
                    ].map((filter) => (
                      <Button
                        key={filter.key}
                        type="button"
                        size="sm"
                        variant={quickFilter === filter.key ? 'default' : 'outline'}
                        onClick={() => handleQuickFilter(filter.key)}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[150px_150px_auto]">
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(event) => {
                        setDateRange((current) => ({ ...current, start: event.target.value }));
                        setQuickFilter('');
                      }}
                    />
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(event) => {
                        setDateRange((current) => ({ ...current, end: event.target.value }));
                        setQuickFilter('');
                      }}
                    />
                    <Button type="button" variant="outline" onClick={() => setDenseMode((value) => !value)}>
                      {denseMode ? 'Normal' : 'Kompakt'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            {showChart && chartData.length > 0 ? (
              <div className="border-b p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Akış Trendi</p>
                    <p className="text-xs text-muted-foreground">Son 30 işlem günü dağılımı</p>
                  </div>
                  <Badge variant="outline" className="rounded-md">
                    {formatCurrency(filteredTotal)}
                  </Badge>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="collectionIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--income)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--income)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="collectionExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.22} />
                          <stop offset="95%" stopColor="var(--expense)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                        tickFormatter={(value: number) => `₺${value >= 1000 ? `${Math.round(value / 1000)}k` : value}`}
                        width={56}
                      />
                      <RechartsTooltip
                        formatter={(value: number) => formatCurrency(Number(value))}
                        contentStyle={{
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          background: 'var(--popover)',
                          color: 'var(--popover-foreground)',
                          boxShadow: 'var(--shadow-md)',
                          fontSize: 12,
                        }}
                      />
                      <Area type="monotone" dataKey="tahsilat" name="Tahsilat" stroke="var(--income)" strokeWidth={2} fill="url(#collectionIncome)" dot={false} />
                      <Area type="monotone" dataKey="odeme" name="Ödeme" stroke="var(--expense)" strokeWidth={2} fill="url(#collectionExpense)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted px-4 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-md">{filteredData.length} kayıt</Badge>
                {searchQuery ? <Badge variant="outline" className="rounded-md">"{searchQuery}"</Badge> : null}
                {quickFilter ? <Badge variant="outline" className="rounded-md">{quickFilter}</Badge> : null}
              </div>
              <p className={cn('text-sm font-semibold tabular-nums', activeTab === 0 ? 'text-[var(--income)]' : 'text-[var(--expense)]')}>
                {formatCurrency(filteredTotal)}
              </p>
            </div>

            <CardContent className="p-0">
              <div className="h-[640px]">
                <DataGrid<Tahsilat>
                  rows={filteredData}
                  columns={columns}
                  loading={isLoading || actionLoading}
                  density={denseMode ? 'compact' : 'standard'}
                  disableRowSelectionOnClick
                  localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
                  rowHeight={denseMode ? 38 : 52}
                  columnHeaderHeight={34}
                  pageSizeOptions={[25, 50, 100]}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 25 },
                    },
                  }}
                  slots={{
                    noRowsOverlay: () => <EmptyRowsOverlay activeTab={activeTab} />,
                  }}
	                  sx={{
	                    ...dataGridStyles,
	                    fontSize: '0.75rem',
	                    '& .MuiDataGrid-columnHeaderTitle': {
	                      fontSize: '0.68rem',
	                      fontWeight: 600,
	                      letterSpacing: 0,
	                      textTransform: 'uppercase',
	                      whiteSpace: 'nowrap',
	                    },
	                    '& .MuiDataGrid-cell': {
	                      borderBottom: '1px solid var(--border)',
	                      display: 'flex',
	                      alignItems: 'center',
	                      px: 0.75,
	                      minWidth: 0,
	                    },
	                    '& .MuiDataGrid-columnHeader': {
	                      px: 0.75,
	                    },
	                    '& .MuiDataGrid-virtualScroller': {
	                      overflowX: 'hidden',
	                    },
	                    '& .MuiDataGrid-row:hover': {
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
                <CardTitle>Genel Özet</CardTitle>
                <CardDescription>Tüm dönem tahsilat dengesi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Toplam Tahsilat</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--income)]">{formatCurrency(stats.totalCollection)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Toplam Ödeme</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--expense)]">{formatCurrency(stats.totalPayment)}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-[var(--income-muted)] p-3">
                    <p className="text-lg font-semibold tabular-nums text-[var(--income)]">{collections.length}</p>
                    <p className="text-[11px] text-muted-foreground">Tahsilat</p>
                  </div>
                  <div className="rounded-lg border bg-[var(--expense-muted)] p-3">
                    <p className="text-lg font-semibold tabular-nums text-[var(--expense)]">{payments.length}</p>
                    <p className="text-[11px] text-muted-foreground">Ödeme</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kanal Dağılımı</CardTitle>
                <CardDescription>Nakit ve kart tahsilatları.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Nakit', value: stats.cashCollection, icon: Banknote, tone: 'income' as const },
                  { label: 'Kart', value: stats.creditCardCollection, icon: CreditCard, tone: 'info' as const },
                  { label: 'Bu Ay Tahsilat', value: stats.monthlyCollection, icon: BadgeCheck, tone: 'income' as const },
                  { label: 'Bu Ay Ödeme', value: stats.monthlyPayment, icon: ArrowUpRight, tone: 'expense' as const },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border bg-muted p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg border', toneClass(item.tone))}>
                        <item.icon className="size-4" />
                      </div>
                      <p className="truncate text-sm font-medium">{item.label}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums">{formatCurrency(item.value)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Alert>
              <FileText className="size-4" />
              <AlertTitle>Makbuz Akışı</AlertTitle>
              <AlertDescription>
                Her satırdaki yazdır simgesi seçili hareket için makbuz ekranını yeni sekmede açar.
              </AlertDescription>
            </Alert>
          </aside>
        </div>

        <TahsilatFormDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          initialFormData={initialFormData}
          cariler={cariler}
          kasalar={kasalar}
          bankaHesaplari={bankaHesaplari}
          carilerLoading={carilerLoading}
          bankaHesaplariLoading={bankaHesaplariLoading}
          kasalarLoading={kasalarLoading}
          submitting={actionLoading}
          formatMoney={formatCurrency}
        />

        <CaprazOdemeDialog
          open={openCaprazOdemeDialog}
          onClose={() => setOpenCaprazOdemeDialog(false)}
          onSubmit={handleCaprazOdeme}
          formData={caprazOdemeFormData}
          setFormData={setCaprazOdemeFormData}
          cariler={cariler}
          loading={carilerLoading}
          submitting={actionLoading}
          carilerError={false}
        />

        <Dialog open={openDeleteDialog} onOpenChange={(open) => { if (!open) setOpenDeleteDialog(false); }}>
          <DialogContent style={{ width: 'min(100% - 2rem, 500px)', height: 'auto' }}>
            <DialogHeader className="border-b px-5 py-4">
              <DialogTitle>Kaydı Sil</DialogTitle>
              <DialogDescription>
                {selectedTahsilat?.cari?.unvan ?? 'Seçili kayıt'} için işlem onayı.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-5 py-4">
              <Alert variant="destructive">
                <Trash2 className="size-4" />
                <AlertTitle>Bu işlem geri alınamaz</AlertTitle>
                <AlertDescription>
                  {formatCurrency(selectedTahsilat?.tutar ?? 0)} tutarındaki {selectedTahsilat?.tip === 'COLLECTION' ? 'tahsilat' : 'ödeme'} kaydı silinecek.
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">
                Cari ve kasa bakiyeleri backend tarafından yeniden dengelenecek.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDeleteDialog(false)} disabled={actionLoading}>Vazgeç</Button>
              <Button type="button" variant="destructive" onClick={() => void handleDelete()} disabled={actionLoading}>
                {actionLoading ? 'Siliniyor' : 'Sil'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(auditRow)} onOpenChange={(open) => { if (!open) setAuditRow(null); }}>
          <DialogContent style={{ width: 'min(100% - 2rem, 420px)', height: 'auto' }}>
            <DialogHeader className="border-b px-5 py-4">
              <DialogTitle>Denetim Bilgileri</DialogTitle>
              <DialogDescription>{auditRow?.cari?.unvan ?? 'Kayıt detayı'}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Oluşturma</span>
                <span className="font-medium tabular-nums">{formatDateTime(auditRow?.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Güncelleme</span>
                <span className="font-medium tabular-nums">{formatDateTime(auditRow?.updatedAt)}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {snackbar.open ? (
          <div className="fixed bottom-5 right-5 z-50 w-[min(420px,calc(100vw-2rem))]">
            <Alert variant={snackbar.severity === 'error' ? 'destructive' : 'default'} className="shadow-lg">
              <BadgeCheck className="size-4" />
              <AlertTitle>{snackbar.severity === 'error' ? 'İşlem başarısız' : 'İşlem bilgisi'}</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-3">
                <span>{snackbar.message}</span>
                <button type="button" className="text-xs font-medium text-foreground" onClick={() => setSnackbar((current) => ({ ...current, open: false }))}>
                  Kapat
                </button>
              </AlertDescription>
            </Alert>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}
