import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Search, Wifi, WifiOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSimpleChats } from '@/hooks/useSimpleChats';
import { useSimpleSocket } from '@/hooks/useSimpleSocket';
import { ChatService } from '@/services/chatService';
import { getCurrentUser } from '@/lib/auth-service';
import SimpleChatWindow from '@/components/chat/SimpleChatWindow';
import { Chat } from '@/types/chat';
import { Skeleton } from '@/components/ui/skeleton';

const SimpleChats = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks simplificados
  const { chats, loading, error } = useSimpleChats();
  const { isConnected } = useSimpleSocket();
  const currentUser = getCurrentUser();

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  // Formatear chats para la UI
  const formattedChats = chats
    .map(chat => ChatService.formatChatForUI(chat, currentUser?.id || ''))
    .filter(chat => 
      !searchTerm || 
      chat.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (!currentUser) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Inicia sesión</h2>
          <p className="text-muted-foreground">
            Necesitas iniciar sesión para acceder a los chats
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] m-2 overflow-hidden flex bg-[#FEFCE9] rounded-[30px]">
      {/* Panel izquierdo - Lista de chats */}
      <div className={`w-full md:w-96 border-r border-border flex flex-col bg-background ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="flex-none p-4 bg-white/80 mt-2 backdrop-blur-sm">
          <div className="flex items-center gap-1 mb-4 ml-3">
            <img src="/logo-green-cicle.svg" alt="GreenCycle" className="h-12 w-12" />
            <h1 className="text-2xl font-semibold text-gray-700 ">GreenCycle</h1>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Lista de chats */}
        <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-sm">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error al cargar chats</h3>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          ) : formattedChats.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'No se encontraron chats' : 'No tienes chats aún'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Inicia una conversación con otros usuarios.'
                }
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {formattedChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 cursor-pointer transition-all duration-200 rounded-2xl ${
                    selectedChat?._id === chat.id 
                      ? 'bg-[#C8F6B1]/50 shadow-md transform scale-[1.02]' 
                      : 'bg-white/70 hover:bg-white/90 hover:shadow-sm'
                  }`}
                  onClick={() => handleChatClick(chat.rawChat)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-green text-white text-sm font-medium">
                        {chat.initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate text-gray-800">{chat.user}</h3>
                        <span className="text-xs text-gray-500">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                    
                    {chat.unread > 0 && (
                      <Badge className="bg-green text-white">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel derecho - Ventana de chat */}
      <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <SimpleChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-green/5">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-green/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Selecciona un chat</h2>
              <p className="text-muted-foreground">
                Elige una conversación de la lista para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleChats; 