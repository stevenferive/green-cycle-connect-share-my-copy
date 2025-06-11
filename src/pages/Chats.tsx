import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Search, Filter, Menu, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockChats, Chat } from '@/data/mockDataChats';
import ChatWindow from '@/components/chat/ChatWindow';

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const filteredChats = mockChats.filter(chat =>
    chat.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-background">
      {/* Panel izquierdo - Lista de chats */}
      <div className={`w-full md:w-96 border-r border-border flex flex-col bg-background ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header del panel izquierdo */}
        <div className="flex-none p-4 bg-green/10 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-green text-white">TU</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold text-foreground">Chats</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar o empezar un nuevo chat"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 bg-white/50 backdrop-blur-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Lista de chats */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes chats aún</h3>
              <p className="text-muted-foreground text-sm">
                Inicia una conversación con otros usuarios para que aparezcan aquí.
              </p>
            </div>
          ) : (
            <div>
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 hover:bg-green/5 cursor-pointer border-b border-border/50 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-green/10' : ''
                  }`}
                  onClick={() => handleChatClick(chat)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-green text-white text-sm font-medium">
                          {chat.initials}
                        </AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate text-foreground">{chat.user}</h3>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
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
          <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} />
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

export default Chats;
