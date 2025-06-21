
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { websocketService } from '@/services/websocketService';
import { Chat, Message, CreateChatRequest, NewMessageEvent, UserTypingEvent } from '@/types/chat';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';

export const useChats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});

  // Obtener todos los chats del usuario
  const { data: chats = [], isLoading, error, refetch } = useQuery({
    queryKey: ['chats', user?.id],
    queryFn: () => user ? chatService.getUserChats(user.id) : [],
    enabled: !!user,
  });

  // Crear un nuevo chat
  const createChatMutation = useMutation({
    mutationFn: (chatData: CreateChatRequest) => chatService.createChat(chatData),
    onSuccess: (newChat) => {
      queryClient.setQueryData(['chats', user?.id], (oldChats: Chat[] = []) => [
        ...oldChats,
        newChat
      ]);
      toast({
        title: "Chat creado",
        description: "El chat se ha creado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el chat",
        variant: "destructive",
      });
    },
  });

  // Marcar chat como leído
  const markAsReadMutation = useMutation({
    mutationFn: (chatId: string) => chatService.markChatAsRead(chatId),
    onSuccess: (_, chatId) => {
      queryClient.setQueryData(['chats', user?.id], (oldChats: Chat[] = []) =>
        oldChats.map(chat =>
          chat.id === chatId ? { ...chat, unreadCount: 0, isRead: true } : chat
        )
      );
    },
  });

  // Reportar chat
  const reportChatMutation = useMutation({
    mutationFn: ({ chatId, reason }: { chatId: string; reason?: string }) => 
      chatService.reportChat(chatId, reason),
    onSuccess: () => {
      toast({
        title: "Chat reportado",
        description: "El chat ha sido reportado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo reportar el chat",
        variant: "destructive",
      });
    },
  });

  // Manejar nuevos mensajes
  const handleNewMessage = useCallback((data: NewMessageEvent) => {
    console.log('New message received:', data);
    
    // Actualizar la lista de chats
    queryClient.setQueryData(['chats', user?.id], (oldChats: Chat[] = []) =>
      oldChats.map(chat => {
        if (chat.id === data.chatId) {
          const isFromCurrentUser = data.senderId === user?.id;
          return {
            ...chat,
            lastMessage: {
              id: Date.now().toString(),
              chatId: data.chatId,
              senderId: data.senderId,
              content: data.content,
              timestamp: data.timestamp,
              isRead: isFromCurrentUser,
              status: 'delivered'
            },
            unreadCount: isFromCurrentUser ? chat.unreadCount : chat.unreadCount + 1,
            updatedAt: data.timestamp
          };
        }
        return chat;
      })
    );

    // Si el mensaje no es del usuario actual, mostrar toast
    if (data.senderId !== user?.id) {
      toast({
        title: "Nuevo mensaje",
        description: data.content.length > 50 ? 
          data.content.substring(0, 50) + '...' : 
          data.content,
      });
    }
  }, [user?.id, queryClient, toast]);

  // Manejar usuarios escribiendo
  const handleUserTyping = useCallback((data: UserTypingEvent) => {
    console.log('User typing:', data);
    
    setTypingUsers(prev => {
      const chatTypingUsers = prev[data.chatId] || [];
      
      if (data.isTyping) {
        // Agregar usuario si no está ya escribiendo
        if (!chatTypingUsers.includes(data.userId)) {
          return {
            ...prev,
            [data.chatId]: [...chatTypingUsers, data.userId]
          };
        }
      } else {
        // Remover usuario de los que están escribiendo
        return {
          ...prev,
          [data.chatId]: chatTypingUsers.filter(userId => userId !== data.userId)
        };
      }
      
      return prev;
    });

    // Auto-remover después de 3 segundos si no se recibe señal de stop
    if (data.isTyping) {
      setTimeout(() => {
        setTypingUsers(prev => ({
          ...prev,
          [data.chatId]: (prev[data.chatId] || []).filter(userId => userId !== data.userId)
        }));
      }, 3000);
    }
  }, []);

  // Conectar WebSocket cuando el componente se monta
  useEffect(() => {
    if (user) {
      websocketService.connect()
        .then(() => {
          websocketService.onNewMessage(handleNewMessage);
          websocketService.onUserTyping(handleUserTyping);
        })
        .catch(error => {
          console.error('Failed to connect WebSocket:', error);
          toast({
            title: "Error de conexión",
            description: "No se pudo conectar al chat en tiempo real",
            variant: "destructive",
          });
        });
    }

    return () => {
      websocketService.removeAllListeners();
      websocketService.disconnect();
    };
  }, [user, handleNewMessage, handleUserTyping, toast]);

  return {
    chats,
    isLoading,
    error,
    typingUsers,
    refetch,
    createChat: createChatMutation.mutate,
    isCreatingChat: createChatMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
    reportChat: reportChatMutation.mutate,
    // WebSocket methods
    joinChat: websocketService.joinChat.bind(websocketService),
    leaveChat: websocketService.leaveChat.bind(websocketService),
    sendMessage: websocketService.sendMessage.bind(websocketService),
    sendTyping: websocketService.sendTyping.bind(websocketService),
    isConnected: websocketService.isConnected.bind(websocketService),
  };
};
