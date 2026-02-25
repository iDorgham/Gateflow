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
  AvatarImage,
  Badge,
  Table,
} from '@gate-access/ui';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Mail, 
  Shield, 
  ShieldCheck, 
  Clock, 
  MoreVertical, 
  ShieldAlert,
  Fingerprint,
  ChevronRight,
  Info,
  CheckCircle2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLE_PERMISSIONS: Record<string, { icon: any; color: string }> = {
  OWNER: { icon: ShieldAlert, color: 'border-amber-500/30 text-amber-500 bg-amber-500/5' },
  WORKSPACE_ADMIN: { icon: ShieldCheck, color: 'border-primary/30 text-primary bg-primary/5' },
  TENANT_USER: { icon: Users, color: 'border-border text-muted-foreground bg-muted/10' },
};
export function TeamTab({ members, currentUserId }: { members: TeamMember[]; currentUserId: string }) {
  const { t } = useTranslation('dashboard');
  const [showRolesEditor, setShowRolesEditor] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-border/50">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5">
                <Users className="h-10 w-10 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground uppercase">{t('settings.team.title', 'Human Resources & Access Controls')}</h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                {t('settings.team.description', 'Manage the administrative team and define granular permission matrices.')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => toast.info(t('settings.team.messages.restricted', 'Invitations restricted.'))} className="w-full sm:w-auto px-8 h-11 rounded-xl bg-primary shadow-lg shadow-primary/10 hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-widest gap-2">
            <UserPlus className="h-4 w-4" />
            {t('settings.team.inviteMember', 'Invite Member')}
          </Button>
        </div>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const initials = member.name
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          
          const roleData = ROLE_PERMISSIONS[member.role] || ROLE_PERMISSIONS.TENANT_USER;
          const RoleIcon = roleData.icon;

          return (
            <Card key={member.id} className="relative group flex flex-col rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1 overflow-hidden">
                <CardHeader className="pb-4 pt-6 px-6 flex flex-row items-start justify-between">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-lg ring-1 ring-border group-hover:scale-105 transition-transform duration-500">
                        <AvatarFallback className="bg-muted text-muted-foreground text-sm font-black">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <Badge className={cn("rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] shadow-sm border", roleData.color)}>
                        <RoleIcon className="h-3 w-3 mr-1.5" />
                        {member.role}
                    </Badge>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-2 flex-grow">
                    <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-black text-foreground truncate uppercase tracking-tight text-lg">
                                {member.name}
                            </h3>
                            {member.id === currentUserId && (
                                <Badge variant="outline" className="text-[8px] border-primary/30 text-primary uppercase font-black bg-primary/5">YOU</Badge>
                            )}
                        </div>
                        <p className="text-xs font-bold text-muted-foreground/60 flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground/30" />
                            {member.email}
                        </p>
                    </div>
                    
                    <div className="mt-8 pt-5 border-t border-border/50 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Active Since</span>
                            <div className="flex items-center gap-1.5 font-bold text-[10px] text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground/30" />
                                {new Date(member.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                        {member.id !== currentUserId && (
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all active:scale-90">
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
          );
        })}

        {/* Empty Slot */}
        <button 
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border shadow-sm group-hover:scale-110 group-hover:shadow-primary/10 transition-all">
                <Users className="h-6 w-6 text-muted-foreground/20 group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 group-hover:text-primary transition-colors">Expand Operations</p>
                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-tighter mt-1">Available seats: 4/5</p>
            </div>
        </button>
      </div>


    </div>
  );
}

