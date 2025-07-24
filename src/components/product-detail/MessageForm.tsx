
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ChatService } from "@/services/chatService";
import { Loader2 } from "lucide-react";

interface MessageFormProps {
  sellerId: string;
  productId: string;
  sellerEmail?: string;
}

const MessageForm: React.FC<MessageFormProps> = ({ 
  sellerId, 
  productId, 
  sellerEmail 
}) => {
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    // Verificar autenticación
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    // Verificar que no sea el mismo usuario
    if (user.id === sellerId) {
      toast({
        title: "Error",
        description: "No puedes enviarte un mensaje a ti mismo",
        variant: "destructive"
      });
      return;
    }

    // Verificar que hay un mensaje
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) {
      toast({
        title: "Error",
        description: "Por favor, escribe un mensaje antes de enviar",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Verificar si ya existe un chat
      const existingChat = await ChatService.findDirectChat(user.id, sellerId);
      
      let chatId: string;
      
      if (existingChat) {
        // Si existe un chat, usar ese ID
        chatId = existingChat._id;
      } else {
        // Si no existe, crear uno nuevo
        const newChat = await ChatService.createChat({
          type: 'direct',
          participants: [user.id, sellerId],
          relatedProduct: productId
        });
        chatId = newChat._id;
      }

      // Enviar el mensaje inicial
      await ChatService.sendMessage({
        chatId: chatId,
        content: trimmedMessage
      });

      toast({
        title: "Mensaje enviado",
        description: "Tu mensaje ha sido enviado al vendedor"
      });

      // Redirigir a la página de chats
      navigate('/chats');
      
    } catch (error: any) {
      console.error('Error al enviar mensaje:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el mensaje. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Enfocar el textarea
    document.getElementById('messageArea')?.focus();
  };

  return (
    <div className="pt-4 border-t space-y-3">
      <h3 className="font-heading font-semibold">Enviar mensaje al vendedor</h3>
      {sellerEmail && (
        <p className="text-sm text-muted-foreground">
          Contactar a: {sellerEmail}
        </p>
      )}
      <textarea 
        id="messageArea"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        placeholder="Hola, estoy interesado en este producto. ¿Está disponible?"
        disabled={isLoading}
      />
      <div className="flex gap-3">
        <Button 
          className="flex-1 bg-green hover:bg-green-dark"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar mensaje'
          )}
        </Button>
        <Button 
          variant="outline"
          onClick={handleContactSeller}
          disabled={isLoading}
        >
          Contactar vendedor
        </Button>
      </div>
    </div>
  );
};

export default MessageForm;
