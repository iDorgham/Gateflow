'use client';

import React, { createContext, useContext } from 'react';

export type Organization = {
  id: string;
  name: string;
  type: string;
  plan: string | null;
};

type OrganizationContextType = {
  organization: Organization | null;
  orgId: string | null;
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({
  children,
  organization,
}: {
  children: React.ReactNode;
  organization: Organization | null;
}) {
  return (
    <OrganizationContext.Provider
      value={{ organization, orgId: organization?.id ?? null }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider'
    );
  }
  return context;
}
