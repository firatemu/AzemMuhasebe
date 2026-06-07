-- Örnek Veri Seti - Azem Yazılım (cml9qv20d0001kszb2byc55g5)
-- POS ve ERP Testleri İçin

DO $$
DECLARE
    v_tenant_id TEXT := 'cml9qv20d0001kszb2byc55g5';
    v_brand_bosch_id UUID := gen_random_uuid();
    v_brand_castrol_id UUID := gen_random_uuid();
    v_brand_philips_id UUID := gen_random_uuid();
    
    v_cat_yedek_id UUID := gen_random_uuid();
    v_cat_yaglar_id UUID := gen_random_uuid();
    v_cat_elektrik_id UUID := gen_random_uuid();
    
    v_prod_balata_id UUID := gen_random_uuid();
    v_prod_yag_id UUID := gen_random_uuid();
    v_prod_ampul_id UUID := gen_random_uuid();
BEGIN
    -- 1. MARKALAR (Brands)
    INSERT INTO brands (id, tenant_id, name, is_active, "createdAt", "updatedAt")
    VALUES 
        (v_brand_bosch_id, v_tenant_id, 'Bosch', true, NOW(), NOW()),
        (v_brand_castrol_id, v_tenant_id, 'Castrol', true, NOW(), NOW()),
        (v_brand_philips_id, v_tenant_id, 'Philips', true, NOW(), NOW())
    ON CONFLICT (tenant_id, name) DO NOTHING;

    -- 2. KATEGORİLER (Categories)
    INSERT INTO categories (id, tenant_id, name, slug, level, is_active, "createdAt", "updatedAt")
    VALUES 
        (v_cat_yedek_id, v_tenant_id, 'Yedek Parça', 'yedek-parca', 0, true, NOW(), NOW()),
        (v_cat_yaglar_id, v_tenant_id, 'Madeni Yağlar', 'madeni-yaglar', 0, true, NOW(), NOW()),
        (v_cat_elektrik_id, v_tenant_id, 'Elektrik & Aydınlatma', 'elektrik-aydinlatma', 0, true, NOW(), NOW())
    ON CONFLICT (tenant_id, slug) DO NOTHING;

    -- 3. ÜRÜNLER (Products)
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (
        v_prod_balata_id, 
        v_tenant_id, 
        'BP-001', 
        'Fren Balatası Ön (Bosch)', 
        'Adet', 
        'Yedek Parça', 
        'Yedek Parça', 
        'Bosch', 
        '869000111222', 
        20, 
        NOW(), 
        NOW()
    ) ON CONFLICT DO NOTHING;

    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (
        v_prod_yag_id, 
        v_tenant_id, 
        'CY-005', 
        'Motor Yağı 5W-30 Edge 4LT', 
        'Adet', 
        'Madeni Yağlar', 
        'Madeni Yağlar', 
        'Castrol', 
        '869000333444', 
        20, 
        NOW(), 
        NOW()
    ) ON CONFLICT DO NOTHING;

    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (
        v_prod_ampul_id, 
        v_tenant_id, 
        'HL-007', 
        'H7 Xenon Effect Ampul (Philips)', 
        'Set', 
        'Elektrik & Aydınlatma', 
        'Elektrik & Aydınlatma', 
        'Philips', 
        '869000555666', 
        20, 
        NOW(), 
        NOW()
    ) ON CONFLICT DO NOTHING;

    -- 4. FİYAT KARTLARI (Price Cards)
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES 
        (gen_random_uuid(), v_tenant_id, v_prod_balata_id, 'SALE', 1450.00, 'TRY', true, 20, 1, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, v_prod_yag_id, 'SALE', 1250.00, 'TRY', true, 20, 1, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, v_prod_ampul_id, 'SALE', 380.00, 'TRY', true, 20, 1, NOW(), NOW())
    ON CONFLICT DO NOTHING;

    -- 5. CARİ HESAPLAR (Accounts)
    INSERT INTO accounts (id, "tenantId", code, title, type, company_type, balance, is_active, "createdAt", "updatedAt")
    VALUES 
        (gen_random_uuid(), v_tenant_id, 'M-001', 'Ali Yılmaz', 'CUSTOMER', 'INDIVIDUAL', 0, true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'M-002', 'Veli Can', 'CUSTOMER', 'INDIVIDUAL', 0, true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'T-001', 'Özkan Otomotiv Ltd.', 'SUPPLIER', 'CORPORATE', 0, true, NOW(), NOW())
    ON CONFLICT (code, "tenantId") DO NOTHING;

END $$;
