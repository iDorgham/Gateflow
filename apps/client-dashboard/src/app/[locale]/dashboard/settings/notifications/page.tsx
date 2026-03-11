import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { NotificationPrefsForm } from '@/components/settings/notifications/notification-prefs-form';
import { TemplatePreviewer } from '@/components/settings/notifications/template-previewer';
import type { NotificationConfig } from '@/app/api/notification-prefs/route';
import { DEFAULT_NOTIFICATION_CONFIG } from '@/app/api/notification-prefs/route';

export default async function NotificationsSettings() {
  const { org } = await requireAuth();
  if (!org) return null;

  const orgRow = await prisma.organization.findUnique({
    where: { id: org.id },
    select: { notificationConfig: true },
  });

  const config = (orgRow?.notificationConfig ?? DEFAULT_NOTIFICATION_CONFIG) as unknown as NotificationConfig;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-black uppercase tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Configure which events trigger alerts and how they are delivered to your team.
        </p>
      </div>

      <NotificationPrefsForm initialConfig={config} />

      <TemplatePreviewer />
    </div>
  );
}
