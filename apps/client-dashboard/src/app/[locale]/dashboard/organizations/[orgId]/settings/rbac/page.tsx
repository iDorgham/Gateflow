import { requireAuth } from '@/lib/dashboard-auth';
import { getRoles } from '../team/actions';
import { RoleDashboard } from '@/components/settings/team/role-dashboard';

export default async function RBACSettings() {
  const { claims } = await requireAuth();

  const rolesResult = await getRoles();
  const roles = (rolesResult.data ?? []) as Parameters<
    typeof RoleDashboard
  >[0]['roles'];

  const canManageRoles = !!claims.permissions?.['roles:manage'];

  return (
    <div className="space-y-6">
      <RoleDashboard roles={roles} canManageRoles={canManageRoles} />
    </div>
  );
}
