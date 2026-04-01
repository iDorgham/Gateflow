export {};

import {
  createUniquenessBucket,
  normalizeEmail,
  normalizePhone,
  UniquenessViolationError,
  validateUniqueness,
} from './seed-integrity';

describe('seed-integrity', () => {
  describe('normalizeEmail', () => {
    test('trims and lowercases', () => {
      expect(normalizeEmail('  Foo@BAR.com ')).toBe('foo@bar.com');
    });

    test('returns null for empty', () => {
      expect(normalizeEmail('')).toBeNull();
      expect(normalizeEmail('   ')).toBeNull();
      expect(normalizeEmail(null)).toBeNull();
    });
  });

  describe('normalizePhone', () => {
    test('strips separators', () => {
      expect(normalizePhone('+20 (10) 123-4567')).toBe('+20101234567');
    });
  });

  describe('validateUniqueness', () => {
    test('happy path: registers distinct rows', () => {
      const b = createUniquenessBucket();
      validateUniqueness(b, {
        organizationId: 'org1',
        id: 'c1',
        email: 'a@x.com',
        phone: '+10001',
      });
      validateUniqueness(b, {
        organizationId: 'org1',
        id: 'c2',
        email: 'b@x.com',
        phone: '+10002',
      });
      expect(b.ids.size).toBe(2);
      expect(b.emails.size).toBe(2);
      expect(b.phones.size).toBe(2);
    });

    test('throws on duplicate email within org', () => {
      const b = createUniquenessBucket();
      validateUniqueness(b, {
        organizationId: 'org1',
        email: 'Same@x.com',
      });
      expect(() =>
        validateUniqueness(b, { organizationId: 'org1', email: 'same@x.com' })
      ).toThrow(UniquenessViolationError);
    });

    test('allows same email in different orgs', () => {
      const b = createUniquenessBucket();
      validateUniqueness(b, {
        organizationId: 'org1',
        email: 'shared@x.com',
      });
      expect(() =>
        validateUniqueness(b, {
          organizationId: 'org2',
          email: 'shared@x.com',
        })
      ).not.toThrow();
    });

    test('throws on duplicate phone within org', () => {
      const b = createUniquenessBucket();
      validateUniqueness(b, {
        organizationId: 'org1',
        phone: '+1 234',
      });
      expect(() =>
        validateUniqueness(b, { organizationId: 'org1', phone: '+1234' })
      ).toThrow(UniquenessViolationError);
    });

    test('throws on duplicate id', () => {
      const b = createUniquenessBucket();
      validateUniqueness(b, { organizationId: 'org1', id: 'id-1' });
      expect(() =>
        validateUniqueness(b, { organizationId: 'org1', id: 'id-1' })
      ).toThrow(UniquenessViolationError);
    });

    test('throws on duplicate unitId', () => {
      const b = createUniquenessBucket();
      validateUniqueness(b, { organizationId: 'org1', unitId: 'u1' });
      expect(() =>
        validateUniqueness(b, { organizationId: 'org1', unitId: 'u1' })
      ).toThrow(UniquenessViolationError);
    });

    test('throws on duplicate unitName within org', () => {
      const b = createUniquenessBucket();
      validateUniqueness(b, {
        organizationId: 'org1',
        unitName: 'A-101',
      });
      expect(() =>
        validateUniqueness(b, { organizationId: 'org1', unitName: 'A-101' })
      ).toThrow(UniquenessViolationError);
    });

    test('skips null email and phone without registering', () => {
      const b = createUniquenessBucket();
      validateUniqueness(b, { organizationId: 'org1', email: null });
      validateUniqueness(b, { organizationId: 'org1', email: null });
      expect(b.emails.size).toBe(0);
    });
  });
});
