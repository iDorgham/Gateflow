-- Idempotent migration: add Project model + backfill
-- Safe to run even if table/columns already exist from a previous partial run.

-- CreateTable (idempotent)
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex (idempotent)
CREATE INDEX IF NOT EXISTS "Project_organizationId_idx" ON "Project"("organizationId");

-- AddForeignKey for Project → Organization (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Project_organizationId_fkey'
  ) THEN
    ALTER TABLE "Project"
      ADD CONSTRAINT "Project_organizationId_fkey"
      FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;

-- Add projectId to Gate (idempotent)
ALTER TABLE "Gate" ADD COLUMN IF NOT EXISTS "projectId" TEXT;
CREATE INDEX IF NOT EXISTS "Gate_projectId_idx" ON "Gate"("projectId");

-- Add projectId to QRCode (idempotent)
ALTER TABLE "QRCode" ADD COLUMN IF NOT EXISTS "projectId" TEXT;
CREATE INDEX IF NOT EXISTS "QRCode_projectId_idx" ON "QRCode"("projectId");

-- AddForeignKey Gate → Project (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Gate_projectId_fkey'
  ) THEN
    ALTER TABLE "Gate"
      ADD CONSTRAINT "Gate_projectId_fkey"
      FOREIGN KEY ("projectId") REFERENCES "Project"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

-- AddForeignKey QRCode → Project (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'QRCode_projectId_fkey'
  ) THEN
    ALTER TABLE "QRCode"
      ADD CONSTRAINT "QRCode_projectId_fkey"
      FOREIGN KEY ("projectId") REFERENCES "Project"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

-- Backfill: create one default project per org that has none yet
INSERT INTO "Project" ("id", "name", "organizationId", "createdAt", "updatedAt")
SELECT
    'proj_default_' || id,
    name || ' (Default)',
    id,
    NOW(),
    NOW()
FROM "Organization"
WHERE id NOT IN (SELECT DISTINCT "organizationId" FROM "Project");

-- Backfill: assign orphaned Gates to their org's first project
UPDATE "Gate" g
SET "projectId" = (
    SELECT p.id FROM "Project" p
    WHERE p."organizationId" = g."organizationId"
    ORDER BY p."createdAt" ASC
    LIMIT 1
)
WHERE g."projectId" IS NULL;

-- Backfill: assign orphaned QRCodes to their org's first project
UPDATE "QRCode" q
SET "projectId" = (
    SELECT p.id FROM "Project" p
    WHERE p."organizationId" = q."organizationId"
    ORDER BY p."createdAt" ASC
    LIMIT 1
)
WHERE q."projectId" IS NULL;
