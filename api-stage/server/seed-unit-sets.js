const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting default unit sets creation...');

  const existingCount = await prisma.unitSet.count({
    where: { tenantId: null, isSystem: true },
  });

  if (existingCount > 0) {
    console.log(`[Seed] Found ${existingCount} system unit sets, skipping creation.`);
    return;
  }

  console.log('[Seed] Creating 6 default system unit sets...');

  await prisma.$transaction(async (tx) => {
    // 1. Adet (Quantity)
    await tx.unitSet.create({
      data: {
        name: 'Adet',
        description: 'Adet bazlı ürünler için',
        tenantId: null,
        isSystem: true,
        units: {
          create: [
            { name: 'Adet', code: 'ADET', conversionRate: 1, isBaseUnit: true, isDivisible: false },
            { name: 'Çift', code: 'CIFT', conversionRate: 2, isBaseUnit: false, isDivisible: false },
            { name: 'Düzine', code: 'DUZINE', conversionRate: 12, isBaseUnit: false, isDivisible: false },
          ],
        },
      },
    });
    console.log('[Seed] ✓ Created "Adet" unit set');

    // 2. Ağırlık (Weight)
    await tx.unitSet.create({
      data: {
        name: 'Ağırlık',
        description: 'Ağırlık bazlı ürünler için',
        tenantId: null,
        isSystem: true,
        units: {
          create: [
            { name: 'Kilogram', code: 'KG', conversionRate: 1, isBaseUnit: true, isDivisible: true },
            { name: 'Gram', code: 'GR', conversionRate: 0.001, isBaseUnit: false, isDivisible: true },
            { name: 'Ton', code: 'TON', conversionRate: 1000, isBaseUnit: false, isDivisible: true },
          ],
        },
      },
    });
    console.log('[Seed] ✓ Created "Ağırlık" unit set');

    // 3. Hacim (Volume)
    await tx.unitSet.create({
      data: {
        name: 'Hacim',
        description: 'Hacim bazlı ürünler için',
        tenantId: null,
        isSystem: true,
        units: {
          create: [
            { name: 'Litre', code: 'LT', conversionRate: 1, isBaseUnit: true, isDivisible: true },
            { name: 'Mililitre', code: 'ML', conversionRate: 0.001, isBaseUnit: false, isDivisible: true },
            { name: 'Galon', code: 'GL', conversionRate: 3.785, isBaseUnit: false, isDivisible: true },
          ],
        },
      },
    });
    console.log('[Seed] ✓ Created "Hacim" unit set');

    // 4. Uzunluk (Length)
    await tx.unitSet.create({
      data: {
        name: 'Uzunluk',
        description: 'Uzunluk bazlı ürünler için',
        tenantId: null,
        isSystem: true,
        units: {
          create: [
            { name: 'Metre', code: 'MT', conversionRate: 1, isBaseUnit: true, isDivisible: true },
            { name: 'Santimetre', code: 'SM', conversionRate: 0.01, isBaseUnit: false, isDivisible: true },
            { name: 'Desimetre', code: 'DM', conversionRate: 0.1, isBaseUnit: false, isDivisible: true },
          ],
        },
      },
    });
    console.log('[Seed] ✓ Created "Uzunluk" unit set');

    // 5. Alan (Area)
    await tx.unitSet.create({
      data: {
        name: 'Alan',
        description: 'Alan bazlı ürünler için',
        tenantId: null,
        isSystem: true,
        units: {
          create: [
            { name: 'Metrekare', code: 'M2', conversionRate: 1, isBaseUnit: true, isDivisible: true },
            { name: 'Santimetrekare', code: 'CM2', conversionRate: 0.0001, isBaseUnit: false, isDivisible: true },
          ],
        },
      },
    });
    console.log('[Seed] ✓ Created "Alan" unit set');

    // 6. Ambalaj (Packaging)
    await tx.unitSet.create({
      data: {
        name: 'Ambalaj',
        description: 'Ambalaj bazlı ürünler için',
        tenantId: null,
        isSystem: true,
        units: {
          create: [
            { name: 'Koli', code: 'KOLI', conversionRate: 1, isBaseUnit: true, isDivisible: false },
            { name: 'Paket', code: 'PKT', conversionRate: 1, isBaseUnit: true, isDivisible: false },
            { name: 'Kutu', code: 'KUTU', conversionRate: 1, isBaseUnit: true, isDivisible: false },
          ],
        },
      },
    });
    console.log('[Seed] ✓ Created "Ambalaj" unit set');
  });

  console.log('[Seed] ✓ Successfully created 6 default system unit sets');
  console.log('[Seed] Done!');
}

main()
  .catch((e) => {
    console.error('[Seed] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
