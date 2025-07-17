
import React, { useEffect, useState } from 'react';
import ProductUploadModal from '@/components/products/ProductUploadModal';
import MyProductsHeader from '@/components/products/MyProductsHeader';
import MyProductsStats from '@/components/products/MyProductsStats';
import MyProductsActions from '@/components/products/MyProductsActions';
import MyProductsList from '@/components/products/MyProductsList';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useSellerProducts } from '@/hooks/useSellerProducts';
import { mockProducts } from '@/data/mockProducts';
import { productService } from '@/services/productService';

const MyProducts = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Usar el hook del vendedor si el usuario está autenticado
  const {
    products: sellerProducts,
    loading,
    error,
    totalPages,
    total,
    refresh,
    setPage
  } = useSellerProducts({
    sellerId: user?.id || '',
    page: currentPage,
    limit: 10
  });

  // Estado de fallback para productos locales
  const [localProducts, setLocalProducts] = useState(mockProducts);

  const handleProductUpdate = (updatedProduct: any) => {
    if (isAuthenticated && user?.id) {
      // Si está autenticado, refrescar desde el servidor
      refresh();
    } else {
      // Si no está autenticado, actualizar productos locales
      const productId = updatedProduct.id || updatedProduct._id;
      setLocalProducts(prev => prev.map(p => 
        (p.id === productId || ('_id' in p && p._id === productId)) ? updatedProduct : p
      ));
      toast({
        title: "Producto actualizado",
        description: "Los cambios se han guardado correctamente.",
      });
    }
  };

  const handleProductDelete = (productId: string) => {
    if (isAuthenticated && user?.id) {
      // Si está autenticado, refrescar desde el servidor
      refresh();
    } else {
      // Si no está autenticado, actualizar productos locales
      setLocalProducts(prev => prev.filter(p => 
        p.id !== productId && !('_id' in p && p._id === productId)
      ));
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado de tus publicaciones.",
      });
    }
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
    
    if (isAuthenticated && user?.id) {
      // Si está autenticado, refrescar desde el servidor
      refresh();
    } else {
      // Si no está autenticado, actualizar productos locales
      setLocalProducts(prev => [product, ...prev]);
    }
    
    setIsUploadModalOpen(false);
    toast({
      title: "¡Producto publicado!",
      description: "¡Gracias por compartir tu producto ecológico con la comunidad!",
    });
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  // Función para mapear ProductResponse a formato compatible
  const mapProductResponse = (product: any) => ({
    ...product,
    id: product._id || product.id,
    image: product.images && product.images.length > 0 ? product.images[0] : product.image || "https://www.nfctogo.com/images/empty-img.png"
  });

  // Determinar qué productos mostrar
  const currentProducts = isAuthenticated && user?.id 
    ? sellerProducts.map(mapProductResponse)
    : localProducts;
  
  // Función de fallback para cargar todos los productos (mantener compatibilidad)
  const loadProducts = async () => {
    if (isAuthenticated && user?.id) {
      // Si está autenticado, usar el hook para refrescar
      refresh();
    } else {
      // Si no está autenticado, cargar todos los productos
      try {
        let req: any = await productService.getAllProducts();
        req = req.map((j: any) => {
          j.image = j.images && j.images.length > 0 ? j.images[0] : "https://www.nfctogo.com/images/empty-img.png";
          return j;
        });
        setLocalProducts(req);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    }
  }

  // Manejar cambios de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setPage(page);
  };

  // Mostrar error si hay uno
  useEffect(() => {
    if (error && isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast, isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <MyProductsHeader />
          
          {/* Mostrar loading state */}
          {loading && isAuthenticated && (
            <div className="flex justify-center items-center py-8">
              <div className="text-sm text-muted-foreground">Cargando productos...</div>
            </div>
          )}
          
          {/* Mostrar error state */}
          {error && isAuthenticated && (
            <div className="text-center py-8">
              <div className="text-sm text-red-600 mb-4">{error}</div>
              <button 
                onClick={refresh}
                className="text-sm text-primary hover:underline"
              >
                Intentar nuevamente
              </button>
            </div>
          )}
          
          {/* Mostrar contenido normal */}
          {(!loading || !isAuthenticated) && !error && (
            <>
              <MyProductsStats products={currentProducts} />
              <MyProductsActions
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onUploadClick={handleUploadClick}
              />
              <MyProductsList
                products={currentProducts}
                searchTerm={searchTerm}
                onProductUpdate={handleProductUpdate}
                onProductDelete={handleProductDelete}
                onUploadClick={handleUploadClick}
              />
              
              {/* Paginación para usuarios autenticados */}
              {isAuthenticated && user?.id && totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                    >
                      Anterior
                    </button>
                    
                    <span className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages} ({total} productos)
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ProductUploadModal
        loadProducts={loadProducts}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSave={handleNewProduct}
      />
    </div>
  );
};

export default MyProducts;
