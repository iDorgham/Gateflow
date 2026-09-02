-- AlterTable: Add optional organizationId column, index, and foreign key to ScanLog
ALTER TABLE "ScanLog" ADD COLUMN "organizationId" TEXT;

-- CreateIndex
CREATE INDEX "ScanLog_organizationId_idx" ON "ScanLog"("organizationId");
CREATE INDEX "ScanLog_organizationId_scannedAt_idx" ON "ScanLog"("organizationId", "scannedAt");

-- AddForeignKey
ALTER TABLE "ScanLog" ADD CONSTRAINT "ScanLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
