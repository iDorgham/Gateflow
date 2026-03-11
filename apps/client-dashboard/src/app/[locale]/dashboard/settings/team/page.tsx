import { requireAuth } from '@/lib/dashboard-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gate-access/ui';
import { getTeamMembers, getInvitations, getRoles } from './actions';
import { TeamRoster } from '@/components/settings/team/team-roster';
import { InvitationList } from '@/components/settings/team/invitation-list';
import { Users, Mail } from 'lucide-react';

export default async function TeamSettings() {
  const { user } = await requireAuth();

  if (!user) return null;

  const [membersResult, invitationsResult, rolesResult] = await Promise.all([
    getTeamMembers(),
    getInvitations(),
    getRoles(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const members = (membersResult.data ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invitations = (invitationsResult.data ?? []) as any[];
  const roles = rolesResult.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-black uppercase tracking-tight">Team Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage members, assign roles, and control active sessions.
        </p>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-fit h-auto">
          <TabsTrigger
            value="members"
            className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4"
          >
            <Users className="h-4 w-4" />
            Members
            {members.length > 0 && (
              <span className="ml-1 text-[10px] font-black bg-primary/10 text-primary rounded-full px-1.5 py-0.5">
                {members.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="invitations"
            className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4"
          >
            <Mail className="h-4 w-4" />
            Invitations
            {invitations.length > 0 && (
              <span className="ml-1 text-[10px] font-black bg-orange-500/10 text-orange-600 rounded-full px-1.5 py-0.5">
                {invitations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <TeamRoster
            users={members}
            roles={roles}
            currentUserId={user.id}
          />
        </TabsContent>

        <TabsContent value="invitations">
          <InvitationList
            invitations={invitations}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
