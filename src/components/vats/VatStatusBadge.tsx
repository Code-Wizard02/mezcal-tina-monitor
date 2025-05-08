
import { Badge } from "@/components/ui/badge";
import { VatStatus } from "@/types/vat";

const statusLabels: Record<VatStatus, string> = {
  fermentation: "Fermentación",
  distillation: "Destilación",
  rest: "Reposo",
  complete: "Completado"
};

interface VatStatusBadgeProps {
  status: VatStatus;
}

const VatStatusBadge = ({ status }: VatStatusBadgeProps) => {
  return (
    <Badge className={`vat-status-${status} border`} variant="outline">
      {statusLabels[status]}
    </Badge>
  );
};

export default VatStatusBadge;
