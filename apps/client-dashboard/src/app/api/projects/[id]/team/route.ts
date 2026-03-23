import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const projectId = params.id;

    const assignments = await prisma.gateAssignment.findMany({
      where: {
        organizationId: claims.orgId,
        gate: {
          projectId,
        },
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        gate: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error('PROJECT TEAM GET error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const projectId = params.id;
    const body = await request.json();
    const { userId, gateId, startTime, endTime, shiftStart, shiftEnd } = body;

    // Verify gate belongs to project and org
    const gate = await prisma.gate.findFirst({
      where: { id: gateId, projectId, organizationId: claims.orgId },
    });

    if (!gate) return NextResponse.json({ success: false, message: 'Invalid gate' }, { status: 400 });

    const assignment = await prisma.gateAssignment.upsert({
      where: {
        userId_gateId: {
          userId,
          gateId,
        },
      },
      update: {
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        shiftStart,
        shiftEnd,
        deletedAt: null,
      },
      create: {
        userId,
        gateId,
        organizationId: claims.orgId,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        shiftStart,
        shiftEnd,
      },
    });

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error('PROJECT TEAM POST error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
