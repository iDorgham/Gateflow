'use client';

import React, { use } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkspacePageLayout } from '@/components/dashboard/workspace-page-layout';
import { GateAssignmentForm } from '@/components/dashboard/team/gate-assignment-form';
import { GateAssignmentsTable } from '@/components/dashboard/team/gate-assignments-table';

export default function GateAssignmentsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(props.params);
  const { locale } = params;
  const { t } = useTranslation('dashboard');

  return (
    <WorkspacePageLayout
      header={
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('gateAssignments.title', 'Gate Assignments')}
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t(
              'gateAssignments.description',
              'Manage which team members can scan at specific gates.'
            )}
          </p>
        </div>
      }
    >
      <div className="space-y-8 max-w-5xl">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <GateAssignmentForm locale={locale} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <GateAssignmentsTable locale={locale} />
        </section>
      </div>
    </WorkspacePageLayout>
  );
}
