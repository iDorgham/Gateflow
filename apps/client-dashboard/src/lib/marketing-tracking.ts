// Marketing tracking utilities
// Handles Meta Pixel, GA4, and UTM parameter capture

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Extract UTM parameters from URL search params
 */
export function extractUTMParams(searchParams: URLSearchParams): UTMParams {
  return {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
  };
}

/**
 * Store UTM params in sessionStorage for attribution
 */
export function storeUTMParams(params: UTMParams): void {
  if (typeof window === 'undefined') return;
  
  const hasParams = Object.values(params).some(v => v !== undefined);
  if (hasParams) {
    sessionStorage.setItem('gateflow_utm', JSON.stringify(params));
  }
}

/**
 * Retrieve stored UTM params from sessionStorage
 */
export function getStoredUTMParams(): UTMParams | null {
  if (typeof window === 'undefined') return null;
  
  const stored = sessionStorage.getItem('gateflow_utm');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Track Meta Pixel event
 */
export function trackPixelEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  
  const fbq = (window as any).fbq;
  if (fbq) {
    fbq('track', eventName, params);
  }
}

/**
 * Track GA4 event
 */
export function trackGA4Event(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  
  const gtag = (window as any).gtag;
  if (gtag) {
    gtag('event', eventName, params);
  }
}

/**
 * Track QR scan with attribution
 */
export function trackQRScan(qrCode: string, utmParams?: UTMParams): void {
  trackPixelEvent('QRScan', {
    qr_code: qrCode,
    ...utmParams,
  });
  
  trackGA4Event('qr_scan', {
    qr_code: qrCode,
    ...utmParams,
  });
}

/**
 * Track contact creation with attribution
 */
export function trackContactCreation(contactId: string, utmParams?: UTMParams): void {
  trackPixelEvent('Lead', {
    contact_id: contactId,
    ...utmParams,
  });
  
  trackGA4Event('generate_lead', {
    contact_id: contactId,
    ...utmParams,
  });
}
