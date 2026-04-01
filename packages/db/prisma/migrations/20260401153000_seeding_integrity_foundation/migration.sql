-- Org-scoped uniqueness for **active** Contact rows only (soft-deleted rows may repeat email/phone).
CREATE UNIQUE INDEX "Contact_organizationId_email_key" ON "Contact"("organizationId", "email") WHERE "email" IS NOT NULL AND "deletedAt" IS NULL;

CREATE UNIQUE INDEX "Contact_organizationId_phone_key" ON "Contact"("organizationId", "phone") WHERE "phone" IS NOT NULL AND "deletedAt" IS NULL;
