'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Label,
} from '@gate-access/ui';
import {
  Shield,
  Users,
  Trash2,
  Plus,
  Save,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PermissionMatrix } from './permission-matrix';
import {
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
} from '../../../app/[locale]/dashboard/workspace/settings/actions';

interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: Record<string, boolean>;
  isBuiltIn: boolean;
  _count?: {
    users: number;
  };
}

interface RoleDashboardProps {
  roles: Role[];
  canManageRoles: boolean;
}

export function RoleDashboard({ roles, canManageRoles }: RoleDashboardProps) {
  const { t } = useTranslation('dashboard');
  const [editingRole, setEditingRole] = useState<Partial<Role> | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = async () => {
    if (!editingRole?.name)
      return toast.error(
        t('settings.team.roleNameRequired', 'Role name is required.')
      );

    startTransition(async () => {
      const data = {
        name: editingRole.name!,
        description: editingRole.description,
        permissions: editingRole.permissions || {},
      };

      const res = editingRole.id
        ? await updateRoleAction(editingRole.id, data)
        : await createRoleAction(data);

      if (res.success) {
        toast.success(
          editingRole.id
            ? t('settings.team.roleUpdated', 'Role updated successfully.')
            : t('settings.team.roleCreated', 'Role created successfully.')
        );
        setEditingRole(null);
      } else {
        toast.error(res.message || t('common.error', 'An error occurred.'));
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        t(
          'settings.team.deleteRoleConfirm',
          'Are you sure you want to delete this role?'
        )
      )
    )
      return;

    startTransition(async () => {
      const res = await deleteRoleAction(id);
      if (res.success) {
        toast.success(
          t('settings.team.roleDeleted', 'Role deleted successfully.')
        );
      } else {
        toast.error(res.message || t('common.error', 'An error occurred.'));
      }
    });
  };

  if (editingRole) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingRole(null)}
              className="h-10 w-10 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight">
                {editingRole.id
                  ? t('settings.team.editRole', 'Edit Role')
                  : t('settings.team.newRole', 'New Custom Role')}
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {t(
                  'settings.team.roleEditorDesc',
                  'Define granular access rights for this role.'
                )}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={isPending || !!(editingRole.isBuiltIn && editingRole.id)}
            className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[11px] gap-2"
          >
            {isPending ? (
              <Shield className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {t('common.saveChanges', 'Save Changes')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 rounded-2xl border-primary/10 shadow-sm overflow-hidden h-fit">
            <CardHeader className="bg-primary/5 pb-6">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                General Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="role-name"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Role Name
                </Label>
                <Input
                  id="role-name"
                  value={editingRole.name || ''}
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, name: e.target.value })
                  }
                  placeholder="e.g. Building Manager"
                  disabled={editingRole.isBuiltIn}
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="role-desc"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Description
                </Label>
                <Input
                  id="role-desc"
                  value={editingRole.description || ''}
                  onChange={(e) =>
                    setEditingRole({
                      ...editingRole,
                      description: e.target.value,
                    })
                  }
                  placeholder="What can this role do?"
                  disabled={editingRole.isBuiltIn}
                  className="h-11 rounded-xl border-border"
                />
              </div>
              {editingRole.isBuiltIn && (
                <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-start gap-3 mt-4">
                  <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                    This is a{' '}
                    <span className="font-bold text-foreground">
                      Built-in Role
                    </span>
                    . Basic information cannot be modified, but you can review
                    its permissions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                Permission Matrix
              </h3>
              <Badge
                variant="outline"
                className="text-[10px] font-black uppercase bg-primary/5 text-primary border-primary/10"
              >
                {
                  Object.values(editingRole.permissions || {}).filter(Boolean)
                    .length
                }{' '}
                Active Rights
              </Badge>
            </div>
            <PermissionMatrix
              permissions={editingRole.permissions || {}}
              onChange={(perms) =>
                setEditingRole({ ...editingRole, permissions: perms })
              }
              disabled={editingRole.isBuiltIn}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase tracking-tight">
            {t('settings.team.rolesTitle', 'Roles Configuration')}
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            {t(
              'settings.team.rolesDesc',
              'Manage built-in and custom workspace roles.'
            )}
          </p>
        </div>
        {canManageRoles && (
          <Button
            onClick={() =>
              setEditingRole({ name: '', permissions: {}, isBuiltIn: false })
            }
            className="w-full sm:w-auto gap-2 rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[11px]"
          >
            <Plus className="h-4 w-4" />
            {t('settings.team.createRole', 'Create Custom Role')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card
            key={role.id}
            className="group rounded-2xl border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden flex flex-col"
          >
            <CardHeader className="p-6 pb-2">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center mb-1 group-hover:bg-primary/10 transition-colors">
                  <Shield className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                {role.isBuiltIn ? (
                  <Badge
                    variant="secondary"
                    className="text-[9px] font-black uppercase tracking-widest bg-muted/80 text-muted-foreground border-none"
                  >
                    Built-in
                  </Badge>
                ) : (
                  <Badge className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    Custom
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base font-bold uppercase tracking-tight mt-3">
                {role.name}
              </CardTitle>
              <CardDescription className="text-xs line-clamp-2 min-h-[2.5rem] mt-1">
                {role.description ||
                  t(
                    'settings.team.noRoleDesc',
                    'No description provided for this role.'
                  )}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 mt-auto">
              <div className="h-px bg-border/50 w-full mb-4" />
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" />
                  <span>{role._count?.users ?? 0} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 opacity-50" />
                  <span>
                    {Object.values(role.permissions).filter(Boolean).length}{' '}
                    rights
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingRole(role)}
                  className="flex-1 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary hover:text-white hover:border-primary"
                >
                  {role.isBuiltIn ? 'View Rights' : 'Configure'}
                </Button>
                {!role.isBuiltIn && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(role.id)}
                    disabled={(role._count?.users ?? 0) > 0}
                    className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
