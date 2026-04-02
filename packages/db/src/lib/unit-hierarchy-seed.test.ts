export {};

import { UnitIdFormat } from '@prisma/client';
import { createUniquenessBucket } from './seed-integrity';
import {
  assertPlannedHierarchyIntegrity,
  buildPlannedUnitHierarchy,
  buildingCodeForGlobalIndex,
  projectScopedUnitName,
} from './unit-hierarchy-seed';

/** 1×1×4 floors × 2 units/floor = 8 units (deterministic when min=max). */
const TIGHT_RANGES = {
  minPhases: 1,
  maxPhases: 1,
  minBuildingsPerPhase: 1,
  maxBuildingsPerPhase: 1,
  minFloorsPerBuilding: 4,
  maxFloorsPerBuilding: 4,
  minUnitsPerFloor: 2,
  maxUnitsPerFloor: 2,
} as const;

describe('unit-hierarchy-seed', () => {
  test('buildingCodeForGlobalIndex: A–Z then T1', () => {
    expect(buildingCodeForGlobalIndex(0)).toBe('A');
    expect(buildingCodeForGlobalIndex(25)).toBe('Z');
    expect(buildingCodeForGlobalIndex(26)).toBe('T1');
  });

  test('projectScopedUnitName: same format label, different projects → different names', () => {
    const base = 'A-1-01';
    const a = projectScopedUnitName('clxxxxxxxx01projectaaa', base);
    const b = projectScopedUnitName('clxxxxxxxx02projectbbb', base);
    expect(a).toContain(base);
    expect(b).toContain(base);
    expect(a).not.toBe(b);
  });

  test('buildPlannedUnitHierarchy: fixed layout — 8 units, unique names, org + project', () => {
    const bucket = createUniquenessBucket();
    const orgId = 'org_test_1';
    const projectId = 'proj_test_1';
    const owners = ['c1', 'c2'];

    const rows = buildPlannedUnitHierarchy({
      organizationId: orgId,
      projectId,
      unitIdFormat: 'COMPACT' as UnitIdFormat,
      ranges: TIGHT_RANGES,
      seed: 424242,
      ownerContactIds: owners,
      nameBucket: bucket,
    });

    expect(rows.length).toBe(8);
    assertPlannedHierarchyIntegrity(rows);

    for (const r of rows) {
      expect(r.organizationId).toBe(orgId);
      expect(r.projectId).toBe(projectId);
      expect(r.sizeSqm).toBeGreaterThan(0);
      expect(owners).toContain(r.ownerContactId);
      expect(r.meta.areaSqm).toBeGreaterThan(0);
      expect(r.meta.balconyArea).toBeGreaterThanOrEqual(0);
      expect(r.meta.terraceArea).toBeGreaterThanOrEqual(0);
    }

    const names = new Set(rows.map((r) => r.name));
    expect(names.size).toBe(8);
  });

  test('buildPlannedUnitHierarchy: owner assignment is round-robin', () => {
    const bucket = createUniquenessBucket();
    const owners = ['a', 'b', 'c'];
    const rows = buildPlannedUnitHierarchy({
      organizationId: 'o1',
      projectId: 'p1',
      unitIdFormat: 'COMPACT',
      ranges: TIGHT_RANGES,
      seed: 7,
      ownerContactIds: owners,
      nameBucket: bucket,
    });

    rows.forEach((r, i) => {
      expect(r.ownerContactId).toBe(owners[i % owners.length]);
    });
  });

  test('buildPlannedUnitHierarchy: deterministic for same seed', () => {
    const b1 = createUniquenessBucket();
    const b2 = createUniquenessBucket();
    const params = {
      organizationId: 'o',
      projectId: 'p-seed',
      unitIdFormat: 'SIMPLE' as UnitIdFormat,
      ranges: TIGHT_RANGES,
      seed: 99,
      ownerContactIds: ['x'],
      nameBucket: b1,
    };
    const r1 = buildPlannedUnitHierarchy(params);
    const r2 = buildPlannedUnitHierarchy({
      ...params,
      nameBucket: b2,
    });
    expect(r1.map((r) => r.name)).toEqual(r2.map((r) => r.name));
    expect(r1.map((r) => r.type)).toEqual(r2.map((r) => r.type));
  });

  const FORMATS: UnitIdFormat[] = [
    'COMPACT',
    'BUILDING_FIRST',
    'SIMPLE',
    'LOCATION',
    'DESCRIPTIVE',
    'GLOBAL',
  ];

  test.each(FORMATS)(
    'buildPlannedUnitHierarchy: format %s produces valid rows',
    (unitIdFormat) => {
      const rows = buildPlannedUnitHierarchy({
        organizationId: 'o',
        projectId: `p-${unitIdFormat}`,
        unitIdFormat,
        ranges: TIGHT_RANGES,
        seed: 1,
        ownerContactIds: ['c0'],
        nameBucket: createUniquenessBucket(),
      });
      expect(rows.length).toBeGreaterThan(0);
      for (const r of rows) {
        expect(r.name.length).toBeGreaterThan(0);
        expect(r.building.length).toBeGreaterThan(0);
      }
    }
  );
});
