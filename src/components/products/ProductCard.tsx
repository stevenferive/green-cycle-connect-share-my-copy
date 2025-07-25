
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Recycle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  seller: string;
  sellerId?: string;
  price: number;
  originalPrice?: number;
  location: string;
  image: string;
  category: string;
  ecoBadges?: string[];
  isFavorite?: boolean;
  isNew?: boolean;
  forBarter?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  seller,
  sellerId,
  price,
  originalPrice,
  location,
  image,
  category,
  ecoBadges = [],
  isFavorite = false,
  isNew = false,
  forBarter = false,
}) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorited, setIsFavorited] = useState(isFavorite);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación del Link
    e.stopPropagation(); // Detener propagación del evento
    
    setIsAdding(true);
    try {
      await addItem({
        id,
        title,
        price,
        image,
        category,
        sellerId: sellerId || `seller-${id}`,
        sellerName: seller
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const discount = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Link to={`/product/${id}`} className="block">
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white/90 shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge className="bg-blue-500 hover:bg-blue-600">Nuevo</Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600">
                -{discount}%
              </Badge>
            )}
            {forBarter && (
              <Badge className="bg-purple-500 hover:bg-purple-600">
                Intercambio
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          {/* Eco badges */}
          {ecoBadges.length > 0 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {ecoBadges.slice(0, 2).map((badge, index) => (
                <div
                  key={index}
                  className="h-6 w-6 bg-green/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  title={badge}
                >
                  <Recycle className="h-3 w-3 text-white" />
                </div>
              ))}
              {ecoBadges.length > 2 && (
                <div className="h-6 w-6 bg-green/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-white font-bold">
                    +{ecoBadges.length - 2}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <CardContent className="p-3">
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 mb-1">
            {title}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-sm font-bold text-green-700">
              {forBarter ? "Intercambio" : `S/${(price || 0).toFixed(2)}`}
            </span>
            {originalPrice && !forBarter && (
              <span className="text-xs text-gray-500 line-through">
                S/ {(originalPrice || 0).toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600">{location}</p>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Botón de agregar al carrito */}
          {!forBarter && (
            <Button
              size="sm"
              className="w-full bg-[#FAA220] hover:bg-[#FAA220]/90 text-white text-xs py-1.5"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Agregando...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-1 h-3 w-3" />
                  Agregar al carrito
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
