'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { OrganizationType } from '@gate-access/types';

// We may define a minimal Organization type locally or import it.
export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  plan?: string;
  logoUrl?: string;
}

interface OrganizationContextType {
  orgId: string | null;
  org: Organization | null;
  orgType: OrganizationType | null;
  setOrgId: (id: string) => void;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({
  children,
  orgId: propsOrgId,
}: {
  children: React.ReactNode;
  orgId?: string; // Optional prop to force an org ID (used in nested layouts)
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL param takes precedence, then props, then state
  const urlOrgId = params?.orgId as string | undefined;

  const [activeOrgId, setActiveOrgId] = useState<string | null>(
    urlOrgId || propsOrgId || null
  );
  const [org, setOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state with localStorage on mount
  useEffect(() => {
    if (!activeOrgId && typeof window !== 'undefined') {
      const saved = localStorage.getItem('gateflow_selected_org');
      if (saved) {
        setActiveOrgId(saved);
      }
    }
  }, [activeOrgId]);

  // Sync URL params to state & localStorage
  useEffect(() => {
    if (urlOrgId && urlOrgId !== activeOrgId) {
      setActiveOrgId(urlOrgId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gateflow_selected_org', urlOrgId);
      }
    }
  }, [urlOrgId, activeOrgId]);

  // Fetch org data when activeOrgId changes
  useEffect(() => {
    if (!activeOrgId) {
      setOrg(null);
      return;
    }

    const fetchOrgData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/organizations/${activeOrgId}`);
        if (response.ok) {
          const data = await response.json();
          // Assume the API returns { organization: { ... } } or similar based on prompt
          setOrg(data.organization || data);
        } else {
          // If the org doesn't exist or isn't accessible, clear it
          if (response.status === 404 || response.status === 403) {
            setOrg(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch organization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgData();
  }, [activeOrgId]);

  const setOrgId = useCallback((id: string) => {
    setActiveOrgId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gateflow_selected_org', id);
    }
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        orgId: activeOrgId,
        org,
        orgType: org?.type || null,
        setOrgId,
        isLoading,
      }}
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
