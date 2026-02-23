-- AlterTable: make Gate.location optional (nullable)
ALTER TABLE "Gate" ALTER COLUMN "location" DROP NOT NULL;
