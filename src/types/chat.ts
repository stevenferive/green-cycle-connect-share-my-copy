
export interface Chat {
  id: string;
  title?: string;
  type: 'direct' | 'group';
  participants: string[];
  relatedProduct?: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  unreadCount: number;
  isRead: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface CreateChatRequest {
  title?: string;
  type: 'direct' | 'group';
  participants: string[];
  relatedProduct?: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
}

export interface TypingEvent {
  chatId: string;
  isTyping: boolean;
}

export interface NewMessageEvent {
  chatId: string;
  content: string;
  senderId: string;
  timestamp: string;
}

export interface UserTypingEvent {
  userId: string;
  chatId: string;
  isTyping: boolean;
}
