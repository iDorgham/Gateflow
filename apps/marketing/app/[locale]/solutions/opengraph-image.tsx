import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GateFlow Solutions — compounds, events, clubs, schools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #0a0f1a 100%)',
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
              background: '#ED4B00',
              borderRadius: '14px',
            }}
          />
          <span
            style={{
              color: '#ED4B00',
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
          Solutions for Every Venue
        </div>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '8px',
          }}
        >
          {['Compounds', 'Events', 'Clubs', 'Schools'].map((v) => (
            <div
              key={v}
              style={{
                background: 'rgba(237,75,0,0.15)',
                border: '1px solid rgba(237,75,0,0.3)',
                borderRadius: '10px',
                padding: '12px 20px',
                color: '#ED4B00',
                fontSize: '22px',
                fontWeight: 600,
              }}
            >
              {v}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
