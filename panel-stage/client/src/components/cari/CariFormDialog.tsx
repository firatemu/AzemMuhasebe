'use client';

import React, { useCallback, useRef, useState, type ReactNode } from 'react';
import {
  BadgeCheck,
  Building2,
  CreditCard,
  FileText,
  Landmark,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cities } from '@/lib/cities';
import {
  AKTIF_SELECT_VALUE,
  EMPTY_SELECT_VALUE,
  PASIF_SELECT_VALUE,
  aktifSelectValueToBoolean,
  booleanToAktifSelectValue,
  enumSelectLabel,
  fromOptionalSelectValue,
  optionalSelectLabel,
  toOptionalSelectValue,
} from '@/lib/select-utils';
import { cn } from '@/lib/utils';

import type { CariAdres, CariBanka, CariFormData, CariYetkili } from './types';

const SECTIONS = [
  { id: 'section-genel', label: 'Genel', icon: BadgeCheck },
  { id: 'section-finans', label: 'Finans & Risk', icon: Wallet },
  { id: 'section-iletisim', label: 'İletişim', icon: Phone },
  { id: 'section-adres', label: 'Adresler', icon: MapPin },
  { id: 'section-banka', label: 'Banka', icon: Landmark },
  { id: 'section-diger', label: 'Diğer', icon: FileText },
] as const;

const TIP_LABELS: Record<string, string> = {
  MUSTERI: 'Müşteri',
  TEDARIKCI: 'Tedarikçi',
  HER_IKISI: 'Her İkisi',
};

const RISK_LABELS: Record<string, string> = {
  NORMAL: 'Normal',
  RISKLI: 'Riskli',
  BLOKELI: 'Blokeli',
  TAKIPTE: 'Hukuki Takipte',
};

const SIRKET_TIP_LABELS: Record<string, string> = {
  KURUMSAL: 'Kurumsal (Ltd, A.Ş)',
  SAHIS: 'Şahıs Şirketi / Bireysel',
};

const AKTIF_LABELS: Record<string, string> = {
  [AKTIF_SELECT_VALUE]: 'Aktif',
  [PASIF_SELECT_VALUE]: 'Pasif',
};

const PARA_BIRIMI_LABELS: Record<string, string> = {
  TRY: 'Türk Lirası',
  USD: 'Amerikan Doları',
  EUR: 'Euro',
};

const ADRES_TIP_LABELS: Record<string, string> = {
  FATURA: 'Fatura',
  SEVK: 'Sevk',
  DIGER: 'Diğer',
};

function FieldShell({
  label,
  required,
  hint,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0 space-y-1.5', className)}>
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-[11px] font-medium text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Panel({
  id,
  title,
  icon,
  children,
  className,
}: {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-4 rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex size-9 items-center justify-center rounded-lg border shadow-sm"
          style={{
            background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
            color: 'var(--primary)',
            borderColor: 'color-mix(in srgb, var(--primary) 15%, transparent)',
          }}
        >
          {icon}
        </div>
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export interface CariFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  formData: CariFormData;
  availableDistricts: string[];
  satisElemanlari: Array<{ id: string; fullName?: string; adSoyad?: string; username?: string }>;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: keyof CariFormData | string, value: unknown) => void;
  onCityChange: (city: string) => void;
}

export default function CariFormDialog({
  open,
  mode,
  formData,
  availableDistricts,
  satisElemanlari,
  isSaving,
  onClose,
  onSubmit,
  onChange,
  onCityChange,
}: CariFormDialogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    scrollRef.current?.querySelector<HTMLElement>(`#${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const initials = (formData.unvan || 'YC')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase();

  const canSubmit = Boolean(formData.unvan?.trim());
  const yetkililer = formData.yetkililer || [];
  const ekAdresler = formData.ekAdresler || [];
  const bankalar = formData.tedarikciBankalar || [];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  return (
    <Dialog open={open} modal="trap-focus" onOpenChange={(nextOpen) => (!nextOpen ? onClose() : undefined)}>
      <DialogContent
        showCloseButton={false}
        panelClassName="max-w-none w-full"
        panelStyle={{
          width: 'min(calc(100vw - 2rem), 1080px)',
          height: 'min(92dvh, 820px)',
        }}
      >
        <form className="flex h-full min-h-0 flex-col" onSubmit={handleSubmit}>
          <DialogHeader className="shrink-0 border-b bg-muted/60 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                    color: '#fff',
                  }}
                >
                  {mode === 'create' ? <UserPlus className="size-[22px]" /> : <Building2 className="size-[22px]" />}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <DialogTitle className="text-lg font-bold tracking-tight">
                    {mode === 'create' ? 'Yeni Cari Ekle' : 'Cari Düzenle'}
                  </DialogTitle>
                  <DialogDescription className="truncate text-xs font-medium text-muted-foreground">
                    {formData.unvan
                      ? `${formData.unvan} kaydını düzenliyorsunuz`
                      : 'Müşteri veya tedarikçi cari kartını eksiksiz tanımlayın.'}
                  </DialogDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="size-8 rounded-md p-0 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                onClick={onClose}
                aria-label="Kapat"
              >
                <X className="size-[18px]" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[280px_1fr]">
            <aside className="hidden shrink-0 overflow-y-auto border-r bg-muted/40 p-5 lg:flex lg:flex-col lg:gap-4">
              <div
                className="rounded-xl border bg-card p-4 shadow-sm"
                style={{
                  background:
                    'linear-gradient(145deg, color-mix(in srgb, var(--primary) 6%, var(--card)) 0%, var(--card) 55%)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold tracking-tight text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{formData.unvan || 'Yeni Cari'}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {TIP_LABELS[formData.tip] || 'Cari'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {formData.cariKodu || 'OTOMATİK KOD'}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {formData.sirketTipi === 'SAHIS' ? 'Şahıs' : 'Kurumsal'}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px]"
                    style={{
                      color: formData.aktif ? 'var(--income)' : 'var(--muted-foreground)',
                      borderColor: formData.aktif
                        ? 'color-mix(in srgb, var(--income) 35%, transparent)'
                        : undefined,
                    }}
                  >
                    {formData.aktif ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-4 text-primary" />
                  <p className="text-xs font-bold uppercase tracking-wider">Finans Özeti</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-muted-foreground">Risk Limiti</span>
                    <span className="tabular-nums font-semibold">{formatMoney(Number(formData.riskLimiti || 0))} ₺</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-muted-foreground">Vade Günü</span>
                    <span className="font-semibold">{formData.vadeGun ?? 0} gün</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-muted-foreground">Risk Durumu</span>
                    <span className="font-semibold">{RISK_LABELS[formData.riskDurumu] || 'Normal'}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-muted-foreground">Para Birimi</span>
                    <span className="font-semibold">{PARA_BIRIMI_LABELS[formData.paraBirimi || 'TRY'] || formData.paraBirimi || 'Türk Lirası'}</span>
                  </div>
                </div>
              </div>

              <nav className="rounded-xl border bg-card p-2 shadow-sm">
                <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Bölümler
                </p>
                <div className="space-y-0.5">
                  {SECTIONS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => scrollToSection(id)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-all',
                        activeSection === id
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </nav>

              <div className="rounded-xl border bg-card p-4 shadow-sm space-y-2 text-xs">
                <p className="font-bold uppercase tracking-wider text-muted-foreground">İlişkiler</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Yetkili</span>
                  <span className="font-semibold">{yetkililer.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ek Adres</span>
                  <span className="font-semibold">{ekAdresler.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Banka Hesabı</span>
                  <span className="font-semibold">{bankalar.length}</span>
                </div>
              </div>
            </aside>

            <div ref={scrollRef} className="min-h-0 overflow-y-auto bg-background p-5 md:p-6 space-y-5">
              <Panel id="section-genel" title="Genel Bilgiler" icon={<BadgeCheck className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell
                    label="Cari Kodu"
                    hint={formData.cariKodu ? 'Önerilen kod' : 'Boş bırakılırsa otomatik üretilir'}
                  >
                    <Input
                      value={formData.cariKodu}
                      onChange={(e) => onChange('cariKodu', e.target.value)}
                      className="h-9 font-mono"
                      placeholder="Otomatik"
                    />
                  </FieldShell>
                  <FieldShell label="Cari Tipi">
                    <Select value={formData.tip} onValueChange={(v) => onChange('tip', v ?? 'MUSTERI')}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue>{enumSelectLabel(formData.tip, TIP_LABELS)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MUSTERI">Müşteri</SelectItem>
                        <SelectItem value="TEDARIKCI">Tedarikçi</SelectItem>
                        <SelectItem value="HER_IKISI">Her İkisi</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  <FieldShell label="Durum">
                    <Select
                      value={booleanToAktifSelectValue(Boolean(formData.aktif))}
                      onValueChange={(v) => onChange('aktif', aktifSelectValueToBoolean(v))}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue>
                          {enumSelectLabel(booleanToAktifSelectValue(Boolean(formData.aktif)), AKTIF_LABELS)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AKTIF_SELECT_VALUE}>Aktif</SelectItem>
                        <SelectItem value={PASIF_SELECT_VALUE}>Pasif</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  <FieldShell label="Sorumlu Satış Elemanı">
                    <Select
                      value={toOptionalSelectValue(formData.satisElemaniId)}
                      onValueChange={(v) => onChange('satisElemaniId', fromOptionalSelectValue(v))}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Seçiniz">
                          {optionalSelectLabel(toOptionalSelectValue(formData.satisElemaniId), {
                            emptyLabel: 'Seçilmedi',
                            resolveLabel: (id) => {
                              const se = satisElemanlari.find((s) => s.id === id);
                              return se?.fullName || se?.adSoyad || se?.username;
                            },
                          })}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>Seçilmedi</SelectItem>
                        {satisElemanlari.map((se) => (
                          <SelectItem key={se.id} value={se.id}>
                            {se.fullName || se.adSoyad || se.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  <FieldShell label="Cari Ünvanı" required className="md:col-span-2">
                    <Input
                      value={formData.unvan}
                      onChange={(e) => onChange('unvan', e.target.value)}
                      className="h-9"
                      placeholder="Resmi ünvan veya işletme adı"
                      required
                    />
                  </FieldShell>
                  <FieldShell label="Şirket Tipi" className="md:col-span-2">
                    <Select value={formData.sirketTipi} onValueChange={(v) => onChange('sirketTipi', v ?? 'KURUMSAL')}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue>{enumSelectLabel(formData.sirketTipi, SIRKET_TIP_LABELS)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KURUMSAL">Kurumsal (Ltd, A.Ş)</SelectItem>
                        <SelectItem value="SAHIS">Şahıs Şirketi / Bireysel</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  {formData.sirketTipi === 'KURUMSAL' ? (
                    <>
                      <FieldShell label="Vergi No">
                        <Input
                          value={formData.vergiNo || ''}
                          onChange={(e) => onChange('vergiNo', e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="h-9"
                          inputMode="numeric"
                        />
                      </FieldShell>
                      <FieldShell label="Vergi Dairesi">
                        <Input
                          value={formData.vergiDairesi || ''}
                          onChange={(e) => onChange('vergiDairesi', e.target.value)}
                          className="h-9"
                        />
                      </FieldShell>
                    </>
                  ) : (
                    <>
                      <Alert className="md:col-span-2 border-primary/20 bg-primary/5">
                        <AlertDescription className="text-xs">
                          Şahıs işletmeleri için TC Kimlik No zorunludur.
                        </AlertDescription>
                      </Alert>
                      <FieldShell label="TC Kimlik No">
                        <Input
                          value={formData.tcKimlikNo || ''}
                          onChange={(e) => onChange('tcKimlikNo', e.target.value.replace(/\D/g, '').slice(0, 11))}
                          className="h-9"
                          inputMode="numeric"
                        />
                      </FieldShell>
                      <FieldShell label="Ad Soyad">
                        <Input
                          value={formData.isimSoyisim || ''}
                          onChange={(e) => onChange('isimSoyisim', e.target.value)}
                          className="h-9"
                        />
                      </FieldShell>
                    </>
                  )}
                </div>
              </Panel>

              <Panel id="section-finans" title="Finansal & Risk" icon={<Wallet className="size-4" />}>
                <div
                  className="mb-4 grid grid-cols-1 gap-3 rounded-xl border p-3 sm:grid-cols-3"
                  style={{
                    background: 'color-mix(in srgb, var(--primary) 5%, var(--card))',
                    borderColor: 'color-mix(in srgb, var(--primary) 18%, transparent)',
                  }}
                >
                  <div className="text-xs">
                    <p className="font-bold uppercase tracking-wide text-muted-foreground">Risk Limiti</p>
                    <p className="tabular-nums text-sm font-extrabold">{formatMoney(Number(formData.riskLimiti || 0))} ₺</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-bold uppercase tracking-wide text-muted-foreground">Teminat</p>
                    <p className="tabular-nums text-sm font-extrabold">{formatMoney(Number(formData.teminatTutar || 0))} ₺</p>
                  </div>
                  <div className="text-xs">
                    <p className="font-bold uppercase tracking-wide text-muted-foreground">Vade</p>
                    <p className="text-sm font-extrabold">{formData.vadeGun ?? 0} gün</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell label="Risk Durumu">
                    <Select
                      value={formData.riskDurumu || 'NORMAL'}
                      onValueChange={(v) => onChange('riskDurumu', v ?? 'NORMAL')}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue>{enumSelectLabel(formData.riskDurumu || 'NORMAL', RISK_LABELS)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="RISKLI">Riskli</SelectItem>
                        <SelectItem value="BLOKELI">Blokeli</SelectItem>
                        <SelectItem value="TAKIPTE">Hukuki Takipte</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  <FieldShell label="Risk Limiti (TL)">
                    <Input
                      type="number"
                      min={0}
                      value={formData.riskLimiti ?? 0}
                      onChange={(e) => onChange('riskLimiti', Number(e.target.value))}
                      className="h-9 tabular-nums"
                    />
                  </FieldShell>
                  <FieldShell label="Teminat Tutarı (TL)">
                    <Input
                      type="number"
                      min={0}
                      value={formData.teminatTutar ?? 0}
                      onChange={(e) => onChange('teminatTutar', Number(e.target.value))}
                      className="h-9 tabular-nums"
                    />
                  </FieldShell>
                  <FieldShell label="Para Birimi">
                    <Select value={formData.paraBirimi || 'TRY'} onValueChange={(v) => onChange('paraBirimi', v ?? 'TRY')}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue>{enumSelectLabel(formData.paraBirimi || 'TRY', PARA_BIRIMI_LABELS)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRY">Türk Lirası</SelectItem>
                        <SelectItem value="USD">Amerikan Doları</SelectItem>
                        <SelectItem value="EUR">Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  <FieldShell label="Vade Günü" hint="Faturalar için otomatik vade hesaplaması">
                    <Input
                      type="number"
                      min={0}
                      value={formData.vadeGun ?? 0}
                      onChange={(e) => onChange('vadeGun', Number(e.target.value))}
                      className="h-9 tabular-nums"
                    />
                  </FieldShell>
                  <FieldShell label="Fiyat Grubu">
                    <Input
                      value={formData.fiyatGrubu || ''}
                      onChange={(e) => onChange('fiyatGrubu', e.target.value)}
                      className="h-9"
                      placeholder="Örn: Toptan, Perakende"
                    />
                  </FieldShell>
                  <FieldShell label="Risk Aşımında İşlem Durdur" className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.riskDurdurma)}
                        onChange={(e) => onChange('riskDurdurma', e.target.checked)}
                        className="size-4 rounded border-input"
                      />
                      Risk limiti aşıldığında yeni işlem engellensin
                    </label>
                  </FieldShell>
                  <FieldShell label="Banka Notları / Ödeme Açıklamaları" className="md:col-span-2">
                    <Textarea
                      value={formData.bankaBilgileri || ''}
                      onChange={(e) => onChange('bankaBilgileri', e.target.value)}
                      rows={3}
                      className="min-h-[80px] resize-none"
                      placeholder="Ödeme planları ve fatura altı açıklamalar için referans not..."
                    />
                  </FieldShell>
                </div>
              </Panel>

              <Panel id="section-iletisim" title="İletişim & Yetkililer" icon={<Phone className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell label="Yetkili Kişi (Ana)">
                    <Input value={formData.yetkili || ''} onChange={(e) => onChange('yetkili', e.target.value)} className="h-9" />
                  </FieldShell>
                  <FieldShell label="Telefon">
                    <Input value={formData.telefon || ''} onChange={(e) => onChange('telefon', e.target.value)} className="h-9" />
                  </FieldShell>
                  <FieldShell label="E-posta">
                    <Input type="email" value={formData.email || ''} onChange={(e) => onChange('email', e.target.value)} className="h-9" />
                  </FieldShell>
                  <FieldShell label="Web Sitesi">
                    <Input value={formData.webSite || ''} onChange={(e) => onChange('webSite', e.target.value)} className="h-9" />
                  </FieldShell>
                  <FieldShell label="Faks">
                    <Input value={formData.faks || ''} onChange={(e) => onChange('faks', e.target.value)} className="h-9" />
                  </FieldShell>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm font-bold text-primary">Ek Yetkililer</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() =>
                      onChange('yetkililer', [
                        ...yetkililer,
                        { adSoyad: '', unvan: '', telefon: '', email: '', dahili: '', varsayilan: false, notlar: '' } satisfies CariYetkili,
                      ])
                    }
                  >
                    <Plus className="size-3.5" /> Kişi Ekle
                  </Button>
                </div>
                {yetkililer.length === 0 ? (
                  <p className="mt-3 rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                    Henüz ek yetkili eklenmemiş.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {yetkililer.map((y, index) => (
                      <div key={index} className="relative rounded-xl border bg-muted/20 p-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-2 top-2 text-destructive"
                          onClick={() => onChange('yetkililer', yetkililer.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                          <Users className="size-3.5" /> Kişi #{index + 1}
                        </p>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Input placeholder="Ad Soyad" value={y.adSoyad} onChange={(e) => {
                            const next = [...yetkililer]; next[index] = { ...y, adSoyad: e.target.value }; onChange('yetkililer', next);
                          }} className="h-9" />
                          <Input placeholder="Ünvan" value={y.unvan} onChange={(e) => {
                            const next = [...yetkililer]; next[index] = { ...y, unvan: e.target.value }; onChange('yetkililer', next);
                          }} className="h-9" />
                          <Input placeholder="Telefon" value={y.telefon} onChange={(e) => {
                            const next = [...yetkililer]; next[index] = { ...y, telefon: e.target.value }; onChange('yetkililer', next);
                          }} className="h-9" />
                          <Input placeholder="E-posta" value={y.email} onChange={(e) => {
                            const next = [...yetkililer]; next[index] = { ...y, email: e.target.value }; onChange('yetkililer', next);
                          }} className="h-9" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel id="section-adres" title="Adres Bilgileri" icon={<MapPin className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell label="İl">
                    <Select value={formData.il || 'İstanbul'} onValueChange={(v) => onCityChange(v ?? 'İstanbul')}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue>{formData.il || 'İstanbul'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  <FieldShell label="İlçe">
                    <Select
                      value={formData.ilce || availableDistricts[0] || ''}
                      onValueChange={(v) => onChange('ilce', v ?? '')}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue>{formData.ilce || availableDistricts[0] || 'Seçiniz'}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {availableDistricts.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  <FieldShell label="Merkez Adres" className="md:col-span-2">
                    <Textarea
                      value={formData.adres || ''}
                      onChange={(e) => onChange('adres', e.target.value)}
                      rows={2}
                      className="min-h-[72px] resize-none"
                    />
                  </FieldShell>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm font-bold text-primary">Ek Adresler</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() =>
                      onChange('ekAdresler', [
                        ...ekAdresler,
                        { baslik: '', tip: 'SEVK', adres: '', il: 'İstanbul', ilce: 'Merkez', postaKodu: '', varsayilan: false } satisfies CariAdres,
                      ])
                    }
                  >
                    <Plus className="size-3.5" /> Adres Ekle
                  </Button>
                </div>
                {ekAdresler.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {ekAdresler.map((a, index) => (
                      <div key={index} className="relative rounded-xl border bg-muted/20 p-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-2 top-2 text-destructive"
                          onClick={() => onChange('ekAdresler', ekAdresler.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Select value={a.tip} onValueChange={(v) => {
                            const next = [...ekAdresler]; next[index] = { ...a, tip: (v as CariAdres['tip']) || 'SEVK' }; onChange('ekAdresler', next);
                          }}>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue>{enumSelectLabel(a.tip, ADRES_TIP_LABELS)}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FATURA">Fatura</SelectItem>
                              <SelectItem value="SEVK">Sevk</SelectItem>
                              <SelectItem value="DIGER">Diğer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input placeholder="Posta Kodu" value={a.postaKodu} onChange={(e) => {
                            const next = [...ekAdresler]; next[index] = { ...a, postaKodu: e.target.value }; onChange('ekAdresler', next);
                          }} className="h-9" />
                          <Input placeholder="İl" value={a.il} onChange={(e) => {
                            const next = [...ekAdresler]; next[index] = { ...a, il: e.target.value }; onChange('ekAdresler', next);
                          }} className="h-9" />
                          <Input placeholder="İlçe" value={a.ilce} onChange={(e) => {
                            const next = [...ekAdresler]; next[index] = { ...a, ilce: e.target.value }; onChange('ekAdresler', next);
                          }} className="h-9" />
                          <Textarea placeholder="Tam adres" value={a.adres} onChange={(e) => {
                            const next = [...ekAdresler]; next[index] = { ...a, adres: e.target.value }; onChange('ekAdresler', next);
                          }} rows={2} className="md:col-span-2 min-h-[60px] resize-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Panel>

              <Panel id="section-banka" title="Banka Hesapları" icon={<Landmark className="size-4" />}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Tedarikçi / cari banka hesap bilgileri</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() =>
                      onChange('tedarikciBankalar', [
                        ...bankalar,
                        { bankaAdi: '', subeAdi: '', subeKodu: '', hesapNo: '', iban: '', paraBirimi: 'TRY', aciklama: '' } satisfies CariBanka,
                      ])
                    }
                  >
                    <Plus className="size-3.5" /> Banka Ekle
                  </Button>
                </div>
                {bankalar.length === 0 ? (
                  <p className="mt-3 rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
                    Henüz banka hesabı eklenmemiş.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {bankalar.map((b, index) => (
                      <div key={index} className="relative rounded-xl border bg-muted/20 p-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute right-2 top-2 text-destructive"
                          onClick={() => onChange('tedarikciBankalar', bankalar.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <Input placeholder="Banka Adı" value={b.bankaAdi} onChange={(e) => {
                            const next = [...bankalar]; next[index] = { ...b, bankaAdi: e.target.value }; onChange('tedarikciBankalar', next);
                          }} className="h-9" />
                          <Input placeholder="IBAN" value={b.iban} onChange={(e) => {
                            const next = [...bankalar]; next[index] = { ...b, iban: e.target.value.toUpperCase() }; onChange('tedarikciBankalar', next);
                          }} className="h-9 font-mono uppercase" />
                          <Input placeholder="Şube" value={b.subeAdi} onChange={(e) => {
                            const next = [...bankalar]; next[index] = { ...b, subeAdi: e.target.value }; onChange('tedarikciBankalar', next);
                          }} className="h-9" />
                          <Input placeholder="Hesap No" value={b.hesapNo} onChange={(e) => {
                            const next = [...bankalar]; next[index] = { ...b, hesapNo: e.target.value }; onChange('tedarikciBankalar', next);
                          }} className="h-9" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel id="section-diger" title="Gruplama & E-Dönüşüm" icon={<FileText className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell label="Sektör">
                    <Input value={formData.sektor || ''} onChange={(e) => onChange('sektor', e.target.value)} className="h-9" placeholder="Örn: Teknoloji" />
                  </FieldShell>
                  <FieldShell label="Özel Kod 1">
                    <Input value={formData.ozelKod1 || ''} onChange={(e) => onChange('ozelKod1', e.target.value)} className="h-9" />
                  </FieldShell>
                  <FieldShell label="Özel Kod 2">
                    <Input value={formData.ozelKod2 || ''} onChange={(e) => onChange('ozelKod2', e.target.value)} className="h-9" />
                  </FieldShell>
                  <FieldShell label="E-Fatura Posta Kutusu">
                    <Input
                      value={formData.efaturaPostaKutusu || ''}
                      onChange={(e) => onChange('efaturaPostaKutusu', e.target.value)}
                      className="h-9 font-mono text-xs"
                      placeholder="urn:mail:..."
                    />
                  </FieldShell>
                  <FieldShell label="Gönderici Birim Etiketi">
                    <Input
                      value={formData.efaturaGondericiBirim || ''}
                      onChange={(e) => onChange('efaturaGondericiBirim', e.target.value)}
                      className="h-9"
                    />
                  </FieldShell>
                </div>
              </Panel>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t bg-muted/40 px-6 py-4">
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden text-xs text-muted-foreground sm:block">
                <MapPin className="mr-1 inline size-3.5" />
                Zorunlu alan: Cari ünvanı
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSaving} className="h-9 px-5">
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving || !canSubmit}
                  className="h-9 px-6 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
                >
                  {isSaving ? (
                    <span className="flex items-center gap-1.5">
                      <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Kaydediliyor...
                    </span>
                  ) : mode === 'create' ? (
                    'Cariyi Kaydet'
                  ) : (
                    'Değişiklikleri Kaydet'
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
