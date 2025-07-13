
import React, { useEffect, useState } from 'react';
import ProductUploadModal from '@/components/products/ProductUploadModal';
import MyProductsHeader from '@/components/products/MyProductsHeader';
import MyProductsStats from '@/components/products/MyProductsStats';
import MyProductsActions from '@/components/products/MyProductsActions';
import MyProductsList from '@/components/products/MyProductsList';
import { useToast } from '@/hooks/use-toast';
import { mockProducts } from '@/data/mockProducts';
import axios from 'axios';
import { productService } from '@/services/productService';

const MyProducts = () => {
  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(mockProducts);

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

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const loadProducts = async () => {
    // let token = localStorage.getItem("auth_token");
    let req: any = await productService.getAllProducts();
    req = req.map((j: any) => {
      j.image = j.images && j.images.length > 0 ? j.images[0] :"https://www.nfctogo.com/images/empty-img.png";
      return j;
    })

    setProducts(req);

    return;
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <MyProductsHeader />
          <MyProductsStats products={products} />
          <MyProductsActions
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onUploadClick={handleUploadClick}
          />
          <MyProductsList
            products={products}
            searchTerm={searchTerm}
            onProductUpdate={handleProductUpdate}
            onProductDelete={handleProductDelete}
            onUploadClick={handleUploadClick}
          />
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
