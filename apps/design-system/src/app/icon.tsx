import { ImageResponse } from 'next/og';
import { BRAND_COLORS } from '@gateflow/ui/tokens';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

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
        position: 'relative',
      }}
    >
      {/* G lettermark */}
      <div
        style={{
          color: 'white',
          fontSize: 20,
          fontWeight: 900,
          fontFamily: 'serif',
          letterSpacing: '-1px',
          lineHeight: 1,
          marginRight: 2,
        }}
      >
        G
      </div>
      {/* 4-color palette grid in bottom-right */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: 8,
          height: 8,
          gap: 1,
          position: 'absolute',
          bottom: 5,
          right: 5,
        }}
      >
        <div
          style={{
            width: 3,
            height: 3,
            background: BRAND_COLORS.gridBlue,
            borderRadius: 1,
          }}
        />
        <div
          style={{
            width: 3,
            height: 3,
            background: BRAND_COLORS.gridPurple,
            borderRadius: 1,
          }}
        />
        <div
          style={{
            width: 3,
            height: 3,
            background: BRAND_COLORS.gridGreen,
            borderRadius: 1,
          }}
        />
        <div
          style={{
            width: 3,
            height: 3,
            background: BRAND_COLORS.gridAmber,
            borderRadius: 1,
          }}
        />
      </div>
    </div>,
    { ...size }
  );
}
