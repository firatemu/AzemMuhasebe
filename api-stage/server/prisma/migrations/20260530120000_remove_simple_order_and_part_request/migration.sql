-- Remove Simple Order and Part Request modules (tables + enums)

DROP TABLE IF EXISTS "inventory_transactions";
DROP TABLE IF EXISTS "part_requests";
DROP TABLE IF EXISTS "simple_orders";

DROP TYPE IF EXISTS "InventoryTransactionType";
DROP TYPE IF EXISTS "PartRequestStatus";
DROP TYPE IF EXISTS "SimpleOrderStatus";
