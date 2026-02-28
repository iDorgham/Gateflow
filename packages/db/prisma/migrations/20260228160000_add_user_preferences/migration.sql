-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "preferences" JSONB;
