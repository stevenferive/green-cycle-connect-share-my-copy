import React, { useState } from 'react';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Chat, Message } from '@/data/mockDataChats';

interface ChatWindowProps {
  chat: Chat;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(chat.messages);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        status: 'sent'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-background sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3 flex-1">
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
        </div>
        
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isOwn
                  ? 'bg-green text-white'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs ${
                message.isOwn ? 'text-green-100' : 'text-muted-foreground'
              }`}>
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
      </div>

      {/* Message Input */}
      <div className="p-4 bg-background border-t">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
