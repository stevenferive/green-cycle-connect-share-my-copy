
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatService } from '@/services/chatService';
import { webSocketService } from '@/services/websocketService';
import { Chat, CreateChatDto, NewMessageEvent, UseChatsReturn, UserStatus } from '@/types/chat';
import { getCurrentUser } from '@/lib/auth-service';
import { toast } from '@/hooks/use-toast';

export const useChats = (): UseChatsReturn => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const listenersRegisteredRef = useRef(false);
  const lastToastRef = useRef<string | null>(null);

  // Helper para obtener unreadCount del usuario actual
  const getUserUnreadCount = (chat: Chat): number => {
    const userStatus = chat.userStatus.find(status => status.userId === currentUser?.id);
    return userStatus?.unreadCount || 0;
  };

  // Helper para actualizar unreadCount del usuario actual
  const updateUserUnreadCount = (chat: Chat, newCount: number): Chat => {
    return {
      ...chat,
      userStatus: chat.userStatus.map(status => 
        status.userId === currentUser?.id 
          ? { ...status, unreadCount: newCount }
          : status
      )
    };
  };

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
    refetchOnWindowFocus: false, // Evitar refetch automático
    // Removido refetchInterval para evitar polling innecesario
  });

  // Mutación para crear un nuevo chat
  const createChatMutation = useMutation({
    mutationFn: (chatData: CreateChatDto) => ChatService.createChat(chatData),
    onSuccess: (newChat) => {
      // Actualizar cache optimísticamente en lugar de invalidar
      queryClient.setQueryData(['chats', currentUser?.id], (oldChats: Chat[] = []) => [
        newChat,
        ...oldChats
      ]);
      
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
    onSuccess: (_, chatId) => {
      // Actualizar cache optimísticamente
      queryClient.setQueryData(['chats', currentUser?.id], (oldChats: Chat[] = []) =>
        oldChats.map(chat => 
          chat._id === chatId 
            ? updateUserUnreadCount(chat, 0)
            : chat
        )
      );
    },
    onError: (error: any) => {
      console.error('Error al marcar chat como leído:', error);
    }
  });

  // Configurar WebSocket y listeners (solo una vez)
  useEffect(() => {
    if (!currentUser || listenersRegisteredRef.current) return;

    const setupWebSocket = async () => {
      try {
        if (!webSocketService.isConnected()) {
          await webSocketService.connect();
        }

        // Listener para nuevos mensajes
        const onNewMessage = (data: NewMessageEvent) => {
          // Actualizar cache optimísticamente en lugar de invalidar
          queryClient.setQueryData(['chats', currentUser.id], (oldChats: Chat[] = []) => {
            const updatedChats = oldChats.map(chat => {
              if (chat._id === data.chatId) {
                const currentUnreadCount = getUserUnreadCount(chat);
                const newUnreadCount = data.message.sender._id !== currentUser.id 
                  ? currentUnreadCount + 1 
                  : currentUnreadCount;

                return {
                  ...chat,
                  lastMessage: {
                    content: data.message.content,
                    createdAt: data.message.createdAt,
                    sender: data.message.sender
                  },
                  ...updateUserUnreadCount(chat, newUnreadCount)
                };
              }
              return chat;
            });

            // Mover el chat actualizado al principio
            const chatIndex = updatedChats.findIndex(chat => chat._id === data.chatId);
            if (chatIndex > -1) {
              const [updatedChat] = updatedChats.splice(chatIndex, 1);
              return [updatedChat, ...updatedChats];
            }
            
            return updatedChats;
          });
          
          // Mostrar notificación solo si es de otro usuario y no es el mismo mensaje
          if (data.message.sender._id !== currentUser.id && lastToastRef.current !== data.message._id) {
            lastToastRef.current = data.message._id;
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
        listenersRegisteredRef.current = true;

        // Cleanup function
        return () => {
          webSocketService.off('newMessage', onNewMessage);
          webSocketService.off('userOnline', onUserOnline);
          listenersRegisteredRef.current = false;
        };

      } catch (error) {
        console.error('Error al configurar WebSocket:', error);
      }
    };

    const cleanup = setupWebSocket();
    return () => {
      if (cleanup) {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, [currentUser, queryClient]);

  // Unirse a todos los chats cuando se cargan (con debounce)
  useEffect(() => {
    if (chats.length > 0 && webSocketService.isConnected()) {
      const timer = setTimeout(() => {
        chats.forEach(chat => {
          webSocketService.joinChat(chat._id);
        });
      }, 100); // Pequeño delay para evitar spam

      return () => clearTimeout(timer);
    }
  }, [chats.length]); // Solo depender de la longitud, no del array completo

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
