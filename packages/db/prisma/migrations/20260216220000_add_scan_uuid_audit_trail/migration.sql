-- AlterTable: Add scanUuid, deviceId, and auditTrail to ScanLog
ALTER TABLE "ScanLog" ADD COLUMN "scanUuid" TEXT;
ALTER TABLE "ScanLog" ADD COLUMN "deviceId" TEXT;
ALTER TABLE "ScanLog" ADD COLUMN "auditTrail" JSONB[] DEFAULT ARRAY[]::JSONB[];

-- CreateIndex: unique constraint on scanUuid for idempotency
CREATE UNIQUE INDEX "ScanLog_scanUuid_key" ON "ScanLog"("scanUuid");

-- CreateIndex: composite index for conflict resolution lookups
CREATE INDEX "ScanLog_qrCodeId_scannedAt_idx" ON "ScanLog"("qrCodeId", "scannedAt");
