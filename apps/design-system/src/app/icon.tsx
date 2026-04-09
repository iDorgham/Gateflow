import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: '#1e2d4a',
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
            background: '#4f8ef7',
            borderRadius: 1,
          }}
        />
        <div
          style={{
            width: 3,
            height: 3,
            background: '#a855f7',
            borderRadius: 1,
          }}
        />
        <div
          style={{
            width: 3,
            height: 3,
            background: '#22c55e',
            borderRadius: 1,
          }}
        />
        <div
          style={{
            width: 3,
            height: 3,
            background: '#f59e0b',
            borderRadius: 1,
          }}
        />
      </div>
    </div>,
    { ...size }
  );
}
