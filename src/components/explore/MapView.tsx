
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Layers,
  Search,
  Filter
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  distance: string;
}

const MapView = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Bicicleta Vintage',
      price: 450,
      image: '/placeholder.svg',
      location: { lat: -34.6037, lng: -58.3816, address: 'Palermo, CABA' },
      distance: '2.5 km'
    },
    {
      id: '2',
      name: 'Lámpara Artesanal',
      price: 120,
      image: '/placeholder.svg',
      location: { lat: -34.6118, lng: -58.3960, address: 'Recoleta, CABA' },
      distance: '1.8 km'
    },
    {
      id: '3',
      name: 'Monitor 4K',
      price: 680,
      image: '/placeholder.svg',
      location: { lat: -34.5977, lng: -58.3710, address: 'Puerto Madero, CABA' },
      distance: '3.2 km'
    }
  ]);



  // ALGUN DIAAA: USAREMOS leaflet libreria para mapas :V
  // pero x ahora todavia nadota Dx

  return (
    <div className="h-[600px] relative">
      {/* Map placeholder - En una implementación real usarías Google Maps o Mapbox */}
      <div className="w-full h-full bg-muted rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green/20 to-blue-500/20" />
        
        {/* Map controls */}
        <div className="absolute top-4 left-4 space-y-2">
          <Button size="icon" variant="secondary">
            <Navigation className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary">
            <Layers className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute top-4 right-4">
          <Button variant="secondary">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Product markers */}
        {products.map((product, index) => (
          <div
            key={product.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${30 + index * 20}%`,
              top: `${40 + index * 15}%`
            }}
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-green rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green rotate-45" />
            </div>
          </div>
        ))}

        {/* Map placeholder text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2" />
            <p>Mapa de productos cercanos</p>
            <p className="text-sm">Haz clic en los marcadores para ver detalles</p>
          </div>
        </div>
      </div>

      {/* Product details popup */}
      {selectedProduct && (
        <Card className="absolute bottom-4 left-4 right-4 z-10">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium">{selectedProduct.name}</h3>
                <p className="text-lg font-bold text-green">${selectedProduct.price}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{selectedProduct.location.address}</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedProduct.distance}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm">Ver detalles</Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedProduct(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products list */}
      <div className="absolute left-4 top-20 w-64 space-y-2 max-h-96 overflow-y-auto">
        {products.map((product) => (
          <Card key={product.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{product.name}</h4>
                  <p className="text-sm text-green font-medium">${product.price}</p>
                  <p className="text-xs text-muted-foreground">{product.distance}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MapView;
