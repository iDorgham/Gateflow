/**
 * Pure catalog + planners for the Red Sea demo seed (no Prisma, no hashing).
 * Used by `runDemoRedSeaSeed` and unit tests.
 */

import type { OrganizationType, UnitType } from '@prisma/client';
import {
  CONTACT_NATIONALITIES,
  NATIONALITY_DISPLAY_NAME,
  type ContactNationality,
} from './rich-contact';
import {
  AREA_NATIONALITY_WEIGHT_INTS,
  type RedSeaArea,
} from './red-sea-data';

export const DEMO_PAST_DAYS = 180;
export const DEMO_RANDOM_SEED = 42;
export const SUPER_ADMIN_EMAIL = 'superadmin@gateflow.demo';

export const DEMO_ROLE_KEYS = [
  'admin',
  'security',
  'guard',
  'resident',
] as const;

export type DemoRoleKey = (typeof DEMO_ROLE_KEYS)[number];

export type DemoOrgSpec = {
  /** Organization.email — matches legacy-dev-seed upserts. */
  orgEmail: string;
  name: string;
  type: OrganizationType;
  /** Email domain for role logins (`admin@${emailDomain}`). */
  emailDomain: string;
  area: RedSeaArea;
  rushScenario:
    | 'luxury-compound'
    | 'nightclub'
    | 'private-school'
    | 'wedding-venue';
  scanTarget: number;
  contactJobTitle: string;
};

export const DEMO_ORG_SPECS: readonly DemoOrgSpec[] = [
  {
    orgEmail: 'admin@selenadev.com',
    name: 'Selena Development',
    type: 'REAL_ESTATE',
    emailDomain: 'selenadev.com',
    area: 'HURGHADA',
    rushScenario: 'luxury-compound',
    scanTarget: 2500,
    contactJobTitle: 'Resident',
  },
  {
    orgEmail: 'admin@gateway-school.com',
    name: 'Gateway Academy',
    type: 'SCHOOL',
    emailDomain: 'school.demo',
    area: 'HURGHADA',
    rushScenario: 'private-school',
    scanTarget: 2000,
    contactJobTitle: 'Student',
  },
  {
    orgEmail: 'admin@albatross-club.com',
    name: 'Albatross Country Club',
    type: 'CLUB',
    emailDomain: 'club.demo',
    area: 'EL_GOUNA',
    rushScenario: 'luxury-compound',
    scanTarget: 1500,
    contactJobTitle: 'Member',
  },
  {
    orgEmail: 'admin@nebula-nightclub.com',
    name: 'Nebula Nightclub',
    type: 'NIGHTCLUB',
    emailDomain: 'nightclub.demo',
    area: 'HURGHADA',
    rushScenario: 'nightclub',
    scanTarget: 2500,
    contactJobTitle: 'Guest',
  },
  {
    orgEmail: 'admin@apex-events.com',
    name: 'Apex Event Organizers',
    type: 'EVENT_ORGANISER',
    emailDomain: 'event_organiser.demo',
    area: 'SOMA_BAY',
    rushScenario: 'wedding-venue',
    scanTarget: 1500,
    contactJobTitle: 'Attendee',
  },
];

export type DemoRoleEmails = Record<DemoRoleKey, string>;

/** Stable login emails for built-in roles (globally unique). */
export function demoRoleEmails(emailDomain: string): DemoRoleEmails {
  return {
    admin: `admin@${emailDomain}`,
    security: `security@${emailDomain}`,
    guard: `guard@${emailDomain}`,
    resident: `resident@${emailDomain}`,
  };
}

export function demoRoleEmailMatrix(): Record<string, DemoRoleEmails> {
  const out: Record<string, DemoRoleEmails> = {};
  for (const spec of DEMO_ORG_SPECS) {
    out[spec.emailDomain] = demoRoleEmails(spec.emailDomain);
  }
  return out;
}

export type DemoRoleProfile = {
  email: string;
  name: string;
  roleKey: Exclude<DemoRoleKey, 'admin'>;
};

/** Display names mix Egyptian staff with Red Sea expat nationalities. */
export function demoStaffProfiles(emailDomain: string): DemoRoleProfile[] {
  const emails = demoRoleEmails(emailDomain);
  const names: Record<string, Record<Exclude<DemoRoleKey, 'admin'>, string>> = {
    'selenadev.com': {
      security: 'Karim Mostafa',
      guard: 'Lukas Weber',
      resident: 'Fatma Hassan',
    },
    'school.demo': {
      security: 'Dina Ibrahim',
      guard: 'Omar Ali',
      resident: 'Mariam El-Sayed',
    },
    'club.demo': {
      security: 'Thomas Fischer',
      guard: 'Hans Mueller',
      resident: 'Sophie Meyer',
    },
    'nightclub.demo': {
      security: 'Ahmed Hassan',
      guard: 'Dmitri Volkov',
      resident: 'Elena Rossi',
    },
    'event_organiser.demo': {
      security: 'James Wilson',
      guard: 'Pieter Bakker',
      resident: 'Layla Farouk',
    },
  };
  const n = names[emailDomain];
  if (!n) {
    return [
      { email: emails.security, name: 'Security Manager', roleKey: 'security' },
      { email: emails.guard, name: 'Gate Operator', roleKey: 'guard' },
      { email: emails.resident, name: 'Resident User', roleKey: 'resident' },
    ];
  }
  return [
    { email: emails.security, name: n.security, roleKey: 'security' },
    { email: emails.guard, name: n.guard, roleKey: 'guard' },
    { email: emails.resident, name: n.resident, roleKey: 'resident' },
  ];
}

export type SelenaProjectSpec = {
  stableId: string;
  name: string;
  location: string;
  area: RedSeaArea;
  unitPrefix: string;
  unitTarget: number;
  contactTarget: number;
  gateNames: readonly string[];
};

export const SELENA_PROJECT_SPECS: readonly SelenaProjectSpec[] = [
  {
    stableId: 'proj-selena-bay',
    name: 'Selena Bay',
    location: 'Hurghada, Red Sea',
    area: 'HURGHADA',
    unitPrefix: 'SB',
    unitTarget: 80,
    contactTarget: 80,
    gateNames: ['Main Gate'],
  },
  {
    stableId: 'proj-vernada',
    name: 'Vernada',
    location: 'Sahl Hasheesh, Red Sea',
    area: 'SAHL_HASHEESH',
    unitPrefix: 'VN',
    unitTarget: 80,
    contactTarget: 80,
    gateNames: ['Main Gate', 'East Gate'],
  },
  {
    stableId: 'proj-el-gouna',
    name: 'El Gouna Residences',
    location: 'El Gouna, Red Sea',
    area: 'EL_GOUNA',
    unitPrefix: 'GN',
    unitTarget: 100,
    contactTarget: 100,
    gateNames: ['Main Gate', 'Marina Gate'],
  },
  {
    stableId: 'proj-soma-bay',
    name: 'Soma Bay Villas',
    location: 'Soma Bay, Red Sea',
    area: 'SOMA_BAY',
    unitPrefix: 'SM',
    unitTarget: 80,
    contactTarget: 80,
    gateNames: ['Main Gate', 'Beach Gate'],
  },
];

const CLASSROOM_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function planClassroomNames(count: number): string[] {
  const names: string[] = [];
  let grade = 1;
  let letterIdx = 0;
  while (names.length < count) {
    names.push(`Classroom ${grade}${CLASSROOM_LETTERS[letterIdx]!}`);
    letterIdx += 1;
    if (letterIdx >= CLASSROOM_LETTERS.length) {
      letterIdx = 0;
      grade += 1;
    }
  }
  return names;
}

export function planClubZoneNames(): string[] {
  return [
    'Tennis Court 1',
    'Tennis Court 2',
    'Golf Lounge',
    'Pool Deck',
    'Spa',
    'Kids Club',
    'Beach Club',
    'Locker Room',
  ];
}

export function planNightclubZoneNames(): string[] {
  return [
    'VIP Table 1',
    'VIP Table 2',
    'VIP Table 3',
    'VIP Table 4',
    'VIP Table 5',
    'VIP Table 6',
    'Main Floor',
    'Bar Section',
    'DJ Booth',
    'Terrace',
  ];
}

export function planEventZoneNames(): string[] {
  return [
    'Booth 1',
    'Booth 2',
    'Booth 3',
    'Booth 4',
    'Booth 5',
    'Booth 6',
    'Hall A',
    'Stage A',
  ];
}

export function planRealEstateUnitNames(
  prefix: string,
  count: number,
  perBuilding = 20
): string[] {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const building = Math.floor(i / perBuilding) + 1;
    const slot = (i % perBuilding) + 101;
    names.push(`${prefix}-B${building}-${slot}`);
  }
  return names;
}

export function planVerticalUnitNames(type: OrganizationType): string[] {
  switch (type) {
    case 'SCHOOL':
      return planClassroomNames(12);
    case 'CLUB':
      return planClubZoneNames();
    case 'NIGHTCLUB':
      return planNightclubZoneNames();
    case 'EVENT_ORGANISER':
      return planEventZoneNames();
    case 'REAL_ESTATE':
      return [];
    default: {
      const _e: never = type;
      return _e;
    }
  }
}

export function contactsPerVerticalUnit(type: OrganizationType): number {
  switch (type) {
    case 'SCHOOL':
      return 18;
    case 'CLUB':
      return 18;
    case 'NIGHTCLUB':
      return 20;
    case 'EVENT_ORGANISER':
      return 12;
    case 'REAL_ESTATE':
      return 1;
    default: {
      const _e: never = type;
      return _e;
    }
  }
}

const REAL_ESTATE_UNIT_TYPES: readonly UnitType[] = [
  'STUDIO',
  'ONE_BR',
  'TWO_BR',
  'THREE_BR',
  'FOUR_BR',
  'VILLA',
  'PENTHOUSE',
];

export function unitTypeForVertical(
  type: OrganizationType,
  index: number
): UnitType {
  if (type === 'REAL_ESTATE') {
    return REAL_ESTATE_UNIT_TYPES[index % REAL_ESTATE_UNIT_TYPES.length]!;
  }
  return 'COMMERCIAL';
}

/**
 * Spread timestamps across `[now - pastDays, now]`. Index 0 is oldest.
 */
export function spreadCreatedAt(
  index: number,
  total: number,
  pastDays: number,
  now: Date
): Date {
  if (total <= 1) {
    return new Date(now.getTime() - pastDays * 24 * 60 * 60 * 1000);
  }
  const t = index / (total - 1);
  const ms = (1 - t) * pastDays * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() - ms);
}

export function shouldSkipEmulation(
  existingScans: number,
  target: number
): boolean {
  return existingScans >= target;
}

export function nationalityNotes(nationality: ContactNationality): string {
  return `Nationality: ${NATIONALITY_DISPLAY_NAME[nationality]}`;
}

/** Complete weight map so unused nationalities do not inherit the global default. */
export function areaNationalityWeights(
  area: RedSeaArea
): Partial<Record<ContactNationality, number>> {
  const raw = AREA_NATIONALITY_WEIGHT_INTS[area];
  const out: Partial<Record<ContactNationality, number>> = {};
  for (const n of CONTACT_NATIONALITIES) {
    const w = raw[n];
    out[n] = w != null && w > 0 ? w : 1;
  }
  return out;
}

export function countNationalities(
  samples: readonly ContactNationality[]
): Record<ContactNationality, number> {
  const counts = {} as Record<ContactNationality, number>;
  for (const n of CONTACT_NATIONALITIES) counts[n] = 0;
  for (const s of samples) counts[s] += 1;
  return counts;
}

export function shareOf(
  counts: Record<ContactNationality, number>,
  keys: readonly ContactNationality[]
): number {
  const total = CONTACT_NATIONALITIES.reduce((s, n) => s + counts[n], 0);
  if (total === 0) return 0;
  const part = keys.reduce((s, k) => s + counts[k], 0);
  return part / total;
}
