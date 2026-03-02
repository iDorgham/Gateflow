-- Phase 1: CRM data model & API extensions
-- Adds ContactSource + GateMode enums; extends Contact and Project with CRM fields.

-- CreateEnum
CREATE TYPE "ContactSource" AS ENUM ('MANUAL', 'IMPORT', 'QR_SCAN', 'REFERRAL', 'OTHER');

-- CreateEnum
CREATE TYPE "GateMode" AS ENUM ('SINGLE', 'MULTI');

-- AlterTable: Contact — add CRM metadata fields (all nullable)
ALTER TABLE "Contact" ADD COLUMN "jobTitle" TEXT;
ALTER TABLE "Contact" ADD COLUMN "source" "ContactSource";
ALTER TABLE "Contact" ADD COLUMN "companyWebsite" TEXT;
ALTER TABLE "Contact" ADD COLUMN "notes" TEXT;

-- AlterTable: Project — add gallery, external URL, and gate-mode flag
ALTER TABLE "Project" ADD COLUMN "galleryJson" JSONB;
ALTER TABLE "Project" ADD COLUMN "externalUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "gateMode" "GateMode" NOT NULL DEFAULT 'MULTI';
