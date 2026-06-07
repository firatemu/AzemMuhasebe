# CODING STANDARDS — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Genel kodlama standartları, backend standartları, TypeScript kuralları, Prisma/NestJS güvenli geliştirme prensipleri  
**Stack:** NestJS + Next.js App Router + TypeScript + Prisma + PostgreSQL + Redis  
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya Muhasebe projesinin genel kodlama standartlarını tanımlar. Frontend’e özel detaylı standartlar için ayrıca `02A-CODING_STANDARDS_FRONTEND.md` okunmalıdır.

---

## 1. Kaynak Sırası

AI agent bir geliştirme görevine başlamadan önce görevin türüne göre ilgili dosyaları okur.

Genel görevlerde:

```txt
1. 00-PROJECT_IDENTITY.md
2. 01-AGENT_WORKFLOW.md
3. 02-CODING_STANDARDS.md
4. context-map/module-context-map.md
5. İlgili skill veya workflow dosyası
```

Frontend görevlerinde ek olarak:

```txt
- 02A-CODING_STANDARDS_FRONTEND.md
- 03-DESIGN_SYSTEM.md
- 04-UI_COMPONENT_BOUNDARIES.md
- workflows/frontend-page-patterns.md
```

Backend görevlerinde ek olarak:

```txt
- skills/tenant-security-skill.md
- skills/prisma-erp-skill.md
- workflows/backend-api-patterns.md
```

Finansal görevlerde ek olarak:

```txt
- skills/invoice-engine-skill.md
- decisions/ADR-003-financial-transactions.md
```

---

## 2. Temel Kodlama İlkeleri

```txt
✅ Okunabilirlik
✅ Type safety
✅ Küçük ve odaklı fonksiyonlar
✅ Mevcut proje patternlerine uyum
✅ Tenant güvenliği
✅ Soft delete uyumu
✅ Transaction güvenliği
✅ Türkçe kullanıcı mesajları
✅ Açık hata yönetimi
```

Yasaklar:

```txt
❌ any kullanmak
❌ tenantId olmadan veri sorgulamak
❌ hard delete yapmak
❌ Finansal işlemleri transaction dışında yapmak
❌ Backend/API contract’ı frontend görevi sırasında değiştirmek
❌ Rastgele dependency eklemek
❌ Mevcut mimariyi kullanıcı onayı olmadan değiştirmek
```

---

## 3. TypeScript Standartları

### 3.1 Strict TypeScript

TypeScript strict yaklaşımı korunur.

```ts
// ❌ Yanlış
function calculateTotal(items: any) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Doğru
interface InvoiceItemInput {
  quantity: number
  unitPrice: number
}

function calculateTotal(items: InvoiceItemInput[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
}
```

### 3.2 `any` Kullanımı

`any` kullanılmaz. Zorunlu hallerde `unknown` tercih edilir ve güvenli narrow yapılır.

```ts
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Bir hata oluştu'
}
```

### 3.3 Interface ve Type Kullanımı

```ts
// Nesne yapıları için interface
export interface Account {
  id: string
  name: string
  tenantId: string
  createdAt: Date
}

// Union ve utility tipler için type
export type InvoiceStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'OPEN'
  | 'PARTIALLY_PAID'
  | 'CLOSED'
  | 'CANCELLED'
```

### 3.4 Return Type

Public fonksiyonlarda return type açık yazılır.

```ts
async function findById(id: string): Promise<Account> {
  // ...
}
```

---

## 4. Naming Standartları

| Tür | Standart | Örnek |
|---|---|---|
| Değişken | `camelCase` | `invoiceTotal` |
| Fonksiyon | `camelCase` | `calculateBalance` |
| Component | `PascalCase` | `AccountForm` |
| Class | `PascalCase` | `AccountService` |
| Interface | `PascalCase` | `AccountFilter` |
| Type | `PascalCase` | `InvoiceStatus` |
| Constant | `SCREAMING_SNAKE_CASE` | `DEFAULT_PAGE_SIZE` |
| Dosya | `kebab-case` | `account.service.ts` |
| React component dosyası | `PascalCase.tsx` | `AccountForm.tsx` |

---

## 5. Import Sıralaması

```ts
// 1. Node.js built-in
import { randomUUID } from 'node:crypto'

// 2. Framework / harici paketler
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

// 3. Proje alias importları
import { PrismaService } from '@/common/prisma/prisma.service'
import { TenantContextService } from '@/common/tenant/tenant-context.service'

// 4. Relative imports
import { CreateAccountDto } from './dto/create-account.dto'

// 5. Type-only imports
import type { Account } from '@prisma/client'
```

Type-only import gerekiyorsa `import type` kullanılır.

---

## 6. NestJS Backend Standartları

### 6.1 Modül Yapısı

```txt
src/modules/{module}/
├── dto/
│   ├── create-{module}.dto.ts
│   ├── update-{module}.dto.ts
│   ├── filter-{module}.dto.ts
│   └── index.ts
├── {module}.controller.ts
├── {module}.service.ts
├── {module}.module.ts
└── {module}.repository.ts        # opsiyonel
```

### 6.2 Controller Standardı

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { TenantGuard } from '@/common/guards/tenant.guard'

import { AccountService } from './account.service'
import { CreateAccountDto, FilterAccountDto, UpdateAccountDto } from './dto'

@ApiTags('Cari Hesaplar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('list')
  @ApiOperation({ summary: 'Cari hesap listesi' })
  async list(@Query() filter: FilterAccountDto) {
    return this.accountService.findAll(filter)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Cari hesap detayı' })
  async findOne(@Param('id') id: string) {
    return this.accountService.findByIdOrThrow(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yeni cari hesap oluştur' })
  async create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cari hesap güncelle' })
  async update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cari hesap sil' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.accountService.softDelete(id)
  }
}
```

Kurallar:

```txt
✅ Controller içinde business logic yazılmaz
✅ Auth ve Tenant guard zorunludur
✅ Swagger summary Türkçe ve açıklayıcıdır
✅ Silme işlemi soft delete olarak uygulanır
✅ Endpoint contract değiştirilmeden önce etki analizi yapılır
```

---

## 7. DTO Standartları

DTO’larda `class-validator` kullanılır.

```ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateAccountDto {
  @ApiProperty({ example: 'ABC Ltd. Şti.' })
  @IsString()
  @MinLength(2)
  name: string

  @ApiProperty({ enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'] })
  @IsEnum(['CUSTOMER', 'SUPPLIER', 'BOTH'])
  type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH'

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taxId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string
}
```

Kurallar:

```txt
✅ Create DTO ayrı yazılır
✅ Update DTO PartialType ile türetilebilir
✅ Filter DTO pagination/search/filter alanlarını içerir
✅ Validation mesajları mümkünse Türkçe yönetilir
✅ DTO içinde tenantId kullanıcıdan alınmaz
```

---

## 8. Service Standartları

Service business logic’in ana yeridir.

```ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/common/prisma/prisma.service'
import { TenantContextService } from '@/common/tenant/tenant-context.service'

import { CreateAccountDto, FilterAccountDto, UpdateAccountDto } from './dto'

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async findAll(filter: FilterAccountDto) {
    const tenantId = this.tenantContext.getTenantId()

    const where = {
      tenantId,
      deletedAt: null,
      ...(filter.search
        ? {
            name: {
              contains: filter.search,
              mode: 'insensitive' as const,
            },
          }
        : {}),
    }

    const [data, total] = await Promise.all([
      this.prisma.account.findMany({
        where,
        skip: ((filter.page ?? 1) - 1) * (filter.limit ?? 25),
        take: filter.limit ?? 25,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.account.count({ where }),
    ])

    return {
      data,
      total,
      page: filter.page ?? 1,
      limit: filter.limit ?? 25,
    }
  }

  async findByIdOrThrow(id: string) {
    const tenantId = this.tenantContext.getTenantId()

    const account = await this.prisma.account.findFirst({
      where: { id, tenantId, deletedAt: null },
    })

    if (!account) {
      throw new NotFoundException('Cari hesap bulunamadı')
    }

    return account
  }

  async create(dto: CreateAccountDto) {
    const tenantId = this.tenantContext.getTenantId()

    const existing = await this.prisma.account.findFirst({
      where: {
        tenantId,
        deletedAt: null,
        name: dto.name,
      },
    })

    if (existing) {
      throw new ConflictException('Bu cari hesap zaten mevcut')
    }

    return this.prisma.account.create({
      data: {
        ...dto,
        tenantId,
      },
    })
  }

  async update(id: string, dto: UpdateAccountDto) {
    const account = await this.findByIdOrThrow(id)

    return this.prisma.account.update({
      where: { id: account.id },
      data: dto,
    })
  }

  async softDelete(id: string): Promise<void> {
    const account = await this.findByIdOrThrow(id)

    await this.prisma.account.update({
      where: { id: account.id },
      data: { deletedAt: new Date() },
    })
  }
}
```

---

## 9. Tenant Güvenliği

Tenant izolasyonu projenin en kritik güvenlik kuralıdır.

```txt
Her tenant sadece kendi verisini görür.
Her sorguda tenantId zorunludur.
Her aktif kayıt sorgusunda deletedAt: null zorunludur.
```

### 9.1 Doğru Query

```ts
await prisma.account.findMany({
  where: {
    tenantId,
    deletedAt: null,
  },
})
```

### 9.2 Yanlış Query

```ts
// ❌ Tenant sızıntısı riski
await prisma.account.findMany({
  where: {
    deletedAt: null,
  },
})
```

### 9.3 Frontend Görevlerinde Tenant Kuralı

Frontend UI görevi sırasında aşağıdakiler değiştirilmez:

```txt
- Auth interceptor
- x-tenant-id header injection
- Token storage
- API base URL
- Refresh token flow
```

Eksik veya hatalı tenant davranışı fark edilirse doğrudan değiştirilmez; görev kapsamına göre raporlanır veya ayrı güvenlik görevi olarak ele alınır.

---

## 10. Soft Delete Standardı

Hard delete varsayılan olarak yasaktır.

```ts
// ❌ Yanlış
await prisma.account.delete({ where: { id } })

// ✅ Doğru
await prisma.account.update({
  where: { id },
  data: { deletedAt: new Date() },
})
```

Aktif kayıt sorgularında:

```ts
where: {
  tenantId,
  deletedAt: null,
}
```

Gerçek silme sadece açıkça tanımlı bakım, test veya yasal veri silme görevlerinde yapılabilir. Bu durum ayrı onay ve plan gerektirir.

---

## 11. Prisma Standartları

### 11.1 Query Pattern

```ts
const data = await prisma.invoice.findMany({
  where: {
    tenantId,
    deletedAt: null,
  },
  include: {
    account: true,
    items: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
})
```

### 11.2 N+1 Önleme

```ts
// ❌ Yanlış
for (const invoice of invoices) {
  const account = await prisma.account.findUnique({ where: { id: invoice.accountId } })
}

// ✅ Doğru
const invoices = await prisma.invoice.findMany({
  where: { tenantId, deletedAt: null },
  include: { account: true },
})
```

### 11.3 Raw Query Kuralı

Raw query gerekiyorsa tenantId ve deletedAt unutulmaz.

```ts
await prisma.$queryRaw`
  SELECT *
  FROM accounts
  WHERE tenant_id = ${tenantId}
    AND deleted_at IS NULL
`
```

---

## 12. Transaction Standartları

Finansal, stok veya cari hareket etkileyen işlemler transaction içinde yapılır.

Transaction gerektiren işlemler:

```txt
- Fatura oluşturma
- Fatura iptal
- Tahsilat
- Ödeme
- Stok hareketi
- Depo transferi
- Çek/senet durum değişikliği
- Cari bakiye etkileyen işlemler
```

Örnek:

```ts
await prisma.$transaction(
  async (tx) => {
    const invoice = await tx.invoice.create({
      data: { ...invoiceData, tenantId },
    })

    await tx.invoiceItem.createMany({
      data: items.map((item) => ({
        ...item,
        invoiceId: invoice.id,
        tenantId,
      })),
    })

    await tx.accountMovement.create({
      data: {
        accountId: invoice.accountId,
        invoiceId: invoice.id,
        amount: invoice.total,
        type: 'DEBIT',
        tenantId,
      },
    })

    return invoice
  },
  { isolationLevel: 'Serializable' },
)
```

Kurallar:

```txt
✅ Finansal işlemlerde Serializable isolation tercih edilir
✅ Partial transaction yapılmaz
✅ Transaction içinde dış servis çağrısı minimumda tutulur
✅ Hata durumunda otomatik rollback beklenir
```

---

## 13. Pagination Standardı

Liste endpointleri pagination desteklemelidir.

```ts
interface PaginationResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

Default değerler:

```txt
page: 1
limit: 25
max limit: 100
```

---

## 14. Error Handling

Backend hata mesajları kullanıcıya uygun Türkçe mesajlar üretmelidir.

```ts
throw new NotFoundException('Cari hesap bulunamadı')
throw new ConflictException('Bu kayıt zaten mevcut')
throw new BadRequestException('Geçersiz işlem')
```

Kurallar:

```txt
✅ Teknik hata loglanır
✅ Kullanıcıya güvenli mesaj döner
✅ Tenant veya auth detayları sızdırılmaz
✅ Validation hataları açık olmalıdır
```

---

## 15. Logging

Kritik işlemler loglanmalıdır:

```txt
- Giriş denemeleri
- Finansal işlem oluşturma/iptal
- Fatura iptal
- Tahsilat/ödeme iptal
- Stok düzeltme
- Yetki değişiklikleri
- Tenant ayar değişiklikleri
```

Log içinde hassas veri yazılmaz.

---

## 16. Dependency Kuralı

Yeni dependency kullanıcı onayı olmadan eklenmez.

Önce şu sorular cevaplanır:

```txt
- Mevcut dependency ile çözülebilir mi?
- Proje standardına uygun mu?
- Bundle size veya backend footprint etkisi var mı?
- Security riski var mı?
- Alternatif native çözüm var mı?
```

---

## 17. Test / Doğrulama Komutları

Projede mevcut scriptler kontrol edilerek uygun olanlar çalıştırılır.

Örnek:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

Agent bir komutun mevcut olduğunu varsaymaz; önce `package.json` kontrol eder.

---

## 18. Frontend Standartlarına Referans

Frontend görevlerinde bu dosya tek başına yeterli değildir. Ayrıca şu dosyalar okunur:

```txt
.cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
.cursor/rules/workflows/frontend-page-patterns.md
```

Frontend görevinde backend dosyaları, Prisma schema, migration veya auth/tenant altyapısı değiştirilmez.

---

## 19. AI Agent Genel Kontrol Listesi

Görev tamamlanmadan önce:

- [ ] Proje adı Muhasebe olarak korundu mu?
- [ ] Eski proje adı veya sektör bağlamı kullanılmadı mı?
- [ ] TypeScript strict yaklaşıma uyuldu mu?
- [ ] `any` kullanılmadı mı?
- [ ] TenantId zorunlu sorgularda var mı?
- [ ] `deletedAt: null` aktif sorgularda var mı?
- [ ] Hard delete yapılmadı mı?
- [ ] Finansal/stok/cari işlemler transaction içinde mi?
- [ ] API contract gereksiz değiştirilmedi mi?
- [ ] Yeni dependency eklenmediyse mevcut yapı korundu mu?
- [ ] Kullanıcıya Türkçe ve net hata mesajları var mı?

## 20. Agent Response Language

Bu projede agent’ın kullanıcıya yazdığı görev sonu raporları Türkçe olmalıdır.

Kullanılacak rapor başlıkları:

```txt
Özet
Değişen dosyalar
Doğrulama
Risk / Not
Sonraki öneri