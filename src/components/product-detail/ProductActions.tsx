
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductActionsProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
  };
  onContactSeller: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onContactSeller
}) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      sellerId: 'seller-' + product.id, // Mock seller ID
      sellerName: 'Vendedor EcoFriendly' // Mock seller name
    });
    
    toast({
      title: "Producto agregado",
      description: `${product.title} añadido al carrito`,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button 
        className="flex-1 bg-green hover:bg-green-dark"
        onClick={handleAddToCart}
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
