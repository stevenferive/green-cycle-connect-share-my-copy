
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { mockChats, Chat } from '@/data/mockDataChats';
import ChatWindow from '@/components/chat/ChatWindow';

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  // Si hay un chat seleccionado, mostrar la ventana de chat individual
  if (selectedChat) {
    return <ChatWindow chat={selectedChat} onBack={handleBackToList} />;
  }

  // Mostrar la lista de chats
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="h-6 w-6 text-green" />
            <h1 className="text-2xl font-bold">Chats</h1>
          </div>
          
          {mockChats.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes chats aún</h3>
                <p className="text-muted-foreground">
                  Inicia una conversación con otros usuarios para que aparezcan aquí.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {mockChats.map((chat) => (
                <Card 
                  key={chat.id} 
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleChatClick(chat)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-green text-white">
                            {chat.initials}
                          </AvatarFallback>
                        </Avatar>
                        {chat.online && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold truncate">{chat.user}</h3>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                      
                      {chat.unread > 0 && (
                        <Badge variant="default" className="bg-green text-white">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chats;
