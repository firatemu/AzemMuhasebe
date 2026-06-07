import { PrismaClient } from '@prisma/client';

const CONNECTION_STRINGS = [
    process.env.DATABASE_URL,
    'postgresql://otomuhasebe:otomuhasebe123@localhost:5432/otomuhasebe?schema=public',
    'postgresql://postgres:IKYYJ1R8fUZ3PItqxf6qel12VNbLYiOe@localhost:5432/otomuhasebe_stage',
    'postgresql://otomuhasebe:otomuhasebe123@127.0.0.1:5432/otomuhasebe?schema=public',
    'postgresql://postgres:IKYYJ1R8fUZ3PItqxf6qel12VNbLYiOe@127.0.0.1:5432/otomuhasebe_stage',
    'postgresql://postgres:IKYYJ1R8fUZ3PItqxf6qel12VNbLYiOe@otomuhasebe_saas_postgres:5432/otomuhasebe_saas_db?schema=public'
].filter(Boolean) as string[];

async function getPrismaClient() {
    for (const url of CONNECTION_STRINGS) {
        console.log(`Trying connection to: ${url.replace(/:[^@]+@/, ':****@')}`);
        const client = new PrismaClient({
            datasources: { db: { url } }
        });
        try {
            await client.$connect();
            // Test simple query
            await client.tenant.findFirst();
            console.log('✅ Connected successfully!');
            return { client, url };
        } catch (e) {
            console.log(`❌ Failed: ${e.message.split('\n')[0]}`);
            await client.$disconnect();
        }
    }
    throw new Error('Could not connect to database with any available connection string');
}

async function main() {
    const { client: prisma, url } = await getPrismaClient();

    try {
        // 1. Tenant Bul
        const tenant = await prisma.tenant.findFirst({
            where: { OR: [{ subdomain: 'demo' }, { status: 'ACTIVE' }] }
        }) || await prisma.tenant.findFirst();

        if (!tenant) {
            console.error('❌ Tenant bulunamadı!');
            return;
        }
        const tenantId = tenant.id;
        console.log(`🎯 Hedef Tenant: ${tenant.name} (${tenantId})`);

        // 2. Markaları Oluştur (25 Adet)
        console.log('📦 Markalar oluşturuluyor...');
        const brands = [
            'Bosch', 'Valeo', 'Brembo', 'Sachs', 'Mobil', 'Castrol', 'Gates', 'NGK', 'TRW', 'Febi Bilstein',
            'Meyle', 'SKF', 'Varta', 'Osram', 'Mann Filter', 'Lemförder', 'Mahle', 'Behr', 'Hella', 'LUK',
            'Monroe', 'Dayco', 'Denso', 'Champion', 'Magneti Marelli'
        ];
        const brandIds: Record<string, string> = {};
        for (const name of brands) {
            const b = await prisma.brand.upsert({
                where: { tenantId_name: { tenantId, name } },
                update: {},
                create: { name, tenantId, isActive: true, slug: name.toLowerCase().replace(/ /g, '-') }
            });
            brandIds[name] = b.id;
        }

        // 3. Kategorileri Oluştur (10 Ana + 20 Alt = 30)
        console.log('📂 Kategoriler oluşturuluyor...');
        const categoryTree = [
            { main: 'Fren Sistemi', subs: ['Fren Balatası', 'Fren Diski', 'Fren Hortumu'] },
            { main: 'Motor Grubu', subs: ['Piston', 'Sekman', 'Yatak'] },
            { main: 'Filtre Grubu', subs: ['Yağ Filtresi', 'Hava Filtresi', 'Polen Filtresi'] },
            { main: 'Elektrik & Aydınlatma', subs: ['Akü', 'Far', 'Stop Lambası'] },
            { main: 'Süspansiyon & Direksiyon', subs: ['Amortisör', 'Rot Başı', 'Salıncak'] },
            { main: 'Soğutma Sistemi', subs: ['Radyatör', 'Devirdaim', 'Termostat'] },
            { main: 'Debriyaj & Şanzıman', subs: ['Baskı Balata', 'Volant'] },
            { main: 'Ateşleme Sistemi', subs: ['Buji', 'Bobin'] },
            { main: 'Kayış & Rulman', subs: ['Triger Kayışı', 'V Kayışı'] },
            { main: 'Sıvılar & Yağlar', subs: ['Motor Yağı', 'Antifriz'] }
        ];
        const subCategoryIds: string[] = [];
        const catMap: Record<string, string> = {};
        for (const item of categoryTree) {
            const mainCat = await prisma.category.upsert({
                where: { tenantId_slug: { tenantId, slug: item.main.toLowerCase().replace(/ /g, '-') } },
                update: {},
                create: { name: item.main, tenantId, level: 0, slug: item.main.toLowerCase().replace(/ /g, '-') }
            });
            catMap[item.main] = mainCat.id;
            for (const sub of item.subs) {
                const subSlug = `${mainCat.slug}-${sub.toLowerCase().replace(/ /g, '-')}`;
                const subCat = await prisma.category.upsert({
                    where: { tenantId_slug: { tenantId, slug: subSlug } },
                    update: {},
                    create: { name: sub, tenantId, parentId: mainCat.id, level: 1, slug: subSlug }
                });
                subCategoryIds.push(subCat.id);
                catMap[`${item.main}->${sub}`] = subCat.id;
            }
        }

        // 4. Cari Hesapları Oluştur (25 Adet)
        console.log('👥 Cari hesaplar oluşturuluyor...');
        const cityDistricts: [string, string][] = [
            ['İstanbul', 'Kadıköy'], ['Ankara', 'Çankaya'], ['İzmir', 'Konak'], ['Bursa', 'Nilüfer'], ['Antalya', 'Muratpaşa']
        ];
        for (let i = 1; i <= 25; i++) {
            const type = i % 3 === 0 ? 'BOTH' : (i % 2 === 0 ? 'SUPPLIER' : 'CUSTOMER');
            const companyType = i % 5 === 0 ? 'INDIVIDUAL' : 'CORPORATE';
            const [city, district] = cityDistricts[i % 5];
            const title = companyType === 'CORPORATE' ? `Örnek Şirket ${i} Ltd. Şti.` : `Ahmet Örnek ${i}`;

            await prisma.account.upsert({
                where: { code_tenantId: { code: `CARI-${String(i).padStart(3, '0')}`, tenantId } },
                update: {},
                create: {
                    code: `CARI-${String(i).padStart(3, '0')}`,
                    tenantId,
                    title,
                    type: type as any,
                    companyType: companyType as any,
                    taxNumber: companyType === 'CORPORATE' ? `1234567${String(i).padStart(3, '0')}` : null,
                    city,
                    district,
                    isActive: true
                }
            });
        }

        // 5. Malzemeleri Oluştur (30 Adet)
        console.log('🛠 Malzemeler oluşturuluyor...');
        const productSamples = [
            { name: 'Ön Fren Balatası', main: 'Fren Sistemi', sub: 'Fren Balatası', brand: 'Bosch', price: 1250 },
            { name: 'Hava Filtresi Karbonlu', main: 'Filtre Grubu', sub: 'Hava Filtresi', brand: 'Mann Filter', price: 450 },
            { name: '5W-30 Motor Yağı 4L', main: 'Sıvılar & Yağlar', sub: 'Motor Yağı', brand: 'Mobil', price: 1850 },
            { name: 'Amortisör Ön Sağ', main: 'Süspansiyon & Direksiyon', sub: 'Amortisör', brand: 'Sachs', price: 2750 },
            { name: 'İridyum Buji', main: 'Ateşleme Sistemi', sub: 'Buji', brand: 'NGK', price: 350 },
            { name: '72 Ah Akü', main: 'Elektrik & Aydınlatma', sub: 'Akü', brand: 'Varta', price: 3850 },
            { name: 'Triger Kayış Seti', main: 'Kayış & Rulman', sub: 'Triger Kayışı', brand: 'Gates', price: 2200 },
            { name: 'Su Radyatörü', main: 'Soğutma Sistemi', sub: 'Radyatör', brand: 'Behr', price: 3100 },
            { name: 'Baskı Balata Seti', main: 'Debriyaj & Şanzıman', sub: 'Baskı Balata', brand: 'LUK', price: 5800 },
            { name: 'H7 Far Ampulü', main: 'Elektrik & Aydınlatma', sub: 'Far', brand: 'Osram', price: 180 }
        ];

        for (let i = 1; i <= 30; i++) {
            const sample = productSamples[i % 10];
            const code = `STK-${String(i).padStart(4, '0')}`;
            const brandId = brandIds[sample.brand];
            const categoryId = catMap[`${sample.main}->${sample.sub}`];
            const barcode = `869${Math.floor(Math.random() * 9000000000) + 1000000000}`;

            const product = await prisma.product.upsert({
                where: { code_tenantId: { code, tenantId } },
                update: {},
                create: {
                    code,
                    tenantId,
                    name: `${sample.name} - Örnek ${i}`,
                    unit: 'Adet',
                    brandId,
                    brand: sample.brand,
                    categoryId,
                    category: sample.sub,
                    mainCategory: sample.main,
                    subCategory: sample.sub,
                    barcode,
                    vatRate: 20
                }
            });

            // Price Cards
            await prisma.priceCard.upsert({
                where: { productId_type_tenantId: { productId: product.id, type: 'SALE', tenantId } } as any,
                update: { price: sample.price },
                create: { productId: product.id, type: 'SALE', tenantId, price: sample.price, currency: 'TRY', isActive: true }
            });
            await prisma.priceCard.upsert({
                where: { productId_type_tenantId: { productId: product.id, type: 'PURCHASE', tenantId } } as any,
                update: { price: sample.price * 0.7 },
                create: { productId: product.id, type: 'PURCHASE', tenantId, price: sample.price * 0.7, currency: 'TRY', isActive: true }
            });
        }

        console.log('🎉 Örnek veri oluşturma tamamlandı!');

        // Özet
        const counts = await Promise.all([
            prisma.brand.count({ where: { tenantId } }),
            prisma.category.count({ where: { tenantId } }),
            prisma.account.count({ where: { tenantId } }),
            prisma.product.count({ where: { tenantId } })
        ]);
        console.log(`📊 Özet (${tenant.name}):`);
        console.log(`- Marka: ${counts[0]}`);
        console.log(`- Kategori: ${counts[1]}`);
        console.log(`- Cari Hesap: ${counts[2]}`);
        console.log(`- Malzeme: ${counts[3]}`);

    } catch (e) {
        console.error('❌ Hata:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
