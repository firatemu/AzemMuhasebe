import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const SYSTEM_UNIT_SETS = [
    {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Uzunluk',
        description: 'Length measurement units',
        units: [
            { id: '00000000-0000-0000-0001-000000000001', name: 'Metre', code: 'MT', conversionRate: 1, isBaseUnit: true, isDivisible: true },
            { id: '00000000-0000-0000-0001-000000000002', name: 'Santimetre', code: 'CM', conversionRate: 0.01, isBaseUnit: false, isDivisible: true },
            { id: '00000000-0000-0000-0001-000000000003', name: 'Milimetre', code: 'MM', conversionRate: 0.001, isBaseUnit: false, isDivisible: true },
            { id: '00000000-0000-0000-0001-000000000004', name: 'Kilometre', code: 'KM', conversionRate: 1000, isBaseUnit: false, isDivisible: true },
        ],
    },
    {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Agirlik',
        description: 'Weight measurement units',
        units: [
            { id: '00000000-0000-0000-0002-000000000001', name: 'Kilogram', code: 'KG', conversionRate: 1, isBaseUnit: true, isDivisible: true },
            { id: '00000000-0000-0000-0002-000000000002', name: 'Gram', code: 'GR', conversionRate: 0.001, isBaseUnit: false, isDivisible: true },
            { id: '00000000-0000-0000-0002-000000000003', name: 'Ton', code: 'TON', conversionRate: 1000, isBaseUnit: false, isDivisible: true },
            { id: '00000000-0000-0000-0002-000000000004', name: 'Miligram', code: 'MG', conversionRate: 0.000001, isBaseUnit: false, isDivisible: true },
        ],
    },
    {
        id: '00000000-0000-0000-0000-000000000003',
        name: 'Hacim',
        description: 'Volume measurement units',
        units: [
            { id: '00000000-0000-0000-0003-000000000001', name: 'Litre', code: 'LT', conversionRate: 1, isBaseUnit: true, isDivisible: true },
            { id: '00000000-0000-0000-0003-000000000002', name: 'Mililitre', code: 'ML', conversionRate: 0.001, isBaseUnit: false, isDivisible: true },
            { id: '00000000-0000-0000-0003-000000000003', name: 'Metrekup', code: 'M3', conversionRate: 1000, isBaseUnit: false, isDivisible: true },
        ],
    },
    {
        id: '00000000-0000-0000-0000-000000000004',
        name: 'Alan',
        description: 'Area measurement units',
        units: [
            { id: '00000000-0000-0000-0004-000000000001', name: 'Metrekare', code: 'M2', conversionRate: 1, isBaseUnit: true, isDivisible: true },
            { id: '00000000-0000-0000-0004-000000000002', name: 'Santimetrekare', code: 'CM2', conversionRate: 0.0001, isBaseUnit: false, isDivisible: true },
            { id: '00000000-0000-0000-0004-000000000003', name: 'Donum', code: 'DONUM', conversionRate: 1000, isBaseUnit: false, isDivisible: true },
        ],
    },
    {
        id: '00000000-0000-0000-0000-000000000005',
        name: 'Adet',
        description: 'Quantity / count units',
        units: [
            { id: '00000000-0000-0000-0005-000000000001', name: 'Adet', code: 'ADET', conversionRate: 1, isBaseUnit: true, isDivisible: false },
            { id: '00000000-0000-0000-0005-000000000002', name: 'Paket', code: 'PKT', conversionRate: 1, isBaseUnit: false, isDivisible: false },
            { id: '00000000-0000-0000-0005-000000000003', name: 'Kutu', code: 'KUTU', conversionRate: 1, isBaseUnit: false, isDivisible: false },
            { id: '00000000-0000-0000-0005-000000000004', name: 'Koli', code: 'KOLI', conversionRate: 1, isBaseUnit: false, isDivisible: false },
            { id: '00000000-0000-0000-0005-000000000005', name: 'Takim', code: 'TAKIM', conversionRate: 1, isBaseUnit: false, isDivisible: false },
        ],
    },
]

export async function seedSystemUnitSets() {
    for (const setData of SYSTEM_UNIT_SETS) {
        const { units, ...unitSetData } = setData

        await prisma.unitSet.upsert({
            where: { id: unitSetData.id },
            update: {},  // never overwrite system data on re-seed
            create: {
                ...unitSetData,
                tenantId: null,
                isSystem: true,
            },
        })

        for (const unit of units) {
            await prisma.unit.upsert({
                where: { id: unit.id },
                update: {},  // never overwrite system data on re-seed
                create: {
                    ...unit,
                    unitSetId: unitSetData.id,
                },
            })
        }
    }

    console.log('System unit sets seeded successfully.')
}
