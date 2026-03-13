/*
  Warnings:

  - You are about to drop the column `integrationConfig` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `notificationConfig` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `scannerConfig` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the `AdminAuthorizationKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('QR_CREATED', 'QR_UPDATED', 'QR_DELETED', 'SCAN_RECORDED', 'CONTACT_CREATED', 'CONTACT_UPDATED', 'VISITOR_QR_CREATED', 'VISITOR_QR_DELETED');

-- AlterEnum
ALTER TYPE "Plan" ADD VALUE 'ENTERPRISE';

-- DropForeignKey
ALTER TABLE "AdminAuthorizationKey" DROP CONSTRAINT "AdminAuthorizationKey_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_organizationId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "integrationConfig",
DROP COLUMN "notificationConfig",
DROP COLUMN "scannerConfig",
ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT;

-- AlterTable
ALTER TABLE "ScanLog" ADD COLUMN     "arrivalNotifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- DropTable
DROP TABLE "AdminAuthorizationKey";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "Invitation";

-- DropTable
DROP TABLE "Task";

-- DropEnum
DROP TYPE "AdminAuthKeyType";

-- DropEnum
DROP TYPE "TaskStatus";

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventLog_organizationId_createdAt_idx" ON "EventLog"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stripeCustomerId_key" ON "Organization"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stripeSubscriptionId_key" ON "Organization"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
