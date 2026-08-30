/**
 * @gateflow/tokens - Foundations: Colors (Tier 1 Primitives)
 * Raw OKLCH and Hex palette definitions for GateFlow.
 */

export const primitiveColors = {
  // Porcelain / Satin Neutral Scale (Warm-tinted, OKLCH hue 250/80)
  neutral: {
    0: 'oklch(100% 0 0)',         // #ffffff
    50: 'oklch(98.5% 0.005 250)', // #f8f9fa
    100: 'oklch(96.5% 0.008 250)',// #f1f3f6
    200: 'oklch(92.5% 0.012 250)',// #e2e6eb
    300: 'oklch(86.5% 0.015 250)',// #cbd2db
    400: 'oklch(76% 0.018 250)',  // #a0abbb
    500: 'oklch(62% 0.02 250)',   // #738096
    600: 'oklch(48% 0.022 250)',  // #4d596f
    700: 'oklch(34% 0.02 250)',   // #303949
    800: 'oklch(20% 0.02 250)',   // #212633 (layer-04)
    850: 'oklch(16% 0.018 250)',  // #191d26 (layer-03)
    900: 'oklch(12% 0.015 250)',  // #12151c (layer-02)
    950: 'oklch(8% 0.012 250)',   // #0b0d11 (layer-01)
    1000: 'oklch(0% 0 0)',        // #000000
  },

  // Kimchi Vermilion Brand Core (#ED4B00)
  kimchi: {
    50: 'oklch(96% 0.02 38)',
    100: 'oklch(92% 0.06 38)',
    200: 'oklch(84% 0.12 38)',
    300: 'oklch(74% 0.18 38)',
    400: 'oklch(67% 0.21 38)',
    500: 'oklch(62% 0.22 38)', // Core #ED4B00
    600: 'oklch(54% 0.20 38)',
    700: 'oklch(45% 0.18 38)',
    800: 'oklch(35% 0.15 38)',
    900: 'oklch(26% 0.12 38)',
  },

  // Cobalt Electric Telemetry (#0052CC / #2563EB)
  cobalt: {
    50: 'oklch(96% 0.03 250)',
    100: 'oklch(92% 0.07 250)',
    200: 'oklch(82% 0.14 250)',
    300: 'oklch(70% 0.19 250)',
    400: 'oklch(60% 0.22 250)',
    500: 'oklch(52% 0.23 250)', // Core #0052CC
    600: 'oklch(44% 0.20 250)',
    700: 'oklch(36% 0.16 250)',
    800: 'oklch(28% 0.12 250)',
    900: 'oklch(20% 0.08 250)',
  },

  // Emerald Forest Validated Access (#10B981)
  emerald: {
    50: 'oklch(96% 0.03 150)',
    100: 'oklch(92% 0.07 150)',
    200: 'oklch(84% 0.13 150)',
    300: 'oklch(74% 0.18 150)',
    400: 'oklch(65% 0.19 150)',
    500: 'oklch(58% 0.20 150)', // Core #10B981
    600: 'oklch(48% 0.18 150)',
    700: 'oklch(38% 0.15 150)',
    800: 'oklch(28% 0.11 150)',
    900: 'oklch(20% 0.07 150)',
  },

  // Solar Amber Security Alert (#F59E0B)
  amber: {
    50: 'oklch(97% 0.04 80)',
    100: 'oklch(93% 0.08 80)',
    200: 'oklch(85% 0.15 80)',
    300: 'oklch(77% 0.18 80)',
    400: 'oklch(70% 0.19 80)',
    500: 'oklch(64% 0.18 80)', // Core #F59E0B
    600: 'oklch(55% 0.17 80)',
    700: 'oklch(44% 0.15 80)',
    800: 'oklch(34% 0.12 80)',
    900: 'oklch(24% 0.08 80)',
  },

  // Ruby Crimson Breach (#EF4444)
  ruby: {
    50: 'oklch(96% 0.03 25)',
    100: 'oklch(92% 0.07 25)',
    200: 'oklch(84% 0.14 25)',
    300: 'oklch(74% 0.20 25)',
    400: 'oklch(65% 0.22 25)',
    500: 'oklch(57% 0.23 25)', // Core #EF4444
    600: 'oklch(48% 0.20 25)',
    700: 'oklch(38% 0.16 25)',
    800: 'oklch(28% 0.12 25)',
    900: 'oklch(20% 0.08 25)',
  },

  // Orchid Violet Virtual Lab AI (#8B5CF6)
  orchid: {
    50: 'oklch(96% 0.03 300)',
    100: 'oklch(92% 0.07 300)',
    200: 'oklch(84% 0.14 300)',
    300: 'oklch(74% 0.19 300)',
    400: 'oklch(65% 0.22 300)',
    500: 'oklch(58% 0.23 300)', // Core #8B5CF6
    600: 'oklch(48% 0.20 300)',
    700: 'oklch(38% 0.16 300)',
    800: 'oklch(28% 0.12 300)',
    900: 'oklch(20% 0.08 300)',
  },
} as const;
