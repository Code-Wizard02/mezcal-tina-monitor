import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Wifi, Thermometer, BarChart, Droplet } from "lucide-react";
import WebSocketStatus from "@/components/sensors/WebSocketStatus";
import { webSocketService } from "@/services/websocket";

const SensorSetup = () => {
  const [serverUrl, setServerUrl] = useState<string>("ws://localhost:8080");
  const [interval, setInterval] = useState<number>(5);
  const [autoConnect, setAutoConnect] = useState<boolean>(false);
  const [sensorStatus, setSensorStatus] = useState<Record<string, boolean>>({
    temperature: true,
    ph: true,
    liquidLevel: true
  });

  const handleConnect = () => {
    if (!serverUrl) {
      toast.error("URL del servidor es requerida");
      return;
    }
    
    toast.info(`Conectando a ${serverUrl}...`);
    // In a real app, this would actually connect to the WebSocket server
    webSocketService.connect();
    
    setTimeout(() => {
      toast.success("Conectado al servidor de sensores");
    }, 1500);
  };

  const handleDisconnect = () => {
    toast.info("Desconectando...");
    webSocketService.disconnect();
    setTimeout(() => {
      toast.success("Desconectado del servidor de sensores");
    }, 800);
  };
  
  const handleSaveConfig = () => {
    toast.success("Configuración guardada correctamente");
  };
  
  const handleTestSensor = (sensorType: string) => {
    toast.info(`Probando sensor de ${sensorType}...`);
    
    setTimeout(() => {
      toast.success(`Sensor de ${sensorType} funcionando correctamente`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Configuración de Sensores</h2>
        <WebSocketStatus />
      </div>
      
      <Tabs defaultValue="connection">
        <TabsList>
          <TabsTrigger value="connection">Conexión</TabsTrigger>
          <TabsTrigger value="sensors">Sensores</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Conexión a ESP32</CardTitle>
              <CardDescription>
                Configure la conexión con el sistema de sensores ESP32 vía WebSocket
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-url">URL del Servidor WebSocket</Label>
                <Input
                  id="server-url"
                  placeholder="ws://your-esp32-server:port"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  La dirección del servidor WebSocket del ESP32
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interval">Intervalo de Actualización (segundos)</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  max="60"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-connect"
                  checked={autoConnect}
                  onCheckedChange={setAutoConnect}
                />
                <Label htmlFor="auto-connect">Conectar automáticamente al iniciar</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleDisconnect}>Desconectar</Button>
              <Button onClick={handleConnect}>Conectar</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="sensors" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-mezcal-amber" />
                  Sensor de Temperatura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temp-sensor">Activado</Label>
                  <Switch
                    id="temp-sensor"
                    checked={sensorStatus.temperature}
                    onCheckedChange={(checked) => setSensorStatus({...sensorStatus, temperature: checked})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temp-calibration">Factor de Calibración</Label>
                  <Input id="temp-calibration" type="number" step="0.1" defaultValue="1.0" />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleTestSensor("temperatura")}
                  disabled={!sensorStatus.temperature}
                >
                  Probar Sensor
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lg font-bold text-mezcal-green">pH</span>
                  Sensor de pH
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ph-sensor">Activado</Label>
                  <Switch
                    id="ph-sensor"
                    checked={sensorStatus.ph}
                    onCheckedChange={(checked) => setSensorStatus({...sensorStatus, ph: checked})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph-calibration">Factor de Calibración</Label>
                  <Input id="ph-calibration" type="number" step="0.1" defaultValue="1.0" />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleTestSensor("pH")}
                  disabled={!sensorStatus.ph}
                >
                  Probar Sensor
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  Sensor de Nivel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="level-sensor">Activado</Label>
                  <Switch
                    id="level-sensor"
                    checked={sensorStatus.liquidLevel}
                    onCheckedChange={(checked) => setSensorStatus({...sensorStatus, liquidLevel: checked})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level-calibration">Factor de Calibración</Label>
                  <Input id="level-calibration" type="number" step="0.1" defaultValue="1.0" />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleTestSensor("nivel de líquido")}
                  disabled={!sensorStatus.liquidLevel}
                >
                  Probar Sensor
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Alertas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="max-temp">Temperatura Máxima (°C)</Label>
                  <Input id="max-temp" type="number" defaultValue="35" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-temp">Temperatura Mínima (°C)</Label>
                  <Input id="min-temp" type="number" defaultValue="25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-ph">pH Máximo</Label>
                  <Input id="max-ph" type="number" step="0.1" defaultValue="5.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-ph">pH Mínimo</Label>
                  <Input id="min-ph" type="number" step="0.1" defaultValue="3.5" />
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Switch id="enable-notifications" defaultChecked={true} />
                <Label htmlFor="enable-notifications">Activar notificaciones de alerta</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveConfig} className="w-full">Guardar Configuración</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Configuración de Datos
              </CardTitle>
              <CardDescription>
                Personalice cómo se almacenan y visualizan los datos de los sensores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-retention">Retención de Datos (días)</Label>
                <Input id="data-retention" type="number" min="1" defaultValue="30" />
                <p className="text-sm text-muted-foreground">
                  Cuánto tiempo se guardarán los datos históricos
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sampling-rate">Frecuencia de Muestreo (segundos)</Label>
                <Input id="sampling-rate" type="number" min="1" defaultValue="60" />
                <p className="text-sm text-muted-foreground">
                  Cada cuántos segundos se capturarán los datos de los sensores
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Switch id="compress-data" defaultChecked={true} />
                <Label htmlFor="compress-data">Comprimir datos históricos antiguos</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveConfig} className="w-full">Guardar Configuración</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Exportar Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Exporte los datos capturados para análisis externos o respaldo
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  Exportar CSV
                </Button>
                <Button variant="outline" className="w-full">
                  Exportar JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SensorSetup;
