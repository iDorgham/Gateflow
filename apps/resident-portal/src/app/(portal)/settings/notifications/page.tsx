import { PageHeader } from '@/components/layout/page-header';
import { NotificationSettings } from '@/components/profile/notification-settings';

export default function NotificationsSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Notifications" backHref="/profile" />
      <main className="mx-auto w-full max-w-md space-y-6 px-4 py-6 pb-24 md:max-w-4xl">
        <NotificationSettings />
      </main>
    </div>
  );
}
