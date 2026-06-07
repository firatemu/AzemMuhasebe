# PROJECT IDENTITY — Muhasebe

**Proje Adı:** Muhasebe  
**Kapsam:** Çok kiracılı KOBİ muhasebe / ERP sistemi  
**Stack:** NestJS + Next.js App Router + TypeScript + Prisma + PostgreSQL + Redis + Tailwind CSS + shadcn/ui + MUI X DataGrid  
**Dil:** Türkçe  
**Agent Yanıt Dili:** Türkçe
AI agent kullanıcıya dönen tüm final raporları, özetleri ve açıklamaları Türkçe yazmalıdır. Kod, terminal çıktısı, hata mesajı, dosya yolu ve teknik identifier’lar orijinal dilinde kalabilir.
**Son Güncelleme:** 31 Mayıs 2026

> Bu dosya Cursor AI agent için projenin ana kimlik kaynağıdır. Agent herhangi bir görevde proje adı, ürün kapsamı, mimari yaklaşım veya teknik sınırlar hakkında kararsız kalırsa önce bu dosyayı esas alır.

---

## 1. Resmi Proje Adı

Bu projenin tek ve resmi adı:

```txt
Muhasebe
```

Aşağıdaki isimler yeni dokümantasyonda, UI metinlerinde, kod yorumlarında, promptlarda ve agent kurallarında kullanılmaz:

```txt
AzemTarim
AzemTarım
AzemTarim ERP
OtoMuhasebe
Azem OtoMuhasebe
```

Bu isimler eski dosyalardan veya önceki bağlamlardan gelmiş olabilir. Yeni kurallarda proje adı her zaman **Muhasebe** olarak standartlaştırılır.

---

## 2. Ürün Tanımı

Muhasebe, KOBİ işletmeleri için geliştirilen web tabanlı, çok kiracılı bir muhasebe / ERP sistemidir.

Sistem, işletmelerin günlük finans, stok, cari, fatura, tahsilat, ödeme ve operasyon süreçlerini tek merkezden yönetmesini sağlar.

Ana ürün hedefi:

```txt
KOBİ'lerin finansal ve operasyonel süreçlerini güvenli, anlaşılır, hızlı ve raporlanabilir şekilde yönetmesini sağlamak.
```

---

## 3. Ürün Kapsamı

Muhasebe sistemi şu ana iş alanlarını kapsar:

```txt
- Cari hesap yönetimi
- Stok yönetimi
- Ürün ve hizmet yönetimi
- Satış faturaları
- Alış faturaları
- Tahsilat işlemleri
- Ödeme işlemleri
- Kasa yönetimi
- Banka hesapları
- Çek / senet işlemleri
- Depo ve lokasyon yönetimi
- Stok hareketleri
- Personel / İK işlemleri
- Raporlama
- Dashboard ve operasyon ekranları
- Yetki / rol yönetimi
- Tenant bazlı firma yönetimi
```

---

## 4. Sektör Kuralı

Muhasebe projesi belirli bir sektöre özel değildir. Genel KOBİ kullanımına yöneliktir.

AI agent şu hataları yapmaz:

```txt
❌ Muhasebe projesini tarım ERP gibi anlatmak
❌ UI metinlerinde buğday, mısır, kantar, nem oranı gibi sektör özel kavramları genel ekranlara taşımak
❌ Eski AzemTarim bağlamını yeni Muhasebe kurallarına karıştırmak
❌ Proje adını OtoMuhasebe veya AzemTarim olarak kullanmak
```

Doğru yaklaşım:

```txt
✅ Genel KOBİ muhasebe dili kullan
✅ Cari, stok, fatura, ödeme, tahsilat, kasa, banka gibi genel muhasebe kavramlarını kullan
✅ Sektör özel özellikleri yalnızca kullanıcı açıkça isterse ayrı modül olarak ele al
```

---

## 5. Hedef Kullanıcılar

Muhasebe sisteminin hedef kullanıcıları:

```txt
- KOBİ sahipleri
- Muhasebe personeli
- Finans personeli
- Stok / depo personeli
- Satış ve satın alma ekipleri
- Firma yöneticileri
- Sistem yöneticileri
```

UI dili teknik olmayan kullanıcıların da anlayabileceği kadar açık olmalıdır.

---

## 6. Ana Mimari

Proje modern web tabanlı çok kiracılı SaaS mimarisine göre geliştirilir.

```txt
Backend:
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Redis / BullMQ

Frontend:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- MUI X DataGrid
- TanStack Query
- React Hook Form
- Zod

Database:
- PostgreSQL
- Prisma migration sistemi

Deployment:
- Docker / VPS / self-host altyapı
```

---

## 7. Database ve Supabase Kararı

Mevcut karar:

```txt
Şu aşamada Supabase'e geçilmeyecek.
Mevcut PostgreSQL + Prisma + NestJS mimarisi korunacak.
```

Supabase self-host gelecekte değerlendirilebilir; ancak bu ayrı bir mimari karar ve ayrı bir ADR konusu olmalıdır.

AI agent kullanıcı açıkça istemedikçe:

```txt
❌ Supabase migration başlatmaz
❌ Prisma yerine Supabase client kullanımına geçmez
❌ Auth veya database mimarisini Supabase'e göre yeniden tasarlamaz
```

Doğru yaklaşım:

```txt
✅ PostgreSQL + Prisma mevcut ana veri katmanıdır
✅ NestJS backend ana otoritedir
✅ Supabase sadece ileride POC/ADR ile değerlendirilebilir
```

---

## 8. Multi-Tenant SaaS İlkesi

Muhasebe çok kiracılı bir SaaS yapısıdır.

Her tenant/firma kendi verisini izole edilmiş şekilde görür ve yönetir.

Kritik kurallar:

```txt
- Her veri sorgusunda tenantId zorunludur
- Aktif kayıt sorgularında deletedAt: null zorunludur
- Tenant izolasyonu bozulamaz
- Frontend tenant header/auth mekanizması UI görevi sırasında değiştirilmez
- Cross-tenant veri erişimi kritik güvenlik ihlalidir
```

---

## 9. Güvenlik İlkeleri

Temel güvenlik ilkeleri:

```txt
- JWT/Auth guard yapısı korunur
- Tenant guard yapısı korunur
- Role/permission kontrolleri korunur
- API contract kontrolsüz değiştirilmez
- Hard delete yapılmaz
- Kritik finansal işlemler transaction içinde yürütülür
- Kullanıcıya teknik hata detayı sızdırılmaz
```

---

## 10. Finansal İşlem İlkeleri

Finansal doğruluk projenin en kritik alanıdır.

Aşağıdaki işlemler transaction içinde yürütülmelidir:

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

Kısmi işlem kabul edilmez.

```txt
Ya tüm işlem başarıyla tamamlanır ya da tamamı rollback olur.
```

---

## 11. Frontend Kimliği

Frontend tasarım dili:

```txt
- Modern
- Kurumsal
- Güven veren
- Veri yoğun ekranlarda okunabilir
- Klasik Bootstrap/admin görünümünden uzak
- Türkçe kullanıcı deneyimine uygun
```

UI kütüphane kararı:

```txt
shadcn/ui     → Tüm genel UI bileşenleri
MUI X         → Sadece DataGrid
lucide-react  → Tüm ikonlar
Tailwind CSS  → Layout ve spacing
```

Frontend detayları için şu dosyalar okunur:

```txt
.cursor/rules/02A-CODING_STANDARDS_FRONTEND.md
.cursor/rules/03-DESIGN_SYSTEM.md
.cursor/rules/04-UI_COMPONENT_BOUNDARIES.md
.cursor/rules/workflows/frontend-page-patterns.md
```

---

## 12. Backend Kimliği

Backend şu prensiplere göre geliştirilir:

```txt
- Controller ince olmalı
- Business logic service katmanında olmalı
- DTO validation zorunlu
- TenantGuard/AuthGuard kullanılmalı
- Prisma sorgularında tenantId ve deletedAt korunmalı
- Finansal işlemlerde transaction zorunlu
- Hata mesajları Türkçe ve güvenli olmalı
```

Backend detayları için şu dosyalar okunur:

```txt
.cursor/rules/02-CODING_STANDARDS.md
.cursor/rules/skills/tenant-security-skill.md
.cursor/rules/skills/prisma-erp-skill.md
.cursor/rules/workflows/backend-api-patterns.md
```

---

## 13. AI Agent Ana Davranış Kuralları

AI agent:

```txt
✅ Önce mevcut yapıyı inceler
✅ Proje adını Muhasebe olarak kullanır
✅ Eski proje adlarını temizler
✅ Görev türüne göre doğru kural dosyalarını okur
✅ Mevcut mimariyi korur
✅ Gereksiz dependency eklemez
✅ Kritik değişikliklerde kullanıcı onayı ister
✅ İş sonunda değişen dosyaları ve doğrulama sonucunu raporlar
```

AI agent yapmaz:

```txt
❌ Proje adını değiştirmez
❌ Supabase'e kendiliğinden geçmez
❌ Backend/API contract'ı UI görevi sırasında değiştirmez
❌ Tenant/auth interceptor mekanizmasını UI görevi sırasında değiştirmez
❌ Hard delete uygulamaz
❌ Finansal transaction zincirini bozmaz
❌ Yeni dependency eklemek için kendiliğinden karar vermez
```

---

## 14. Terminoloji Standardı

Kullanılacak Türkçe terimler:

| İngilizce | Türkçe |
|---|---|
| Account | Cari |
| Customer | Müşteri |
| Supplier | Tedarikçi |
| Invoice | Fatura |
| Collection | Tahsilat |
| Payment | Ödeme |
| Cashbox | Kasa |
| Bank Account | Banka Hesabı |
| Product | Ürün |
| Stock | Stok |
| Warehouse | Depo |
| Location | Lokasyon |
| Transaction | İşlem / Hareket |
| Report | Rapor |
| Dashboard | Dashboard / Genel Bakış |

UI metinlerinde karışık Türkçe-İngilizce kullanımdan kaçınılır.

---

## 15. Dosya ve Kural Önceliği

Çakışma durumunda öncelik sırası:

```txt
1. 00-PROJECT_IDENTITY.md
2. 01-AGENT_WORKFLOW.md
3. Göreve özel skill dosyası
4. Göreve özel workflow dosyası
5. Genel coding standards
6. Mevcut kod patternleri
```

Frontend UI kütüphane çakışmalarında nihai karar:

```txt
04-UI_COMPONENT_BOUNDARIES.md
```

Tasarım token çakışmalarında nihai karar:

```txt
03-DESIGN_SYSTEM.md
```

Tenant/güvenlik çakışmalarında nihai karar:

```txt
skills/tenant-security-skill.md
```

---

## 16. Agent Kontrol Listesi

Her görevden önce:

- [ ] Bu proje Muhasebe olarak ele alındı mı?
- [ ] Eski proje adı veya sektör bağlamı kullanılmadı mı?
- [ ] Göreve uygun rule/skill/workflow dosyaları okundu mu?
- [ ] Mevcut mimari korunuyor mu?
- [ ] Tenant güvenliği etkileniyor mu?
- [ ] Finansal işlem zinciri etkileniyor mu?
- [ ] Backend/API contract değişikliği gerekiyor mu?
- [ ] Yeni dependency gerekiyor mu?
- [ ] İş bittikten sonra doğrulama komutları çalıştırılacak mı?
