import { buildSidebarNav } from './navigation-builder';
import { OrganizationType, ORGANIZATION_FEATURES } from '@gate-access/types';

const t = (key: string, fallback: string) => fallback;

describe('navigation-builder', () => {
  const mockPermissions = {
    'projects:view': true,
    'qr:view': true,
    'scans:view': true,
    'gates:view': true,
    'users:view': true,
    'analytics:view': true,
    'maintenance:view': true,
    'workspace:manage': true,
    'contacts:manage': true,
    'units:view': true,
  };

  it('should build sidebar nav for REAL_ESTATE with all features', () => {
    const features = ORGANIZATION_FEATURES[OrganizationType.REAL_ESTATE];
    const nav = buildSidebarNav(features, mockPermissions, t as any, false);

    expect(nav).toBeDefined();
    // Real Estate has 3 groups: main, residents, access
    expect(nav.length).toBe(3);

    const accessGroup = nav.find((g) => g.id === 'access');
    expect(accessGroup).toBeDefined();
    expect(accessGroup?.items.some((i) => i.id === 'maintenance')).toBe(true);
  });

  it('should filter out items based on permissions', () => {
    const features = ORGANIZATION_FEATURES[OrganizationType.REAL_ESTATE];
    const restrictedPermissions = {
      ...mockPermissions,
      'maintenance:view': false,
    };
    const nav = buildSidebarNav(
      features,
      restrictedPermissions,
      t as any,
      false
    );

    const accessGroup = nav.find((g) => g.id === 'access');
    expect(accessGroup?.items.some((i) => i.id === 'maintenance')).toBe(false);
  });

  it('should filter out groups if all items are restricted', () => {
    const features = ORGANIZATION_FEATURES[OrganizationType.REAL_ESTATE];
    const restrictedPermissions = {
      ...mockPermissions,
      'contacts:manage': false,
      'units:view': false,
    };
    const nav = buildSidebarNav(
      features,
      restrictedPermissions,
      t as any,
      false
    );

    expect(nav.find((g) => g.id === 'residents')).toBeUndefined();
  });

  it('should include platform group for super admins', () => {
    const features = ORGANIZATION_FEATURES[OrganizationType.REAL_ESTATE];
    const nav = buildSidebarNav(features, mockPermissions, t as any, true);

    expect(nav.some((g) => g.id === 'platform')).toBe(true);
    const platformGroup = nav.find((g) => g.id === 'platform');
    expect(platformGroup?.items[0].id).toBe('emulation');
  });

  it('should apply terminology overrides for Units in SCHOOL', () => {
    const features = ORGANIZATION_FEATURES[OrganizationType.SCHOOL];
    const schoolT = jest.fn((key: string, fallback: string) => {
      if (key === 'orgType:school.unitLabelPlural') return 'Classrooms';
      return fallback;
    });

    const nav = buildSidebarNav(
      features,
      mockPermissions,
      schoolT as any,
      false
    );
    const residentsGroup = nav.find((g) => g.id === 'residents');
    const unitsItem = residentsGroup?.items.find((i) => i.id === 'units');

    expect(unitsItem?.label).toBe('Classrooms');
  });
});
