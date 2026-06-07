import { PrismaClient } from '@prisma/client';

declare const process: any;

/**
 * OtoMuhasebe Örnek Veri Üretici Scripti
 * 
 * Kullanım:
 * TENANT_ID=... COUNT=20 npx ts-node prisma/seed-sample-generator.ts
 */

const TENANT_ID = process.env.TENANT_ID;
const COUNT = parseInt(process.env.COUNT || '20', 10);

const CONNECTION_STRINGS = [
    process.env.DATABASE_URL,
    'postgresql://muhasebe:muhasebe123@localhost:5432/muhasebe?schema=public',
    'postgresql://postgres:IKYYJ1R8fUZ3PItqxf6qel12VNbLYiOe@localhost:5432/muhasebe_stage',
    'postgresql://postgres:IKYYJ1R8fUZ3PItqxf6qel12VNbLYiOe@muhasebe_saas_postgres:5432/muhasebe_saas_db?schema=public'
].filter(Boolean) as string[];

async function getPrismaClient() {
    for (const url of CONNECTION_STRINGS) {
        const client = new PrismaClient({ datasources: { db: { url } } });
        try {
            await client.$connect();
            await client.tenant.findFirst();
            return client;
        } catch (e) {
            await client.$disconnect();
        }
    }
    throw new Error('Veritabanına bağlanılamadı. Lütfen DATABASE_URL kontrol edin.');
}

async function main() {
    console.log('🚀 Örnek veri üretimi başlıyor...');

    const prisma = await getPrismaClient();

    try {
        // 1. Hedef Tenant Belirle
        const tenant = TENANT_ID
            ? await prisma.tenant.findUnique({ where: { id: TENANT_ID } })
            : await prisma.tenant.findFirst({ where: { OR: [{ subdomain: 'demo' }, { status: 'ACTIVE' }] } });

        if (!tenant) {
            console.error('❌ Hedef tenant bulunamadı. Lütfen TENANT_ID belirtin.');
            return;
        }
        const targetTenantId = tenant.id;
        console.log(`🎯 Hedef: ${tenant.name} (${targetTenantId})`);
        console.log(`📊 Adet: ${COUNT}`);

        // --- MARKALAR ---
        const brands = ['Bosch', 'Valeo', 'Brembo', 'Sachs', 'Mobil', 'Castrol', 'Gates', 'NGK', 'TRW', 'Febi'];
        const brandIds: Record<string, string> = {};
        for (const name of brands) {
            const b = await prisma.brand.upsert({
                where: { tenantId_name: { tenantId: targetTenantId, name } },
                update: { isActive: true },
                create: { name, tenantId: targetTenantId, isActive: true, slug: name.toLowerCase() }
            });
            brandIds[name] = b.id;
        }

        // --- KATEGORİLER ---
        const categories = ['Fren Sistemi', 'Motor Grubu', 'Filtre Grubu', 'Elektrik', 'Süspansiyon'];
        const catMap: Record<string, string> = {};
        for (const name of categories) {
            const c = await prisma.category.upsert({
                where: { tenantId_slug: { tenantId: targetTenantId, slug: name.toLowerCase().replace(/ /g, '-') } },
                update: { isActive: true },
                create: { name, tenantId: targetTenantId, level: 0, slug: name.toLowerCase().replace(/ /g, '-'), isActive: true }
            });
            catMap[name] = c.id;
        }

        // --- CARİ HESAPLAR ---
        for (let i = 1; i <= COUNT; i++) {
            const code = `CARI-GEN-${String(i).padStart(3, '0')}`;
            await prisma.account.upsert({
                where: { code_tenantId: { code, tenantId: targetTenantId } },
                update: { isActive: true },
                create: {
                    code,
                    tenantId: targetTenantId,
                    title: `Örnek Müşteri ${i}`,
                    type: 'BOTH',
                    companyType: 'CORPORATE',
                    isActive: true
                }
            });
        }

        // --- ÜRÜNLER ---
        for (let i = 1; i <= COUNT; i++) {
            const code = `STK-GEN-${String(i).padStart(4, '0')}`;
            const brandName = brands[i % brands.length];
            const catName = categories[i % categories.length];

            const product = await prisma.product.upsert({
                where: { code_tenantId: { code, tenantId: targetTenantId } },
                update: { name: `${brandName} ${catName} Parçası ${i}` },
                create: {
                    code,
                    tenantId: targetTenantId,
                    name: `${brandName} ${catName} Parçası ${i}`,
                    unit: 'Adet',
                    brandId: brandIds[brandName],
                    brand: brandName,
                    categoryId: catMap[catName],
                    category: catName,
                    vatRate: 20
                }
            });

            // Fiyat Kartları
            const types: ('SALE' | 'PURCHASE')[] = ['SALE', 'PURCHASE'];
            for (const type of types) {
                const price = type === 'SALE' ? 1000 + (i * 10) : 700 + (i * 7);
                const existing = await prisma.priceCard.findFirst({
                    where: { productId: product.id, type: type, tenantId: targetTenantId }
                });
                if (existing) {
                    await prisma.priceCard.update({ where: { id: existing.id }, data: { price, isActive: true } });
                } else {
                    await prisma.priceCard.create({
                        data: { productId: product.id, type, tenantId: targetTenantId, price, currency: 'TRY', isActive: true }
                    });
                }
            }
        }

        console.log('✅ İşlem başarıyla tamamlandı.');

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
