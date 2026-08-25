/**
 * Unit tests for tenant query scoping auditor and soft-delete compliance.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  auditPrismaQuery,
  assertTenantScoped,
  TenantScopingViolationError,
} from '../tenant-query-auditor';

describe('auditPrismaQuery', () => {
  it('passes on properly scoped findMany query with organizationId', () => {
    const result = auditPrismaQuery('gate', 'findMany', {
      where: {
        organizationId: 'org_123',
        status: 'ACTIVE',
      },
    });
    assert.equal(result.scoped, true);
    assert.equal(result.hasOrganizationId, true);
    assert.equal(result.violations.length, 0);
  });

  it('fails on tenant query missing organizationId in where clause', () => {
    const result = auditPrismaQuery('visitor', 'findMany', {
      where: {
        status: 'CHECKED_IN',
      },
    });
    assert.equal(result.scoped, false);
    assert.equal(result.hasOrganizationId, false);
    assert.ok(result.violations.length > 0);
    assert.match(result.violations[0], /Missing or invalid "organizationId"/i);
  });

  it('passes on create mutation with organizationId in data payload', () => {
    const result = auditPrismaQuery('incident', 'create', {
      data: {
        organizationId: 'org_123',
        title: 'Gate barrier sensor failure',
        severity: 'HIGH',
      },
    });
    assert.equal(result.scoped, true);
    assert.equal(result.hasOrganizationId, true);
  });

  it('passes on create mutation with relational organization connect syntax', () => {
    const result = auditPrismaQuery('incident', 'create', {
      data: {
        title: 'Perimeter check',
        organization: { connect: { id: 'org_123' } },
      },
    });
    assert.equal(result.scoped, true);
    assert.equal(result.hasOrganizationId, true);
  });

  it('fails on create mutation missing organizationId', () => {
    const result = auditPrismaQuery('unit', 'create', {
      data: {
        name: 'Villa 104',
        type: 'VILLA',
      },
    });
    assert.equal(result.scoped, false);
    assert.match(
      result.violations[0],
      /Missing "organizationId" in create "data"/i
    );
  });

  it('enforces expectedOrgId when supplied in options', () => {
    const result = auditPrismaQuery(
      'pass',
      'findFirst',
      {
        where: {
          organizationId: 'org_attacker',
        },
      },
      { expectedOrgId: 'org_victim' }
    );
    assert.equal(result.scoped, false);
    assert.match(result.violations[0], /Missing or invalid "organizationId"/i);
  });

  it('checks soft-delete compliance when enforceSoftDelete option is enabled', () => {
    const withoutSoftDelete = auditPrismaQuery(
      'contact',
      'findMany',
      {
        where: {
          organizationId: 'org_123',
        },
      },
      { enforceSoftDelete: true }
    );
    assert.equal(withoutSoftDelete.scoped, false);
    assert.equal(withoutSoftDelete.hasSoftDeleteFilter, false);

    const withSoftDelete = auditPrismaQuery(
      'contact',
      'findMany',
      {
        where: {
          organizationId: 'org_123',
          deletedAt: null,
        },
      },
      { enforceSoftDelete: true }
    );
    assert.equal(withSoftDelete.scoped, true);
    assert.equal(withSoftDelete.hasSoftDeleteFilter, true);
  });

  it('bypasses checks when allowPrivileged option is set', () => {
    const result = auditPrismaQuery(
      'user',
      'findMany',
      { where: {} },
      { allowPrivileged: true }
    );
    assert.equal(result.scoped, true);
    assert.equal(result.violations.length, 0);
  });
});

describe('assertTenantScoped', () => {
  it('throws TenantScopingViolationError on unscoped queries', () => {
    assert.throws(
      () => {
        assertTenantScoped('workOrder', 'updateMany', {
          where: { status: 'PENDING' },
          data: { status: 'CANCELLED' },
        });
      },
      (err: any) => err instanceof TenantScopingViolationError
    );
  });

  it('returns valid audit result without throwing when query is properly scoped', () => {
    const result = assertTenantScoped('workOrder', 'updateMany', {
      where: { organizationId: 'org_123', status: 'PENDING' },
      data: { status: 'CANCELLED' },
    });
    assert.equal(result.scoped, true);
  });
});
