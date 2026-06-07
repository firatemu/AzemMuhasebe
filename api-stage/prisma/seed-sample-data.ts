import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Genişletilmiş Örnek Veri Yükleme Başlıyor...');

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

    // 2. Markaları Oluştur
    const markaAdlari = [
        'Bosch', 'Valeo', 'Brembo', 'Sachs', 'Mobil',
        'Castrol', 'Gates', 'NGK', 'TRW', 'Febi Bilstein',
        'Meyle', 'SKF', 'Varta', 'Osram', 'Mann Filter'
    ];

    const brandsMap: Record<string, string> = {};
    for (const name of markaAdlari) {
        const brand = await prisma.brand.upsert({
            where: {
                name_tenantId: { name, tenantId }
            } as any, // Not: schema'da unique constraint kontrol edilmeli, @@unique([name, tenantId]) yoksa normal findFirst/create
            update: {},
            create: { name, tenantId, isActive: true },
        });
        brandsMap[name] = brand.id;
    }
    console.log('✅ Markalar oluşturuldu/güncellendi.');

    // 3. Kategorileri Oluştur
    const kategoriYapisi = [
        { name: 'Fren Sistemleri', sub: ['Fren Balatası', 'Fren Diski', 'Fren Kaliperi'] },
        { name: 'Motor Parçaları', sub: ['Yağ Filtresi', 'Hava Filtresi', 'Yağlar', 'Buji'] },
        { name: 'Süspansiyon', sub: ['Amortisör', 'Rot Başı', 'Rotil'] },
        { name: 'Elektrik', sub: ['Akü', 'Alternatör', 'Marş Motoru'] },
        { name: 'Aydınlatma', sub: ['Far Ampulü', 'Stop Lambası'] }
    ];

    const categoriesMap: Record<string, string> = {};
    for (const kat of kategoriYapisi) {
        const mainKat = await prisma.category.create({
            data: { name: kat.name, tenantId, isActive: true },
        });
        categoriesMap[kat.name] = mainKat.id;

        for (const subName of kat.sub) {
            const subKat = await prisma.category.create({
                data: { name: subName, mainCategoryId: mainKat.id, tenantId, isActive: true },
            });
            categoriesMap[`${kat.name}->${subName}`] = subKat.id;
        }
    }
    console.log('✅ Kategoriler oluşturuldu.');

    // 4. Malzemeleri Oluştur (30 Adet)
    const malzemeler = [
        // Fren Sistemleri
        { ad: 'Ön Fren Balatası Takım', kat: 'Fren Sistemleri', sub: 'Fren Balatası', marka: 'Bosch', alis: 850, satis: 1250, oem: '0986494661', raf: 'A-102' },
        { ad: 'Arka Fren Balatası', kat: 'Fren Sistemleri', sub: 'Fren Balatası', marka: 'TRW', alis: 620, satis: 980, oem: 'GDB1330', raf: 'A-103' },
        { ad: 'Ön Fren Diski (Çift)', kat: 'Fren Sistemleri', sub: 'Fren Diski', marka: 'Brembo', alis: 2450, satis: 3800, oem: '09.9772.11', raf: 'A-105' },
        { ad: 'Fren Kaliperi Tamir Takımı', kat: 'Fren Sistemleri', sub: 'Fren Kaliperi', marka: 'Febi Bilstein', alis: 180, satis: 350, oem: '12455', raf: 'A-108' },

        // Motor Parçaları
        { ad: 'Yağ Filtresi Element', kat: 'Motor Parçaları', sub: 'Yağ Filtresi', marka: 'Mann Filter', alis: 125, satis: 240, oem: 'HU719', raf: 'B-01' },
        { ad: 'Hava Filtresi Klasik', kat: 'Motor Parçaları', sub: 'Hava Filtresi', marka: 'Mann Filter', alis: 185, satis: 320, oem: 'C30115', raf: 'B-02' },
        { ad: '5W-30 Tam Sentetik Yağ 5L', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Mobil', alis: 1150, satis: 1650, oem: 'M1-530-5', raf: 'B-05' },
        { ad: '10W-40 Motor Yağı 4L', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Castrol', alis: 920, satis: 1380, oem: 'MAG1040', raf: 'B-06' },
        { ad: 'İridyum Buji Tekli', kat: 'Motor Parçaları', sub: 'Buji', marka: 'NGK', alis: 280, satis: 450, oem: 'IZFR6K11', raf: 'B-09' },
        { ad: 'Kızdırma Bujisi Seti', kat: 'Motor Parçaları', sub: 'Buji', marka: 'Bosch', alis: 1200, satis: 1950, oem: 'GLP001', raf: 'B-10' },

        // Süspansiyon
        { ad: 'Ön Amortisör (Gazlı)', kat: 'Süspansiyon', sub: 'Amortisör', marka: 'Sachs', alis: 1850, satis: 2750, oem: '313267', raf: 'C-01' },
        { ad: 'Arka Amortisör Takımı', kat: 'Süspansiyon', sub: 'Amortisör', marka: 'Meyle', alis: 2100, satis: 3250, oem: '126725', raf: 'C-02' },
        { ad: 'Rot Başı Sağ Dış', kat: 'Süspansiyon', sub: 'Rot Başı', marka: 'Lemförder', alis: 380, satis: 620, oem: '3667301', raf: 'C-05' },
        { ad: 'Rotil Alt Sol', kat: 'Süspansiyon', sub: 'Rotil', marka: 'TRW', alis: 290, satis: 480, oem: 'JBJ702', raf: 'C-08' },

        // Elektrik
        { ad: '72 Ah Akü Silver Dynamic', kat: 'Elektrik', sub: 'Akü', marka: 'Varta', alis: 2450, satis: 3850, oem: 'E11-72', raf: 'E-01' },
        { ad: '60 Ah Akü Blue Dynamic', kat: 'Elektrik', sub: 'Akü', marka: 'Varta', alis: 1950, satis: 2950, oem: 'D24-60', raf: 'E-02' },
        { ad: 'Alternatör 120A', kat: 'Elektrik', sub: 'Alternatör', marka: 'Valeo', alis: 4800, satis: 7200, oem: '439467', raf: 'E-05' },
        { ad: 'Marş Motoru 1.4KW', kat: 'Elektrik', sub: 'Marş Motoru', marka: 'Bosch', alis: 3200, satis: 4950, oem: '0001108405', raf: 'E-08' },

        // Aydınlatma
        { ad: 'H7 Far Ampulü Night Breaker', kat: 'Aydınlatma', sub: 'Far Ampulü', marka: 'Osram', alis: 450, satis: 780, oem: '64210NL', raf: 'F-01' },
        { ad: 'D1S Xenon Ampul 35W', kat: 'Aydınlatma', sub: 'Far Ampulü', marka: 'Osram', alis: 1850, satis: 2950, oem: '66140', raf: 'F-02' },
        { ad: 'LED Stop Lambası Sol', kat: 'Aydınlatma', sub: 'Stop Lambası', marka: 'Valeo', alis: 2400, satis: 3950, oem: '44567', raf: 'F-10' },

        // Rulman & Diğer
        { ad: 'Teker Rulman Kiti Ön', kat: 'Motor Parçaları', sub: 'Yağ Filtresi', marka: 'SKF', alis: 1100, satis: 1850, oem: 'VKBA3543', raf: 'R-01' },
        { ad: 'V Gergi Kasnağı', kat: 'Motor Parçaları', sub: 'Hava Filtresi', marka: 'Gates', alis: 420, satis: 750, oem: 'T38427', raf: 'R-05' },
        { ad: 'Triger Kayışı Takımı', kat: 'Motor Parçaları', sub: 'Buji', marka: 'Gates', alis: 1250, satis: 2100, oem: 'K015569XS', raf: 'R-10' },

        // Ekstra Ürünler (25+)
        { ad: 'Mazot Filtresi', kat: 'Motor Parçaları', sub: 'Yakıt Filtresi', marka: 'Bosch', alis: 450, satis: 720, oem: '0450906467', raf: 'B-04' },
        { ad: 'Polen Filtresi Karbonlu', kat: 'Motor Parçaları', sub: 'Hava Filtresi', marka: 'Mann Filter', alis: 280, satis: 480, oem: 'CUK2939', raf: 'B-03' },
        { ad: 'Termostat 87 Derece', kat: 'Motor Parçaları', sub: 'Termostat', marka: 'Mahle', alis: 340, satis: 580, oem: 'TH10287', raf: 'B-15' },
        { ad: 'Z-Rot Ön Takım', kat: 'Süspansiyon', sub: 'Rot Başı', marka: 'Febi Bilstein', alis: 310, satis: 540, oem: '19445', raf: 'C-06' },
        { ad: 'Motor Kulağı Ön', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Meyle', alis: 1150, satis: 1850, oem: '1001990085', raf: 'D-01' },
        { ad: 'Debriyaj Seti (Baskı Balata)', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Sachs', alis: 4800, satis: 7200, oem: '3000951844', raf: 'D-10' }
    ];

    let counter = 1;
    for (const item of malzemeler) {
        const stokKodu = `STK-${String(counter).padStart(4, '0')}`;
        const mainKatId = categoriesMap[item.kat];
        const subKatName = `${item.kat}->${item.sub}`;
        const subKatId = categoriesMap[subKatName];
        const brandId = brandsMap[item.marka];

        await prisma.stok.create({
            data: {
                stokKodu,
                tenantId,
                stokAdi: item.ad,
                alisFiyati: item.alis,
                satisFiyati: item.satis,
                birim: 'Adet',
                brandId,
                brandText: item.marka,
                mainCategoryId: mainKatId,
                categoryText: `${item.kat} / ${item.sub}`,
                altKategori: item.sub, // Şemadaki 'altKategori' alanına sub name yazalım
                oem: item.oem,
                raf: item.raf,
                kdvOrani: 20,
                kritikStokMiktari: 5,
                isActive: true
            } as any
        });
        console.log(`✅ Ürün Eklendi: ${stokKodu} - ${item.ad}`);
        counter++;
    }

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
