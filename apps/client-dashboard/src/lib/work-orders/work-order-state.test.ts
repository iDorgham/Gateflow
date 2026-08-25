import {
  isValidStatusTransition,
  calculateSlaStatus,
  validateWorkOrderCreation,
} from './work-order-state';

describe('work-order-state', () => {
  describe('isValidStatusTransition', () => {
    it('allows valid sequential transitions', () => {
      expect(isValidStatusTransition('OPEN', 'ASSIGNED').allowed).toBe(true);
      expect(isValidStatusTransition('ASSIGNED', 'IN_PROGRESS').allowed).toBe(
        true
      );
      expect(
        isValidStatusTransition('IN_PROGRESS', 'PENDING_PARTS').allowed
      ).toBe(true);
      expect(isValidStatusTransition('PENDING_PARTS', 'RESOLVED').allowed).toBe(
        true
      );
      expect(isValidStatusTransition('RESOLVED', 'CLOSED').allowed).toBe(true);
    });

    it('rejects invalid backward transitions for standard users', () => {
      const result = isValidStatusTransition('CLOSED', 'IN_PROGRESS', false);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Illegal transition');
    });

    it('allows supervisors to reopen closed tickets', () => {
      const result = isValidStatusTransition('CLOSED', 'IN_PROGRESS', true);
      expect(result.allowed).toBe(true);
    });
  });

  describe('calculateSlaStatus', () => {
    it('calculates remaining SLA time for fresh urgent ticket', () => {
      const now = new Date('2026-08-24T12:00:00Z');
      const createdAt = new Date('2026-08-24T10:00:00Z'); // 2h elapsed of 4h SLA

      const sla = calculateSlaStatus(createdAt, 'URGENT', now);
      expect(sla.targetHours).toBe(4);
      expect(sla.isBreached).toBe(false);
      expect(sla.hoursRemaining).toBe(2);
      expect(sla.formattedRemaining).toBe('2h remaining');
    });

    it('detects breached SLA accurately', () => {
      const now = new Date('2026-08-24T18:00:00Z');
      const createdAt = new Date('2026-08-24T10:00:00Z'); // 8h elapsed of 4h SLA

      const sla = calculateSlaStatus(createdAt, 'URGENT', now);
      expect(sla.isBreached).toBe(true);
      expect(sla.formattedRemaining).toContain('Breached by 4h');
    });
  });

  describe('validateWorkOrderCreation', () => {
    it('validates compliant work order creation payload', () => {
      const result = validateWorkOrderCreation({
        title: 'Broken Main Gate Arm',
        description: 'North gate barrier arm not descending after scan',
        priority: 'URGENT',
        category: 'GATE_HARDWARE',
        organizationId: 'org-palm-hills',
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('rejects invalid inputs missing required fields', () => {
      const result = validateWorkOrderCreation({
        title: 'Fix',
        description: 'Broken',
        organizationId: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.description).toBeDefined();
      expect(result.errors.priority).toBeDefined();
      expect(result.errors.organizationId).toBeDefined();
    });
  });
});
