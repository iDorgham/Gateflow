import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';

type NotificationPreferences = {
  pushVisitorArrival: boolean;
  pushSecurityAlerts: boolean;
  emailWeeklySummary: boolean;
};

const DEFAULT_PREFS: NotificationPreferences = {
  pushVisitorArrival: true,
  pushSecurityAlerts: true,
  emailWeeklySummary: false,
};

function extractNotificationPrefs(
  preferences: unknown
): NotificationPreferences {
  if (!preferences || typeof preferences !== 'object') return DEFAULT_PREFS;
  const root = preferences as Record<string, unknown>;
  const notif = root.notifications;
  if (!notif || typeof notif !== 'object') return DEFAULT_PREFS;
  const n = notif as Record<string, unknown>;
  return {
    pushVisitorArrival: Boolean(
      n.pushVisitorArrival ?? DEFAULT_PREFS.pushVisitorArrival
    ),
    pushSecurityAlerts: Boolean(
      n.pushSecurityAlerts ?? DEFAULT_PREFS.pushSecurityAlerts
    ),
    emailWeeklySummary: Boolean(
      n.emailWeeklySummary ?? DEFAULT_PREFS.emailWeeklySummary
    ),
  };
}

export async function GET() {
  const claims = await getSessionClaims();
  if (!claims?.sub) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const organizationId = (claims.org as string) || (claims.orgId as string);
  if (!organizationId) {
    return NextResponse.json(
      { success: false, error: 'Organization missing' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      id: claims.sub,
      organizationId,
      deletedAt: null,
    },
    select: { preferences: true },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: extractNotificationPrefs(user.preferences),
  });
}

export async function PATCH(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.sub) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const organizationId = (claims.org as string) || (claims.orgId as string);
  if (!organizationId) {
    return NextResponse.json(
      { success: false, error: 'Organization missing' },
      { status: 400 }
    );
  }

  const body = (await request.json()) as Partial<NotificationPreferences>;
  const current = await prisma.user.findFirst({
    where: {
      id: claims.sub,
      organizationId,
      deletedAt: null,
    },
    select: { preferences: true },
  });

  if (!current) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  const currentPrefs =
    current.preferences && typeof current.preferences === 'object'
      ? (current.preferences as Record<string, unknown>)
      : {};
  const notifications = extractNotificationPrefs(current.preferences);

  const updatedNotifications: NotificationPreferences = {
    pushVisitorArrival:
      body.pushVisitorArrival ?? notifications.pushVisitorArrival,
    pushSecurityAlerts:
      body.pushSecurityAlerts ?? notifications.pushSecurityAlerts,
    emailWeeklySummary:
      body.emailWeeklySummary ?? notifications.emailWeeklySummary,
  };

  await prisma.user.update({
    where: { id: claims.sub },
    data: {
      preferences: {
        ...currentPrefs,
        notifications: updatedNotifications,
      },
    },
  });

  return NextResponse.json({ success: true, data: updatedNotifications });
}
