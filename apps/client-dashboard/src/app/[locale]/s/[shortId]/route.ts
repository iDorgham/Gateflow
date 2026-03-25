import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { token } from '@atlaskit/tokens';

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
  props: { params: Promise<{ shortId: string }> }
): Promise<NextResponse> {
  const params = await props.params;
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

  // Browser request — look up VisitorQR + Unit coordinates for GPS guide
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

  // Log landing page visit (Marketing ROI tracking)
  const { searchParams: urlParams } = new URL(request.url);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmContent = urlParams.get('utm_content');
  const utmTerm = urlParams.get('utm_term');

  // Background fire-and-forget logging
  void prisma.shortLinkClick
    .create({
      data: {
        shortLinkId: link.id,
        organizationId: link.organizationId,
        projectId: link.projectId,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        deviceInfo: {
          userAgent: request.headers.get('user-agent'),
          ip:
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip'),
        },
      },
    })
    .catch((err) => console.error('Failed to log ShortLinkClick:', err));

  // Browser request — look up VisitorQR + Unit coordinates for GPS guide
  let lat: number | null = null;
  let lng: number | null = null;
  let visitorQRId: string | null = null;
  let visitorName: string | null = null;
  let pixelMetaId: string | null = null;
  let pixelGtmId: string | null = null;

  try {
    const [visitorQR, org] = await Promise.all([
      prisma.visitorQR.findFirst({
        where: {
          qrCodeId: link.qrId,
          unit: { organizationId: link.organizationId },
        },
        select: {
          id: true,
          visitorName: true,
          unit: {
            select: { lat: true, lng: true, name: true, organizationId: true },
          },
        },
      }),
      prisma.organization.findUnique({
        where: { id: link.organizationId },
        select: { pixelMetaId: true, pixelGtmId: true },
      }),
    ]);

    if (visitorQR) {
      visitorQRId = visitorQR.id;
      visitorName = visitorQR.visitorName;
      lat = visitorQR.unit?.lat ?? null;
      lng = visitorQR.unit?.lng ?? null;
    }

    if (org) {
      pixelMetaId = org.pixelMetaId;
      pixelGtmId = org.pixelGtmId;
    }
  } catch {
    // Non-fatal — degrade gracefully
  }

  const hasCoords = lat !== null && lng !== null;
  const apiBase = process.env.NEXT_PUBLIC_APP_URL ?? '';

  // Maps deep link: iOS opens Apple Maps, Android/other opens Google Maps
  const mapsUrl = hasCoords ? `https://maps.google.com/?q=${lat},${lng}` : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>GateFlow — Visitor Pass</title>
  
  ${
    pixelGtmId
      ? `<!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${escapeHtml(pixelGtmId)}');</script>
  <!-- End Google Tag Manager -->`
      : ''
  }

  ${
    pixelMetaId
      ? `<!-- Meta Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${escapeHtml(pixelMetaId)}');
  fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=${escapeHtml(pixelMetaId)}&ev=PageView&noscript=1"
  /></noscript>
  <!-- End Meta Pixel Code -->`
      : ''
  }

  <style>
    :root {
      /* ADS Light Tokens alignment using official tokens */
      --ds-background-default: ${token('elevation.surface', '#FFFFFF')};
      --ds-surface: ${token('elevation.surface', '#FFFFFF')};
      --ds-text: ${token('color.text', '#172B4D')};
      --ds-text-subtle: ${token('color.text.subtle', '#44546F')};
      --ds-text-subtlest: ${token('color.text.subtlest', '#626F86')};
      --ds-brand: ${token('color.background.brand.bold', '#0C66E4')};
      --ds-neutral: ${token('color.background.neutral', '#091E420F')};
      --ds-success: ${token('color.background.success.bold', '#1F845A')};
      --ds-border: ${token('color.border', '#091E4224')};
      --ds-shadow: ${token('elevation.shadow.raised', 'rgba(9, 30, 66, 0.08)')};
      --ds-text-inverse: ${token('color.text.inverse', '#FFFFFF')};
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
    .btn-primary { background: var(--ds-brand); color: var(--ds-text-inverse); }
    .btn-secondary { background: var(--ds-neutral); color: var(--ds-text); }
    .btn:disabled { opacity: 0.5; cursor: default; }
    .btn-done { background: var(--ds-success); color: var(--ds-text-inverse); }
    .note {
      font-size: 12px;
      color: var(--ds-text-subtlest);
      text-align: center;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  ${
    pixelGtmId
      ? `<!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${pixelGtmId}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->`
      : ''
  }
  <div class="card">
    <div class="logo">GateFlow</div>
    <h1>${visitorName ? `Welcome, ${escapeHtml(visitorName)}` : "You're in!"}</h1>
    <p class="sub">You have been granted access. Use the buttons below to find your way.</p>

    ${
      hasCoords
        ? `
    <a href="${mapsUrl}" class="btn btn-primary" id="directionsBtn" target="_blank" rel="noopener">
      Get directions
    </a>`
        : ''
    }

    ${
      visitorQRId
        ? `
    <button class="btn btn-secondary" id="arrivedBtn" onclick="notifyArrival()">
      I've arrived
    </button>`
        : ''
    }

    <p class="note">Powered by GateFlow</p>
  </div>

  ${
    visitorQRId
      ? `
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
  </script>`
      : ''
  }
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
    .replace(/'/g, '&apos;');
}
