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
    const { visitorQRId } = body;

    if (!visitorQRId) {
      return NextResponse.json(
        { success: false, message: 'Visitor QR ID is required' },
        { status: 400 }
      );
    }

    const visitorQR = await prisma.visitorQR.findUnique({
      where: { id: visitorQRId },
      include: {
        unit: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                preferences: true,
              },
            },
          },
        },
      },
    });

    if (!visitorQR) {
      return NextResponse.json(
        { success: false, message: 'Visitor QR not found' },
        { status: 404 }
      );
    }

    const resident = visitorQR.unit?.user;
    if (!resident) {
      return NextResponse.json(
        { success: false, message: 'Resident not found' },
        { status: 404 }
      );
    }

    const preferences = (resident.preferences as Record<string, unknown>) || {};
    const pushToken = preferences.expoPushToken as string | null;

    if (pushToken) {
      const visitorName = visitorQR.visitorName || 'Your visitor';

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: pushToken,
          title: 'Visitor Arrived',
          body: `${visitorName} has arrived at your door`,
          data: {
            type: 'visitor_arrived',
            visitorQRId,
          },
          sound: 'default',
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Arrival notification sent',
    });
  } catch (error) {
    console.error('Error sending arrival notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send arrival notification' },
      { status: 500 }
    );
  }
}
