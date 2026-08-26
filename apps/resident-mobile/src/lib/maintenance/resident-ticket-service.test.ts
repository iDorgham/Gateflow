import {
  validateResidentTicket,
  getResidentTrackingTimeline,
  ResidentTicketInput,
} from './resident-ticket-service';

describe('resident-ticket-service', () => {
  describe('validateResidentTicket', () => {
    it('validates compliant resident ticket submission', () => {
      const valid: ResidentTicketInput = {
        unitId: 'unit-v104',
        unitNumber: 'Villa 104',
        residentId: 'res-402',
        residentName: 'Youssef Mansour',
        category: 'PLUMBING',
        description: 'Main kitchen water pipe leaking under the sink',
        isUrgent: false,
      };

      const result = validateResidentTicket(valid);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('rejects submissions with missing fields or short descriptions', () => {
      const invalid = {
        unitId: '',
        category: 'PLUMBING' as any,
        description: 'Drip',
      };

      const result = validateResidentTicket(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.unit).toBeDefined();
      expect(result.errors.resident).toBeDefined();
      expect(result.errors.description).toBeDefined();
    });
  });

  describe('getResidentTrackingTimeline', () => {
    it('accurately maps OPEN status to step 0 current', () => {
      const timeline = getResidentTrackingTimeline('OPEN', {
        OPEN: '2026-08-24T08:00:00Z',
      });

      expect(timeline[0].isCurrent).toBe(true);
      expect(timeline[0].isCompleted).toBe(false);
      expect(timeline[0].timestamp).toBe('2026-08-24T08:00:00Z');
      expect(timeline[1].isCurrent).toBe(false);
      expect(timeline[1].isCompleted).toBe(false);
    });

    it('accurately maps IN_PROGRESS status with completed preceding steps', () => {
      const timeline = getResidentTrackingTimeline('IN_PROGRESS', {
        OPEN: '2026-08-24T08:00:00Z',
        ASSIGNED: '2026-08-24T09:00:00Z',
        IN_PROGRESS: '2026-08-24T10:00:00Z',
      });

      expect(timeline[0].isCompleted).toBe(true);
      expect(timeline[1].isCompleted).toBe(true);
      expect(timeline[2].isCurrent).toBe(true);
      expect(timeline[3].isCompleted).toBe(false);
    });

    it('accurately marks all steps completed for CLOSED status', () => {
      const timeline = getResidentTrackingTimeline('CLOSED', {
        OPEN: '2026-08-24T08:00:00Z',
        ASSIGNED: '2026-08-24T09:00:00Z',
        IN_PROGRESS: '2026-08-24T10:00:00Z',
        RESOLVED: '2026-08-24T12:00:00Z',
      });

      expect(timeline.every((step) => step.isCompleted)).toBe(true);
      expect(timeline.every((step) => !step.isCurrent)).toBe(true);
    });
  });
});
