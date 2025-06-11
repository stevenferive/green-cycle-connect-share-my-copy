
import React from "react";
import { Button } from "@/components/ui/button";

interface MessageFormProps {
  onSendMessage: () => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage }) => {
  return (
    <div className="pt-4 border-t space-y-3">
      <h3 className="font-heading font-semibold">Enviar mensaje al vendedor</h3>
      <textarea 
        id="messageArea"
        className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        placeholder="Hola, estoy interesado en este producto. ¿Está disponible?"
      />
      <Button 
        className="w-full sm:w-auto bg-green hover:bg-green-dark"
        onClick={onSendMessage}
      >
        Enviar mensaje
      </Button>
    </div>
  );
};

export default MessageForm;
