export {};

import { UnitIdFormat } from '@prisma/client';
import {
  createUniquenessBucket,
  UniquenessViolationError,
  validateUniqueness,
} from './seed-integrity';
import { generateUnitId, normalizeBuildingCode } from './unit-id-formats';

const FORMATS: UnitIdFormat[] = [
  'COMPACT',
  'BUILDING_FIRST',
  'SIMPLE',
  'LOCATION',
  'DESCRIPTIVE',
  'GLOBAL',
];

describe('unit-id-formats', () => {
  describe('normalizeBuildingCode', () => {
    test('uppercases and strips junk', () => {
      expect(normalizeBuildingCode(' a1 ')).toBe('A1');
    });

    test('throws when empty', () => {
      expect(() => normalizeBuildingCode('   ')).toThrow();
    });
  });

  describe('generateUnitId — golden strings (deterministic)', () => {
    const ctx = {
      buildingCode: 'a',
      floor: 3,
      unitIndex: 5,
      phase: 'Selena',
    } as const;

    test('COMPACT', () => {
      expect(generateUnitId('COMPACT', ctx)).toBe('A-3-05');
    });

    test('BUILDING_FIRST', () => {
      expect(generateUnitId('BUILDING_FIRST', ctx)).toBe('B-A-F3-U5');
    });

    test('SIMPLE', () => {
      expect(generateUnitId('SIMPLE', ctx)).toBe('A0305');
    });

    test('LOCATION', () => {
      expect(generateUnitId('LOCATION', ctx)).toBe('SELENA-A-F3-U5');
    });

    test('DESCRIPTIVE', () => {
      expect(generateUnitId('DESCRIPTIVE', ctx)).toBe(
        'Tower A · Floor 3 · Unit 5'
      );
    });

    test('GLOBAL', () => {
      expect(generateUnitId('GLOBAL', ctx)).toBe('RS-SELENA-A-003-005');
    });
  });

  describe('uniqueness simulation (10k names / org / format)', () => {
    test.each(FORMATS)('%s — no duplicates in 10×20×50 grid', (format) => {
      const orgId = 'org_sim_1';
      const bucket = createUniquenessBucket();
      for (let bi = 0; bi < 10; bi++) {
        const buildingCode = String.fromCharCode(65 + bi);
        for (let f = 1; f <= 20; f++) {
          for (let u = 1; u <= 50; u++) {
            const name = generateUnitId(format, {
              buildingCode,
              floor: f,
              unitIndex: u,
              phase: bi % 2 === 0 ? 'Selena' : 'Vernada',
            });
            expect(() =>
              validateUniqueness(bucket, {
                organizationId: orgId,
                unitName: name,
              })
            ).not.toThrow(UniquenessViolationError);
          }
        }
      }
      expect(bucket.unitNames.size).toBe(10_000);
    });
  });
});
