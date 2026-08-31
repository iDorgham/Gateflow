import { POST, normalizePlate } from './route';
import { NextRequest } from 'next/server';

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));

const mockCheckRateLimit = jest.fn();
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

const mockEmitEvent = jest.fn();
jest.mock('@/lib/realtime/emit-event', () => ({
  emitEvent: (...args: unknown[]) => mockEmitEvent(...args),
  EventType: {
    SCAN_RECORDED: 'SCAN_RECORDED',
    WATCHLIST_ALERT: 'WATCHLIST_ALERT',
  },
}));

const mockGateFindFirst = jest.fn();
const mockVehicleFindFirst = jest.fn();
const mockIncidentCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: { findFirst: (...args: unknown[]) => mockGateFindFirst(...args) },
    vehiclePlate: {
      findFirst: (...args: unknown[]) => mockVehicleFindFirst(...args),
    },
    incident: { create: (...args: unknown[]) => mockIncidentCreate(...args) },
  },
}));

describe('ANPR Stream Event API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'user_1' });
    mockCheckRateLimit.mockResolvedValue({ allowed: true });
    mockGateFindFirst.mockResolvedValue({ id: 'gate_1', name: 'Main Gate' });
  });

  describe('normalizePlate()', () => {
    it('normalizes plate numbers by stripping spaces, dashes, and converting to uppercase', () => {
      expect(normalizePlate('abc - 1234')).toBe('ABC1234');
      expect(normalizePlate('123-ق‌ن-٤')).toBe('123ق‌ن٤');
    });
  });

  describe('POST handler', () => {
    it('rejects unauthorized requests without session claims', async () => {
      mockGetSessionClaims.mockResolvedValue(null);

      const req = new NextRequest('http://localhost/api/anpr/stream-event', {
        method: 'POST',
        body: JSON.stringify({ plateNumber: 'ABC1234', gateId: 'gate_1' }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('opens barrier for registered active vehicle plate', async () => {
      mockVehicleFindFirst.mockResolvedValue({
        id: 'veh_1',
        plateNumber: 'ABC 1234',
        normalizedPlate: 'ABC1234',
        isActive: true,
        ownerName: 'Sara Ahmed',
        contact: null,
        unit: { id: 'u_1', name: 'Villa 42' },
      });

      const req = new NextRequest('http://localhost/api/anpr/stream-event', {
        method: 'POST',
        body: JSON.stringify({ plateNumber: 'ABC 1234', gateId: 'gate_1' }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.granted).toBe(true);
      expect(data.data.barrierAction).toBe('OPEN');
    });

    it('rejects unregistered vehicle plate with 403', async () => {
      mockVehicleFindFirst.mockResolvedValue(null);

      const req = new NextRequest('http://localhost/api/anpr/stream-event', {
        method: 'POST',
        body: JSON.stringify({ plateNumber: 'UNKNOWN', gateId: 'gate_1' }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(403);
      expect(data.granted).toBe(false);
      expect(data.reason).toBe('unregistered_plate');
    });
  });
});
