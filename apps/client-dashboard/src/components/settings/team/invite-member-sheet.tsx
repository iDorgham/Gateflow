'use client';

import { useState, useTransition } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@gate-access/ui';
import { Mail, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { inviteTeamMember } from '../../../app/[locale]/dashboard/settings/team/actions';

interface Role {
  id: string;
  name: string;
}

interface InviteMemberSheetProps {
  roles: Role[];
  children: React.ReactNode;
}

export function InviteMemberSheet({ roles, children }: InviteMemberSheetProps) {
  const { t } = useTranslation('dashboard');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !roleId) return toast.error(t('settings.team.fieldsRequired', 'Email and Role are required.'));

    startTransition(async () => {
      const res = await inviteTeamMember(email, roleId);
      if (res.success) {
        toast.success(t('settings.team.inviteSent', 'Invitation sent successfully.'));
        setOpen(false);
        setEmail('');
        setRoleId('');
      } else {
        toast.error(res.error || t('common.error', 'An error occurred.'));
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 border-l border-primary/10 flex flex-col">
        <SheetHeader className="p-8 bg-primary/5 space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <SheetTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
            {t('settings.team.inviteTitle', 'Invite Member')}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground font-medium">
            {t('settings.team.inviteDesc', 'Send an invitation email to a new team member.')}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleInvite} className="flex-1 flex flex-col p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="invite-email" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                {t('common.email', 'Email Address')}
              </Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-border focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                {t('settings.team.selectRole', 'Select Role')}
              </Label>
              <Select value={roleId} onValueChange={setRoleId} required>
                <SelectTrigger id="invite-role" className="h-12 rounded-xl border-border focus:ring-primary/20">
                  <SelectValue placeholder={t('settings.team.rolePlaceholder', 'Choose a role')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-primary/10">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id} className="rounded-lg text-xs font-bold py-2.5">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5 opacity-50" />
                        {role.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border flex items-center gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-12 rounded-xl bg-primary text-xs font-black uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
            >
              {isPending ? t('common.sending', 'Sending...') : t('settings.team.sendInvite', 'Send Invitation')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-12 px-6 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
