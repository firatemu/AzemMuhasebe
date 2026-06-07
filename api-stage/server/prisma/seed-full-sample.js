const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Kapsamlı Örnek Veri Yükleme Başlıyor...');
    console.log('🔗 DB URL:', process.env.DATABASE_URL || 'Using default from .env');

    const tenant = await prisma.tenant.findUnique({ where: { subdomain: 'staging' } });
    if (!tenant) { throw new Error('Staging tenant bulunamadı!'); }
    const tenantId = tenant.id;
    console.log(`✅ Tenant bulundu: ${tenant.name} (${tenantId})`);

    // 1. Markalar
    const brands = ['Bosch', 'Valeo', 'Castrol', 'Mobil', 'Brembo', 'Sachs', 'Gates', 'NGK', 'TRW', 'Febi Bilstein'];
    const brandMap = {};
    for (const name of brands) {
        const b = await prisma.brand.upsert({
            where: { tenantId_name: { tenantId, name } },
            update: {},
            create: { name, slug: name.toLowerCase(), tenantId }
        });
        brandMap[name] = b.id;
    }

    // 2. Kategoriler
    const categories = ['Motor Parçaları', 'Fren Sistemleri', 'Elektrik Grubu', 'Sıvı ve Yağlar', 'Süspansiyon', 'Aydınlatma'];
    const catMap = {};
    for (const name of categories) {
        const c = await prisma.category.upsert({
            where: { tenantId_slug: { tenantId, slug: name.toLowerCase().replace(/ /g, '-') } },
            update: {},
            create: { name, slug: name.toLowerCase().replace(/ /g, '-'), tenantId }
        });
        catMap[name] = c.id;
    }

    // 3. Ürünler (30 Adet)
    console.log('📦 Ürünler ekleniyor...');
    for (let i = 1; i <= 30; i++) {
        const code = `YP-${1000 + i}`;
        const brand = brands[i % brands.length];
        const category = categories[i % categories.length];
        const product = await prisma.product.upsert({
            where: { code_tenantId: { code, tenantId } },
            update: {},
            create: {
                code,
                name: `${brand} ${category} Parçası v${i}`,
                tenantId,
                unit: 'Adet',
                brandId: brandMap[brand],
                brand: brand,
                categoryId: catMap[category],
                category: category,
                barcode: `869${1000000000 + i}`,
                vatRate: 20
            }
        });

        // Satış Fiyatı
        await prisma.priceCard.create({
            data: { productId: product.id, type: 'SALE', tenantId, price: 100 + (i * 10), currency: 'TRY' }
        });
    }

    // 4. Cari Hesaplar (15 Adet)
    console.log('👥 Cari hesaplar ekleniyor...');
    const accountNames = [
        'Aksoy Otomotiv', 'Yılmaz Yedek Parça', 'Öztürk Servis', 'Kaya Nakliyat', 'Demir Lojistik',
        'Yıldız Car Care', 'Arslan Oto', 'Koç Yedek Parça', 'Şahin Tamirhane', 'Güneş Otomotiv',
        'Ford Otosan Bayi', 'Tofaş Yan Sanayi', 'Petlas Bölge Bayi', 'Mutlu Akü Toptan', 'Opet Madeni Yağlar'
    ];

    for (let i = 0; i < accountNames.length; i++) {
        const code = `CAR-${100 + i}`;
        const type = i < 10 ? 'CUSTOMER' : 'SUPPLIER';
        await prisma.account.upsert({
            where: { code_tenantId: { code, tenantId } },
            update: {},
            create: {
                code,
                tenantId,
                title: accountNames[i],
                type: type,
                email: `info@${accountNames[i].toLowerCase().replace(/ /g, '')}.com`,
                phone: `0555${1000000 + i}`,
                city: 'İstanbul',
                district: 'Ümraniye',
                taxNumber: `12345678${i}`,
                isActive: true
            }
        });
    }

    console.log('✅ Örnek veri yükleme tamamlandı!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
