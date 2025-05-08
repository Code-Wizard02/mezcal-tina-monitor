
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockVats } from "@/services/mockData";
import { Vat } from "@/types/vat";

// Mock report data
const mockReportData = {
  weekly: [
    { name: "Tina 1", efficiency: 92, avgTemp: 28.3, avgPh: 4.5, status: "fermentation" },
    { name: "Tina 2", efficiency: 87, avgTemp: 27.9, avgPh: 4.3, status: "distillation" },
    { name: "Tina 3", efficiency: 93, avgTemp: 29.1, avgPh: 4.7, status: "rest" },
    { name: "Tina 4", efficiency: 89, avgTemp: 28.5, avgPh: 4.4, status: "complete" },
  ],
  monthly: [
    { name: "Tina 1", efficiency: 90, avgTemp: 28.5, avgPh: 4.6, status: "fermentation" },
    { name: "Tina 2", efficiency: 85, avgTemp: 27.8, avgPh: 4.2, status: "distillation" },
    { name: "Tina 3", efficiency: 91, avgTemp: 29.0, avgPh: 4.8, status: "rest" },
    { name: "Tina 4", efficiency: 88, avgTemp: 28.3, avgPh: 4.5, status: "complete" },
    { name: "Tina 5", efficiency: 92, avgTemp: 28.7, avgPh: 4.4, status: "fermentation" },
  ]
};

const Reports = () => {
  const [timeframe, setTimeframe] = useState("weekly");
  const [selectedType, setSelectedType] = useState("all");
  
  // Filter vats based on selected agave type
  const filteredVats = selectedType === "all" 
    ? mockVats 
    : mockVats.filter(vat => vat.agaveType === selectedType);
  
  // Get unique agave types
  const agaveTypes = ["all", ...Array.from(new Set(mockVats.map(vat => vat.agaveType)))];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Reportes</h2>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="efficiency">Eficiencia</TabsTrigger>
            <TabsTrigger value="comparison">Comparación</TabsTrigger>
          </TabsList>
          
          <div className="my-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Período
                </label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Tipo de Agave
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de Agave" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {agaveTypes.filter(type => type !== "all").map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Summary Tab Content */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tinas Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-mezcal-amber">
                    {filteredVats.filter(vat => vat.status !== "complete").length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    De un total de {filteredVats.length} tinas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Temperatura Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-mezcal-green">
                    {(filteredVats.reduce((acc, vat) => acc + vat.temperature, 0) / filteredVats.length).toFixed(1)}°C
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Rango óptimo: 26°C - 32°C
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nivel de pH Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-mezcal-terracotta">
                    {(filteredVats.reduce((acc, vat) => acc + vat.pH, 0) / filteredVats.length).toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Rango óptimo: 3.5 - 5.5
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Estados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around items-center h-64">
                  {(["fermentation", "distillation", "rest", "complete"] as Vat["status"][]).map(status => {
                    const count = filteredVats.filter(vat => vat.status === status).length;
                    const percentage = (count / filteredVats.length) * 100;
                    
                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div className="text-sm text-muted-foreground mb-2">
                          {status === "fermentation" ? "Fermentación" :
                           status === "distillation" ? "Destilación" :
                           status === "rest" ? "Reposo" : "Completado"}
                        </div>
                        <div className="relative w-20">
                          <div className="absolute bottom-0 w-full bg-muted rounded-t-sm" style={{ height: `${Math.max(5, percentage)}%` }}>
                            <div className={`w-full h-full vat-status-${status}`}></div>
                          </div>
                        </div>
                        <div className="mt-2 font-medium">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Efficiency Tab Content */}
          <TabsContent value="efficiency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Eficiencia de Producción</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th className="px-6 py-3">Tina</th>
                        <th className="px-6 py-3">Eficiencia</th>
                        <th className="px-6 py-3">Temp. Prom.</th>
                        <th className="px-6 py-3">pH Prom.</th>
                        <th className="px-6 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockReportData[timeframe as keyof typeof mockReportData].map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-6 py-4 font-medium">{item.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-mezcal-amber h-2.5 rounded-full" style={{ width: `${item.efficiency}%` }}></div>
                              </div>
                              <span className="ml-2">{item.efficiency}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{item.avgTemp}°C</td>
                          <td className="px-6 py-4">{item.avgPh}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs vat-status-${item.status}`}>
                              {item.status === "fermentation" ? "Fermentación" :
                              item.status === "distillation" ? "Destilación" :
                              item.status === "rest" ? "Reposo" : "Completado"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Comparison Tab Content */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparación por Tipo de Agave</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    Gráficos de comparación disponibles en la próxima actualización
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tiempo de Fermentación por Tina</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    Gráficos de comparación disponibles en la próxima actualización
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
