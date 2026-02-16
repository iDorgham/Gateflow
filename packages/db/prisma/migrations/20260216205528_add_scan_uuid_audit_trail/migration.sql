-- AlterTable
ALTER TABLE "ScanLog" ADD COLUMN     "auditNotes" JSONB,
ALTER COLUMN "auditTrail" DROP DEFAULT;
