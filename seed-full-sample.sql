-- Kapsamlı Örnek Veri Seti - Otomotiv ERP/POS (25+ Ürün)
-- Tenant: Azem Yazılım (cml9qv20d0001kszb2byc55g5)

DO $$ 
DECLARE 
    v_tenant_id TEXT := 'cml9qv20d0001kszb2byc55g5';
    rec RECORD;
    v_prod_id UUID;
BEGIN
    -- 1. YENİ MARKALARI EKLE
    INSERT INTO brands (id, tenant_id, name, is_active, "createdAt", "updatedAt")
    VALUES 
        (gen_random_uuid(), v_tenant_id, 'NGK', true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Mann-Filter', true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Varta', true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Sachs', true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'LUK', true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Monroe', true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Federal Mogul', true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Ferodo', true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Valeo', true, NOW(), NOW())
    ON CONFLICT (tenant_id, name) DO NOTHING;

    -- 2. YENİ KATEGORİLERİ EKLE
    INSERT INTO categories (id, tenant_id, name, slug, level, is_active, "createdAt", "updatedAt")
    VALUES 
        (gen_random_uuid(), v_tenant_id, 'Filtre Grubu', 'filtre-grubu', 0, true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Ateşleme Grubu', 'atesleme-grubu', 0, true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Debriyaj Grubu', 'debriyaj-grubu', 0, true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Süspansiyon', 'suspansiyon', 0, true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Akü & Elektrik', 'aku-elektrik', 0, true, NOW(), NOW()),
        (gen_random_uuid(), v_tenant_id, 'Fren Sistemi', 'fren-sistemi', 0, true, NOW(), NOW())
    ON CONFLICT (tenant_id, slug) DO NOTHING;

    -- 3. ÜRÜNLERİ DİNAMİK OLARAK EKLE (Basitleştirmek için geçici tablo/array mantığı yerine tek tek)
    
    -- --- FİLTRE GRUBU ---
    -- Yağ Filtresi (Mann)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'MF-712', 'Yağ Filtresi W712/94 (Mann)', 'Adet', 'Filtre Grubu', 'Filtre Grubu', 'Mann-Filter', '4011558712940', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 245.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Hava Filtresi (Mann)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'MF-255', 'Hava Filtresi C2555 (Mann)', 'Adet', 'Filtre Grubu', 'Filtre Grubu', 'Mann-Filter', '4011558255500', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 420.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Polen Filtresi (Valeo)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'VL-715', 'Polen Filtresi Karbonlu (Valeo)', 'Adet', 'Filtre Grubu', 'Filtre Grubu', 'Valeo', '3276427155255', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 350.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- --- ATEŞLEME GRUBU ---
    -- Buji (NGK)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'NGK-BKR6', 'Buji BKR6E-11 (NGK)', 'Adet', 'Ateşleme Grubu', 'Ateşleme Grubu', 'NGK', '087295127568', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 115.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Kızdırma Bujisi (Bosch)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'BS-GL-01', 'Kızdırma Bujisi Duraterm (Bosch)', 'Adet', 'Ateşleme Grubu', 'Ateşleme Grubu', 'Bosch', '3165142223334', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 380.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- --- DEBRİYAJ GRUBU ---
    -- Debriyaj Seti (LUK)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'LUK-SET-01', 'Debriyaj Seti (LUK) Focus II', 'Set', 'Debriyaj Grubu', 'Debriyaj Grubu', 'LUK', '4005108112233', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 5400.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Volan (Sachs)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'SC-VL-44', 'Sabit Volan Sacm (Sachs)', 'Adet', 'Debriyaj Grubu', 'Debriyaj Grubu', 'Sachs', '4013872223344', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 8200.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- --- SÜSPANSİYON ---
    -- Amortisör Ön (Monroe)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'MN-AM-11', 'Ön Amortisör Gazlı (Monroe)', 'Adet', 'Süspansiyon', 'Süspansiyon', 'Monroe', '5412096336699', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 1850.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Helezon Yayı (Sachs)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'SC-HY-02', 'Helezon Yayı (Sachs)', 'Adet', 'Süspansiyon', 'Süspansiyon', 'Sachs', '4013872558877', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 950.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- --- AKÜ & ELEKTRİK ---
    -- Akü 72 Ah (Varta)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'VR-72', 'Akü 72 Ah Blue Dynamic (Varta)', 'Adet', 'Akü & Elektrik', 'Akü & Elektrik', 'Varta', '4016987119532', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 3600.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Silecek Takımı (Bosch Aerotwin)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'BS-A-550', 'Silecek Aerotwin Set (Bosch)', 'Set', 'Akü & Elektrik', 'Akü & Elektrik', 'Bosch', '3165143336669', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 750.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- --- FREN SİSTEMİ ---
    -- Fren Diski (Ferodo)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'FR-D-102', 'Fren Diski Ön - 2 Adet (Ferodo)', 'Takım', 'Fren Sistemi', 'Fren Sistemi', 'Ferodo', '5016687002233', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 3200.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Fren Balatası Arka (Bosch)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'BS-BA-45', 'Arka Fren Balatası (Bosch)', 'Set', 'Fren Sistemi', 'Fren Sistemi', 'Bosch', '3165144445556', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 980.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- --- YAĞLAR & SIVILAR ---
    -- Fren Hidroliği DOT4 (Castrol)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'CS-DOT4', 'Fren Hidroliği DOT4 500ML (Castrol)', 'Adet', 'Madeni Yağlar', 'Madeni Yağlar', 'Castrol', '4008177112255', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 290.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Antifriz G12 Kırmızı (Castrol)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'CS-G12', 'Radicool SF G12 Antifriz (Castrol)', 'Adet', 'Madeni Yağlar', 'Madeni Yağlar', 'Castrol', '4008177336699', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 450.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- --- EKSTRA ÜRÜNLER (25'i tamamlamak için) ---
    -- Yağ Filtresi (Bosch)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'BS-F-01', 'Yağ Filtresi P701 (Bosch)', 'Adet', 'Filtre Grubu', 'Filtre Grubu', 'Bosch', '3165145558887', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 190.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Hava Filtresi (Bosch)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'BS-F-02', 'Hava Filtresi S0200 (Bosch)', 'Adet', 'Filtre Grubu', 'Filtre Grubu', 'Bosch', '3165146669998', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 340.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Yakıt Filtresi (Mann)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'MF-PU-001', 'Yakıt Filtresi PU 825 (Mann)', 'Adet', 'Filtre Grubu', 'Filtre Grubu', 'Mann-Filter', '4011558002232', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 850.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Egr Valfi (Federal Mogul)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'FM-EGR-01', 'EGR Valfi Opel Astra J (Federal Mogul)', 'Adet', 'Ateşleme Grubu', 'Ateşleme Grubu', 'Federal Mogul', '5055301112233', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 4200.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Rot Başı (Monroe)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'MN-RT-44', 'Sağ Rot Başı (Monroe)', 'Adet', 'Süspansiyon', 'Süspansiyon', 'Monroe', '5412096887744', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 540.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Rot Mili (Monroe)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'MN-RM-55', 'Sol Rot Mili (Monroe)', 'Adet', 'Süspansiyon', 'Süspansiyon', 'Monroe', '5412096887755', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 620.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Far Lambası H4 (Philips)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'PH-H4-EB', 'H4 Essential Blue (Philips)', 'Set', 'Aydınlatma', 'Aydınlatma', 'Philips', '8711500779955', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 480.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Stop Lambası P21 (Philips)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'PH-P21', 'P21W Vision Stop Lambası (Philips)', 'Adet', 'Aydınlatma', 'Aydınlatma', 'Philips', '8711500779966', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 45.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Antifriz Mavi (Castrol)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'CS-ANT-M', 'Radicool Mavi 1LT (Castrol)', 'Adet', 'Madeni Yağlar', 'Madeni Yağlar', 'Castrol', '4008177336688', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 350.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- Hidrolik Direksiyon Yağı (Febi)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'FB-HYD-01', 'Direksiyon Yağı Yeşil (Febi)', 'Adet', 'Madeni Yağlar', 'Madeni Yağlar', 'Febi', '4011558112233', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 480.00, 'TRY', true, 20, 1, NOW(), NOW());

    -- T10 Park Lambası LED (Philips)
    v_prod_id := gen_random_uuid();
    INSERT INTO products (id, "tenantId", code, name, unit_text, category_text, main_category, brand_text, barcode, vat_rate, "createdAt", "updatedAt")
    VALUES (v_prod_id, v_tenant_id, 'PH-T10-LED', 'T10 LED 6000K (Philips)', 'Set', 'Aydınlatma', 'Aydınlatma', 'Philips', '8711500779977', 20, NOW(), NOW());
    INSERT INTO price_cards (id, tenant_id, product_id, type, price, currency, is_active, vat_rate, min_quantity, "created_at", "updated_at")
    VALUES (gen_random_uuid(), v_tenant_id, v_prod_id, 'SALE', 320.00, 'TRY', true, 20, 1, NOW(), NOW());

END $$;
