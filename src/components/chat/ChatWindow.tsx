import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Phone, Video, ArrowLeft, Paperclip, Smile, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMessages } from '@/hooks/useMessages';
import { ChatService } from '@/services/chatService';
import { getCurrentUser } from '@/lib/auth-service';
import { Chat } from '@/types/chat';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatWindowProps {
  chat: Chat;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUser = getCurrentUser();

  // Hook para gestión de mensajes
  const {
    messages,
    loading,
    error,
    hasNextPage,
    sendMessage,
    loadMoreMessages,
    markAllAsRead,
    typingUsers,
    sendTyping,
    isConnected
  } = useMessages(chat._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Marcar todos los mensajes como leídos al abrir el chat
  useEffect(() => {
    if (messages.length > 0) {
      markAllAsRead().catch(error => {
        console.error('Error al marcar mensajes como leídos:', error);
      });
    }
  }, [chat._id, markAllAsRead]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(newMessage);
        setNewMessage('');
        
        // Parar typing
        if (isTyping) {
          setIsTyping(false);
          sendTyping(false);
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Gestionar typing indicator
    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      sendTyping(true);
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false);
      sendTyping(false);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Parar typing después de 2 segundos de inactividad
    if (value.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTyping(false);
      }, 2000);
    }
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Formatear información del chat para mostrar
  const chatInfo = ChatService.formatChatForUI(chat, currentUser?.id || '');

  return (
    <div className="flex flex-col h-full bg-green/5">
      {/* Header */}
      <div className="flex-none p-4 bg-green/10 border-b border-border flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-9 w-9"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-green text-white">
              {chatInfo.initials}
            </AvatarFallback>
          </Avatar>
          {chatInfo.online && (
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{chatInfo.user}</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              {chatInfo.online ? 'En línea' : 'Desconectado'}
            </p>
            {!isConnected && (
              <span className="text-xs text-red-500">• Sin conexión</span>
            )}
            {typingUsers.length > 0 && (
              <span className="text-xs text-green-600">
                {typingUsers.length === 1 
                  ? `${typingUsers[0]} está escribiendo...`
                  : `${typingUsers.length} personas están escribiendo...`
                }
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Botón para cargar más mensajes */}
        {hasNextPage && (
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={loadMoreMessages}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                'Cargar mensajes anteriores'
              )}
            </Button>
          </div>
        )}

        {loading && messages.length === 0 ? (
          // Skeleton loading para mensajes
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[70%] ${i % 2 === 0 ? 'order-1' : 'order-2'}`}>
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error al cargar mensajes</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          // Empty state
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay mensajes aún</p>
            <p className="text-sm text-muted-foreground">Inicia la conversación enviando un mensaje</p>
          </div>
        ) : (
          // Messages list
          messages.map(message => {
            const formattedMessage = ChatService.formatMessageForUI(message, currentUser?.id || '');
            return (
              <div 
                key={message._id} 
                className={`flex ${formattedMessage.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    formattedMessage.isOwn 
                      ? 'bg-green text-white rounded-br-sm' 
                      : 'bg-white text-foreground border rounded-bl-sm'
                  }`}
                >
                  {!formattedMessage.isOwn && chat.type === 'group' && (
                    <p className="text-xs font-medium mb-1 opacity-70">
                      {message.sender.firstName} {message.sender.lastName}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{formattedMessage.text}</p>
                  <div 
                    className={`flex items-center gap-1 mt-1 text-xs ${
                      formattedMessage.isOwn 
                        ? 'text-white/70' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span>{formattedMessage.timestamp}</span>
                    {formattedMessage.isOwn && (
                      <span className="ml-1">
                        {formattedMessage.status === 'sent' && '✓'}
                        {formattedMessage.status === 'delivered' && '✓✓'}
                        {formattedMessage.status === 'read' && '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-none p-4 bg-white border-t">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input 
            value={newMessage} 
            onChange={handleInputChange} 
            onKeyPress={handleKeyPress} 
            placeholder="Escribe un mensaje..." 
            className="flex-1 bg-green/5"
            disabled={!isConnected}
          />
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Smile className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || !isConnected} 
            size="icon" 
            className="h-9 w-9 bg-green hover:bg-green/90 text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">
            Sin conexión - Los mensajes se enviarán cuando se restablezca la conexión
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;