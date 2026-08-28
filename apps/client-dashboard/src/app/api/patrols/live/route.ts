import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import type {
  PatrolRunDto,
  PatrolRouteDto,
  PatrolRunStatus,
} from '@gate-access/types';

export const dynamic = 'force-dynamic';

export interface LivePatrolSummary {
  totalRoutes: number;
  activeRunsCount: number;
  scheduledRunsCount: number;
  completedTodayCount: number;
  overdueRunsCount: number;
  activePatrolGuardsCount: number;
}

export interface LivePatrolsResponse {
  success: boolean;
  activeRuns: PatrolRunDto[];
  routes: PatrolRouteDto[];
  summary: LivePatrolSummary;
  timestamp: string;
}

/**
 * GET /api/patrols/live
 * Returns real-time patrol run telemetry and active routes for the authenticated tenant.
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

    const orgId = claims.orgId;
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // 1. Fetch configured routes
    const routes = await prisma.patrolRoute.findMany({
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

    // 2. Fetch active and scheduled runs
    const activeRunsRaw = await prisma.patrolRun.findMany({
      where: {
        organizationId: orgId,
        status: { in: ['IN_PROGRESS', 'SCHEDULED'] },
      },
      include: {
        route: {
          include: {
            checkpoints: {
              where: { deletedAt: null },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        guard: {
          select: { id: true, name: true, avatarUrl: true },
        },
        logEntries: {
          include: {
            checkpoint: { select: { id: true, name: true } },
            guard: { select: { id: true, name: true } },
          },
          orderBy: { scannedAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Fetch completed runs today for KPIs
    const completedTodayCount = await prisma.patrolRun.count({
      where: {
        organizationId: orgId,
        status: 'COMPLETED',
        completedAt: { gte: startOfToday },
      },
    });

    // 4. Map active runs and determine overdue SLA flags
    let overdueRunsCount = 0;
    const activeGuardsSet = new Set<string>();

    const activeRuns: PatrolRunDto[] = (activeRunsRaw as any[]).map((run) => {
      const totalCheckpoints = run.route?.checkpoints?.length || 0;
      const completedCheckpoints = run.logEntries?.length || 0;
      let overdue = false;

      if (run.status === 'IN_PROGRESS' && run.startedAt) {
        const elapsedMinutes = Math.floor(
          (now.getTime() - run.startedAt.getTime()) / (1000 * 60)
        );
        const maxAllowedMinutes = (run.route?.frequencyMinutes || 60) * 1.5;
        if (elapsedMinutes > maxAllowedMinutes) {
          overdue = true;
          overdueRunsCount++;
        }
        if (run.guardId) {
          activeGuardsSet.add(run.guardId);
        }
      }

      return {
        id: run.id,
        routeId: run.routeId,
        routeName: run.route?.name || 'Unnamed Route',
        guardId: run.guardId,
        guardName: run.guard?.name || 'Unassigned',
        guardAvatarUrl: run.guard?.avatarUrl || null,
        status: run.status as PatrolRunStatus,
        startedAt: run.startedAt?.toISOString() || null,
        completedAt: run.completedAt?.toISOString() || null,
        totalCheckpoints,
        completedCheckpoints,
        currentCheckpointIndex: completedCheckpoints,
        overdue,
        organizationId: run.organizationId,
        createdAt: run.createdAt.toISOString(),
        updatedAt: run.updatedAt.toISOString(),
        logEntries: run.logEntries.map((log) => ({
          id: log.id,
          runId: log.runId,
          checkpointId: log.checkpointId,
          checkpointName: log.checkpoint?.name || 'Checkpoint',
          guardId: log.guardId,
          guardName: log.guard?.name || 'Guard',
          scannedAt: log.scannedAt.toISOString(),
          latencySeconds: log.latencySeconds,
          organizationId: log.organizationId,
        })),
      };
    });

    const routesDto: PatrolRouteDto[] = routes.map((r) => ({
      id: r.id,
      name: r.name,
      frequencyMinutes: r.frequencyMinutes,
      isStrictSequence: r.isStrictSequence,
      active: r.active,
      startGateId: r.startGateId,
      startGateName: r.startGate?.name || null,
      organizationId: r.organizationId,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      checkpoints: r.checkpoints.map((cp) => ({
        id: cp.id,
        routeId: cp.routeId,
        name: cp.name,
        mapCoordinates:
          (cp.mapCoordinates as { x: number; y: number } | null) || null,
        orderIndex: cp.orderIndex,
        organizationId: cp.organizationId,
        createdAt: cp.createdAt.toISOString(),
        updatedAt: cp.updatedAt.toISOString(),
      })),
    }));

    const summary: LivePatrolSummary = {
      totalRoutes: routes.length,
      activeRunsCount: activeRuns.filter((r) => r.status === 'IN_PROGRESS')
        .length,
      scheduledRunsCount: activeRuns.filter((r) => r.status === 'SCHEDULED')
        .length,
      completedTodayCount,
      overdueRunsCount,
      activePatrolGuardsCount: activeGuardsSet.size,
    };

    const responseData: LivePatrolsResponse = {
      success: true,
      activeRuns,
      routes: routesDto,
      summary,
      timestamp: now.toISOString(),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[patrols/live/GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
