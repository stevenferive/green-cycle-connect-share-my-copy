import { useState, useEffect, useCallback } from 'react';
import { webSocketService } from '@/services/websocketService';
import { getCurrentUser } from '@/lib/auth-service';
import { toast } from '@/hooks/use-toast';

interface UseSocketReturn {
  isConnected: boolean;
  connectionState: {
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  };
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  markMessageAsRead: (messageId: string, chatId: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState({
    connected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  });

  const currentUser = getCurrentUser();

  // Actualizar estado de conexión
  const updateConnectionState = useCallback(() => {
    const connected = webSocketService.isConnected();
    const state = webSocketService.getConnectionState();
    
    setIsConnected(connected);
    setConnectionState(state);
  }, []);

  // Conectar al WebSocket
  const connect = useCallback(async (): Promise<void> => {
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      await webSocketService.connect();
      updateConnectionState();
      
      toast({
        title: "Conectado",
        description: "Chat en tiempo real activado",
      });
    } catch (error: any) {
      console.error('Error al conectar WebSocket:', error);
      updateConnectionState();
      
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar al chat en tiempo real",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [currentUser, updateConnectionState]);

  // Desconectar del WebSocket
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    updateConnectionState();
  }, [updateConnectionState]);

  // Reconectar al WebSocket
  const reconnect = useCallback(async (): Promise<void> => {
    try {
      await webSocketService.reconnect();
      updateConnectionState();
      
      toast({
        title: "Reconectado",
        description: "Conexión al chat restablecida",
      });
    } catch (error: any) {
      console.error('Error al reconectar WebSocket:', error);
      updateConnectionState();
      
      toast({
        title: "Error de reconexión",
        description: "No se pudo restablecer la conexión",
        variant: "destructive",
      });
      
      throw error;
    }
  }, [updateConnectionState]);

  // Unirse a un chat
  const joinChat = useCallback((chatId: string) => {
    if (webSocketService.isConnected()) {
      webSocketService.joinChat(chatId);
    }
  }, []);

  // Salir de un chat
  const leaveChat = useCallback((chatId: string) => {
    if (webSocketService.isConnected()) {
      webSocketService.leaveChat(chatId);
    }
  }, []);

  // Enviar evento de typing
  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    if (webSocketService.isConnected()) {
      webSocketService.sendTyping(chatId, isTyping);
    }
  }, []);

  // Marcar mensaje como leído
  const markMessageAsRead = useCallback((messageId: string, chatId: string) => {
    if (webSocketService.isConnected()) {
      webSocketService.markMessageAsRead(messageId, chatId);
    }
  }, []);

  // Configurar listeners y auto-conexión
  useEffect(() => {
    if (!currentUser) return;

    // Configurar listeners para eventos de conexión
    const onConnect = () => {
      console.log('WebSocket conectado');
      updateConnectionState();
    };

    const onDisconnect = () => {
      console.log('WebSocket desconectado');
      updateConnectionState();
    };

    const onError = (error: any) => {
      console.error('Error de WebSocket:', error);
      updateConnectionState();
    };

    // Registrar listeners usando el sistema de eventos del WebSocketService
    webSocketService.on('connect', onConnect);
    webSocketService.on('disconnect', onDisconnect);
    webSocketService.on('error', onError);

    // Auto-conectar si no está conectado
    if (!webSocketService.isConnected()) {
      connect().catch(error => {
        console.error('Error en auto-conexión:', error);
      });
    } else {
      updateConnectionState();
    }

    // Cleanup
    return () => {
      webSocketService.off('connect', onConnect);
      webSocketService.off('disconnect', onDisconnect);
      webSocketService.off('error', onError);
    };
  }, [currentUser, connect, updateConnectionState]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      // No desconectamos automáticamente ya que otros componentes pueden estar usando la conexión
      // webSocketService.disconnect();
    };
  }, []);

  // Monitorear cambios en el estado de conexión periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      updateConnectionState();
    }, 5000); // Cada 5 segundos

    return () => clearInterval(interval);
  }, [updateConnectionState]);

  return {
    isConnected,
    connectionState,
    connect,
    disconnect,
    reconnect,
    joinChat,
    leaveChat,
    sendTyping,
    markMessageAsRead
  };
}; 