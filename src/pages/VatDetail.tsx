
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Calendar, ArrowLeft, Droplet, Thermometer, FlaskConical, FlaskRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockVats, generateVatHistory, getLatestVatReadings, getVatBatch, getVatFermentationTime } from "@/services/mockData";
import { Vat, VatHistory } from "@/types/vat";
import VatStatusBadge from "@/components/vats/VatStatusBadge";
import VatChart from "@/components/charts/VatChart";
import { useWebSocketForVat } from "@/services/websocket";
import { Separator } from "@/components/ui/separator";
import { Batch } from "@/types/batch";

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const VatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vat, setVat] = useState<Vat | null>(null);
  const [vatHistory, setVatHistory] = useState<VatHistory | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [readings, setReadings] = useState({ temperature: 0, pH: 0, liquidLevel: 0 });
  const [fermentationTime, setFermentationTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find the vat by id in mock data
        const foundVat = mockVats.find(v => v.id === id);
        
        if (foundVat) {
          setVat(foundVat);
          
          // Get batch information
          const foundBatch = getVatBatch(foundVat.id);
          setBatch(foundBatch || null);
          
          // Get latest readings
          const latestReadings = getLatestVatReadings(foundVat.id);
          setReadings(latestReadings);
          
          // Get fermentation time
          const time = getVatFermentationTime(foundVat.id);
          setFermentationTime(time);
          
          // Get historical data
          const history = generateVatHistory(foundVat.id);
          setVatHistory(history);
        } else {
          navigate('/not-found');
        }
      } catch (error) {
        console.error("Failed to fetch vat data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, navigate]);
  
  // Set up WebSocket subscription for this vat
  useEffect(() => {
    if (vat) {
      const unsubscribe = useWebSocketForVat(vat.id, (updatedData) => {
        setVat(current => current ? { ...current, ...updatedData, lastUpdated: new Date() } : null);
      });
      
      return unsubscribe;
    }
  }, [vat]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-muted animate-pulse rounded-md"></div>
          <div className="h-48 bg-muted animate-pulse rounded-md lg:col-span-2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-muted animate-pulse rounded-md"></div>
          <div className="h-72 bg-muted animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!vat || !vatHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-xl mb-4">Tina no encontrada</h2>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Dashboard
      </Button>
      
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl font-bold">{vat.name}</h2>
        <VatStatusBadge status={vat.status} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Agave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Agave</p>
              <p className="font-medium">{vat.agaveType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacidad de la Tina</p>
              <p className="font-medium">{vat.capacity} L</p>
            </div>
            {batch && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Inicio del Proceso</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{formatDate(batch.startDate)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notas</p>
                  <p className="text-sm">{batch.notes}</p>
                </div>
              </>
            )}
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Tina Creada</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p>{formatDate(vat.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Última Actualización</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p>{formatDate(vat.lastUpdated)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Valores Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center p-4 bg-mezcal-amber/10 rounded-md">
                <Thermometer className="h-8 w-8 text-mezcal-amber mb-2" />
                <p className="text-sm text-muted-foreground">Temperatura</p>
                <p className="text-2xl font-medium">{readings.temperature}°C</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-mezcal-green/10 rounded-md">
                <span className="text-xl font-bold mb-2 text-mezcal-green">pH</span>
                <p className="text-sm text-muted-foreground">Nivel Acidez</p>
                <p className="text-2xl font-medium">{readings.pH}</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-blue-500/10 rounded-md">
                <Droplet className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm text-muted-foreground">Nivel Líquido</p>
                <p className="text-2xl font-medium">{readings.liquidLevel}%</p>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-mezcal-terracotta/10 rounded-md">
                <Clock className="h-8 w-8 text-mezcal-terracotta mb-2" />
                <p className="text-sm text-muted-foreground">Tiempo Fermentación</p>
                <p className="text-2xl font-medium">{fermentationTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VatChart 
          data={vatHistory.data} 
          metric="temperature" 
          title="Historial de Temperatura" 
          color="#F5A623" 
        />
        <VatChart 
          data={vatHistory.data} 
          metric="pH" 
          title="Historial de pH" 
          color="#2E7D32" 
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <VatChart 
          data={vatHistory.data} 
          metric="liquidLevel" 
          title="Historial de Nivel de Líquido" 
          color="#0EA5E9" 
        />
      </div>
    </div>
  );
};

export default VatDetail;
