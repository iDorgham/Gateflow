'use client';

import React, { use } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus } from 'lucide-react';
import { Button } from '@gateflow/ui';
import { TeamMembersTable } from '@/components/dashboard/team/TeamMembersTable';
import { InviteMemberSheet } from '@/components/settings/team/invite-member-sheet';
import { motion } from 'framer-motion';

interface Role {
  id: string;
  name: string;
}

export default function TeamPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(props.params);

  const { locale } = params;

  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();
  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ['org-roles'],
    queryFn: async () => {
      const res = await fetch('/api/team/roles');
      const json = await res.json();
      return json.data || [];
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 border-b border-[var(--ds-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ds-text)]">
            {t('team.title', 'Team')}
          </h1>
          <p className="text-sm text-[var(--ds-text-subtle)]">
            {t(
              'team.subtitle',
              'Members, roles, and access for this organization.'
            )}
          </p>
        </div>
        <div>
          <InviteMemberSheet
            roles={roles}
            onInvited={() => {
              void queryClient.invalidateQueries({
                queryKey: ['team-members-list'],
              });
            }}
          >
            <Button variant="primary" type="button" className="gap-2">
              <UserPlus className="h-4 w-4" strokeWidth={1.5} />
              {t('team.invite', 'Invite member')}
            </Button>
          </InviteMemberSheet>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <TeamMembersTable locale={locale} />
      </motion.div>
    </div>
  );
}
