/**
 * GET /api/gates/assigned
 *
 * Returns gates the current user is assigned to (for scanner app).
 * When the org has no gate assignments, returns all org gates (backward compatibility).
 * Auth: session or Bearer.
 */

import { NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { orgHasAssignments, getUserAssignedGateIds } from '@/lib/gate-assignment';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const orgId = claims.orgId;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const hasAnyAssignments = await orgHasAssignments(orgId);

    let gateIdsFilter: { in: string[] } | undefined;
    if (hasAnyAssignments) {
      const assignedIds = await getUserAssignedGateIds(claims.sub, orgId);
      if (assignedIds.size === 0) {
        // User has no assignments → return empty list so scanner shows "no gates assigned"
        return NextResponse.json({
          success: true,
          data: [],
          assignedOnly: true,
        });
      }
      gateIdsFilter = { in: Array.from(assignedIds) };
    }

    const [gates, scansTodayGroups] = await Promise.all([
      prisma.gate.findMany({
        where: {
          organizationId: orgId,
          deletedAt: null,
          ...(gateIdsFilter ? { id: gateIdsFilter } : {}),
        },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { qrCodes: true, scanLogs: true } },
        },
      }),
      prisma.scanLog.groupBy({
        by: ['gateId'],
        where: {
          gate: { organizationId: orgId },
          scannedAt: { gte: todayStart },
        },
        _count: true,
      }),
    ]);

    const scansTodayMap = new Map(scansTodayGroups.map((g) => [g.gateId, g._count]));

    const data = gates.map((gate) => {
      const scansToday = scansTodayMap.get(gate.id) ?? 0;
      const isActiveToday =
        gate.lastAccessedAt != null && gate.lastAccessedAt >= todayStart;

      return {
        id: gate.id,
        name: gate.name,
        location: gate.location,
        isActive: gate.isActive,
        lastAccessedAt: gate.lastAccessedAt?.toISOString() ?? null,
        createdAt: gate.createdAt.toISOString(),
        qrCodeCount: gate._count.qrCodes,
        totalScans: gate._count.scanLogs,
        scansToday,
        isActiveToday,
      };
    });

    return NextResponse.json({
      success: true,
      data,
      assignedOnly: hasAnyAssignments,
    });
  } catch (err) {
    console.error('GET /api/gates/assigned error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
