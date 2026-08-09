-- Add fail-closed retention governance controls.
ALTER TABLE "Organization"
ADD COLUMN "retentionLegalHold" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "retentionPolicyUpdatedAt" TIMESTAMP(3);
