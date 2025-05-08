
import { toast } from "sonner";
import { Vat } from "@/types/vat";

const WEBSOCKET_URL = "ws://localhost:8080"; // Replace with actual WebSocket server in production

interface WebSocketMessage {
  type: string;
  payload: any;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();
  
  public connect(): void {
    try {
      this.socket = new WebSocket(WEBSOCKET_URL);
      
      this.socket.onopen = () => {
        console.log("WebSocket connected");
        toast.success("Conectado a los sensores");
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };
      
      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };
      
      this.socket.onclose = () => {
        console.log("WebSocket disconnected");
        toast.error("Conexión con sensores perdida, intentando reconectar...");
        this.scheduleReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast.error("Error en la conexión con sensores");
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
      this.scheduleReconnect();
    }
  }
  
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  
  public subscribe(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(callback);
  }
  
  public unsubscribe(event: string, callback: (data: any) => void): void {
    const callbacks = this.listeners.get(event);
    
    if (callbacks) {
      this.listeners.set(event, callbacks.filter(cb => cb !== callback));
    }
  }
  
  public sendMessage(type: string, payload: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = { type, payload };
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket not connected");
    }
  }
  
  private handleMessage(message: WebSocketMessage): void {
    const { type, payload } = message;
    const callbacks = this.listeners.get(type);
    
    if (callbacks) {
      callbacks.forEach(callback => callback(payload));
    }
  }
  
  private scheduleReconnect(): void {
    if (!this.reconnectTimer) {
      this.reconnectTimer = window.setTimeout(() => {
        console.log("Attempting to reconnect WebSocket...");
        this.connect();
      }, 5000);
    }
  }
}

export const webSocketService = new WebSocketService();

export const useWebSocketForVat = (vatId: string, onVatUpdate: (data: Partial<Vat>) => void) => {
  webSocketService.subscribe(`vat:${vatId}:update`, onVatUpdate);
  return () => {
    webSocketService.unsubscribe(`vat:${vatId}:update`, onVatUpdate);
  };
};
