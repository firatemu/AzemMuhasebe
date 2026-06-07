const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'postgresql://postgres:IKYYJ1R8fUZ3PItqxf6qel12VNbLYiOe@muhasebe_saas_postgres:5432/muhasebe_saas_db?schema=public'
        }
    }
});

async function main() {
    console.log('🌱 Ürün Verileri Yükleme Başlıyor...');

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
    console.log('✅ Markalar oluşturuldu.');

    // 3. Kategorileri Oluştur
    const kategoriYapisi = [
        { name: 'Fren Sistemleri', sub: ['Fren Balatası', 'Fren Diski', 'Fren Kaliperi'] },
        { name: 'Motor Parçaları', sub: ['Yağ Filtresi', 'Hava Filtresi', 'Yağlar', 'Buji'] },
        { name: 'Süspansiyon', sub: ['Amortisör', 'Rot Başı', 'Rotil'] },
        { name: 'Elektrik', sub: ['Akü', 'Alternatör', 'Marş Motoru'] },
        { name: 'Aydınlatma', sub: ['Far Ampulü', 'Stop Lambası'] }
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
            const subSlug = `${slug}-${subName.toLowerCase().replace(/ /g, '-')}`;
            const subKat = await prisma.category.upsert({
                where: { tenantId_slug: { tenantId, slug: subSlug } },
                update: {},
                create: { name: subName, slug: subSlug, parentId: mainKat.id, tenantId, isActive: true, level: 1 },
            });
            categoriesMap[`${kat.name}->${subName}`] = subKat.id;
        }
    }
    console.log('✅ Kategoriler oluşturuldu.');

    // 4. Malzemeleri Oluştur (30 Adet)
    const malzemeler = [
        { ad: 'Ön Fren Balatası Takım', kat: 'Fren Sistemleri', sub: 'Fren Balatası', marka: 'Bosch', alis: 850, satis: 1250, oem: '0986494661', raf: 'A-102' },
        { ad: 'Arka Fren Balatası', kat: 'Fren Sistemleri', sub: 'Fren Balatası', marka: 'TRW', alis: 620, satis: 980, oem: 'GDB1330', raf: 'A-103' },
        { ad: 'Ön Fren Diski (Çift)', kat: 'Fren Sistemleri', sub: 'Fren Diski', marka: 'Brembo', alis: 2450, satis: 3800, oem: '09.9772.11', raf: 'A-105' },
        { ad: 'Fren Kaliperi Tamir Takımı', kat: 'Fren Sistemleri', sub: 'Fren Kaliperi', marka: 'Febi Bilstein', alis: 180, satis: 350, oem: '12455', raf: 'A-108' },
        { ad: 'Yağ Filtresi Element', kat: 'Motor Parçaları', sub: 'Yağ Filtresi', marka: 'Mann Filter', alis: 125, satis: 240, oem: 'W719/5', raf: 'B-01' },
        { ad: 'Hava Filtresi Klasik', kat: 'Motor Parçaları', sub: 'Hava Filtresi', marka: 'Mann Filter', alis: 185, satis: 320, oem: 'C30115', raf: 'B-02' },
        { ad: '5W-30 Tam Sentetik Yağ 5L', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Mobil', alis: 1150, satis: 1650, oem: 'M1-530-5', raf: 'B-05' },
        { ad: '10W-40 Motor Yağı 4L', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Castrol', alis: 920, satis: 1380, oem: 'MAG1040', raf: 'B-06' },
        { ad: 'İridyum Buji Tekli', kat: 'Motor Parçaları', sub: 'Buji', marka: 'NGK', alis: 280, satis: 450, oem: 'IZFR6K11', raf: 'B-09' },
        { ad: 'Kızdırma Bujisi Seti', kat: 'Motor Parçaları', sub: 'Buji', marka: 'Bosch', alis: 1200, satis: 1950, oem: 'GLP001', raf: 'B-10' },
        { ad: 'Ön Amortisör (Gazlı)', kat: 'Süspansiyon', sub: 'Amortisör', marka: 'Sachs', alis: 1850, satis: 2750, oem: '313267', raf: 'C-01' },
        { ad: 'Arka Amortisör Takımı', kat: 'Süspansiyon', sub: 'Amortisör', marka: 'Meyle', alis: 2100, satis: 3250, oem: '126725', raf: 'C-02' },
        { ad: 'Rot Başı Sağ Dış', kat: 'Süspansiyon', sub: 'Rot Başı', marka: 'Lemförder', alis: 380, satis: 620, oem: '3667301', raf: 'C-05' },
        { ad: 'Rotil Alt Sol', kat: 'Süspansiyon', sub: 'Rotil', marka: 'TRW', alis: 290, satis: 480, oem: 'JBJ702', raf: 'C-08' },
        { ad: '72 Ah Akü Silver Dynamic', kat: 'Elektrik', sub: 'Akü', marka: 'Varta', alis: 2450, satis: 3850, oem: 'E11-72', raf: 'E-01' },
        { ad: '60 Ah Akü Blue Dynamic', kat: 'Elektrik', sub: 'Akü', marka: 'Varta', alis: 1950, satis: 2950, oem: 'D24-60', raf: 'E-02' },
        { ad: 'Alternatör 120A', kat: 'Elektrik', sub: 'Alternatör', marka: 'Valeo', alis: 4800, satis: 7200, oem: '439467', raf: 'E-05' },
        { ad: 'Marş Motoru 1.4KW', kat: 'Elektrik', sub: 'Marş Motoru', marka: 'Bosch', alis: 3200, satis: 4950, oem: '0001108405', raf: 'E-08' },
        { ad: 'H7 Far Ampulü Night Breaker', kat: 'Aydınlatma', sub: 'Far Ampulü', marka: 'Osram', alis: 450, satis: 780, oem: '64210NL', raf: 'F-01' },
        { ad: 'D1S Xenon Ampul 35W', kat: 'Aydınlatma', sub: 'Far Ampulü', marka: 'Osram', alis: 1850, satis: 2950, oem: '66140', raf: 'F-02' },
        { ad: 'LED Stop Lambası Sol', kat: 'Aydınlatma', sub: 'Stop Lambası', marka: 'Valeo', alis: 2400, satis: 3950, oem: '44567', raf: 'F-10' },
        { ad: 'Mazot Filtresi', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Bosch', alis: 450, satis: 720, oem: '0450906467', raf: 'B-04' },
        { ad: 'Polen Filtresi Karbonlu', kat: 'Motor Parçaları', sub: 'Hava Filtresi', marka: 'Mann Filter', alis: 280, satis: 480, oem: 'CUK2939', raf: 'B-03' },
        { ad: 'Termostat 87 Derece', kat: 'Motor Parçaları', sub: 'Buji', marka: 'Mahle', alis: 340, satis: 580, oem: 'TH10287', raf: 'B-15' },
        { ad: 'Z-Rot Ön Takım', kat: 'Süspansiyon', sub: 'Rotil', marka: 'Febi Bilstein', alis: 310, satis: 540, oem: '19445', raf: 'C-06' },
        { ad: 'Motor Kulağı Ön', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Meyle', alis: 1150, satis: 1850, oem: '1001990085', raf: 'D-01' },
        { ad: 'Debriyaj Seti', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Sachs', alis: 4800, satis: 7200, oem: '3000951844', raf: 'D-10' },
        { ad: 'Triger Kayışı', kat: 'Motor Parçaları', sub: 'Buji', marka: 'Gates', alis: 450, satis: 850, oem: '5569XS', raf: 'D-05' },
        { ad: 'Direksiyon Pompası', kat: 'Süspansiyon', sub: 'Rot Başı', marka: 'TRW', alis: 3500, satis: 5500, oem: 'JPR160', raf: 'C-10' },
        { ad: 'Su Radyatörü', kat: 'Motor Parçaları', sub: 'Yağlar', marka: 'Behr', alis: 1800, satis: 2950, oem: '8MK376', raf: 'R-01' }
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

        // Fiyat Kartlarını Oluştur (basit create - duplicate hatası varsa atla)
        try {
            await prisma.priceCard.create({
                data: { productId: product.id, type: 'SALE', tenantId, price: item.satis, currency: 'TRY', isActive: true }
            });
        } catch (e) {
            // Zaten varsa hata yok say
        }

        try {
            await prisma.priceCard.create({
                data: { productId: product.id, type: 'PURCHASE', tenantId, price: item.alis, currency: 'TRY', isActive: true }
            });
        } catch (e) {
            // Zaten varsa hata yok say
        }

        console.log(`✅ Ürün: ${code} - ${item.ad}`);
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