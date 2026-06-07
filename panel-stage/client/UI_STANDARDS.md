# UI STANDARDS — Muhasebe

**Durum:** Aktif yönlendirme dosyası  
**Proje:** Muhasebe  
**Kapsam:** `panel-stage/client` frontend tasarım kararları  
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya artık ana tasarım standardı değildir. Muhasebe projesinde frontend tasarım, UI/UX polish ve component kararları için ana kaynak `.cursor/rules` klasörüdür.

---

## 1. Ana Kaynak

Frontend tasarım veya sayfa düzenleme görevi yapılırken AI agent şu dosyaları esas almalıdır:

```txt
.cursor/rules/00-PROJECT_IDENTITY.md
.cursor/rules/01-AGENT_WORKFLOW.md
.cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
.cursor/rules/workflows/frontend-page-patterns.md
.cursor/rules/workflows/frontend-polish-workflow.md
.cursor/rules/workflows/datagrid-patterns.md
```

Bu dosya yalnızca `panel-stage/client` içindeki eski UI standartlarının yeni kurallarla çakışmasını önlemek için tutulur.

---

## 2. Eski Standartların Durumu

Eski `OtoMuhasebe UI Standartları` içeriği aktif geliştirme talimatı değildir.

Aşağıdaki eski kararlar yeni tasarım görevlerinde ana kaynak kabul edilmez:

```txt
- OtoMuhasebe proje adı
- MUI ThemeProvider merkezli yeni UI geliştirme
- Yeni sayfalarda MUI Material component kullanımını teşvik eden kurallar
- Eski prompt/faz yapısına göre sayfa üretimi
```

Proje adı her yerde:

```txt
Muhasebe
```

olarak kullanılmalıdır.

---

## 3. panel-stage/client İçin Geçiş Kuralı

`panel-stage/client` içinde mevcut çalışan sayfalarda eski componentler bulunabilir.

Geçiş yaklaşımı:

```txt
1. Mevcut çalışan business logic korunur.
2. Backend, API contract, Prisma, auth ve tenant mekanizması değiştirilmez.
3. Yeni UI geliştirmelerinde .cursor/rules kuralları esas alınır.
4. MUI Material yeni kodda kullanılmaz.
5. MUI X yalnızca DataGrid için kullanılır.
6. shadcn/ui ana UI component sistemi olarak kullanılır.
7. lucide-react ikon sistemi olarak kullanılır.
8. Tailwind CSS layout ve spacing için kullanılır.
```

---

## 4. Eski Componentler İçin Kural

Mevcut projede şu eski componentler varsa agent önce mevcut kullanımı inceler:

```txt
StandardPage
PageContainer
StandardCard
design-system.css
ClientProviders.tsx
```

Bu componentler hâlâ aktif sayfalarda kullanılıyorsa:

```txt
- Büyük çaplı toplu migration yapılmaz.
- Dokunulan sayfada kontrollü ve küçük geçiş yapılır.
- Business logic değiştirilmez.
- Tasarım dili .cursor/rules ile hizalanır.
```

---

## 5. POS İstisnası

Eğer proje içinde POS ekranları varsa, POS ekranları dokunmatik kullanım gereksinimleri nedeniyle ayrı değerlendirilebilir.

Ancak POS dışındaki yeni frontend geliştirmelerinde ana kaynak yine `.cursor/rules` dosyalarıdır.

---

## 6. Kısa Kullanım

Tasarım görevi verirken şu kısa komut yeterlidir:

```txt
Bu sayfayı Muhasebe frontend polish workflow’a göre profesyonel hale getir.
```

Daha güvenli kullanım:

```txt
Bu sayfayı Muhasebe frontend polish workflow’a göre profesyonel hale getir. Sadece frontend/UI/UX düzenlemesi yap; backend, API, Prisma, auth, tenant ve finansal işlem mantığına dokunma.
```

---

## 7. Agent Kontrol Listesi

- [ ] Ana kaynak olarak `.cursor/rules` okundu mu?
- [ ] Proje adı Muhasebe olarak kullanıldı mı?
- [ ] Eski OtoMuhasebe/AzemTarim bağlamı kullanılmadı mı?
- [ ] Yeni kodda MUI Material kullanılmadı mı?
- [ ] MUI X sadece DataGrid için mi kullanıldı?
- [ ] shadcn/ui ve Tailwind standardı korundu mu?
- [ ] Backend/API/auth/tenant/Prisma mantığına dokunulmadı mı?
