'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  Shield,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from '@gateflow/ui';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export function RoleAssignment() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users: User[] = [
    {
      id: '1',
      name: 'Ahmed Mansour',
      email: 'ahmed@rimal.ae',
      role: 'Regional Admin',
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Sarah Jenkins',
      email: 'sarah@globaltech.com',
      role: 'Member',
      status: 'ACTIVE',
    },
    {
      id: '3',
      name: 'Omar Khalid',
      email: 'omar@dubaiholding.com',
      role: 'Viewer',
      status: 'INACTIVE',
    },
  ];

  const roles = [
    'Super Admin',
    'Regional Admin',
    'Operations Manager',
    'Member',
    'Viewer',
  ];

  const handleRoleChange = (newRole: string) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Updating role to ${newRole}...`,
      success: () => {
        return `Role updated successfully for ${selectedUser?.name}`;
      },
      error: 'Failed to update role',
    });
  };

  return (
    <Card className="border-ds-border bg-card/40 border-dashed overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 border-b border-border/30 bg-muted/20">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler">
            Team Role Assignment Vector
          </h3>
        </div>

        <div className="divide-y divide-border/20">
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                'p-4 flex items-center justify-between group hover:bg-ds-background-brand-subtle/30 transition-colors cursor-pointer',
                selectedUser?.id === user.id &&
                  'bg-ds-background-brand-subtle/50'
              )}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border/30 shadow-sm">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-ds-background-brand-bold text-ds-icon-inverse font-black text-xs">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-ds-text group-hover:text-ds-text-brand transition-colors truncate">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-ds-text-subtler truncate">
                      {user.email}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[8px] h-4 px-1.5 font-black uppercase border-none bg-muted/50 text-ds-text-subtler"
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-[10px] font-black uppercase tracking-widest text-ds-text-brand opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Change Role <ChevronRight className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 border-ds-border"
                >
                  <div className="p-2 pb-1 text-[9px] font-black uppercase tracking-[0.1em] text-ds-text-subtler">
                    Assign New Vector
                  </div>
                  {roles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      className="gap-2 font-bold text-xs uppercase tracking-tight py-2.5"
                      onClick={() => handleRoleChange(role)}
                    >
                      {role === user.role ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Shield className="h-3.5 w-3.5 opacity-40" />
                      )}
                      {role}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="p-6 bg-ds-background-brand-subtle/20 border-t border-border/30 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-ds-text-subtler" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                Recent Auth Changes
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-tight">
                    Role Updated
                  </span>
                  <span className="text-[9px] font-bold text-ds-text-subtler italic">
                    By Super Admin • 2 days ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
