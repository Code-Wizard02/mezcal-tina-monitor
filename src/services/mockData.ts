
import { Vat, VatHistory, VatStatus } from "@/types/vat";
import { Sensor, SensorType, SensorStatus } from "@/types/sensor";
import { Batch, BatchStatus } from "@/types/batch";
import { Alert, AlertStatus } from "@/types/alert";
import { Valve, ValveType, ValveStatus } from "@/types/valve";
import { Reading } from "@/types/reading";

// Utility to get a random number between min and max
const getRandomNumber = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

// Generate mock vat data
export const generateMockVats = (count: number = 6): Vat[] => {
  const agaveTypes = ["Espadin", "Madre cuishe", "Cuishe", "Jabali", "Mexicano", "Arroqueño", "Tobala", "Tepextate", "Tequilero"];
  const statuses: VatStatus[] = ["fermentando", "destilando", "reposando", "vacio"];
  
  return Array.from({ length: count }, (_, i) => {
    const now = new Date();
    const createdAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within the last 30 days
    
    return {
      id: `vat-${i + 1}`,
      name: `Tina #${i + 1}`,
      capacity: getRandomNumber(500, 2000),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      agaveType: agaveTypes[Math.floor(Math.random() * agaveTypes.length)],
      createdAt,
      lastUpdated: new Date(),
    };
  });
};

// Generate historical data for a vat
export const generateVatHistory = (vatId: string, days: number = 7): VatHistory => {
  const data = [];
  const now = new Date();
  const millisecondsPerHour = 60 * 60 * 1000;
  
  for (let i = days * 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * millisecondsPerHour);
    data.push({
      timestamp,
      temperature: getRandomNumber(25, 35),
      pH: getRandomNumber(3.5, 5.5),
      liquidLevel: getRandomNumber(50, 100),
    });
  }
  
  return {
    vatId,
    data,
  };
};

// Generate mock sensors
export const generateMockSensors = (vats: Vat[]): Sensor[] => {
  const sensorTypes: SensorType[] = ["temperatura", "pH", "nivel"];
  const statuses: SensorStatus[] = ["conectado", "desconectado", "actualizando"];
  
  const sensors: Sensor[] = [];
  
  vats.forEach(vat => {
    // Each vat has all sensor types
    sensorTypes.forEach(type => {
      sensors.push({
        id: `sensor-${vat.id}-${type}`,
        vatId: vat.id,
        sensorType: type,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        currentReading: type === "temperatura" ? getRandomNumber(25, 35) : 
                        type === "pH" ? getRandomNumber(3.5, 5.5) : 
                        getRandomNumber(50, 100),
        lastReadingAt: new Date(),
      });
    });
  });
  
  return sensors;
};

// Generate mock readings
export const generateMockReadings = (sensors: Sensor[], count: number = 20): Reading[] => {
  const readings: Reading[] = [];
  
  sensors.forEach(sensor => {
    for(let i = 0; i < count; i++) {
      const timestamp = new Date(Date.now() - i * 3600 * 1000); // One hour intervals
      
      const reading: Reading = {
        id: `reading-${sensor.id}-${i}`,
        sensorId: sensor.id,
        timestamp,
      };
      
      // Set the appropriate value based on sensor type
      if (sensor.sensorType === "temperatura") {
        reading.temperature = getRandomNumber(25, 35);
      } else if (sensor.sensorType === "pH") {
        reading.pH = getRandomNumber(3.5, 5.5);
      } else if (sensor.sensorType === "nivel") {
        reading.liquidLevel = getRandomNumber(50, 100);
      }
      
      readings.push(reading);
    }
  });
  
  return readings;
};

// Generate mock batches
export const generateMockBatches = (vats: Vat[]): Batch[] => {
  const batches: Batch[] = [];
  
  vats.forEach(vat => {
    if (vat.status !== 'vacio') {
      const startDate = new Date(vat.createdAt);
      
      batches.push({
        id: `batch-${vat.id}`,
        vatId: vat.id,
        agaveType: vat.agaveType,
        startDate,
        endDate: vat.status === 'reposando' ? new Date() : null,
        status: vat.status === 'reposando' ? 'finalizado' : 'en_proceso',
        notes: `Lote de ${vat.agaveType} en ${vat.name}. Proceso iniciado el ${startDate.toLocaleDateString()}.`,
      });
    }
  });
  
  return batches;
};

// Generate mock alerts
export const generateMockAlerts = (vats: Vat[], sensors: Sensor[], count: number = 10): Alert[] => {
  const alerts: Alert[] = [];
  const alertMessages = [
    "Temperatura elevada detectada",
    "Nivel de pH fuera de rango",
    "Bajo nivel de líquido",
    "Sobrepresión detectada",
    "Conexión del sensor perdida",
    "Error en la lectura del sensor"
  ];
  
  for(let i = 0; i < count; i++) {
    const randomVat = vats[Math.floor(Math.random() * vats.length)];
    const vatSensors = sensors.filter(s => s.vatId === randomVat.id);
    const randomSensor = vatSensors[Math.floor(Math.random() * vatSensors.length)];
    const isRead = Math.random() > 0.5;
    
    alerts.push({
      id: `alert-${i}`,
      vatId: randomVat.id,
      sensorId: randomSensor.id,
      message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last 7 days
      status: isRead ? 'leida' : 'no_leida',
      readAt: isRead ? new Date() : null,
      readBy: isRead ? 'user-1' : null,
    });
  }
  
  return alerts;
};

// Generate mock valves
export const generateMockValves = (vats: Vat[]): Valve[] => {
  const valves: Valve[] = [];
  
  vats.forEach(vat => {
    // Each vat has a hot and cold valve
    ["caliente", "frio"].forEach((type: ValveType) => {
      valves.push({
        id: `valve-${vat.id}-${type}`,
        vatId: vat.id,
        valveType: type,
        status: Math.random() > 0.7 ? 'abierto' : 'cerrado',
        lastActionBy: 'user-1',
        lastActionAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Within last 24 hours
      });
    });
  });
  
  return valves;
};

// Calculate fermentation time in hours
export const calculateFermentationTime = (startDate: Date): number => {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - startDate.getTime();
  return Math.floor(diffInMilliseconds / (1000 * 60 * 60));
};

// Initialize mock data
export const mockVats = generateMockVats();
export const mockSensors = generateMockSensors(mockVats);
export const mockReadings = generateMockReadings(mockSensors);
export const mockBatches = generateMockBatches(mockVats);
export const mockAlerts = generateMockAlerts(mockVats, mockSensors);
export const mockValves = generateMockValves(mockVats);
export const mockVatHistories = mockVats.map(vat => generateVatHistory(vat.id));

// Create a function to get the latest readings for a specific vat
export const getLatestVatReadings = (vatId: string) => {
  const vatSensors = mockSensors.filter(sensor => sensor.vatId === vatId);
  
  let temperature = 0;
  let pH = 0;
  let liquidLevel = 0;
  
  vatSensors.forEach(sensor => {
    if (sensor.sensorType === "temperatura") temperature = sensor.currentReading;
    if (sensor.sensorType === "pH") pH = sensor.currentReading;
    if (sensor.sensorType === "nivel") liquidLevel = sensor.currentReading;
  });
  
  return { temperature, pH, liquidLevel };
};

// Get batch for a specific vat
export const getVatBatch = (vatId: string) => {
  return mockBatches.find(batch => batch.vatId === vatId);
};

// Calculate fermentation time for a specific vat
export const getVatFermentationTime = (vatId: string): number => {
  const batch = getVatBatch(vatId);
  if (!batch) return 0;
  
  return calculateFermentationTime(batch.startDate);
};
