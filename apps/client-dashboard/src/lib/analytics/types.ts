/**
 * Shared analytics API response types.
 * Used by analytics chart components and API routes.
 */

/** Visits over time: time series by date */
export interface VisitsOverTimePoint {
  date: string;
  count: number;
}

/** Top gates by traffic */
export interface TopGatesRow {
  gateId: string;
  gateName: string;
  count: number;
}

/** Scan outcome by status */
export interface ScanOutcomeRow {
  status: string;
  count: number;
}

/** Peak days: day of week (0=Sun … 6=Sat) */
export interface PeakDaysRow {
  dayOfWeek: number;
  label: string;
  count: number;
}

/** Unit types visit ranking */
export interface UnitTypesRankingRow {
  unitType: string;
  count: number;
}

/** Visitor type distribution (QRCode type) */
export interface VisitorTypeRow {
  type: string;
  count: number;
}

/** Incidents by gate or operator */
export interface IncidentsByGateRow {
  gateId: string;
  gateName: string;
  count: number;
}

export interface IncidentsByOperatorRow {
  userId: string;
  userName: string;
  count: number;
}

/** Top active units */
export interface TopUnitsRow {
  unitId: string;
  unitName: string;
  count: number;
}

/** Resident quota usage (stub) */
export interface QuotaUsageRow {
  unitType: string;
  used: number;
  limit: number;
}
