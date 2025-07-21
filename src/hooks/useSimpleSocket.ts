import { useState, useEffect, useCallback, useRef } from 'react';
import { webSocketService } from '@/services/websocketService';
import { getCurrentUser } from '@/lib/auth-service';

interface UseSimpleSocketReturn {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
}

export const useSimpleSocket = (): UseSimpleSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const currentUser = getCurrentUser();
  const initRef = useRef(false);

  // Conectar al WebSocket
  const connect = useCallback(async (): Promise<void> => {
    if (!currentUser || webSocketService.isConnected()) return;
    
    try {
      await webSocketService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      setIsConnected(false);
    }
  }, [currentUser]);

  // Desconectar del WebSocket
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
  }, []);

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

  // Inicializar conexión una sola vez
  useEffect(() => {
    if (!currentUser || initRef.current) return;
    
    initRef.current = true;
    
    // Conectar automáticamente
    connect();

    // Actualizar estado de conexión
    const updateConnectionState = () => {
      setIsConnected(webSocketService.isConnected());
    };

    // Listeners simples
    const onConnect = () => updateConnectionState();
    const onDisconnect = () => updateConnectionState();

    webSocketService.on('connect', onConnect);
    webSocketService.on('disconnect', onDisconnect);

    return () => {
      webSocketService.off('connect', onConnect);
      webSocketService.off('disconnect', onDisconnect);
    };
  }, []); // Sin dependencias para evitar bucles

  return {
    isConnected,
    connect,
    disconnect,
    joinChat,
    leaveChat
  };
}; 