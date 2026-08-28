-- A gate can have at most one active shift at a time.
CREATE UNIQUE INDEX "ShiftLog_active_gate_key"
ON "ShiftLog"("gateId")
WHERE "endTime" IS NULL;
