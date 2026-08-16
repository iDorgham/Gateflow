import { prisma } from '@gate-access/db';
import { deliverWebhookEvent } from '../webhook-delivery';

/**
 * HubSpot Integration Helper
 *
 * Provides specialized mappings for HubSpot CRM integration.
 * HubSpot typically consumes physical arrival events as "Custom Behavioral Events".
 */

export interface HubSpotPhysicalVisitPayload {
  eventName: 'Physical Visit';
  email: string | null;
  properties: {
    gate_name: string;
    project_name: string;
    visitor_name: string;
    visit_timestamp: string;
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    visit_id: string;
  };
}

/**
 * Maps a generic scan success payload to a HubSpot-compatible format.
 * This can be used by organizations that want to push data directly to HubSpot
 * without an intermediary like Zapier.
 */
interface ScanData {
  contact?: { email?: string | null; name?: string | null };
  gate?: { name?: string | null };
  unit?: { building?: string | null };
  qrCode?: { visitorQR?: { visitorName?: string | null }; utm?: { source?: string; medium?: string; campaign?: string } };
  timestamp: string;
  scanId: string;
}

export function mapToHubSpotPhysicalVisit(
  scanData: ScanData
): HubSpotPhysicalVisitPayload {
  return {
    eventName: 'Physical Visit',
    email: scanData.contact?.email ?? null,
    properties: {
      gate_name: scanData.gate?.name ?? 'Unknown Gate',
      project_name: scanData.unit?.building ?? 'Unknown Project',
      visitor_name:
        scanData.contact?.name ??
        scanData.qrCode?.visitorQR?.visitorName ??
        'Guest',
      visit_timestamp: scanData.timestamp,
      utm_source: scanData.qrCode?.utm?.source,
      utm_medium: scanData.qrCode?.utm?.medium,
      utm_campaign: scanData.qrCode?.utm?.campaign,
      visit_id: scanData.scanId,
    },
  };
}

/**
 * Triggers specialized HubSpot sync if the organization has it configured.
 * This is an additive layer on top of generic webhooks.
 */
export async function triggerHubSpotSync(
  orgId: string,
  scanLogId: string
): Promise<void> {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { integrationConfig: true },
  });

  const config = org?.integrationConfig as Record<string, unknown> | null;
  if (!config?.hubspotPortalId) return;

  // Fetch full scan data for rich mapping
  const fullScan = await prisma.scanLog.findUnique({
    where: { id: scanLogId, deletedAt: null },
    include: {
      gate: { select: { name: true } },
      qrCode: {
        include: {
          visitorQR: { include: { unit: { select: { building: true } } } },
        },
      },
    },
  });

  if (!fullScan) return;

  // In a real production scenario, we might call HubSpot's Tracking Code API
  // or a specialized 'HubSpot' webhook endpoint.
  // For this "Preset", we deliver a specialized SCAN_SUCCESS payload
  // tagged with HubSpot metadata.

  const hubspotPayload = mapToHubSpotPhysicalVisit({
    scanId: fullScan.id,
    timestamp: fullScan.scannedAt.toISOString(),
    gate: fullScan.gate,
    qrCode: {
      ...fullScan.qrCode,
      utm: {
        source: fullScan.utmSource,
        medium: fullScan.utmMedium,
        campaign: fullScan.utmCampaign,
      },
    },
    unit: fullScan.qrCode.visitorQR?.unit,
  });

  // We deliver this to any webhook that has a 'hubspot' tag or metadata.
  // For now, we'll just emit a standard webhook but with the HubSpot mapping.
  await deliverWebhookEvent(orgId, 'SCAN_SUCCESS', {
    ...hubspotPayload,
    _integration: 'hubspot',
    _portalId: config.hubspotPortalId,
  });
}
