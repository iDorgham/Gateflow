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
