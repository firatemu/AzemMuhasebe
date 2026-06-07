#!/usr/bin/env node

/**
 * OtoMuhasebe Örnek Veri Oluşturma Script'i
 *
 * Bu script aşağıdaki örnek verileri oluşturur:
 * - 20+ Cari Hesap (Account)
 * - 10+ Marka (Brand)
 * - 5 Ana Kategori (Category)
 * - 15+ Alt Kategori (SubCategory)
 * - 20+ Malzeme (Product)
 *
 * Kullanım: node seed-sample-data.js
 */

const readline = require('readline');

// API Configuration
const API_BASE = 'http://localhost:3000/api';
const STAGING_TENANT_ID = 'cmmxtj8x00007vmzfujppq1po';

// Auth credentials (kullanıcıdan alınacak)
let accessToken = null;

// Türkçe karakterler için slugify
function slugify(text) {
  const from = 'ŞĞÜÇİÖşğüçöı';
  const to = 'SGUCIOsgucio';
  let slug = text.toLowerCase();

  for (let i = 0; i < from.length; i++) {
    slug = slug.replace(new RegExp(from[i], 'g'), to[i]);
  }

  slug = slug.replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return slug;
}

// HTTP Client with native fetch
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-id': STAGING_TENANT_ID,
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Parse response
  const data = await response.json().catch(() => ({}));

  // Return response-like object
  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}

// Login
async function login(username, password) {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.ok && response.data.accessToken) {
      accessToken = response.data.accessToken;
      console.log('✅ Login başarılı');
      return true;
    } else {
      console.error('❌ Login hatası:', response.data.message || 'Bilinmeyen hata');
      return false;
    }
  } catch (error) {
    console.error('❌ Login hatası:', error.message);
    return false;
  }
}

// 1. Markalar (Brand)
const brands = [
  { name: 'Bosch', logoUrl: null },
  { name: 'MannFilter', logoUrl: null },
  { name: 'Valeo', logoUrl: null },
  { name: 'SKF', logoUrl: null },
  { name: 'Ferodo', logoUrl: null },
  { name: 'Castrol', logoUrl: null },
  { name: 'Shell', logoUrl: null },
  { name: 'Total', logoUrl: null },
  { name: 'Mobil', logoUrl: null },
  { name: 'Elmex', logoUrl: null },
  { name: 'NGK', logoUrl: null },
  { name: 'Denso', logoUrl: null },
  { name: 'Aisin', logoUrl: null },
];

async function createBrands() {
  console.log('\n📦 Markalar oluşturuluyor...');
  let created = 0;

  for (const brand of brands) {
    try {
      const response = await apiRequest('/brand', {
        method: 'POST',
        body: JSON.stringify({ brandName: brand.name }),
      });

      if (response.ok || response.status === 409) {
        console.log(`  ✓ ${brand.name}`);
        created++;
      } else {
        console.error(`  ✗ ${brand.name}: ${response.data.message || 'Hata'}`);
      }
    } catch (error) {
      console.error(`  ✗ ${brand.name}: ${error.message}`);
    }
  }

  console.log(`✅ Markalar tamamlandı (${created}/${brands.length})`);
  return created;
}

// 2. Kategoriler (Category - Ana ve Alt)
const mainCategories = [
  { name: 'Yağlar', slug: 'yaglar' },
  { name: 'Filtreler', slug: 'filtreler' },
  { name: 'Fren Sistemleri', slug: 'fren-sistemleri' },
  { name: 'Akülar', slug: 'akuler' },
  { name: 'Parçalar', slug: 'parcalar' },
];

const subCategories = {
  'Yağlar': ['Motor Yağı', 'Şanzıman Yağı', 'Diferansiyel Yağı', 'Vites Yağı', 'Hidrolik Yağı', 'Fren Yağı', 'Gres Yağı'],
  'Filtreler': ['Yağ Filtresi', 'Hava Filtresi', 'Polen Filtresi', 'Kabin Filtresi', 'Yakıt Filtresi'],
  'Fren Sistemleri': ['Fren Balatası', 'Fren Diski', 'Fren Pabucu', 'Fren Kitleri', 'ABS Sensörü'],
  'Aküler': ['Kuru Akü', 'Jel Akü', 'Hibrit Akü'],
  'Parçalar': ['Buji', 'Ateşleme Bobini', 'Sensörler', 'Rulmanlar', 'Kayışlar', 'Supaplar', 'Pistonlar', 'Silindirler'],
};

async function createCategories() {
  console.log('\n📁 Kategoriler oluşturuluyor...');

  // Ana kategoriler
  const mainCatMap = {};
  let mainCreated = 0;

  for (const cat of mainCategories) {
    try {
      const response = await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: cat.name,
          slug: cat.slug,
          level: 0,
        }),
      });

      if (response.ok) {
        mainCatMap[cat.name] = response.data.id;
        console.log(`  ✓ Ana: ${cat.name}`);
        mainCreated++;
      } else if (response.status === 409) {
        // Kategori zaten var, listeden al
        try {
          const listResponse = await apiRequest('/categories');
          const existing = listResponse.data.find(c => c.name === cat.name);
          if (existing) {
            mainCatMap[cat.name] = existing.id;
            console.log(`  - Ana: ${cat.name} (mevcut)`);
            mainCreated++;
          }
        } catch (err) {
          console.error(`  ✗ Ana: ${cat.name}: Mevcut kategoriler alınamadı`);
        }
      } else {
        console.error(`  ✗ Ana: ${cat.name}: ${response.data.message || 'Hata'}`);
      }
    } catch (error) {
      console.error(`  ✗ Ana: ${cat.name}: ${error.message}`);
    }
  }

  // Alt kategoriler
  let subCreated = 0;
  for (const [mainName, subs] of Object.entries(subCategories)) {
    const parentId = mainCatMap[mainName];
    if (!parentId) {
      console.log(`    ! Alt kategoriler atlandı (${mainName} - ana kategori bulunamadı)`);
      continue;
    }

    const subList = Array.isArray(subs) ? subs : subs.split(/\s+/);
    for (const sub of subList) {
      try {
        const response = await apiRequest(`/categories/${mainName}/subcategory`, {
          method: 'POST',
          body: JSON.stringify({
            name: sub,
            slug: slugify(sub),
          }),
        });

        if (response.ok || response.status === 409) {
          console.log(`    ✓ Alt: ${sub} (${mainName})`);
          subCreated++;
        } else {
          console.log(`    - Alt: ${sub} (${mainName}) (mevcut/hata)`);
          subCreated++;
        }
      } catch (error) {
        console.log(`    - Alt: ${sub} (${mainName}) (mevcut)`);
        subCreated++;
      }
    }
  }

  console.log(`✅ Kategoriler tamamlandı (${mainCreated} ana, ${subCreated} alt)`);
}

// 3. Cari Hesaplar (Account)
const accounts = [
  { code: '120.01', title: 'Yıldız Otomotiv San. Tic. Ltd. Şti.', type: 'CUSTOMER', companyType: 'CORPORATE', taxNumber: '1234567890', city: 'İstanbul', phone: '02125554400', email: 'info@yildizoto.com.tr' },
  { code: '120.02', title: 'Ayka Otomotiv Parçaları', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '9876543210', city: 'Ankara', phone: '03122233445', email: 'satis@aykaoto.com' },
  { code: '120.03', title: 'Oto Servis Hizmetleri', type: 'CUSTOMER', companyType: 'CORPORATE', taxNumber: '1122334455', city: 'İzmir', phone: '02324445566', email: 'info@otoserviz.com' },
  { code: '120.04', title: 'Global Yedek Parça', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '5544333221', city: 'Bursa', phone: '02241122334', email: 'global@globalparca.com' },
  { code: '120.05', title: 'Demir Otomotiv', type: 'CUSTOMER', companyType: 'INDIVIDUAL', taxNumber: '9988776655', city: 'Antalya', phone: '02425556677', email: 'demir@demirotomotiv.com' },
  { code: '120.06', title: 'Kardeşler Galeri', type: 'CUSTOMER', companyType: 'CORPORATE', taxNumber: '4455667788', city: 'Adana', phone: '0322889900', email: 'kardeşler@galeri.com' },
  { code: '120.07', title: 'Auto Pazarlama A.Ş.', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '7788990011', city: 'Gaziantep', phone: '03442233445', email: 'info@autopazarlama.com' },
  { code: '120.08', title: 'Canik Servis', type: 'CUSTOMER', companyType: 'CORPORATE', taxNumber: '2233445566', city: 'Mersin', phone: '0324456789', email: 'canik@canikservis.com' },
  { code: '120.09', title: 'Yedek Parça Deposu', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '6655778899', city: 'Konya', phone: '0332112233', email: 'satis@yedekparcadeposu.com' },
  { code: '120.10', title: 'Öztürk Otomotiv', type: 'CUSTOMER', companyType: 'INDIVIDUAL', taxNumber: '1122003344', city: 'Samsun', phone: '0362445566', email: 'ozturk@ozturk.com' },
  { code: '120.11', title: 'Erciyes Oto San.', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '3344556677', city: 'Kayseri', phone: '0352556677', email: 'erciyes@erciyesoto.com' },
  { code: '120.12', title: 'Ulaşık Oto', type: 'CUSTOMER', companyType: 'CORPORATE', taxNumber: '8899001122', city: 'Eskişehir', phone: '0222334455', email: 'ulasik@ulasikoto.com' },
  { code: '120.13', title: 'Teknik Oto Parça', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '7788990011', city: 'Diyarbakır', phone: '0412223344', email: 'teknik@teknikoto.com' },
  { code: '120.14', title: 'Güneş Oto', type: 'CUSTOMER', companyType: 'CORPORATE', taxNumber: '5566778899', city: 'Şanlıurfa', phone: '0414556677', email: 'gunes@gunesoto.com' },
  { code: '120.15', title: 'Batı Akü', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '4455667788', city: 'İzmir', phone: '0232778899', email: 'info@bataku.com' },
  { code: '120.16', title: 'Yıldız Oto Servis', type: 'CUSTOMER', companyType: 'CORPORATE', taxNumber: '9988776655', city: 'İstanbul', phone: '0212345678', email: 'servis@yildizotoservis.com' },
  { code: '120.17', title: 'Anadolu Filtre', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '2233445566', city: 'Ankara', phone: '03199887766', email: 'anadolu@anadolufiltre.com' },
  { code: '120.18', title: 'Ege Oto', type: 'CUSTOMER', companyType: 'INDIVIDUAL', taxNumber: '4455667788', city: 'Aydın', phone: '0256445576', email: 'ege@egeoto.com' },
  { code: '120.19', title: 'Trakya Oto Parça', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '6677889900', city: 'Edirne', phone: '0284223344', email: 'trakya@trakyaoto.com' },
  { code: '120.20', title: 'Akdeniz Oto', type: 'CUSTOMER', companyType: 'CORPORATE', taxNumber: '3344556677', city: 'Antalya', phone: '0242345678', email: 'akdeniz@akdenizoto.com' },
  { code: '120.21', title: 'Karadeniz Oto', type: 'SUPPLIER', companyType: 'CORPORATE', taxNumber: '1122334455', city: 'Samsun', phone: '03625554433', email: 'karadeniz@karadenizoto.com' },
  { code: '120.22', title: 'Çukurova Oto', type: 'CUSTOMER', companyType: 'INDIVIDUAL', taxNumber: '7788990011', city: 'Mersin', phone: '03225556677', email: 'cukurova@cukurovaoto.com' },
];

async function createAccounts() {
  console.log('\n👥 Cari hesaplar oluşturuluyor...');
  let created = 0;

  for (const account of accounts) {
    try {
      const response = await apiRequest('/account', {
        method: 'POST',
        body: JSON.stringify(account),
      });

      if (response.ok || response.status === 409) {
        console.log(`  ✓ ${account.title} (${account.type})`);
        created++;
      } else {
        console.error(`  ✗ ${account.title}: ${response.data.message || 'Hata'}`);
      }
    } catch (error) {
      console.error(`  ✗ ${account.title}: ${error.message}`);
    }
  }

  console.log(`✅ Cari hesaplar tamamlandı (${created}/${accounts.length})`);
}

// 4. Malzemeler (Product)
const products = [
  { code: 'YAG-001', name: 'Mobil 1 5W-30', description: 'Sentetik motor yağı 5L', unit: 'Litre', purchasePrice: 450, salePrice: 650, category: 'Yağlar', subCategory: 'Motor Yağı', brand: 'Mobil', barcode: '8691234567801' },
  { code: 'YAG-002', name: 'Shell Helix 10W-40', description: 'Sentetik motor yağı 4L', unit: 'Litre', purchasePrice: 520, salePrice: 750, category: 'Yağlar', subCategory: 'Motor Yağı', brand: 'Shell', barcode: '8691234567802' },
  { code: 'YAG-003', name: 'Castrol Magnatec 5W-30', description: 'Sentetik motor yağı 5L', unit: 'Litre', purchasePrice: 480, salePrice: 680, category: 'Yağlar', subCategory: 'Motor Yağı', brand: 'Castrol', barcode: '8691234567803' },
  { code: 'YAG-004', name: 'Total Quartz 5W-40', description: 'Sentetik motor yağı 5L', unit: 'Litre', purchasePrice: 460, salePrice: 660, category: 'Yağlar', subCategory: 'Motor Yağı', brand: 'Total', barcode: '8691234567804' },
  { code: 'YAG-005', name: 'Fren Yağı DOT 4', description: 'Fren hidrolik yağı 500ml', unit: 'Litre', purchasePrice: 120, salePrice: 180, category: 'Yağlar', subCategory: 'Fren Yağı', brand: 'Mobil', barcode: '8691234567805' },

  { code: 'FLT-001', name: 'Mann-Filter HU 719/80', description: 'Kabin hava filtresi', unit: 'Adet', purchasePrice: 85, salePrice: 135, category: 'Filtreler', subCategory: 'Hava Filtresi', brand: 'MannFilter', barcode: '8691234567810' },
  { code: 'FLT-002', name: 'Mann-Filter C 2194', description: 'Polen filtresi', unit: 'Adet', purchasePrice: 95, salePrice: 145, category: 'Filtreler', subCategory: 'Polen Filtresi', brand: 'MannFilter', barcode: '8691234567811' },
  { code: 'FLT-003', name: 'Mann-Filter W 719/30', description: 'Yağ filtresi', unit: 'Adet', purchasePrice: 75, salePrice: 115, category: 'Filtreler', subCategory: 'Yağ Filtresi', brand: 'MannFilter', barcode: '8691234567812' },
  { code: 'FLT-004', name: 'Bosch F026400703', description: 'Kabin filtresi', unit: 'Adet', purchasePrice: 120, salePrice: 180, category: 'Filtreler', subCategory: 'Kabin Filtresi', brand: 'Bosch', barcode: '8691234567813' },

  { code: 'FRN-001', name: 'Brembo Fren Diski', description: 'Ön fren diski 280mm', unit: 'Adet', purchasePrice: 450, salePrice: 680, category: 'Fren Sistemleri', subCategory: 'Fren Diski', brand: 'Bosch', barcode: '8691234567820' },
  { code: 'FRN-002', name: 'TRW Fren Balatası', description: 'Ön fren balatası', unit: 'Adet', purchasePrice: 180, salePrice: 280, category: 'Fren Sistemleri', subCategory: 'Fren Balatası', brand: 'Ferodo', barcode: '8691234567821' },
  { code: 'FRN-003', name: 'Ferodo Fren Pabucu', description: 'Arka fren pabucu seti', unit: 'Set', purchasePrice: 320, salePrice: 520, category: 'Fren Sistemleri', subCategory: 'Fren Pabucu', brand: 'Ferodo', barcode: '8691234567822' },
  { code: 'FRN-004', name: 'Ateşleme Buji', description: 'VW grp. ateşleme bujisi', unit: 'Adet', purchasePrice: 45, salePrice: 85, category: 'Parçalar', subCategory: 'Buji', brand: 'Bosch', barcode: '8691234567830' },

  { code: 'AKU-001', name: 'Mutlu Akü 60Ah', description: 'Kuru akü 12V 60Ah', unit: 'Adet', purchasePrice: 850, salePrice: 1250, category: 'Aküler', subCategory: 'Kuru Akü', brand: 'Mutlu', barcode: '8691234567840' },
  { code: 'AKU-002', name: 'İnci Akü 70Ah', description: 'Kuru akü 12V 70Ah', unit: 'Adet', purchasePrice: 950, salePrice: 1400, category: 'Aküler', subCategory: 'Kuru Akü', brand: 'İnci', barcode: '8691234567841' },
  { code: 'AKU-003', name: 'Bosch S4 Akü', description: 'Jel akü 70Ah', unit: 'Adet', purchasePrice: 1100, salePrice: 1600, category: 'Aküler', subCategory: 'Jel Akü', brand: 'Bosch', barcode: '8691234567842' },
  { code: 'AKU-004', name: 'Varta 70Ah', description: 'Jel akü 70Ah', unit: 'Adet', purchasePrice: 1050, salePrice: 1550, category: 'Aküler', subCategory: 'Jel Akü', brand: 'Varta', barcode: '8691234567843' },

  { code: 'PRC-001', name: 'SKF Rulman 6004', description: 'Rulman 6004-2RS', unit: 'Adet', purchasePrice: 85, salePrice: 145, category: 'Parçalar', subCategory: 'Rulmanlar', brand: 'SKF', barcode: '8691234567850' },
  { code: 'PRC-002', name: 'NGK Buji', description: 'Ateşleme bujisi', unit: 'Adet', purchasePrice: 55, salePrice: 95, category: 'Parçalar', subCategory: 'Buji', brand: 'NGK', barcode: '8691234567851' },
  { code: 'PRC-003', name: 'Denso Ateşleme Bobini', description: 'Ateşleme bobini', unit: 'Adet', purchasePrice: 65, salePrice: 110, category: 'Parçalar', subCategory: 'Ateşleme Bobini', brand: 'Denso', barcode: '8691234567852' },
  { code: 'PRC-004', name: 'Gates V Kayışı', description: 'V kayışı serit kayışı', unit: 'Adet', purchasePrice: 180, salePrice: 280, category: 'Parçalar', subCategory: 'Kayışlar', brand: 'Gates', barcode: '8691234567853' },
  { code: 'PRC-005', name: 'AISIN Supap', description: 'Supap seti', unit: 'Set', purchasePrice: 450, salePrice: 750, category: 'Parçalar', subCategory: 'Supaplar', brand: 'Aisin', barcode: '8691234567854' },
  { code: 'PRC-006', name: 'Mahle Piston', description: 'Piston 86mm', unit: 'Adet', purchasePrice: 320, salePrice: 520, category: 'Parçalar', subCategory: 'Pistonlar', brand: 'Mahle', barcode: '8691234567855' },
  { code: 'PRC-007', name: 'Goetze Silindir Kit', description: 'Silindir yatak seti', unit: 'Set', purchasePrice: 850, salePrice: 1350, category: 'Parçalar', subCategory: 'Silindirler', brand: 'Goetze', barcode: '8691234567856' },
  { code: 'PRC-008', name: 'Bosch Sensör', description: 'MAP sensörü', unit: 'Adet', purchasePrice: 250, salePrice: 420, category: 'Parçalar', subCategory: 'Sensörler', brand: 'Bosch', barcode: '8691234567857' },
  { code: 'PRC-009', name: 'Continental Kit', description: 'Tamir seti', unit: 'Kit', purchasePrice: 2500, salePrice: 4200, category: 'Parçalar', subCategory: 'Tamir Kitleri', brand: 'Continental', barcode: '8691234567858' },
];

async function createProducts() {
  console.log('\n🔧 Malzemeler oluşturuluyor...');
  let created = 0;

  for (const product of products) {
    try {
      const response = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify({
          code: product.code,
          name: product.name,
          description: product.description,
          unit: product.unit,
          purchasePrice: product.purchasePrice,
          salePrice: product.salePrice,
          vatRate: 20,
          category: product.category,
          mainCategory: product.category,
          subCategory: product.subCategory,
          brand: product.brand,
          barcode: product.barcode,
        }),
      });

      if (response.ok || response.status === 409) {
        console.log(`  ✓ ${product.code} - ${product.name}`);
        created++;
      } else {
        console.error(`  ✗ ${product.code} - ${product.name}: ${response.data.message || 'Hata'}`);
      }
    } catch (error) {
      console.error(`  ✗ ${product.code} - ${product.name}: ${error.message}`);
    }
  }

  console.log(`✅ Malzemeler tamamlandı (${created}/${products.length})`);
}

// Ana fonksiyon
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     OtoMuhasebe Örnek Veri Oluşturma Script\'i               ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise((resolve) => {
    rl.question(prompt, resolve);
  });

  try {
    const username = await question('Kullanıcı adı: ');
    const password = await question('Şifre: ');

    console.log('\n🔄 Giriş yapılıyor...');
    const loggedIn = await login(username, password);

    if (!loggedIn) {
      console.log('\n❌ Giriş başarısız. Script sonlandırılıyor.');
      rl.close();
      process.exit(1);
    }

    // Verileri oluştur
    await createBrands();
    await createCategories();
    await createAccounts();
    await createProducts();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║     ✅ Tüm örnek veriler başarıyla oluşturuldu!             ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

  } catch (error) {
    console.error('\n❌ Hata:', error.message);
  } finally {
    rl.close();
  }
}

// Çalıştır
if (require.main === module) {
  main();
}

module.exports = { login, createBrands, createCategories, createAccounts, createProducts };
