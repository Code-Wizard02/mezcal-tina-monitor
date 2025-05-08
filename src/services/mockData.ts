
import { Vat, VatHistory } from "@/types/vat";

// Utility to get a random number between min and max
const getRandomNumber = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

// Generate mock vat data
export const generateMockVats = (count: number = 6): Vat[] => {
  const agaveTypes = ["Espadín", "Tobalá", "Cuishe", "Tepeztate", "Madrecuishe", "Jabalí"];
  const statuses: Array<Vat["status"]> = ["fermentation", "distillation", "rest", "complete"];
  
  return Array.from({ length: count }, (_, i) => {
    const now = new Date();
    const createdAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date within the last 30 days
    
    return {
      id: `vat-${i + 1}`,
      name: `Tina ${i + 1}`,
      temperature: getRandomNumber(25, 35),
      pH: getRandomNumber(3.5, 5.5),
      liquidLevel: getRandomNumber(50, 100),
      fermentationTime: getRandomNumber(24, 120),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      agaveType: agaveTypes[Math.floor(Math.random() * agaveTypes.length)],
      agaveAge: getRandomNumber(6, 12),
      createdAt,
      lastUpdated: new Date(),
    };
  });
};

// Generate historical data for a vat
export const generateVatHistory = (vatId: string, days: number = 7): VatHistory => {
  const data: VatHistory["data"] = [];
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

export const mockVats = generateMockVats();
export const mockVatHistories = mockVats.map(vat => generateVatHistory(vat.id));
