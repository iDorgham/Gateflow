-- Consolidate duplicate TaskBoard rows per (organizationId, department)
-- before adding the unique constraint. Keep the oldest board; reassign tasks;
-- drop extras.
--
-- Lock TaskBoard for the duration of this migration transaction so a
-- concurrent INSERT can't land between the dedup snapshot and the unique
-- index build (which would otherwise either escape the CTEs above or make
-- CREATE UNIQUE INDEX fail on a fresh duplicate).
LOCK TABLE "TaskBoard" IN SHARE ROW EXCLUSIVE MODE;

WITH ranked AS (
  SELECT
    id,
    "organizationId",
    department,
    ROW_NUMBER() OVER (
      PARTITION BY "organizationId", department
      ORDER BY "createdAt" ASC, id ASC
    ) AS rn
  FROM "TaskBoard"
),
keepers AS (
  SELECT id, "organizationId", department
  FROM ranked
  WHERE rn = 1
),
dupes AS (
  SELECT r.id AS dupe_id, k.id AS keep_id
  FROM ranked r
  JOIN keepers k
    ON k."organizationId" = r."organizationId"
   AND k.department = r.department
  WHERE r.rn > 1
)
UPDATE "Task"
SET "boardId" = dupes.keep_id
FROM dupes
WHERE "Task"."boardId" = dupes.dupe_id;

WITH ranked AS (
  SELECT
    id,
    "organizationId",
    department,
    ROW_NUMBER() OVER (
      PARTITION BY "organizationId", department
      ORDER BY "createdAt" ASC, id ASC
    ) AS rn
  FROM "TaskBoard"
)
DELETE FROM "TaskBoard"
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- CreateIndex
CREATE UNIQUE INDEX "TaskBoard_organizationId_department_key" ON "TaskBoard"("organizationId", department);
