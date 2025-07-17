
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '@/services/chatService';
import { webSocketService } from '@/services/websocketService';
import { Chat, CreateChatDto, NewMessageEvent, UseChatsReturn } from '@/types/chat';
import { getCurrentUser } from '@/lib/auth-service';
import { toast } from '@/hooks/use-toast';

export const useChats = (): UseChatsReturn => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Query para obtener todos los chats
  const {
    data: chats = [],
    isLoading: loading,
    error,
    refetch: refreshChats
  } = useQuery({
    queryKey: ['chats', currentUser?.id],
    queryFn: () => currentUser ? ChatService.getChatsByUser(currentUser.id) : Promise.resolve([]),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000 // Refetch cada 30 segundos
  });

  // Mutación para crear un nuevo chat
  const createChatMutation = useMutation({
    mutationFn: (chatData: CreateChatDto) => ChatService.createChat(chatData),
    onSuccess: (newChat) => {
      // Invalidar la query de chats para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      
      // Unirse al chat vía WebSocket
      if (webSocketService.isConnected()) {
        webSocketService.joinChat(newChat._id);
      }

      toast({
        title: "Chat creado",
        description: "El chat se ha creado exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Error al crear chat:', error);
      toast({
        title: "Error",
        description: error?.message || "No se pudo crear el chat",
        variant: "destructive",
      });
    }
  });

  // Mutación para marcar chat como leído
  const markAsReadMutation = useMutation({
    mutationFn: (chatId: string) => ChatService.markChatAsRead(chatId),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: any) => {
      console.error('Error al marcar chat como leído:', error);
    }
  });

  // Configurar WebSocket y listeners
  useEffect(() => {
    if (!currentUser) return;

    const setupWebSocket = async () => {
      try {
        if (!webSocketService.isConnected()) {
          await webSocketService.connect();
        }

        // Listener para nuevos mensajes
        const onNewMessage = (data: NewMessageEvent) => {
          // Invalidar queries para actualizar la lista de chats
          queryClient.invalidateQueries({ queryKey: ['chats'] });
          queryClient.invalidateQueries({ queryKey: ['messages', data.chatId] });
          
          // Mostrar notificación si el mensaje no es del usuario actual
          if (data.message.sender._id !== currentUser.id) {
            toast({
              title: "Nuevo mensaje",
              description: `${data.message.sender.firstName}: ${data.message.content.substring(0, 50)}${data.message.content.length > 50 ? '...' : ''}`,
            });
          }
        };

        // Listener para usuarios online
        const onUserOnline = (data: { userId: string; isOnline: boolean }) => {
          setOnlineUsers(prev => {
            const newSet = new Set(prev);
            if (data.isOnline) {
              newSet.add(data.userId);
            } else {
              newSet.delete(data.userId);
            }
            return newSet;
          });
        };

        // Registrar listeners
        webSocketService.on('newMessage', onNewMessage);
        webSocketService.on('userOnline', onUserOnline);

        // Cleanup function
        return () => {
          webSocketService.off('newMessage', onNewMessage);
          webSocketService.off('userOnline', onUserOnline);
        };

      } catch (error) {
        console.error('Error al configurar WebSocket:', error);
      }
    };

    setupWebSocket();
  }, [currentUser, queryClient]);

  // Unirse a todos los chats cuando se cargan
  useEffect(() => {
    if (chats.length > 0 && webSocketService.isConnected()) {
      chats.forEach(chat => {
        webSocketService.joinChat(chat._id);
      });
    }
  }, [chats]);

  const createChat = async (data: CreateChatDto): Promise<Chat> => {
    return createChatMutation.mutateAsync(data);
  };

  const markChatAsRead = async (chatId: string): Promise<void> => {
    return markAsReadMutation.mutateAsync(chatId);
  };

  return {
    chats,
    loading,
    error: error?.message || null,
    createChat,
    markChatAsRead,
    refreshChats: async () => {
      await refreshChats();
    }
  };
};
