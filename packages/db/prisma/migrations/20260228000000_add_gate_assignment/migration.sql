-- CreateTable
CREATE TABLE "GateAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gateId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GateAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GateAssignment_organizationId_idx" ON "GateAssignment"("organizationId");

-- CreateIndex
CREATE INDEX "GateAssignment_userId_idx" ON "GateAssignment"("userId");

-- CreateIndex
CREATE INDEX "GateAssignment_gateId_idx" ON "GateAssignment"("gateId");

-- CreateIndex
CREATE INDEX "GateAssignment_deletedAt_idx" ON "GateAssignment"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GateAssignment_userId_gateId_key" ON "GateAssignment"("userId", "gateId");

-- AddForeignKey
ALTER TABLE "GateAssignment" ADD CONSTRAINT "GateAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GateAssignment" ADD CONSTRAINT "GateAssignment_gateId_fkey" FOREIGN KEY ("gateId") REFERENCES "Gate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GateAssignment" ADD CONSTRAINT "GateAssignment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
