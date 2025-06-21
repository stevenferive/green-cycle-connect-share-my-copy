
import { api } from '@/api';
import { Chat, Message, CreateChatRequest } from '@/types/chat';

class ChatService {
  // Crear un chat
  async createChat(chatData: CreateChatRequest): Promise<Chat> {
    return await api.post('/chats', chatData);
  }

  // Obtener todos los chats
  async getAllChats(): Promise<Chat[]> {
    return await api.get('/chats');
  }

  // Obtener chats de un usuario
  async getUserChats(userId: string): Promise<Chat[]> {
    return await api.get(`/chats/user/${userId}`);
  }

  // Buscar chat directo entre dos usuarios
  async findDirectChat(user1Id: string, user2Id: string): Promise<Chat | null> {
    try {
      return await api.get(`/chats/direct?user1Id=${user1Id}&user2Id=${user2Id}`);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  // Obtener un chat específico
  async getChat(chatId: string): Promise<Chat> {
    return await api.get(`/chats/${chatId}`);
  }

  // Actualizar un chat
  async updateChat(chatId: string, updateData: Partial<Chat>): Promise<Chat> {
    return await api.patch(`/chats/${chatId}`, updateData);
  }

  // Eliminar un chat
  async deleteChat(chatId: string): Promise<void> {
    await api.delete(`/chats/${chatId}`);
  }

  // Marcar chat como leído
  async markChatAsRead(chatId: string): Promise<void> {
    await api.post(`/chats/${chatId}/read`);
  }

  // Reportar un chat
  async reportChat(chatId: string, reason?: string): Promise<void> {
    await api.post(`/chats/${chatId}/report`, { reason });
  }

  // Obtener mensajes de un chat
  async getChatMessages(chatId: string, page: number = 1, limit: number = 50): Promise<Message[]> {
    return await api.get(`/chats/${chatId}/messages?page=${page}&limit=${limit}`);
  }
}

export const chatService = new ChatService();
