export type NotificationActionType =
  'OPEN_GATE' | 'REJECT_ENTRY' | 'CALL_GUARD';

export type NotificationCategory = 'VISITOR_ARRIVAL';

export interface ArrivalNotificationPayload {
  visitorName: string;
  visitorPhone?: string;
  unitName: string;
  gateName: string;
  scanTime: string;
  visitorQRId: string;
  guardName?: string;
  guardPhone?: string;
  accessGranted?: boolean;
}

export interface NotificationPreferences {
  enableArrivalAlerts: boolean;
  enableSound: boolean;
  enableHaptics: boolean;
  enableQuietHours: boolean;
  quietHoursStart: string; // e.g. "23:00"
  quietHoursEnd: string; // e.g. "07:00"
  autoOpenForFamily: boolean;
}

export interface ArrivalEvent {
  id: string;
  visitorName: string;
  unitName: string;
  gateName: string;
  timestamp: number;
  visitorQRId: string;
  status: 'PENDING' | 'OPENED' | 'REJECTED';
}
