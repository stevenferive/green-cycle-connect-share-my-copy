import React, { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, Phone, Video, ArrowLeft, Paperclip, Smile } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Chat, Message } from '@/data/mockDataChats';

interface ChatWindowProps {
  chat: Chat;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isOwn: true,
        status: 'sent'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              {chat.initials}
            </AvatarFallback>
          </Avatar>
          {chat.online && (
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{chat.user}</h3>
          <p className="text-xs text-muted-foreground">
            {chat.online ? 'En línea' : 'Desconectado'}
          </p>
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
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] rounded-lg p-3 ${
                message.isOwn 
                  ? 'bg-green text-white rounded-br-sm' 
                  : 'bg-white text-foreground border rounded-bl-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <div 
                className={`flex items-center gap-1 mt-1 text-xs ${
                  message.isOwn 
                    ? 'text-white/70' 
                    : 'text-muted-foreground'
                }`}
              >
                <span>{message.timestamp}</span>
                {message.isOwn && message.status && (
                  <span className="ml-1">
                    {message.status === 'sent' && '✓'}
                    {message.status === 'delivered' && '✓✓'}
                    {message.status === 'read' && '✓✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
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
            onChange={e => setNewMessage(e.target.value)} 
            onKeyPress={handleKeyPress} 
            placeholder="Escribe un mensaje..." 
            className="flex-1 bg-green/5"
          />
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Smile className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()} 
            size="icon" 
            className="h-9 w-9 bg-green hover:bg-green/90 text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;