import { requireAuth } from '@/lib/dashboard-auth';
import { AuditLedgerCard } from '@/components/settings/security/audit-ledger-card';

export const dynamic = 'force-dynamic';

export default async function SecuritySettingsPage() {
  const { org } = await requireAuth();
  if (!org) return null;

  return (
    <div className="space-y-6">
      <AuditLedgerCard orgName={org.name} />
    </div>
  );
}
