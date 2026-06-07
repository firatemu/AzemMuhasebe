'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  MapPin,
  Phone,
  User,
  UserPlus,
  Wallet,
  X,
} from 'lucide-react';

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
import {
  EMPTY_SELECT_VALUE,
  fromOptionalSelectValue,
  optionalSelectLabel,
  toOptionalSelectValue,
} from '@/lib/select-utils';
import { cn } from '@/lib/utils';

export interface PersonelFormValues {
  personelKodu: string;
  tcKimlikNo: string;
  ad: string;
  soyad: string;
  dogumTarihi: string;
  cinsiyet: string;
  medeniDurum: string;
  telefon: string;
  email: string;
  adres: string;
  il: string;
  ilce: string;
  pozisyon: string;
  departman: string;
  iseBaslamaTarihi: string;
  istenCikisTarihi: string;
  maas: string;
  prim: string;
  maasGunu: string;
  sgkNo: string;
  ibanNo: string;
  aciklama: string;
  aktif: boolean;
}

const defaultFormValues: PersonelFormValues = {
  personelKodu: '',
  tcKimlikNo: '',
  ad: '',
  soyad: '',
  dogumTarihi: '',
  cinsiyet: 'BELIRTILMEMIS',
  medeniDurum: '',
  telefon: '',
  email: '',
  adres: '',
  il: '',
  ilce: '',
  pozisyon: '',
  departman: '',
  iseBaslamaTarihi: new Date().toISOString().split('T')[0],
  istenCikisTarihi: '',
  maas: '',
  prim: '',
  maasGunu: '',
  sgkNo: '',
  ibanNo: '',
  aciklama: '',
  aktif: true,
};

function buildFormValues(personel: Partial<PersonelFormValues> | null | undefined): PersonelFormValues {
  if (!personel) return { ...defaultFormValues };

  return {
    personelKodu: personel.personelKodu || '',
    tcKimlikNo: personel.tcKimlikNo || '',
    ad: personel.ad || '',
    soyad: personel.soyad || '',
    dogumTarihi: personel.dogumTarihi ? personel.dogumTarihi.split('T')[0] : '',
    cinsiyet: personel.cinsiyet || 'BELIRTILMEMIS',
    medeniDurum: personel.medeniDurum || '',
    telefon: personel.telefon || '',
    email: personel.email || '',
    adres: personel.adres || '',
    il: personel.il || '',
    ilce: personel.ilce || '',
    pozisyon: personel.pozisyon || '',
    departman: personel.departman || '',
    iseBaslamaTarihi: personel.iseBaslamaTarihi
      ? personel.iseBaslamaTarihi.split('T')[0]
      : new Date().toISOString().split('T')[0],
    istenCikisTarihi: personel.istenCikisTarihi ? personel.istenCikisTarihi.split('T')[0] : '',
    maas: personel.maas?.toString() || '',
    prim: personel.prim?.toString() || '',
    maasGunu: personel.maasGunu?.toString() || '',
    sgkNo: personel.sgkNo || '',
    ibanNo: personel.ibanNo || '',
    aciklama: personel.aciklama || '',
    aktif: personel.aktif ?? true,
  };
}

function prepareSubmitData(formData: PersonelFormValues) {
  return {
    ...formData,
    personelKodu: formData.personelKodu?.trim() ? formData.personelKodu : undefined,
    tcKimlikNo: formData.tcKimlikNo?.trim() ? formData.tcKimlikNo : undefined,
    telefon: formData.telefon?.trim() ? formData.telefon : undefined,
    email: formData.email?.trim() ? formData.email : undefined,
    adres: formData.adres?.trim() ? formData.adres : undefined,
    il: formData.il?.trim() ? formData.il : undefined,
    ilce: formData.ilce?.trim() ? formData.ilce : undefined,
    pozisyon: formData.pozisyon?.trim() ? formData.pozisyon : undefined,
    departman: formData.departman?.trim() ? formData.departman : undefined,
    sgkNo: formData.sgkNo?.trim() ? formData.sgkNo : undefined,
    ibanNo: formData.ibanNo?.trim() ? formData.ibanNo : undefined,
    aciklama: formData.aciklama?.trim() ? formData.aciklama : undefined,
    maas: formData.maas?.trim() ? parseFloat(formData.maas) : undefined,
    prim: formData.prim?.trim() ? parseFloat(formData.prim) : undefined,
    maasGunu: formData.maasGunu?.trim() ? parseInt(formData.maasGunu, 10) : undefined,
    dogumTarihi: formData.dogumTarihi || undefined,
    iseBaslamaTarihi: formData.iseBaslamaTarihi || undefined,
    istenCikisTarihi: formData.istenCikisTarihi || undefined,
    cinsiyet: formData.cinsiyet && formData.cinsiyet !== 'BELIRTILMEMIS' ? formData.cinsiyet : undefined,
    medeniDurum: formData.medeniDurum || undefined,
  };
}

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

const SECTIONS = [
  { id: 'section-kimlik', label: 'Kimlik', icon: BadgeCheck },
  { id: 'section-iletisim', label: 'İletişim', icon: Phone },
  { id: 'section-is', label: 'İş Bilgileri', icon: Briefcase },
  { id: 'section-finans', label: 'Finansal', icon: Wallet },
  { id: 'section-notlar', label: 'Notlar', icon: FileText },
] as const;

function formatMoney(value: number) {
  return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function salaryDayLabel(value: string) {
  if (!value) return 'Belirtilmedi';
  if (value === '0') return 'Ay Sonu';
  return `Her Ayın ${value}. Günü`;
}

interface PersonelFormDialogProps {
  open: boolean;
  personel: Partial<PersonelFormValues> & { id?: string } | null;
  departmanlar?: string[];
  onSave: (data: ReturnType<typeof prepareSubmitData>) => void;
  onClose: () => void;
}

export default function PersonelFormDialog({
  open,
  personel,
  departmanlar = [],
  onSave,
  onClose,
}: PersonelFormDialogProps) {
  const isEdit = !!personel?.id;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const [formData, setFormData] = useState<PersonelFormValues>(() => buildFormValues(personel));

  useEffect(() => {
    if (open) {
      setFormData(buildFormValues(personel));
      setActiveSection(SECTIONS[0].id);
    }
  }, [open, personel]);

  const handleChange = useCallback((field: keyof PersonelFormValues, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.ad.trim() || !formData.soyad.trim()) return;
    onSave(prepareSubmitData(formData));
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const container = scrollRef.current;
    const target = container?.querySelector<HTMLElement>(`#${sectionId}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fullName = [formData.ad, formData.soyad].filter(Boolean).join(' ').trim();
  const initials = `${formData.ad.charAt(0) || '?'}${formData.soyad.charAt(0) || ''}`.toUpperCase();
  const salary = Number(formData.maas || 0);
  const bonus = Number(formData.prim || 0);
  const totalComp = salary + bonus;

  const uniqueDepartmanlar = useMemo(() => {
    const merged = [...departmanlar];
    if (formData.departman && !merged.includes(formData.departman)) {
      merged.unshift(formData.departman);
    }
    return merged.filter(Boolean);
  }, [departmanlar, formData.departman]);

  const canSubmit = formData.ad.trim().length > 0 && formData.soyad.trim().length > 0;

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
                  {isEdit ? <User className="size-[22px]" /> : <UserPlus className="size-[22px]" />}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <DialogTitle className="text-lg font-bold tracking-tight">
                    {isEdit ? 'Personel Düzenle' : 'Yeni Personel Ekle'}
                  </DialogTitle>
                  <DialogDescription className="truncate text-xs font-medium text-muted-foreground">
                    {fullName
                      ? `${fullName} kaydını düzenliyorsunuz`
                      : 'Personel kimlik, iş ve finansal bilgilerini eksiksiz tanımlayın.'}
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
                  background: 'linear-gradient(145deg, color-mix(in srgb, var(--primary) 6%, var(--card)) 0%, var(--card) 55%)',
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
                    <p className="truncate text-sm font-bold">{fullName || 'Yeni Personel'}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formData.pozisyon || 'Pozisyon belirtilmedi'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {formData.personelKodu || 'OTOMATİK KOD'}
                  </Badge>
                  {formData.departman ? (
                    <Badge variant="secondary" className="text-[10px]">
                      {formData.departman}
                    </Badge>
                  ) : null}
                  <Badge
                    variant="outline"
                    className="text-[10px]"
                    style={{
                      color: formData.aktif ? 'var(--income)' : 'var(--muted-foreground)',
                      borderColor: formData.aktif ? 'color-mix(in srgb, var(--income) 35%, transparent)' : undefined,
                    }}
                  >
                    {formData.aktif ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Wallet className="size-4" style={{ color: 'var(--primary)' }} />
                  <p className="text-xs font-bold uppercase tracking-wider">Ücret Özeti</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground font-medium">Brüt Maaş</span>
                    <span className="tabular-nums font-semibold">{formatMoney(salary)} ₺</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground font-medium">Aylık Prim</span>
                    <span className="tabular-nums font-semibold">{formatMoney(bonus)} ₺</span>
                  </div>
                  <Separator />
                  <div
                    className="flex items-center justify-between rounded-lg border px-2.5 py-2 font-bold"
                    style={{
                      background: 'color-mix(in srgb, var(--primary) 8%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)',
                      color: 'var(--primary)',
                    }}
                  >
                    <span className="text-[11px] uppercase tracking-wide">Toplam</span>
                    <span className="tabular-nums text-sm">{formatMoney(totalComp)} ₺</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-muted-foreground font-medium">Ödeme Günü</span>
                    <span className="font-semibold">{salaryDayLabel(formData.maasGunu)}</span>
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
            </aside>

            <div ref={scrollRef} className="min-h-0 overflow-y-auto bg-background p-5 md:p-6 space-y-5">
              <Panel id="section-kimlik" title="Kimlik Bilgileri" icon={<BadgeCheck className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell label="Personel Kodu" hint={formData.personelKodu ? 'Önerilen kod' : 'Boş bırakılırsa otomatik üretilir'}>
                    <Input
                      value={formData.personelKodu}
                      onChange={(e) => handleChange('personelKodu', e.target.value)}
                      placeholder="Otomatik"
                      className="h-9 font-mono"
                    />
                  </FieldShell>
                  <FieldShell label="TC Kimlik No">
                    <Input
                      value={formData.tcKimlikNo}
                      onChange={(e) => handleChange('tcKimlikNo', e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="11 haneli TC no"
                      className="h-9"
                      inputMode="numeric"
                    />
                  </FieldShell>
                  <FieldShell label="Ad" required>
                    <Input
                      value={formData.ad}
                      onChange={(e) => handleChange('ad', e.target.value)}
                      placeholder="Personel adı"
                      className="h-9"
                      required
                    />
                  </FieldShell>
                  <FieldShell label="Soyad" required>
                    <Input
                      value={formData.soyad}
                      onChange={(e) => handleChange('soyad', e.target.value)}
                      placeholder="Personel soyadı"
                      className="h-9"
                      required
                    />
                  </FieldShell>
                  <FieldShell label="Doğum Tarihi">
                    <Input
                      type="date"
                      value={formData.dogumTarihi}
                      onChange={(e) => handleChange('dogumTarihi', e.target.value)}
                      className="h-9"
                    />
                  </FieldShell>
                  <FieldShell label="Cinsiyet">
                    <Select value={formData.cinsiyet} onValueChange={(v) => handleChange('cinsiyet', v ?? 'BELIRTILMEMIS')}>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BELIRTILMEMIS">Belirtilmemiş</SelectItem>
                        <SelectItem value="ERKEK">Erkek</SelectItem>
                        <SelectItem value="KADIN">Kadın</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  <FieldShell label="Medeni Durum">
                    <Select
                      value={toOptionalSelectValue(formData.medeniDurum)}
                      onValueChange={(v) => handleChange('medeniDurum', fromOptionalSelectValue(v))}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Seçiniz">
                          {optionalSelectLabel(toOptionalSelectValue(formData.medeniDurum), {
                            emptyLabel: 'Belirtilmemiş',
                            resolveLabel: (v) => ({ BEKAR: 'Bekar', EVLI: 'Evli' }[v]),
                          })}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EMPTY_SELECT_VALUE}>Belirtilmemiş</SelectItem>
                        <SelectItem value="BEKAR">Bekar</SelectItem>
                        <SelectItem value="EVLI">Evli</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldShell>
                </div>
              </Panel>

              <Panel id="section-iletisim" title="İletişim & Adres" icon={<Phone className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell label="Telefon">
                    <Input
                      value={formData.telefon}
                      onChange={(e) => handleChange('telefon', e.target.value)}
                      placeholder="05xx xxx xx xx"
                      className="h-9"
                    />
                  </FieldShell>
                  <FieldShell label="E-posta">
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="ornek@sirket.com"
                      className="h-9"
                    />
                  </FieldShell>
                  <FieldShell label="Adres" className="md:col-span-2">
                    <Textarea
                      value={formData.adres}
                      onChange={(e) => handleChange('adres', e.target.value)}
                      placeholder="Açık adres bilgisi"
                      rows={2}
                      className="min-h-[72px] resize-none"
                    />
                  </FieldShell>
                  <FieldShell label="İl">
                    <Input
                      value={formData.il}
                      onChange={(e) => handleChange('il', e.target.value)}
                      placeholder="İl"
                      className="h-9"
                    />
                  </FieldShell>
                  <FieldShell label="İlçe">
                    <Input
                      value={formData.ilce}
                      onChange={(e) => handleChange('ilce', e.target.value)}
                      placeholder="İlçe"
                      className="h-9"
                    />
                  </FieldShell>
                </div>
              </Panel>

              <Panel id="section-is" title="İş Bilgileri" icon={<Briefcase className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell label="Pozisyon">
                    <Input
                      value={formData.pozisyon}
                      onChange={(e) => handleChange('pozisyon', e.target.value)}
                      placeholder="Örn: Kıdemli Yazılım Geliştirici"
                      className="h-9"
                    />
                  </FieldShell>
                  <FieldShell label="Departman">
                    <div className="space-y-2">
                      <Input
                        value={formData.departman}
                        onChange={(e) => handleChange('departman', e.target.value)}
                        placeholder="Departman adı"
                        className="h-9"
                        list="personel-departman-list"
                      />
                      <datalist id="personel-departman-list">
                        {uniqueDepartmanlar.map((dept) => (
                          <option key={dept} value={dept} />
                        ))}
                      </datalist>
                      {uniqueDepartmanlar.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {uniqueDepartmanlar.slice(0, 4).map((dept) => (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => handleChange('departman', dept)}
                              className="rounded-md border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                            >
                              {dept}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </FieldShell>
                  <FieldShell label="İşe Başlama Tarihi">
                    <Input
                      type="date"
                      value={formData.iseBaslamaTarihi}
                      onChange={(e) => handleChange('iseBaslamaTarihi', e.target.value)}
                      className="h-9"
                    />
                  </FieldShell>
                  <FieldShell label="İşten Çıkış Tarihi">
                    <Input
                      type="date"
                      value={formData.istenCikisTarihi}
                      onChange={(e) => handleChange('istenCikisTarihi', e.target.value)}
                      className="h-9"
                    />
                  </FieldShell>
                  {isEdit ? (
                    <FieldShell label="Aktif Durumu">
                      <Select
                        value={formData.aktif ? 'true' : 'false'}
                        onValueChange={(v) => handleChange('aktif', v === 'true')}
                      >
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Aktif</SelectItem>
                          <SelectItem value="false">Pasif</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldShell>
                  ) : null}
                </div>
              </Panel>

              <Panel id="section-finans" title="Finansal Bilgiler" icon={<Wallet className="size-4" />}>
                <div
                  className="mb-4 grid grid-cols-1 gap-3 rounded-xl border p-3 sm:grid-cols-3"
                  style={{
                    background: 'color-mix(in srgb, var(--primary) 5%, var(--card))',
                    borderColor: 'color-mix(in srgb, var(--primary) 18%, transparent)',
                  }}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <Building2 className="size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-bold uppercase tracking-wide text-muted-foreground">Brüt Maaş</p>
                      <p className="tabular-nums text-sm font-extrabold">{formatMoney(salary)} ₺</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-bold uppercase tracking-wide text-muted-foreground">Ödeme Günü</p>
                      <p className="text-sm font-extrabold">{salaryDayLabel(formData.maasGunu)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CreditCard className="size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-bold uppercase tracking-wide text-muted-foreground">Toplam Ücret</p>
                      <p className="tabular-nums text-sm font-extrabold" style={{ color: 'var(--primary)' }}>
                        {formatMoney(totalComp)} ₺
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldShell label="Maaş">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                        ₺
                      </span>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={formData.maas}
                        onChange={(e) => handleChange('maas', e.target.value)}
                        className="h-9 pl-7 tabular-nums"
                      />
                    </div>
                  </FieldShell>
                  <FieldShell label="Prim (Aylık)">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                        ₺
                      </span>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={formData.prim}
                        onChange={(e) => handleChange('prim', e.target.value)}
                        className="h-9 pl-7 tabular-nums"
                      />
                    </div>
                  </FieldShell>
                  <FieldShell label="Maaş Ödeme Günü">
                    <Select
                      value={toOptionalSelectValue(formData.maasGunu)}
                      onValueChange={(v) => handleChange('maasGunu', fromOptionalSelectValue(v))}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Seçiniz">
                          {optionalSelectLabel(toOptionalSelectValue(formData.maasGunu), {
                            emptyLabel: 'Seçiniz',
                            resolveLabel: (v) => (v === '0' ? 'Ay Sonu' : `Her Ayın ${v}`),
                          })}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value={EMPTY_SELECT_VALUE}>Seçiniz</SelectItem>
                        <SelectItem value="0">Ay Sonu</SelectItem>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            Her Ayın {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldShell>
                  <FieldShell label="SGK No">
                    <Input
                      value={formData.sgkNo}
                      onChange={(e) => handleChange('sgkNo', e.target.value)}
                      placeholder="SGK sicil numarası"
                      className="h-9"
                    />
                  </FieldShell>
                  <FieldShell label="IBAN" className="md:col-span-2">
                    <Input
                      value={formData.ibanNo}
                      onChange={(e) => handleChange('ibanNo', e.target.value.toUpperCase())}
                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                      className="h-9 font-mono uppercase tracking-wide"
                    />
                  </FieldShell>
                </div>
              </Panel>

              <Panel id="section-notlar" title="Ek Notlar" icon={<FileText className="size-4" />}>
                <FieldShell label="Açıklama" hint="İK veya muhasebe için dahili notlar">
                  <Textarea
                    value={formData.aciklama}
                    onChange={(e) => handleChange('aciklama', e.target.value)}
                    placeholder="Personel hakkında ek bilgiler..."
                    rows={4}
                    className="min-h-[110px] resize-none"
                  />
                </FieldShell>
              </Panel>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t bg-muted/40 px-6 py-4">
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden text-xs text-muted-foreground sm:block">
                <MapPin className="mr-1 inline size-3.5" />
                Zorunlu alanlar: Ad ve Soyad
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={onClose} className="h-9 px-5">
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-9 px-6 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                  }}
                >
                  {isEdit ? 'Değişiklikleri Kaydet' : 'Personeli Kaydet'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
