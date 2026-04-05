'use client';

import * as React from 'react';
import { Badge, Column, DynamicTable } from '@gate-access/ui';

type RecentOrgRow = {
  id: string;
  name: string;
  email: string | null;
  plan: string | null;
  createdAt: string | Date;
};

export function DashboardRecentOrgsTable({
  recentOrgs,
  locale,
  labels,
}: {
  recentOrgs: RecentOrgRow[];
  locale: string;
  labels: {
    org: string;
    plan: string;
    joined: string;
  };
}) {
  const columns = React.useMemo<Column<RecentOrgRow>[]>(() => {
    return [
      {
        key: 'org',
        label: labels.org,
        render: (org) => (
          <div className="flex flex-col">
            <span className="font-bold text-ds-text">{org.name}</span>
            <span className="text-[11px] text-ds-text-subtle truncate max-w-[200px]">
              {org.email && org.email.toLowerCase() !== 'null'
                ? org.email
                : '—'}
            </span>
          </div>
        ),
      },
      {
        key: 'plan',
        label: labels.plan,
        render: (org) => (
          <Badge
            variant={org.plan === 'PRO' ? 'primary' : 'subtle'}
            className="h-5 px-1.5 font-bold text-[9px]"
          >
            {org.plan}
          </Badge>
        ),
      },
      {
        key: 'joined',
        label: labels.joined,
        align: 'right',
        render: (org) => (
          <span className="text-xs font-medium text-ds-text-subtle">
            {new Date(org.createdAt).toLocaleDateString(locale)}
          </span>
        ),
      },
    ];
  }, [labels.org, labels.plan, labels.joined, locale]);

  return <DynamicTable columns={columns} items={recentOrgs} />;
}
