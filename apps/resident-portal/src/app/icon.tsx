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
      }}
    >
      {/* House silhouette */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    </div>,
    { ...size }
  );
}
