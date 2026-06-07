const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Super Admin kullanıcısı oluşturuluyor...');

  // 1. Tenant oluştur
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Azem Yazılım',
      status: 'ACTIVE',
      tenantType: 'CORPORATE',
      settings: {
        create: {
          companyName: 'Azem Yazılım',
          email: 'info@azemyazilim.com',
          phone: '902120000000',
          city: 'İstanbul',
          country: 'Turkey',
          companyType: 'COMPANY',
        },
      },
    },
  });
  console.log('✓ Tenant oluşturuldu:', tenant.id);

  // 2. Password hashle
  const hashedPassword = await bcrypt.hash('1212', 10);

  // 3. Super Admin kullanıcısını oluştur
  const user = await prisma.user.create({
    data: {
      email: 'info@azemyazilim.com',
      username: 'info@azemyazilim',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      fullName: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isActive: true,
      emailVerified: true,
      tenantId: tenant.id,
    },
  });
  console.log('✓ Super Admin kullanıcısı oluşturuldu:', user.id);
  console.log('  - Email:', user.email);
  console.log('  - Username:', user.username);
  console.log('  - Role:', user.role);
  console.log('  - Tenant ID:', user.tenantId);

  // 4. Account oluştur (Sistem hesabı)
  const account = await prisma.account.create({
    data: {
      code: 'SYS001',
      title: 'Azem Yazılım Sistem Hesabı',
      type: 'BOTH',
      companyType: 'CORPORATE',
      tenantId: tenant.id,
      taxNumber: '0000000000',
      taxOffice: 'Vergi Dairesi',
      email: 'info@azemyazilim.com',
      phone: '902120000000',
      city: 'İstanbul',
      country: 'Turkey',
      isActive: true,
    },
  });
  console.log('✓ Account oluşturuldu:', account.id);
  console.log('  - Code:', account.code);
  console.log('  - Title:', account.title);

  // 5. TenantSettings güncelleme
  const settings = await prisma.tenantSettings.update({
    where: { tenantId: tenant.id },
    data: {
      firstName: 'Super',
      lastName: 'Admin',
      companyName: 'Azem Yazılım',
    },
  });
  console.log('✓ Tenant Settings güncellendi');

  console.log('\n=== ÖZET ===');
  console.log('Tenant ID:', tenant.id);
  console.log('Tenant Name:', tenant.name);
  console.log('User ID:', user.id);
  console.log('User Email:', user.email);
  console.log('Account ID:', account.id);
  console.log('\nGiriş Bilgileri:');
  console.log('Email: info@azemyazilim.com');
  console.log('Password: 1212');
}

main()
  .then(() => {
    console.log('\n✅ İşlem başarıyla tamamlandı!');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Hata:', e);
    prisma.$disconnect();
    process.exit(1);
  });