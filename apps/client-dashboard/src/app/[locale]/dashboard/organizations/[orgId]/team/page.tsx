'use client';

import React, { use } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { Button } from '@gateflow/ui';
import { TeamMembersTable } from '@/components/dashboard/team/TeamMembersTable';
import { motion } from 'framer-motion';

export default function TeamPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(props.params);

  const { locale } = params;

  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ds-text)]">
            {t('team.title', 'Team Management')}
          </h1>
          <p className="text-sm text-[var(--ds-text-subtle)]">
            {t(
              'team.subtitle',
              'Manage your organization members and their access levels.'
            )}
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button variant="primary">
            <UserPlus className="me-2 h-4 w-4" />
            {t('team.invite', 'Invite Member')}
          </Button>
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
