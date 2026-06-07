# OtoMuhasebe - AI & Geliştirici UI Tasarım Rehberi
*(Minimalist & Kurumsal Layout Standartları)*

Bu belge, projedeki "Collection (Tahsilat/Ödeme)" sayfasında uygulanan yeni minimalist ve kompakt tasarım standartlarını dökümante eder. Gelecekte AI asistanından veya diğer yazılımcılardan yeni bir sayfa (Örn: Fatura, Stok, Cari) tasarımı istendiğinde, bu layout prensiplerinin referans alınması zorunludur.

---

## 1. Sayfa Header ve Aksiyon Butonları
Ayrıntılı ve yer kaplayan başlık alanları yerine **tek satırda** kompakt bir header kullanılır.

- **Sol Taraf (Başlık):**
  - İkon: 20x20 ikon, küçük (40x40) bir kutu (yuvarlatılmış köşeli, gradient veya marka renginde bg).
  - Metin: Yanında tek satır `Typography variant="h6"` (Açıklama metni altına küçük/yok).
- **Sağ Taraf (Button Stack):**
  - İhtiyaç duyulan tüm `+ Ekle` butonları `size="small"` kullanılmalıdır.
  - Butonlarda ağır `box-shadow` ve `elevation` KULLANILMAZ (`boxShadow: 'none'`). Flat ve modern tasarımlar tercih edilir.

## 2. Metrik Barı (Kompakt İstatistikler)
Eskiden kullanılan devasa `Grid > Card > CardContent` istatistik kutuları KULLANILMAZ.
Yerine **Metrics Strip (İnce Özet Çubuğu)** uygulanır.

- **Yapı:** Sayfa genişliğince uzanan, `variant="outlined"` olan tek bir `Paper`.
- **Öğeler:** 
  - İçe yerleştirilen `Box`'lar yatay olarak yan yana dizilir (`flex: '1 1 120px'`).
  - Aralarında `borderRight: '1px solid divider'` olur.
- **Tipografi:** Üstte çok küçük başlık (`variant="caption", fontSize: "0.7rem"`), altta vurgulu değer (`variant="body2", fontSize: "0.85rem", fontWeight: 700`).

## 3. Entegre Toolbar (Filtreler ve Arama)
Filtreler ekranın her yerinde veya dev accordion'lar içinde dağınık olmamalıdır. DataGrid'i sarmalayan dış `Paper`'ın en tepe kutusu **Toolbar** olarak kullanılır.

- **Layout:** `Box display="flex", flexWrap="wrap", gap=1.5, p=2`.
- **Hızlı Sekme (Varsa):** Tahsilat/Ödeme veya Alış/Satış gibi geçişler için büyük Material `Tabs` yerine; dış hatları belli bir `Box` içinde, yan yana flat `Button`'lar kullanılır.
- **Arama Kutusu:** `TextField size="small"`, `InputAdornment` ile `<Search />` ikonu ve sağda silme (`X`) butonu.
- **Hızlı Tarih Çipleri:** Bugün/Hafta/Ay gibi seçimler için Outline `Chip` kullanılır. Seçili olanın `bgcolor: primary.main` olur.
- **Araç İkonları:** Yenile, chart aç/kapat, density(kompakt/geniş) değiştir ikonları en sağa (`ml="auto"`) bitişik IconButton'lar olarak konulur.

## 4. Ara Alan (Chart ve Özet Info)
Toolbar ile Tablo (DataGrid) arasına opsiyonel ve dar alanlar konulur.

- **Collapsible Grafikler:** Eğer sayfada chart (grafik) isteniyorsa, bu her zaman açık olup yeri işgal etmemelidir. `Collapse` ile açılır/kapanır yapılır. AreaChart (180px - 200px max height) gibi dar ve X eksenine yayılmış modern grafikler kullanılır.
- **Özet Info Bar:** Toolbar filtrelerine göre ekranda gösterilen toplam satır sayısı ve toplam maddi değerlerin yazıldığı `py=1` olan ince bir satır (Tablonun hemen üstünde, toolbarın altında). Export ikonları (`Excel`, `PDF`) burada durur.

## 5. DataGrid (Tablo) Tasarım Override'ları (CSS Kuralları)
Tabloda eski, standart Material beyaz-gri hatlar yerine, çok hafif kurumsal modern çizgiler kullanılmalıdır. Aşağıdaki `sx` bloğu tüm DataGrid'lere verilmelidir:

```javascript
sx={{
  border: 'none',
  borderRadius: 0,
  // Tablo Başlığı (Koyu gri/buz rengi bg, büyük/bold/seyrek font)
  '& .MuiDataGrid-columnHeaders': {
    bgcolor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
      fontSize: '0.8rem',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    },
  },
  // Tablo Satırları (Zebra stripe ve Hover)
  '& .MuiDataGrid-row': {
    '&:hover': { bgcolor: '#f0fdf4' }, // Hafif yeşil/mavi hover
    '&:nth-of-type(even)': { bgcolor: '#fafafa' },
  },
  // Hücre alt çizgisi
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid #f1f5f9',
    fontSize: '0.875rem',
  },
  // Alt kısım (Footer/Pagination)
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid #e2e8f0',
    bgcolor: '#f8fafc',
  },
}}
// Standart Tablo Yüksekliği: İlk 25 satırın scroll gerektirmeden görünmesi için 
// kapsayıcı Box yüksekliği 'auto' veya yaklaşık '1410px' olarak ayarlanmalıdır.
```

## 6. Hücre (Cell) Render Prensipleri
- **Para Değerleri:** Düz metin olarak bırakılmaz. Giriş (Income) ise başa minik `↓` (yeşil) ikon konur. Çıkış (Expense) ise yatay `↑` (kırmızı) ikon konur. Font `fontWeight: 700` yapılır.
- **Durum / Tip Etiketleri (Chip):** Enum veya Type değerlerini listelerken köşeli (border-radius: 4px veya standart) çok hafif arka planı (`10% opacity`) ve kenarlığı (`30% opacity`) olan `Chip`'ler kullanılır. Font boyutları küçültülür (`fontSize: '0.75rem'`).
- **Gereksiz Uzun Metinler:** Taşırma (ellipsis) ile birleştirilir. `color="text.secondary"` ile okunabilirlik yumuşatılır.

## 7. Dialog (Modal) Kuralları
- Eklenen modal pencereleri daima yuvarlak köşeli (`borderRadius: 3`) olmalı.
- DialogTitle, başlık ve küçük bir açıklama içermeli (Örn: "Yeni Cari Ekle" ve altında rengi kısık "Müşteri veya Tedarikçi ekleyin").
- İptal / Kaydet aksiyonları belirgin olmalı, ana aksiyon butonunda ikon ve işlem sırasında "Yükleniyor (Spinner)" durumu muhakkak ele alınmalıdır.
