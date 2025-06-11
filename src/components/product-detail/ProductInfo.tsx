
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, CircleDollarSign, Repeat } from "lucide-react";

interface ProductInfoProps {
  title: string;
  location: string;
  price: number;
  exchange: boolean;
  ecoBadges: string[];
  ecoSaving: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  title,
  location,
  price,
  exchange,
  ecoBadges,
  ecoSaving
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">{title}</h1>
          <button className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Heart className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mt-2 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center font-heading text-xl font-semibold text-green">
          <CircleDollarSign className="mr-1 h-5 w-5" />
          S/ {price.toFixed(2)}
        </div>
        {exchange && (
          <Badge variant="outline" className="flex items-center gap-1 border-green text-green">
            <Repeat className="h-3 w-3" /> Intercambio disponible
          </Badge>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {ecoBadges.map((badge, index) => (
          <Badge key={index} className="bg-green-light text-white">
            {badge}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <svg
          className="h-4 w-4 text-green"
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
        <span>Impacto ecológico: {ecoSaving}kg CO2 ahorrados</span>
      </div>
    </div>
  );
};

export default ProductInfo;
