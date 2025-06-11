
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle } from "lucide-react";

interface ProductActionsProps {
  onAddToCart: () => void;
  onContactSeller: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  onAddToCart,
  onContactSeller
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button 
        className="flex-1 bg-green hover:bg-green-dark"
        onClick={onAddToCart}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        Agregar al carrito
      </Button>
      
      <Button 
        variant="outline" 
        className="flex-1 border-green text-green hover:bg-green-light/10"
        onClick={onContactSeller}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Contactar vendedor
      </Button>
    </div>
  );
};

export default ProductActions;
