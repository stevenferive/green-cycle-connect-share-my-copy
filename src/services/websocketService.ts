import { io, Socket } from 'socket.io-client';
import { 
  TypingEvent, 
  NewMessageEvent, 
  UserTypingEvent, 
  MessageReadEvent,
  UserOnlineEvent,
  Message 
} from '@/types/chat';

type EventCallback<T = any> = (data: T) => void;

export class WebSocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  // Callbacks para eventos
  private eventCallbacks: { [event: string]: EventCallback[] } = {};

  // Conectar al WebSocket
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        reject(new Error('No authentication token found'));
        return;
      }

      this.socket = io('http://localhost:3000/chats', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      }).connect();

      this.setupEventListeners();

      this.socket.on('connect', () => {
        console.log('🟢 WebSocket conectado exitosamente');
        console.log('🔗 Socket ID:', this.socket?.id);
        this.connected = true;
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔴 Error de conexión WebSocket:', error);
        console.error('🔄 Intento de reconexión:', this.reconnectAttempts + 1, '/', this.maxReconnectAttempts);
        this.connected = false;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
          }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
        } else {
          reject(error);
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
        this.connected = false;
        
        // Reintentar conexión automáticamente si no fue desconexión manual
        if (reason !== 'io client disconnect' && this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
          }, this.reconnectDelay);
        }
      });
    });
  }

  // Configurar listeners de eventos
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Evento de nuevo mensaje
    this.socket.on('newMessage', (data: any) => {
      console.log('📨 Nuevo mensaje recibido:', data);
      
      // Convertir el formato del backend al formato esperado por el frontend
      const formattedData: NewMessageEvent = {
        chatId: data.chatId,
        message: {
          _id: data.messageId,
          content: data.content,
          sender: data.sender,
          createdAt: data.createdAt,
          isRead: data.isRead || false,
          chat: data.chatId,
          updatedAt: data.createdAt
        } as Message
      };
      
      console.log('🔄 Mensaje formateado para frontend:', formattedData);
      this.triggerCallback('newMessage', formattedData);
    });

    // Evento de usuario escribiendo
    this.socket.on('userTyping', (data: UserTypingEvent) => {
      console.log('Usuario escribiendo:', data);
      this.triggerCallback('userTyping', data);
    });

    // Evento de mensaje leído
    this.socket.on('messageRead', (data: MessageReadEvent) => {
      console.log('Mensaje marcado como leído:', data);
      this.triggerCallback('messageRead', data);
    });

    // Evento de usuario online/offline
    this.socket.on('userOnline', (data: UserOnlineEvent) => {
      console.log('Estado de usuario cambiado:', data);
      this.triggerCallback('userOnline', data);
    });

    // Evento de unión a chat
    this.socket.on('joinedChat', (data: { chatId: string }) => {
      console.log('✅ Unido al chat:', data.chatId);
      this.triggerCallback('joinedChat', data);
    });

    // Evento de salida de chat
    this.socket.on('leftChat', (data: { chatId: string }) => {
      console.log('❌ Salido del chat:', data.chatId);
      this.triggerCallback('leftChat', data);
    });

    // Eventos de respuesta directa
    this.socket.on('joinChat', (response: any) => {
      console.log('🏠 Respuesta joinChat:', response);
    });

    this.socket.on('leaveChat', (response: any) => {
      console.log('🚪 Respuesta leaveChat:', response);
    });

    // Eventos de error
    this.socket.on('error', (error: any) => {
      console.error('Error del WebSocket:', error);
      this.triggerCallback('error', error);
    });
  }

  // Desconectar WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.eventCallbacks = {};
      console.log('WebSocket desconectado manualmente');
    }
  }

  // Verificar si está conectado
  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  // Unirse a un chat
  joinChat(chatId: string): void {
    if (this.socket && this.connected) {
      console.log('🔗 Uniéndose al chat:', chatId);
      this.socket.emit('joinChat', chatId);
    } else {
      console.warn('⚠️ WebSocket no conectado. No se puede unir al chat:', chatId);
    }
  }

  // Salir de un chat
  leaveChat(chatId: string): void {
    if (this.socket && this.connected) {
      console.log('🚪 Saliendo del chat:', chatId);
      this.socket.emit('leaveChat', chatId);
    }
  }

  // Enviar evento de typing
  sendTyping(chatId: string, isTyping: boolean): void {
    if (this.socket && this.connected) {
      const data: TypingEvent = {
        chatId,
        isTyping,
        userId: this.getCurrentUserId()
      };
      this.socket.emit('typing', data);
    }
  }

  // Marcar mensaje como leído (vía WebSocket para notificación inmediata)
  markMessageAsRead(messageId: string, chatId: string): void {
    if (this.socket && this.connected) {
      const data: MessageReadEvent = {
        messageId,
        chatId,
        userId: this.getCurrentUserId()
      };
      this.socket.emit('markAsRead', data);
    }
  }

  // Suscribirse a eventos
  on<T = any>(event: string, callback: EventCallback<T>): void {
    if (!this.eventCallbacks[event]) {
      this.eventCallbacks[event] = [];
    }
    this.eventCallbacks[event].push(callback);
  }

  // Desuscribirse de eventos
  off(event: string, callback?: EventCallback): void {
    if (!this.eventCallbacks[event]) return;

    if (callback) {
      const index = this.eventCallbacks[event].indexOf(callback);
      if (index > -1) {
        this.eventCallbacks[event].splice(index, 1);
      }
    } else {
      this.eventCallbacks[event] = [];
    }
  }

  // Disparar callbacks
  private triggerCallback(event: string, data: any): void {
    if (this.eventCallbacks[event]) {
      this.eventCallbacks[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en callback del evento ${event}:`, error);
        }
      });
    }
  }

  // Obtener ID del usuario actual
  private getCurrentUserId(): string {
    try {
      const currentUser = localStorage.getItem('current_user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        return user.id;
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
    }
    return '';
  }

  // Método para obtener el estado de conexión
  getConnectionState(): {
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } {
    return {
      connected: this.connected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  // Reiniciar conexión manualmente
  reconnect(): Promise<void> {
    this.disconnect();
    this.reconnectAttempts = 0;
    return this.connect();
  }
}

// Exportar instancia singleton
export const webSocketService = new WebSocketService();
