-- Super Admin Tenant Oluşturma
INSERT INTO tenants (id, uuid, name, status, "tenantType", "createdAt", "updatedAt")
VALUES (
  'cml9qv20d0001kszb2byc55g5',
  gen_random_uuid(),
  'Azem Yazılım',
  'ACTIVE',
  'CORPORATE',
  NOW(),
  NOW()
);

-- Tenant Settings Oluşturma
INSERT INTO tenant_settings (
  id,
  "tenantId",
  "companyName",
  email,
  phone,
  city,
  country,
  "companyType",
  "firstName",
  "lastName",
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'cml9qv20d0001kszb2byc55g5',
  'Azem Yazılım',
  'info@azemyazilim.com',
  '902120000000',
  'İstanbul',
  'Turkey',
  'COMPANY',
  'Super',
  'Admin',
  NOW(),
  NOW()
);

-- Super Admin Kullanıcısı Oluşturma
-- Parola: 1212 (bcrypt hash)
INSERT INTO users (
  id,
  uuid,
  email,
  username,
  password,
  "firstName",
  "lastName",
  "fullName",
  role,
  status,
  "isActive",
  "emailVerified",
  "tenantId",
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  'info@azemyazilim.com',
  'info@azemyazilim',
  '$2b$10$HyPP/3BJsYZs2gLdW0R.XeKhNkL6t6t1RplGYE2ETPPwciD3tBtzK', -- "1212" bcrypt hash
  'Super',
  'Admin',
  'Super Admin',
  'SUPER_ADMIN',
  'ACTIVE',
  true,
  true,
  'cml9qv20d0001kszb2byc55g5',
  NOW(),
  NOW()
);

-- Account Oluşturma
INSERT INTO accounts (
  id,
  code,
  "tenantId",
  title,
  type,
  "companyType",
  "taxNumber",
  "taxOffice",
  email,
  phone,
  city,
  country,
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'SYS001',
  'cml9qv20d0001kszb2byc55g5',
  'Azem Yazılım Sistem Hesabı',
  'BOTH',
  'CORPORATE',
  '0000000000',
  'Vergi Dairesi',
  'info@azemyazilim.com',
  '902120000000',
  'İstanbul',
  'Turkey',
  true,
  NOW(),
  NOW()
);

-- Sonuçları Göster
SELECT 'Tenant oluşturuldu' AS durum;
SELECT id, name, status FROM tenants WHERE id = 'cml9qv20d0001kszb2byc55g5';
SELECT id, email, role, "tenantId" FROM users WHERE email = 'info@azemyazilim.com';
SELECT id, code, title FROM accounts WHERE code = 'SYS001';