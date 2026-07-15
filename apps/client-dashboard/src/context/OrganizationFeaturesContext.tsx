'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { OrganizationType, OrganizationFeatures, getOrganizationFeatures } from '@gate-access/types';

interface OrganizationFeaturesContextType {
  features: OrganizationFeatures;
}

const OrganizationFeaturesContext = createContext<OrganizationFeaturesContextType | undefined>(undefined);

export function OrganizationFeaturesProvider({
  children,
  type,
}: {
  children: React.ReactNode;
  type: OrganizationType | string;
}) {
  const features = useMemo(() => {
    return getOrganizationFeatures(type as OrganizationType);
  }, [type]);

  return (
    <OrganizationFeaturesContext.Provider value={{ features }}>
      {children}
    </OrganizationFeaturesContext.Provider>
  );
}

export function useOrganizationFeatures() {
  const context = useContext(OrganizationFeaturesContext);
  if (context === undefined) {
    // Return REAL_ESTATE as fallback if used outside provider (e.g. during transitions or SSR)
    return getOrganizationFeatures(OrganizationType.REAL_ESTATE);
  }
  return context.features;
}
