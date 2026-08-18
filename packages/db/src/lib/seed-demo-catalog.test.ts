export {};

import { mulberry32 } from './red-sea-data';
import {
  normalizeNationalityWeights,
  sampleNationality,
  type ContactNationality,
} from './rich-contact';
import {
  DEMO_ORG_SPECS,
  DEMO_PAST_DAYS,
  SELENA_PROJECT_SPECS,
  SUPER_ADMIN_EMAIL,
  areaNationalityWeights,
  countNationalities,
  demoRoleEmailMatrix,
  demoRoleEmails,
  nationalityNotes,
  planClassroomNames,
  planVerticalUnitNames,
  shareOf,
  shouldSkipEmulation,
  spreadCreatedAt,
} from './seed-demo-catalog';

describe('seed-demo-catalog', () => {
  test('role email matrix is globally unique and covers every demo org', () => {
    const matrix = demoRoleEmailMatrix();
    expect(Object.keys(matrix)).toHaveLength(DEMO_ORG_SPECS.length);
    const emails: string[] = [SUPER_ADMIN_EMAIL];
    for (const spec of DEMO_ORG_SPECS) {
      const roles = demoRoleEmails(spec.emailDomain);
      emails.push(roles.admin, roles.security, roles.guard, roles.resident);
    }
    expect(new Set(emails).size).toBe(emails.length);
    expect(matrix['selenadev.com']?.security).toBe('security@selenadev.com');
    expect(matrix['school.demo']?.resident).toBe('resident@school.demo');
  });

  test('school units are classrooms', () => {
    const names = planVerticalUnitNames('SCHOOL');
    expect(names).toHaveLength(12);
    expect(names[0]).toBe('Classroom 1A');
    expect(planClassroomNames(4)).toEqual([
      'Classroom 1A',
      'Classroom 1B',
      'Classroom 1C',
      'Classroom 1D',
    ]);
  });

  test('Selena catalog includes El Gouna and Soma Bay', () => {
    const names = SELENA_PROJECT_SPECS.map((p) => p.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'Selena Bay',
        'Vernada',
        'El Gouna Residences',
        'Soma Bay Villas',
      ])
    );
  });

  test('spreadCreatedAt spans the 6-month window', () => {
    const now = new Date('2026-08-16T12:00:00.000Z');
    const oldest = spreadCreatedAt(0, 10, DEMO_PAST_DAYS, now);
    const newest = spreadCreatedAt(9, 10, DEMO_PAST_DAYS, now);
    expect(newest.getTime()).toBe(now.getTime());
    const days =
      (now.getTime() - oldest.getTime()) / (24 * 60 * 60 * 1000);
    expect(days).toBeCloseTo(DEMO_PAST_DAYS, 5);
  });

  test('shouldSkipEmulation is idempotent at the target', () => {
    expect(shouldSkipEmulation(2499, 2500)).toBe(false);
    expect(shouldSkipEmulation(2500, 2500)).toBe(true);
    expect(shouldSkipEmulation(9000, 2500)).toBe(true);
  });

  test('nationality notes use display labels', () => {
    expect(nationalityNotes('EGYPTIAN')).toBe('Nationality: Egyptian');
    expect(nationalityNotes('BRITISH')).toBe('Nationality: British');
  });

  test('Hurghada mix is Egyptian-majority; El Gouna / Soma Bay lean Northern European', () => {
    const n = 4000;
    const sampleArea = (area: 'HURGHADA' | 'EL_GOUNA' | 'SOMA_BAY') => {
      const weights = normalizeNationalityWeights(areaNationalityWeights(area));
      const out: ContactNationality[] = [];
      for (let i = 0; i < n; i++) {
        out.push(sampleNationality(mulberry32((i + 1) * 997), weights));
      }
      return countNationalities(out);
    };

    const hurghada = sampleArea('HURGHADA');
    expect(shareOf(hurghada, ['EGYPTIAN'])).toBeGreaterThan(0.5);
    expect(shareOf(hurghada, ['RUSSIAN', 'GERMAN'])).toBeGreaterThan(0.2);

    const gouna = sampleArea('EL_GOUNA');
    expect(shareOf(gouna, ['GERMAN', 'BRITISH', 'DUTCH'])).toBeGreaterThan(0.4);

    const soma = sampleArea('SOMA_BAY');
    expect(shareOf(soma, ['GERMAN', 'BRITISH', 'DUTCH'])).toBeGreaterThan(0.4);
  });
});
