'use client';

import { useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
} from '@gate-access/ui';
import { 
  Trash2, 
  Clock,
  XCircle,
  Mail
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { revokeInvitation } from '../../../app/[locale]/dashboard/settings/team/actions';

interface Role {
  id: string;
  name: string;
}

interface Invitation {
  id: string;
  email: string;
  role: Role;
  expiresAt: string | Date;
  createdAt: string | Date;
}

interface InvitationListProps {
  invitations: Invitation[];
}

export function InvitationList({ invitations }: InvitationListProps) {
  const { t } = useTranslation('dashboard');
  const [isPending, startTransition] = useTransition();

  const handleRevoke = async (id: string) => {
    if (!confirm(t('settings.team.revokeInviteConfirm', 'Are you sure you want to revoke this invitation?'))) return;

    startTransition(async () => {
      const res = await revokeInvitation(id);
      if (res.success) {
        toast.success(t('settings.team.inviteRevoked', 'Invitation revoked successfully.'));
      } else {
        toast.error(res.error || t('common.error', 'An error occurred.'));
      }
    });
  };

  const isExpired = (expiresAt: string | Date) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t('settings.team.email', 'Email Address')}</TableHead>
              <TableHead>{t('settings.team.role', 'Role')}</TableHead>
              <TableHead>{t('settings.team.status', 'Status')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">
                  {t('settings.team.noInvitations', 'No pending invitations.')}
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invite) => (
                <TableRow key={invite.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-bold text-sm text-foreground">{invite.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-black uppercase tracking-widest text-[10px] px-2 py-0.5 bg-muted/50">
                      {invite.role.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isExpired(invite.expiresAt) ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-destructive">
                        <XCircle className="h-3.5 w-3.5" />
                        {t('settings.team.expired', 'Expired')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                        <Clock className="h-3.5 w-3.5" />
                        {t('settings.team.pending', 'Pending')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      onClick={() => handleRevoke(invite.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
