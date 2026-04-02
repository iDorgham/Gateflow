import {
  buildEmulateTrafficBody,
  emulationStep0Schema,
  validateScenario,
  validateStep0,
} from './emulation-schema';

describe('emulation-schema', () => {
  test('buildEmulateTrafficBody trims org and drops empty optional ids', () => {
    const body = buildEmulateTrafficBody({
      organizationId: '  org_x  ',
      scenario: 'luxury-compound',
      pastDays: 7,
      totalScans: 10,
      incidentRate: 0.1,
      randomSeed: 1,
      dryRun: true,
      projectId: '',
      gateId: '  ',
      unitId: 'u1',
      contactId: '',
      createdByUserId: '',
    });
    expect(body.organizationId).toBe('org_x');
    expect(body.unitId).toBe('u1');
    expect(body.projectId).toBeUndefined();
    expect(body.gateId).toBeUndefined();
  });

  test('validateStep0 returns null for valid input', () => {
    expect(
      validateStep0({
        organizationId: 'o1',
        pastDays: 1,
        totalScans: 1,
        incidentRate: 0,
        randomSeed: 0,
      })
    ).toBeNull();
  });

  test('validateStep0 fails for empty org', () => {
    const msg = validateStep0({
      organizationId: '',
      pastDays: 7,
      totalScans: 10,
      incidentRate: 0.05,
      randomSeed: 1,
    });
    expect(msg).toBeTruthy();
  });

  test('emulationStep0Schema rejects pastDays 0', () => {
    expect(
      emulationStep0Schema.safeParse({
        organizationId: 'x',
        pastDays: 0,
        totalScans: 1,
        incidentRate: 0,
        randomSeed: 0,
      }).success
    ).toBe(false);
  });

  test('validateScenario', () => {
    expect(validateScenario('nightclub')).toBe(true);
    expect(validateScenario('invalid')).toBe(false);
  });
});
