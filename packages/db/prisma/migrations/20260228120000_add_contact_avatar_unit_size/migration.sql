-- AlterTable: Add avatarUrl to Contact and sizeSqm to Unit
ALTER TABLE "Contact" ADD COLUMN "avatarUrl" TEXT;
ALTER TABLE "Unit" ADD COLUMN "sizeSqm" INTEGER;
