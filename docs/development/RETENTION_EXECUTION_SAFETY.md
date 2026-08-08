# Retention Execution Safety Contract

Status: implementation scaffold; production activation prohibited.

## Boundary

`executeRetention` coordinates reviewed retention batches but does not contain Prisma deletion code. A production adapter must implement every batch as one database transaction and prove relationship safety before the executor accepts the result.

## Required order

1. Identity artifacts
2. Incidents
3. Scan logs
4. Visitor history

For scan-log batches, the adapter must detach attachments whose retention has not expired and unlink retained incidents before deleting a scan. It must never rely on cascades that shorten another category's approved retention.

## Mandatory controls

- Every operation carries one non-empty `organizationId`; cross-tenant candidate lists are prohibited.
- Apply requires exact `APPLY_RETENTION` confirmation and the same policy version reviewed during dry run.
- Legal hold and policy version are re-read before every mutation batch.
- Batch size is 1–500 and candidate IDs must be unique.
- Each batch is atomic and its affected count must equal the reviewed ID count.
- Re-running after a completed batch must select no already-processed records.
- Logs contain IDs/counts and control decisions, never personal record contents.

## Activation gates

Do not implement or register a production adapter until all are complete:

1. Qualified legal review covers purposes, retention periods, legal holds, audit retention, data-subject rights, and backup expiry.
2. Backup and restore behavior is documented and tested.
3. Prisma relationship handling is proven against a non-production database fixture.
4. Tests cover mixed retention periods, newer linked incidents/attachments, tenant isolation, mid-run legal hold, stale policy, interruption/resume, and idempotent rerun.
5. Privacy Reviewer and Evidence Verifier issue a conditional or passing gate.
6. Project Manager records the activation decision and rollback limitations.

The current CLI remains dry-run only and rejects `--apply`.
