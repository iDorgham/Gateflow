'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { OrganizationType } from '@gate-access/types';

interface OrganizationContextType {
  orgId: string | null;
  orgType: OrganizationType | null;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const orgId = params?.orgId as string | undefined;
  const [orgType, setOrgType] = useState<OrganizationType | null>(null);
  const [isLoading, setIsLoading] = useState(!!orgId);

  useEffect(() => {
    if (!orgId) {
      setOrgType(null);
      setIsLoading(false);
      return;
    }

    // Fetch org type if orgId changes
    // In a real app, this might come from the auth token or a dedicated API
    // For now, we'll fetch from a minimal API or use a reasonable default
    const fetchOrgData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/organizations/${orgId}/type`);
        if (response.ok) {
          const data = await response.json();
          setOrgType(data.type as OrganizationType);
        }
      } catch (error) {
        console.error('Failed to fetch organization type:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgData();
  }, [orgId]);

  return (
    <OrganizationContext.Provider
      value={{ orgId: orgId || null, orgType, isLoading }}
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
