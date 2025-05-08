
export type VatStatus = 'fermentation' | 'distillation' | 'rest' | 'complete';

export interface Vat {
  id: string;
  name: string;
  temperature: number;
  pH: number;
  liquidLevel: number; // percentage
  fermentationTime: number; // hours
  status: VatStatus;
  agaveType: string;
  agaveAge: number; // years
  createdAt: Date;
  lastUpdated: Date;
}

export interface VatHistoryPoint {
  timestamp: Date;
  temperature: number;
  pH: number;
  liquidLevel: number;
}

export interface VatHistory {
  vatId: string;
  data: VatHistoryPoint[];
}
