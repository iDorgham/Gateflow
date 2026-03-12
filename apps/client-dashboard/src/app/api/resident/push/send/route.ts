import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: string;
}

async function sendExpoPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  const message: ExpoPushMessage = {
    to: token,
    title,
    body,
    data,
    sound: 'default',
  };

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorQRId, gateId } = body;

    if (!visitorQRId) {
      return NextResponse.json(
        { success: false, message: 'Visitor QR ID is required' },
        { status: 400 }
      );
    }

    const visitorQR = await prisma.visitorQR.findUnique({
      where: { id: visitorQRId },
      include: {
        qrCode: true,
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
        accessRule: true,
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
        { success: false, message: 'Resident not found for this visitor QR' },
        { status: 404 }
      );
    }

    const preferences = (resident.preferences as Record<string, unknown>) || {};
    const pushToken = preferences.expoPushToken as string | null;

    if (!pushToken) {
      return NextResponse.json({
        success: true,
        message: 'No push token registered for resident',
        sent: false,
      });
    }

    const gate = gateId
      ? await prisma.gate.findUnique({
          where: { id: gateId },
          select: { name: true },
        })
      : null;

    const visitorName = visitorQR.visitorName || 'A visitor';
    const gateName = gate?.name || 'the gate';

    const result = await sendExpoPushNotification(
      pushToken,
      'Visitor Scan',
      `${visitorName} just scanned in at ${gateName}`,
      {
        type: 'visitor_scan',
        visitorQRId,
        visitorName: visitorQR.visitorName,
        gateId,
        gateName: gate?.name,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Push notification sent',
      sent: true,
      expoResponse: result,
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send push notification' },
      { status: 500 }
    );
  }
}
