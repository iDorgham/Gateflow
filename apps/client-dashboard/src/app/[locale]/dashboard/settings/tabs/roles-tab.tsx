'use client';

import { useState, useTransition } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Label,
  Checkbox,
} from '@gate-access/ui';
import { 
  ShieldAlert, 
  Users, 
  CheckCircle2,
  Save,
  Trash2,
  Edit2,
  Plus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createRoleAction, updateRoleAction, deleteRoleAction } from '../../workspace/settings/actions';

interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: Record<string, boolean>;
  isBuiltIn: boolean;
  userCount: number;
}

const PERMISSIONS_LIST = [
  { id: 'gates:manage', label: 'Manage Gates' },
  { id: 'qr:create', label: 'Create QR Codes' },
  { id: 'qr:manage', label: 'Manage QR Codes' },
  { id: 'scans:view', label: 'View Scans' },
  { id: 'scans:override', label: 'Override Scans' },
  { id: 'workspace:manage', label: 'Manage Workspace' },
  { id: 'roles:manage', label: 'Manage Roles' },
  { id: 'users:manage', label: 'Manage Users' },
  { id: 'analytics:view', label: 'View Analytics' },
  { id: 'projects:manage', label: 'Manage Projects' },
  { id: 'units:manage', label: 'Manage Units' },
  { id: 'contacts:manage', label: 'Manage Contacts' },
];

export function RolesTab({ roles, canManageRoles = false }: { roles: Role[], canManageRoles?: boolean }) {
  const { t } = useTranslation('dashboard');
  const [isPending, startTransition] = useTransition();
  const [editingRole, setEditingRole] = useState<Partial<Role> | null>(null);

  const handleSaveRole = async () => {
    if (!canManageRoles) return toast.error('Unauthorized');
    if (!editingRole?.name) return toast.error('Role name is required');
// ... (rest of the file content needs to be updated appropriately)

    startTransition(async () => {
      const res = editingRole.id 
        ? await updateRoleAction(editingRole.id, { 
            name: editingRole.name!, 
            description: editingRole.description, 
            permissions: editingRole.permissions || {} 
          })
        : await createRoleAction({ 
            name: editingRole.name!, 
            description: editingRole.description, 
            permissions: editingRole.permissions || {} 
          });

      if (res.success) {
        toast.success(editingRole.id ? 'Role updated' : 'Role created');
        setEditingRole(null);
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    startTransition(async () => {
      const res = await deleteRoleAction(id);
      if (res.success) {
        toast.success('Role deleted');
      } else {
        toast.error(res.message);
      }
    });
  };

  const togglePermission = (permId: string) => {
    if (!editingRole) return;
    const newPermissions = { ...(editingRole.permissions || {}) };
    newPermissions[permId] = !newPermissions[permId];
    setEditingRole({ ...editingRole, permissions: newPermissions });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings.roles.title', 'Roles & Permissions')}</h1>
            <p className="text-sm text-muted-foreground">{t('settings.roles.description', 'Manage custom roles and granular access control.')}</p>
          </div>
        </div>
        <Button 
          onClick={() => setEditingRole({ name: '', permissions: {}, isBuiltIn: false })}
          className="rounded-xl font-bold uppercase tracking-widest gap-2"
        >
          <Plus className="h-4 w-4" />
          New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Roles List */}
        <div className="space-y-4">
          {roles.map((role) => (
            <Card key={role.id} className={cn("overflow-hidden transition-all border-border", editingRole?.id === role.id && "ring-2 ring-primary border-primary")}>
              <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-tight">{role.name}</CardTitle>
                    {role.isBuiltIn && <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest h-5">Built-in</Badge>}
                  </div>
                  <CardDescription className="text-xs">{role.description || 'No description provided.'}</CardDescription>
                </div>
                {!role.isBuiltIn && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingRole(role)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {role.userCount} users
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {Object.values(role.permissions).filter(Boolean).length} permissions
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Editor */}
        {editingRole && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <Card className="rounded-2xl border-primary/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6">
                <CardTitle className="text-lg font-bold uppercase tracking-tight">
                  {editingRole.id ? 'Edit Role' : 'Create New Role'}
                </CardTitle>
                <CardDescription>Tailor access rights for your workspace members.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Role Name</Label>
                    <Input 
                      id="role-name" 
                      value={editingRole.name} 
                      onChange={e => setEditingRole({...editingRole, name: e.target.value})}
                      placeholder="e.g. Content Moderator" 
                      className="rounded-xl border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-desc" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Description</Label>
                    <Input 
                      id="role-desc" 
                      value={editingRole.description || ''} 
                      onChange={e => setEditingRole({...editingRole, description: e.target.value})}
                      placeholder="Briefly describe what this role does..." 
                      className="rounded-xl border-border"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Permissions</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {PERMISSIONS_LIST.map(perm => (
                      <div key={perm.id} className="flex items-center space-x-3 p-3 rounded-xl border border-border bg-muted/5 hover:bg-muted/10 transition-colors">
                        <Checkbox 
                          id={`perm-${perm.id}`} 
                          checked={editingRole.permissions?.[perm.id] || false}
                          onChange={() => togglePermission(perm.id)}
                        />
                        <label htmlFor={`perm-${perm.id}`} className="text-xs font-bold uppercase tracking-tight cursor-pointer select-none flex-1">
                          {perm.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {canManageRoles && (
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button onClick={handleSaveRole} disabled={isPending} className="flex-1 h-12 rounded-xl bg-primary text-xs font-black uppercase tracking-widest gap-2">
                      {isPending ? <ShieldAlert className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Role
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingRole(null)} className="h-12 rounded-xl text-xs font-black uppercase tracking-widest">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
