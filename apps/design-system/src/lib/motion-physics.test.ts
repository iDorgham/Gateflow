import {
  resolveMotionForAccessibility,
  REDUCED_MOTION_FALLBACK_TRANSITION,
  type MotionConfig,
  type ReducedMotion,
} from './motion-physics';

const springSpec: MotionConfig = {
  initial: { opacity: 0, x: -40, filter: 'blur(10px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
  transition: { type: 'spring', stiffness: 500, damping: 20, mass: 1 },
  animatableOpacity: 0,
  targetOpacity: 1,
};

describe('motion-physics reduced-motion resolver', () => {
  it('returns the spec verbatim when reduced motion is off', () => {
    const off: ReducedMotion = { enabled: false, source: 'simulator' };
    expect(resolveMotionForAccessibility(springSpec, off)).toBe(springSpec);
  });

  it('collapses physics to a fast linear opacity fade when reduced motion is on', () => {
    const on: ReducedMotion = { enabled: true, source: 'simulator' };
    const resolved = resolveMotionForAccessibility(springSpec, on);

    expect(resolved.transition.type).toBe('tween');
    expect(resolved.transition).toEqual(REDUCED_MOTION_FALLBACK_TRANSITION);
    expect(resolved.transition).not.toEqual(springSpec.transition);
  });

  it('neutralises travel and blur under reduced motion', () => {
    const on: ReducedMotion = { enabled: true, source: 'media' };
    const resolved = resolveMotionForAccessibility(springSpec, on);

    expect(resolved.initial.x).toBe(0);
    expect(resolved.animate.x).toBe(0);
    expect(resolved.initial.filter).toBe('none');
    expect(resolved.animate.filter).toBe('none');
  });

  it('preserves opacity fades (progressive enhancement) under reduced motion', () => {
    const on: ReducedMotion = { enabled: true, source: 'simulator' };
    const resolved = resolveMotionForAccessibility(springSpec, on);
    const t = resolved.transition;

    expect(resolved.initial.opacity).toBe(0);
    expect(resolved.animate.opacity).toBe(1);
    expect(t.type).toBe('tween');
    if (t.type === 'tween') {
      expect(t.duration).toBeLessThanOrEqual(0.15);
    }
  });

  it('fallback transition is slow-safe (max 150ms)', () => {
    expect(REDUCED_MOTION_FALLBACK_TRANSITION.duration).toBeLessThanOrEqual(
      0.15
    );
  });
});
