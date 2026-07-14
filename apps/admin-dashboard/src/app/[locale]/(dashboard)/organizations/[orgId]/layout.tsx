import React from 'react';
import { OrganizationProvider } from '@/providers/organization-provider';
import { OrgNestedNav } from '@/components/organizations/org-nested-nav';

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return (
    <OrganizationProvider orgId={orgId}>
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="w-full md:w-64 shrink-0">
          <OrgNestedNav orgId={orgId} />
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </OrganizationProvider>
  );
}
