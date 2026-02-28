-- AlterTable: Add identity level, retention, and resident privacy to Organization
ALTER TABLE "Organization" ADD COLUMN "requiredIdentityLevel" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Organization" ADD COLUMN "scanLogRetentionMonths" INTEGER;
ALTER TABLE "Organization" ADD COLUMN "visitorHistoryRetentionMonths" INTEGER;
ALTER TABLE "Organization" ADD COLUMN "idArtifactRetentionMonths" INTEGER;
ALTER TABLE "Organization" ADD COLUMN "incidentRetentionMonths" INTEGER;
ALTER TABLE "Organization" ADD COLUMN "maskResidentNameOnLandingPage" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN "showUnitOnLandingPage" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable: Add gate-level identity override
ALTER TABLE "Gate" ADD COLUMN "requiredIdentityLevel" INTEGER;

-- CreateTable: ScanAttachment for ID artifacts
CREATE TABLE "ScanAttachment" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "scanLogId" TEXT,
    "incidentId" TEXT,
    "type" TEXT NOT NULL,
    "contentBase64" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanAttachment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ScanAttachment_organizationId_idx" ON "ScanAttachment"("organizationId");
CREATE INDEX "ScanAttachment_scanLogId_idx" ON "ScanAttachment"("scanLogId");
CREATE INDEX "ScanAttachment_incidentId_idx" ON "ScanAttachment"("incidentId");

ALTER TABLE "ScanAttachment" ADD CONSTRAINT "ScanAttachment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ScanAttachment" ADD CONSTRAINT "ScanAttachment_scanLogId_fkey" FOREIGN KEY ("scanLogId") REFERENCES "ScanLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ScanAttachment" ADD CONSTRAINT "ScanAttachment_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
