'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  MoreVertical,
  CheckCircle2,
  ShieldCheck,
  Users,
  Lock,
  Settings2,
  ChevronRight,
  Zap,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Badge,
  Skeleton,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from '@gateflow/ui';
import { useRouter } from 'next/navigation';

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  isBuiltIn: boolean;
  permissionsCount: number;
}

export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for roles
    setTimeout(() => {
      setRoles([
        {
          id: 'super-admin',
          name: 'Super Admin',
          description: 'Full ecosystem access across all regional shards.',
          usersCount: 2,
          isBuiltIn: true,
          permissionsCount: 42,
        },
        {
          id: 'admin',
          name: 'Regional Admin',
          description: 'Administrative control over local organization nodes.',
          usersCount: 5,
          isBuiltIn: true,
          permissionsCount: 36,
        },
        {
          id: 'manager',
          name: 'Operations Manager',
          description: 'Management of projects, gates, and standard users.',
          usersCount: 12,
          isBuiltIn: true,
          permissionsCount: 24,
        },
        {
          id: 'custom-scanner',
          name: 'Scanner Auditor',
          description: 'Custom role for auditing scanner logs and health.',
          usersCount: 3,
          isBuiltIn: false,
          permissionsCount: 8,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-ds-icon-brand" />
            Authorization Fabric
          </h1>
          <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1">
            Managing neural permission vectors and team role trajectories
          </p>
        </div>

        <Button className="h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading
          ? Array(2)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))
          : roles.map((role) => (
              <Card
                key={role.id}
                className="border-ds-border bg-card/40 backdrop-blur-md group hover:border-ds-border-brand/30 transition-all duration-300 relative overflow-hidden border-dashed"
              >
                <div
                  className={cn(
                    'absolute top-0 left-0 w-1 h-full',
                    role.isBuiltIn
                      ? 'bg-ds-background-brand-bold'
                      : 'bg-amber-500'
                  )}
                />

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-10 w-10 rounded-xl flex items-center justify-center border border-border/30',
                          role.isBuiltIn
                            ? 'bg-ds-background-brand-subtle text-ds-text-brand'
                            : 'bg-amber-500/10 text-amber-500'
                        )}
                      >
                        {role.isBuiltIn ? (
                          <ShieldCheck className="h-5 w-5" />
                        ) : (
                          <Settings2 className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-black uppercase tracking-tight group-hover:text-ds-text-brand transition-colors">
                          {role.name}
                        </h3>
                        {role.isBuiltIn && (
                          <Badge
                            variant="outline"
                            className="text-[8px] font-black uppercase tracking-widest h-4 px-1.5 border-none bg-ds-background-brand-subtle/50 text-ds-text-brand mt-0.5"
                          >
                            Built-in
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-ds-text-subtler"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 border-ds-border shadow-xl"
                      >
                        <DropdownMenuItem
                          className="gap-2 font-bold text-xs uppercase tracking-tight py-2.5"
                          onClick={() =>
                            router.push(`/en/team-roles/${role.id}`)
                          }
                        >
                          <Lock className="h-3.5 w-3.5" /> Edit Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 font-bold text-xs uppercase tracking-tight py-2.5">
                          <Users className="h-3.5 w-3.5" /> View Members
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-xs font-bold text-ds-text-subtle leading-relaxed min-h-[40px]">
                    {role.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase opacity-60">
                          Members
                        </span>
                        <span className="text-xs font-black">
                          {role.usersCount} Nodes
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-border/30 pl-4">
                        <span className="text-[9px] font-black uppercase opacity-60">
                          Auth Vectors
                        </span>
                        <span className="text-xs font-black">
                          {role.permissionsCount} Rules
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="h-9 gap-1.5 text-[10px] font-black uppercase tracking-widest group-hover:bg-ds-background-brand-subtle group-hover:text-ds-text-brand transition-all"
                    >
                      Permission Matrix <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <Card className="border-ds-border-brand/40 bg-ds-background-brand-subtle/20 border-dashed">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-ds-background-brand-bold flex items-center justify-center text-ds-icon-inverse shadow-lg shadow-primary/20">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-ds-text-brand">
                AI Role Optimizer
              </h3>
              <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1 max-w-md">
                Analyze team activity patterns to suggest optimal permission
                matrix configurations and custom role trajectories
              </p>
            </div>
          </div>
          <Button className="h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-8">
            Run Optimization <Zap className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
