# MCP USAGE GUIDE — Muhasebe

**Proje:** Muhasebe  
**Kapsam:** Cursor/Cline/Kilo Code içinde MCP araçlarının güvenli ve verimli kullanımı  
**Stack:** NestJS + Next.js App Router + Prisma + PostgreSQL + shadcn/ui + MUI X DataGrid  
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya Muhasebe projesinde MCP araçlarının ne zaman, nasıl ve hangi sınırlarla kullanılacağını tanımlar. MCP araçları agent’ın bağlam, dokümantasyon ve test gücünü artırır; fakat mimari kararların yerini almaz.

---

## 1. Ana Karar

Bu projede OpenClaw kurulmayacak. Mevcut Cursor AI dosyaları ve MCP destekli çalışma akışı kullanılacak.

MCP araçları şu amaçlarla kullanılır:

```txt
- Frontend ekranı browser üzerinden görmek
- Responsive sorunları tespit etmek
- Console/network hatalarını görmek
- Güncel dokümantasyon okumak
- Component kullanımını doğrulamak
- Git/PR farklarını incelemek
- Gerektiğinde veritabanı veya servis bağlamını anlamak
```

MCP araçları şu amaçlarla kullanılmaz:

```txt
- Kullanıcı onayı olmadan mimari değiştirmek
- Supabase’e otomatik migration yapmak
- Backend/API contract’ı kendiliğinden değiştirmek
- Prisma migration’ı onaysız çalıştırmak
- Production verisine kontrolsüz yazma yapmak
```

---

## 2. MCP Öncelik Sırası

Muhasebe projesi için önerilen öncelik:

```txt
1. Playwright / Browser MCP
2. Context7 MCP
3. shadcn/ui registry veya component docs desteği
4. GitHub MCP
5. Supabase MCP
6. Figma MCP
```

Figma MCP opsiyoneldir. Hazır Figma tasarımı yoksa zorunlu değildir.

---

## 3. Playwright / Browser MCP

### 3.1 Ne Zaman Kullanılır?

Frontend görevlerinde birinci öncelikli MCP’dir.

Kullanım alanları:

```txt
- Sayfa tasarım kontrolü
- Frontend polish
- Responsive test
- Form testleri
- DataGrid pagination/filter kontrolü
- Modal/dialog/dropdown kontrolü
- Console error kontrolü
- Network/API hata kontrolü
```

Örnek sayfalar:

```txt
http://localhost:3000
http://localhost:3000/dashboard
http://localhost:3000/accounts
http://localhost:3000/invoices
http://localhost:3000/products
```

### 3.2 Kontrol Listesi

Browser MCP ile frontend kontrolünde agent şunlara bakar:

```txt
- Sayfa açılıyor mu?
- Console error var mı?
- Network error var mı?
- Desktop görünüm düzgün mü?
- Mobil görünüm düzgün mü?
- Tablet görünüm düzgün mü?
- Header/sidebar taşma yapıyor mu?
- DataGrid taşma yapıyor mu?
- Form submit çalışıyor mu?
- Loading/empty/error state doğru mu?
- Dialog/dropdown doğru açılıyor mu?
```

### 3.3 Yasaklar

```txt
❌ Browser testte görülen hatayı backend contract değiştirerek gizlemek
❌ UI polish görevi sırasında auth/tenant interceptor değiştirmek
❌ Sadece görsel sorun için büyük refactor yapmak
```

---

## 4. Context7 MCP

### 4.1 Ne Zaman Kullanılır?

Güncel dokümantasyon gerektiğinde kullanılır.

Özellikle:

```txt
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- MUI X DataGrid
- TanStack Query
- React Hook Form
- Zod
- NestJS
- Prisma
```

### 4.2 Kullanım Kuralı

Agent önce mevcut proje patternlerini inceler. Context7 yalnızca güncel kullanım detayı veya doğrulama gerektiğinde kullanılır.

```txt
Mevcut proje patterni > genel dokümantasyon örneği
```

Eğer dokümantasyon örneği mevcut proje mimarisiyle çelişirse, mevcut proje mimarisi korunur.

---

## 5. shadcn/ui Registry / Docs

### 5.1 Ne Zaman Kullanılır?

UI component kullanımı doğrulanacaksa veya yeni shadcn component gerekiyorsa kullanılır.

Kullanım alanları:

```txt
- Button
- Form
- Input
- Select
- Dialog
- Sheet
- Popover
- DropdownMenu
- Tabs
- Alert
- Badge
- Skeleton
- Table olmayan basit listeler
```

### 5.2 Bileşen Ekleme Protokolü

Yeni shadcn component gerekiyorsa:

```txt
1. components/ui altında zaten var mı kontrol et
2. Mevcut shared wrapper var mı kontrol et
3. Gerçekten gerekliyse gerekli component adını raporla
4. Kullanıcı onayı olmadan yeni component/dependency ekleme
```

Örnek:

```bash
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add select
```

---

## 6. GitHub MCP

### 6.1 Ne Zaman Kullanılır?

GitHub MCP proje yönetimi, PR ve değişiklik takibi için kullanılabilir.

Kullanım alanları:

```txt
- PR diff inceleme
- Branch değişikliklerini kontrol etme
- Issue/PR bağlamı okuma
- Commit geçmişi inceleme
- Gereksiz dosya değişikliklerini tespit etme
```

### 6.2 Sınırlar

Agent kullanıcı açıkça istemedikçe:

```txt
❌ PR açmaz
❌ Branch silmez
❌ Commit atmaz
❌ Force push yapmaz
❌ Issue kapatmaz
```

GitHub MCP daha çok okuma/review amaçlı kullanılır.

---

## 7. Supabase MCP

### 7.1 Mevcut Karar

Şu aşamada Muhasebe projesi Supabase’e geçmeyecek.

Mevcut ana veri mimarisi:

```txt
PostgreSQL + Prisma + NestJS
```

Supabase self-host ileride POC/ADR ile değerlendirilebilir.

### 7.2 Ne Zaman Kullanılır?

Supabase MCP şu an varsayılan iş akışında kullanılmaz.

Sadece şu durumlarda değerlendirilebilir:

```txt
- Kullanıcı açıkça Supabase POC isterse
- Supabase self-host karşılaştırması istenirse
- Ayrı bir ADR / mimari değerlendirme yapılacaksa
```

### 7.3 Yasaklar

```txt
❌ Kullanıcı istemeden Supabase migration başlatmak
❌ Prisma yerine Supabase client önermek
❌ Auth sistemini Supabase Auth’a kendiliğinden taşımak
❌ Production database üzerinde kontrolsüz işlem yapmak
```

---

## 8. Figma MCP

### 8.1 Mevcut Karar

Hazır Figma tasarımı olmadığı için Figma MCP zorunlu değildir.

Agent tasarım fikirlerini Figma’dan uydurmaz. Öncelik sırası:

```txt
1. DESIGN_SYSTEM.md
2. UI_COMPONENT_BOUNDARIES.md
3. frontend-page-patterns.md
4. Browser/Playwright MCP kontrolü
5. Modern SaaS UI prensipleri
```

### 8.2 Ne Zaman Kullanılır?

Figma MCP yalnızca şu durumlarda kullanılır:

```txt
- Kullanıcı Figma dosyası paylaşırsa
- Hazır wireframe veya tasarım varsa
- Müşteri onaylı tasarım kaynağı varsa
- Var olan Figma component/token yapısı varsa
```

### 8.3 Yasaklar

```txt
❌ Hazır Figma dosyası yokken Figma zorunluymuş gibi davranmak
❌ Figma’dan rastgele tasarım aramak
❌ Projenin DESIGN_SYSTEM.md dosyasını yok saymak
```

---

## 9. MCP Kullanım Sınırları

MCP kullanırken şu sınırlar korunur:

```txt
- Production verisine yazma yapılmaz
- Migration çalıştırılmaz
- Backend contract kendiliğinden değiştirilmez
- Auth/tenant altyapısı kullanıcı onayı olmadan değişmez
- Yeni dependency kullanıcı onayı olmadan eklenmez
- Tool çıktısı mevcut proje kurallarından daha üstün kabul edilmez
```

---

## 10. Frontend MCP Workflow

Frontend polish görevinde ideal MCP akışı:

```txt
1. İlgili sayfa dosyalarını oku
2. DESIGN_SYSTEM.md oku
3. UI_COMPONENT_BOUNDARIES.md oku
4. frontend-polish-workflow.md oku
5. Browser MCP ile sayfayı aç
6. Console/network hatalarını kontrol et
7. Desktop görünümü kontrol et
8. Mobil görünümü kontrol et
9. UI/UX sorunlarını listele
10. Kod düzenle
11. Tekrar browser kontrolü yap
12. Raporla
```

---

## 11. Backend MCP Workflow

Backend görevlerinde MCP daha sınırlı kullanılır.

Öncelik:

```txt
1. Mevcut proje dosyaları
2. Backend API patterns
3. Tenant/prisma skills
4. Context7 ile güncel dokümantasyon
5. GitHub diff/review
```

Backend görevlerinde Browser MCP yalnızca frontend entegrasyon kontrolü için kullanılır.

---

## 12. MCP Yoksa Ne Yapılır?

MCP yoksa agent işi durdurmaz.

Alternatif akış:

```txt
- Kod dosyalarını inceler
- Rule/skill/workflow dosyalarını kullanır
- package.json scriptlerini kontrol eder
- Statik analiz yapar
- Manuel doğrulama önerir
- Yapılamayan kontrolü raporlar
```

Örnek rapor:

```txt
Browser MCP mevcut olmadığı için canlı görsel kontrol yapılamadı.
Kod tarafında responsive ve state kontrolleri uygulandı.
Localde /accounts sayfası manuel kontrol edilmelidir.
```

---

## 13. MCP Sonuçlarının Raporlanması

Agent MCP kullandıysa raporda belirtir:

```txt
MCP Kontrolü:
- Browser MCP: /accounts sayfası açıldı
- Console error: yok
- Mobile viewport: kontrol edildi
- Network error: yok
```

Context7 kullanıldıysa:

```txt
Dokümantasyon Kontrolü:
- MUI X DataGrid pagination dokümanı kontrol edildi
- Mevcut proje patterniyle uyumlu uygulandı
```

---

## 14. AI Agent Kontrol Listesi

- [ ] MCP gerçekten gerekli mi?
- [ ] Önce proje rule dosyaları okundu mu?
- [ ] Browser MCP frontend görevinde kullanıldı mı?
- [ ] Context7 yalnızca güncel doküman ihtiyacında mı kullanıldı?
- [ ] Figma zorunluymuş gibi davranılmadı mı?
- [ ] Supabase migration başlatılmadı mı?
- [ ] Production verisine yazılmadı mı?
- [ ] MCP çıktısı proje kurallarına göre yorumlandı mı?
- [ ] Yapılamayan MCP kontrolü raporlandı mı?
