
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, CircleDollarSign, Repeat, ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export interface Product {
  id: string;
  title: string;
  price: number;
  exchange: boolean;
  location: string;
  image: string;
  category: string;
  ecoBadges: string[];
  ecoSaving: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    toast({
      title: "Producto agregado",
      description: `${product.title} añadido al carrito`,
    });
  };
  
  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
  };
  
  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-heading font-medium line-clamp-2">{product.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{product.location}</span>
              </div>
            </div>
            <button className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center font-heading font-semibold text-green">
                <CircleDollarSign className="mr-1 h-4 w-4" />
                S/ {product.price.toFixed(2)}
              </div>
              {product.exchange && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs border-green text-green">
                  <Repeat className="h-3 w-3" /> Intercambio
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {product.ecoBadges.map((badge, index) => (
              <Badge key={index} className="bg-green-light text-white text-xs">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Recycle className="h-3 w-3 text-green" />
            <span>Eco-impacto: {product.ecoSaving}kg CO2 ahorrados</span>
          </div>
          
          {/* Add to Cart and Chat Buttons */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <Button 
              size="sm" 
              className="flex-1 bg-green hover:bg-green-dark"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Agregar
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-green text-green hover:bg-green-light/10"
                  onClick={handleChatClick}
                >
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Chatear
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" onClick={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <h4 className="font-medium">Contacta al vendedor</h4>
                  <p className="text-sm text-muted-foreground">
                    Envía un mensaje al vendedor para consultar sobre este producto.
                  </p>
                  <textarea 
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                  <Button 
                    className="w-full bg-green hover:bg-green-dark"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "Mensaje enviado",
                        description: "Tu mensaje ha sido enviado al vendedor",
                      });
                    }}
                  >
                    Enviar mensaje
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const Recycle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
    <path d="m14 16-3 3 3 3" />
    <path d="M8.293 13.596 4.5 9.828a1.83 1.83 0 0 1-.083-2.576l.117-.129A1.824 1.824 0 0 1 6.044 6.5H9" />
    <path d="M10.5 6.5h6.043a1.83 1.83 0 0 1 1.536.894l.035.061a1.784 1.784 0 0 1-.028 1.768l-4.287 7.5" />
    <path d="m17.5 6.5-3-3-3 3" />
  </svg>
);

export default ProductCard;
