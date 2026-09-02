import { NextRequest, NextResponse } from 'next/server';
import {
  BulkScanRequestSchema,
  BulkScanResponseSchema,
} from '@gate-access/types';
import { prisma } from '@gate-access/db';
import { requireAuth, isNextResponse } from '@/lib/require-auth';
import { hasPermission } from '@/lib/auth';
import { enforceTenantAccess } from '@/lib/enforce-tenant-access';
import { processBulkScans } from '@/lib/scans/bulk-sync';
import {
  orgHasAssignments,
  getUserAssignedGateIds,
} from '@/lib/gate-assignment';
import { checkLocationForGate, type GateLocationConfig } from '@/lib/location';
import { getActiveWatchlist, findWatchlistMatch } from '@/lib/watchlist';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await requireAuth(request);
    if (isNextResponse(authResult)) return authResult;

    const orgId = authResult.orgId;
    if (!orgId) {
      return NextResponse.json(
        { success: false, message: 'Organization context required' },
        { status: 403 }
      );
    }

    const role = (
      authResult.roleName ||
      (authResult as { role?: string }).role ||
      ''
    ).toUpperCase();
    const isAllowedRole =
      role === 'SUPER_ADMIN' ||
      role === 'ORG_ADMIN' ||
      role === 'SECURITY_MANAGER' ||
      role === 'GATE_OPERATOR' ||
      role === 'GATE OPERATOR' ||
      role === 'SECURITY MANAGER' ||
      role === 'TENANT_USER';

    const hasScanPermission = authResult.permissions
      ? hasPermission(authResult, 'scans:view')
      : isAllowedRole;

    if (!hasScanPermission && !isAllowedRole) {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden: insufficient permissions for scans sync',
        },
        { status: 403 }
      );
    }

    // Rate limit + IP allow-list: 30 bulk-sync requests/min per tenant+IP (checked BEFORE body parsing & queries)
    const access = await enforceTenantAccess(request, {
      orgId,
      keyPrefix: 'bulk',
      max: 30,
      windowMs: 60_000,
    });
    if (access.decision === 'deny_allowlist') {
      return NextResponse.json(
        { success: false, message: 'Access not permitted for this network' },
        { status: 403 }
      );
    }
    if (access.decision === 'rate_limited') {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many sync requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Math.ceil(access.rateLimit.retryAfterMs / 1000)
            ),
            'X-RateLimit-Limit': String(access.rateLimit.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const validation = BulkScanRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { scans } = validation.data;

    // Location rule: when a gate has locationEnforced, reject scans without valid location or outside radius.
    const gateIds = Array.from(new Set(scans.map((s) => s.gateId)));
    const gates =
      gateIds.length > 0
        ? await prisma.gate.findMany({
            where: {
              id: { in: gateIds },
              organizationId: orgId,
              deletedAt: null,
            },
            select: {
              id: true,
              latitude: true,
              longitude: true,
              locationRadiusMeters: true,
              locationEnforced: true,
            },
          })
        : [];
    const gateMap = new Map<string, GateLocationConfig>(
      gates.map((g) => [g.id, g])
    );
    const locationFailed: Array<{ id: string; error: string }> = [];
    const scansPassingLocation = scans.filter((scan) => {
      const gate = gateMap.get(scan.gateId);
      if (!gate) return true; // Gate not in org or missing — let processBulkScans or downstream handle
      const deviceLocation =
        scan.latitude != null && scan.longitude != null
          ? { latitude: scan.latitude, longitude: scan.longitude }
          : null;
      const result = checkLocationForGate(gate, deviceLocation);
      if (!result.allowed) {
        const errMsg =
          'message' in result
            ? result.message
            : 'Scan only allowed at gate location.';
        locationFailed.push({ id: scan.id, error: errMsg });
        return false;
      }
      return true;
    });

    // Watchlist: reject scans whose visitor identity matches org watchlist; create incidents.
    const watchlistFailed: Array<{ id: string; error: string }> = [];
    let scansForSync = scansPassingLocation;
    {
      const entries = await getActiveWatchlist(orgId);
      scansForSync = scansPassingLocation.filter((scan) => {
        const visitor = {
          name: scan.visitorName ?? null,
          phone: scan.visitorPhone ?? null,
          idNumber: scan.visitorIdNumber ?? null,
        };
        if (!visitor.name && !visitor.phone && !visitor.idNumber) return true;
        const match = findWatchlistMatch(entries, visitor);
        if (match) {
          watchlistFailed.push({
            id: scan.id,
            error: 'Blocked person on security list.',
          });
          void prisma.incident
            .create({
              data: {
                organizationId: orgId,
                gateId: scan.gateId,
                userId: authResult.sub ?? null,
                reason: 'watchlist_match',
                status: 'UNDER_REVIEW',
                notes: `Watchlist entry ${match.entryId} matched on ${match.matchedField} (bulk sync).`,
              },
            })
            .catch((err) =>
              console.error(
                '[scans/bulk] Failed to create watchlist incident:',
                err
              )
            );
          return false;
        }
        return true;
      });
    }

    // Gate–account assignment: when org uses assignments, operator must be assigned to every gate in the batch.
    {
      const hasAny = await orgHasAssignments(orgId);
      if (hasAny) {
        const assignedGateIds = await getUserAssignedGateIds(
          authResult.sub,
          orgId
        );
        const gateIdsInBatch = new Set(scansForSync.map((s) => s.gateId));
        const unassigned = Array.from(gateIdsInBatch).filter(
          (id) => !assignedGateIds.has(id)
        );
        if (unassigned.length > 0) {
          return NextResponse.json(
            {
              success: false,
              message:
                'You are not allowed to scan at one or more gates in this batch.',
              unassignedGateIds: unassigned,
            },
            { status: 403 }
          );
        }
      }
    }

    const results = await prisma.$transaction(async (tx) => {
      return processBulkScans(
        scansForSync as import('@/lib/scans/bulk-sync').ScanInput[],
        tx as unknown as import('@gate-access/db').Prisma.TransactionClient,
        { organizationId: orgId, guardId: authResult.sub }
      );
    });

    const response = {
      success: true,
      synced: results.synced,
      conflicted: results.conflicted,
      failed: [...locationFailed, ...watchlistFailed, ...results.failed],
    };

    return NextResponse.json(
      {
        success: true,
        data: BulkScanResponseSchema.parse(response),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Bulk sync error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
