-- Create Project table for multi-project support
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add index for organization lookup
CREATE INDEX "Project_organizationId_idx" ON "Project"("organizationId");

-- Add projectId column to Gate (nullable, for backward compatibility)
ALTER TABLE "Gate" ADD COLUMN "projectId" TEXT REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add index for project lookup on Gate
CREATE INDEX "Gate_projectId_idx" ON "Gate"("projectId");

-- Add projectId column to QRCode (nullable, for backward compatibility)
ALTER TABLE "QRCode" ADD COLUMN "projectId" TEXT REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add index for project lookup on QRCode
CREATE INDEX "QRCode_projectId_idx" ON "QRCode"("projectId");
