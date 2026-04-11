import { ImageResponse } from 'next/og';
import { BRAND_COLORS } from '@gateflow/ui/tokens';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Admin Dashboard favicon/icon (32x32)
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: BRAND_COLORS.navy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 22,
          fontWeight: 900,
          fontFamily: 'serif',
          letterSpacing: '-1px',
          lineHeight: 1,
        }}
      >
        G
      </div>
    </div>,
    { ...size }
  );
}
