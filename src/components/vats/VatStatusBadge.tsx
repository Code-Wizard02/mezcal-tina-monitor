
import { Badge } from "@/components/ui/badge";
import { VatStatus } from "@/types/vat";

const statusLabels: Record<VatStatus, string> = {
  fermentando: "Fermentando",
  destilando: "Destilando",
  reposando: "Reposando",
  vacio: "Disponible"
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
