
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard, { Product } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SlidersHorizontal } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Datos de ejemplo para productos
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

const categories = [
  "Todos", "Hogar", "Moda", "Electrónica", "Muebles", 
  "Transporte", "Niños", "Jardín", "Libros", "Deportes"
];

const Explore = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyExchange, setOnlyExchange] = useState(false);
  
  // Función para manejar la búsqueda
  const handleSearch = () => {
    toast({
      title: "Búsqueda realizada",
      description: `Buscando "${searchTerm}" con los filtros seleccionados.`,
    });
  };
  
  // Función para manejar la selección de categoría
  const toggleCategory = (category: string) => {
    if (category === "Todos") {
      setSelectedCategories([]);
      return;
    }
    
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Filtramos los productos según los filtros seleccionados
  const filteredProducts = sampleProducts.filter(product => {
    // Filtro por término de búsqueda
    if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtro por categoría
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Filtro por rango de precio
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filtro por intercambio
    if (onlyExchange && !product.exchange) {
      return false;
    }
    
    return true;
  });
  
  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-medium mb-2">Categorías</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`} 
                checked={category === "Todos" ? selectedCategories.length === 0 : selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <label 
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-heading font-medium mb-2">Rango de precio</h3>
        <Slider
          defaultValue={[priceRange[0], priceRange[1]]}
          min={0}
          max={1000}
          step={10}
          onValueChange={value => setPriceRange(value as [number, number])}
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>S/ {priceRange[0]}</span>
          <span>S/ {priceRange[1]}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="exchange-only" 
          checked={onlyExchange}
          onCheckedChange={(checked) => setOnlyExchange(checked === true)}
        />
        <label 
          htmlFor="exchange-only"
          className="text-sm cursor-pointer"
        >
          Solo productos para intercambio
        </label>
      </div>
      
      <Button 
        className="w-full bg-green hover:bg-green-dark"
        onClick={handleSearch}
      >
        Aplicar filtros
      </Button>
    </div>
  );
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-heading font-bold mb-6">Explorar Productos</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtros para desktop */}
          {!isMobile && (
            <div className="w-64 flex-shrink-0 rounded-lg border bg-card p-4 shadow-sm">
              <FilterPanel />
            </div>
          )}
          
          {/* Contenido principal */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Buscar productos..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              {/* Filtros para móvil */}
              {isMobile && (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="icon" className="flex-shrink-0">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="p-4">
                      <h2 className="text-lg font-heading font-medium mb-4">Filtros</h2>
                      <FilterPanel />
                    </div>
                  </DrawerContent>
                </Drawer>
              )}
              
              <Button className="bg-green hover:bg-green-dark" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
            
            {/* Resultados */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-heading font-medium">No hay productos que coincidan con tu búsqueda</h2>
                <p className="text-muted-foreground mt-2">Intenta con otros filtros o términos de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
