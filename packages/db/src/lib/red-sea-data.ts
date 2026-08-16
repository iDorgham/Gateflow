/**
 * Static Red Sea / Hurghada flavor data and reproducible random helpers for advanced seeding.
 * No secrets or PII — display names and geography labels only.
 */

/** Luxury compound–style project names (Hurghada / Red Sea). */
export const RED_SEA_COMPOUND_NAMES = [
  'Selena Bay',
  'Vernada Beach',
  'RedSea Pearl',
  'Coral Ridge',
  'Lagoon View',
  'Marina Heights',
  'Azure Coast',
] as const;

/** Neighborhood / resort area labels for UI copy and seed descriptions. */
export const HURGHADA_AREA_LABELS = [
  'Sahl Hasheesh',
  'El Gouna',
  'Makadi Bay',
  'Soma Bay',
  'Hurghada Marina',
  'Arabia Azur',
  'Giftun View',
] as const;

/** Red Sea resort areas used by the demo seed (Hurghada metro + nearby compounds). */
export const RED_SEA_AREAS = [
  'HURGHADA',
  'SAHL_HASHEESH',
  'EL_GOUNA',
  'SOMA_BAY',
] as const;

export type RedSeaArea = (typeof RED_SEA_AREAS)[number];

/**
 * Integer nationality weights keyed by `ContactNationality` (see rich-contact.ts).
 * Each map lists all 14 nationalities so `normalizeNationalityWeights` does not
 * fall back to the global default mix.
 *
 * Hurghada: Egyptian-heavy + Russian/German holiday-home mix.
 * Sahl Hasheesh: more even Egyptian / Northern European / Russian mix.
 * El Gouna: German/British/Dutch expats with a large Egyptian workforce.
 * Soma Bay: golf/kitesurf crowd — German/British/Dutch + Egyptian.
 */
export const AREA_NATIONALITY_WEIGHT_INTS: Record<
  RedSeaArea,
  Record<string, number>
> = {
  HURGHADA: {
    EGYPTIAN: 600,
    RUSSIAN: 160,
    GERMAN: 120,
    BRITISH: 30,
    ITALIAN: 20,
    POLISH: 20,
    UKRAINIAN: 20,
    FRENCH: 10,
    DUTCH: 10,
    SAUDI: 5,
    EMIRATI: 3,
    AMERICAN: 1,
    CANADIAN: 1,
    GREEK: 1,
  },
  SAHL_HASHEESH: {
    EGYPTIAN: 500,
    GERMAN: 140,
    BRITISH: 90,
    RUSSIAN: 90,
    ITALIAN: 50,
    POLISH: 30,
    UKRAINIAN: 25,
    FRENCH: 20,
    DUTCH: 20,
    SAUDI: 15,
    EMIRATI: 10,
    AMERICAN: 5,
    CANADIAN: 3,
    GREEK: 2,
  },
  EL_GOUNA: {
    EGYPTIAN: 340,
    GERMAN: 250,
    BRITISH: 140,
    DUTCH: 80,
    FRENCH: 50,
    ITALIAN: 40,
    RUSSIAN: 30,
    POLISH: 20,
    UKRAINIAN: 15,
    AMERICAN: 10,
    CANADIAN: 8,
    GREEK: 8,
    SAUDI: 5,
    EMIRATI: 4,
  },
  SOMA_BAY: {
    EGYPTIAN: 360,
    GERMAN: 240,
    BRITISH: 160,
    DUTCH: 90,
    FRENCH: 40,
    ITALIAN: 30,
    RUSSIAN: 25,
    POLISH: 15,
    UKRAINIAN: 12,
    AMERICAN: 10,
    CANADIAN: 8,
    GREEK: 5,
    SAUDI: 3,
    EMIRATI: 2,
  },
};

/** Common Egyptian given names for synthetic residents (public labels only). */
export const EGYPTIAN_FIRST_NAMES = [
  'Ahmed',
  'Mohamed',
  'Fatma',
  'Sara',
  'Omar',
  'Youssef',
  'Nour',
  'Hassan',
  'Mariam',
  'Khaled',
  'Dina',
  'Hana',
  'Karim',
  'Layla',
  'Tarek',
] as const;

export const EGYPTIAN_LAST_NAMES = [
  'Hassan',
  'Ali',
  'Mahmoud',
  'Ibrahim',
  'El-Sayed',
  'Reda',
  'Khalil',
  'Mostafa',
  'Salem',
  'Zaki',
  'Farouk',
  'Nasser',
  'Osman',
] as const;

/** Mulberry32 PRNG — deterministic for a numeric seed (0..2^32-1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRandom<T>(arr: readonly T[], rng: () => number): T {
  if (arr.length === 0) {
    throw new Error('pickRandom: empty array');
  }
  const i = Math.floor(rng() * arr.length);
  return arr[Math.min(i, arr.length - 1)]!;
}

export function pickWeighted<T>(
  choices: readonly { value: T; weight: number }[],
  rng: () => number
): T {
  const positive = choices.filter((c) => c.weight > 0);
  if (positive.length === 0) {
    throw new Error('pickWeighted: no positive weights');
  }
  const total = positive.reduce((s, c) => s + c.weight, 0);
  let r = rng() * total;
  for (const c of positive) {
    r -= c.weight;
    if (r <= 0) return c.value;
  }
  return positive[positive.length - 1]!.value;
}
