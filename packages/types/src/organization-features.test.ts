import { describe, it, expect } from 'vitest';
import { getOrganizationFeatures, ORGANIZATION_FEATURES } from './organization-features';
import { OrganizationType } from './base';

describe('OrganizationFeatures', () => {
  it('should return REAL_ESTATE config by default for unknown types', () => {
    const features = getOrganizationFeatures('UNKNOWN' as any);
    expect(features.type).toBe(OrganizationType.REAL_ESTATE);
    expect(features.terminology.unitLabel).toContain('unitLabel');
  });

  it('should have complete config for all OrganizationType values', () => {
    const types = Object.values(OrganizationType);
    for (const type of types) {
      const features = ORGANIZATION_FEATURES[type];
      expect(features).toBeDefined();
      expect(features.type).toBe(type);
      expect(features.terminology).toBeDefined();
      expect(features.sidebar).toBeDefined();
      expect(features.dashboard).toBeDefined();
      expect(features.flags).toBeDefined();
    }
  });

  it('should have vertical-specific flags for REAL_ESTATE', () => {
    const features = getOrganizationFeatures(OrganizationType.REAL_ESTATE);
    expect(features.flags.maintenanceModule).toBe(true);
    expect(features.flags.rushHourAnalytics).toBe(true);
  });

  it('should have vertical-specific flags for SCHOOL', () => {
    const features = getOrganizationFeatures(OrganizationType.SCHOOL);
    expect(features.flags.attendanceKpis).toBe(true);
    expect(features.flags.maintenanceModule).toBe(false);
  });

  it('should have vertical-specific flags for NIGHTCLUB', () => {
    const features = getOrganizationFeatures(OrganizationType.NIGHTCLUB);
    expect(features.flags.capacityWidgets).toBe(true);
    expect(features.flags.vipListEmphasis).toBe(true);
  });
});
