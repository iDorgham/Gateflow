import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { requireResident } from '@/lib/require-resident';
import { checkAndConsumeQuota } from '@gate-access/db/quota';

export const dynamic = 'force-dynamic';

/**
 * GET /api/resident/me
 *
 * Returns the resident's linked unit(s) with quota usage.
 * Primary response for the mobile app home screen.
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  const auth = await requireResident();
  if (auth.success === false) {
    return NextResponse.json({ success: false, message: auth.message }, { status: auth.status });
  }
  const { claims } = auth;

  try {
    const units = await prisma.unit.findMany({
      where: { userId: claims.sub, deletedAt: null, isActive: true },
      include: {
        project: { select: { id: true, name: true, location: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (units.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No unit linked to this account' },
        { status: 404 }
      );
    }

    // Fetch quota for each unit (checkAndConsumeQuota is read-only — counts active QRs)
    const unitsWithQuota = await Promise.all(
      units.map(async (unit) => {
        const quota = await checkAndConsumeQuota(unit.id);
        return {
          id: unit.id,
          name: unit.name,
          type: unit.type,
          building: unit.building ?? null,
          lat: unit.lat ?? null,
          lng: unit.lng ?? null,
          isActive: unit.isActive,
          project: unit.project
            ? { id: unit.project.id, name: unit.project.name, location: unit.project.location }
            : null,
          quotaUsed: quota.used,
          quotaLimit: quota.quota,
          quotaRemaining: quota.remaining,
          quotaAllowed: quota.allowed,
          quotaResetDate: quota.resetDate.toISOString(),
        };
      })
    );

    return NextResponse.json({ success: true, data: unitsWithQuota });
  } catch (error) {
    console.error('GET /api/resident/me error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
