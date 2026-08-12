-- Per-organization brand accent color, exposed on the Workspace Settings form.
-- Nullable: null falls back to the default brand color in the UI.
ALTER TABLE "Organization" ADD COLUMN "accentColor" TEXT;
