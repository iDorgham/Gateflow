export {};

import {
  mulberry32,
  pickRandom,
  pickWeighted,
  RED_SEA_COMPOUND_NAMES,
} from './red-sea-data';

describe('red-sea-data', () => {
  test('mulberry32 is deterministic for a seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  test('pickRandom returns an element', () => {
    const rng = mulberry32(7);
    const x = pickRandom(RED_SEA_COMPOUND_NAMES, rng);
    expect(RED_SEA_COMPOUND_NAMES).toContain(x);
  });

  test('pickWeighted respects weights', () => {
    const rng = () => 0.99; // last bucket
    const v = pickWeighted(
      [
        { value: 'a', weight: 1 },
        { value: 'b', weight: 1 },
        { value: 'c', weight: 98 },
      ],
      rng
    );
    expect(v).toBe('c');
  });
});
