
import { io, Socket } from 'socket.io-client';
import { SendMessageRequest, TypingEvent, NewMessageEvent, UserTypingEvent } from '@/types/chat';

class WebSocketService {
  private socket: Socket | null = null;
  private connected: boolean = false;

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
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        this.connected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.connected = false;
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        this.connected = false;
      });
    });
  }

  // Desconectar del WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Verificar si está conectado
  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  // Unirse a un chat
  joinChat(chatId: string): void {
    if (this.socket && this.isConnected()) {
      this.socket.emit('joinChat', chatId);
      console.log(`Joined chat: ${chatId}`);
    }
  }

  // Salir de un chat
  leaveChat(chatId: string): void {
    if (this.socket && this.isConnected()) {
      this.socket.emit('leaveChat', chatId);
      console.log(`Left chat: ${chatId}`);
    }
  }

  // Enviar mensaje
  sendMessage(messageData: SendMessageRequest): void {
    if (this.socket && this.isConnected()) {
      this.socket.emit('sendMessage', messageData);
      console.log(`Message sent to chat ${messageData.chatId}:`, messageData.content);
    }
  }

  // Notificar que está escribiendo
  sendTyping(typingData: TypingEvent): void {
    if (this.socket && this.isConnected()) {
      this.socket.emit('typing', typingData);
    }
  }

  // Escuchar nuevos mensajes
  onNewMessage(callback: (data: NewMessageEvent) => void): void {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  // Escuchar cuando un usuario está escribiendo
  onUserTyping(callback: (data: UserTypingEvent) => void): void {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  // Remover listeners
  removeListener(event: string, callback?: Function): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  // Limpiar todos los listeners
  removeAllListeners(): void {
    if (this.socket) {
      this.socket.off('newMessage');
      this.socket.off('userTyping');
    }
  }
}

export const websocketService = new WebSocketService();
