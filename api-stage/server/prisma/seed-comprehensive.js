const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'postgresql://postgres:IKYYJ1R8fUZ3PItqxf6qel12VNbLYiOe@otomuhasebe_saas_postgres:5432/otomuhasebe_saas_db?schema=public'
        }
    }
});

async function main() {
    console.log('🌱 Kapsamlı Örnek Veri Yükleme Başlıyor...');

    // 1. Demo Tenant'ı Bul
    const tenant = await prisma.tenant.findUnique({
        where: { subdomain: 'demo' },
    });

    if (!tenant) {
        console.error('❌ Hata: "demo" tenant bulunamadı!');
        return;
    }

    const tenantId = tenant.id;
    console.log(`✅ "demo" tenant bulundu. ID: ${tenantId}`);

    // ============================================================
    // 2. CARİ HESAPLARI OLUŞTUR (Müşteriler ve Tedarikçiler)
    // ============================================================
    console.log('\n📋 Cari Hesaplar oluşturuluyor...');

    const musteriler = [
        { kod: 'C-001', unvan: 'Oto Yedek Parça San. Tic. Ltd. Şti.', adres: 'Organize Sanayi Bölgesi, No: 123, Bursa', telefon: '0224 123 4567', email: 'info@otoyedek.com', tip: 'CUSTOMER', vergiNo: '1234567890', vergiDairesi: 'Nilüfer', bakiye: 45000 },
        { kod: 'C-002', unvan: 'Ahmet Yılmaz Otomotiv', adres: 'Atatürk Cad. No: 45, Ankara', telefon: '0312 234 5678', email: 'ahmet@yilmazoto.com', tip: 'CUSTOMER', vergiNo: '0987654321', vergiDairesi: 'Çankaya', bakiye: 32000 },
        { kod: 'C-003', unvan: 'Mehmet Demir Servis', adres: 'Sanayi Mah. No: 78, İzmir', telefon: '0232 345 6789', email: 'mehmet@demirservis.com', tip: 'CUSTOMER', vergiNo: '1122334455', vergiDairesi: 'Karşıyaka', bakiye: 18500 },
        { kod: 'C-004', unvan: 'Fatma Karaca Garaj', adres: 'İstiklal Cad. No: 12, İstanbul', telefon: '0212 456 7890', email: 'fatma@karacagaraj.com', tip: 'CUSTOMER', vergiNo: '5544332211', vergiDairesi: 'Beyoğlu', bakiye: 8750 },
        { kod: 'C-005', unvan: 'Star Otomotiv A.Ş.', adres: 'Levent Mah. No: 56, İstanbul', telefon: '0212 567 8901', email: 'star@staroto.com.tr', tip: 'CUSTOMER', vergiNo: '9988776655', vergiDairesi: 'Beşiktaş', bakiye: 125000 },
        { kod: 'C-006', unvan: 'Ayşe Kalem Otomotiv', adres: 'Cumhuriyet Cad. No: 34, Antalya', telefon: '0242 678 9012', email: 'ayse@kalemoto.com', tip: 'CUSTOMER', vergiNo: '6677889900', vergiDairesi: 'Muratpaşa', bakiye: 21000 },
        { kod: 'C-007', unvan: 'Ali Veli Servis Hizmetleri', adres: 'Sanayi Sitesi, No: 89, Kocaeli', telefon: '0262 789 0123', email: 'ali@veliservis.com', tip: 'CUSTOMER', vergiNo: '3344556677', vergiDairesi: 'İzmit', bakiye: 15600 },
        { kod: 'C-008', unvan: 'Zeynep Güler Otomotiv', adres: 'Bahçeşehir, No: 23, Bursa', telefon: '0224 890 1234', email: 'zeynep@guleroto.com', tip: 'CUSTOMER', vergiNo: '7788990011', vergiDairesi: 'Osmangazi', bakiye: 9200 },
        { kod: 'C-009', unvan: 'Uğur Aksoy Servis', adres: 'Şehitlik Cad. No: 67, Adana', telefon: '0322 901 2345', email: 'ugur@aksoyservis.com', tip: 'CUSTOMER', vergiNo: '2233445566', vergiDairesi: 'Seyhan', bakiye: 34500 },
        { kod: 'C-010', unvan: 'Elif Yıldız Otomotiv', adres: 'Merkez Mah. No: 45, Gaziantep', telefon: '0342 012 3456', email: 'elif@yildizoto.com', tip: 'CUSTOMER', vergiNo: '4455667788', vergiDairesi: 'Şehitkamil', bakiye: 27800 }
    ];

    const tedarikciler = [
        { kod: 'T-001', unvan: 'Bosch Türkiye', adres: 'Organize Sanayi Bölgesi, Bursa', telefon: '0224 999 0000', email: 'satis@bosch.com.tr', tip: 'SUPPLIER', vergiNo: '1112223334', vergiDairesi: 'Nilüfer', bakiye: -85000 },
        { kod: 'T-002', unvan: 'Valeo Otomotiv', adres: 'Ataşehir, İstanbul', telefon: '0216 888 7777', email: 'satis@valeo.com.tr', tip: 'SUPPLIER', vergiNo: '5556667778', vergiDairesi: 'Ataşehir', bakiye: -62000 },
        { kod: 'T-003', unvan: 'Mann Filter Türkiye', adres: 'Esenler, İstanbul', telefon: '0212 777 6666', email: 'satis@mann-filter.com.tr', tip: 'SUPPLIER', vergiNo: '9990001112', vergiDairesi: 'Esenler', bakiye: -45000 },
        { kod: 'T-004', unvan: 'NGK Türkiye', adres: 'İkitelli, İstanbul', telefon: '0212 666 5555', email: 'satis@ngk.com.tr', tip: 'SUPPLIER', vergiNo: '3334445556', vergiDairesi: 'Bağcılar', bakiye: -38000 },
        { kod: 'T-005', unvan: 'Sachs Süspansiyon', adres: 'Kayseri Organize', telefon: '0382 444 3333', email: 'satis@sachs.com.tr', tip: 'SUPPLIER', vergiNo: '7778889990', vergiDairesi: 'Melikgazi', bakiye: -52000 },
        { kod: 'T-006', unvan: 'Brembo Fren Sistemleri', adres: 'Balıkesir OSB', telefon: '0266 333 2222', email: 'satis@brembo.com.tr', tip: 'SUPPLIER', vergiNo: '2221110003', vergiDairesi: 'Altıeylül', bakiye: -41000 }
    ];

    const cariMap = {};
    
    // Müşteriler
    for (const m of musteriler) {
        const account = await prisma.account.upsert({
            where: { code_tenantId: { code: m.kod, tenantId } },
            update: { 
                title: m.unvan,
                address: m.adres,
                phone: m.telefon,
                email: m.email,
                taxNumber: m.vergiNo,
                taxOffice: m.vergiDairesi,
                balance: m.bakiye
            },
            create: {
                code: m.kod,
                title: m.unvan,
                type: m.tip,
                address: m.adres,
                phone: m.telefon,
                email: m.email,
                taxNumber: m.vergiNo,
                taxOffice: m.vergiDairesi,
                balance: m.bakiye,
                tenantId,
                isActive: true
            }
        });
        cariMap[m.kod] = account.id;
        console.log(`  ✅ Müşteri: ${m.kod} - ${m.unvan}`);
    }

    // Tedarikçiler
    for (const t of tedarikciler) {
        const account = await prisma.account.upsert({
            where: { code_tenantId: { code: t.kod, tenantId } },
            update: { 
                title: t.unvan,
                address: t.adres,
                phone: t.telefon,
                email: t.email,
                taxNumber: t.vergiNo,
                taxOffice: t.vergiDairesi,
                balance: t.bakiye
            },
            create: {
                code: t.kod,
                title: t.unvan,
                type: t.tip,
                address: t.adres,
                phone: t.telefon,
                email: t.email,
                taxNumber: t.vergiNo,
                taxOffice: t.vergiDairesi,
                balance: t.bakiye,
                tenantId,
                isActive: true
            }
        });
        cariMap[t.kod] = account.id;
        console.log(`  ✅ Tedarikçi: ${t.kod} - ${t.unvan}`);
    }

    console.log(`✅ Toplam ${musteriler.length + tedarikciler.length} cari hesap oluşturuldu.`);

    // ============================================================
    // 3. MARKALARI OLUŞTUR (Mevcut + Yeni)
    // ============================================================
    console.log('\n🏭 Markalar oluşturuluyor...');

    const markaAdlari = [
        'Bosch', 'Valeo', 'Brembo', 'Sachs', 'Mobil',
        'Castrol', 'Gates', 'NGK', 'TRW', 'Febi Bilstein',
        'Meyle', 'SKF', 'Varta', 'Osram', 'Mann Filter',
        'Behr', 'Mahle', 'Lemförder', 'Lucas', 'Aisin',
        'Denso', 'Delphi', 'Ferodo', 'Continental', 'HELLA'
    ];

    const brandsMap = {};
    for (const name of markaAdlari) {
        const slug = name.toLowerCase().replace(/ /g, '-');
        const brand = await prisma.brand.upsert({
            where: { tenantId_name: { tenantId, name } },
            update: {},
            create: { name, slug, tenantId, isActive: true },
        });
        brandsMap[name] = brand.id;
    }
    console.log(`✅ ${markaAdlari.length} marka oluşturuldu.`);

    // ============================================================
    // 4. KATEGORİLERİ OLUŞTUR (Ana + Alt)
    // ============================================================
    console.log('\n📂 Kategoriler oluşturuluyor...');

    const kategoriYapisi = [
        { name: 'Fren Sistemleri', sub: ['Fren Balatası', 'Fren Diski', 'Fren Kaliperi', 'Fren Hortumu', 'Fren Hidroliği'] },
        { name: 'Motor Parçaları', sub: ['Yağ Filtresi', 'Hava Filtresi', 'Yağlar', 'Buji', 'Silindir Kapak Contası', 'Conta Setleri'] },
        { name: 'Süspansiyon', sub: ['Amortisör', 'Rot Başı', 'Rotil', 'Stabilizatör', 'Diz Altı', 'Kırlangıç'] },
        { name: 'Elektrik', sub: ['Akü', 'Alternatör', 'Marş Motoru', 'Distribütör', 'Röle', 'Far'] },
        { name: 'Aydınlatma', sub: ['Far Ampulü', 'Stop Lambası', 'Sinyal Lambası', 'Fog Ampul', 'LED Aydınlatma'] },
        { name: 'Soğutma', sub: ['Radyatör', 'Termostat', 'Su Pompası', 'Vantilatör', 'Isı Sensörü'] },
        { name: 'Şanzıman', sub: ['Debriyaj', 'Şanzıman Yağı', 'Vites Mili', 'Kavrama Seti', 'Tork Dönüştürücü'] },
        { name: 'Yakıt Sistemi', sub: ['Mazot Filtresi', 'Benzin Pompası', 'Enjektör', 'Yakıt Deposu', 'Hava Yakıt Karıştırıcı'] },
        { name: 'Egzoz', sub: ['Egzoz Borusu', 'Katalizör', 'Egzoz Manifoltu', 'Susturucu', 'Lambda Sensörü'] },
        { name: 'Kaporta', sub: ['Çamurluk', 'Kapı', 'Kaput', 'Bagaj Kapağı', 'Tampon'] }
    ];

    const categoriesMap = {};
    for (const kat of kategoriYapisi) {
        const slug = kat.name.toLowerCase().replace(/ /g, '-');
        const mainKat = await prisma.category.upsert({
            where: { tenantId_slug: { tenantId, slug } },
            update: {},
            create: { name: kat.name, slug, tenantId, isActive: true, level: 0 },
        });
        categoriesMap[kat.name] = mainKat.id;

        for (const subName of kat.sub) {
            const subSlug = `${slug}-${subName.toLowerCase().replace(/ /g, '-').replace(/'/g, '')}`;
            const subKat = await prisma.category.upsert({
                where: { tenantId_slug: { tenantId, slug: subSlug } },
                update: {},
                create: { name: subName, slug: subSlug, parentId: mainKat.id, tenantId, isActive: true, level: 1 },
            });
            categoriesMap[`${kat.name}->${subName}`] = subKat.id;
        }
    }
    
    const totalKategoriler = kategoriYapisi.reduce((acc, kat) => acc + 1 + kat.sub.length, 0);
    console.log(`✅ ${totalKategoriler} kategori oluşturuldu (${kategoriYapisi.length} ana + ${totalKategoriler - kategoriYapisi.length} alt).`);

    // ============================================================
    // 5. MALZEMELERİ OLUŞTUR (50+ Adet)
    // ============================================================
    console.log('\n📦 Malzemeler oluşturuluyor...');

    const malzemeler = [
        // Fren Sistemleri
        { ad: 'Ön Fren Balatası Takım', kat: 'Fren Sistemleri', sub: 'Fren Balatası', marka: 'Bosch', alis: 850, satis: 1250, oem: '0986494661', raf: 'A-102' },
        { ad: 'Arka Fren Balatası', kat: 'Fren Sistemleri', sub: 'Fren Balatası', marka: 'TRW', alis: 620, satis: 980, oem: 'GDB1330', raf: 'A-103' },
        { ad: 'Ön Fren Diski (Çift)', kat: 'Fren Sistemleri', sub: 'Fren Diski', marka: 'Brembo', alis: 2450, satis: 3800, oem: '09.9772.11', raf: 'A-105' },
        { ad: 'Arka Fren Diski (Çift)', kat: 'Fren Sistemleri', sub: 'Fren Diski', marka: 'Brembo', alis: 2100, satis: 3400, oem: '09.9773.10', raf: 'A-106' },
        { ad: 'Fren Kaliperi Tamir Takımı', kat: 'Fren Sistemleri', sub: 'Fren Kaliperi', marka: 'Febi Bilstein', alis: 180, satis: 350, oem: '12455', raf: 'A-108' },
        { ad: 'Fren Hortumu Ön', kat: 'Fren Sistemleri', sub: 'Fren Hortumu', marka: 'Continental', alis: 95, satis: 180, oem: '6PH008246-811', raf: 'A-110' },
        { ad: 'Fren Hidroliği Sıvısı 1L', kat: 'Fren Sistemleri', sub: 'Fren Hidroliği', marka: 'Castrol', alis: 245, satis: 380, oem: 'DOT4', raf: 'A-115' },

        // Motor Parçaları
        { ad: 'Yağ Filtresi Element', kat: 'Motor Parçaları', sub: 'Yağ Filtresi', marka: 'Mann Filter', alis: 125, satis: 240, oem: 'W719/5', raf: 'B-01' },
        { ad: 'Hava Filtresi Klasik', kat: 'Motor Parçaları', sub: 'Hava Filtresi', marka: 'Mann Filter', alis: 185, satis: 320, oem: 'C30115', raf: 'B-02' },
        { ad: 'Polen Filtresi Karbonlu', kat: 'Motor Parçaları', sub: 'Hava Filtresi', marka: 'Mann Filter', alis: 280, satis: 480, oem: 'CUK2939', raf: 'B-03' },
        { ad: '5W-30 Tam Sentetik Yağ 5L', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Mobil', alis: 1150, satis: 1650, oem: 'M1-530-5', raf: 'B-05' },
        { ad: '10W-40 Motor Yağı 4L', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Castrol', alis: 920, satis: 1380, oem: 'MAG1040', raf: 'B-06' },
        { ad: 'İridyum Buji Tekli', kat: 'Motor Parçaları', sub: 'Buji', marka: 'NGK', alis: 280, satis: 450, oem: 'IZFR6K11', raf: 'B-09' },
        { ad: 'Kızdırma Bujisi Seti', kat: 'Motor Parçaları', sub: 'Buji', marka: 'Bosch', alis: 1200, satis: 1950, oem: 'GLP001', raf: 'B-10' },
        { ad: 'Silindir Kapak Contası', kat: 'Motor Parçaları', sub: 'Silindir Kapak Contası', marka: 'Elring', alis: 450, satis: 780, oem: '357.103.383C', raf: 'B-12' },
        { ad: 'Conta Seti Tam', kat: 'Motor Parçaları', sub: 'Conta Setleri', marka: 'Victor Reinz', alis: 1850, satis: 2950, oem: '02-51612-01', raf: 'B-15' },
        { ad: 'Mazot Filtresi', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Bosch', alis: 450, satis: 720, oem: '0450906467', raf: 'B-04' },
        { ad: 'Termostat 87 Derece', kat: 'Motor Parçaları', sub: 'Buji', marka: 'Mahle', alis: 340, satis: 580, oem: 'TH10287', raf: 'B-13' },

        // Süspansiyon
        { ad: 'Ön Amortisör (Gazlı)', kat: 'Süspansiyon', sub: 'Amortisör', marka: 'Sachs', alis: 1850, satis: 2750, oem: '313267', raf: 'C-01' },
        { ad: 'Arka Amortisör Takımı', kat: 'Süspansiyon', sub: 'Amortisör', marka: 'Meyle', alis: 2100, satis: 3250, oem: '126725', raf: 'C-02' },
        { ad: 'Rot Başı Sağ Dış', kat: 'Süspansiyon', sub: 'Rot Başı', marka: 'Lemförder', alis: 380, satis: 620, oem: '3667301', raf: 'C-05' },
        { ad: 'Rotil Alt Sol', kat: 'Süspansiyon', sub: 'Rotil', marka: 'TRW', alis: 290, satis: 480, oem: 'JBJ702', raf: 'C-08' },
        { ad: 'Stabilizatör Başı Ön', kat: 'Süspansiyon', sub: 'Stabilizatör', marka: 'Febi Bilstein', alis: 195, satis: 340, oem: '33686', raf: 'C-10' },
        { ad: 'Diz Altı Takımı', kat: 'Süspansiyon', sub: 'Diz Altı', marka: 'Sidem', alis: 890, satis: 1450, oem: '44726', raf: 'C-12' },
        { ad: 'Kırlangıç Ön', kat: 'Süspansiyon', sub: 'Kırlangıç', marka: 'Delphi', alis: 450, satis: 720, oem: 'BK938', raf: 'C-15' },
        { ad: 'Z-Rot Ön Takım', kat: 'Süspansiyon', sub: 'Rotil', marka: 'Febi Bilstein', alis: 310, satis: 540, oem: '19445', raf: 'C-06' },

        // Elektrik
        { ad: '72 Ah Akü Silver Dynamic', kat: 'Elektrik', sub: 'Akü', marka: 'Varta', alis: 2450, satis: 3850, oem: 'E11-72', raf: 'E-01' },
        { ad: '60 Ah Akü Blue Dynamic', kat: 'Elektrik', sub: 'Akü', marka: 'Varta', alis: 1950, satis: 2950, oem: 'D24-60', raf: 'E-02' },
        { ad: 'Alternatör 120A', kat: 'Elektrik', sub: 'Alternatör', marka: 'Valeo', alis: 4800, satis: 7200, oem: '439467', raf: 'E-05' },
        { ad: 'Alternatör 140A', kat: 'Elektrik', sub: 'Alternatör', marka: 'Bosch', alis: 5200, satis: 7950, oem: '0121615028', raf: 'E-06' },
        { ad: 'Marş Motoru 1.4KW', kat: 'Elektrik', sub: 'Marş Motoru', marka: 'Bosch', alis: 3200, satis: 4950, oem: '0001108405', raf: 'E-08' },
        { ad: 'Marş Motoru 2.0KW', kat: 'Elektrik', sub: 'Marş Motoru', marka: 'Valeo', alis: 3800, satis: 5850, oem: 'D6RA45', raf: 'E-09' },
        { ad: 'Distribütör Rotoru', kat: 'Elektrik', sub: 'Distribütör', marka: 'NGK', alis: 145, satis: 280, oem: '42651', raf: 'E-12' },
        { ad: 'Röle 4 Pin', kat: 'Elektrik', sub: 'Röle', marka: 'Bosch', alis: 45, satis: 95, oem: '0332019150', raf: 'E-15' },
        { ad: 'Röle 5 Pin', kat: 'Elektrik', sub: 'Röle', marka: 'Bosch', alis: 55, satis: 115, oem: '0332019151', raf: 'E-16' },
        { ad: 'Far Reflektörü Sol', kat: 'Elektrik', sub: 'Far', marka: 'HELLA', alis: 850, satis: 1450, oem: '1EA008878-291', raf: 'E-18' },

        // Aydınlatma
        { ad: 'H7 Far Ampulü Night Breaker', kat: 'Aydınlatma', sub: 'Far Ampulü', marka: 'Osram', alis: 450, satis: 780, oem: '64210NL', raf: 'F-01' },
        { ad: 'H1 Far Ampulü', kat: 'Aydınlatma', sub: 'Far Ampulü', marka: 'Philips', alis: 320, satis: 580, oem: '12342H7', raf: 'F-02' },
        { ad: 'D1S Xenon Ampul 35W', kat: 'Aydınlatma', sub: 'Far Ampulü', marka: 'Osram', alis: 1850, satis: 2950, oem: '66140', raf: 'F-03' },
        { ad: 'LED Stop Lambası Sol', kat: 'Aydınlatma', sub: 'Stop Lambası', marka: 'Valeo', alis: 2400, satis: 3950, oem: '44567', raf: 'F-10' },
        { ad: 'LED Stop Lambası Sağ', kat: 'Aydınlatma', sub: 'Stop Lambası', marka: 'Valeo', alis: 2400, satis: 3950, oem: '44568', raf: 'F-11' },
        { ad: 'Sinyal Lambası Önden', kat: 'Aydınlatma', sub: 'Sinyal Lambası', marka: 'HELLA', alis: 185, satis: 340, oem: '8GH002108-031', raf: 'F-15' },
        { ad: 'Fog Ampul H3', kat: 'Aydınlatma', sub: 'Fog Ampul', marka: 'Osram', alis: 195, satis: 360, oem: '64232', raf: 'F-18' },
        { ad: 'LED Aydınlatma Strip', kat: 'Aydınlatma', sub: 'LED Aydınlatma', marka: 'HELLA', alis: 1450, satis: 2450, oem: '8GA003689-001', raf: 'F-20' },

        // Soğutma
        { ad: 'Su Radyatörü', kat: 'Soğutma', sub: 'Radyatör', marka: 'Behr', alis: 1800, satis: 2950, oem: '8MK376', raf: 'R-01' },
        { ad: 'Termostat 82 Derece', kat: 'Soğutma', sub: 'Termostat', marka: 'Wahler', alis: 380, satis: 620, oem: '3892.88', raf: 'R-02' },
        { ad: 'Su Pompası', kat: 'Soğutma', sub: 'Su Pompası', marka: 'Aisin', alis: 1450, satis: 2350, oem: 'WPT-057', raf: 'R-03' },
        { ad: 'Vantilatör 500mm', kat: 'Soğutma', sub: 'Vantilatör', marka: 'Valeo', alis: 850, satis: 1450, oem: '699422', raf: 'R-04' },
        { ad: 'Isı Sensörü', kat: 'Soğutma', sub: 'Isı Sensörü', marka: 'Bosch', alis: 145, satis: 280, oem: '0280130026', raf: 'R-05' },

        // Şanzıman
        { ad: 'Debriyaj Seti', kat: 'Şanzıman', sub: 'Debriyaj', marka: 'Sachs', alis: 4800, satis: 7200, oem: '3000951844', raf: 'D-10' },
        { ad: 'Şanzıman Yağı 75W-90 1L', kat: 'Şanzıman', sub: 'Şanzıman Yağı', marka: 'Castrol', alis: 450, satis: 780, oem: 'SWX7590', raf: 'D-15' },
        { ad: 'Vites Mili Tekerleği', kat: 'Şanzıman', sub: 'Vites Mili', marka: 'Febi Bilstein', alis: 850, satis: 1450, oem: '27893', raf: 'D-18' },
        { ad: 'Kavrama Seti Çift', kat: 'Şanzıman', sub: 'Kavrama Seti', marka: 'Luk', alis: 3200, satis: 4950, oem: '621420700', raf: 'D-20' },
        { ad: 'Tork Dönüştürücü', kat: 'Şanzıman', sub: 'Tork Dönüştürücü', marka: 'Aisin', alis: 8500, satis: 12500, oem: 'A744', raf: 'D-25' },

        // Yakıt Sistemi
        { ad: 'Benzin Pompası', kat: 'Yakıt Sistemi', sub: 'Benzin Pompası', marka: 'Bosch', alis: 1450, satis: 2350, oem: '0986580802', raf: 'Y-01' },
        { ad: 'Enjektör Seti', kat: 'Yakıt Sistemi', sub: 'Enjektör', marka: 'Bosch', alis: 3200, satis: 4950, oem: '0445115029', raf: 'Y-02' },
        { ad: 'Yakıt Deposu 60L', kat: 'Yakıt Sistemi', sub: 'Yakıt Deposu', marka: 'Hella', alis: 2450, satis: 3950, oem: '6Q0201201', raf: 'Y-03' },
        { ad: 'Hava Yakıt Karıştırıcı', kat: 'Yakıt Sistemi', sub: 'Hava Yakıt Karıştırıcı', marka: 'Bosch', alis: 850, satis: 1450, oem: '0280140523', raf: 'Y-04' },

        // Egzoz
        { ad: 'Egzoz Borusu Ön', kat: 'Egzoz', sub: 'Egzoz Borusu', marka: 'Bosal', alis: 850, satis: 1450, oem: '274-553', raf: 'G-01' },
        { ad: 'Katalizktör', kat: 'Egzoz', sub: 'Katalizör', marka: 'Bosal', alis: 2450, satis: 3950, oem: '224-269', raf: 'G-02' },
        { ad: 'Egzoz Manifoltu', kat: 'Egzoz', sub: 'Egzoz Manifoltu', marka: 'Bosal', alis: 1850, satis: 2950, oem: '274-610', raf: 'G-03' },
        { ad: 'Susturucu Arka', kat: 'Egzoz', sub: 'Susturucu', marka: 'Bosal', alis: 950, satis: 1650, oem: '274-329', raf: 'G-04' },
        { ad: 'Lambda Sensörü Ön', kat: 'Egzoz', sub: 'Lambda Sensörü', marka: 'Bosch', alis: 850, satis: 1450, oem: '0258017037', raf: 'G-05' }
    ];

    let counter = 1;
    for (const item of malzemeler) {
        const code = `PROD-${String(counter).padStart(4, '0')}`;
        const brandId = brandsMap[item.marka];
        const categoryId = categoriesMap[`${item.kat}->${item.sub}`];
        const barcode = `869${Math.floor(Math.random() * 9000000000) + 1000000000}`;

        const product = await prisma.product.upsert({
            where: { code_tenantId: { code, tenantId } },
            update: {
                name: item.ad,
                brandId,
                brand: item.marka,
                categoryId,
                category: item.sub,
                mainCategory: item.kat,
                subCategory: item.sub,
                oem: item.oem,
                shelf: item.raf,
                barcode
            },
            create: {
                code,
                tenantId,
                name: item.ad,
                unit: 'Adet',
                brandId,
                brand: item.marka,
                categoryId,
                category: item.sub,
                mainCategory: item.kat,
                subCategory: item.sub,
                oem: item.oem,
                shelf: item.raf,
                barcode,
                vatRate: 20,
                criticalQty: 5
            }
        });

        // Fiyat Kartlarını Oluştur
        try {
            await prisma.priceCard.create({
                data: { productId: product.id, type: 'SALE', tenantId, price: item.satis, currency: 'TRY', isActive: true }
            });
        } catch (e) {}

        try {
            await prisma.priceCard.create({
                data: { productId: product.id, type: 'PURCHASE', tenantId, price: item.alis, currency: 'TRY', isActive: true }
            });
        } catch (e) {}

        console.log(`  ✅ Ürün: ${code} - ${item.ad}`);
        counter++;
    }

    console.log(`✅ ${malzemeler.length} ürün başarıyla yüklendi!`);

    // ============================================================
    // ÖZET
    // ============================================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 KAPSAMLI VERİ YÜKLEME ÖZETİ');
    console.log('='.repeat(60));
    console.log(`✅ Tenant: Demo Şirketi (${tenantId})`);
    console.log(`✅ Cari Hesaplar: ${musteriler.length + tedarikciler.length}`);
    console.log(`   - Müşteriler: ${musteriler.length}`);
    console.log(`   - Tedarikçiler: ${tedarikciler.length}`);
    console.log(`✅ Markalar: ${markaAdlari.length}`);
    console.log(`✅ Kategoriler: ${totalKategoriler}`);
    console.log(`   - Ana Kategoriler: ${kategoriYapisi.length}`);
    console.log(`   - Alt Kategoriler: ${totalKategoriler - kategoriYapisi.length}`);
    console.log(`✅ Ürünler: ${malzemeler.length}`);
    console.log('='.repeat(60));
    console.log('🎉 Tüm veriler başarıyla yüklendi!');
}

main()
    .catch((e) => {
        console.error('❌ Hata:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });