/// <reference types="node" />

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MODULES = [
  'invoice',
  'account',
  'collection',
  'product',
  'warehouse',
  'order',
  'quote',
  'check-bill',
  'cashbox',
  'bank',
  'pos',
  'subscription',
  'license',
  'payment',
  'analytics',
  'reporting',
  'expense',
  'hr',
  'sales-agent',
  'vehicle',
  'unit-set',
  'settings',
  'users',
  'roles',
] as const;

const ACTIONS = [
  'list',
  'view',
  'create',
  'update',
  'delete',
  'approve',
  'export',
] as const;

type Module = (typeof MODULES)[number];
type Action = (typeof ACTIONS)[number];

const MODULE_LABELS: Record<Module, string> = {
  invoice: 'Fatura',
  account: 'Cari Hesap',
  collection: 'Tahsilat',
  product: 'Ürün / Stok',
  warehouse: 'Depo',
  order: 'Sipariş',
  quote: 'Teklif',
  'check-bill': 'Çek / Senet',
  cashbox: 'Kasa',
  bank: 'Banka',
  pos: 'POS',
  subscription: 'Abonelik',
  license: 'Lisans',
  payment: 'Ödeme',
  analytics: 'Analitik',
  reporting: 'Raporlama',
  expense: 'Masraf',
  hr: 'İnsan Kaynakları',
  'sales-agent': 'Satış Elemanları',
  vehicle: 'Araçlar',
  'unit-set': 'Birim Setleri',
  settings: 'Ayarlar',
  users: 'Kullanıcılar',
  roles: 'Roller',
};

const ACTION_LABELS: Record<Action, string> = {
  list: 'Listeleme',
  view: 'Görüntüleme',
  create: 'Yeni Kayıt',
  update: 'Düzenleme',
  delete: 'Silme',
  approve: 'Onaylama',
  export: 'Dışa Aktarım',
};

async function main() {
  console.log('🌱 Permission seed başlıyor...');

  let created = 0;
  let updated = 0;

  for (const module of MODULES) {
    for (const action of ACTIONS) {
      const description = `${MODULE_LABELS[module]} - ${ACTION_LABELS[action]}`;

      const existing = await prisma.permission.findUnique({
        where: { module_action: { module, action } },
      });

      if (existing) {
        await prisma.permission.update({
          where: { id: existing.id },
          data: { description },
        });
        updated++;
      } else {
        await prisma.permission.create({
          data: { module, action, description },
        });
        created++;
      }
    }
  }

  console.log(`✅ Seed tamamlandı: ${created} yeni, ${updated} güncellendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
