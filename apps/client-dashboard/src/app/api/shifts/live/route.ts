import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission } from '@/lib/auth';
import { prisma } from '@gate-access/db';
import type { Permission } from '@gate-access/types';

export const dynamic = 'force-dynamic';

const LIVE_SHIFTS_PERMISSION: Permission = 'gates:manage';

export type GateShiftStatus =
  'ACTIVE' | 'SCHEDULED' | 'UNMANNED' | 'OVERRUN' | 'OFFLINE';

export interface LiveGateShiftTelemetry {
  gateId: string;
  gateName: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  projectId: string | null;
  projectName: string | null;
  status: GateShiftStatus;
  isTerminalConnected: boolean;
  lastHeartbeatAt: string | null;
  activeShift: {
    id: string;
    guardId: string;
    guardName: string;
    guardAvatar: string | null;
    startTime: string;
    elapsedMinutes: number;
  } | null;
  scheduledGuards: Array<{
    userId: string;
    userName: string;
    shiftStart: string | null;
    shiftEnd: string | null;
  }>;
  scansTodayCount: number;
}

export interface LiveShiftSummary {
  totalGates: number;
  activeShiftsCount: number;
  unmannedGatesCount: number;
  overrunShiftsCount: number;
  scheduledGatesCount: number;
  activeGuardsCount: number;
}

/**
 * Retrieves live gate shift telemetry for the authenticated organization.
 *
 * @param request - The request containing an optional `project` query parameter used to filter gates.
 * @returns A JSON response containing per-gate telemetry and aggregate shift statistics, or an error response for unauthorized, forbidden, or failed requests.
 */
export async function GET(request?: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    if (!hasPermission(claims, LIVE_SHIFTS_PERMISSION)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const orgId = claims.orgId;
    const rawProjectId =
      request?.nextUrl?.searchParams?.get('project') ?? undefined;

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const gateWhere = {
      organizationId: orgId,
      deletedAt: null,
      ...(rawProjectId ? { projectId: rawProjectId } : {}),
    };

    // Parallel fetch for live operational telemetry
    const [gates, activeShifts, assignments, recentScansRaw] =
      await Promise.all([
        prisma.gate.findMany({
          // ignore-security-guard — organizationId in gateWhere
          where: gateWhere,
          orderBy: { name: 'asc' },
          include: {
            project: { select: { id: true, name: true } },
          },
        }),
        prisma.shiftLog.findMany({
          where: {
            organizationId: orgId,
            endTime: null,
          },
          include: {
            guard: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        }),
        prisma.gateAssignment.findMany({
          where: {
            organizationId: orgId,
            deletedAt: null,
          },
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        }),
        prisma.scanLog.groupBy({
          by: ['gateId'],
          where: {
            gate: { organizationId: orgId, deletedAt: null },
            scannedAt: { gte: todayStart },
          },
          _count: true,
          _max: { scannedAt: true },
        }),
      ]);

    const recentScans = recentScansRaw as unknown as Array<{
      gateId: string | null;
      _count: number;
      _max: { scannedAt: Date | null };
    }>;

    // Map scans for quick O(1) lookup
    const scanCountMap = new Map<string, number>();
    const lastScanMap = new Map<string, Date>();
    for (const item of recentScans) {
      if (item.gateId) {
        scanCountMap.set(item.gateId, item._count);
        if (item._max.scannedAt) {
          lastScanMap.set(item.gateId, item._max.scannedAt);
        }
      }
    }

    // Map active shift by gateId
    const activeShiftMap = new Map<string, (typeof activeShifts)[number]>();
    for (const shift of activeShifts) {
      activeShiftMap.set(shift.gateId, shift);
    }

    // Group assignments by gateId
    const assignmentMap = new Map<string, typeof assignments>();
    for (const asgn of assignments) {
      const existing = assignmentMap.get(asgn.gateId) ?? [];
      existing.push(asgn);
      assignmentMap.set(asgn.gateId, existing);
    }

    const uniqueActiveGuardIds = new Set<string>();
    let overrunCount = 0;
    let activeShiftsCount = 0;
    let unmannedCount = 0;
    let scheduledCount = 0;

    const gateTelemetryList: LiveGateShiftTelemetry[] = gates.map((gate) => {
      const shift = activeShiftMap.get(gate.id);
      const gateAssignments = assignmentMap.get(gate.id) ?? [];
      const scansCount = scanCountMap.get(gate.id) ?? 0;
      const lastScan = lastScanMap.get(gate.id);

      const latestHeartbeat =
        lastScan || gate.lastAccessedAt || (shift ? shift.updatedAt : null);
      const isTerminalConnected = latestHeartbeat
        ? now.getTime() - new Date(latestHeartbeat).getTime() < 10 * 60 * 1000
        : false;

      let status: GateShiftStatus;
      let activeShiftPayload: LiveGateShiftTelemetry['activeShift'] = null;

      if (!gate.isActive) {
        status = 'OFFLINE';
      } else if (shift) {
        const elapsedMinutes = Math.max(
          0,
          Math.floor(
            (now.getTime() - new Date(shift.startTime).getTime()) / 60000
          )
        );

        uniqueActiveGuardIds.add(shift.guardId);
        activeShiftPayload = {
          id: shift.id,
          guardId: shift.guardId,
          guardName: shift.guard.name || 'Guard',
          guardAvatar: shift.guard.avatarUrl,
          startTime: shift.startTime.toISOString(),
          elapsedMinutes,
        };

        // If shift exceeds 8 hours (480 mins), flag as OVERRUN
        if (elapsedMinutes >= 480) {
          status = 'OVERRUN';
          overrunCount++;
        } else {
          status = 'ACTIVE';
          activeShiftsCount++;
        }
      } else if (gateAssignments.length > 0) {
        status = 'SCHEDULED';
        scheduledCount++;
      } else {
        status = 'UNMANNED';
        unmannedCount++;
      }

      const scheduledGuards = gateAssignments.map((a) => ({
        userId: a.userId,
        userName: a.user.name || 'Staff',
        shiftStart: a.shiftStart,
        shiftEnd: a.shiftEnd,
      }));

      return {
        gateId: gate.id,
        gateName: gate.name,
        location: gate.location,
        latitude: gate.latitude,
        longitude: gate.longitude,
        isActive: gate.isActive,
        projectId: gate.projectId,
        projectName: gate.project?.name ?? null,
        status,
        isTerminalConnected,
        lastHeartbeatAt: latestHeartbeat
          ? new Date(latestHeartbeat).toISOString()
          : null,
        activeShift: activeShiftPayload,
        scheduledGuards,
        scansTodayCount: scansCount,
      };
    });

    const summary: LiveShiftSummary = {
      totalGates: gates.length,
      activeShiftsCount: activeShiftsCount + overrunCount,
      unmannedGatesCount: unmannedCount,
      overrunShiftsCount: overrunCount,
      scheduledGatesCount: scheduledCount,
      activeGuardsCount: uniqueActiveGuardIds.size,
    };

    return NextResponse.json({
      success: true,
      data: {
        gates: gateTelemetryList,
        summary,
      },
    });
  } catch (error) {
    console.error('Error fetching live shifts:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
