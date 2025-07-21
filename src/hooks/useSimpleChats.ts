import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '@/services/chatService';
import { webSocketService } from '@/services/websocketService';
import { Chat, CreateChatDto, NewMessageEvent } from '@/types/chat';
import { getCurrentUser } from '@/lib/auth-service';

interface UseSimpleChatsReturn {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  createChat: (data: CreateChatDto) => Promise<Chat>;
  refreshChats: () => void;
}

export const useSimpleChats = (): UseSimpleChatsReturn => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const listenersSetupRef = useRef(false);

  // Query simple para obtener chats
  const {
    data: chats = [],
    isLoading: loading,
    error,
    refetch: refreshChats
  } = useQuery({
    queryKey: ['simple-chats', currentUser?.id],
    queryFn: () => currentUser ? ChatService.getChatsByUser(currentUser.id) : Promise.resolve([]),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Mutación simple para crear chat
  const createChatMutation = useMutation({
    mutationFn: (chatData: CreateChatDto) => ChatService.createChat(chatData),
    onSuccess: () => {
      // Solo refetch en lugar de invalidar
      refreshChats();
    }
  });

  // Configurar listeners del websocket una sola vez
  useEffect(() => {
    if (!currentUser || listenersSetupRef.current) return;

    listenersSetupRef.current = true;

    const onNewMessage = (data: NewMessageEvent) => {
      // Solo refetch cuando llega un nuevo mensaje
      refreshChats();
    };

    webSocketService.on('newMessage', onNewMessage);

    return () => {
      webSocketService.off('newMessage', onNewMessage);
      listenersSetupRef.current = false;
    };
  }, []); // Sin dependencias problemáticas

  const createChat = async (data: CreateChatDto): Promise<Chat> => {
    return createChatMutation.mutateAsync(data);
  };

  return {
    chats,
    loading,
    error: error?.message || null,
    createChat,
    refreshChats
  };
}; 