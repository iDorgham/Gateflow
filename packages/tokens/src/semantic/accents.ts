/**
 * @gateflow/tokens - Semantic: Accent Profiles (Tier 2 Semantic)
 * Switchable Primary Brand Accent: Kimchi (Default), Cobalt, Emerald.
 */

import { primitiveColors } from '../foundations/colors';

export type AccentProfile = 'kimchi' | 'cobalt' | 'emerald';

export const accentProfiles = {
  kimchi: {
    name: 'Kimchi Vermilion',
    primary: primitiveColors.kimchi[500],
    primaryHover: primitiveColors.kimchi[600],
    primaryDarkHover: primitiveColors.kimchi[400],
    primarySubtleLight: primitiveColors.kimchi[50],
    primarySubtleDark: primitiveColors.kimchi[900],
    ring: primitiveColors.kimchi[500],
  },
  cobalt: {
    name: 'Electric Cobalt',
    primary: primitiveColors.cobalt[500],
    primaryHover: primitiveColors.cobalt[600],
    primaryDarkHover: primitiveColors.cobalt[400],
    primarySubtleLight: primitiveColors.cobalt[50],
    primarySubtleDark: primitiveColors.cobalt[900],
    ring: primitiveColors.cobalt[500],
  },
  emerald: {
    name: 'Emerald Forest',
    primary: primitiveColors.emerald[500],
    primaryHover: primitiveColors.emerald[600],
    primaryDarkHover: primitiveColors.emerald[400],
    primarySubtleLight: primitiveColors.emerald[50],
    primarySubtleDark: primitiveColors.emerald[900],
    ring: primitiveColors.emerald[500],
  },
} as const;
