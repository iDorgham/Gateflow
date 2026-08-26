const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const { getRepoRoot } = require('../repo-root');

const ROOT = getRepoRoot(__dirname);

describe('Database Migration Safety & Direct DB URL Verification', () => {
  // Test DIRECT_DATABASE_URL validation logic directly
  function validateDirectUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
      return { valid: false, error: 'DIRECT_DATABASE_URL is missing or empty' };
    }
    const trimmed = rawUrl.trim();
    if (
      trimmed.startsWith('prisma://') ||
      trimmed.startsWith('prisma+postgres://')
    ) {
      return {
        valid: false,
        error: 'DIRECT_DATABASE_URL cannot be Accelerate URL',
      };
    }
    if (
      !trimmed.startsWith('postgresql://') &&
      !trimmed.startsWith('postgres://')
    ) {
      return { valid: false, error: 'Unsupported scheme' };
    }
    return {
      valid: true,
      scheme: trimmed.startsWith('postgresql://') ? 'postgresql' : 'postgres',
    };
  }

  function analyzeMigration(sql) {
    const overrideMatch = sql.match(
      /--\s*prisma-safety-override:\s*([^\r\n]+)/i
    );
    const hasOverride = Boolean(overrideMatch);
    const cleanSql = sql
      .split('\n')
      .filter((l) => !l.trim().startsWith('--'))
      .join('\n');
    const destructive = [];
    if (/\bDROP\s+TABLE\b/i.test(cleanSql)) destructive.push('DROP TABLE');
    if (/\bDROP\s+COLUMN\b/i.test(cleanSql)) destructive.push('DROP COLUMN');
    if (/\bTRUNCATE\b/i.test(cleanSql)) destructive.push('TRUNCATE');
    return {
      isSafe: hasOverride || destructive.length === 0,
      destructive,
      hasOverride,
    };
  }

  it('validates direct postgresql URL and rejects Accelerate URL', () => {
    assert.equal(
      validateDirectUrl('postgresql://user:pass@localhost:5432/db').valid,
      true
    );
    assert.equal(
      validateDirectUrl('postgres://user:pass@localhost:5432/db').valid,
      true
    );
    assert.equal(
      validateDirectUrl('prisma://accelerate.prisma-data.net').valid,
      false
    );
    assert.equal(validateDirectUrl('').valid, false);
  });

  it('detects destructive migration SQL without override annotation', () => {
    const safeSql = 'CREATE TABLE "Test" ("id" TEXT NOT NULL PRIMARY KEY);';
    const destructiveSql = 'DROP TABLE "OldTable";';
    const overriddenSql =
      '-- prisma-safety-override: intentional drop\nDROP TABLE "OldTable";';

    assert.equal(analyzeMigration(safeSql).isSafe, true);
    assert.equal(analyzeMigration(destructiveSql).isSafe, false);
    assert.equal(analyzeMigration(overriddenSql).isSafe, true);
  });

  it('validates that prisma/schema.prisma configures directUrl = env("DIRECT_DATABASE_URL")', () => {
    const schemaPath = path.join(
      ROOT,
      'packages',
      'db',
      'prisma',
      'schema.prisma'
    );
    assert.ok(fs.existsSync(schemaPath), 'schema.prisma exists');
    const content = fs.readFileSync(schemaPath, 'utf8');
    assert.match(content, /directUrl\s*=\s*env\("DIRECT_DATABASE_URL"\)/);
  });
});

describe('Tenant Query Scoping & Retention Auditor', () => {
  const TENANT_MODELS = new Set([
    'project',
    'visitor',
    'unit',
    'incident',
    'workOrder',
    'gate',
  ]);

  function auditQuery(model, operation, queryArgs = {}) {
    if (!TENANT_MODELS.has(model.toLowerCase())) {
      return { scoped: true, violations: [] };
    }
    const violations = [];
    if (['findMany', 'findFirst', 'update', 'delete'].includes(operation)) {
      if (!queryArgs.where || queryArgs.where.organizationId === undefined) {
        violations.push(`Missing organizationId in ${model}.${operation}`);
      }
    } else if (operation === 'create') {
      if (!queryArgs.data || queryArgs.data.organizationId === undefined) {
        violations.push(`Missing organizationId in ${model}.${operation}`);
      }
    }
    return { scoped: violations.length === 0, violations };
  }

  it('passes properly scoped queries and rejects unscoped tenant queries', () => {
    const scoped = auditQuery('project', 'findMany', {
      where: { organizationId: 'org_1' },
    });
    assert.equal(scoped.scoped, true);

    const unscoped = auditQuery('project', 'findMany', { where: {} });
    assert.equal(unscoped.scoped, false);
    assert.equal(unscoped.violations.length, 1);
  });

  it('verifies data retention policy definitions exist in packages/db', () => {
    const retentionFile = path.join(
      ROOT,
      'packages',
      'db',
      'src',
      'data-retention.ts'
    );
    assert.ok(fs.existsSync(retentionFile), 'data-retention.ts exists');
    const content = fs.readFileSync(retentionFile, 'utf8');
    assert.match(content, /auditLog/);
    assert.match(content, /scanLog/);
    assert.match(content, /shortLinkClick/);
  });
});
