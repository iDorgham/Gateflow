-- Append-only enforcement: ScanLog and Incident are security/audit records and must
-- never be hard-deleted. Add deletedAt so the reset-tenant admin utility (and any
-- future cleanup path) can soft-delete them instead of using deleteMany().
ALTER TABLE "ScanLog" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Incident" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex
-- NOTE: `prisma migrate deploy` wraps PostgreSQL migrations in a transaction,
-- and CREATE INDEX CONCURRENTLY cannot run inside a transaction block — so
-- this (like the deletedAt indexes on every other soft-deletable model in
-- this schema) takes a brief SHARE lock that blocks writes to ScanLog for
-- the build duration. If ScanLog is large enough in production for that to
-- matter, build this index manually with CONCURRENTLY outside the normal
-- deploy, then `prisma migrate resolve --applied` this migration.
CREATE INDEX "ScanLog_deletedAt_idx" ON "ScanLog"("deletedAt");

-- CreateIndex
CREATE INDEX "Incident_deletedAt_idx" ON "Incident"("deletedAt");
