const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAccount() {
    try {
        const acc = await prisma.account.create({
            data: {
                tenantId: 'cml9qv20d0001kszb2byc55g5',
                title: 'Deneme Carisi A.Ş.',
                code: '120.TEST.001',
                type: 'CUSTOMER',
                companyType: 'CORPORATE',
                country: 'Türkiye',
                city: 'İstanbul',
                district: 'Merkez',
                address: 'Deneme Mah. Test Sok.',
                creditStatus: 'NORMAL',
                isActive: true
            }
        });
        console.log('Account created successfully:', acc.id);
    } catch (e) {
        console.error('Error creating account:', e);
    } finally {
        await prisma.$disconnect();
    }
}
addAccount();
