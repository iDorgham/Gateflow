export type PatrolRunStatus =
  'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';

export interface MapCoordinates {
  x?: number;
  y?: number;
  latitude?: number;
  longitude?: number;
}

export interface PatrolCheckpointDto {
  id: string;
  routeId: string;
  name: string;
  mapCoordinates?: MapCoordinates | null;
  orderIndex: number;
  secretHash?: string;
  organizationId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PatrolRouteDto {
  id: string;
  name: string;
  frequencyMinutes: number;
  isStrictSequence: boolean;
  active: boolean;
  startGateId?: string | null;
  startGateName?: string | null;
  organizationId: string;
  checkpoints: PatrolCheckpointDto[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PatrolLogEntryDto {
  id: string;
  runId: string;
  checkpointId: string;
  checkpointName?: string;
  guardId?: string | null;
  guardName?: string | null;
  scannedAt: string | Date;
  latencySeconds?: number | null;
  organizationId: string;
}

export interface PatrolRunDto {
  id: string;
  routeId: string;
  routeName?: string;
  guardId?: string | null;
  guardName?: string | null;
  guardAvatarUrl?: string | null;
  status: PatrolRunStatus;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  totalCheckpoints?: number;
  completedCheckpoints?: number;
  currentCheckpointIndex?: number;
  overdue?: boolean;
  organizationId: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  logEntries?: PatrolLogEntryDto[];
}

export interface CheckpointQrPayload {
  orgId: string;
  routeId: string;
  checkpointId: string;
  nonce: string;
  timestamp: number;
  hmac: string;
}
