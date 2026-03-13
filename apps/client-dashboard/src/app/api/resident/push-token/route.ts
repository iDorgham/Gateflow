import { NextRequest, NextResponse } from 'next/server';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pushToken, deviceId, notifyScan, notifyArrival } = body as {
      pushToken?: string;
      deviceId?: string;
      notifyScan?: boolean;
      notifyArrival?: boolean;
    };

    // At least one field must be provided
    if (
      pushToken === undefined &&
      notifyScan === undefined &&
      notifyArrival === undefined
    ) {
      return NextResponse.json(
        { success: false, message: 'At least one of pushToken, notifyScan, or notifyArrival is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: claims.sub },
      select: { id: true, preferences: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Merge new fields into existing preferences
    const existing = (user.preferences ?? {}) as Record<string, unknown>;
    const updated: Record<string, unknown> = { ...existing };

    if (pushToken !== undefined) {
      updated.expoPushToken = pushToken;
      updated.deviceId = deviceId ?? null;
      updated.pushTokenUpdatedAt = new Date().toISOString();
    }
    if (notifyScan !== undefined) updated.notifyScan = notifyScan;
    if (notifyArrival !== undefined) updated.notifyArrival = notifyArrival;

    await prisma.user.update({
      where: { id: claims.sub },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { preferences: updated as any },
    });

    return NextResponse.json({ success: true, message: 'Preferences updated' });
  } catch (error) {
    console.error('Error updating push preferences:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: claims.sub },
      select: { preferences: true },
    });

    const existing = (user?.preferences ?? {}) as Record<string, unknown>;
    await prisma.user.update({
      where: { id: claims.sub },
      data: {
        preferences: {
          ...existing,
          expoPushToken: null,
          deviceId: null,
          pushTokenUpdatedAt: null,
        },
      },
    });

    return NextResponse.json({ success: true, message: 'Push token removed' });
  } catch (error) {
    console.error('Error removing push token:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove push token' },
      { status: 500 }
    );
  }
}
