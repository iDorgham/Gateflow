import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GateFlow — Smart QR Access Control for MENA';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a0a 100%)',
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
          Zero-Trust Gate Access
          <br />
          for MENA
        </div>
        <div
          style={{
            color: '#888',
            fontSize: '26px',
            textAlign: 'center',
          }}
        >
          HMAC-signed QR codes · Offline-first · Arabic-first
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
