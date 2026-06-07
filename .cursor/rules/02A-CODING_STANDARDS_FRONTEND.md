# CODING STANDARDS — Frontend — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Frontend kodlama standartları  
**Stack:** Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + MUI X DataGrid + React Hook Form + Zod + TanStack Query  
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya frontend kodlama standartlarını tanımlar. Genel kodlama ve backend standartları için `02-CODING_STANDARDS.md`, UI sınırları için `04-UI_COMPONENT_BOUNDARIES.md`, tasarım tokenları için `03-DESIGN_SYSTEM.md`, sayfa şablonları için `workflows/frontend-page-patterns.md` okunmalıdır.

---

## 1. Kaynak Sırası

Frontend görevi başlamadan önce AI agent şu dosyaları okur:

```txt
1. 00-PROJECT_IDENTITY.md
2. 01-AGENT_WORKFLOW.md
3. 02-CODING_STANDARDS.md
4. 02A-CODING_STANDARDS_FRONTEND.md
5. 03-DESIGN_SYSTEM.md
6. 04-UI_COMPONENT_BOUNDARIES.md
7. workflows/frontend-page-patterns.md
8. İlgili mevcut sayfa ve component dosyaları
```

UI kütüphane seçimi konusunda nihai kaynak:

```txt
04-UI_COMPONENT_BOUNDARIES.md
```

Tasarım tokenları konusunda nihai kaynak:

```txt
03-DESIGN_SYSTEM.md
```

---

## 2. Temel Frontend İlkeleri

```txt
✅ TypeScript strict
✅ Next.js App Router kurallarına uyum
✅ Küçük client boundary
✅ shadcn/ui ana UI sistemi
✅ MUI X sadece DataGrid
✅ Tailwind ile layout
✅ React Hook Form + Zod formlar
✅ TanStack Query ile data fetching
✅ Service layer üzerinden API çağrıları
✅ Türkçe kullanıcı mesajları
✅ Loading / empty / error state
✅ Permission-aware aksiyonlar
✅ Kritik işlemlerde confirmation dialog
```

Yasaklar:

```txt
❌ Yeni kodda @mui/material kullanmak
❌ Yeni kodda MUI icon kullanmak
❌ Layout için MUI Box/Grid/Stack kullanmak
❌ Component içinde doğrudan axios/fetch çağrısı yapmak
❌ Tüm sayfayı gereksiz yere 'use client' yapmak
❌ Hardcode renk kullanmak
❌ any kullanmak
❌ Auth/tenant interceptor davranışını UI görevi içinde değiştirmek
❌ Backend/API/business logic değiştirmek
```

---

## 3. Dosya Organizasyonu

```txt
/app
  /(dashboard)
    /accounts
      page.tsx
      [id]/page.tsx
      [id]/edit/page.tsx
      new/page.tsx

/components
  /ui
    # shadcn bileşenleri — doğrudan değiştirilmez

  /shared
    KPICard.tsx
    StatusBadge.tsx
    PageHeader.tsx
    DataTable.tsx
    EmptyState.tsx
    ErrorState.tsx
    ConfirmDialog.tsx

  /accounts
    AccountForm.tsx
    AccountFilters.tsx
    AccountDataGrid.tsx

/services
  account.service.ts
  invoice.service.ts
  product.service.ts

/schemas
  account.schema.ts
  invoice.schema.ts

/types
  account.ts
  invoice.ts

/lib
  api.ts
  query-keys.ts
  notify.ts
  formatters.ts
  datagrid-styles.ts
  api-error.ts
  utils.ts
```

---

## 4. Component İsimlendirme

```tsx
// ✅ Component adı PascalCase
export function AccountForm() {}

// ✅ Dosya adı PascalCase.tsx
AccountForm.tsx
KPICard.tsx
StatusBadge.tsx

// ✅ Sayfa componentleri default export olabilir
export default function AccountListPage() {}
```

Kurallar:

```txt
- Shared componentler components/shared altında tutulur
- Modüle özel componentler ilgili modül klasöründe tutulur
- shadcn components/ui bileşenleri doğrudan değiştirilmez
- Proje özel ihtiyaçlar wrapper component olarak yazılır
```

---

## 5. Server / Client Component Ayrımı

Next.js App Router kullanılır. Client boundary mümkün olduğunca küçük tutulur.

### 5.1 Temel Kural

```txt
page.tsx varsayılan olarak Server Component kabul edilir.
Etkileşimli alanlar ayrı Client Component olarak ayrılır.
```

### 5.2 Client Component Gerektiren Durumlar

```txt
- useState
- useEffect
- useRouter
- useSearchParams
- React Hook Form
- TanStack Query hook kullanımı
- Dialog open/close state
- DataGrid
- Filtre state yönetimi
- Client-side event handler
- Toast tetikleme
```

### 5.3 Yanlış Kullanım

```tsx
// ❌ Tüm sayfayı gereksiz yere client yapmak
'use client'

export default function AccountPage() {
  return <AccountPageContent />
}
```

### 5.4 Doğru Kullanım

```tsx
// app/(dashboard)/accounts/page.tsx
import { AccountListClient } from '@/components/accounts/AccountListClient'

export default function AccountPage() {
  return <AccountListClient />
}
```

```tsx
// components/accounts/AccountListClient.tsx
'use client'

export function AccountListClient() {
  // state, query, datagrid burada
}
```

---

## 6. TypeScript Frontend Standartları

### 6.1 `any` Yasak

```ts
// ❌ Yanlış
function handleSubmit(data: any) {}

// ✅ Doğru
function handleSubmit(data: CreateAccountFormData): void {}
```

### 6.2 Tip Tanımları

```ts
export interface Account {
  id: string
  name: string
  type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH'
  balance: number
  isActive: boolean
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

### 6.3 Union Type Tercihi

```ts
export type AccountType = 'CUSTOMER' | 'SUPPLIER' | 'BOTH'

export type InvoiceStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'OPEN'
  | 'PARTIALLY_PAID'
  | 'CLOSED'
  | 'CANCELLED'
```

---

## 7. Form Sistemi

Her form şu üçlüyle yazılır:

```txt
React Hook Form + Zod + shadcn Form
```

### 7.1 Zod Schema

```ts
// schemas/account.schema.ts
import { z } from 'zod'

export const createAccountSchema = z.object({
  name: z.string().min(2, 'En az 2 karakter giriniz'),
  type: z.enum(['CUSTOMER', 'SUPPLIER', 'BOTH']),
  taxId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Geçerli bir e-posta giriniz').optional().or(z.literal('')),
  creditLimit: z.coerce.number().min(0, 'Kredi limiti negatif olamaz').optional(),
})

export type CreateAccountFormData = z.infer<typeof createAccountSchema>
```

### 7.2 Form Component Pattern

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  createAccountSchema,
  type CreateAccountFormData,
} from '@/schemas/account.schema'

interface AccountFormProps {
  defaultValues?: Partial<CreateAccountFormData>
  onSubmit: (data: CreateAccountFormData) => void
  isSubmitting?: boolean
}

export function AccountForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: AccountFormProps) {
  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      type: 'CUSTOMER',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cari Adı</FormLabel>
                <FormControl>
                  <Input placeholder="Firma adı veya ad soyad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            İptal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

### 7.3 Form Tasarım Kuralları

```txt
✅ Grid ile yan yana alanlar
✅ FormLabel + FormControl + FormMessage her zaman
✅ Placeholder açıklayıcı olmalı
✅ Submit buton sağda olmalı
✅ İptal butonu outline olmalı
✅ Zod mesajları Türkçe olmalı

❌ MUI TextField
❌ Her alanı tek tek dikey Bootstrap stack yapmak
❌ Inline validation mesajı
❌ FormMessage yerine custom hata div’i
❌ Gereksiz required yıldızı
```

---

## 8. API Client ve Tenant/Auth Koruma Kuralı

Frontend görevlerinde API client davranışı korunur.

```txt
- Auth token gönderimi bozulmaz
- x-tenant-id header injection bozulmaz
- API base URL değiştirilmez
- Refresh token / logout akışı değiştirilmez
- Interceptor dosyaları UI polish sırasında düzenlenmez
```

Eksik endpoint fark edilirse frontend görevi içinde backend yazılmaz. Eksik ihtiyaç raporlanır.

---

## 9. Service Layer Standardı

Component içinde doğrudan axios/fetch çağrısı yapılmaz. API çağrıları service dosyalarında toplanır.

```ts
// services/account.service.ts
import { api } from '@/lib/api'
import type { Account, PaginatedResponse } from '@/types/account'
import type { CreateAccountFormData } from '@/schemas/account.schema'

export interface AccountFilters {
  page?: number
  limit?: number
  search?: string
  type?: string
}

export const accountService = {
  getAll: async (params: AccountFilters): Promise<PaginatedResponse<Account>> => {
    const response = await api.get('/accounts/list', { params })
    return response.data
  },

  getById: async (id: string): Promise<Account> => {
    const response = await api.get(`/accounts/${id}`)
    return response.data
  },

  create: async (data: CreateAccountFormData): Promise<Account> => {
    const response = await api.post('/accounts', data)
    return response.data
  },

  update: async (id: string, data: Partial<CreateAccountFormData>): Promise<Account> => {
    const response = await api.patch(`/accounts/${id}`, data)
    return response.data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`)
  },
}
```

---

## 10. TanStack Query Standardı

### 10.1 Query Keys

Query key’ler merkezi yönetilir.

```ts
// lib/query-keys.ts
export const QK = {
  accounts: {
    all: ['accounts'] as const,
    list: (filters?: object) => ['accounts', 'list', filters] as const,
    detail: (id: string) => ['accounts', 'detail', id] as const,
  },

  invoices: {
    all: ['invoices'] as const,
    list: (filters?: object) => ['invoices', 'list', filters] as const,
    detail: (id: string) => ['invoices', 'detail', id] as const,
  },
}
```

### 10.2 useQuery

```tsx
const { data, isLoading, error, refetch } = useQuery({
  queryKey: QK.accounts.list(filters),
  queryFn: () => accountService.getAll(filters),
})
```

### 10.3 useMutation

```tsx
const queryClient = useQueryClient()

const { mutate, isPending } = useMutation({
  mutationFn: accountService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QK.accounts.all })
    notify('Cari başarıyla oluşturuldu', 'success')
    router.push('/accounts')
  },
  onError: (error) => {
    notify(getApiErrorMessage(error), 'error')
  },
})
```

---

## 11. API Error Handling

API hata mesajları tek yardımcı fonksiyonla okunur.

```ts
// lib/api-error.ts
import { AxiosError } from 'axios'

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Bir hata oluştu'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Bir hata oluştu'
}
```

Kullanım:

```tsx
onError: (error) => {
  notify(getApiErrorMessage(error), 'error')
}
```

---

## 12. URL Query Params Standardı

Liste sayfalarında filtre, arama, sayfa ve limit değerleri mümkünse URL query param ile senkronize edilir.

```txt
/accounts?page=1&limit=25&search=abc&type=CUSTOMER
```

Kurallar:

```txt
- Liste yenilendiğinde filtreler kaybolmamalı
- Geri/ileri browser navigation filtreleri korumalı
- URL değerleri Zod veya güvenli parse ile doğrulanmalı
- Boş filtreler URL’ye yazılmamalı
- Arama inputlarında debounce kullanılabilir
- Debounce süresi 300–500ms aralığında olmalı
```

---

## 13. Permission-Aware UI

Yetki gerektiren aksiyonlar permission kontrolü olmadan gösterilmez.

```tsx
{can('account.create') && (
  <Button asChild>
    <Link href="/accounts/new">Yeni Cari</Link>
  </Button>
)}
```

Kurallar:

```txt
- Frontend permission kontrolü sadece UX katmanıdır
- Backend authorization asıl güvenlik katmanıdır
- Silme, onaylama, iptal, tahsilat, ödeme, stok düzeltme gibi aksiyonlar permission kontrolü olmadan eklenmez
- Eğer projede permission helper yoksa agent yeni sistem uydurmaz; mevcut auth/role yapısını inceler
```

---

## 14. Kritik İşlem Confirmation Kuralı

Finansal, stok veya cari bakiye etkileyen işlemler tek tıkla uygulanmaz.

Confirmation gerektiren işlemler:

```txt
- Fatura iptal
- Tahsilat iptal
- Ödeme iptal
- Kayıt silme
- Stok hareketi düzeltme
- Cari bakiye etkileyen işlem
- Çek/senet durum değişikliği
- Toplu işlem
```

---

## 15. Bildirim Sistemi

`sonner` wrapper ile kullanılır.

```ts
// lib/notify.ts
import { toast } from 'sonner'

export function notify(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info',
): void {
  toast[type](message)
}
```

Kullanım:

```ts
notify('Kayıt oluşturuldu', 'success')
notify('Bir hata oluştu', 'error')
notify('Stok yetersiz', 'warning')
```

---

## 16. Formatters

```ts
// lib/formatters.ts
export function formatCurrency(value: number, currency = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR').format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date))
}
```

Tüm para, miktar, bakiye ve oran gösterimlerinde `tabular-nums` kullanılır.

---

## 17. Loading State

```tsx
import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  )
}

<Button disabled={isPending}>
  {isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Kaydediliyor...
    </>
  ) : (
    'Kaydet'
  )}
</Button>
```

---

## 18. Empty / Error State

Her liste ve detay sayfasında uygun state bulunmalıdır.

```tsx
if (isLoading) return <ListSkeleton />
if (error) return <ErrorState onRetry={refetch} />
if (!data?.data?.length) return <EmptyState />
```

---

## 19. `cn()` Yardımcı Fonksiyonu

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

---

## 20. Import Sıralaması

```ts
// 1. React hooks/types
import { useState } from 'react'
import type { ReactNode } from 'react'

// 2. Next.js
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// 3. Harici kütüphaneler
import { useMutation, useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

// 4. MUI X — sadece DataGrid
import { DataGrid, type GridColDef } from '@mui/x-data-grid'

// 5. lucide-react
import { Plus, Pencil, Trash2 } from 'lucide-react'

// 6. shadcn/ui
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// 7. Shared / module components
import { PageHeader } from '@/components/shared/PageHeader'
import { AccountForm } from '@/components/accounts/AccountForm'

// 8. Services, utils, schemas
import { accountService } from '@/services/account.service'
import { QK } from '@/lib/query-keys'
import { notify } from '@/lib/notify'
import { formatCurrency } from '@/lib/formatters'

// 9. Types
import type { Account } from '@/types/account'
```

---

## 21. Yasaklar

```txt
❌ any kullanmak
❌ Component içinde doğrudan axios/fetch çağrısı yapmak
❌ Auth/tenant interceptor davranışını UI görevi içinde değiştirmek
❌ Yeni kodda @mui/material kullanmak
❌ Yeni kodda MUI icon kullanmak
❌ Layout için MUI Box/Grid/Stack kullanmak
❌ Tüm sayfayı gereksiz yere 'use client' yapmak
❌ Hardcode renk kullanmak
❌ Türkçe olmayan kullanıcı mesajı yazmak
❌ Kritik işlemleri confirmation olmadan çalıştırmak
❌ Permission gerektiren aksiyonları kontrolsüz göstermek
```

---

## 22. AI Agent Kontrol Listesi

- [ ] Client boundary gereksiz büyütülmedi mi?
- [ ] Form React Hook Form + Zod + shadcn ile mi yazıldı?
- [ ] API çağrıları service layer’da mı?
- [ ] Query key merkezi mi?
- [ ] Error handling ortak helper ile mi?
- [ ] Permission gerektiren aksiyonlar kontrol edildi mi?
- [ ] Kritik işlemler confirmation dialog ile korunuyor mu?
- [ ] MUI sadece DataGrid için mi kullanıldı?
- [ ] Hardcode renk yok mu?
- [ ] Loading / empty / error state var mı?
- [ ] Auth/tenant interceptor davranışı korunmuş mu?
