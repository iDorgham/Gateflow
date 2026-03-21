import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

/**
 * Short-link resolver for compact QR codes.
 *
 * URL: /s/{shortId}
 *
 * - Scanner app / API clients (no Accept: text/html) → raw signed QR payload as text/plain
 * - Browser (Accept: text/html) → mobile-optimized HTML page with:
 *     • "Get directions" button (if Unit has lat/lng)
 *     • "I've arrived" button (notifies resident via /api/resident/arrived)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } },
): Promise<NextResponse> {
  const { shortId } = params;

  const link = await prisma.qrShortLink.findUnique({ where: { shortId } });

  if (!link) {
    return new NextResponse('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  if (link.expiresAt && new Date() > link.expiresAt) {
    return new NextResponse('QR link expired', {
      status: 410,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // Scanner app and API clients get the raw payload (unchanged behaviour)
  const acceptHeader = request.headers.get('Accept') ?? '';
  if (!acceptHeader.includes('text/html')) {
    return new NextResponse(link.fullPayload, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }

  // Browser request — look up VisitorQR + Unit coordinates for GPS guide
  let lat: number | null = null;
  let lng: number | null = null;
  let visitorQRId: string | null = null;
  let visitorName: string | null = null;

  try {
    const visitorQR = await prisma.visitorQR.findFirst({
      where: { qrCodeId: link.qrId },
      select: {
        id: true,
        visitorName: true,
        unit: { select: { lat: true, lng: true, name: true } },
      },
    });
    if (visitorQR) {
      visitorQRId = visitorQR.id;
      visitorName = visitorQR.visitorName;
      lat = visitorQR.unit?.lat ?? null;
      lng = visitorQR.unit?.lng ?? null;
    }
  } catch {
    // Non-fatal — degrade gracefully (no buttons shown)
  }

  const hasCoords = lat !== null && lng !== null;
  const apiBase = process.env.NEXT_PUBLIC_APP_URL ?? '';

  // Maps deep link: iOS opens Apple Maps, Android/other opens Google Maps
  const mapsUrl = hasCoords
    ? `https://maps.google.com/?q=${lat},${lng}`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>GateFlow — Visitor Pass</title>
  <style>
    :root {
      --ds-background-default: #F2F3F4;
      --ds-surface: #FFFFFF;
      --ds-text: #020035;
      --ds-text-subtle: #02066F;
      --ds-text-subtlest: #6B7280;
      --ds-brand: #ED4B00;
      --ds-neutral: #EDE9E8;
      --ds-success: #16A34A;
      --ds-border: #DEDDE3;
      --ds-shadow: rgba(2, 0, 53, 0.10);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--ds-background-default);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: var(--ds-surface);
      border-radius: 20px;
      padding: 32px 24px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 4px 24px var(--ds-shadow);
    }
    .logo {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--ds-text-subtle);
      margin-bottom: 24px;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: var(--ds-text);
      margin-bottom: 8px;
    }
    .sub {
      font-size: 15px;
      color: var(--ds-text-subtlest);
      margin-bottom: 32px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 16px;
      border-radius: 14px;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      border: none;
      cursor: pointer;
      margin-bottom: 12px;
      transition: opacity 0.2s;
    }
    .btn-primary { background: var(--ds-brand); color: #FFFFFF; }
    .btn-secondary { background: var(--ds-neutral); color: var(--ds-text); }
    .btn:disabled { opacity: 0.5; cursor: default; }
    .btn-done { background: var(--ds-success); color: #FFFFFF; }
    .note {
      font-size: 12px;
      color: var(--ds-text-subtlest);
      text-align: center;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">GateFlow</div>
    <h1>${visitorName ? `Welcome, ${escapeHtml(visitorName)}` : 'You\'re in!'}</h1>
    <p class="sub">You have been granted access. Use the buttons below to find your way.</p>

    ${hasCoords ? `
    <a href="${mapsUrl}" class="btn btn-primary" id="directionsBtn" target="_blank" rel="noopener">
      Get directions
    </a>` : ''}

    ${visitorQRId ? `
    <button class="btn btn-secondary" id="arrivedBtn" onclick="notifyArrival()">
      I've arrived
    </button>` : ''}

    <p class="note">Powered by GateFlow</p>
  </div>

  ${visitorQRId ? `
  <script>
    var apiBase = ${JSON.stringify(apiBase)};
    var visitorQRId = ${JSON.stringify(visitorQRId)};
    var btn = document.getElementById('arrivedBtn');

    function notifyArrival() {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.textContent = 'Notifying…';

      fetch(apiBase + '/api/resident/arrived', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorQRId: visitorQRId }),
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success || data.error === 'already_notified') {
          btn.textContent = 'Host notified ✓';
          btn.className = 'btn btn-done';
        } else {
          btn.textContent = 'I\\'ve arrived';
          btn.disabled = false;
        }
      })
      .catch(function() {
        btn.textContent = 'I\\'ve arrived';
        btn.disabled = false;
      });
    }
  </script>` : ''}
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
