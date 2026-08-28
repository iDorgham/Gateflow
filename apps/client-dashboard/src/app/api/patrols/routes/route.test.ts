import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: jest.fn(),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    patrolRoute: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    patrolCheckpoint: {
      updateMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('Patrol Routes API (/api/patrols/routes)', () => {
  const orgId = 'org_test_gateflow';
  const userId = 'user_supervisor_1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/patrols/routes', () => {
    it('returns 401 when unauthenticated', async () => {
      (getSessionClaims as jest.Mock).mockResolvedValue(null);

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Unauthorized');
    });

    it('returns list of routes with checkpoints for authenticated tenant', async () => {
      (getSessionClaims as jest.Mock).mockResolvedValue({ orgId, sub: userId });

      const mockRoutes = [
        {
          id: 'route_1',
          name: 'Perimeter Loop',
          frequencyMinutes: 60,
          isStrictSequence: true,
          active: true,
          startGateId: 'gate_1',
          startGate: { id: 'gate_1', name: 'North Main Gate' },
          organizationId: orgId,
          createdAt: new Date('2026-08-28T09:00:00Z'),
          updatedAt: new Date('2026-08-28T09:00:00Z'),
          checkpoints: [
            {
              id: 'cp_1',
              routeId: 'route_1',
              name: 'Station 1 - North Fence',
              mapCoordinates: { x: 100, y: 150 },
              orderIndex: 0,
              organizationId: orgId,
              createdAt: new Date('2026-08-28T09:00:00Z'),
              updatedAt: new Date('2026-08-28T09:00:00Z'),
            },
          ],
        },
      ];

      (prisma.patrolRoute.findMany as jest.Mock).mockResolvedValue(mockRoutes);

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.routes).toHaveLength(1);
      expect(json.routes[0].name).toBe('Perimeter Loop');
      expect(json.routes[0].startGateName).toBe('North Main Gate');
      expect(json.routes[0].checkpoints).toHaveLength(1);
      expect(json.routes[0].checkpoints[0].name).toBe(
        'Station 1 - North Fence'
      );
      expect(prisma.patrolRoute.findMany).toHaveBeenCalledWith({
        where: { organizationId: orgId, deletedAt: null },
        include: {
          startGate: { select: { id: true, name: true } },
          checkpoints: {
            where: { deletedAt: null },
            orderBy: { orderIndex: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('POST /api/patrols/routes', () => {
    it('returns 401 when unauthenticated', async () => {
      (getSessionClaims as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/patrols/routes', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Route' }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.success).toBe(false);
    });

    it('returns 400 when checkpoints array is missing or empty', async () => {
      (getSessionClaims as jest.Mock).mockResolvedValue({ orgId, sub: userId });

      const request = new NextRequest('http://localhost/api/patrols/routes', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Empty Checkpoints Route',
          checkpoints: [],
        }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.message).toBe('Invalid route payload');
    });

    it('creates a new route with checkpoints inside a transaction', async () => {
      (getSessionClaims as jest.Mock).mockResolvedValue({ orgId, sub: userId });

      const payload = {
        name: 'South Perimeter Check',
        frequencyMinutes: 45,
        isStrictSequence: true,
        active: true,
        startGateId: 'gate_south',
        checkpoints: [
          {
            name: 'Gate South Barrier',
            mapCoordinates: { x: 50, y: 80 },
            orderIndex: 0,
          },
          {
            name: 'Clubhouse Corner',
            mapCoordinates: { x: 120, y: 220 },
            orderIndex: 1,
          },
        ],
      };

      const mockSavedRoute = {
        id: 'route_created_1',
        name: payload.name,
        frequencyMinutes: payload.frequencyMinutes,
        isStrictSequence: true,
        active: true,
        startGateId: payload.startGateId,
        startGate: { id: 'gate_south', name: 'South Gate' },
        organizationId: orgId,
        createdAt: new Date('2026-08-28T10:00:00Z'),
        updatedAt: new Date('2026-08-28T10:00:00Z'),
        checkpoints: [
          {
            id: 'cp_new_1',
            routeId: 'route_created_1',
            name: 'Gate South Barrier',
            mapCoordinates: { x: 50, y: 80 },
            orderIndex: 0,
            organizationId: orgId,
            createdAt: new Date('2026-08-28T10:00:00Z'),
            updatedAt: new Date('2026-08-28T10:00:00Z'),
          },
          {
            id: 'cp_new_2',
            routeId: 'route_created_1',
            name: 'Clubhouse Corner',
            mapCoordinates: { x: 120, y: 220 },
            orderIndex: 1,
            organizationId: orgId,
            createdAt: new Date('2026-08-28T10:00:00Z'),
            updatedAt: new Date('2026-08-28T10:00:00Z'),
          },
        ],
      };

      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback) => {
          const tx = {
            patrolRoute: {
              create: jest.fn().mockResolvedValue({ id: 'route_created_1' }),
              findUnique: jest.fn().mockResolvedValue(mockSavedRoute),
            },
            patrolCheckpoint: {
              create: jest.fn().mockResolvedValue({ id: 'cp_new_1' }),
            },
          };
          return callback(tx);
        }
      );

      const request = new NextRequest('http://localhost/api/patrols/routes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(210);
      expect(json.success).toBe(true);
      expect(json.route.name).toBe(payload.name);
      expect(json.route.checkpoints).toHaveLength(2);
    });
  });
});
