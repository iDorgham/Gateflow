import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { subDays } from 'date-fns';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<Promise<{ id: string }> | { id: string }> }
) {
  const params = await props.params;
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await Promise.resolve(params);

    // Verify project exists and belongs to org
    const project = await prisma.project.findFirst({
      where: { id, organizationId: claims.orgId, deletedAt: null },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Define time windows for growth calculation
    const now = new Date();
    const periodStart = subDays(now, 7);
    const prevPeriodStart = subDays(periodStart, 7);

    // Aggregate Data
    const [
      unitsCount,
      contactsCount,
      activeQrs,
      currentScans,
      prevScans,
      gatesCount,
    ] = await Promise.all([
      // 1. Units in project
      prisma.unit.count({
        where: { projectId: id, organizationId: claims.orgId, deletedAt: null },
      }),
      // 2. Contacts linked to units in this project
      prisma.contact.count({
        where: {
          organizationId: claims.orgId,
          units: {
            some: { unit: { projectId: id, organizationId: claims.orgId } },
          },
          deletedAt: null,
        },
      }),
      // 3. Active QRs scoped to project
      prisma.qRCode.count({
        where: {
          projectId: id,
          organizationId: claims.orgId,
          isActive: true,
          deletedAt: null,
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
      }),
      // 4. Current period scans (last 7 days)
      prisma.scanLog.count({
        where: {
          deletedAt: null,
          gate: { projectId: id, organizationId: claims.orgId },
          scannedAt: { gte: periodStart },
        },
      }),
      // 5. Previous period scans (7-14 days ago)
      prisma.scanLog.count({
        where: {
          deletedAt: null,
          gate: { projectId: id, organizationId: claims.orgId },
          scannedAt: { gte: prevPeriodStart, lt: periodStart },
        },
      }),
      // 6. Project gates
      prisma.gate.count({
        where: { projectId: id, organizationId: claims.orgId, deletedAt: null },
      }),
    ]);

    // Calculate growth percentage
    let scanGrowth = 0;
    if (prevScans > 0) {
      scanGrowth = Math.round(((currentScans - prevScans) / prevScans) * 100);
    } else if (currentScans > 0) {
      scanGrowth = 100; // New activity
    }

    return NextResponse.json({
      id,
      metrics: {
        unitsCount,
        contactsCount,
        activeQrs,
        scanVolume: currentScans,
        scanGrowth,
        gatesCount,
      },
      period: {
        start: periodStart,
        end: now,
      },
    });
  } catch (error) {
    console.error('[Project Aggregates GET error]', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
