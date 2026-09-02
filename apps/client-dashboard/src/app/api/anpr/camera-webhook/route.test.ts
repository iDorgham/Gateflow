import { POST } from './route';
import { NextRequest } from 'next/server';

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
const mockCredentialFindFirst = jest.fn();

jest.mock('@gate-access/db', () => ({
  decrypt: (value: string) => value,
  prisma: {
    gate: { findFirst: (...args: unknown[]) => mockGateFindFirst(...args) },
    vehiclePlate: {
      findFirst: (...args: unknown[]) => mockVehicleFindFirst(...args),
    },
    integrationCredential: {
      findFirst: (...args: unknown[]) => mockCredentialFindFirst(...args),
    },
  },
}));

describe('ANPR Camera Webhook API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue({ allowed: true });
    mockGateFindFirst.mockResolvedValue({
      id: 'gate_1',
      name: 'North Barrier',
      organizationId: 'org_1',
    });
    mockCredentialFindFirst.mockResolvedValue({
      encryptedKey: 'cam_secret_123',
    });
  });

  it('rejects camera webhook calls missing API key', async () => {
    const req = new NextRequest('http://localhost/api/anpr/camera-webhook', {
      method: 'POST',
      body: JSON.stringify({ plate: 'ABC 1234', gate_id: 'gate_1' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('rejects an invalid camera API key', async () => {
    const req = new NextRequest(
      'http://localhost/api/anpr/camera-webhook?key=wrong-key',
      {
        method: 'POST',
        body: JSON.stringify({ plate: 'ABC 1234', gate_id: 'gate_1' }),
      }
    );

    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(mockVehicleFindFirst).not.toHaveBeenCalled();
  });

  it('sends OPEN_BARRIER trip signal for recognized plate via camera webhook', async () => {
    mockVehicleFindFirst.mockResolvedValue({
      id: 'veh_1',
      plateNumber: 'ABC 1234',
      normalizedPlate: 'ABC1234',
      isActive: true,
      ownerName: 'Omar Hassan',
      contact: null,
      unit: { id: 'u_1', name: 'Building 12' },
    });

    const req = new NextRequest(
      'http://localhost/api/anpr/camera-webhook?key=cam_secret_123',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plate: 'ABC 1234', gate_id: 'gate_1' }),
      }
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.granted).toBe(true);
    expect(data.tripSignal.action).toBe('OPEN_BARRIER');
    expect(mockEmitEvent).toHaveBeenCalled();
  });
});
