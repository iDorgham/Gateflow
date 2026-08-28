import { POST } from './route';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import {
  generateCheckpointPayload,
  encodeCheckpointQrString,
} from '@/lib/patrols/checkpoint-qr';
import { NextRequest } from 'next/server';

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: jest.fn(),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    patrolCheckpoint: {
      findFirst: jest.fn(),
    },
    patrolRun: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    patrolLogEntry: {
      create: jest.fn(),
    },
  },
}));

describe('Patrol Checkpoint Scan Mutation (/api/patrols/scan)', () => {
  const orgId = 'org_test_patrol';
  const guardId = 'user_guard_99';
  const routeId = 'route_alpha';
  const checkpointId = 'cp_station_1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/patrols/scan', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it('returns 403 when HMAC signature is forged or invalid', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue({ orgId, sub: guardId });

    const forgedPayload = {
      version: 1 as const,
      orgId,
      routeId,
      checkpointId,
      timestamp: Date.now(),
      nonce: 'forged_nonce',
      hmac: 'invalid_sha256_hmac_hash',
    };

    const req = new NextRequest('http://localhost/api/patrols/scan', {
      method: 'POST',
      body: JSON.stringify({ payload: forgedPayload }),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.message).toContain('signature verification failed');
  });

  it('successfully logs checkpoint scan and completes run on final station', async () => {
    (getSessionClaims as jest.Mock).mockResolvedValue({ orgId, sub: guardId });

    const validPayload = generateCheckpointPayload({
      orgId,
      routeId,
      checkpointId,
    });
    const qrString = encodeCheckpointQrString(validPayload);

    const mockCheckpoint = {
      id: checkpointId,
      routeId,
      name: 'North Gate Tower',
      orderIndex: 0,
      organizationId: orgId,
      route: {
        id: routeId,
        name: 'Perimeter Alpha',
        isStrictSequence: true,
        checkpoints: [{ id: checkpointId, orderIndex: 0 }],
      },
    };

    (prisma.patrolCheckpoint.findFirst as jest.Mock).mockResolvedValue(
      mockCheckpoint
    );
    (prisma.patrolRun.findFirst as jest.Mock).mockResolvedValue(null); // Will trigger create
    (prisma.patrolRun.create as jest.Mock).mockResolvedValue({
      id: 'run_new_1',
      routeId,
      guardId,
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      organizationId: orgId,
      logEntries: [],
    });
    (prisma.patrolLogEntry.create as jest.Mock).mockResolvedValue({
      id: 'log_entry_1',
      runId: 'run_new_1',
      checkpointId,
      guardId,
      scannedAt: new Date(),
      latencySeconds: 0,
      organizationId: orgId,
    });
    (prisma.patrolRun.update as jest.Mock).mockResolvedValue({
      id: 'run_new_1',
      status: 'COMPLETED',
    });

    const req = new NextRequest('http://localhost/api/patrols/scan', {
      method: 'POST',
      body: JSON.stringify({ qrString }),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.isCompleted).toBe(true);
    expect(json.progress.completed).toBe(1);
    expect(json.progress.total).toBe(1);
    expect(prisma.patrolRun.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'run_new_1' },
        data: expect.objectContaining({ status: 'COMPLETED' }),
      })
    );
  });
});
