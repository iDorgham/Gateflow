import { requireAuth } from '@/lib/dashboard-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gateflow/ui';
import { TeamRoster } from '@/components/settings/team/team-roster';
import { InvitationList } from '@/components/settings/team/invitation-list';
import { RoleDashboard } from '@/components/settings/team/role-dashboard';
import { ActivityLogList } from '@/components/settings/team/activity-log-list';
import { GateAssignmentManager } from '@/components/settings/team/gate-assignment-manager';
import {
  getTeamMembers,
  getInvitations,
  getRoles,
  getActivityLogs,
  getGateAssignments,
  getGates,
} from './actions';
import { Users, Mail, ShieldCheck, History, ShieldAlert } from 'lucide-react';

export default async function TeamSettings() {
  const { user, claims } = await requireAuth();

  if (!user) return null;

  const [
    membersResult,
    invitationsResult,
    rolesResult,
    logsResult,
    assignmentsResult,
    gatesResult,
  ] = await Promise.all([
    getTeamMembers(),
    getInvitations(),
    getRoles(),
    getActivityLogs(),
    getGateAssignments(),
    getGates(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const members = (membersResult.data ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invitations = (invitationsResult.data ?? []) as any[];
  const roles = rolesResult.data ?? [];
  const logs = logsResult.data ?? [];
  const assignments = assignmentsResult.data ?? [];
  const gates = gatesResult.data ?? [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl w-fit h-auto flex-wrap sm:flex-nowrap">
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
              <span className="ml-1 text-[10px] font-black bg-warning/10 text-warning rounded-full px-1.5 py-0.5">
                {invitations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="roles"
            className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4"
          >
            <ShieldCheck className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger
            value="assignments"
            className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4"
          >
            <ShieldAlert className="h-4 w-4" />
            Gate Access
            {assignments.length > 0 && (
              <span className="ml-1 text-[10px] font-black bg-warning/10 text-warning rounded-full px-1.5 py-0.5">
                {assignments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4"
          >
            <History className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <TeamRoster users={members} roles={roles} currentUserId={user.id} />
        </TabsContent>

        <TabsContent value="invitations">
          <InvitationList invitations={invitations} />
        </TabsContent>

        <TabsContent value="roles">
          <RoleDashboard
            roles={roles}
            canManageRoles={!!claims.permissions?.['roles:manage']}
          />
        </TabsContent>

        <TabsContent value="assignments">
          <GateAssignmentManager
            assignments={assignments}
            users={members}
            gates={gates}
          />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLogList logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
