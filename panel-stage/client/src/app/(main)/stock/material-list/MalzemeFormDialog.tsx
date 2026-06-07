'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Archive,
  Banknote,
  Barcode,
  Box,
  Briefcase,
  ClipboardList,
  Layers3,
  MapPin,
  PackagePlus,
  Ruler,
  Scale,
  Warehouse,
  Wallet,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Controller, type Resolver, useForm } from 'react-hook-form';

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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  defaultMaterialFormValues,
  materialFormSchema,
  type MaterialFormValues,
} from '@/schemas/material.schema';
import type { LocationOption, UnitSetOption } from '@/types/material';
import {
  EMPTY_SELECT_VALUE,
  fromOptionalSelectValue,
  optionalSelectLabel,
  toOptionalSelectValue,
} from '@/lib/select-utils';
import { cn } from '@/lib/utils';

const MANUAL_UNIT_VALUE = '__manual_unit__';
const VAT_OPTIONS = [0, 1, 8, 10, 18, 20];

const SECTIONS = [
  { id: 'section-kimlik', label: 'Kimlik', icon: Box },
  { id: 'section-siniflandirma', label: 'Sınıflandırma', icon: Layers3 },
  { id: 'section-depolama', label: 'Depolama', icon: Warehouse },
  { id: 'section-fiyat', label: 'Fiyatlandırma', icon: Wallet },
  { id: 'section-teknik', label: 'Teknik', icon: Ruler },
  { id: 'section-notlar', label: 'Notlar', icon: ClipboardList },
] as const;

interface MalzemeFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues: MaterialFormValues;
  locations: LocationOption[];
  kategoriler: Record<string, string[]>;
  markalar: string[];
  birimSetleri: UnitSetOption[];
  canEditUnit: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (data: MaterialFormValues) => Promise<void>;
}

function FieldShell({
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
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
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
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

export function MalzemeFormDialog({
  open,
  mode,
  initialValues,
  locations,
  kategoriler,
  markalar,
  birimSetleri,
  canEditUnit,
  isSaving,
  onClose,
  onSubmit,
}: MalzemeFormDialogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialFormSchema) as unknown as Resolver<MaterialFormValues>,
    defaultValues: defaultMaterialFormValues,
  });

  useEffect(() => {
    if (open) {
      reset(initialValues);
      setActiveSection(SECTIONS[0].id);
    }
  }, [initialValues, open, reset]);

  const selectedCategory = watch('anaKategori') ?? '';
  const selectedSubCategory = watch('altKategori') ?? '';
  const selectedUnit = watch('birim') || 'Adet';
  const productName = watch('stokAdi') || '';
  const productCode = watch('stokKodu') || '';
  const productBrand = watch('marka') || '';
  const purchasePrice = Number(watch('alisFiyati') ?? 0);
  const salePrice = Number(watch('satisFiyati') ?? 0);
  const vatRate = Number(watch('vatRate') ?? 20);

  const altKategoriOptions = useMemo(() => {
    if (!selectedCategory) return [];
    const options = kategoriler[selectedCategory] ?? [];
    return selectedSubCategory && !options.includes(selectedSubCategory)
      ? [...options, selectedSubCategory]
      : options;
  }, [kategoriler, selectedCategory, selectedSubCategory]);

  const margin = salePrice - purchasePrice;
  const marginRate = purchasePrice > 0 ? (margin / purchasePrice) * 100 : 0;
  const grossSalePrice = salePrice * (1 + vatRate / 100);
  const saving = isSaving || isSubmitting;
  const canSubmit = productName.trim().length >= 2;

  const marginColor = margin < 0 ? 'var(--expense)' : 'var(--income)';
  const marginRateBg =
    marginRate < 0 ? 'var(--expense-muted)' : marginRate < 10 ? 'var(--warning-muted)' : 'var(--income-muted)';
  const marginRateBorder =
    marginRate < 0 ? 'var(--expense)' : marginRate < 10 ? 'var(--warning)' : 'var(--income)';
  const marginRateColor =
    marginRate < 0 ? 'var(--expense)' : marginRate < 10 ? 'var(--warning)' : 'var(--income)';

  const initials = productName
    ? productName
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w.charAt(0))
        .join('')
        .toUpperCase()
    : 'ST';

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    scrollRef.current?.querySelector<HTMLElement>(`#${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const submit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

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
        <form className="flex h-full min-h-0 flex-col" onSubmit={submit}>
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
                  {mode === 'create' ? <PackagePlus className="size-[22px]" /> : <Archive className="size-[22px]" />}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <DialogTitle className="text-lg font-bold tracking-tight">
                    {mode === 'create' ? 'Yeni Malzeme Ekle' : 'Malzeme Düzenle'}
                  </DialogTitle>
                  <DialogDescription className="truncate text-xs font-medium text-muted-foreground">
                    {productName
                      ? `${productName} stok kartını düzenliyorsunuz`
                      : 'Envantere yeni bir stok/malzeme kartı tanımlayın.'}
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
                    <p className="truncate text-sm font-bold">{productName || 'Yeni Malzeme'}</p>
                    <p className="truncate text-xs text-muted-foreground">{productBrand || 'Marka belirtilmedi'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {productCode || 'OTOMATİK KOD'}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {selectedUnit}
                  </Badge>
                  {selectedCategory ? (
                    <Badge variant="outline" className="text-[10px]">
                      {selectedCategory}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <Banknote className="size-4 text-primary" />
                  <p className="text-xs font-bold uppercase tracking-wider">Maliyet / Kar Analizi</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-muted-foreground">Net Alış</span>
                    <span className="tabular-nums font-semibold">{formatMoney(purchasePrice)} ₺</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-muted-foreground">Net Satış</span>
                    <span className="tabular-nums font-semibold text-primary">{formatMoney(salePrice)} ₺</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-muted-foreground">KDV Dahil</span>
                    <span className="tabular-nums font-semibold">{formatMoney(grossSalePrice)} ₺</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-muted-foreground">Birim Marj</span>
                    <span className="tabular-nums font-bold" style={{ color: marginColor }}>
                      {(margin >= 0 ? '+' : '') + formatMoney(margin)} ₺
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-bold"
                    style={{ background: marginRateBg, borderColor: marginRateBorder, color: marginRateColor }}
                  >
                    <span>Marj Oranı</span>
                    <span className="tabular-nums text-sm">
                      {Number.isFinite(marginRate) ? `${marginRate.toFixed(1)}%` : '0.0%'}
                    </span>
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

              {!canEditUnit && mode === 'edit' ? (
                <Alert
                  className="p-3.5"
                  style={{
                    background: 'var(--warning-muted)',
                    borderColor: 'var(--warning)',
                    color: 'var(--warning)',
                  }}
                >
                  <AlertTriangle className="size-4 shrink-0" />
                  <AlertDescription className="text-xs font-semibold leading-relaxed">
                    Hareket görmüş malzemede birim değiştirilemez.
                  </AlertDescription>
                </Alert>
              ) : null}
            </aside>

            <div ref={scrollRef} className="min-h-0 overflow-y-auto bg-background p-5 md:p-6 space-y-5">
              <Panel id="section-kimlik" title="Kimlik Bilgileri" icon={<Box className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    name="stokAdi"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Malzeme Adı" required error={errors.stokAdi?.message} className="md:col-span-2">
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          aria-invalid={!!errors.stokAdi}
                          className="h-9"
                          placeholder="Örn. Motor Bloğu, 12V Akü..."
                        />
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="stokKodu"
                    control={control}
                    render={({ field }) => (
                      <FieldShell
                        label="Stok Kodu"
                        hint={field.value ? 'Önerilen kod' : 'Boş bırakılırsa otomatik üretilir'}
                      >
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          className="h-9 font-mono font-semibold"
                          placeholder="Otomatik"
                        />
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="barkod"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Barkod">
                        <div className="relative">
                          <Barcode className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className="h-9 pl-9 font-mono text-xs"
                            placeholder="Ürün barkod numarası"
                          />
                        </div>
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="marka"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Marka">
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          list="material-brand-options"
                          className="h-9"
                          placeholder="Marka girin veya seçin"
                        />
                        <datalist id="material-brand-options">
                          {markalar.map((marka) => (
                            <option key={marka} value={marka} />
                          ))}
                        </datalist>
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="model"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Model">
                        <Input {...field} value={field.value ?? ''} className="h-9" placeholder="Ürün modeli" />
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="aciklama"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Açıklama" className="md:col-span-2">
                        <Textarea
                          {...field}
                          value={field.value ?? ''}
                          rows={2}
                          className="min-h-[72px] resize-none text-sm"
                          placeholder="Stok kartına dair genel operasyonel açıklama..."
                        />
                      </FieldShell>
                    )}
                  />
                </div>
              </Panel>

              <Panel id="section-siniflandirma" title="Sınıflandırma ve Birim" icon={<Layers3 className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    name="anaKategori"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Ana Kategori">
                        <Select
                          value={toOptionalSelectValue(field.value)}
                          onValueChange={(v) => {
                            field.onChange(fromOptionalSelectValue(v));
                            setValue('altKategori', '');
                          }}
                        >
                          <SelectTrigger className="h-9 w-full text-xs">
                            <SelectValue placeholder="Seçiniz...">
                              {optionalSelectLabel(toOptionalSelectValue(field.value), {
                                emptyLabel: 'Seçilmedi',
                              })}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={EMPTY_SELECT_VALUE}>Seçilmedi</SelectItem>
                            {Object.keys(kategoriler).map((k) => (
                              <SelectItem key={k} value={k}>
                                {k}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="altKategori"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Alt Kategori">
                        <Select
                          value={toOptionalSelectValue(field.value)}
                          onValueChange={(v) => field.onChange(fromOptionalSelectValue(v))}
                          disabled={!selectedCategory}
                        >
                          <SelectTrigger className="h-9 w-full text-xs">
                            <SelectValue placeholder="Seçiniz...">
                              {optionalSelectLabel(toOptionalSelectValue(field.value), {
                                emptyLabel: 'Seçilmedi',
                              })}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={EMPTY_SELECT_VALUE}>Seçilmedi</SelectItem>
                            {altKategoriOptions.map((a) => (
                              <SelectItem key={a} value={a}>
                                {a}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="birimId"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Temel Ölçü Birimi" required error={errors.birim?.message} className="md:col-span-2">
                        <Select
                          value={field.value || MANUAL_UNIT_VALUE}
                          onValueChange={(selectedId) => {
                            if (selectedId === MANUAL_UNIT_VALUE) {
                              field.onChange('');
                              setValue('birim', selectedUnit || 'Adet', { shouldValidate: true });
                              return;
                            }
                            const selected = birimSetleri
                              .flatMap((set) => set.units ?? [])
                              .find((u) => u.id === selectedId);
                            field.onChange(selectedId);
                            setValue('birim', selected?.name ?? 'Adet', { shouldValidate: true });
                          }}
                          disabled={!canEditUnit && mode === 'edit'}
                        >
                          <SelectTrigger className="h-9 w-full text-xs">
                            <SelectValue placeholder="Birim seçiniz..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={MANUAL_UNIT_VALUE}>{selectedUnit || 'Adet'}</SelectItem>
                            {birimSetleri.map((unitSet) => (
                              <SelectGroup key={unitSet.id}>
                                <SelectLabel className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                  {unitSet.name}
                                </SelectLabel>
                                {(unitSet.units ?? []).map((unit) => (
                                  <SelectItem key={unit.id} value={unit.id}>
                                    {unit.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldShell>
                    )}
                  />
                </div>
              </Panel>

              <Panel id="section-depolama" title="Depolama ve Sipariş Limitleri" icon={<Warehouse className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    name="raf"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Raf Konumu">
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          list="material-location-options"
                          className="h-9"
                          placeholder="Raf/Göz numarası"
                        />
                        <datalist id="material-location-options">
                          {locations.map((l) => (
                            <option key={l.id} value={l.code}>
                              {l.name}
                            </option>
                          ))}
                        </datalist>
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="tedarikciKodu"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Tedarikçi Kodu">
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          className="h-9 font-mono text-xs"
                          placeholder="Tedarikçi katalog kodu"
                        />
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="criticalQty"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Kritik Stok Limiti" hint="Bu miktarın altında uyarı verilir">
                        <Input
                          type="number"
                          min={0}
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="h-9 tabular-nums font-semibold"
                        />
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="minOrderQty"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Minimum Sipariş Miktarı">
                        <Input
                          type="number"
                          min={0}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                          }
                          className="h-9 tabular-nums font-semibold"
                          placeholder="Zorunlu değil"
                        />
                      </FieldShell>
                    )}
                  />
                </div>
              </Panel>

              <Panel id="section-fiyat" title="Fiyatlandırma ve Vergi" icon={<Wallet className="size-4" />}>
                <div
                  className="mb-4 grid grid-cols-1 gap-3 rounded-xl border p-3 sm:grid-cols-3"
                  style={{
                    background: 'color-mix(in srgb, var(--primary) 5%, var(--card))',
                    borderColor: 'color-mix(in srgb, var(--primary) 18%, transparent)',
                  }}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <Briefcase className="size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-bold uppercase tracking-wide text-muted-foreground">KDV Dahil Satış</p>
                      <p className="tabular-nums text-sm font-extrabold">{formatMoney(grossSalePrice)} ₺</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Banknote className="size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-bold uppercase tracking-wide text-muted-foreground">Birim Marj</p>
                      <p className="tabular-nums text-sm font-extrabold" style={{ color: marginColor }}>
                        {(margin >= 0 ? '+' : '') + formatMoney(margin)} ₺
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Scale className="size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-bold uppercase tracking-wide text-muted-foreground">Marj Oranı</p>
                      <p className="text-sm font-extrabold" style={{ color: marginRateColor }}>
                        {Number.isFinite(marginRate) ? `${marginRate.toFixed(1)}%` : '0.0%'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Controller
                    name="alisFiyati"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Alış Fiyatı (KDV Hariç)" error={errors.alisFiyati?.message}>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                            ₺
                          </span>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="h-9 pl-7 tabular-nums font-semibold"
                          />
                        </div>
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="satisFiyati"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Satış Fiyatı (KDV Hariç)" error={errors.satisFiyati?.message}>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                            ₺
                          </span>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="h-9 pl-7 tabular-nums font-semibold text-primary"
                          />
                        </div>
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="vatRate"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="KDV Oranı">
                        <Select value={String(field.value ?? 20)} onValueChange={(v) => field.onChange(Number(v))}>
                          <SelectTrigger className="h-9 w-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {VAT_OPTIONS.map((rate) => (
                              <SelectItem key={rate} value={String(rate)}>
                                %{rate}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldShell>
                    )}
                  />
                </div>
              </Panel>

              <Panel id="section-teknik" title="Teknik ve Fiziksel Özellikler" icon={<Ruler className="size-4" />}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    name="olcu"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Ölçü / Teknik Detay">
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          className="h-9"
                          placeholder="Örn. 120mm, M8 Vida, 220V..."
                        />
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="dimensions"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Boyutlar (GxYxD)">
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          className="h-9"
                          placeholder="Örn. 10x25x15 cm"
                        />
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Ağırlık">
                        <div className="relative">
                          <Scale className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={0}
                            step="0.001"
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                            }
                            className="h-9 pl-9 pr-12 tabular-nums font-semibold"
                            placeholder="0.000"
                          />
                          <span className="absolute right-3 top-2.5 text-xs font-bold text-muted-foreground">
                            {watch('weightUnit') || 'kg'}
                          </span>
                        </div>
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="weightUnit"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Ağırlık Birimi">
                        <Select value={field.value || 'kg'} onValueChange={field.onChange}>
                          <SelectTrigger className="h-9 w-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg (Kilogram)</SelectItem>
                            <SelectItem value="g">g (Gram)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldShell>
                    )}
                  />
                  <Controller
                    name="warrantyMonths"
                    control={control}
                    render={({ field }) => (
                      <FieldShell label="Garanti Süresi (Ay)" className="md:col-span-2">
                        <Input
                          type="number"
                          min={0}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                          }
                          className="h-9 font-semibold"
                          placeholder="Süre belirtilmedi"
                        />
                      </FieldShell>
                    )}
                  />
                </div>
              </Panel>

              <Panel id="section-notlar" title="Özel Notlar (Şirket İçi)" icon={<ClipboardList className="size-4" />}>
                <Controller
                  name="internalNote"
                  control={control}
                  render={({ field }) => (
                    <FieldShell label="İç Not" hint="Depolama, tedarik ve operasyon notları">
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        rows={4}
                        className="min-h-[110px] resize-none text-sm leading-relaxed"
                        placeholder="Malzemeye özel iç depolama notları, tedarikçi uyarıları..."
                      />
                    </FieldShell>
                  )}
                />
              </Panel>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t bg-muted/40 px-6 py-4">
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden text-xs text-muted-foreground sm:block">
                <MapPin className="mr-1 inline size-3.5" />
                Zorunlu alanlar: Malzeme adı ve birim
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="h-9 px-5">
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !canSubmit}
                  className="h-9 px-6 font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)' }}
                >
                  {saving ? (
                    <span className="flex items-center gap-1.5">
                      <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Kaydediliyor...
                    </span>
                  ) : mode === 'create' ? (
                    'Malzemeyi Kaydet'
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
