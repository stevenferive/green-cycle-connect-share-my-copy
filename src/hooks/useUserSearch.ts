import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserService, SearchableUser, UserSearchParams } from '@/services/userService';
import { ChatService } from '@/services/chatService';
import { getCurrentUser } from '@/lib/auth-service';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export interface UseUserSearchReturn {
  // Estado de búsqueda
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Resultados
  users: SearchableUser[];
  loading: boolean;
  error: string | null;
  
  // Metadatos de paginación
  total: number;
  hasNextPage: boolean;
  
  // Acciones
  searchUsers: (query: string) => void;
  startChat: (user: SearchableUser) => Promise<void>;
  clearResults: () => void;
  
  // Estado de chat
  startingChat: boolean;
}

export const useUserSearch = (): UseUserSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [startingChat, setStartingChat] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Debounce del término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Query para obtener todos los usuarios (se cachea una vez)
  const {
    data: allUsersResponse,
    isLoading: loadingAllUsers,
    error: allUsersError
  } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => UserService.searchUsers({ q: '' }), // Obtiene todos los usuarios
    staleTime: 10 * 60 * 1000, // 10 minutos de caché
    retry: 1
  });

  // Query para buscar usuarios (usa datos cacheados)
  const {
    data: searchResponse,
    isLoading: searchLoading,
    error: searchError
  } = useQuery({
    queryKey: ['users', 'search', debouncedQuery],
    queryFn: () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return Promise.resolve({
          users: [],
          total: 0,
          page: 1,
          limit: 10,
          hasNextPage: false
        });
      }

      const params: UserSearchParams = {
        q: debouncedQuery,
        limit: 20,
        page: 1
      };

      return UserService.searchUsers(params);
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1
  });

  const loading = loadingAllUsers || searchLoading;
  const error = allUsersError || searchError;

  const searchUsers = (query: string) => {
    setSearchQuery(query);
  };

  const startChat = async (user: SearchableUser) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para enviar mensajes",
        variant: "destructive",
      });
      return;
    }

    if (user._id === currentUser.id) {
      toast({
        title: "Error",
        description: "No puedes iniciar un chat contigo mismo",
        variant: "destructive",
      });
      return;
    }

    setStartingChat(true);

    try {
      // Buscar chat existente
      const existingChat = await ChatService.findDirectChat(currentUser.id, user._id);
      
      if (existingChat) {
        // Si existe, navegar a ese chat
        navigate(`/chats?chatId=${existingChat._id}`);
        toast({
          title: "Chat encontrado",
          description: `Redirigiendo al chat con ${UserService.getUserFullName(user)}`,
        });
        return;
      }

      // Si no existe, crear uno nuevo
      const newChat = await ChatService.createChat({
        type: 'direct',
        participants: [currentUser.id, user._id]
      });

      // Navegar al nuevo chat
      navigate(`/chats?chatId=${newChat._id}`);
      
      toast({
        title: "Chat creado",
        description: `Nuevo chat iniciado con ${UserService.getUserFullName(user)}`,
      });

    } catch (error: any) {
      console.error('Error al iniciar chat:', error);
      toast({
        title: "Error",
        description: error?.message || "No se pudo iniciar el chat. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setStartingChat(false);
    }
  };

  const clearResults = () => {
    setSearchQuery('');
    setDebouncedQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    users: searchResponse?.users || [],
    loading,
    error: error?.message || null,
    total: searchResponse?.total || 0,
    hasNextPage: searchResponse?.hasNextPage || false,
    searchUsers,
    startChat,
    clearResults,
    startingChat
  };
}; 