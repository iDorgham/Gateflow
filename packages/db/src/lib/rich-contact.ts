/**
 * Rich synthetic contacts for advanced seeding — nationality-weighted names, phones, emails.
 * All emails use `@example.com`; phones are fictional E.164-style strings. No real PII.
 */

import {
  EGYPTIAN_FIRST_NAMES,
  EGYPTIAN_LAST_NAMES,
  mulberry32,
  pickRandom,
  pickWeighted,
  RED_SEA_COMPOUND_NAMES,
} from './red-sea-data';
import type { UniquenessBucket } from './seed-integrity';
import { UniquenessViolationError, validateUniqueness } from './seed-integrity';

/** ≥14 nationalities for Red Sea / Hurghada compound demographics (IDEA v3 baseline). */
export type ContactNationality =
  | 'EGYPTIAN'
  | 'GERMAN'
  | 'RUSSIAN'
  | 'BRITISH'
  | 'FRENCH'
  | 'ITALIAN'
  | 'POLISH'
  | 'UKRAINIAN'
  | 'SAUDI'
  | 'EMIRATI'
  | 'AMERICAN'
  | 'CANADIAN'
  | 'GREEK'
  | 'DUTCH';

export const CONTACT_NATIONALITIES: readonly ContactNationality[] = [
  'EGYPTIAN',
  'GERMAN',
  'RUSSIAN',
  'BRITISH',
  'FRENCH',
  'ITALIAN',
  'POLISH',
  'UKRAINIAN',
  'SAUDI',
  'EMIRATI',
  'AMERICAN',
  'CANADIAN',
  'GREEK',
  'DUTCH',
] as const;

/** Human-readable labels (CRM / logs). */
export const NATIONALITY_DISPLAY_NAME: Record<ContactNationality, string> = {
  EGYPTIAN: 'Egyptian',
  GERMAN: 'German',
  RUSSIAN: 'Russian',
  BRITISH: 'British',
  FRENCH: 'French',
  ITALIAN: 'Italian',
  POLISH: 'Polish',
  UKRAINIAN: 'Ukrainian',
  SAUDI: 'Saudi',
  EMIRATI: 'Emirati',
  AMERICAN: 'American',
  CANADIAN: 'Canadian',
  GREEK: 'Greek',
  DUTCH: 'Dutch',
};

/**
 * Integer weights (sum 1000) matching IDEA v3: Egyptian ~45%, German ~17%, Russian ~15%,
 * remainder spread across 11 nationalities (~2.1% each, Dutch 2.0%).
 */
export const DEFAULT_NATIONALITY_WEIGHT_INTS: Record<
  ContactNationality,
  number
> = {
  EGYPTIAN: 450,
  GERMAN: 170,
  RUSSIAN: 150,
  BRITISH: 21,
  FRENCH: 21,
  ITALIAN: 21,
  POLISH: 21,
  UKRAINIAN: 21,
  SAUDI: 21,
  EMIRATI: 21,
  AMERICAN: 21,
  CANADIAN: 21,
  GREEK: 21,
  DUTCH: 20,
};

/** Normalized weights (sum 1.0). */
export function normalizeNationalityWeights(
  partial?: Partial<Record<ContactNationality, number>>
): Record<ContactNationality, number> {
  const base = { ...DEFAULT_NATIONALITY_WEIGHT_INTS };
  if (partial) {
    for (const k of CONTACT_NATIONALITIES) {
      const o = partial[k];
      if (o != null && o > 0) base[k] = o;
    }
  }
  const total = CONTACT_NATIONALITIES.reduce((s, n) => s + base[n], 0);
  if (total <= 0) {
    throw new Error(
      'normalizeNationalityWeights: total weight must be positive'
    );
  }
  const out = {} as Record<ContactNationality, number>;
  for (const n of CONTACT_NATIONALITIES) {
    out[n] = base[n] / total;
  }
  return out;
}

export const DEFAULT_NATIONALITY_WEIGHTS = normalizeNationalityWeights();

export function sampleNationality(
  rng: () => number,
  weights: Readonly<Record<ContactNationality, number>>
): ContactNationality {
  const choices = CONTACT_NATIONALITIES.map((n) => ({
    value: n,
    weight: weights[n] ?? 0,
  }));
  return pickWeighted(choices, rng);
}

function digits(rng: () => number, len: number): string {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += Math.floor(rng() * 10).toString();
  }
  return s;
}

function slugPart(s: string): string {
  const t = s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 24);
  return t.length > 0 ? t : 'user';
}

/** Deterministic mix for per-row RNG (seed + sequence). */
export function contactRngSeed(seed: number, sequence: number): number {
  return Math.imul(seed ^ sequence, 2654435761) >>> 0;
}

const GERMAN_FIRST = [
  'Lukas',
  'Emma',
  'Felix',
  'Hannah',
  'Jonas',
  'Mia',
  'Leon',
  'Sophia',
] as const;
const GERMAN_LAST = [
  'Mueller',
  'Schmidt',
  'Schneider',
  'Fischer',
  'Weber',
  'Meyer',
  'Wagner',
  'Becker',
] as const;

const RUSSIAN_FIRST = [
  'Ivan',
  'Anna',
  'Dmitri',
  'Elena',
  'Sergey',
  'Olga',
  'Alexey',
  'Natasha',
] as const;
const RUSSIAN_LAST = [
  'Ivanov',
  'Smirnov',
  'Kuznetsov',
  'Popov',
  'Sokolov',
  'Volkov',
  'Morozov',
  'Pavlov',
] as const;

const BRITISH_FIRST = [
  'James',
  'Emily',
  'Oliver',
  'Charlotte',
  'Harry',
  'Amelia',
  'George',
  'Lucy',
] as const;
const BRITISH_LAST = [
  'Smith',
  'Jones',
  'Williams',
  'Brown',
  'Taylor',
  'Davies',
  'Wilson',
  'Evans',
] as const;

const FRENCH_FIRST = [
  'Louis',
  'Camille',
  'Hugo',
  'Chloe',
  'Gabriel',
  'Lea',
  'Jules',
  'Manon',
] as const;
const FRENCH_LAST = [
  'Martin',
  'Bernard',
  'Dubois',
  'Thomas',
  'Robert',
  'Richard',
  'Petit',
  'Durand',
] as const;

const ITALIAN_FIRST = [
  'Marco',
  'Giulia',
  'Luca',
  'Francesca',
  'Andrea',
  'Sofia',
  'Matteo',
  'Chiara',
] as const;
const ITALIAN_LAST = [
  'Rossi',
  'Russo',
  'Ferrari',
  'Esposito',
  'Bianchi',
  'Romano',
  'Colombo',
  'Ricci',
] as const;

const POLISH_FIRST = [
  'Jakub',
  'Zuzanna',
  'Kacper',
  'Julia',
  'Mikolaj',
  'Natalia',
  'Filip',
  'Wiktoria',
] as const;
const POLISH_LAST = [
  'Nowak',
  'Kowalski',
  'Wisniewski',
  'Wojcik',
  'Kowalczyk',
  'Kaminski',
  'Lewandowski',
  'Zielinski',
] as const;

const UKRAINIAN_FIRST = [
  'Oleksandr',
  'Oksana',
  'Andriy',
  'Iryna',
  'Serhiy',
  'Yulia',
  'Mykola',
  'Tetiana',
] as const;
const UKRAINIAN_LAST = [
  'Shevchenko',
  'Bondarenko',
  'Kovalenko',
  'Tkachenko',
  'Moroz',
  'Lysenko',
  'Rudenko',
  'Savchenko',
] as const;

const SAUDI_FIRST = [
  'Faisal',
  'Nora',
  'Khalid',
  'Reem',
  'Sultan',
  'Hessa',
  'Turki',
  'Lama',
] as const;
const SAUDI_LAST = [
  'Al Saud',
  'Al Rashid',
  'Al Mutairi',
  'Al Qahtani',
  'Al Harbi',
  'Al Ghamdi',
  'Al Otaibi',
  'Al Shehri',
] as const;

const EMIRATI_FIRST = [
  'Mohammed',
  'Fatima',
  'Saeed',
  'Maryam',
  'Hamdan',
  'Shamma',
  'Rashid',
  'Maitha',
] as const;
const EMIRATI_LAST = [
  'Al Maktoum',
  'Al Nahyan',
  'Al Falasi',
  'Al Suwaidi',
  'Al Mansoori',
  'Al Kaabi',
  'Al Shamsi',
  'Al Blooshi',
] as const;

const AMERICAN_FIRST = [
  'Michael',
  'Jessica',
  'David',
  'Ashley',
  'Chris',
  'Amanda',
  'Daniel',
  'Nicole',
] as const;
const AMERICAN_LAST = [
  'Johnson',
  'Miller',
  'Davis',
  'Garcia',
  'Rodriguez',
  'Martinez',
  'Lee',
  'Walker',
] as const;

const CANADIAN_FIRST = [
  'Ethan',
  'Olivia',
  'Noah',
  'Emma',
  'Liam',
  'Sophie',
  'William',
  'Isabella',
] as const;
const CANADIAN_LAST = [
  'Tremblay',
  'Gagnon',
  'Roy',
  'Cote',
  'Bouchard',
  'Pelletier',
  'Lavoie',
  'Morin',
] as const;

const GREEK_FIRST = [
  'Nikos',
  'Eleni',
  'Giorgos',
  'Maria',
  'Dimitris',
  'Katerina',
  'Kostas',
  'Sofia',
] as const;
const GREEK_LAST = [
  'Papadopoulos',
  'Georgiou',
  'Nikolaou',
  'Vlachos',
  'Petrou',
  'Ioannidis',
  'Alexiou',
  'Dimitriou',
] as const;

const DUTCH_FIRST = [
  'Daan',
  'Emma',
  'Sem',
  'Sophie',
  'Lucas',
  'Julia',
  'Finn',
  'Eva',
] as const;
const DUTCH_LAST = [
  'De Jong',
  'Jansen',
  'De Vries',
  'Van den Berg',
  'Van Dijk',
  'Bakker',
  'Janssen',
  'Visser',
] as const;

type Pool = { first: readonly string[]; last: readonly string[] };

const NAME_POOLS: Record<ContactNationality, Pool> = {
  EGYPTIAN: { first: EGYPTIAN_FIRST_NAMES, last: EGYPTIAN_LAST_NAMES },
  GERMAN: { first: GERMAN_FIRST, last: GERMAN_LAST },
  RUSSIAN: { first: RUSSIAN_FIRST, last: RUSSIAN_LAST },
  BRITISH: { first: BRITISH_FIRST, last: BRITISH_LAST },
  FRENCH: { first: FRENCH_FIRST, last: FRENCH_LAST },
  ITALIAN: { first: ITALIAN_FIRST, last: ITALIAN_LAST },
  POLISH: { first: POLISH_FIRST, last: POLISH_LAST },
  UKRAINIAN: { first: UKRAINIAN_FIRST, last: UKRAINIAN_LAST },
  SAUDI: { first: SAUDI_FIRST, last: SAUDI_LAST },
  EMIRATI: { first: EMIRATI_FIRST, last: EMIRATI_LAST },
  AMERICAN: { first: AMERICAN_FIRST, last: AMERICAN_LAST },
  CANADIAN: { first: CANADIAN_FIRST, last: CANADIAN_LAST },
  GREEK: { first: GREEK_FIRST, last: GREEK_LAST },
  DUTCH: { first: DUTCH_FIRST, last: DUTCH_LAST },
};

const JOB_TITLES = [
  'Property Manager',
  'Sales Director',
  'Facilities Coordinator',
  'Community Host',
  'Leasing Consultant',
  'Hospitality Lead',
  'Security Supervisor',
  'Operations Analyst',
] as const;

const COMPANY_SUFFIXES = [
  'Red Sea Holdings',
  'Coastal Estates',
  'Marina Developments',
  'Resort Services Ltd',
  'Compound Management',
  'Hospitality Group',
] as const;

function syntheticPhone(
  nationality: ContactNationality,
  rng: () => number
): string {
  switch (nationality) {
    case 'EGYPTIAN':
      return `+2010${digits(rng, 8)}`;
    case 'GERMAN':
      return `+4915${digits(rng, 9)}`;
    case 'RUSSIAN':
      return `+79${digits(rng, 9)}`;
    case 'BRITISH':
      return `+447${digits(rng, 9)}`;
    case 'FRENCH':
      return `+336${digits(rng, 8)}`;
    case 'ITALIAN':
      return `+393${digits(rng, 9)}`;
    case 'POLISH':
      return `+485${digits(rng, 8)}`;
    case 'UKRAINIAN':
      return `+3809${digits(rng, 8)}`;
    case 'SAUDI':
      return `+9665${digits(rng, 8)}`;
    case 'EMIRATI':
      return `+9715${digits(rng, 8)}`;
    case 'AMERICAN':
      return `+1202${digits(rng, 7)}`;
    case 'CANADIAN':
      return `+1403${digits(rng, 7)}`;
    case 'GREEK':
      return `+3069${digits(rng, 8)}`;
    case 'DUTCH':
      return `+316${digits(rng, 8)}`;
    default: {
      const _e: never = nationality;
      return _e;
    }
  }
}

export type RichContactPayload = {
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  /** Seeding metadata (map into analytics or a future `Contact` column). */
  nationality: ContactNationality;
};

export type GenerateRichContactInput = {
  organizationId: string;
  /** Master seed for reproducible batches (e.g. `42`). */
  seed: number;
  /** Monotonic index within the batch — drives unique email/phone suffixes. */
  sequence: number;
  bucket: UniquenessBucket;
  nationalityWeights?: Partial<Record<ContactNationality, number>>;
};

/**
 * Build one synthetic contact, register email/phone in `bucket`, return CRM-shaped fields.
 * Throws {@link UniquenessViolationError} if the bucket already contains the same email/phone for the org.
 */
export function generateRichContact(
  input: GenerateRichContactInput
): RichContactPayload {
  const { organizationId, seed, sequence, bucket } = input;
  if (!organizationId?.trim()) {
    throw new Error('generateRichContact: organizationId is required');
  }

  const weights = normalizeNationalityWeights(input.nationalityWeights);
  const rng = mulberry32(contactRngSeed(seed, sequence));

  const nationality = sampleNationality(rng, weights);
  const pool = NAME_POOLS[nationality];
  const firstName = pickRandom(pool.first, rng);
  const lastName = pickRandom(pool.last, rng);

  const fn = slugPart(firstName);
  const ln = slugPart(lastName);
  const email = `${fn}.${ln}.${sequence}@example.com`;

  let phone = syntheticPhone(nationality, rng);
  let tries = 0;
  while (tries < 12) {
    try {
      validateUniqueness(bucket, {
        organizationId,
        email,
        phone,
      });
      break;
    } catch (e) {
      if (e instanceof UniquenessViolationError && tries < 11) {
        phone = syntheticPhone(nationality, rng);
        tries++;
        continue;
      }
      throw e;
    }
  }

  const jobTitle = pickRandom(JOB_TITLES, rng);
  const compound = pickRandom(RED_SEA_COMPOUND_NAMES, rng);
  const suffix = pickRandom(COMPANY_SUFFIXES, rng);
  const company = `${compound} ${suffix}`;

  return {
    organizationId,
    firstName,
    lastName,
    email,
    phone,
    jobTitle,
    company,
    nationality,
  };
}
