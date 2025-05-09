
export type VatStatus = 'fermentando' | 'destilando' | 'reposando' | 'vacio';

export interface Vat {
  id: string;
  name: string; // "Tina #1", "Tina #2", etc.
  capacity: number; // liters
  status: VatStatus;
  agaveType: string; // "Espadin", "Madre cuishe", etc.
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
