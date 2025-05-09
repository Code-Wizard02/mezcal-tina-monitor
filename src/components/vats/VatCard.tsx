
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, Clock, Calendar, FlaskConical } from "lucide-react";
import { Vat } from "@/types/vat";
import VatStatusBadge from "./VatStatusBadge";

interface VatCardProps {
  vat: Vat;
  temperature: number;
  pH: number;
  liquidLevel: number;
  fermentationTime: number; // hours
}

const VatCard = ({ vat, temperature, pH, liquidLevel, fermentationTime }: VatCardProps) => {
  return (
    <Link to={`/vats/${vat.id}`}>
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{vat.name}</CardTitle>
            <VatStatusBadge status={vat.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-mezcal-amber" />
              <span>{temperature}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span>pH</span>
              <span>{pH}</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-blue-500" />
              <span>{liquidLevel}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-mezcal-green" />
              <span>{fermentationTime}h</span>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-mezcal-terracotta" />
              <span>Agave: {vat.agaveType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Capacidad: {vat.capacity} L</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Actualizado: {vat.lastUpdated.toLocaleTimeString()}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default VatCard;
