import React from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProductImage from "@/components/product-detail/ProductImage";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductActions from "@/components/product-detail/ProductActions";
import ProductDescription from "@/components/product-detail/ProductDescription";
import MessageForm from "@/components/product-detail/MessageForm";
import { useAuth } from "@/lib/auth-context";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";
import { useProduct } from "@/hooks/useProducts";
import { mapProductResponseToProduct } from "@/utils/productMapper";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  // Usar el hook para obtener el producto específico de la API
  const { data: productData, isLoading, error } = useProduct(id || '');
  
  // Mapear el producto de la API al formato esperado
  const product = productData ? mapProductResponseToProduct(productData) : null;
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      toast({
        title: "Producto agregado",
        description: `${product.title} añadido al carrito`,
      });
    }
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    toast({
      title: "Mensaje enviado",
      description: "Tu mensaje ha sido enviado al vendedor",
    });
  };

  // Handle contact seller button click
  const handleContactSeller = () => {
    document.getElementById('messageArea')?.focus();
  };
  
  // Loading state
  if (isLoading) {
    const loadingContent = (
      <main className="flex-1 container py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
      </main>
    );

    if (isAuthenticated) {
      return <AuthenticatedLayout>{loadingContent}</AuthenticatedLayout>;
    }

    return (
      <div className="flex min-h-screen flex-col">
        {loadingContent}
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    const errorContent = (
      <main className="flex-1 container py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Error al cargar el producto</h1>
          <p className="text-muted-foreground mb-6">
            No se pudo cargar la información del producto. Por favor, intenta de nuevo.
          </p>
          <Link to="/explore">
            <Button className="bg-green hover:bg-green-dark">
              Explorar otros productos
            </Button>
          </Link>
        </div>
      </main>
    );

    if (isAuthenticated) {
      return <AuthenticatedLayout>{errorContent}</AuthenticatedLayout>;
    }

    return (
      <div className="flex min-h-screen flex-col">
        {errorContent}
        <Footer />
      </div>
    );
  }

  // Handle case where product is not found
  if (!product) {
    const content = (
      <main className="flex-1 container py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Lo sentimos, el producto que buscas no está disponible.
          </p>
          <Link to="/explore">
            <Button className="bg-green hover:bg-green-dark">
              Explorar otros productos
            </Button>
          </Link>
        </div>
      </main>
    );

    if (isAuthenticated) {
      return <AuthenticatedLayout>{content}</AuthenticatedLayout>;
    }

    return (
      <div className="flex min-h-screen flex-col">
        {content}
        <Footer />
      </div>
    );
  }
  
  const content = (
    <main className="flex-1 container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <ProductImage image={product.image} title={product.title} />
        
        {/* Product Details */}
        <div className="space-y-6">
          <ProductInfo 
            title={product.title}
            location={product.location}
            price={product.price}
            exchange={product.exchange}
            ecoBadges={product.ecoBadges}
            ecoSaving={product.ecoSaving}
          />
          
          <ProductDescription />
          
          <ProductActions 
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              category: product.category
            }}
            onContactSeller={handleContactSeller}
          />
          
          <MessageForm onSendMessage={handleSendMessage} />
        </div>
      </div>
    </main>
  );

  if (isAuthenticated) {
    return <AuthenticatedLayout>{content}</AuthenticatedLayout>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {content}
      <Footer />
    </div>
  );
};

export default ProductDetail;
