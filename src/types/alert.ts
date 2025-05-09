
export type AlertStatus = 'leida' | 'no_leida';

export interface Alert {
  id: string;
  vatId: string;
  sensorId: string;
  message: string;
  createdAt: Date;
  status: AlertStatus;
  readAt: Date | null;
  readBy: string | null; // userId of the user who read it
}
