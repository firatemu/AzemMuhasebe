-- Align DeliveryNoteStatus enum with Prisma schema (invoice cancel, partial invoicing)
ALTER TYPE "DeliveryNoteStatus" ADD VALUE IF NOT EXISTS 'PARTIALLY_INVOICED';
ALTER TYPE "DeliveryNoteStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
ALTER TYPE "DeliveryNoteStatus" ADD VALUE IF NOT EXISTS 'TESLIM_EDILDI';
ALTER TYPE "DeliveryNoteStatus" ADD VALUE IF NOT EXISTS 'BEKLEMEDE';
ALTER TYPE "DeliveryNoteStatus" ADD VALUE IF NOT EXISTS 'FATURAYA_BAGLANDI';
ALTER TYPE "DeliveryNoteStatus" ADD VALUE IF NOT EXISTS 'IPTAL';
