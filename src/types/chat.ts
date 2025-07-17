// Tipos de usuario simplificados para chats
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface UserStatus {
  userId: string;
  unreadCount: number;
  lastRead: Date;
}

// Interfaces principales para la API REST
export interface Chat {
  _id: string;
  chatId: string;
  participants: User[];
  type: 'direct' | 'group';
  title?: string;
  lastMessage?: Message;
  lastActivity: Date;
  userStatus: UserStatus[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  chat: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs para requests
export interface CreateChatDto {
  type: 'direct' | 'group';
  participants: string[]; // Array de user IDs
  title?: string;
  relatedProduct?: string;
}

export interface CreateMessageDto {
  content: string;
  chatId: string;
}

export interface MarkAsReadDto {
  chatId: string;
  messageId?: string;
}

// Tipos para respuestas paginadas
export interface PaginatedMessages {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Tipos para WebSocket events
export interface TypingEvent {
  chatId: string;
  isTyping: boolean;
  userId: string;
}

export interface NewMessageEvent {
  message: Message;
  chatId: string;
}

export interface UserTypingEvent {
  userId: string;
  chatId: string;
  isTyping: boolean;
  userName: string;
}

export interface MessageReadEvent {
  messageId: string;
  chatId: string;
  userId: string;
}

export interface UserOnlineEvent {
  userId: string;
  isOnline: boolean;
}

// Tipos para el estado local del chat
export interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: { [chatId: string]: Message[] };
  typingUsers: { [chatId: string]: string[] };
  onlineUsers: Set<string>;
  loading: boolean;
  error: string | null;
}

// Tipos para el hook de chats
export interface UseChatsReturn {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  createChat: (data: CreateChatDto) => Promise<Chat>;
  markChatAsRead: (chatId: string) => Promise<void>;
  refreshChats: () => Promise<void>;
}

// Tipos para el hook de mensajes
export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  sendMessage: (content: string) => Promise<Message>;
  loadMoreMessages: () => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  // Funciones adicionales para la UI
  typingUsers: string[];
  sendTyping: (isTyping: boolean) => void;
  isConnected: boolean;
}
