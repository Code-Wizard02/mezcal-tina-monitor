
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VatHistoryPoint } from "@/types/vat";

interface VatChartProps {
  data: VatHistoryPoint[];
  metric: "temperature" | "pH" | "liquidLevel";
  title: string;
  color: string;
}

const metricConfig = {
  temperature: {
    unit: "°C",
    label: "Temperatura",
    domain: [10, 40],
  },
  pH: {
    unit: "",
    label: "pH",
    domain: [3, 7],
  },
  liquidLevel: {
    unit: "%",
    label: "Nivel de Líquido",
    domain: [0, 100],
  }
};

const formatDate = (date: Date) => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const VatChart = ({ data, metric, title, color }: VatChartProps) => {
  const formattedData = data.map(point => ({
    ...point,
    formattedTime: formatDate(new Date(point.timestamp)),
  }));
  
  const config = metricConfig[metric];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="formattedTime" 
              label={{ value: 'Tiempo', position: 'insideBottomRight', offset: -10 }} 
              minTickGap={30}
            />
            <YAxis 
              domain={config.domain}
              label={{ 
                value: `${config.label} (${config.unit})`, 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip 
              formatter={(value: number) => [`${value}${config.unit}`, config.label]}
              labelFormatter={(time) => `Hora: ${time}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={color}
              activeDot={{ r: 8 }}
              name={config.label}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VatChart;
