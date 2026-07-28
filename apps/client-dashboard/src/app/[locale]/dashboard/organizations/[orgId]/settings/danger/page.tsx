import { requireAuth } from '@/lib/dashboard-auth';
import { DangerZone } from '@/components/settings/danger/danger-zone';

export default async function DangerSettings() {
  const { org } = await requireAuth();
  if (!org) return null;

  return (
    <div className="space-y-6">
      <DangerZone orgName={org.name} />
    </div>
  );
}
