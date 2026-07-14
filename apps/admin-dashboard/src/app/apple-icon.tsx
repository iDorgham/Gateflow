import { ImageResponse } from 'next/og';
import { BRAND_COLORS } from '@gateflow/ui/tokens';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Admin Dashboard apple-touch-icon
// Navy rounded square with white "G" mark – standard GateFlow brand
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 44,
        background: BRAND_COLORS.navy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 120,
          fontWeight: 900,
          fontFamily: 'serif',
          letterSpacing: '-4px',
          lineHeight: 1,
        }}
      >
        G
      </div>
    </div>,
    { ...size }
  );
}
