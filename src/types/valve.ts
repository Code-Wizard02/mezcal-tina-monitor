
export type ValveType = 'caliente' | 'frio';
export type ValveStatus = 'abierto' | 'cerrado';

export interface Valve {
  id: string;
  vatId: string;
  valveType: ValveType;
  status: ValveStatus;
  lastActionBy: string; // userId
  lastActionAt: Date;
}
