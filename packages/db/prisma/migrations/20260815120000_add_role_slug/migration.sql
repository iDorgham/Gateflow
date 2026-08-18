-- AlterTable
ALTER TABLE "Role" ADD COLUMN IF NOT EXISTS "slug" TEXT NOT NULL DEFAULT '';

-- Backfill slugs from existing names (spaces/hyphens → underscores).
UPDATE "Role"
SET "slug" = UPPER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(TRIM("name"), '[[:space:]-]+', '_', 'g'),
    '_+',
    '_',
    'g'
  )
)
WHERE "slug" IS NULL OR "slug" = '';

-- Canonical aliases
UPDATE "Role" SET "slug" = 'ORG_ADMIN' WHERE "slug" IN ('ORGANIZATION_ADMIN', 'ORG_ADMIN');

CREATE INDEX IF NOT EXISTS "Role_slug_idx" ON "Role"("slug");
CREATE INDEX IF NOT EXISTS "Role_organizationId_slug_idx" ON "Role"("organizationId", "slug");
