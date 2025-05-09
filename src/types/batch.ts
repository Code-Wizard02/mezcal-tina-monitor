
export type BatchStatus = 'finalizado' | 'en_proceso';

export interface Batch {
  id: string;
  vatId: string;
  agaveType: string;
  startDate: Date;
  endDate: Date | null;
  status: BatchStatus;
  notes: string;
}
