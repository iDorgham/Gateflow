import { OrganizationType } from './base';
import {
  filterVisibleTeamRoles,
  formatRoleLabel,
  isTeamRoleVisibleForOrg,
  ORG_TYPE_MEMBER_ROLES,
  PLATFORM_TEAM_ROLES,
  roleSlug,
} from './roles';

describe('roleSlug', () => {
  it('normalizes spaces and aliases to underscore slugs', () => {
    expect(roleSlug('TENANT_ADMIN')).toBe('TENANT_ADMIN');
    expect(roleSlug('School Teacher')).toBe('SCHOOL_TEACHER');
    expect(roleSlug('Organization Admin')).toBe('ORG_ADMIN');
    expect(roleSlug('Gate Operator')).toBe('GATE_OPERATOR');
  });
});

describe('formatRoleLabel', () => {
  it('shows spaced display names', () => {
    expect(formatRoleLabel('TENANT_ADMIN')).toBe('Tenant Admin');
    expect(formatRoleLabel('SCHOOL_TEACHER')).toBe('Teacher');
    expect(formatRoleLabel('Organization Admin')).toBe('Organization Admin');
    expect(formatRoleLabel('Gate Operator')).toBe('Gate Operator');
    expect(formatRoleLabel('Night Shift Lead')).toBe('Night Shift Lead');
  });
});

describe('filterVisibleTeamRoles', () => {
  it('keeps school roles and platform roles, hides other org types', () => {
    const roles = [
      { id: '1', name: 'Organization Admin', organizationId: null },
      { id: '2', name: 'SCHOOL_TEACHER', organizationId: null },
      { id: '3', name: 'NIGHTCLUB_BOUNCER', organizationId: null },
      { id: '4', name: 'SUPER_ADMIN', organizationId: null },
      { id: '5', name: 'Custom Duty', organizationId: 'org_1' },
    ];
    const visible = filterVisibleTeamRoles(roles, OrganizationType.SCHOOL);
    expect(visible.map((role) => role.slug)).toEqual([
      'ORG_ADMIN',
      'SCHOOL_TEACHER',
      'CUSTOM_DUTY',
    ]);
    expect(visible.map((role) => role.name)).toEqual([
      'Organization Admin',
      'Teacher',
      'Custom Duty',
    ]);
  });
});

describe('isTeamRoleVisibleForOrg', () => {
  it('shows platform team roles and hides SUPER_ADMIN', () => {
    expect(
      isTeamRoleVisibleForOrg('TENANT_ADMIN', OrganizationType.SCHOOL)
    ).toBe(true);
    expect(
      isTeamRoleVisibleForOrg('SUPER_ADMIN', OrganizationType.SCHOOL)
    ).toBe(false);
    expect(PLATFORM_TEAM_ROLES).toContain('GATE_OPERATOR');
  });

  it('shows only matching organization-type roles', () => {
    expect(
      isTeamRoleVisibleForOrg('SCHOOL_TEACHER', OrganizationType.SCHOOL)
    ).toBe(true);
    expect(
      isTeamRoleVisibleForOrg('SCHOOL_TEACHER', OrganizationType.NIGHTCLUB)
    ).toBe(false);
    expect(
      isTeamRoleVisibleForOrg('NIGHTCLUB_BOUNCER', OrganizationType.NIGHTCLUB)
    ).toBe(true);
  });

  it('always shows custom organization-scoped roles', () => {
    expect(
      isTeamRoleVisibleForOrg('CUSTOM_ROLE', OrganizationType.SCHOOL, 'org_1')
    ).toBe(true);
  });

  it('defines at least three roles per organization type', () => {
    for (const type of Object.values(OrganizationType)) {
      const count = ORG_TYPE_MEMBER_ROLES.filter(
        (r) => r.orgType === type
      ).length;
      expect(count).toBeGreaterThanOrEqual(3);
    }
  });
});
