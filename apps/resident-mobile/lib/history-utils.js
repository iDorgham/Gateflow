/**
 * History filtering, date formatting, and push notification payload resolution.
 */

/**
 * Maps a raw scan log status to a display badge configuration.
 * @param {string} status
 * @returns {{ bg: string; text: string; label: string }}
 */
export function getStatusBadgeConfig(status) {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
    case 'GRANTED':
    case 'ADMITTED':
      return { bg: '#d1fae5', text: '#065f46', label: 'Admitted' };
    case 'DENIED':
    case 'REJECTED':
      return { bg: '#fee2e2', text: '#991b1b', label: 'Denied' };
    case 'EXPIRED':
      return { bg: '#fef3c7', text: '#92400e', label: 'Expired' };
    case 'MAX_USES_REACHED':
      return { bg: '#fef3c7', text: '#92400e', label: 'Limit Reached' };
    default:
      return { bg: '#f3f4f6', text: '#6b7280', label: status || 'Unknown' };
  }
}

/**
 * Formats an ISO date into Today, Yesterday, or readable date string.
 * @param {string} iso
 * @param {Date} [referenceDate]
 * @returns {string}
 */
export function formatHistoryDateLabel(iso, referenceDate = new Date()) {
  const d = new Date(iso);
  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );
  const itemDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = today.getTime() - itemDay.getTime();

  if (diff === 0) return 'Today';
  if (diff === 86_400_000) return 'Yesterday';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Filters a list of history items by status filter ('all' | 'granted' | 'denied').
 * @param {Array<{ id: string; status: string }>} items
 * @param {'all' | 'granted' | 'denied'} filter
 * @returns {Array<{ id: string; status: string }>}
 */
export function filterHistoryItems(items, filter) {
  if (!items || !Array.isArray(items)) return [];
  if (filter === 'all') return items;
  if (filter === 'granted') {
    return items.filter((i) =>
      ['SUCCESS', 'GRANTED', 'ADMITTED'].includes(i.status?.toUpperCase())
    );
  }
  if (filter === 'denied') {
    return items.filter(
      (i) =>
        !['SUCCESS', 'GRANTED', 'ADMITTED'].includes(i.status?.toUpperCase())
    );
  }
  return items;
}

/**
 * Parses an incoming push notification response payload into a typed navigation route.
 * @param {Record<string, unknown>} rawData
 * @returns {{ route: string; params: Record<string, string> } | null}
 */
export function parsePushNotificationPayload(rawData) {
  if (!rawData || typeof rawData !== 'object') return null;

  const type = rawData.type || rawData.notificationType;
  if (type === 'gate_scan' || type === 'scan_admitted' || type === 'arrival') {
    const scanId = String(rawData.scanId || rawData.visitorQRId || '');
    return {
      route: '/(tabs)/history',
      params: scanId ? { highlightId: scanId } : {},
    };
  }

  if (type === 'pass_created' && rawData.visitorQRId) {
    return {
      route: `/visitors/${rawData.visitorQRId}`,
      params: {},
    };
  }

  return {
    route: '/(tabs)/history',
    params: {},
  };
}
