import React from 'react';
import { SettingsLayout } from '@/components/settings/settings-layout';
import { requireAuth } from '@/lib/dashboard-auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { claims, org } = await requireAuth();

  return (
    <SettingsLayout
      permissions={claims.permissions as Record<string, boolean>}
      orgName={org?.name}
    >
      {children}
    </SettingsLayout>
  );
}
