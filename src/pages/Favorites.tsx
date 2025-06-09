
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Leaf, 
  ShoppingBag,
  Trash2,
  Search
} from 'lucide-react';

// Mock data para productos favoritos
const mockFavorites = [
  {
    id: '1',
    name: 'Bolsa Reutilizable de Algodón',
    category: 'Orgánico',
    price: 25.00,
    forBarter: false,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    status: 'active' as const,
    sellerId: 'seller1'
  },
  {
    id: '2',
    name: 'Maceta de Material Reciclado',
    category: 'Reciclado',
    price: 0,
    forBarter: true,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    status: 'out_of_stock' as const,
    sellerId: 'seller2'
  },
  {
    id: '3',
    name: 'Jabón Artesanal de Lavanda',
    category: 'Artesanal',
    price: 15.00,
    forBarter: false,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    status: 'inactive' as const,
    sellerId: 'seller3'
  }
];

interface FavoriteProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  forBarter: boolean;
  image: string;
  status: 'active' | 'out_of_stock' | 'inactive' | 'removed';
  sellerId: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(mockFavorites);
  const { toast } = useToast();

  const handleRemoveFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(product => product.id !== productId));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de tus favoritos",
    });
  };

  const getStatusInfo = (status: FavoriteProduct['status']) => {
    switch (status) {
      case 'out_of_stock':
        return { 
          label: 'Sin stock', 
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: '📦'
        };
      case 'inactive':
        return { 
          label: 'Inactivo', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '⏸️'
        };
      case 'removed':
        return { 
          label: 'Eliminado', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '❌'
        };
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Orgánico': 'bg-green-100 text-green-800 border-green-200',
      'Reciclado': 'bg-blue-100 text-blue-800 border-blue-200',
      'Artesanal': 'bg-purple-100 text-purple-800 border-purple-200',
      'Biodegradable': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Comercio Justo': 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-green" />
              <h1 className="text-2xl font-bold">Mis Favoritos</h1>
            </div>

            {/* Estado vacío */}
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-12 w-12 text-green" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  ¡Comienza a crear tu lista de favoritos!
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Aún no has agregado productos ecológicos a tus favoritos. 
                  ¡Explora y apoya el consumo responsable!
                </p>
              </div>
              
              <Link to="/explore">
                <Button className="bg-green hover:bg-green-dark text-white">
                  <Search className="mr-2 h-4 w-4" />
                  Explorar productos ecológicos
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-green fill-green" />
              <h1 className="text-2xl font-bold">Mis Favoritos</h1>
              <Badge variant="outline" className="text-green border-green">
                {favorites.length} productos
              </Badge>
            </div>
          </div>

          {/* Mensaje motivacional */}
          <Card className="mb-6 bg-green-50 border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Leaf className="h-5 w-5 text-green" />
                </div>
                <div>
                  <p className="text-sm text-green-dark font-medium">
                    🌱 ¡Excelente selección! Estos productos apoyan un estilo de vida sostenible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de favoritos */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((product) => {
              const statusInfo = getStatusInfo(product.status);
              
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    {statusInfo && (
                      <div className="absolute top-2 left-2">
                        <Badge className={`${statusInfo.color} text-xs`}>
                          {statusInfo.icon} {statusInfo.label}
                        </Badge>
                      </div>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background text-red-500 hover:text-red-600"
                      onClick={() => handleRemoveFromFavorites(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium line-clamp-2 mb-1">{product.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(product.category)}`}
                        >
                          {product.category}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          {product.forBarter ? (
                            <Badge className="bg-green text-white text-sm">
                              🔄 Intercambio
                            </Badge>
                          ) : (
                            <span className="text-lg font-semibold text-green">
                              S/ {product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/product/${product.id}`} className="flex-1">
                          <Button 
                            className="w-full bg-green hover:bg-green-dark text-white"
                            disabled={product.status === 'removed'}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Ver detalles
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Botón para explorar más */}
          <div className="mt-8 text-center">
            <Link to="/explore">
              <Button variant="outline" className="border-green text-green hover:bg-green-light/10">
                <Search className="mr-2 h-4 w-4" />
                Explorar más productos ecológicos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Favorites;
