-- AlterTable: add optional metadata columns to QrShortLink for scoped cleanup / audit.
-- All columns are nullable so existing rows are unaffected.
ALTER TABLE "QrShortLink" ADD COLUMN IF NOT EXISTS "qrId"           TEXT;
ALTER TABLE "QrShortLink" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;
ALTER TABLE "QrShortLink" ADD COLUMN IF NOT EXISTS "projectId"      TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QrShortLink_organizationId_idx" ON "QrShortLink"("organizationId");
CREATE INDEX IF NOT EXISTS "QrShortLink_qrId_idx"           ON "QrShortLink"("qrId");
