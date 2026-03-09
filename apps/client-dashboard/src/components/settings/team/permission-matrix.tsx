'use client';

import {
  Checkbox,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Badge,
  cn,
} from '@gate-access/ui';
import { ShieldAlert } from 'lucide-react';

export interface PermissionGroup {
  id: string;
  label: string;
  permissions: {
    id: string;
    label: string;
    description: string;
    isSensitive?: boolean;
  }[];
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'gates',
    label: 'Gates',
    permissions: [
      { id: 'gates:view', label: 'View Gates', description: 'Can see list of gates and their status' },
      { id: 'gates:manage', label: 'Manage Gates', description: 'Can create, edit, and delete gates', isSensitive: true },
      { id: 'gates:assignments', label: 'Manage Assignments', description: 'Can assign members to specific gates', isSensitive: true },
    ]
  },
  {
    id: 'qr',
    label: 'QR Codes',
    permissions: [
      { id: 'qr:view', label: 'View QR Codes', description: 'Can see all generated QR codes' },
      { id: 'qr:create', label: 'Create QR Codes', description: 'Can generate new scan passes' },
      { id: 'qr:manage', label: 'Manage QR Codes', description: 'Can revoke or modify existing passes', isSensitive: true },
    ]
  },
  {
    id: 'projects',
    label: 'Projects',
    permissions: [
      { id: 'projects:view', label: 'View Projects', description: 'Can see mapped projects and buildings' },
      { id: 'projects:manage', label: 'Manage Projects', description: 'Can create and map projects to resources', isSensitive: true },
    ]
  },
  {
    id: 'units',
    label: 'Units & Residents',
    permissions: [
      { id: 'units:view', label: 'View Units', description: 'Can see unit roster and resident connections' },
      { id: 'units:manage', label: 'Manage Units', description: 'Can update unit details and quotas', isSensitive: true },
      { id: 'residents:manage', label: 'Manage Residents', description: 'Can approve or remove resident access', isSensitive: true },
    ]
  },
  {
    id: 'team',
    label: 'Team & RBAC',
    permissions: [
      { id: 'users:view', label: 'View Team', description: 'Can see team roster and invitations' },
      { id: 'users:manage', label: 'Manage Team', description: 'Can invite and remove members', isSensitive: true },
      { id: 'roles:manage', label: 'Manage Roles', description: 'Can create and edit permission matrices', isSensitive: true },
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics & Logs',
    permissions: [
      { id: 'scans:view', label: 'View Scan Logs', description: 'Can see real-time entry history' },
      { id: 'scans:export', label: 'Export Data', description: 'Can download CSV reports of scans', isSensitive: true },
      { id: 'analytics:view', label: 'View Analytics', description: 'Can see traffic patterns and trends' },
    ]
  }
];

interface PermissionMatrixProps {
  permissions: Record<string, boolean>;
  onChange: (permissions: Record<string, boolean>) => void;
  disabled?: boolean;
}

export function PermissionMatrix({ permissions, onChange, disabled }: PermissionMatrixProps) {
  const togglePermission = (id: string) => {
    if (disabled) return;
    const newPerms = { ...permissions };
    newPerms[id] = !newPerms[id];
    onChange(newPerms);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PERMISSION_GROUPS.map((group) => (
          <div key={group.id} className="space-y-4 p-5 rounded-2xl border border-border bg-card/50">
            <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                {group.label}
              </h3>
              <Badge variant="outline" className="text-[10px] font-bold border-none bg-muted/50">
                {group.permissions.length} keys
              </Badge>
            </div>
            
            <div className="space-y-2">
              {group.permissions.map((perm) => (
                <div 
                  key={perm.id} 
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-xl border border-transparent transition-all",
                    permissions[perm.id] ? "bg-primary/5 border-primary/10" : "hover:bg-muted/50",
                    disabled && "opacity-50 grayscale cursor-not-allowed"
                  )}
                >
                  <Checkbox 
                    id={`perm-${perm.id}`}
                    checked={permissions[perm.id] || false}
                    onCheckedChange={() => togglePermission(perm.id)}
                    disabled={disabled}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <label 
                      htmlFor={`perm-${perm.id}`}
                      className="text-xs font-bold uppercase tracking-tight cursor-pointer flex items-center gap-2"
                    >
                      {perm.label}
                      {perm.isSensitive && (
                        <Tooltip>
                          <TooltipTrigger>
                            <ShieldAlert className="h-3 w-3 text-red-500" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-red-500 text-white border-none font-bold text-[10px] uppercase">
                            Admin Level Access Required
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </label>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {perm.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}

