
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth-context";
import { useProducts } from "@/hooks/useProducts";
import { mapProductResponseToProduct } from "@/utils/productMapper";
import { useProductFilters } from "@/hooks/useProductFilters";
import FilterModal from "@/components/explore/FilterModal";
import AdvancedFilters, { AdvancedFilterState } from "@/components/explore/AdvancedFilters";
import SearchBar from "@/components/explore/SearchBar";
import ProductGrid from "@/components/explore/ProductGrid";
import { LoadingPage } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Filter, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Explore = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Estados para filtros avanzados
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    priceRange: [0, 1000],
    categories: [],
    condition: [],
    location: '',
    ecoRating: 0,
    sellerRating: 0,
    distance: 50,
    onlyExchange: false,
    hasEcoBadges: false,
    isVerified: false,
    sortBy: 'newest'
  });
  
  // Usar el hook para obtener productos de la API
  const { data: productsData, isLoading, error } = useProducts();
  
  // Mapear los productos de la API al formato esperado por el frontend
  const products = productsData ? productsData.map(mapProductResponseToProduct) : [];
  
  console.log('Datos de la API:', productsData);
  console.log('Productos mapeados:', products);
  
  const {
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    selectedCategories,
    onlyExchange,
    setOnlyExchange,
    filteredProducts,
    handleSearch,
    toggleCategory,
  } = useProductFilters(products);
  
  console.log('Productos filtrados:', filteredProducts);

  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      priceRange: [0, 1000],
      categories: [],
      condition: [],
      location: '',
      ecoRating: 0,
      sellerRating: 0,
      distance: 50,
      onlyExchange: false,
      hasEcoBadges: false,
      isVerified: false,
      sortBy: 'newest'
    });
  };
  
  if (isLoading) {
    return (
      <div className="h-[calc(100vh)]">
        <main className="container py-8">
          <LoadingPage text="Cargando productos..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh)]">
        <main className="container py-8">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">Error al cargar los productos</p>
                <p className="text-muted-foreground">Por favor, intenta recargar la página</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  return (
    <div className="flex-1 min-h-full">
      <main className="container py-8">
        {/* Título centrado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-6">Explorar Productos</h1>
        </div>
        
        {/* Barra de búsqueda integrada */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-24 py-3 bg-white rounded-lg shadow-sm border-0 focus:ring-2 focus:ring-green-500"
            />
            <Button 
              onClick={handleSearch}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#FAA220] hover:bg-[#FAA220]/90 text-white px-4 py-1.5 rounded-md shadow-sm text-sm"
            >
              Buscar
            </Button>
          </div>
        </div>

        {/* Filtros avanzados */}
        {showAdvancedFilters && (
          <AdvancedFilters
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            onReset={resetAdvancedFilters}
            isOpen={showAdvancedFilters}
          />
        )}
        
        {/* Resultados */}
        <ProductGrid products={filteredProducts} />

        {/* Modal de filtros básicos */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          selectedCategories={selectedCategories}
          priceRange={priceRange}
          onlyExchange={onlyExchange}
          onCategoryToggle={toggleCategory}
          onPriceRangeChange={setPriceRange}
          onExchangeToggle={setOnlyExchange}
          onSearch={handleSearch}
        />
      </main>
    </div>
  );
};

export default Explore;
