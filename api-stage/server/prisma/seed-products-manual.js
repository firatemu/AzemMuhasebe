const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Manuel Ürün Ekleme Başlıyor ---');

    // 1. Staging Tenant'ı Bul
    const tenant = await prisma.tenant.findUnique({
        where: { subdomain: 'staging' },
    });

    if (!tenant) {
        console.error('❌ Hata: "staging" tenant bulunamadı!');
        return;
    }

    const tenantId = tenant.id;
    console.log(`✅ Tenant: ${tenant.name} (${tenantId})`);

    // 2. Bir Marka Oluştur
    const brand = await prisma.brand.upsert({
        where: { tenantId_name: { tenantId, name: 'Genel Marka' } },
        update: {},
        create: { name: 'Genel Marka', slug: 'genel-marka', tenantId, isActive: true },
    });

    // 3. Bir Kategori Oluştur
    const category = await prisma.category.upsert({
        where: { tenantId_slug: { tenantId, slug: 'genel-kategori' } },
        update: {},
        create: { name: 'Genel Kategori', slug: 'genel-kategori', tenantId, isActive: true, level: 0 },
    });

    // 4. Bir Ürün Oluştur
    const product = await prisma.product.upsert({
        where: { code_tenantId: { code: 'MANUAL-001', tenantId } },
        update: {},
        create: {
            code: 'MANUAL-001',
            name: 'Test Malzemesi (Manuel)',
            tenantId,
            unit: 'Adet',
            brandId: brand.id,
            brand: brand.name,
            categoryId: category.id,
            category: category.name,
            vatRate: 20
        }
    });

    console.log(`✅ Ürün başarıyla oluşturuldu: ${product.name} (Code: ${product.code})`);
}

main()
    .catch((e) => {
        console.error('❌ Hata:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
