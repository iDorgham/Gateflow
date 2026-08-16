export enum PerimeterEventType {
  TAILGATING = 'TAILGATING',
  LPR_MATCH = 'LPR_MATCH',
  BARRIER_FORCED = 'BARRIER_FORCED',
  VEHICLE_STOPPED = 'VEHICLE_STOPPED',
}

export interface PerimeterWebhookPayload {
  organizationId: string;
  projectId: string;
  gateId: string;
  type: PerimeterEventType;
  payload: Record<string, unknown>;
  timestamp: string;
}
