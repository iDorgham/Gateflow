/**
 * Unit tests for data retention policies and filter builders.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getDataRetentionPolicy,
  buildRetentionFilter,
  DATA_RETENTION_POLICIES,
} from '../data-retention';

describe('getDataRetentionPolicy', () => {
  it('returns valid retention policy for auditLog', () => {
    const policy = getDataRetentionPolicy('auditLog');
    assert.ok(policy);
    assert.equal(policy?.retentionDays, 365);
    assert.equal(policy?.dateField, 'createdAt');
  });

  it('returns valid retention policy for scanLog', () => {
    const policy = getDataRetentionPolicy('scanLog');
    assert.ok(policy);
    assert.equal(policy?.retentionDays, 180);
    assert.equal(policy?.dateField, 'scannedAt');
  });

  it('handles case-insensitive and capitalized model names', () => {
    const policy = getDataRetentionPolicy('ShortLinkClick');
    assert.ok(policy);
    assert.equal(policy?.retentionDays, 90);
    assert.equal(policy?.dateField, 'clickedAt');
  });

  it('returns undefined for non-retention models', () => {
    const policy = getDataRetentionPolicy('organization');
    assert.equal(policy, undefined);
  });
});

describe('buildRetentionFilter', () => {
  it('builds a correct cutoff date filter for auditLog', () => {
    const asOf = new Date('2026-08-25T12:00:00Z');
    const filter = buildRetentionFilter('auditLog', asOf);
    assert.ok(filter);
    assert.ok(filter?.createdAt?.lt instanceof Date);

    const cutoff = filter?.createdAt?.lt as Date;
    const diffDays =
      (asOf.getTime() - cutoff.getTime()) / (1000 * 60 * 60 * 24);
    assert.ok(Math.abs(diffDays - 365) < 0.01);
  });

  it('builds a correct cutoff date filter for scanLog using scannedAt', () => {
    const asOf = new Date('2026-08-25T12:00:00Z');
    const filter = buildRetentionFilter('scanLog', asOf);
    assert.ok(filter);
    assert.ok(filter?.scannedAt?.lt instanceof Date);

    const cutoff = filter?.scannedAt?.lt as Date;
    const diffDays =
      (asOf.getTime() - cutoff.getTime()) / (1000 * 60 * 60 * 24);
    assert.ok(Math.abs(diffDays - 180) < 0.01);
  });

  it('returns null for models without retention policy', () => {
    const filter = buildRetentionFilter('gate');
    assert.equal(filter, null);
  });
});
