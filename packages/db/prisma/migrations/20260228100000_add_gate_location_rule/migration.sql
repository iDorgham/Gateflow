-- AlterTable
ALTER TABLE "Gate" ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION,
ADD COLUMN "locationRadiusMeters" INTEGER,
ADD COLUMN "locationEnforced" BOOLEAN DEFAULT false;
