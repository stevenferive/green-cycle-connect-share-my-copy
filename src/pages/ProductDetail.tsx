
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

// Import sample products data to show product details
import { Product } from "@/components/products/ProductCard";

// Sample products data (in a real application, this would come from an API or database)
const sampleProducts: Product[] = [
  {
    id: "1",
    title: "Bicicleta urbana restaurada",
    price: 350,
    exchange: true,
    location: "Lima",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Transporte",
    ecoBadges: ["Restaurado", "Ahorro CO2"],
    ecoSaving: 45
  },
  {
    id: "2",
    title: "Macetas de bambú hechas a mano",
    price: 25,
    exchange: false,
    location: "Arequipa",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
    category: "Hogar",
    ecoBadges: ["Artesanal", "Material sostenible"],
    ecoSaving: 15
  },
  {
    id: "3",
    title: "Juego de muebles de palet reciclado",
    price: 580,
    exchange: true,
    location: "Cusco",
    image: "https://images.unsplash.com/photo-1533377379555-65bdad2fb9f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Muebles",
    ecoBadges: ["Reciclado", "Hecho a mano"],
    ecoSaving: 120
  },
  {
    id: "4",
    title: "Teléfono móvil reacondicionado",
    price: 280,
    exchange: false,
    location: "Lima",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1467&q=80",
    category: "Electrónica",
    ecoBadges: ["Reacondicionado", "E-waste reducido"],
    ecoSaving: 75
  },
  {
    id: "5",
    title: "Ropa vintage en excelente estado",
    price: 45,
    exchange: true,
    location: "Trujillo",
    image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Moda",
    ecoBadges: ["Segunda mano", "Slow fashion"],
    ecoSaving: 30
  },
  {
    id: "6",
    title: "Juguetes de madera ecológicos",
    price: 65,
    exchange: false,
    location: "Piura",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1475&q=80",
    category: "Niños",
    ecoBadges: ["Materiales orgánicos", "No tóxico"],
    ecoSaving: 25
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  // Find the product with the matching ID
  const product = sampleProducts.find((p) => p.id === id);
  
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
  
  // Handle adding to cart
  const handleAddToCart = () => {
    toast({
      title: "Producto agregado",
      description: `${product.title} añadido al carrito`,
    });
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
            onAddToCart={handleAddToCart}
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
