import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '@/services/chatService';
import { webSocketService } from '@/services/websocketService';
import { Message, CreateMessageDto, NewMessageEvent } from '@/types/chat';
import { getCurrentUser } from '@/lib/auth-service';

interface UseSimpleMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<Message>;
  markAllAsRead: () => Promise<void>;
  isConnected: boolean;
}

export const useSimpleMessages = (chatId: string): UseSimpleMessagesReturn => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const listenersSetupRef = useRef<string | null>(null);

  // Query simple para obtener mensajes (sin paginación infinita por ahora)
  const {
    data: messagesData,
    isLoading: loading,
    error,
    refetch: refreshMessages
  } = useQuery({
    queryKey: ['simple-messages', chatId],
    queryFn: () => chatId ? ChatService.getMessages(chatId, 1, 100) : Promise.resolve({ messages: [] }),
    enabled: !!chatId && !!currentUser,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const messages = messagesData?.messages || [];

  // Mutación simple para enviar mensaje
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      const messageData: CreateMessageDto = {
        content,
        chatId
      };
      return ChatService.sendMessage(messageData);
    },
    onSuccess: () => {
      // Solo refetch en lugar de actualizar cache
      refreshMessages();
    }
  });

  // Mutación para marcar todos como leídos
  const markAllAsReadMutation = useMutation({
    mutationFn: () => ChatService.markAllMessagesAsRead(chatId),
    onSuccess: () => {
      refreshMessages();
    }
  });

  // Configurar listeners del websocket para este chat específico
  useEffect(() => {
    if (!chatId || !currentUser || listenersSetupRef.current === chatId) return;

    // Limpiar listeners anteriores si había otro chatId
    if (listenersSetupRef.current) {
      webSocketService.leaveChat(listenersSetupRef.current);
    }

    listenersSetupRef.current = chatId;

    // Unirse al chat
    if (webSocketService.isConnected()) {
      webSocketService.joinChat(chatId);
    }

    const onNewMessage = (data: NewMessageEvent) => {
      if (data.chatId === chatId) {
        refreshMessages();
      }
    };

    webSocketService.on('newMessage', onNewMessage);

    return () => {
      webSocketService.off('newMessage', onNewMessage);
      webSocketService.leaveChat(chatId);
      listenersSetupRef.current = null;
    };
  }, [chatId]); // Solo depender del chatId

  const sendMessage = async (content: string): Promise<Message> => {
    return sendMessageMutation.mutateAsync(content);
  };

  const markAllAsRead = async (): Promise<void> => {
    return markAllAsReadMutation.mutateAsync();
  };

  return {
    messages: messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    loading,
    error: error?.message || null,
    sendMessage,
    markAllAsRead,
    isConnected: webSocketService.isConnected()
  };
}; 