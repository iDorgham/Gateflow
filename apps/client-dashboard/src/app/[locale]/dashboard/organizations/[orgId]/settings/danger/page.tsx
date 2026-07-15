import { requireAuth } from '@/lib/dashboard-auth';
import { DangerZone } from '@/components/settings/danger/danger-zone';

export default async function DangerSettings() {
  const { org } = await requireAuth();
  if (!org) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-black uppercase tracking-tight text-destructive">Danger Zone</h1>
        <p className="text-sm text-muted-foreground">
          Irreversible actions for your workspace. All operations are logged in your audit trail.
        </p>
      </div>

      <DangerZone orgName={org.name} />
    </div>
  );
}
