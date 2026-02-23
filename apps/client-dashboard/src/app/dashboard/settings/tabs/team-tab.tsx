'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  Badge,
} from '@gate-access/ui';
import { Users, Plus, Trash2, Mail, Shield, ShieldCheck, Clock, UserPlus, MoreVertical, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLE_STYLES: Record<string, { badge: string; icon: any }> = {
  ADMIN: { badge: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400', icon: Shield },
  TENANT_ADMIN: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: ShieldCheck },
  TENANT_USER: { badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300', icon: Users },
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'System Admin',
  TENANT_ADMIN: 'Owner',
  TENANT_USER: 'Member',
};

export function TeamTab({ members, currentUserId }: { members: TeamMember[]; currentUserId: string }) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Personnel & Permissions</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage access levels for your workspace administrative team.</p>
        </div>
        <Button onClick={() => toast.info('Team invitations are currently restricted to owners.')} className="w-full sm:w-auto gap-2 rounded-xl bg-primary font-black uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5">
          <UserPlus className="h-4 w-4" />
          Invite Associate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const initials = member.name
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          
          const style = ROLE_STYLES[member.role] ?? ROLE_STYLES.TENANT_USER;
          const RoleIcon = style.icon;

          return (
            <Card key={member.id} className="relative group overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
                <CardHeader className="pb-4 pt-6 px-6">
                    <div className="flex items-start justify-between">
                        <Avatar className="h-12 w-12 border-2 border-slate-100 dark:border-slate-700 shadow-sm ring-4 ring-primary/5">
                            <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-sm font-black">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <Badge className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] shadow-sm border-none ${style.badge}`}>
                            <div className="flex items-center gap-1">
                                <RoleIcon className="h-3 w-3" />
                                {ROLE_LABELS[member.role] ?? member.role}
                            </div>
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <div className="space-y-1 min-w-0">
                        <h3 className="font-black text-slate-900 dark:text-white truncate uppercase tracking-tight text-base">
                            {member.name}
                            {member.id === currentUserId && (
                                <span className="ml-2 text-[10px] text-blue-500 lowercase font-bold tracking-normal italic">(you)</span>
                            )}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-xs font-medium truncate">{member.email}</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-300" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Since {new Date(member.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        {member.id !== currentUserId && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
          );
        })}

        {/* Invite placeholder card */}
        <button 
            onClick={() => toast.info('Seat limit reached for current plan.')}
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 p-8 transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 transition-all group-hover:scale-110 group-hover:shadow-primary/10">
                <UserPlus className="h-6 w-6 text-slate-300 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Add Team Space</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Scale your operations</p>
            </div>
        </button>
      </div>
    </div>
  );
}
