-- Append-only enforcement: ScanLog and Incident are security/audit records and must
-- never be hard-deleted. Add deletedAt so the reset-tenant admin utility (and any
-- future cleanup path) can soft-delete them instead of using deleteMany().
ALTER TABLE "ScanLog" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Incident" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ScanLog_deletedAt_idx" ON "ScanLog"("deletedAt");

-- CreateIndex
CREATE INDEX "Incident_deletedAt_idx" ON "Incident"("deletedAt");
