import { requireAuth } from '@/lib/dashboard-auth';
import { prisma } from '@gate-access/db';
import { NotificationPrefsForm } from '@/components/settings/notifications/notification-prefs-form';
import { TemplatePreviewer } from '@/components/settings/notifications/template-previewer';
import type { NotificationConfig } from '@/lib/notifications/types';
import { DEFAULT_NOTIFICATION_CONFIG } from '@/lib/notifications/types';

export default async function NotificationsSettings() {
  const { org } = await requireAuth();
  if (!org) return null;

  const orgRow = await prisma.organization.findUnique({
    where: { id: org.id },
    select: { notificationConfig: true },
  });

  const config = (orgRow?.notificationConfig ??
    DEFAULT_NOTIFICATION_CONFIG) as unknown as NotificationConfig;

  return (
    <div className="space-y-8">
      <NotificationPrefsForm initialConfig={config} />

      <TemplatePreviewer />
    </div>
  );
}
