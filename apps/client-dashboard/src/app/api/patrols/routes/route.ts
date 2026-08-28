import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes, createHash } from 'crypto';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import type { PatrolRouteDto } from '@gate-access/types';

export const dynamic = 'force-dynamic';

const CheckpointInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Checkpoint name is required').max(100),
  mapCoordinates: z
    .object({
      x: z.number().optional(),
      y: z.number().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional()
    .nullable(),
  orderIndex: z.number().int().min(0).default(0),
});

const RouteInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Route name is required').max(100),
  frequencyMinutes: z.number().int().min(15).max(1440).default(60),
  isStrictSequence: z.boolean().default(true),
  active: z.boolean().default(true),
  startGateId: z.string().optional().nullable(),
  checkpoints: z
    .array(CheckpointInputSchema)
    .min(1, 'Route must have at least one checkpoint'),
});

/**
 * GET /api/patrols/routes
 * Returns all active patrol routes and their checkpoints for the authenticated tenant.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const routes = await prisma.patrolRoute.findMany({
      where: {
        organizationId: claims.orgId,
        deletedAt: null,
      },
      include: {
        startGate: {
          select: { id: true, name: true },
        },
        checkpoints: {
          where: { deletedAt: null },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const dtoList: PatrolRouteDto[] = routes.map((r) => ({
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
        mapCoordinates: cp.mapCoordinates as any,
        orderIndex: cp.orderIndex,
        organizationId: cp.organizationId,
        createdAt: cp.createdAt.toISOString(),
        updatedAt: cp.updatedAt.toISOString(),
      })),
    }));

    return NextResponse.json({ success: true, routes: dtoList });
  } catch (error) {
    console.error('[patrols/routes/GET] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/patrols/routes
 * Creates or updates a patrol route with checkpoints atomically.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body: unknown = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const parseResult = RouteInputSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid route payload',
          errors: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const orgId = claims.orgId;

    // Execute atomic transaction to save route and checkpoints
    const savedRoute = await prisma.$transaction(async (tx) => {
      let routeRecord;

      if (data.id) {
        // Verify route belongs to this organization
        const existing = await tx.patrolRoute.findFirst({
          where: { id: data.id, organizationId: orgId, deletedAt: null },
        });

        if (!existing) {
          throw new Error('NOT_FOUND');
        }

        routeRecord = await tx.patrolRoute.update({
          where: { id: data.id },
          data: {
            name: data.name,
            frequencyMinutes: data.frequencyMinutes,
            isStrictSequence: data.isStrictSequence,
            active: data.active,
            startGateId: data.startGateId || null,
          },
        });

        // Soft-delete checkpoints no longer in the payload
        const providedIds = data.checkpoints
          .filter((c) => Boolean(c.id))
          .map((c) => c.id as string);
        await tx.patrolCheckpoint.updateMany({
          where: {
            routeId: routeRecord.id,
            organizationId: orgId,
            id: { notIn: providedIds },
            deletedAt: null,
          },
          data: { deletedAt: new Date() },
        });
      } else {
        routeRecord = await tx.patrolRoute.create({
          data: {
            name: data.name,
            frequencyMinutes: data.frequencyMinutes,
            isStrictSequence: data.isStrictSequence,
            active: data.active,
            startGateId: data.startGateId || null,
            organizationId: orgId,
          },
        });
      }

      // Upsert checkpoints
      for (const cp of data.checkpoints) {
        const secretHash = createHash('sha256')
          .update(
            `${orgId}:${routeRecord.id}:${cp.name}:${randomBytes(16).toString('hex')}`
          )
          .digest('hex');

        if (cp.id) {
          await tx.patrolCheckpoint.update({
            where: { id: cp.id },
            data: {
              name: cp.name,
              mapCoordinates: cp.mapCoordinates || undefined,
              orderIndex: cp.orderIndex,
              deletedAt: null,
            },
          });
        } else {
          await tx.patrolCheckpoint.create({
            data: {
              routeId: routeRecord.id,
              name: cp.name,
              mapCoordinates: cp.mapCoordinates || undefined,
              orderIndex: cp.orderIndex,
              secretHash,
              organizationId: orgId,
            },
          });
        }
      }

      return tx.patrolRoute.findUnique({
        where: { id: routeRecord.id },
        include: {
          startGate: { select: { id: true, name: true } },
          checkpoints: {
            where: { deletedAt: null },
            orderBy: { orderIndex: 'asc' },
          },
        },
      });
    });

    if (!savedRoute) {
      return NextResponse.json(
        { success: false, message: 'Failed to retrieve saved route' },
        { status: 500 }
      );
    }

    const dto: PatrolRouteDto = {
      id: savedRoute.id,
      name: savedRoute.name,
      frequencyMinutes: savedRoute.frequencyMinutes,
      isStrictSequence: savedRoute.isStrictSequence,
      active: savedRoute.active,
      startGateId: savedRoute.startGateId,
      startGateName: savedRoute.startGate?.name || null,
      organizationId: savedRoute.organizationId,
      createdAt: savedRoute.createdAt.toISOString(),
      updatedAt: savedRoute.updatedAt.toISOString(),
      checkpoints: savedRoute.checkpoints.map((cp) => ({
        id: cp.id,
        routeId: cp.routeId,
        name: cp.name,
        mapCoordinates: cp.mapCoordinates as any,
        orderIndex: cp.orderIndex,
        organizationId: cp.organizationId,
        createdAt: cp.createdAt.toISOString(),
        updatedAt: cp.updatedAt.toISOString(),
      })),
    };

    return NextResponse.json(
      { success: true, route: dto },
      { status: data.id ? 200 : 210 }
    );
  } catch (error: any) {
    if (error?.message === 'NOT_FOUND') {
      return NextResponse.json(
        { success: false, message: 'Route not found' },
        { status: 404 }
      );
    }
    console.error('[patrols/routes/POST] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
