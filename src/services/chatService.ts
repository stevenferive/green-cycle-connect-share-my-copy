
import { api } from '../api';
import { 
  Chat, 
  Message, 
  CreateChatDto, 
  CreateMessageDto, 
  PaginatedMessages,
  MarkAsReadDto 
} from '@/types/chat';

export class ChatService {
  // Gestión de Chats
  static async getAllChats(): Promise<Chat[]> {
    try {
      const response = await api.get('/chats');
      return response;
    } catch (error) {
      console.error('Error al obtener chats:', error);
      throw error;
    }
  }

  static async getChatsByUser(userId: string): Promise<Chat[]> {
    try {
      const response = await api.get(`/chats/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error al obtener chats del usuario:', error);
      throw error;
    }
  }

  static async findDirectChat(user1Id: string, user2Id: string): Promise<Chat | null> {
    try {
      const response = await api.get(`/chats/direct?user1Id=${user1Id}&user2Id=${user2Id}`);
      return response;
    } catch (error) {
      console.error('Error al buscar chat directo:', error);
      return null;
    }
  }

  static async createChat(chatData: CreateChatDto): Promise<Chat> {
    try {
      const response = await api.post('/chats', chatData);
      return response;
    } catch (error) {
      console.error('Error al crear chat:', error);
      throw error;
    }
  }

  static async markChatAsRead(chatId: string): Promise<void> {
    try {
      await api.post(`/chats/${chatId}/read`);
    } catch (error) {
      console.error('Error al marcar chat como leído:', error);
      throw error;
    }
  }

  // Gestión de Mensajes
  static async getMessages(
    chatId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<PaginatedMessages> {
    try {
      const response = await api.get(`/messages/chat/${chatId}?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      throw error;
    }
  }

  static async sendMessage(messageData: CreateMessageDto): Promise<Message> {
    try {
      const response = await api.post('/messages', messageData);
      return response;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }

  static async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await api.post(`/messages/${messageId}/read`);
    } catch (error) {
      console.error('Error al marcar mensaje como leído:', error);
      throw error;
    }
  }

  static async markAllMessagesAsRead(chatId: string): Promise<void> {
    try {
      await api.post(`/messages/chat/${chatId}/read-all`);
    } catch (error) {
      console.error('Error al marcar todos los mensajes como leídos:', error);
      throw error;
    }
  }

  // Métodos auxiliares para integración con componentes existentes
  static async getOrCreateDirectChat(otherUserId: string, currentUserId: string): Promise<Chat> {
    // Primero intentamos encontrar un chat existente
    const existingChat = await this.findDirectChat(currentUserId, otherUserId);
    
    if (existingChat) {
      return existingChat;
    }

    // Si no existe, creamos uno nuevo
    const newChatData: CreateChatDto = {
      type: 'direct',
      participants: [currentUserId, otherUserId]
    };

    return await this.createChat(newChatData);
  }

  // Método para obtener el número de mensajes no leídos por chat
  static getUnreadCount(chat: Chat, currentUserId: string): number {
    const userStatus = chat.userStatus.find(status => status.userId === currentUserId);
    return userStatus ? userStatus.unreadCount : 0;
  }

  // Método para verificar si un chat está marcado como leído
  static isChatRead(chat: Chat, currentUserId: string): boolean {
    return this.getUnreadCount(chat, currentUserId) === 0;
  }

  // Método para formatear la información del chat para la UI
  static formatChatForUI(chat: Chat, currentUserId: string) {
    const otherParticipant = chat.participants.find(p => p._id !== currentUserId);
    const unreadCount = this.getUnreadCount(chat, currentUserId);
    
    return {
      id: chat._id,
      chatId: chat.chatId,
      user: chat.type === 'direct' 
        ? `${otherParticipant?.firstName} ${otherParticipant?.lastName}` 
        : chat.title || 'Chat grupal',
      initials: chat.type === 'direct'
        ? `${otherParticipant?.firstName?.[0]}${otherParticipant?.lastName?.[0]}`
        : 'GC',
      lastMessage: chat.lastMessage?.content || 'No hay mensajes',
      time: this.formatTime(chat.lastActivity),
      unread: unreadCount,
      online: false, // Se actualizará con WebSocket
      avatar: otherParticipant?.avatar,
      rawChat: chat
    };
  }

  // Método para formatear mensajes para la UI
  static formatMessageForUI(message: Message, currentUserId: string) {
    return {
      id: message._id,
      text: message.content,
      timestamp: this.formatTime(message.createdAt),
      isOwn: message.sender._id === currentUserId,
      status: message.isRead ? 'read' : 'sent' as 'sent' | 'delivered' | 'read',
      sender: message.sender,
      rawMessage: message
    };
  }

  // Método auxiliar para formatear fechas
  static formatTime(date: Date | string): string {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  }
}
