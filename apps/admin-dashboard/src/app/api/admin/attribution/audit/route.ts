import { NextRequest, NextResponse } from 'next/server';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PixelProvider = 'GTM' | 'GA4' | 'META_PIXEL' | 'POSTHOG' | 'CUSTOM';

export interface PixelProbeResult {
  provider: PixelProvider;
  id?: string;
  detected: boolean;
  loadedAt?: number; // ms since page load
  issues: string[];
  score: number; // 0–100 — higher = healthier
}

export interface AttributionHarnessReport {
  url: string;
  auditedAt: string;
  userAgent: string;
  overallScore: number;
  summary: string;
  probes: PixelProbeResult[];
  recommendations: string[];
}

// ─── Scoring Logic ────────────────────────────────────────────────────────────

/**
 * Parses a GTM/GA4/Meta pixel configuration from an IntegrationCredential config blob
 * and returns a health report.
 *
 * NOTE: This is a server-side configuration auditor — it reads env / org integration
 * config records. Browser-side pixel firing is validated via the client-side harness
 * component (AttributionHarnessClient).
 */
export function auditAttributionConfig(params: {
  gtmContainerId?: string | null;
  ga4MeasurementId?: string | null;
  metaPixelId?: string | null;
  posthogApiKey?: string | null;
}): AttributionHarnessReport {
  const probes: PixelProbeResult[] = [];

  // ── GTM ──
  const gtmProbe: PixelProbeResult = {
    provider: 'GTM',
    id: params.gtmContainerId ?? undefined,
    detected: !!params.gtmContainerId,
    issues: [],
    score: 0,
  };
  if (!params.gtmContainerId) {
    gtmProbe.issues.push(
      'GTM Container ID not configured (pixelGtmId is null).'
    );
  } else if (!/^GTM-[A-Z0-9]{4,8}$/.test(params.gtmContainerId)) {
    gtmProbe.issues.push(
      `Invalid GTM Container ID format: "${params.gtmContainerId}". Expected GTM-XXXXXXX.`
    );
  } else {
    gtmProbe.score = 100;
  }
  probes.push(gtmProbe);

  // ── GA4 ──
  const ga4Probe: PixelProbeResult = {
    provider: 'GA4',
    id: params.ga4MeasurementId ?? undefined,
    detected: !!params.ga4MeasurementId,
    issues: [],
    score: 0,
  };
  if (!params.ga4MeasurementId) {
    ga4Probe.issues.push('GA4 Measurement ID not configured.');
  } else if (!/^G-[A-Z0-9]{6,12}$/.test(params.ga4MeasurementId)) {
    ga4Probe.issues.push(
      `Invalid GA4 Measurement ID format: "${params.ga4MeasurementId}". Expected G-XXXXXXXXXX.`
    );
  } else {
    ga4Probe.score = 100;
  }
  probes.push(ga4Probe);

  // ── Meta Pixel ──
  const metaProbe: PixelProbeResult = {
    provider: 'META_PIXEL',
    id: params.metaPixelId ?? undefined,
    detected: !!params.metaPixelId,
    issues: [],
    score: 0,
  };
  if (!params.metaPixelId) {
    metaProbe.issues.push('Meta Pixel ID not configured.');
  } else if (!/^\d{10,20}$/.test(params.metaPixelId)) {
    metaProbe.issues.push(
      `Invalid Meta Pixel ID format: "${params.metaPixelId}". Expected 10–20 digit numeric ID.`
    );
  } else {
    metaProbe.score = 100;
  }
  probes.push(metaProbe);

  // ── PostHog ──
  const posthogProbe: PixelProbeResult = {
    provider: 'POSTHOG',
    id: params.posthogApiKey ? 'configured' : undefined,
    detected: !!params.posthogApiKey,
    issues: [],
    score: 0,
  };
  if (!params.posthogApiKey) {
    posthogProbe.issues.push(
      'PostHog API key not configured (optional but recommended for product analytics).'
    );
    posthogProbe.score = 50; // optional — partial credit
  } else if (!params.posthogApiKey.startsWith('phc_')) {
    posthogProbe.issues.push(
      `Unexpected PostHog key prefix: "${params.posthogApiKey.slice(0, 8)}...". Expected "phc_".`
    );
  } else {
    posthogProbe.score = 100;
  }
  probes.push(posthogProbe);

  // ── Compute Overall Score ──
  const overallScore = Math.round(
    probes.reduce((sum, p) => sum + p.score, 0) / probes.length
  );

  const recommendations: string[] = [];
  if (!params.gtmContainerId)
    recommendations.push('Add GTM Container ID to enable tag management.');
  if (!params.ga4MeasurementId)
    recommendations.push('Add GA4 Measurement ID for web analytics.');
  if (!params.metaPixelId)
    recommendations.push(
      'Add Meta Pixel ID to track conversion events for ad campaigns.'
    );
  if (!params.posthogApiKey)
    recommendations.push(
      'Consider adding PostHog for in-product funnel analytics.'
    );
  if (overallScore === 100)
    recommendations.push('All attribution pixels configured correctly. ✓');

  const summary =
    overallScore === 100
      ? 'All attribution pixels are correctly configured.'
      : overallScore >= 75
        ? 'Most attribution pixels are configured. Review outstanding issues.'
        : overallScore >= 50
          ? 'Partial attribution coverage. Several pixels are missing or misconfigured.'
          : 'Attribution coverage is critically low. Most pixels need configuration.';

  return {
    url: '[server-side config audit]',
    auditedAt: new Date().toISOString(),
    userAgent: 'GateFlow Attribution Harness v1.0',
    overallScore,
    summary,
    probes,
    recommendations,
  };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

/**
 * GET /api/admin/attribution/audit?orgId=xxx
 *
 * Admin-only endpoint that reads an organization's pixel configuration
 * (from the Organization record) and returns a health report.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Dynamic import to keep test/edge bundle light
  const { prisma } = await import('@gate-access/db');
  const { requireAdminApi } = await import('@/lib/require-admin-api');

  const authError = await requireAdminApi(request);
  if (authError) return authError;

  const url = new URL(request.url);
  const orgId = url.searchParams.get('orgId');
  if (!orgId) {
    return NextResponse.json(
      { error: 'orgId query param required' },
      { status: 400 }
    );
  }

  const org = await prisma.organization.findFirst({
    where: { id: orgId, deletedAt: null },
    select: {
      id: true,
      name: true,
      pixelGtmId: true,
      pixelMetaId: true,
      integrationConfig: true,
    },
  });

  if (!org) {
    return NextResponse.json(
      { error: 'Organization not found' },
      { status: 404 }
    );
  }

  // Extract GA4 / PostHog from integrationConfig JSON
  const config = (org.integrationConfig ?? {}) as Record<string, unknown>;
  const ga4MeasurementId =
    typeof config.ga4MeasurementId === 'string'
      ? config.ga4MeasurementId
      : null;
  const posthogApiKey =
    typeof config.posthogApiKey === 'string' ? config.posthogApiKey : null;

  const report = auditAttributionConfig({
    gtmContainerId: org.pixelGtmId,
    ga4MeasurementId,
    metaPixelId: org.pixelMetaId,
    posthogApiKey,
  });

  return NextResponse.json({
    ok: true,
    organization: { id: org.id, name: org.name },
    report,
  });
}
