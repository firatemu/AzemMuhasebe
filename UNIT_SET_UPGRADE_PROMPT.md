# Implementation Prompt — Unit Set System v2.0
# OtoMuhasebe ERP

---

## YOUR ROLE

You are a senior backend engineer working on **OtoMuhasebe**, a multi-tenant ERP system
built with **Prisma + PostgreSQL + TypeScript**. Your task is to upgrade the existing
Unit Set module by introducing shared system-level unit sets while preserving full
backward compatibility with the current schema and all existing data.

Do NOT ask clarifying questions. Follow this specification exactly as written.

---

## CURRENT SCHEMA (READ-ONLY — DO NOT MODIFY THESE MODELS DIRECTLY)

```prisma
model UnitSet {
  id          String   @id @default(uuid())
  tenantId    String   @map("tenant_id")        // currently NOT nullable
  name        String   @map("name")
  description String?  @map("description")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  units       Unit[]
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@map("unit_sets")
}

model Unit {
  id             String    @id @default(uuid())
  unitSetId      String    @map("unit_set_id")
  name           String    @map("name")
  code           String?   @map("code")
  conversionRate Decimal   @default(1) @map("conversion_rate") @db.Decimal(12, 4)
  isBaseUnit     Boolean   @default(false) @map("is_base_unit")
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  unitSet        UnitSet   @relation(fields: [unitSetId], references: [id], onDelete: Cascade)
  products       Product[]

  @@index([unitSetId])
  @@map("units")
}

model Product {
  // ...other fields...
  unit    String?  @map("unit_text")   // legacy field — keep as-is
  unitId  String?  @map("unit_id")
  unitRef Unit?    @relation(fields: [unitId], references: [id])
}
```

---

## REQUIRED CHANGES

### 1. Schema Migration — Make `tenantId` nullable on `UnitSet`

Change `tenantId` from `String` to `String?` on the `UnitSet` model.
This is the **only structural change** to the existing schema.

**Business rule encoded in this change:**
- `tenantId IS NULL` → System-owned unit set. Shared across ALL tenants. Immutable.
- `tenantId IS NOT NULL` → Tenant-owned unit set. Belongs to one tenant only.

Update the Prisma model as follows:

```prisma
model UnitSet {
  id          String   @id @default(uuid())
  tenantId    String?  @map("tenant_id")   // NOW NULLABLE — null = system-owned
  name        String   @map("name")
  description String?  @map("description")
  isSystem    Boolean  @default(false) @map("is_system")  // ADD THIS — extra guard
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  units       Unit[]
  tenant      Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@map("unit_sets")
}
```

> **Note on `isSystem` flag**: Even though `tenantId IS NULL` is the primary system
> indicator, add `isSystem Boolean @default(false)` as a secondary guard. This prevents
> accidental mutation in service-layer code that might not check for NULL tenantId.
> A row is considered system-owned if EITHER `tenantId IS NULL` OR `isSystem = true`.

Also add `isDivisible` to the `Unit` model:

```prisma
model Unit {
  id             String    @id @default(uuid())
  unitSetId      String    @map("unit_set_id")
  name           String    @map("name")
  code           String?   @map("code")
  conversionRate Decimal   @default(1) @map("conversion_rate") @db.Decimal(12, 4)
  isBaseUnit     Boolean   @default(false) @map("is_base_unit")
  isDivisible    Boolean   @default(true) @map("is_divisible")  // ADD THIS
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  unitSet        UnitSet   @relation(fields: [unitSetId], references: [id], onDelete: Cascade)
  products       Product[]

  @@index([unitSetId])
  @@map("units")
}
```

> **`isDivisible` business rule**: When `false`, the sales/purchase entry screen must
> reject decimal quantities (e.g. 1.5 pieces is invalid, but 1.5 kg is valid).
> Enforce this validation at the API layer, NOT only on the frontend.

---

### 2. Seed Data — 5 System Unit Sets

Create a Prisma seed file (`prisma/seeds/systemUnitSets.ts`) that inserts the following
records. Use **upsert** (not create) so the seed is safe to re-run without duplicates.
Use deterministic UUIDs (hardcoded) so foreign keys remain stable across environments.

**Seeding strategy**: All system unit sets have `tenantId: null` and `isSystem: true`.

```typescript
// prisma/seeds/systemUnitSets.ts

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const SYSTEM_UNIT_SETS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Uzunluk',
    description: 'Length measurement units',
    units: [
      { id: '00000000-0000-0000-0001-000000000001', name: 'Metre',          code: 'MT',    conversionRate: 1,        isBaseUnit: true,  isDivisible: true  },
      { id: '00000000-0000-0000-0001-000000000002', name: 'Santimetre',     code: 'CM',    conversionRate: 0.01,     isBaseUnit: false, isDivisible: true  },
      { id: '00000000-0000-0000-0001-000000000003', name: 'Milimetre',      code: 'MM',    conversionRate: 0.001,    isBaseUnit: false, isDivisible: true  },
      { id: '00000000-0000-0000-0001-000000000004', name: 'Kilometre',      code: 'KM',    conversionRate: 1000,     isBaseUnit: false, isDivisible: true  },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Agirlik',
    description: 'Weight measurement units',
    units: [
      { id: '00000000-0000-0000-0002-000000000001', name: 'Kilogram',       code: 'KG',    conversionRate: 1,        isBaseUnit: true,  isDivisible: true  },
      { id: '00000000-0000-0000-0002-000000000002', name: 'Gram',           code: 'GR',    conversionRate: 0.001,    isBaseUnit: false, isDivisible: true  },
      { id: '00000000-0000-0000-0002-000000000003', name: 'Ton',            code: 'TON',   conversionRate: 1000,     isBaseUnit: false, isDivisible: true  },
      { id: '00000000-0000-0000-0002-000000000004', name: 'Miligram',       code: 'MG',    conversionRate: 0.000001, isBaseUnit: false, isDivisible: true  },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Hacim',
    description: 'Volume measurement units',
    units: [
      { id: '00000000-0000-0000-0003-000000000001', name: 'Litre',          code: 'LT',    conversionRate: 1,        isBaseUnit: true,  isDivisible: true  },
      { id: '00000000-0000-0000-0003-000000000002', name: 'Mililitre',      code: 'ML',    conversionRate: 0.001,    isBaseUnit: false, isDivisible: true  },
      { id: '00000000-0000-0000-0003-000000000003', name: 'Metrekup',       code: 'M3',    conversionRate: 1000,     isBaseUnit: false, isDivisible: true  },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Alan',
    description: 'Area measurement units',
    units: [
      { id: '00000000-0000-0000-0004-000000000001', name: 'Metrekare',      code: 'M2',    conversionRate: 1,        isBaseUnit: true,  isDivisible: true  },
      { id: '00000000-0000-0000-0004-000000000002', name: 'Santimetrekare', code: 'CM2',   conversionRate: 0.0001,   isBaseUnit: false, isDivisible: true  },
      { id: '00000000-0000-0000-0004-000000000003', name: 'Donum',          code: 'DONUM', conversionRate: 1000,     isBaseUnit: false, isDivisible: true  },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Adet',
    description: 'Quantity / count units',
    units: [
      { id: '00000000-0000-0000-0005-000000000001', name: 'Adet',           code: 'ADET',  conversionRate: 1, isBaseUnit: true,  isDivisible: false },
      { id: '00000000-0000-0000-0005-000000000002', name: 'Paket',          code: 'PKT',   conversionRate: 1, isBaseUnit: false, isDivisible: false },
      { id: '00000000-0000-0000-0005-000000000003', name: 'Kutu',           code: 'KUTU',  conversionRate: 1, isBaseUnit: false, isDivisible: false },
      { id: '00000000-0000-0000-0005-000000000004', name: 'Koli',           code: 'KOLI',  conversionRate: 1, isBaseUnit: false, isDivisible: false },
      { id: '00000000-0000-0000-0005-000000000005', name: 'Takim',          code: 'TAKIM', conversionRate: 1, isBaseUnit: false, isDivisible: false },
    ],
  },
]

// IMPORTANT: Adet sub-units (Paket, Kutu, Koli, Takim) all have conversionRate: 1.
// This is intentional. Their real ratio is material-specific (1 Koli = 24 Adet for
// one product, 12 Adet for another). The actual ratio is defined at the product/material
// card level in a future sprint. Do NOT change these values.

export async function seedSystemUnitSets() {
  for (const setData of SYSTEM_UNIT_SETS) {
    const { units, ...unitSetData } = setData

    await prisma.unitSet.upsert({
      where: { id: unitSetData.id },
      update: {},  // never overwrite system data on re-seed
      create: {
        ...unitSetData,
        tenantId: null,
        isSystem: true,
      },
    })

    for (const unit of units) {
      await prisma.unit.upsert({
        where: { id: unit.id },
        update: {},  // never overwrite system data on re-seed
        create: {
          ...unit,
          unitSetId: unitSetData.id,
        },
      })
    }
  }

  console.log('System unit sets seeded successfully.')
}
```

---

### 3. Service Layer — Immutability Guard (CRITICAL)

Create or update `UnitSetService` with the following guard.
This must be called at the **top of every mutating method** in the service.

```typescript
// services/unitSet.service.ts

private async assertNotSystemOwned(unitSetId: string): Promise<void> {
  const unitSet = await prisma.unitSet.findUniqueOrThrow({
    where: { id: unitSetId },
    select: { tenantId: true, isSystem: true },
  })

  if (unitSet.tenantId === null || unitSet.isSystem === true) {
    throw new ForbiddenException(
      'System unit sets are immutable and cannot be modified or deleted.'
    )
  }
}

// Call assertNotSystemOwned() at the top of:
// updateUnitSet(), deleteUnitSet(), createUnit(), updateUnit(), deleteUnit()
```

**Mutation permission matrix:**

| Operation              | System UnitSet | Tenant UnitSet |
|------------------------|---------------|----------------|
| READ (list / get)      | Allowed       | Allowed        |
| CREATE new UnitSet     | Never (seed only) | Allowed    |
| UPDATE UnitSet         | Forbidden     | Allowed        |
| DELETE UnitSet         | Forbidden     | Allowed        |
| ADD Unit to set        | Forbidden     | Allowed        |
| UPDATE Unit            | Forbidden     | Allowed        |
| DELETE Unit            | Forbidden     | Allowed        |

---

### 4. Query Pattern — Fetching Unit Sets for a Tenant

When a tenant opens the unit set management screen, the response must include
BOTH system sets and their own sets in a single query.

```typescript
async getUnitSetsForTenant(tenantId: string) {
  return prisma.unitSet.findMany({
    where: {
      OR: [
        { tenantId: null },      // system-owned: visible to all tenants
        { tenantId: tenantId },  // tenant-owned: visible only to this tenant
      ],
    },
    include: {
      units: {
        orderBy: [
          { isBaseUnit: 'desc' }, // base unit always first
          { name: 'asc' },
        ],
      },
    },
    orderBy: [
      { isSystem: 'desc' },      // system sets appear before tenant sets
      { name: 'asc' },
    ],
  })
}
```

---

### 5. `isDivisible` Validation at API Layer

Add this validation to the sales and purchase order line-item creation endpoints.
This must run server-side — do not rely on frontend-only validation.

```typescript
async function validateQuantity(unitId: string, quantity: number): Promise<void> {
  const unit = await prisma.unit.findUniqueOrThrow({
    where: { id: unitId },
    select: { isDivisible: true, name: true },
  })

  if (!unit.isDivisible && !Number.isInteger(quantity)) {
    throw new BadRequestException(
      `Unit "${unit.name}" does not support decimal quantities. ` +
      `Please enter a whole number.`
    )
  }

  if (quantity <= 0) {
    throw new BadRequestException('Quantity must be greater than zero.')
  }
}
```

---

### 6. Migration File

Generate a Prisma migration that applies the following SQL.
The migration must NOT drop any existing data or modify any existing indexes.

```sql
-- Make tenant_id nullable to support system-owned unit sets
ALTER TABLE "unit_sets" ALTER COLUMN "tenant_id" DROP NOT NULL;

-- Add isSystem guard column
ALTER TABLE "unit_sets" ADD COLUMN "is_system" BOOLEAN NOT NULL DEFAULT FALSE;

-- Add isDivisible column to units
ALTER TABLE "units" ADD COLUMN "is_divisible" BOOLEAN NOT NULL DEFAULT TRUE;
```

---

## HARD CONSTRAINTS

1. **Backward compatibility is mandatory.** All existing `UnitSet` rows with a valid
   `tenantId` must continue to work without any data migration or transformation.

2. **Never hardcode tenant IDs** in system seed data. System sets use `tenantId: null`.

3. **Seed UUIDs are fixed.** The UUIDs defined in the seed file above must not be
   changed. They are deterministic so that the seed is idempotent across all environments
   (local, staging, production).

4. **Do not copy system unit sets per tenant.** They live once in the database with
   `tenantId: null` and are shared. Never duplicate them into tenant-specific rows.

5. **`conversionRate` for Adet sub-units stays at 1.** Material-specific ratios
   (e.g., 1 Koli = 24 Adet) are out of scope for this sprint and will be handled at
   the product card level. Do not invent ratios here.

6. **`isSystem` is a guard, not the source of truth.** Source of truth is
   `tenantId IS NULL`. Always check both conditions in the guard method.

7. **Seed must be idempotent.** Running it multiple times must produce zero errors
   and zero duplicates. Use `upsert` with `update: {}` for all system records.

8. **All validation errors must return structured JSON** following the existing error
   format in the codebase. Do not return plain text error strings from the API.

---

## DELIVERABLES CHECKLIST

Produce exactly the following files. Nothing more, nothing less.

- [ ] Updated `schema.prisma` — nullable `tenantId`, added `isSystem`, added `isDivisible`
- [ ] `prisma/migrations/XXXXXX_unit_set_v2/migration.sql` — the three ALTER statements above
- [ ] `prisma/seeds/systemUnitSets.ts` — idempotent seed with all 5 system unit sets
- [ ] Updated `unitSet.service.ts` — `assertNotSystemOwned()` guard on all mutating methods
- [ ] Updated `getUnitSetsForTenant()` — returns system + tenant sets combined, system first
- [ ] `validateQuantity()` — enforces `isDivisible` server-side on order line items

---

## WHAT NOT TO DO

- Do not create a separate `SystemUnitSet` table — single-table design is intentional
- Do not delete, rename, or alter any existing column beyond what is specified above
- Do not add per-tenant copies of system unit sets
- Do not allow any mutation of system unit sets through the API under any circumstance
- Do not use `create` instead of `upsert` in the seed file
- Do not implement `isDivisible` as a frontend-only check
- Do not generate random UUIDs for system seed records
