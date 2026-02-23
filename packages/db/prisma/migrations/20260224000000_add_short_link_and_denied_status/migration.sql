-- Add DENIED value to ScanStatus enum
-- NOTE: ALTER TYPE ... ADD VALUE cannot run inside a transaction in PostgreSQL < 12.
-- Prisma will run this outside of a transaction automatically.
ALTER TYPE "ScanStatus" ADD VALUE IF NOT EXISTS 'DENIED';

-- CreateTable: QrShortLink
CREATE TABLE "QrShortLink" (
    "id"          TEXT NOT NULL,
    "shortId"     TEXT NOT NULL,
    "fullPayload" TEXT NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt"   TIMESTAMP(3),

    CONSTRAINT "QrShortLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QrShortLink_shortId_key" ON "QrShortLink"("shortId");
CREATE INDEX "QrShortLink_shortId_idx" ON "QrShortLink"("shortId");
