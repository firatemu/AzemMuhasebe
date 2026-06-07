import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedSystemUnitSets } from './seeds/systemUnitSets';
import { seedPermissions } from './seed-permissions';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed işlemi başlıyor...');

  // 1. Plan Oluştur
  const limitJson = {
    maxUsers: 10,
    maxStorage: 1024,
  };

  const trialPlan = await prisma.plan.upsert({
    where: { slug: 'trial' },
    update: {},
    create: {
      name: 'Deneme Paketi',
      slug: 'trial',
      price: 0,
      description: '14 günlük ücretsiz deneme paketi',
      features: {},
      limits: limitJson,
      isActive: true,
    },
  });
  console.log('✓ Plan oluşturuldu/güncellendi');

  // 2. Tenant Oluştur
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Şirketi',
      subdomain: 'demo',
      status: 'ACTIVE',
      subscription: {
        create: {
          planId: trialPlan.id,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
      },
    },
  });
  console.log('✓ Tenant oluşturuldu/güncellendi');

  // 3. Permissions Oluştur
  await seedPermissions();

  // 4. Admin Role Oluştur
  const adminRole = await prisma.role.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: 'Yönetici',
      },
    },
    update: {},
    create: {
      name: 'Yönetici',
      description: 'Tam yetkili sistem yöneticisi',
      isSystemRole: true,
      tenantId: tenant.id,
    },
  });
  console.log('✓ Yönetici rolü oluşturuldu');

  // 5. Role Permissions Ata (Tüm izinler)
  const allPermissions = await prisma.permission.findMany();

  const rolePermissionsData = allPermissions.map(p => ({
    roleId: adminRole.id,
    permissionId: p.id,
  }));

  // Batch insert yerine loop ile upsert ya da createMany (conflict skip)
  // SQLite/Postgres farkı olmaması için createMany skipDuplicates kullanıyoruz
  await prisma.rolePermission.createMany({
    data: rolePermissionsData,
    skipDuplicates: true,
  });
  console.log('✓ Yönetici rolüne izinler atandı');

  // 6. Admin User Oluştur
  // Şifre: 1212
  const hash = await bcrypt.hash('1212', 10);

  const adminUser = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'info@azemyazilim.com',
        tenantId: tenant.id,
      },
    },
    update: {
      password: hash,
      tenantId: tenant.id,
      role: 'SUPER_ADMIN', // Legacy enum role kept for backward compat/bypass
      roleId: adminRole.id, // Link to new granular role
    },
    create: {
      email: 'info@azemyazilim.com',
      username: 'azem',
      password: hash,
      firstName: 'Azem',
      lastName: 'Yazılım',
      fullName: 'Azem Yazılım',
      phone: '5555555555',
      role: 'SUPER_ADMIN',
      roleId: adminRole.id,
      isActive: true,
      tenantId: tenant.id,
    },
  });
  console.log(`✓ Admin user oluşturuldu: info@azemyazilim.com / 1212`);

  // 7. Sistem Birim Setlerini Oluştur
  await seedSystemUnitSets();
  console.log('✓ Sistem birim setleri oluşturuldu');

  console.log('✅ Seed işlemi tamamlandı!');
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

