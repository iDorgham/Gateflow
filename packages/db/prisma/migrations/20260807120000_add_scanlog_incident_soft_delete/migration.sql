-- Append-only enforcement: ScanLog and Incident are security/audit records and must
-- never be hard-deleted. Add deletedAt so the reset-tenant admin utility (and any
-- future cleanup path) can soft-delete them instead of using deleteMany().
ALTER TABLE "ScanLog" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Incident" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex
-- NOTE: `prisma migrate deploy` wraps PostgreSQL migrations in a transaction,
-- and CREATE INDEX CONCURRENTLY cannot run inside a transaction block — so
-- this (like the deletedAt indexes on every other soft-deletable model in
-- this schema) takes a brief SHARE lock that blocks writes during index build.
-- If ScanLog or Incident tables are large enough in production for that lock
-- to impact operations, follow this manual procedure:
--   1. Apply BOTH deletedAt column additions manually:
--        ALTER TABLE "ScanLog" ADD COLUMN "deletedAt" TIMESTAMP(3);
--        ALTER TABLE "Incident" ADD COLUMN "deletedAt" TIMESTAMP(3);
--   2. Create BOTH indexes with CONCURRENTLY (outside a transaction):
--        CREATE INDEX CONCURRENTLY "ScanLog_deletedAt_idx" ON "ScanLog"("deletedAt");
--        CREATE INDEX CONCURRENTLY "Incident_deletedAt_idx" ON "Incident"("deletedAt");
--   3. Mark this migration as applied using the DIRECT_DATABASE_URL (not pooled):
--        DIRECT_DATABASE_URL="postgresql://..." npx prisma migrate resolve --applied 20260807120000_add_scanlog_incident_soft_delete
CREATE INDEX "ScanLog_deletedAt_idx" ON "ScanLog"("deletedAt");

-- CreateIndex
CREATE INDEX "Incident_deletedAt_idx" ON "Incident"("deletedAt");
