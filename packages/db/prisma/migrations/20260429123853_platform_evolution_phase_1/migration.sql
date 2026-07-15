/*
  Warnings:

  - The values [PENDING,CANCELLED] on the enum `AiActionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `actionType` on the `AiActionLog` table. All the data in the column will be lost.
  - Added the required column `action` to the `AiActionLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `organizationId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AiActionStatus_new" AS ENUM ('PENDING_CONFIRMATION', 'CONFIRMED', 'REJECTED', 'EXECUTED', 'FAILED');
ALTER TABLE "AiActionLog" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "AiActionLog" ALTER COLUMN "status" TYPE "AiActionStatus_new" USING ("status"::text::"AiActionStatus_new");
ALTER TYPE "AiActionStatus" RENAME TO "AiActionStatus_old";
ALTER TYPE "AiActionStatus_new" RENAME TO "AiActionStatus";
DROP TYPE "AiActionStatus_old";
ALTER TABLE "AiActionLog" ALTER COLUMN "status" SET DEFAULT 'PENDING_CONFIRMATION';
COMMIT;

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "AiActionLog" DROP COLUMN "actionType",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "payload" JSONB,
ADD COLUMN     "reasoning" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING_CONFIRMATION';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "organizationId" SET NOT NULL;

-- CreateTable
CREATE TABLE "AiGeneratedAsset" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "aiActionLogId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiGeneratedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiGeneratedAsset_organizationId_idx" ON "AiGeneratedAsset"("organizationId");

-- CreateIndex
CREATE INDEX "AiGeneratedAsset_aiActionLogId_idx" ON "AiGeneratedAsset"("aiActionLogId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiGeneratedAsset" ADD CONSTRAINT "AiGeneratedAsset_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiGeneratedAsset" ADD CONSTRAINT "AiGeneratedAsset_aiActionLogId_fkey" FOREIGN KEY ("aiActionLogId") REFERENCES "AiActionLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
