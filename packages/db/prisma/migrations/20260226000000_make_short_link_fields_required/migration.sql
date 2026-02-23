-- Remove rows that are missing required fields (created before this constraint).
-- These are incomplete short-link records that can safely be deleted.
DELETE FROM "QrShortLink" WHERE "qrId" IS NULL OR "organizationId" IS NULL;

-- Enforce NOT NULL on qrId and organizationId.
ALTER TABLE "QrShortLink" ALTER COLUMN "qrId" SET NOT NULL;
ALTER TABLE "QrShortLink" ALTER COLUMN "organizationId" SET NOT NULL;
