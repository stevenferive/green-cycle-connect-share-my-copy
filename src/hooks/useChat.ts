
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { websocketService } from '@/services/websocketService';
import { Chat, Message } from '@/types/chat';
import { useAuth } from '@/lib/auth-context';

export const useChat = (chatId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Obtener información del chat
  const { data: chat, isLoading: isChatLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => chatService.getChat(chatId),
    enabled: !!chatId,
  });

  // Obtener mensajes del chat
  const { data: messages = [], isLoading: isMessagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => chatService.getChatMessages(chatId),
    enabled: !!chatId,
  });

  // Enviar mensaje
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!chatId || !content.trim()) return;
      
      websocketService.sendMessage({
        chatId,
        content: content.trim()
      });
      
      // Agregar mensaje optimistamente
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        chatId,
        senderId: user?.id || '',
        content: content.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
        status: 'sent'
      };
      
      return optimisticMessage;
    },
    onSuccess: (optimisticMessage) => {
      if (optimisticMessage) {
        queryClient.setQueryData(['messages', chatId], (oldMessages: Message[] = []) => [
          ...oldMessages,
          optimisticMessage
        ]);
      }
    },
  });

  // Manejar typing
  const handleTyping = useCallback((typing: boolean) => {
    if (!chatId) return;
    
    websocketService.sendTyping({
      chatId,
      isTyping: typing
    });
    
    setIsTyping(typing);
    
    // Auto-stop typing after 3 seconds
    if (typing) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      const timeout = setTimeout(() => {
        websocketService.sendTyping({
          chatId,
          isTyping: false
        });
        setIsTyping(false);
      }, 3000);
      
      setTypingTimeout(timeout);
    } else {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setTypingTimeout(null);
      }
    }
  }, [chatId, typingTimeout]);

  // Unirse al chat cuando se monta el componente
  useEffect(() => {
    if (chatId && websocketService.isConnected()) {
      websocketService.joinChat(chatId);
      
      return () => {
        websocketService.leaveChat(chatId);
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
      };
    }
  }, [chatId, typingTimeout]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return {
    chat,
    messages,
    isLoading: isChatLoading || isMessagesLoading,
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
    handleTyping,
    isTyping,
    refetchMessages,
  };
};
