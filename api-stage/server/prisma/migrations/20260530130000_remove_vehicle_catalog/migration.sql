-- Drop vehicle catalog and deprecated customer vehicle FK
DROP INDEX IF EXISTS "customer_vehicles_vehicle_catalog_id_idx";
ALTER TABLE "customer_vehicles" DROP COLUMN IF EXISTS "vehicle_catalog_id";

DROP TABLE IF EXISTS "vehicle_catalog";
