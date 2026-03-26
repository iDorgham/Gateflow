export interface GateRow {
  id: string;
  name: string;
  location: string | null;
  isActive: boolean;
  projectId: string | null;
  projectName: string | null;
  latitude: number | null;
  longitude: number | null;
  locationRadiusMeters: number | null;
  locationEnforced: boolean | null;
  requiredIdentityLevel: number | null;
  _count: { qrCodes: number; scanLogs: number };
}

export interface Project {
  id: string;
  name: string;
}
