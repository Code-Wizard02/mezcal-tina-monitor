
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { mockVats, getLatestVatReadings, getVatFermentationTime } from "@/services/mockData";
import { Vat } from "@/types/vat";
import VatCard from "@/components/vats/VatCard";
import WebSocketStatus from "@/components/sensors/WebSocketStatus";
import { webSocketService } from "@/services/websocket";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [vats, setVats] = useState<Vat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast: toastNotification } = useToast();

  useEffect(() => {
    // Simulate loading data
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real application, fetch from API instead
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setVats(mockVats);
      } catch (error) {
        console.error("Failed to fetch vats:", error);
        toastNotification({
          title: "Error",
          description: "No se pudieron cargar las tinas",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Connect to WebSocket for real-time updates
    webSocketService.connect();
    
    // Subscribe to vat updates
    webSocketService.subscribe("vat:all:update", (updatedVats: Partial<Vat>[]) => {
      setVats(currentVats => 
        currentVats.map(vat => {
          const updatedVat = updatedVats.find(u => u.id === vat.id);
          return updatedVat ? { ...vat, ...updatedVat, lastUpdated: new Date() } : vat;
        })
      );
    });
    
    return () => {
      webSocketService.unsubscribe("vat:all:update", () => {});
    };
  }, [toastNotification]);

  const handleCreateVat = () => {
    toast.info("Funcionalidad para crear nueva tina en desarrollo");
  };
  
  const handleCreateSensor = () => {
    toast.info("Funcionalidad para crear nuevo sensor en desarrollo");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Monitoreo de Tinas</h2>
        <div className="flex gap-4">
          <Button onClick={handleCreateSensor} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Crear Sensor
          </Button>
          <Button onClick={handleCreateVat} className="gap-2">
            <Plus className="h-4 w-4" /> Crear Tina
          </Button>
          <WebSocketStatus />
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vats.map((vat) => {
            const { temperature, pH, liquidLevel } = getLatestVatReadings(vat.id);
            const fermentationTime = getVatFermentationTime(vat.id);
            
            return (
              <VatCard
                key={vat.id} 
                vat={vat}
                temperature={temperature}
                pH={pH}
                liquidLevel={liquidLevel}
                fermentationTime={fermentationTime}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
