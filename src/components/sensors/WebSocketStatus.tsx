
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi } from "lucide-react";
import { webSocketService } from "@/services/websocket";

const WebSocketStatus = () => {
  const [connected, setConnected] = useState<boolean>(false);
  
  useEffect(() => {
    const checkConnection = () => {
      // This is a mock implementation - in a real app you'd check the websocket state
      setConnected(Math.random() > 0.3); // Randomly show connected/disconnected for demo
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    
    // Subscribe to connection status changes
    webSocketService.subscribe("connection:status", (status: { connected: boolean }) => {
      setConnected(status.connected);
    });
    
    return () => {
      clearInterval(interval);
      webSocketService.unsubscribe("connection:status", () => {});
    };
  }, []);
  
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-2 ${
        connected ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"
      }`}
    >
      <Wifi className={`h-4 w-4 ${connected ? "" : "text-red-500"}`} />
      <span>{connected ? "Sensores conectados" : "Sensores desconectados"}</span>
      <span className={`inline-block h-2 w-2 rounded-full ${connected ? "bg-green-500 animate-pulse-slow" : "bg-red-500"}`}></span>
    </Badge>
  );
};

export default WebSocketStatus;
