
export type SensorType = 'temperatura' | 'pH' | 'nivel';
export type SensorStatus = 'conectado' | 'desconectado' | 'actualizando';

export interface Sensor {
  id: string;
  vatId: string;
  sensorType: SensorType;
  status: SensorStatus;
  currentReading: number;
  lastReadingAt: Date;
}
