'use client';

import React, { useState } from 'react';
import {
  Shield,
  ArrowLeft,
  Save,
  Info,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lock,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Download,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Badge,
  Input,
  Textarea,
  cn,
  Switch,
  Separator,
} from '@gateflow/ui';
import { useParams, useRouter } from 'next/navigation';

const PERMISSION_GROUPS = [
  {
    id: 'organizations',
    label: 'Organizations',
    permissions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'users',
    label: 'Users',
    permissions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'projects',
    label: 'Projects',
    permissions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'gates',
    label: 'Gates',
    permissions: ['view', 'create', 'edit', 'delete'],
  },
  {
    id: 'cms',
    label: 'CMS',
    permissions: ['view', 'create', 'edit', 'delete', 'publish'],
  },
  {
    id: 'crm',
    label: 'CRM',
    permissions: ['view', 'create', 'edit', 'delete', 'export'],
  },
  {
    id: 'support',
    label: 'Support',
    permissions: ['view', 'create', 'edit', 'delete', 'escalate'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    permissions: ['view', 'export'],
  },
];

export default function RoleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.roleId as string;
  const [roleName, setRoleName] = useState(
    roleId === 'new' ? '' : (roleId || '').replace('-', ' ').toUpperCase()
  );

  return (
    <div className="p-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 border border-border/30 rounded-xl"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-tight">
                {roleName || 'New Role'}
              </h1>
              <Badge
                variant="outline"
                className="text-[9px] font-black uppercase tracking-widest px-2 h-5 border-ds-border bg-muted/30 text-ds-text-subtler"
              >
                PERMISSION MATRIX
              </Badge>
            </div>
            <p className="text-xs font-bold text-ds-text-subtle mt-0.5 uppercase tracking-widest">
              Configuring neural authorization vectors for ecosystem agents
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 border-ds-border text-[10px] font-black uppercase tracking-widest px-6"
          >
            Cancel
          </Button>
          <Button className="h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-8 shadow-lg shadow-primary/20">
            <Save className="h-4 w-4" /> Save Authorization State
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Role Metadata */}
          <Card className="border-ds-border bg-card/40 border-dashed">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                    Role Name
                  </label>
                  <Input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="h-11 text-xs font-black uppercase border-ds-border bg-card/50"
                    placeholder="E.G. REGIONAL AUDITOR"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                    Inherits From
                  </label>
                  <Input
                    placeholder="Optional: Select base role..."
                    className="h-11 text-xs font-bold border-ds-border bg-card/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                  Role Description
                </label>
                <Textarea
                  placeholder="Define the scope and responsibility of this role vector..."
                  className="min-h-[100px] text-xs font-bold border-ds-border bg-card/50 p-4"
                />
              </div>
            </CardContent>
          </Card>

          {/* Permission Groups */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler flex items-center gap-2">
              <Lock className="h-4 w-4" /> Granular Permission Matrix
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PERMISSION_GROUPS.map((group) => (
                <Card
                  key={group.id}
                  className="border-ds-border bg-card/40 border-dashed overflow-hidden group"
                >
                  <CardHeader className="bg-muted/20 border-b border-border/30 flex flex-row items-center justify-between p-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest">
                      {group.label}
                    </h3>
                    <Switch className="scale-75 data-[state=checked]:bg-ds-background-brand-bold" />
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {group.permissions.map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center justify-between group/perm"
                      >
                        <div className="flex items-center gap-2">
                          {perm === 'view' ? (
                            <Eye className="h-3.5 w-3.5 text-blue-500" />
                          ) : perm === 'create' ? (
                            <Plus className="h-3.5 w-3.5 text-emerald-500" />
                          ) : perm === 'edit' ? (
                            <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                          ) : perm === 'delete' ? (
                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                          ) : (
                            <Download className="h-3.5 w-3.5 text-indigo-500" />
                          )}
                          <span className="text-[10px] font-black uppercase tracking-tight text-ds-text-subtle group-hover/perm:text-ds-text transition-colors">
                            {perm.replace('_', ' ')}
                          </span>
                        </div>
                        <Switch className="scale-75 data-[state=checked]:bg-ds-background-brand-bold" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-ds-border-brand/40 bg-ds-background-brand-subtle/20 border-dashed">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 text-ds-text-brand">
                <Sparkles className="h-5 w-5" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">
                  AI Role Insights
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-white/40 border border-ds-border-brand/10 space-y-3">
                <p className="text-[11px] font-bold leading-relaxed opacity-80">
                  This configuration most closely resembles the{' '}
                  <span className="text-ds-text-brand font-black">MANAGER</span>{' '}
                  pattern with additional{' '}
                  <span className="text-ds-text-brand font-black">EXPORT</span>{' '}
                  vectors.
                </p>
                <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-tight">
                    Zero Conflicts Found
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full h-10 text-[10px] font-black uppercase tracking-widest gap-2 border border-ds-border-brand/20"
              >
                Audit Perm Log <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-ds-border bg-card/40 border-dashed">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                System Invariants
              </h4>
              <div className="space-y-3">
                {[
                  'Built-in roles cannot be deleted.',
                  'Super Admin always has full access.',
                  'Changes are audited for Law 151 compliance.',
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Info className="h-3.5 w-3.5 text-ds-text-subtler shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-ds-text-subtler leading-normal italic">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
