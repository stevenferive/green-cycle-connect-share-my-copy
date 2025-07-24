
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductActionsProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    sellerId?: string;
    sellerName?: string;
  };
  onContactSeller?: () => void; // Hacerlo opcional ya que la funcionalidad ahora está en MessageForm
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onContactSeller
}) => {
  const { addItem, isLoading } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      sellerId: product.sellerId || 'seller-' + product.id, // Mock seller ID si no existe
      sellerName: product.sellerName || 'Vendedor EcoFriendly' // Mock seller name si no existe
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button 
        className="w-full bg-green hover:bg-green-dark"
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading ? 'Agregando...' : 'Agregar al carrito'}
      </Button>
    </div>
  );
};

export default ProductActions;
