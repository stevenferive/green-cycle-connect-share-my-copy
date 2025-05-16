
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageCircle, Heart, MapPin, CircleDollarSign, Repeat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  
  // Find the product with the matching ID
  const product = sampleProducts.find((p) => p.id === id);
  
  // Handle case where product is not found
  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-heading font-bold mb-4">Producto no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              Lo sentimos, el producto que buscas no está disponible.
            </p>
            <Button href="/explore" className="bg-green hover:bg-green-dark">
              Explorar otros productos
            </Button>
          </div>
        </main>
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
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <h1 className="text-2xl md:text-3xl font-heading font-bold">{product.title}</h1>
                <button className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Heart className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center font-heading text-xl font-semibold text-green">
                <CircleDollarSign className="mr-1 h-5 w-5" />
                S/ {product.price.toFixed(2)}
              </div>
              {product.exchange && (
                <Badge variant="outline" className="flex items-center gap-1 border-green text-green">
                  <Repeat className="h-3 w-3" /> Intercambio disponible
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {product.ecoBadges.map((badge, index) => (
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
              <span>Impacto ecológico: {product.ecoSaving}kg CO2 ahorrados</span>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="font-heading font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground">
                Este es un producto de segunda mano en excelente estado. 
                Al comprarlo contribuyes a reducir los residuos y el impacto ambiental.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1 bg-green hover:bg-green-dark"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Agregar al carrito
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 border-green text-green hover:bg-green-light/10"
                onClick={() => document.getElementById('messageArea')?.focus()}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar vendedor
              </Button>
            </div>
            
            <div className="pt-4 border-t space-y-3">
              <h3 className="font-heading font-semibold">Enviar mensaje al vendedor</h3>
              <textarea 
                id="messageArea"
                className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Hola, estoy interesado en este producto. ¿Está disponible?"
              />
              <Button 
                className="w-full sm:w-auto bg-green hover:bg-green-dark"
                onClick={handleSendMessage}
              >
                Enviar mensaje
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
