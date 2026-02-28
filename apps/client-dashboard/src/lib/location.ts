/**
 * Location rule helpers: Haversine distance and gate location enforcement.
 * Used when gate.locationEnforced is true to reject scans outside the configured radius.
 */

const EARTH_RADIUS_METERS = 6_371_000;

/**
 * Haversine distance in meters between two lat/long points.
 */
export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

export interface GateLocationConfig {
  latitude: number | null;
  longitude: number | null;
  locationRadiusMeters: number | null;
  locationEnforced: boolean | null;
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
}

/**
 * When gate has location enforcement enabled, checks device location is within radius.
 * Returns { allowed: true } or { allowed: false, message }.
 */
export function checkLocationForGate(
  gate: GateLocationConfig,
  deviceLocation: DeviceLocation | null | undefined
): { allowed: true } | { allowed: false; message: string } {
  if (!gate.locationEnforced) {
    return { allowed: true };
  }

  if (
    gate.latitude == null ||
    gate.longitude == null ||
    gate.locationRadiusMeters == null ||
    gate.locationRadiusMeters <= 0
  ) {
    return {
      allowed: false,
      message: 'Gate location rule is enabled but gate coordinates or radius are not configured.',
    };
  }

  if (
    !deviceLocation ||
    typeof deviceLocation.latitude !== 'number' ||
    typeof deviceLocation.longitude !== 'number'
  ) {
    return {
      allowed: false,
      message: 'Scan only allowed at gate location. Enable device location and try again.',
    };
  }

  const distance = haversineDistanceMeters(
    gate.latitude,
    gate.longitude,
    deviceLocation.latitude,
    deviceLocation.longitude
  );

  if (distance > gate.locationRadiusMeters) {
    return {
      allowed: false,
      message: 'Scanning is only allowed at the gate location for this account. Move closer to the gate.',
    };
  }

  return { allowed: true };
}
