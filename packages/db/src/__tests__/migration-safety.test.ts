/**
 * Unit tests for migration safety verification and DIRECT_DATABASE_URL enforcement.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateDirectDatabaseUrl,
  analyzeMigrationSql,
} from '../migration-safety';

describe('validateDirectDatabaseUrl', () => {
  it('validates a correct postgresql:// direct URL', () => {
    const result = validateDirectDatabaseUrl(
      'postgresql://postgres:secret@db.local:5432/gateflow_db'
    );
    assert.equal(result.valid, true);
    assert.equal(result.isDirect, true);
    assert.equal(result.isAccelerate, false);
    assert.equal(result.scheme, 'postgresql');
  });

  it('validates a correct postgres:// direct URL', () => {
    const result = validateDirectDatabaseUrl(
      'postgres://user:pass@ep-cool-db.us-east-2.aws.neon.tech/neondb'
    );
    assert.equal(result.valid, true);
    assert.equal(result.isDirect, true);
    assert.equal(result.isAccelerate, false);
    assert.equal(result.scheme, 'postgres');
  });

  it('rejects empty or missing DIRECT_DATABASE_URL', () => {
    const result = validateDirectDatabaseUrl('');
    assert.equal(result.valid, false);
    assert.match(result.error || '', /missing or empty/i);
  });

  it('rejects Prisma Accelerate prisma:// URLs', () => {
    const result = validateDirectDatabaseUrl(
      'prisma://accelerate.prisma-data.net/?api_key=secret_token'
    );
    assert.equal(result.valid, false);
    assert.equal(result.isAccelerate, true);
    assert.match(result.error || '', /cannot be a Prisma Accelerate URL/i);
  });

  it('rejects unsupported database schemes (e.g. mysql://, sqlite://)', () => {
    const result = validateDirectDatabaseUrl(
      'mysql://root:pass@localhost:3306/db'
    );
    assert.equal(result.valid, false);
    assert.equal(result.isDirect, false);
    assert.match(result.error || '', /unsupported scheme/i);
  });
});

describe('analyzeMigrationSql', () => {
  it('passes on standard additive migration SQL', () => {
    const sql = `
      -- CreateTable
      CREATE TABLE "ShiftLog" (
        "id" TEXT NOT NULL,
        "organizationId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ShiftLog_pkey" PRIMARY KEY ("id")
      );
      ALTER TABLE "ShiftLog" ADD CONSTRAINT "ShiftLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;
    const result = analyzeMigrationSql(sql);
    assert.equal(result.isSafe, true);
    assert.equal(result.destructiveStatements.length, 0);
  });

  it('flags DROP TABLE as destructive', () => {
    const sql = `
      DROP TABLE "OldTable";
    `;
    const result = analyzeMigrationSql(sql);
    assert.equal(result.isSafe, false);
    assert.ok(result.destructiveStatements.includes('DROP TABLE'));
  });

  it('flags DROP COLUMN as destructive', () => {
    const sql = `
      ALTER TABLE "User" DROP COLUMN "legacyPassword";
    `;
    const result = analyzeMigrationSql(sql);
    assert.equal(result.isSafe, false);
    assert.ok(result.destructiveStatements.includes('DROP COLUMN'));
  });

  it('flags TRUNCATE as destructive', () => {
    const sql = `
      TRUNCATE "AuditLog";
    `;
    const result = analyzeMigrationSql(sql);
    assert.equal(result.isSafe, false);
    assert.ok(result.destructiveStatements.includes('TRUNCATE'));
  });

  it('permits destructive SQL when explicit safety override annotation is present', () => {
    const sql = `
      -- prisma-safety-override: deprecating legacy table following RFC-2026-08
      DROP TABLE "DeprecatedSession";
    `;
    const result = analyzeMigrationSql(sql);
    assert.equal(result.isSafe, true);
    assert.equal(result.hasSafetyOverride, true);
    assert.equal(
      result.overrideReason,
      'deprecating legacy table following RFC-2026-08'
    );
    assert.ok(result.destructiveStatements.includes('DROP TABLE'));
  });

  it('permits destructive SQL when allowDestructive option is set', () => {
    const sql = `
      DROP COLUMN "tempCol";
    `;
    const result = analyzeMigrationSql(sql, { allowDestructive: true });
    assert.equal(result.isSafe, true);
    assert.equal(result.hasSafetyOverride, true);
  });
});
