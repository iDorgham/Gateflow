import { requireAuth } from '@/lib/dashboard-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gateflow/ui';
import { TeamRoster } from '@/components/settings/team/team-roster';
import { InvitationList } from '@/components/settings/team/invitation-list';
import { RoleDashboard } from '@/components/settings/team/role-dashboard';
import { ActivityLogList } from '@/components/settings/team/activity-log-list';
import { GateAssignmentManager } from '@/components/settings/team/gate-assignment-manager';
import { ShiftManager } from '@/components/settings/team/shift-manager';
import {
  getTeamMembers,
  getInvitations,
  getRoles,
  getActivityLogs,
  getGateAssignments,
  getGates,
  getShiftLogs,
} from './actions';
import {
  Users,
  Mail,
  ShieldCheck,
  History,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import {
  SETTINGS_TAB_TRIGGER,
  SETTINGS_TABS_LIST,
} from '@/components/settings/settings-section-header';

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
    shiftsResult,
  ] = await Promise.all([
    getTeamMembers(),
    getInvitations(),
    getRoles(),
    getActivityLogs(),
    getGateAssignments(),
    getGates(),
    getShiftLogs(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const members = (membersResult.data ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invitations = (invitationsResult.data ?? []) as any[];
  const roles = rolesResult.data ?? [];
  const logs = logsResult.data ?? [];
  const assignments = assignmentsResult.data ?? [];
  const gates = gatesResult.data ?? [];
  const shiftLogs = shiftsResult.data ?? [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className={SETTINGS_TABS_LIST}>
          <TabsTrigger value="members" className={SETTINGS_TAB_TRIGGER}>
            <Users className="h-4 w-4" strokeWidth={1.5} />
            Members
            {members.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {members.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="invitations" className={SETTINGS_TAB_TRIGGER}>
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            Invitations
            {invitations.length > 0 && (
              <span className="ml-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                {invitations.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="roles" className={SETTINGS_TAB_TRIGGER}>
            <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
            Roles
          </TabsTrigger>
          <TabsTrigger value="assignments" className={SETTINGS_TAB_TRIGGER}>
            <ShieldAlert className="h-4 w-4" strokeWidth={1.5} />
            Gate Access
            {assignments.length > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {assignments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="shifts" className={SETTINGS_TAB_TRIGGER}>
            <Clock className="h-4 w-4" strokeWidth={1.5} />
            Shifts
          </TabsTrigger>
          <TabsTrigger value="activity" className={SETTINGS_TAB_TRIGGER}>
            <History className="h-4 w-4" strokeWidth={1.5} />
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

        <TabsContent value="shifts">
          <ShiftManager assignments={assignments} logs={shiftLogs} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLogList logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
