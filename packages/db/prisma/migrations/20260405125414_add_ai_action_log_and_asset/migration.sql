-- CreateEnum
CREATE TYPE "AiAssetType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateTable
CREATE TABLE "AiGeneratedAsset" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "aiActionLogId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "AiAssetType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiGeneratedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiGeneratedAsset_organizationId_idx" ON "AiGeneratedAsset"("organizationId");

-- CreateIndex
CREATE INDEX "AiGeneratedAsset_aiActionLogId_idx" ON "AiGeneratedAsset"("aiActionLogId");

-- AddForeignKey
ALTER TABLE "AiGeneratedAsset" ADD CONSTRAINT "AiGeneratedAsset_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiGeneratedAsset" ADD CONSTRAINT "AiGeneratedAsset_aiActionLogId_fkey" FOREIGN KEY ("aiActionLogId") REFERENCES "AiActionLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
