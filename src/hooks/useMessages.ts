import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { ChatService } from '@/services/chatService';
import { webSocketService } from '@/services/websocketService';
import { 
  Message, 
  CreateMessageDto, 
  UseMessagesReturn, 
  NewMessageEvent,
  UserTypingEvent,
  MessageReadEvent 
} from '@/types/chat';
import { getCurrentUser } from '@/lib/auth-service';
import { toast } from '@/hooks/use-toast';

export const useMessages = (chatId: string): UseMessagesReturn => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const listenersSetRef = useRef<Set<string>>(new Set());

  // Query infinita para obtener mensajes con paginación
  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['messages', chatId],
    queryFn: ({ pageParam = 1 }) => ChatService.getMessages(chatId, pageParam as number, 50),
    getNextPageParam: (lastPage: any) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!chatId && !!currentUser,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false
  });

  // Extraer todos los mensajes de las páginas
  const messages = data?.pages.flatMap((page: any) => page.messages) || [];

  // Mutación para enviar mensaje
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      const messageData: CreateMessageDto = {
        content,
        chatId
      };
      return ChatService.sendMessage(messageData);
    },
    onSuccess: (newMessage) => {
      // Actualizar el cache local agregando el mensaje optimísticamente
      queryClient.setQueryData(['messages', chatId], (oldData: any) => {
        if (!oldData) return { pages: [{ messages: [newMessage] }], pageParams: [1] };
        
        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          // Verificar que el mensaje no existe ya
          const messageExists = newPages[0].messages.some((msg: Message) => msg._id === newMessage._id);
          if (!messageExists) {
          newPages[0] = {
            ...newPages[0],
            messages: [newMessage, ...newPages[0].messages]
          };
          }
        }
        
        return {
          ...oldData,
          pages: newPages
        };
      });

      // Solo invalidar la query de chats para actualizar el último mensaje
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: any) => {
      console.error('Error al enviar mensaje:', error);
      toast({
        title: "Error",
        description: error?.message || "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    }
  });

  // Mutación para marcar mensaje como leído
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => ChatService.markMessageAsRead(messageId),
    onSuccess: (_, messageId) => {
      // Actualizar cache optimísticamente
      queryClient.setQueryData(['messages', chatId], (oldData: any) => {
        if (!oldData) return oldData;
        
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          messages: page.messages.map((msg: Message) => 
            msg._id === messageId ? { ...msg, isRead: true } : msg
          )
        }));
        
        return {
          ...oldData,
          pages: newPages
        };
      });

      // Solo invalidar chats si es necesario
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: any) => {
      console.error('Error al marcar mensaje como leído:', error);
    }
  });

  // Mutación para marcar todos los mensajes como leídos
  const markAllAsReadMutation = useMutation({
    mutationFn: () => ChatService.markAllMessagesAsRead(chatId),
    onSuccess: () => {
      // Actualizar cache optimísticamente
      queryClient.setQueryData(['messages', chatId], (oldData: any) => {
        if (!oldData) return oldData;
        
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          messages: page.messages.map((msg: Message) => ({ ...msg, isRead: true }))
        }));
        
        return {
          ...oldData,
          pages: newPages
        };
      });

      // Solo invalidar chats si es necesario
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: any) => {
      console.error('Error al marcar todos los mensajes como leídos:', error);
    }
  });

  // Configurar WebSocket listeners específicos para este chat
  useEffect(() => {
    if (!chatId || !currentUser) return;
    
    // Evitar registrar listeners duplicados
    const listenerKey = `${chatId}-${currentUser.id}`;
    if (listenersSetRef.current.has(listenerKey)) return;

    // Unirse al chat
    if (webSocketService.isConnected()) {
      webSocketService.joinChat(chatId);
    }

    // Listener para nuevos mensajes en este chat específico
    const onNewMessage = (data: NewMessageEvent) => {
      if (data.chatId === chatId) {
        // Actualizar el cache local optimísticamente
        queryClient.setQueryData(['messages', chatId], (oldData: any) => {
          if (!oldData) return { pages: [{ messages: [data.message] }], pageParams: [1] };
          
          const newPages = [...oldData.pages];
          if (newPages.length > 0) {
            // Verificar que el mensaje no existe ya
            const messageExists = newPages[0].messages.some((msg: Message) => msg._id === data.message._id);
            if (!messageExists) {
              newPages[0] = {
                ...newPages[0],
                messages: [data.message, ...newPages[0].messages]
              };
            }
          }
          
          return {
            ...oldData,
            pages: newPages
          };
        });

        // Marcar como leído automáticamente con debounce
        if (data.message.sender._id !== currentUser.id) {
          const timeoutId = setTimeout(() => {
            markAsReadMutation.mutate(data.message._id);
          }, 1000);
          
          return () => clearTimeout(timeoutId);
        }
      }
    };

    // Listener para usuarios escribiendo
    const onUserTyping = (data: UserTypingEvent) => {
      if (data.chatId === chatId && data.userId !== currentUser.id) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return prev.includes(data.userName) ? prev : [...prev, data.userName];
          } else {
            return prev.filter(name => name !== data.userName);
          }
        });

        // Auto-remover después de 3 segundos
        if (data.isTyping) {
          const timeoutId = setTimeout(() => {
            setTypingUsers(prev => prev.filter(name => name !== data.userName));
          }, 3000);
          
          return () => clearTimeout(timeoutId);
        }
      }
    };

    // Listener para mensajes leídos
    const onMessageRead = (data: MessageReadEvent) => {
      if (data.chatId === chatId) {
        // Actualizar el cache local
        queryClient.setQueryData(['messages', chatId], (oldData: any) => {
          if (!oldData) return oldData;
          
          const newPages = oldData.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: Message) => 
              msg._id === data.messageId ? { ...msg, isRead: true } : msg
            )
          }));
          
          return {
            ...oldData,
            pages: newPages
          };
        });
      }
    };

    // Registrar listeners
    webSocketService.on('newMessage', onNewMessage);
    webSocketService.on('userTyping', onUserTyping);
    webSocketService.on('messageRead', onMessageRead);
    
    // Marcar que este listener está registrado
    listenersSetRef.current.add(listenerKey);

    // Cleanup
    return () => {
      webSocketService.off('newMessage', onNewMessage);
      webSocketService.off('userTyping', onUserTyping);
      webSocketService.off('messageRead', onMessageRead);
      webSocketService.leaveChat(chatId);
      listenersSetRef.current.delete(listenerKey);
    };
  }, [chatId, currentUser, queryClient]); // Removido markAsReadMutation de las dependencias

  // Función para enviar mensaje
  const sendMessage = async (content: string): Promise<Message> => {
    return sendMessageMutation.mutateAsync(content);
  };

  // Función para cargar más mensajes
  const loadMoreMessages = async (): Promise<void> => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  // Función para marcar mensaje como leído
  const markMessageAsRead = async (messageId: string): Promise<void> => {
    return markAsReadMutation.mutateAsync(messageId);
  };

  // Función para marcar todos los mensajes como leídos
  const markAllAsRead = async (): Promise<void> => {
    return markAllAsReadMutation.mutateAsync();
  };

  // Función para enviar evento de typing
  const sendTyping = (isTyping: boolean) => {
    if (webSocketService.isConnected()) {
      webSocketService.sendTyping(chatId, isTyping);
    }
  };

  return {
    messages: messages.reverse(), // Invertir para mostrar los más recientes al final
    loading,
    error: error?.message || null,
    hasNextPage: hasNextPage || false,
    sendMessage,
    loadMoreMessages,
    markMessageAsRead,
    markAllAsRead,
    // Funciones adicionales para la UI
    typingUsers,
    sendTyping,
    isConnected: webSocketService.isConnected()
  };
}; 