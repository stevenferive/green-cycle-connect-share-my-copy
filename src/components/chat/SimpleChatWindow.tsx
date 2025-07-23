import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSimpleMessages } from '@/hooks/useSimpleMessages';
import { ChatService } from '@/services/chatService';
import { getCurrentUser } from '@/lib/auth-service';
import { Chat } from '@/types/chat';
import { Skeleton } from '@/components/ui/skeleton';

interface SimpleChatWindowProps {
  chat: Chat;
  onBack: () => void;
}

const SimpleChatWindow: React.FC<SimpleChatWindowProps> = ({
  chat,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();
  const markAsReadCalledRef = useRef(false);

  // Hook simplificado para mensajes
  const {
    messages,
    loading,
    error,
    sendMessage,
    markAllAsRead,
    isConnected
  } = useSimpleMessages(chat._id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Marcar mensajes como leídos solo una vez
  useEffect(() => {
    if (messages.length > 0 && !markAsReadCalledRef.current) {
      markAsReadCalledRef.current = true;
      markAllAsRead().catch(error => {
        console.error('Error al marcar mensajes como leídos:', error);
      });
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(newMessage);
        setNewMessage('');
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

  // Formatear información del chat para mostrar
  const chatInfo = ChatService.formatChatForUI(chat, currentUser?.id || '');

  return (
    <div className="flex flex-col h-full bg-green/5">
      {/* Header */}
      <div className="flex-none p-4 bg-[#F5F8E1] flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-9 w-9"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-green text-white">
            {chatInfo.initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{chatInfo.user}</h3>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              {chatInfo.online ? 'En línea' : 'Desconectado'}
            </p>
            {!isConnected && (
              <span className="text-xs text-red-500">• Sin conexión</span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <Skeleton className="h-16 w-48 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error al cargar mensajes</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay mensajes aún</p>
            <p className="text-sm text-muted-foreground">Inicia la conversación enviando un mensaje</p>
          </div>
        ) : (
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
                      ? 'bg-[#4CAF50]/80 text-white shadow-md rounded-br-sm' 
                      : 'bg-white text-foreground shadow-md rounded-bl-sm'
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
      <div className="flex-none p-4  ">
        <div className="flex gap-2">
          <Input 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            onKeyPress={handleKeyPress} 
            placeholder="Escribe un mensaje..." 
            className="flex-1 bg-white border-none shadow-md"
            disabled={!isConnected}
          />
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

export default SimpleChatWindow; 