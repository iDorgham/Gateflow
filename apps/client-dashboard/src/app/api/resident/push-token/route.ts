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
    const { pushToken, deviceId } = body;

    if (!pushToken) {
      return NextResponse.json(
        { success: false, message: 'Push token is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: claims.sub },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: claims.sub },
      data: {
        preferences: {
          expoPushToken: pushToken,
          deviceId: deviceId || null,
          pushTokenUpdatedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Push token registered successfully',
    });
  } catch (error) {
    console.error('Error registering push token:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register push token' },
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

    await prisma.user.update({
      where: { id: claims.sub },
      data: {
        preferences: {
          expoPushToken: null,
          deviceId: null,
          pushTokenUpdatedAt: null,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Push token removed successfully',
    });
  } catch (error) {
    console.error('Error removing push token:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove push token' },
      { status: 500 }
    );
  }
}
