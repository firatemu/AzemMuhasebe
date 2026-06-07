const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Kategori Hiyerarşisi Yeniden Düzenleniyor...');

    const tenant = await prisma.tenant.findUnique({ where: { subdomain: 'staging' } });
    if (!tenant) { throw new Error('Staging tenant bulunamadı!'); }
    const tenantId = tenant.id;

    // 1. Mevcut Ana Kategorileri Güncelle (Level 0)
    const mainCategories = await prisma.category.findMany({
        where: { tenantId, parentId: null }
    });

    console.log(`📂 ${mainCategories.length} adet ana kategori level 0 olarak işaretleniyor...`);
    for (const cat of mainCategories) {
        await prisma.category.update({
            where: { id: cat.id },
            data: { level: 0 }
        });
    }

    // 2. Alt Kategoriler Ekle (Level 1)
    const subCategoriesData = {
        'Motor Parçaları': ['Filtreler', 'Ateşleme Sistemleri', 'Kayışlar ve Gergiler'],
        'Fren Sistemleri': ['Balatalar', 'Diskler', 'Hidrolikler'],
        'Elektrik Grubu': ['Aydınlatma', 'Aküler', 'Sensörler'],
        'Sıvı ve Yağlar': ['Motor Yağları', 'Şanzıman Yağları', 'Antifriz'],
        'Süspansiyon': ['Amortisörler', 'Rotlar', 'Takozlar'],
        'Aydınlatma': ['Farlar', 'Stoplar', 'Sinyaller']
    };

    const allSubCategories = [];

    for (const [mainName, subs] of Object.entries(subCategoriesData)) {
        const parent = mainCategories.find(c => c.name === mainName);
        if (!parent) continue;

        console.log(`🌿 ${mainName} altına alt kategoriler ekleniyor...`);
        for (const subName of subs) {
            const slug = `${parent.slug}-${subName.toLowerCase().replace(/ /g, '-')}`;
            const sub = await prisma.category.upsert({
                where: { tenantId_slug: { tenantId, slug } },
                update: {},
                create: {
                    name: subName,
                    slug: slug,
                    parentId: parent.id,
                    level: 1,
                    tenantId
                }
            });
            allSubCategories.push({
                id: sub.id,
                name: sub.name,
                parentName: parent.name,
                parentId: parent.id
            });
        }
    }

    // 3. Ürünleri Rastgele Dağıt
    const products = await prisma.product.findMany({ where: { tenantId } });
    console.log(`📦 ${products.length} ürün rastgele alt kategorilere atanıyor...`);

    for (const product of products) {
        const randomSub = allSubCategories[Math.floor(Math.random() * allSubCategories.length)];

        await prisma.product.update({
            where: { id: product.id },
            data: {
                categoryId: randomSub.id,
                category: randomSub.name,
                mainCategory: randomSub.parentName,
                subCategory: randomSub.name
            }
        });
        console.log(`✅ ${product.code} -> ${randomSub.parentName} / ${randomSub.name}`);
    }

    console.log('✨ Reorganizasyon başarıyla tamamlandı!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
