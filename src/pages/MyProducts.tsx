
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import ProductUploadModal from '@/components/products/ProductUploadModal';
import MyProductCard from '@/components/products/MyProductCard';
import { useToast } from '@/hooks/use-toast';

// Datos de ejemplo de productos del usuario
const myProducts = [
  {
    id: '1',
    name: 'Bolsa Reutilizable de Algodón',
    description: 'Bolsa 100% algodón orgánico para compras',
    category: 'Orgánico',
    stock: 15,
    price: 25.00,
    forBarter: false,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    status: 'active' as const,
    publishedAt: '2024-01-15',
    views: 45,
    favorites: 8
  },
  {
    id: '2',
    name: 'Maceta de Material Reciclado',
    description: 'Maceta hecha con botellas plásticas recicladas',
    category: 'Reciclado',
    stock: 0,
    price: 0,
    forBarter: true,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    status: 'out_of_stock' as const,
    publishedAt: '2024-01-10',
    views: 32,
    favorites: 12
  },
  {
    id: '3',
    name: 'Jabón Artesanal de Lavanda',
    description: 'Jabón hecho a mano con ingredientes naturales',
    category: 'Artesanal',
    stock: 8,
    price: 15.00,
    forBarter: false,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    status: 'paused' as const,
    publishedAt: '2024-01-08',
    views: 28,
    favorites: 5
  }
];

const MyProducts = () => {
  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(myProducts);

  const handleProductUpdate = (updatedProduct: any) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    toast({
      title: "Producto actualizado",
      description: "Los cambios se han guardado correctamente.",
    });
  };

  const handleProductDelete = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de tus publicaciones.",
    });
  };

  const handleNewProduct = (newProduct: any) => {
    const product = {
      ...newProduct,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString().split('T')[0],
      views: 0,
      favorites: 0,
      status: 'active' as const
    };
    setProducts(prev => [product, ...prev]);
    setIsUploadModalOpen(false);
    toast({
      title: "¡Producto publicado!",
      description: "¡Gracias por compartir tu producto ecológico con la comunidad!",
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const totalFavorites = products.reduce((sum, p) => sum + p.favorites, 0);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mis Productos</h1>
            <p className="text-muted-foreground">
              Gestiona tus publicaciones y comparte productos ecológicos con la comunidad
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-green">{products.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Activos</p>
                    <p className="text-2xl font-bold text-green">{activeProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Visualizaciones</p>
                    <p className="text-2xl font-bold text-green">{totalViews}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Favoritos</p>
                    <p className="text-2xl font-bold text-green">{totalFavorites}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barra de acciones */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-green hover:bg-green-dark text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Subir Producto
            </Button>
          </div>

          {/* Lista de productos */}
          {filteredProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground mb-4">
                  {searchTerm ? 'No se encontraron productos con ese término de búsqueda.' : 'Aún no tienes productos publicados.'}
                </div>
                {!searchTerm && (
                  <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-green hover:bg-green-dark text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Publicar mi primer producto
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <MyProductCard
                  key={product.id}
                  product={product}
                  onUpdate={handleProductUpdate}
                  onDelete={handleProductDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal para subir producto */}
      <ProductUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleNewProduct}
      />
    </div>
  );
};

export default MyProducts;
