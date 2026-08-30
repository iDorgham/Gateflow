/**
 * @gateflow/tokens - Semantic: Functional Colors (Tier 2 Semantic)
 * Resolves Tier 1 primitives into theme-dependent semantic roles.
 */

import { primitiveColors } from '../foundations/colors';

export const semanticColors = {
  light: {
    // Text
    textPrimary: primitiveColors.neutral[900],       // oklch(12% 0.015 250) -> #0f172a
    textSubtle: primitiveColors.neutral[600],        // oklch(48% 0.022 250) -> #475569
    textSubtlest: primitiveColors.neutral[400],     // oklch(76% 0.018 250) -> #94a3b8
    textInverse: primitiveColors.neutral[0],         // #ffffff
    textBrand: primitiveColors.kimchi[500],          // #ED4B00
    textSuccess: primitiveColors.emerald[600],       // #059669
    textWarning: primitiveColors.amber[600],         // #D97706
    textDanger: primitiveColors.ruby[500],           // #DC2626
    textAiLab: primitiveColors.orchid[600],          // #7C3AED

    // Borders
    borderSubtle: primitiveColors.neutral[200],      // oklch(92.5% 0.012 250) -> #e2e6eb
    borderBold: primitiveColors.neutral[400],        // oklch(76% 0.018 250) -> #cbd2db
    borderFocused: primitiveColors.kimchi[500],      // #ED4B00
    borderDanger: primitiveColors.ruby[500],

    // Primary Action
    colorPrimary: primitiveColors.kimchi[500],       // #ED4B00
    colorPrimaryHover: primitiveColors.kimchi[600],  // #D43E00
    colorPrimarySubtle: primitiveColors.kimchi[50],  // Light tint

    // Status Accents
    colorSuccess: primitiveColors.emerald[500],      // #10B981
    colorSuccessSubtle: primitiveColors.emerald[50],
    colorWarning: primitiveColors.amber[500],        // #F59E0B
    colorWarningSubtle: primitiveColors.amber[50],
    colorDanger: primitiveColors.ruby[500],          // #EF4444
    colorDangerSubtle: primitiveColors.ruby[50],
    colorInfo: primitiveColors.cobalt[500],          // #0052CC
    colorInfoSubtle: primitiveColors.cobalt[50],
    colorAiLab: primitiveColors.orchid[500],         // #8B5CF6
    colorAiLabSubtle: primitiveColors.orchid[50],
  },
  dark: {
    // Text
    textPrimary: primitiveColors.neutral[50],        // oklch(98.5% 0.005 250) -> #f8fafc
    textSubtle: primitiveColors.neutral[400],        // oklch(76% 0.018 250) -> #94a3b8
    textSubtlest: primitiveColors.neutral[600],      // oklch(48% 0.022 250) -> #64748b
    textInverse: primitiveColors.neutral[950],       // #0b0d11
    textBrand: primitiveColors.kimchi[400],          // Lightened for dark contrast
    textSuccess: primitiveColors.emerald[400],
    textWarning: primitiveColors.amber[300],
    textDanger: primitiveColors.ruby[400],
    textAiLab: primitiveColors.orchid[400],

    // Borders
    borderSubtle: primitiveColors.neutral[800],      // oklch(20% 0.02 250) -> #232834
    borderBold: primitiveColors.neutral[700],        // oklch(34% 0.02 250) -> #363d4e
    borderFocused: primitiveColors.kimchi[400],
    borderDanger: primitiveColors.ruby[400],

    // Primary Action
    colorPrimary: primitiveColors.kimchi[500],       // #ED4B00
    colorPrimaryHover: primitiveColors.kimchi[400],  // Brighter hover in dark mode
    colorPrimarySubtle: primitiveColors.kimchi[900],

    // Status Accents
    colorSuccess: primitiveColors.emerald[500],
    colorSuccessSubtle: primitiveColors.emerald[900],
    colorWarning: primitiveColors.amber[500],
    colorWarningSubtle: primitiveColors.amber[900],
    colorDanger: primitiveColors.ruby[500],
    colorDangerSubtle: primitiveColors.ruby[900],
    colorInfo: primitiveColors.cobalt[400],
    colorInfoSubtle: primitiveColors.cobalt[900],
    colorAiLab: primitiveColors.orchid[500],
    colorAiLabSubtle: primitiveColors.orchid[900],
  },
} as const;
