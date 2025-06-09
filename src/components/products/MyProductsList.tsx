
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MyProductCard from '@/components/products/MyProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  price: number;
  forBarter: boolean;
  image: string;
  status: 'active' | 'paused' | 'out_of_stock';
  publishedAt: string;
  views: number;
  favorites: number;
}

interface MyProductsListProps {
  products: Product[];
  searchTerm: string;
  onProductUpdate: (product: Product) => void;
  onProductDelete: (productId: string) => void;
  onUploadClick: () => void;
}

const MyProductsList: React.FC<MyProductsListProps> = ({
  products,
  searchTerm,
  onProductUpdate,
  onProductDelete,
  onUploadClick
}) => {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-muted-foreground mb-4">
            {searchTerm ? 'No se encontraron productos con ese término de búsqueda.' : 'Aún no tienes productos publicados.'}
          </div>
          {!searchTerm && (
            <Button
              onClick={onUploadClick}
              className="bg-green hover:bg-green-dark text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Publicar mi primer producto
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <MyProductCard
          key={product.id}
          product={product}
          onUpdate={onProductUpdate}
          onDelete={onProductDelete}
        />
      ))}
    </div>
  );
};

export default MyProductsList;
