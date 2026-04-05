-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('REAL_ESTATE', 'SCHOOL', 'CLUB', 'NIGHTCLUB', 'EVENT_ORGANISER');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "type" "OrganizationType" NOT NULL DEFAULT 'REAL_ESTATE';
