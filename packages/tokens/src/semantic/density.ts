/**
 * @gateflow/tokens - Semantic: Density Profiles (Tier 2 Semantic)
 * Compact (Dashboards: 36px controls) vs Comfortable (Marketing/Portals/Mobile: 48px controls).
 */

export const densityTokens = {
  compact: {
    controlHeight: '36px',
    controlPaddingX: '12px',
    controlPaddingY: '6px',
    tableRowHeight: '36px',
    tablePaddingX: '12px',
    tablePaddingY: '6px',
    fontSize: '0.875rem', // 14px
    iconSize: '16px',
    gap: '8px',
  },
  comfortable: {
    controlHeight: '48px',
    controlPaddingX: '16px',
    controlPaddingY: '12px',
    tableRowHeight: '48px',
    tablePaddingX: '16px',
    tablePaddingY: '12px',
    fontSize: '1rem', // 16px
    iconSize: '20px',
    gap: '12px',
  },
  touchTargetMin: '44px', // Hard minimum touch hit-area
} as const;
