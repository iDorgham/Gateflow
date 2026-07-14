import { ImageResponse } from 'next/og';
import { BRAND_COLORS } from '@gateflow/ui/tokens';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 40,
        background: BRAND_COLORS.navy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* G lettermark */}
      <div
        style={{
          color: 'white',
          fontSize: 110,
          fontWeight: 900,
          fontFamily: 'serif',
          letterSpacing: '-4px',
          lineHeight: 1,
          marginRight: 8,
        }}
      >
        G
      </div>
      {/* 4-color palette grid in bottom-right */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: 44,
          height: 44,
          gap: 4,
          position: 'absolute',
          bottom: 22,
          right: 22,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            background: BRAND_COLORS.gridBlue,
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: 20,
            height: 20,
            background: BRAND_COLORS.gridPurple,
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: 20,
            height: 20,
            background: BRAND_COLORS.gridGreen,
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: 20,
            height: 20,
            background: BRAND_COLORS.gridAmber,
            borderRadius: 4,
          }}
        />
      </div>
    </div>,
    { ...size }
  );
}
