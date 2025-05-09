
export interface Reading {
  id: string;
  sensorId: string;
  temperature?: number;
  pH?: number;
  liquidLevel?: number;
  timestamp: Date;
}
