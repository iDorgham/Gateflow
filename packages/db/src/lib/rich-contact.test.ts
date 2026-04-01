export {};

import { mulberry32 } from './red-sea-data';
import {
  createUniquenessBucket,
  UniquenessViolationError,
} from './seed-integrity';
import {
  CONTACT_NATIONALITIES,
  DEFAULT_NATIONALITY_WEIGHTS,
  generateRichContact,
  sampleNationality,
} from './rich-contact';

describe('rich-contact', () => {
  const DISTRIBUTION_SEED = 42;
  const DISTRIBUTION_N = 10_000;
  const TOLERANCE = 0.02;

  test(`nationality distribution within ±${TOLERANCE * 100}% of targets at N=${DISTRIBUTION_N}, seed=${DISTRIBUTION_SEED}`, () => {
    const counts: Record<string, number> = {};
    for (const n of CONTACT_NATIONALITIES) counts[n] = 0;

    for (let i = 0; i < DISTRIBUTION_N; i++) {
      const rng = mulberry32((DISTRIBUTION_SEED + i) >>> 0);
      const nat = sampleNationality(rng, DEFAULT_NATIONALITY_WEIGHTS);
      counts[nat]++;
    }

    for (const n of CONTACT_NATIONALITIES) {
      const target = DEFAULT_NATIONALITY_WEIGHTS[n];
      const actual = counts[n]! / DISTRIBUTION_N;
      expect(Math.abs(actual - target)).toBeLessThanOrEqual(TOLERANCE);
    }
  });

  test('generateRichContact: 5000 rows — no duplicate email/phone per org (bucket)', () => {
    const orgId = 'org_rich_contact_test';
    const bucket = createUniquenessBucket();
    const seed = 99;

    for (let seq = 0; seq < 5000; seq++) {
      expect(() =>
        generateRichContact({
          organizationId: orgId,
          seed,
          sequence: seq,
          bucket,
        })
      ).not.toThrow(UniquenessViolationError);
    }

    expect(bucket.emails.size).toBe(5000);
    expect(bucket.phones.size).toBe(5000);
  });

  test('generateRichContact: stable payload for same inputs', () => {
    const bucket1 = createUniquenessBucket();
    const bucket2 = createUniquenessBucket();
    const a = generateRichContact({
      organizationId: 'o1',
      seed: 7,
      sequence: 3,
      bucket: bucket1,
    });
    const b = generateRichContact({
      organizationId: 'o1',
      seed: 7,
      sequence: 3,
      bucket: bucket2,
    });
    expect(a).toEqual(b);
  });

  test('emails are @example.com only', () => {
    const bucket = createUniquenessBucket();
    const p = generateRichContact({
      organizationId: 'o1',
      seed: 1,
      sequence: 0,
      bucket,
    });
    expect(p.email.endsWith('@example.com')).toBe(true);
    expect(p.phone.startsWith('+')).toBe(true);
  });
});
