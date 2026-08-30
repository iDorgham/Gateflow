export type VisitorTemplateType =
  'FAMILY' | 'DRIVER' | 'CONTRACTOR' | 'DAY_GUEST';

export type AccessType = 'ONETIME' | 'DATERANGE' | 'RECURRING' | 'PERMANENT';

export type VisitorInviteStatus = 'SENT' | 'OPENED' | 'USED' | 'EXPIRED';

export interface VisitorTemplate {
  id: VisitorTemplateType;
  title: string;
  subtitle: string;
  icon: string;
  defaultAccessType: AccessType;
  defaultValidityHours: number;
  badgeLabel: string;
}

export interface CreateVisitorInviteInput {
  visitorName: string;
  visitorPhone?: string;
  templateType: VisitorTemplateType;
  accessType: AccessType;
  startDate?: string;
  endDate?: string;
  plateNumber?: string;
}

export interface VisitorInviteRecord {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  templateType: VisitorTemplateType;
  accessType: AccessType;
  status: VisitorInviteStatus;
  createdAt: string;
  validUntil: string;
  qrCode?: {
    id: string;
    code: string;
    type: string;
  };
  unit?: {
    id: string;
    name: string;
    building?: string | null;
  };
}

export interface RateLimitState {
  remainingQuota: number;
  totalLimit: number;
  isBlocked: boolean;
  resetsInSeconds: number;
}
