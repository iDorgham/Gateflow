-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "socialMedia" JSONB,
ADD COLUMN     "website" TEXT;
