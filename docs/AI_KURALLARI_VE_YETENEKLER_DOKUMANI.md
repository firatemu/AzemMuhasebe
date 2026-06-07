# AI KURALLARI VE YETENEK DOSYALARI

**Proje:** Muhasebe (OtoMuhasebe)
**Kapsam:** `.cursor/rules/`, `~/.cursor/skills-cursor/`, `~/.cursor/plugins/cache/`
**Tarih:** 30 Mayıs 2026

---

## Giriş

Bu doküman, proje için yapılandırılmış tüm AI kurallarını ve yetenek dosyalarını kapsamlar. Cursor AI agent'ı bu dosyaları okuyarak projeye özgü bağlam, standartlar ve kısıtlamalar hakkında bilgi edinir. Bu sayede agent, projeye tamamen hakim bir şekilde çalışabilir.

---

## Bölüm 1: Proje AI Kuralları (`.cursor/rules/`)

Tüm proje özel kurallar `/home/azem/projects/muhasebe/.cursor/rules/` dizininde bulunur.

### 1.1 CODING_STANDARDS.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/CODING_STANDARDS.md`
**Amaç:** TypeScript, NestJS ve React için kapsamlı kodlama standartları

#### İçerik Özeti:

**TypeScript Kuralları:**
- Açık tipler zorunlu (implicit any不允许)
- `interface` vs `type`:Obje yapıları için `interface`, birleşim tipleri için `type`
- Optional/Required field conventıonları: `field?: string` (optional), `field: string` (required)
- Enum kullanımı: Type-safe enum'lar (string literal union tercih edilir)

**NestJS Backend Standartları:**
- DTO Yapısı: `class-validator` decorator'lari ile validation
- Service Kalıpları: `TenantContextService` kullanımı
- Controller Standartları: Swagger decorator'ları, JWT/Tenant guard'ları
- Prisma Sorgu Kalıpları: `tenantId` + `deletedAt` filtreleri her sorguda

**Next.js Frontend Standartları:**
- Component Yapısı: Atomic design yaklaşımı
- React Query Hooks: `useQuery`, `useMutation` standartları
- Form Handling: React Hook Form + Zod validation
- DataGrid Standartları: MUI X DataGrid kullanım kalıpları

**İsimlendirme:**
- Değişkenler: `camelCase`
- Component'ler: `PascalCase`
- Sabitler: `SCREAMING_SNAKE_CASE`
- Dosya adları: `kebab-case.ts`

**Import Sıralaması:**
1. Node.js built-in
2. Harici paketler
3. Dahili modüller
4. relative imports

---

### 1.2 AGENT_WORKFLOW.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/AGENT_WORKFLOW.md`
**Amaç:** AI Agent'ın bu projede nasıl çalışması gerektiğini tanımlar

#### İçerik Özeti:

**Agent Yetenekleri ve Sınırları:**
- Basit görevler: <30 dakika
- Orta görevler: 30 dakika - 2 saat
- Karmaşık görevler: >2 saat (plan mode'a geç)

**5 Adımlı İş Akışı:**
```
1. ANLA (Understand)    → Görevi ve gereksinimleri kavr
2. ARAŞTIR (Research)  → İlgili dosyaları oku, bağlam topla
3. PLANLE (Plan)        → Adımları belirle
4. UYGULA (Apply)       → Kodu yaz/değiştir
5. DOĞRULA (Verify)    → Test et ve kontrol et
```

**Dosya Okuma Stratejisi:**
- Minimum gerekli dosyayı oku
- Cerrahi bağlam: yalnızca ilgili bölümleri
- Desen takibi: tekrar eden yapıları tanı
- Referans sırası: önce kontekst, sonra detay

**Performans İpuçları:**
- Hız için paralel tool çağrıları
- Gereksiz dosya okumaktan kaçın
- Token bütçesini yönet

---

### 1.3 CURSOR_SYSTEM_PROMPT.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/CURSOR_SYSTEM_PROMPT.md`
**Amaç:** Proje kimliği ve kritik kurallar (EN ÖNEMLİ)

#### İçerik Özeti:

**Proje Kimliği:**
- Ad: AzemTarim ERP
- Stack: NestJS + Next.js + Prisma
- Mimari: Çok kiracılı (Multi-tenant)
- Sürümler: Next.js 16, NestJS 11, Prisma 6, PostgreSQL 16

**Kritik Kurallar (YASAK):**
```
1. tenantId olmadan sorgu YAPMA
2. Hard delete YAPMA (soft delete kullan)
3. Renkleri kod içinde hardcode etme
4. API endpoint'lerinde eksik endpoint YAZMA
```

**Port Yapılandırması:**
| Servis | Port |
|--------|------|
| Frontend | 3000 |
| Backend | /api |
| PostgreSQL | 5435 |
| Redis | 6371 |

**Dosya İsimlendirme:**
- Backend: `kebab-case.module.ts`, `camelCase.service.ts`
- Frontend: `PascalCase.tsx`, `camelCase.ts`

---

### 1.4 DEBUGGING_GUIDE.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/DEBUGGING_GUIDE.md`
**Amaç:** Sistematik hata ayıklama yaklaşımı ve yaygın hata çözümleri

#### İçerik Özeti:

**6 Adımlı Hata Ayıklama:**
```
1. Hata mesajını analiz et
2. İlgili kodu bul
3. Kök nedeni belirle
4. Çözüm planla
5. Uygula
6. Test et
```

**NestJS Backend Hataları:**
- Prisma/Database: Bağlantı, migration, sorgu hataları
- Module/DI: Dependency injection hataları
- Validation/DTO: class-validator hataları
- JWT/Auth: Token doğrulama hataları

**Next.js Frontend Hataları:**
- Data fetching: API çağrı, response parsing
- State management: Zustand, React Query
- MUI components: Theme, props, responsive
- Route errors: Path matching, 404

**Docker/Altyapı Hataları:**
- Container başlamıyor
- Port çakışması
- Volume mount hataları

**Prisma Migration Sorunları:**
- `prisma migrate deploy` başarısızlığı
- Schema drift
- Seed data hataları

---

### 1.5 ADR - Mimari Karar Kayıtları

#### 1.5.1 ADR-001-tenant-isolation.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/decisions/ADR-001-tenant-isolation.md`
**Amaç:** Çok kiracılı izolasyon stratejisi mimari kararı

**Seçilen Yaklaşım:** Uygulama Katmanı + RLS (Defense in Depth)

**Uygulama:**
- `tenantId` sorgularda zorunlu
- `TenantContextService` ile bağlam yönetimi
- `TenantMiddleware` ile otomatik çözümleme
- `TenantGuard` ile API koruma
- PostgreSQL RLS policies ile veritabanı katmanı

**Reddedilen Alternatifler:**
- Kiracı başına ayrı veritabanı (maliyet, karmaşıklık)
- Tenant şeması ayrımı (performans, migration zorluğu)

#### 1.5.2 ADR-002-soft-delete.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/decisions/ADR-002-soft-delete.md`
**Amaç:** Kayıt silme yaklaşımı mimari kararı

**Pattern:**
```prisma
deletedAt DateTime? @map("deleted_at")
```

**Schema Pattern:**
```prisma
// Sorgularda otomatik
where: { deletedAt: null }

// Silme yerine
update: { deletedAt: new Date() }
```

**Hardship Durumları:**
- Gerçek silme gerektiğinde (GDPR, test verisi)
- Toplu silme senaryoları
- Kalıcı veri temizleme

**Faydaları:**
- Geri döndürilebilirlik
- Referans bütünlüğü
- Denetim izi

#### 1.5.3 ADR-003-financial-transactions.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/decisions/ADR-003-financial-transactions.md`
**Amaç:** Fatura/hesap/stok işlem yönetimi mimari kararı

**Seçilen Yaklaşım:**
```typescript
await prisma.$transaction(async (tx) => {
  // Serializable isolation level
}, { isolationLevel: 'Serializable' })
```

**Fatura Oluşturma Akışı:**
```
validate() → create() → createItems() → stockMovement() → accountMovement()
```

**Kritik Kurallar:**
- Asla kısmi işlem yapma
- Isolation level doğru seçimi
- Rollback senaryoları

---

### 1.6 Context Map Dosyaları

#### 1.6.1 module-context-map.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/context-map/module-context-map.md`
**Amaç:** Görev-tipo dosya eşlemesi (hangi görev için hangi dosyalar okunmalı)

**İçerik:**
- Modül-tipo dosya eşlemesi (Finans, Stok, Cari, İK)
- Frontend sayfa dosya yolları
- Yetenek bazlı kullanım (hangi yetenek ne zaman kullanılmalı)
- Görev tipi-tipo bağlam eşlemesi (yeni API endpoint, yeni sayfa, debugging, refactoring)

**Dosya Okuma Stratejisi:**
- Cerrahi bağlam: yalnızca gerekli bölümler
- Desen takibi: tekrar eden yapıları tanı
- Referans sırası: önce kontekst, sonra detay
- Token bütçesi yönetimi

#### 1.6.2 module-dependencies.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/context-map/module-dependencies.md`
**Amaç:** Modül bağımlılık grafiği ve veri akış diyagramları

**İçerik:**
- Ana modül hiyerarşisi (Tenant kök)
- Finansal zincir: Invoice → InvoiceItem → ProductMovement → AccountMovement
- Stok zinciri: Product → ProductMovement → Warehouse/Location
- Cari zincir: Account → AccountMovement → Invoice/Collection
- İK zinciri: Employee → SalaryPlan/Advance/LeaveRequest
- Çek/Senet zinciri: CheckBill → CheckBillJournal → Endorsement → Collection → BankSubmission

**Modül Bağımlılık Matrisi:**
| Modül | Bağımlılıklar |
|-------|---------------|
| Invoice | Account, Product, StockMove, AccountMovement |
| Order | Account, Product, StockMove |
| CheckBill | Account, BankAccount, CheckBillJournal |
| WarehouseTransfer | Warehouse, Location, StockMove |

**Akış Diyagramları:**
- Fatura oluşturma akışı
- Depo transfer akışı

**Risk Noktaları:**
- Döngüsel bağımlılıklar
- N+1 sorgu tehlikesi
- Kod üretici kalıpları

---

### 1.7 Yetenek Dosyaları (Skills)

#### 1.7.1 prisma-erp-skill.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/skills/prisma-erp-skill.md`
**Amaç:** Bu ERP'ye özgü Prisma ORM kalıpları

**Kurallar:**
```
RULE #1: Her sorguda tenantId + deletedAt zorunlu
```

**Model İlişkileri:**
```
Invoice → AccountMovement → StockMovement zinciri
```

**Migration Kuralları:**
- Model/field eklerken dikkat
- Mevcut veri etkisi analizi
- Rollback planı

**N+1 Önleme:**
- `include` kalıpları kullanımı
- Batch sorguları

**Transaction Kuralları:**
- Isolation level seçimi
- Rollback senaryoları

#### 1.7.2 tenant-security-skill.md (EN ÖNEMLİ)

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/skills/tenant-security-skill.md`
**Amaç:** Çok kiracılı güvenlik kuralları

**7 Kritik Kural:**
```
RULE #1: tenantId her yerde - zorunlu
RULE #2: TenantContext middleware'den servislere kullanım
RULE #3: TenantGuard API controller'larda
RULE #4: Frontend x-tenant-id header injection
RULE #5: deletedAt ile yumuşak silme
RULE #6: Join table'larda tenantId gereksinimi
RULE #7: Subquery ve raw query'lerde tenantId
```

**RLS Entegrasyonu:**
```typescript
// Prisma extended client ile otomatik
prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const tenantId = ClsService.getTenantId();
        if (tenantId) {
          await prisma.$executeRaw`
            SELECT set_config('app.current_tenant_id', ${tenantId}, false)
          `;
        }
        return query(args);
      }
    }
  }
});
```

**Güvenlik Checklist:**
- [ ] tenantId sorgularda
- [ ] Kiracılar arası erişim yok
- [ ] Soft delete atlanmadı
- [ ] Audit logging kritik operasyonlarda

**Risk Senaryoları:**
- tenantId eksik: Veri sızıntısı
- Cross-tenant erişim: İzolasyon ihlali
- Soft delete atlatma: Kalıcı veri silme

#### 1.7.3 invoice-engine-skill.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/skills/invoice-engine-skill.md`
**Amaç:** Fatura oluşturma, güncelleme ve iptal iş kuralları

**Fatura Yaşam Döngüsü:**
```
DRAFT → PENDING → OPEN → CLOSED
                    ↘ CANCELLED
```

**Oluşturma Akışı:**
```
1. validate()        → Ürün, fiyat, miktar kontrolü
2. create()          → Fatura header
3. createItems()     → Kalemler
4. stockMovement()   → Stok hareketi
5. accountMovement() → Cari hareket
```

**Hesap Limiti ve Stok Validasyonu:**
- Hesap limiti aşımında hata
- Yetersiz stok durumunda uyarı

**Güncelleme Kuralları:**
- Sadece DRAFT statüsünde
- Kalem ekleme/çıkarma
- Miktar değişikliği

**İptal Kuralları:**
- Ödenmiş faturalar iptal edilemez
- Ters stok hareketi
- Ters cari hareket

**Fatura Tipleri:**
- SALES: Satış faturası
- PURCHASE: Satın alma faturası
- RETURN_SALES: Satış iade
- RETURN_PURCHASE: Satın alma iade

**E-Fatura Entegrasyonu:**
- Hızlı Bilişim API
- Senaryo seçimi
- XML depolama

#### 1.7.4 warehouse-skill.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/skills/warehouse-skill.md`
**Amaç:** Depo, lokasyon, transfer ve stok hareket operasyonları

**Depo Yapısı:**
```
Warehouse → Location → ProductLocationStock
```

**Stok Hesaplama:**
- Ürün bazlı
- Depo bazlı
- Lokasyon bazlı

**Stok Hareket Tipleri:**
| Tip | Açıklama |
|-----|----------|
| ENTRY | Giriş |
| EXIT | Çıkış |
| PUT_AWAY | Yerleştirme |
| TRANSFER | Transfer |
| PICKING | Toplama |
| ADJUSTMENT | Düzeltme |
| COUNT | Sayım |
| COUNT_SURPLUS | Sayım fazlası |
| COUNT_SHORTAGE | Sayım eksiği |

**Transfer Oluşturma:**
```typescript
await prisma.$transaction(async (tx) => {
  // Kaynak lokasyondan eksilt
  // Hedef lokasyona ekle (upsert)
  // Hareket logları oluştur
}, { isolationLevel: 'Serializable' })
```

**Transfer Durumları:**
```
PENDING → IN_TRANSIT → COMPLETED
                          ↘ CANCELLED
```

**Envanter Sayım İş Akışı:**
```
start → countItems() → complete() → variance adjustment
```

**Kritik Stok Uyarıları:**
- Minimum stok seviyesi
- Kritik stok bildirimi

**Negatif Stok Önleme:**
- Yetersiz stok kontrolü
- Blokaj kuralları

#### 1.7.5 datagrid-skill.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/skills/datagrid-skill.md`
**Amaç:** MUI DataGrid implementasyon standartları

**Temel Yapı:**
```typescript
<DataGrid
  rows={data}
  columns={columns}
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[25, 50, 100]}
/>
```

**Column Tanım Kalıpları:**
```typescript
const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Ad',
    flex: 1,
    minWidth: 150,
    renderCell: (params) => <strong>{params.value}</strong>
  },
  {
    field: 'status',
    headerName: 'Durum',
    width: 120,
    renderCell: (params) => <StatusBadge value={params.value} />
  }
];
```

**Özel Toolbar:**
- Filtreleme
- Sıralama
- Dışa aktarma (Excel/PDF)
- Toplu işlemler

**Sunucu Tarafı Sayfalaması:**
```typescript
const [paginationModel, setPaginationModel] = useState({
  page: 0,
  pageSize: 25
});

const { data } = useQuery({
  queryKey: ['items', paginationModel],
  queryFn: () => fetchItems(paginationModel)
});
```

**Action Column:**
```typescript
{
  field: 'actions',
  type: 'actions',
  getActions: (params) => [
    <GridActionsCellDIcon
      icon={<EditIcon />}
      label="Düzenle"
      onClick={() => navigate(`/items/${params.id}/edit`)}
    />
  ]
}
```

**KPI Header Kartları:**
```typescript
<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
  <KPICard title="Toplam" value={total} color="primary" />
  <KPICard title="Aktif" value={active} color="success" />
  <KPICard title=" Beklemede" value={pending} color="warning" />
</Box>
```

---

### 1.8 İş Akışı Dosyaları (Workflows)

#### 1.8.1 multi-agent-pipeline.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/workflows/multi-agent-pipeline.md`
**Amaç:** Karmaşık görevler için çoklu agent görev hattı

**Pipeline Mimarisi:**
```
User Request → Context Router → Worker Agent → Review Agent → Final Validation
```

**Görev Tipi-Agent Ataması:**
| Görev Tipi | Agent |
|------------|-------|
| Basit CRUD | Worker (tek başına) |
| Orta karmaşıklık | Worker + Review |
| Karmaşık/Finansal | Worker + Review + Critical Validation |

**Worker Agent (MiniMax) Prompt Şablonu:**
```
Sen bir ERP geliştiricisisin. Görev: {task}
Bağlam: {context}
Kısıtlamalar: {constraints}
Çıktı formatı: {output_format}
```

**Review Agent Prompt Şablonu:**
```
Kodu incele: {code}
Standartlar: {standards}
Hataları bul: {checklist}
```

**Critical Validation (Opus):**
- Finansal değişiklikler
- Güvenlik değişiklikleri
- Mimari değişiklikler

**Hata Yönetimi ve Retry:**
- 3 kez retry
- Exponential backoff
- Fallback stratejisi

**Performans Tahminleri:**
| Görev Tipi | Tahmini Süre |
|------------|-------------|
| Basit CRUD | 5-15 dakika |
| Form sayfası | 30-60 dakika |
| API endpoint | 15-30 dakika |
| Karmaşık rapor | 1-2 saat |

#### 1.8.2 frontend-page-patterns.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/workflows/frontend-page-patterns.md`
**Amaç:** Frontend sayfa oluşturma şablonları

**StandartPage Wrapper Kullanımı:**
```typescript
<StandardPage
  title="Cari Listesi"
  icon={<PeopleIcon />}
  breadcrumbs={[{ label: 'Cari Yönetimi' }, { label: 'Cari Listesi' }]}
>
  {/* Sayfa içeriği */}
</StandardPage>
```

**Liste Sayfası Şablonu:**
```typescript
export default function AccountListPage() {
  return (
    <StandardPage title="Cari Listesi" icon={<People />}>
      {/* KPI Kartları */}
      {/* Arama ve Filtreler */}
      {/* DataGrid */}
      {/* Pagination */}
    </StandardPage>
  );
}
```

**Detay Sayfası Şablonu:**
```typescript
export default function AccountDetailPage({ params }) {
  return (
    <StandardPage
      title="Cari Detay"
      breadcrumbs={[{ label: 'Cari Listesi', href: '/accounts' }, { label: params.id }]}
    >
      {/* Info Kartları */}
      {/* Action Butonları */}
      {/* Tablo/Liste */}
      {/* Audit Info */}
    </StandardPage>
  );
}
```

**Form Sayfası Şablonu:**
```typescript
export default function AccountFormPage() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form Alanları */}
      {/* Validation Errors */}
      {/* Submit Butonu */}
    </form>
  );
}
```

**Dialog/Modal Şablonu:**
```typescript
<Dialog open={open} onClose={onClose}>
  <DialogTitle>{title}</DialogTitle>
  <DialogContent>{content}</DialogContent>
  <DialogActions>
    <Button onClick={onClose}>İptal</Button>
    <Button onClick={onConfirm} variant="contained">Onayla</Button>
  </DialogActions>
</Dialog>
```

**Hook Yapısı:**
```typescript
// useQuery
const { data, isLoading, refetch } = useQuery({
  queryKey: QK.account_list(params),
  queryFn: () => accountService.getAll(params)
});

// useMutation
const { mutate, isPending } = useMutation({
  mutationFn: (data) => accountService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries(QK.account_list());
    notify('Başarıyla oluşturuldu', 'success');
  }
});
```

**Toast Bildirimleri:**
```typescript
import { notify } from '@/lib/notifications';

notify('Kayıt silindi', 'success');
notify('Hata oluştu', 'error');
```

**Satır Tıklama Navigasyonu:**
```typescript
onRowClick={(params) => router.push(`/accounts/${params.id}`)}
```

#### 1.8.3 backend-api-patterns.md

**Tam Yol:** `/home/azem/projects/muhasebe/.cursor/rules/workflows/backend-api-patterns.md`
**Amaç:** NestJS backend API geliştirme şablonları

**Modül Yapısı Şablonu:**
```typescript
@Module({
  imports: [PrismaModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}
```

**Controller Şablonu:**
```typescript
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('account')
@ApiTags('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiOperation({ summary: 'List all accounts' })
  findAll(@Query() filters: FilterAccountDto) {
    return this.accountService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findByIdOrThrow(id);
  }

  @Post()
  create(@Body() dto: CreateAccountDto, @CurrentUser() user) {
    return this.accountService.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.softDelete(id);
  }
}
```

**Service Şablonu:**
```typescript
@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private tenantContext: TenantContextService
  ) {}

  async findAll(filters: FilterAccountDto) {
    const tenantId = this.tenantContext.getTenantId();
    const where = buildTenantWhereClause(tenantId);
    // ... filters
    return this.prisma.account.findMany({ where, include: {...} });
  }

  async findByIdOrThrow(id: string) {
    const tenantId = this.tenantContext.getTenantId();
    const account = await this.prisma.account.findFirst({
      where: { id, ...buildTenantWhereClause(tenantId) }
    });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async create(dto: CreateAccountDto, userId: string) {
    const tenantId = this.tenantContext.getTenantId();
    return this.prisma.account.create({
      data: { ...dto, tenantId, createdBy: userId }
    });
  }

  async softDelete(id: string) {
    return this.prisma.account.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
```

**DTO Şablonu:**
```typescript
export class CreateAccountDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsOptional()
  @IsString()
  taxId?: string;
}

export class FilterAccountDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}
```

**Transaction Kalıbı:**
```typescript
async complexOperation(dto: ComplexDto) {
  return this.prisma.$transaction(async (tx) => {
    const account = await tx.account.create({ data: {...} });
    await tx.accountMovement.create({ data: {...} });
    await tx.productMovement.create({ data: {...} });
    return account;
  }, { isolationLevel: 'Serializable' });
}
```

---

## Bölüm 2: Global Cursor Yetenekleri (`~/.cursor/skills-cursor/`)

Tüm global Cursor yetenekleri `/home/azem/.cursor/skills-cursor/` dizininde bulunur.

### 2.1 automate/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/automate/SKILL.md`
**Amaç:** Cursor Otomasyonları oluşturma

**Trigger Seçenekleri:**
- Schedule (zamanlanmış)
- GitHub (push, PR, vb.)
- Slack (mesaj, vb.)
- Linear (issue, vb.)
- PagerDuty (alert, vb.)
- Sentry (hata, vb.)
- Webhook (özel)

**Araç Seçenekleri:**
- `gitPr`: Git PR işlemleri
- `prComment`: PR yorumu
- `slack`: Slack mesajı
- `readSlack`: Slack okuma
- `requestReviewers`: Reviewer talebi
- `manageCheckRun`: CI check yönetimi
- MCP çağrıları

**İş Akışı:**
1. Entegrasyon keşfi (sorular sormadan önce)
2. Draft tablo ile onay
3. Editör açma

---

### 2.2 babysit/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/babysit/SKILL.md`
**Amaç:** PR merge-ready tutma

**Görevler:**
1. Merge conflict çözümü (akıllı)
2. Yorum triage ve çözümü
3. CI hatalarını düzeltme (PR değişikliklerinden kaynaklanan)
4. Retry döngüsü (mergeable + green + yorumlar triaged olana kadar)

**Kural:**
- CI check'lerini geçirmek için değiştirme (hatalı check'leri düzeltme değil)
- Çözülmüş thread'leri önce filtrele
- Yorumları kategorize et (blocking, non-blocking, nitpick)

---

### 2.3 canvas/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/canvas/SKILL.md`
**Amaç:** Cursor Canvas ile analitik çıktılar oluşturma

**Kullanım Alanları:**
- Kantitatif analizler
- Fatura soruşturmaları
- Güvenlik denetimleri
- Mimari incelemeler
- Veri yoğun içerik
- Tablolar (çok satır)
- Zaman çizelgeleri
- Grafikler

**Dosya Konumu:**
```
~/.cursor/projects/<workspace>/canvases/<name>.canvas.tsx
```

**Import Kuralları:**
```typescript
import { Canvas, ... } from 'cursor/canvas';
// Sadece cursor/canvas'den import
// Tüm veri inline (fetch yok)
```

**Tasarım Rehberi:**
- Görsel hiyerarşi: Başlık → Açıklama → İçerik → Etiketler
- Gradient, emoji, box-shadow, rainbow coloring YASAK
- Mevcut tema renklerini kullan

**Teslimat Öncesi Kontrol:**
- Kod derlenebilir mi?
- Veri doğru mu?
- Layout düzgün mü?

---

### 2.4 create-hook/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/create-hook/SKILL.md`
**Amaç:** Cursor hook'ları oluşturma

**Hook Türleri:**
- **Proje hook'ları:** `.cursor/hooks.json` ve `.cursor/hooks/*`
- **Kullanıcı hook'ları:** `~/.cursor/hooks.json` ve `~/.cursor/hooks/*`

**Hook Event'leri:**
| Event | Açıklama |
|-------|----------|
| `sessionStart` | Oturum başladığında |
| `sessionEnd` | Oturum bittiğinde |
| `preToolUse` | Tool kullanılmadan önce |
| `postToolUse` | Tool kullanıldıktan sonra |
| `subagentStart` | Alt agent başladığında |
| `beforeShellExecution` | Shell komutu öncesi |
| `beforeMCPExecution` | MCP çağrısı öncesi |

**Matcher'lar:**
- `tool`: Belirli tool'u filtrele
- `path`: Dosya yoluna göre filtrele
- `content`: İçerik kalıbına göre filtrele

**Command Hook Örneği:**
```json
{
  "trigger": "sessionStart",
  "command": "echo 'Oturum başladı'"
}
```

**Prompt Hook Örneği:**
```json
{
  "trigger": "preToolUse",
  "matcher": { "tool": "Write" },
  "prompt": "Dosya yazmadan önce kontrol listesi:\n1. Syntax doğru?\n2. Import'lar tam?"
}
```

---

### 2.5 create-rule/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/create-rule/SKILL.md`
**Amaç:** Cursor kuralları oluşturma (kalıcı AI rehberliği)

**Dosya Konumu:**
```
.cursor/rules/<rule-name>.mdc
```

**YAML Frontmatter:**
```yaml
---
description: Kuralın açıklaması
globs:
  - "**/*.ts"
  - "**/*.tsx"
alwaysApply: false
---
```

**Kurallar:**
- Kısa tut (50 satır altı)
- Tek endişe per rule
- Doğru/yanlış örnekleri ile

**Örnek:**
```markdown
---
description: TypeScript'de açık tipler zorunlu
globs:
  - "**/*.ts"
  - "**/*.tsx"
---

# Explicit Types Required

Her fonksiyon parametresi ve return değeri için açık tip kullan.

✅ Good: `function add(a: number, b: number): number`
❌ Bad: `function add(a, b) { return a + b }`

Implicit `any` kullanma. Тип script strict modunu etkinleştir.
```

---

### 2.6 create-skill/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/create-skill/SKILL.md`
**Amaç:** Cursor Agent Yetenekleri (Skills) oluşturma

**Konum:**
- **Kişisel:** `~/.cursor/skills/<skill-name>/`
- **Proje:** `.cursor/skills/<skill-name>/`

**SKILL.md Yapısı:**
```yaml
---
name: skill-name
description: Yeteneğin açıklaması (3-5 satır)
disable-model-invocation: false  # Opsiyonel
---

# Detaylı içerik

Yetenek kullanıldığında gösterilecek TAM içerik.
500 satır altında tut.
İlerleyen açıklama: SKILL.md'de esas, detaylı referans dosyalarında.
```

**Keşif İpuçları:**
- "Use proactively" dili kullan
- Üçüncü şahıs açıklamaları

**İyi Örnek:**
```markdown
---
name: pr-review
description: Pull request'leri incele, değişiklikleri özetle, sorunlu kodları işaretle.
---

Bu yetenek PR diff'lerini inceler. Kullanım:

1. `gh pr diff` ile değişiklikleri al
2. Dosya bazında grupla
3. Sorunlu kalıpları işaretle:
   - Memory leak
   - Race condition
   - Performans darboğazı

Her sorun için:
- Dosya ve satır
- Sorun açıklaması
- Önerilen düzeltme
```

---

### 2.7 create-subagent/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/create-subagent/SKILL.md`
**Amaç:** Özel alt-agent'lar oluşturma (özel görevler için)

**Konum:**
- **Proje:** `.cursor/agents/<agent-name>.md`
- **Kullanıcı:** `~/.cursor/agents/<agent-name>.md`

**YAML Frontmatter:**
```yaml
---
name: code-reviewer
description: Pull request'leri kod kalitesi açısından inceleyen alt-agent.
---
```

**Sistem Prompt:**
Agent'ın nasıl davranacağını açıklayan görev tanımı.

**Örnek Alt-Agent'lar:**
- `code-reviewer`: PR inceleme uzmanı
- `debugger`: Hata ayıklama uzmanı
- `data-scientist`: Veri analizi uzmanı

---

### 2.8 loop/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/loop/SKILL.md`
**Amaç:** Tekrarlayan aralıklarla prompt çalıştırma

**Zamanlama Formatları:**
- `30s` - 30 saniye
- `5m` - 5 dakika
- `2h` - 2 saat
- `1d` - 1 gün

**Türler:**

**1. Fixed Schedule (arka plan shell döngüsü):**
```
/loop 5m /prompt-to-run
```
Arka planda sentinel ile döngü başlatır.

**2. Dynamic Schedule (agent kendi temposuna göre):**
Agent olaylara dayalı olarak kendini tekrar çağırır.

**Tekil Sentinel:**
Her döngü benzersiz sentinel kullanır (çakışmayı önler).

**Payload Formatı:**
```json
{
  "prompt": "Prompt içeriği",
  "metadata": { "key": "value" }
}
```

---

### 2.9 migrate-to-skills/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/migrate-to-skills/SKILL.md`
**Amaç:** Mevcut .mdc kurallarını ve .md komutlarını yetenek formatına dönüştürme

**Dönüştürme Kuralları:**

1. `.cursor/rules/*.mdc` → `SKILL.md`:
   - `description` koru
   - `globs` kaldır
   - `alwaysApply: true` kaldır
   - Gövdeyi olduğu gibi aktar

2. `.cursor/commands/*.md` → `SKILL.md`:
   - Tüm .md dosyalarını dönüştür
   - Aynı frontmatter formatı

---

### 2.10 sdk/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/sdk/SKILL.md`
**Amaç:** Cursor SDK (@cursor/sdk veya cursor_sdk Python) ile uygulama geliştirme

**Üç Çağrı Kalıbı:**

**1. Agent.prompt() - Tek seferlik:**
```typescript
const agent = new Agent({ model: 'claude-sonnet' });
const result = await agent.prompt('Yapay zeka hakkında bir şiir yaz');
console.log(result.message.content);
```

**2. Agent.create() + agent.send() - Sürekli:**
```typescript
const agent = await Agent.create({
  model: 'claude-sonnet',
  system: 'Sen bir yardımcı asistanısın'
});
agent.send('Bugün hava nasıl?');
// ... daha fazla mesaj
await agent.end();
```

**3. Agent.resume() - Devam ettirme:**
```typescript
// Agent çalışmasını durdur
const agentId = await Agent.create({...});
// Sonra devam ettir
await agent.resume(agentId, 'Şimdi Türkçe çevir');
```

**Runtime Seçimi:**
- `local`: Yerel makinede çalışır
- `cloud`: Bulutta çalışır (daha güçlü)

**En Çok Yapılan 5 Hata:**

1. **Yanlış runtime seçimi:** Yerel mi bulut mu kararı
2. **Başarısızlık yanlış yorumlama:** Her hata sistem hatası değil
3. **Disposal unutma:** `agent.end()` çağrısı
4. **Streaming vs wait():** İkisini karıştırma
5. **Desteklenmeyen run operasyonları:** `run.stream()` vs `run.messages()`

**MCP Sunucu Yapılandırması:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

**Üretim En İyi Pratikleri:**
- Disposal: `try/finally` ile `agent.end()`
- Exit kodları: Başarı 0, hata 1
- Log ID'leri: İzlenebilirlik için
- Retry mantığı: Geçici hatalar için

---

### 2.11 shell/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/shell/SKILL.md`
**Amaç:** `/shell` komutu ile shell komutu çalıştırma

**Kullanım:**
```
/shell <komut>
```

**Kurallar:**
- Komutu olduğu gibi çalıştır
- Açıklama veya değişiklik YAPMA
- Exit status ve çıktıyı raporla

---

### 2.12 split-to-prs/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/split-to-prs/SKILL.md`
**Amaç:** Çalışmayı küçük incelenebilir PR'lara bölme

**Kurallar:**

1. **Asla branch/commit/push yapma** kullanıcı onaylayana kadar
2. **Kullanıcı çalışmasını atma** onay almadan
3. **Kurtarılabilir snapshot** al (çalışmayı kaydet)
4. **Sadece adlandırılmış dosya/hunk'ları stage et**
5. **Reviewer hizalamasına optimize et** (ilgili değişiklikler aynı PR'da)
6. **PR başlık ve URL'lerini raporla**

**Kullanım:**
```
/split-to-prs
```

---

### 2.13 statusline/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/statusline/SKILL.md`
**Amaç:** CLI durum çubuğu yapılandırma

**Konum:** `~/.cursor/cli-config.json`

**İçerik Formatı:**
```json
{
  "statusline": {
    "left": ["session", "model"],
    "right": ["context", "git", "time"]
  }
}
```

**Cmd Fonksiyonu:**
JSON payload'ı stdin'den alır:
```json
{
  "session": { "id": "abc", "project": "muhasebe" },
  "model": "claude-sonnet-4",
  "context": { "used": 30000, "limit": 100000 },
  "git": { "branch": "main", "status": "clean" },
  "time": "14:32"
}
```

**Görüntü:**
- Birden fazla satır desteklenir
- ANSI renkleri desteklenir
- Boşluk ve separator'lar kullanılabilir

---

### 2.14 update-cursor-settings/SKILL.md

**Tam Yol:** `/home/azem/.cursor/skills-cursor/update-cursor-settings/SKILL.md`
**Amaç:** Cursor/VSCode settings.json değişiklikleri

**Konum (işletim sistemine göre):**
- macOS: `~/Library/Application Support/Cursor/User/settings.json`
- Windows: `%APPDATA%\Cursor\User\settings.json`
- Linux: `~/.config/Cursor/User/settings.json`

**Kullanım:**
1. Mevcut settings'i oku
2. Koru, sadece istenen değişiklikleri uygula
3. JSON içinde yorum desteklenir

**Yaygın Ayarlar:**
```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "workbench.colorTheme": "Visual Studio Dark"
}
```

---

## Bölüm 3: Eklenti Yetenekleri (`~/.cursor/plugins/cache/`)

### 3.1 pr-review-canvas/SKILL.md

**Tam Yol:** `/home/azem/.cursor/plugins/cache/cursor-public/pr-review-canvas/683cdbda983ea8be4b766ac3fe94b7b88e7f75ad/skills/pr-review-canvas/SKILL.md`
**Amaç:** PR diff incelemesini Canvas olarak render etme

**Kullanım:**
1. Canvas yeteneğini oku
2. `gh pr diff <pr>` ile diff'i al
3. Değişiklikleri gruplandır:
   - **Core logic:** Temel iş mantığı
   - **Wiring:** Bağlantı kodu
   - **Boilerplate:** Tekrarlayan kod
4. Karmaşık mantığı pseudocode'a dönüştür
5. Somut örneklerle trace et
6. Sorunlu yerleri işaretle:
   - `Subtle`: İnce ama önemli
   - `Breaking`: Kırılma noktası
   - `Race condition`: Yarış durumu
   - `Perf`: Performans

**Zorunlu:**
- PR link'i sağlanmalı (geçmişten çıkarım YOK)

---

### 3.2 shadcn/SKILL.md

**Tam Yol:** `/home/azem/.cursor/plugins/cache/cursor-public/shadcn/5927f6de8064b152482d1f1ba52e59a51f5d9123/skills/shadcn/SKILL.md`
**Amaç:** shadcn/ui bileşenlerini ve projelerini yönetme

**Kullanım:**
1. Proje paket çalıştırıcısını belirle (`npx`, `pnpm dlx`, `bunx --bun shadcn@latest`)
2. `npx shadcn@latest search` ile mevcut bileşenleri kontrol et
3. Önce mevcut bileşenleri kullan
4. Oluştur, yeniden icat etme

**Kritik Kurallar:**
- `className` layout için kullan
- `gap-*` (space-y-* değil)
- `size-*` eşit boyutlar için

**Form Pattern:**
```
FieldGroup + Field
```

**Component Gruplama:**
Tüm bileşenler Group içinde olmalı:
```
SelectItem → SelectGroup
```

**Kullanım Adımları:**
1. Bileşeni kullanmadan önce `npx shadcn@latest docs <component>` çalıştır
2. Mevcut bileşenleri tercih et
3. Özel markup'tan kaçın

---

## Özet Tablosu

| # | Dosya | Konum | Amaç |
|---|-------|-------|------|
| **Proje Kuralları** |
| 1 | `CODING_STANDARDS.md` | `.cursor/rules/` | TypeScript, NestJS, React kodlama standartları |
| 2 | `AGENT_WORKFLOW.md` | `.cursor/rules/` | AI agent çalışma metodolojisi |
| 3 | `CURSOR_SYSTEM_PROMPT.md` | `.cursor/rules/` | Proje kimliği ve kritik kurallar |
| 4 | `DEBUGGING_GUIDE.md` | `.cursor/rules/` | Sistematik hata ayıklama yaklaşımı |
| 5 | `ADR-001-tenant-isolation.md` | `.cursor/rules/decisions/` | Kiracı izolasyon mimari kararı |
| 6 | `ADR-002-soft-delete.md` | `.cursor/rules/decisions/` | Yumuşak silme mimari kararı |
| 7 | `ADR-003-financial-transactions.md` | `.cursor/rules/decisions/` | Finansal işlem mimari kararı |
| 8 | `module-context-map.md` | `.cursor/rules/context-map/` | Görev-tipo dosya eşlemesi |
| 9 | `module-dependencies.md` | `.cursor/rules/context-map/` | Modül bağımlılık grafikleri |
| 10 | `prisma-erp-skill.md` | `.cursor/rules/skills/` | Prisma ORM kalıpları |
| 11 | `tenant-security-skill.md` | `.cursor/rules/skills/` | Çok kiracılı güvenlik (EN ÖNEMLİ) |
| 12 | `invoice-engine-skill.md` | `.cursor/rules/skills/` | Fatura iş kuralları |
| 13 | `warehouse-skill.md` | `.cursor/rules/skills/` | Depo operasyonları |
| 14 | `datagrid-skill.md` | `.cursor/rules/skills/` | MUI DataGrid standartları |
| 15 | `multi-agent-pipeline.md` | `.cursor/rules/workflows/` | Çoklu agent görev hattı |
| 16 | `frontend-page-patterns.md` | `.cursor/rules/workflows/` | Frontend sayfa şablonları |
| 17 | `backend-api-patterns.md` | `.cursor/rules/workflows/` | Backend API şablonları |
| **Global Cursor Yetenekleri** |
| 18 | `automate/SKILL.md` | `~/.cursor/skills-cursor/` | Otomasyon oluşturma |
| 19 | `babysit/SKILL.md` | `~/.cursor/skills-cursor/` | PR merge-ready tutma |
| 20 | `canvas/SKILL.md` | `~/.cursor/skills-cursor/` | Canvas analitik çıktılar |
| 21 | `create-hook/SKILL.md` | `~/.cursor/skills-cursor/` | Hook oluşturma |
| 22 | `create-rule/SKILL.md` | `~/.cursor/skills-cursor/` | Kural oluşturma |
| 23 | `create-skill/SKILL.md` | `~/.cursor/skills-cursor/` | Yetenek oluşturma |
| 24 | `create-subagent/SKILL.md` | `~/.cursor/skills-cursor/` | Alt-agent oluşturma |
| 25 | `loop/SKILL.md` | `~/.cursor/skills-cursor/` | Tekrarlayan prompt |
| 26 | `migrate-to-skills/SKILL.md` | `~/.cursor/skills-cursor/` | Kuralları dönüştürme |
| 27 | `sdk/SKILL.md` | `~/.cursor/skills-cursor/` | Cursor SDK kullanımı |
| 28 | `shell/SKILL.md` | `~/.cursor/skills-cursor/` | Shell komutu çalıştırma |
| 29 | `split-to-prs/SKILL.md` | `~/.cursor/skills-cursor/` | PR'lara bölme |
| 30 | `statusline/SKILL.md` | `~/.cursor/skills-cursor/` | CLI durum çubuğu |
| 31 | `update-cursor-settings/SKILL.md` | `~/.cursor/skills-cursor/` | Cursor ayarları |
| **Eklenti Yetenekleri** |
| 32 | `pr-review-canvas/SKILL.md` | `~/.cursor/plugins/cache/` | PR diff Canvas render |
| 33 | `shadcn/SKILL.md` | `~/.cursor/plugins/cache/` | shadcn/ui bileşen yönetimi |

---

*Bu dokümantasyon /home/azem/projects/muhasebe dizini üzerinden hazırlanmıştır.*
*Son güncelleme: 30 Mayıs 2026*