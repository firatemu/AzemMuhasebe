# BACKEND API PATTERNS — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** NestJS backend API geliştirme standartları, controller/service/DTO patternleri, tenant güvenliği, soft delete, pagination ve transaction kuralları  
**Stack:** NestJS + TypeScript + Prisma + PostgreSQL + Redis  
**Son Güncelleme:** 31 Mayıs 2026

> Bu workflow, Muhasebe projesinde backend endpoint, service, DTO ve API geliştirme görevlerinde kullanılır. Backend API geliştirme sırasında tenant izolasyonu, soft delete, transaction bütünlüğü ve API contract güvenliği korunur.

---

## 1. Ne Zaman Kullanılır?

Bu workflow şu görevlerde kullanılır:

```txt
- Yeni API endpoint ekleme
- Mevcut endpoint güncelleme
- DTO oluşturma veya güncelleme
- Service metodu yazma
- Listeleme / detay / oluşturma / güncelleme / silme endpointleri
- Pagination / filter / search ekleme
- Export endpointi planlama
- Backend validation iyileştirme
```

Bu workflow tek başına finansal transaction için yeterli değildir. Finansal işlem varsa ayrıca şu dosyalar okunur:

```txt
.cursor/rules/skills/invoice-engine-skill.md
.cursor/rules/decisions/ADR-003-financial-transactions.md
```

---

## 2. Zorunlu Okuma Sırası

Backend API görevinden önce agent şu dosyaları okur:

```txt
1. .cursor/rules/00-PROJECT_IDENTITY.md
2. .cursor/rules/01-AGENT_WORKFLOW.md
3. .cursor/rules/02-CODING_STANDARDS.md
4. .cursor/rules/workflows/backend-api-patterns.md
5. .cursor/rules/skills/tenant-security-skill.md
6. .cursor/rules/skills/prisma-erp-skill.md
7. İlgili controller/service/dto/model dosyaları
```

Görev finansal, stok veya cari bakiye etkiliyorsa ek olarak:

```txt
.cursor/rules/skills/invoice-engine-skill.md
.cursor/rules/skills/warehouse-stock-skill.md
.cursor/rules/context-map/module-context-map.md
.cursor/rules/decisions/ADR-003-financial-transactions.md
```

---

## 3. Temel Backend İlkeleri

```txt
✅ Controller ince kalır
✅ Business logic service katmanında olur
✅ DTO validation zorunludur
✅ AuthGuard + TenantGuard korunur
✅ Her tenant verisi tenantId ile filtrelenir
✅ Aktif kayıt sorgularında deletedAt: null kullanılır
✅ Hard delete yapılmaz
✅ Finansal/stok/cari işlemler transaction içinde yapılır
✅ Kullanıcıya Türkçe ve güvenli hata mesajları döner
✅ API contract gereksiz değiştirilmez
```

Yasaklar:

```txt
❌ tenantId olmadan sorgu
❌ deletedAt filtresini unutmak
❌ Controller içinde business logic
❌ DTO validation olmadan body almak
❌ Hard delete
❌ Finansal işlemi transaction dışında yapmak
❌ Raw query'de tenant filtresi unutmak
❌ Frontend ihtiyacı için rastgele backend contract değiştirmek
```

---

## 4. Modül Yapısı

Standart modül yapısı:

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

Örnek:

```txt
src/modules/accounts/
├── dto/
│   ├── create-account.dto.ts
│   ├── update-account.dto.ts
│   ├── filter-account.dto.ts
│   └── index.ts
├── account.controller.ts
├── account.service.ts
└── account.module.ts
```

---

## 5. Controller Pattern

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

Controller kuralları:

```txt
- Controller business logic içermez
- Controller sadece request/response routing yapar
- Guard yapısı korunur
- Swagger decorator kullanılır
- TenantId body/query ile alınmaz
- Tenant context backend altyapısından gelir
```

---

## 6. DTO Pattern

DTO validation için `class-validator` kullanılır.

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

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  taxId?: string

  @ApiPropertyOptional({ example: 'info@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string
}
```

Update DTO:

```ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateAccountDto } from './create-account.dto'

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
```

Filter DTO:

```ts
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class FilterAccountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'] })
  @IsOptional()
  @IsEnum(['CUSTOMER', 'SUPPLIER', 'BOTH'])
  type?: 'CUSTOMER' | 'SUPPLIER' | 'BOTH'

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ default: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25
}
```

DTO kuralları:

```txt
- DTO içinde tenantId bulunmaz
- Create ve Update DTO ayrıdır
- Filter DTO pagination/search/filter alanlarını içerir
- Query param numeric değerleri Type(() => Number) ile dönüştürülür
- Validation hataları kullanıcıya anlaşılır dönmelidir
```

---

## 7. Service Pattern

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
    const page = filter.page ?? 1
    const limit = filter.limit ?? 25

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
      ...(filter.type ? { type: filter.type } : {}),
    }

    const [data, total] = await Promise.all([
      this.prisma.account.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.account.count({ where }),
    ])

    return { data, total, page, limit }
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

    await this.validateCreate(dto, tenantId)

    return this.prisma.account.create({
      data: { ...dto, tenantId },
    })
  }

  async update(id: string, dto: UpdateAccountDto) {
    const existing = await this.findByIdOrThrow(id)

    return this.prisma.account.update({
      where: { id: existing.id },
      data: dto,
    })
  }

  async softDelete(id: string): Promise<void> {
    const existing = await this.findByIdOrThrow(id)

    await this.prisma.account.update({
      where: { id: existing.id },
      data: { deletedAt: new Date() },
    })
  }

  private async validateCreate(dto: CreateAccountDto, tenantId: string): Promise<void> {
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
  }
}
```

Service kuralları:

```txt
- tenantId her metotta TenantContextService ile alınır
- findByIdOrThrow tenantId + deletedAt kontrolü yapar
- create/update öncesi business validation yapılır
- softDelete hard delete kullanmaz
- Transaction gerekiyorsa service katmanında uygulanır
```

---

## 8. Pagination Response Standardı

Liste endpointleri şu formatı döner:

```ts
export interface PaginatedResponse<T> {
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

Frontend DataGrid 0-based page kullanabilir. Backend API 1-based page kullanır.

---

## 9. Search / Filter Standardı

Filtreler kontrollü şekilde build edilir.

```ts
const where = {
  tenantId,
  deletedAt: null,
  ...(filter.search
    ? {
        OR: [
          { name: { contains: filter.search, mode: 'insensitive' as const } },
          { code: { contains: filter.search, mode: 'insensitive' as const } },
        ],
      }
    : {}),
  ...(filter.status ? { status: filter.status } : {}),
}
```

Kurallar:

```txt
- Boş filtreler where içine eklenmez
- Search alanları belirli kolonlarla sınırlanır
- Raw SQL search gerekiyorsa tenantId zorunludur
- Filtreler tenant izolasyonunu bozamaz
```

---

## 10. Sorting Standardı

Sorting desteklenecekse allowlist kullanılmalıdır.

```ts
const allowedSortFields = ['createdAt', 'name', 'code', 'total'] as const

type AllowedSortField = (typeof allowedSortFields)[number]

function resolveSort(sortBy?: string, sortOrder?: 'asc' | 'desc') {
  if (!sortBy || !allowedSortFields.includes(sortBy as AllowedSortField)) {
    return { createdAt: 'desc' as const }
  }

  return {
    [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
  }
}
```

Yasak:

```txt
❌ Kullanıcıdan gelen sortBy değerini doğrudan orderBy içine koymak
```

---

## 11. Soft Delete Pattern

Silme endpointleri fiziksel silme yapmaz.

```ts
async softDelete(id: string): Promise<void> {
  const existing = await this.findByIdOrThrow(id)

  await this.prisma.account.update({
    where: { id: existing.id },
    data: {
      deletedAt: new Date(),
    },
  })
}
```

Aktif kayıt sorguları:

```ts
where: {
  tenantId,
  deletedAt: null,
}
```

Hard delete sadece açıkça onaylanmış bakım/test/yasal silme görevlerinde yapılabilir.

---

## 12. Tenant Security Pattern

Her Prisma sorgusunda tenantId bulunmalıdır.

```ts
const tenantId = this.tenantContext.getTenantId()

const data = await this.prisma.invoice.findMany({
  where: {
    tenantId,
    deletedAt: null,
  },
})
```

Yanlış:

```ts
// ❌ Tenant filtresi yok
await this.prisma.invoice.findMany({
  where: { deletedAt: null },
})
```

Join/include ilişkilerde de tenant güvenliği düşünülür.

---

## 13. Transaction Pattern

Finansal, stok veya cari bakiye etkileyen işlemlerde transaction zorunludur.

```ts
await this.prisma.$transaction(
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
        type: 'DEBIT',
        amount: invoice.total,
        tenantId,
      },
    })

    return invoice
  },
  { isolationLevel: 'Serializable' },
)
```

Transaction gerektiren işlemler:

```txt
- Fatura oluşturma
- Fatura iptal
- Tahsilat
- Ödeme
- Stok hareketi
- Depo transferi
- Cari bakiye etkileyen işlem
- Çek/senet durum değişikliği
```

---

## 14. Export Endpoint Pattern

Büyük export işlemleri frontend’de tüm veriyi çekerek yapılmaz.

```ts
@Get('export')
@ApiOperation({ summary: 'Cari hesapları dışa aktar' })
async export(@Query() filter: FilterAccountDto) {
  return this.accountService.export(filter)
}
```

Kurallar:

```txt
- Export endpoint tenantId filtreli olmalıdır
- Export işlemi rate limit veya permission gerektirebilir
- Büyük veri export işlemleri stream/job olarak planlanabilir
- Frontend fake export üretmez
```

---

## 15. Permission / Authorization

Backend authorization asıl güvenlik katmanıdır.

Kurallar:

```txt
- Controller guard yapısı korunur
- Permission/role decorator varsa kullanılmalıdır
- Frontend permission kontrolü güvenlik yerine geçmez
- Kritik endpointlerde backend permission kontrolü zorunludur
```

Örnek:

```ts
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
@RequirePermission('account.create')
@Post()
async create(@Body() dto: CreateAccountDto) {
  return this.accountService.create(dto)
}
```

Eğer mevcut projede permission decorator farklıysa mevcut pattern korunur. Agent yeni sistem uydurmaz.

---

## 16. Error Handling Pattern

Backend kullanıcıya güvenli, anlaşılır ve Türkçe hata mesajları döner.

```ts
throw new NotFoundException('Cari hesap bulunamadı')
throw new ConflictException('Bu kayıt zaten mevcut')
throw new BadRequestException('Geçersiz işlem')
```

Teknik detaylar response ile sızdırılmaz.

Yasak:

```txt
❌ Database hata detayını kullanıcıya döndürmek
❌ Stack trace döndürmek
❌ Tenant/auth iç detaylarını response içinde göstermek
```

---

## 17. Raw Query Pattern

Raw query gerekiyorsa tenantId zorunludur.

```ts
await this.prisma.$queryRaw`
  SELECT *
  FROM accounts
  WHERE tenant_id = ${tenantId}
    AND deleted_at IS NULL
`
```

Kurallar:

```txt
- Raw query son çaredir
- Parametre binding kullanılmalıdır
- String interpolation ile SQL oluşturulmaz
- tenantId ve deletedAt unutulmaz
```

---

## 18. API Contract Koruma

Mevcut endpoint contract’ı değiştirilmeden önce etkisi analiz edilir.

Agent şu durumlarda dikkat eder:

```txt
- Response shape değişiyor mu?
- Field adı değişiyor mu?
- Pagination formatı değişiyor mu?
- Frontend servisleri etkileniyor mu?
- Mobil veya başka client etkileniyor mu?
```

Contract değişikliği gerekiyorsa raporlanır ve kullanıcı onayı istenir.

---

## 19. Backend Görevlerinde Yasaklar

```txt
❌ tenantId olmadan query
❌ hard delete
❌ transaction gerektiren işi transaction dışında yapmak
❌ controller içine business logic yazmak
❌ DTO validation atlamak
❌ kullanıcıdan tenantId almak
❌ raw query’de tenant filtresi unutmak
❌ izin sistemi varsa permission kontrolünü atlamak
❌ frontend polish görevi bahanesiyle backend contract değiştirmek
❌ Supabase migration başlatmak
```

---

## 20. Doğrulama

Backend API görevi sonunda agent mümkünse şu kontrolleri yapar:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

Ayrıca manuel kontrol:

```txt
- Endpoint guard yapısı doğru mu?
- DTO validation var mı?
- tenantId/deletedAt var mı?
- Soft delete kullanıldı mı?
- Transaction gerekiyorsa var mı?
- API response formatı korunuyor mu?
```

---

## 21. Raporlama Formatı

Görev sonunda agent şu formatta rapor verir:

```txt
Özet:
- Ne yapıldı?

Değişen dosyalar:
- src/modules/accounts/account.controller.ts
- src/modules/accounts/account.service.ts
- src/modules/accounts/dto/filter-account.dto.ts

Güvenlik Kontrolü:
- tenantId: kontrol edildi
- deletedAt: kontrol edildi
- soft delete: korundu
- transaction: gerekli değil / uygulandı

Doğrulama:
- pnpm lint: geçti / çalıştırılamadı
- pnpm type-check: geçti / çalıştırılamadı
- test: geçti / çalıştırılamadı

Not:
- Eksik veya riskli alan varsa açıkça yazılır
```

---

## 22. AI Agent Kontrol Listesi

- [ ] Proje kimliği Muhasebe olarak korundu mu?
- [ ] Controller ince mi?
- [ ] Service business logic içeriyor mu?
- [ ] DTO validation var mı?
- [ ] AuthGuard/TenantGuard korundu mu?
- [ ] tenantId tüm sorgularda var mı?
- [ ] deletedAt aktif sorgularda var mı?
- [ ] Hard delete yapılmadı mı?
- [ ] Transaction gerekiyorsa kullanıldı mı?
- [ ] Permission gerekiyorsa kontrol edildi mi?
- [ ] API contract gereksiz değişmedi mi?
- [ ] Hata mesajları Türkçe ve güvenli mi?
