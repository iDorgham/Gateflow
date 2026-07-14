import { ImageResponse } from 'next/og';
import { BRAND_COLORS } from '../../../lib/design-tokens';

export const runtime = 'edge';
export const alt = 'GateFlow Pricing — Starter, Pro, Enterprise plans';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${BRAND_COLORS.background} 0%, ${BRAND_COLORS.surface} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            background: BRAND_COLORS.primary,
            borderRadius: '14px',
          }}
        />
        <span
          style={{
            color: BRAND_COLORS.primary,
            fontSize: '30px',
            fontWeight: 700,
            letterSpacing: '4px',
          }}
        >
          GATEFLOW
        </span>
      </div>
      <div
        style={{
          color: 'white',
          fontSize: '60px',
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.1,
          marginBottom: '24px',
        }}
      >
        Simple, Transparent Pricing
      </div>
      <div
        style={{
          display: 'flex',
          gap: '24px',
          marginTop: '8px',
        }}
      >
        {['Starter — Free', 'Pro — $49/mo', 'Enterprise'].map((plan) => (
          <div
            key={plan}
            style={{
              background: BRAND_COLORS.whiteAlpha8,
              border: `1px solid ${BRAND_COLORS.whiteAlpha15}`,
              borderRadius: '12px',
              padding: '16px 24px',
              color: BRAND_COLORS.lighterText,
              fontSize: '22px',
              fontWeight: 600,
            }}
          >
            {plan}
          </div>
        ))}
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
