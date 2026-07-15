import { requireAuth } from '@/lib/dashboard-auth';
import { getRoles } from '../team/actions';
import { RoleDashboard } from '@/components/settings/team/role-dashboard';

export default async function RBACSettings() {
  const { claims } = await requireAuth();

  const rolesResult = await getRoles();
  const roles = (rolesResult.data ?? []) as Parameters<typeof RoleDashboard>[0]['roles'];

  const canManageRoles = !!(claims.permissions?.['roles:manage']);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-black uppercase tracking-tight">Roles & Permissions</h1>
        <p className="text-sm text-muted-foreground">
          Configure granular access control for your team. Custom roles override built-in defaults.
        </p>
      </div>

      <RoleDashboard roles={roles} canManageRoles={canManageRoles} />
    </div>
  );
}
