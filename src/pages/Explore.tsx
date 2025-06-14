
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
import { SlidersHorizontal, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="flex min-h-screen flex-col">
        {!isAuthenticated && <Navbar />}
        <main className="flex-1 container py-8">
          <LoadingPage text="Cargando productos..." />
        </main>
        {!isAuthenticated && <Footer />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        {!isAuthenticated && <Navbar />}
        <main className="flex-1 container py-8">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">Error al cargar los productos</p>
                <p className="text-muted-foreground">Por favor, intenta recargar la página</p>
              </div>
            </CardContent>
          </Card>
        </main>
        {!isAuthenticated && <Footer />}
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthenticated && <Navbar />}
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-heading font-bold">Explorar Productos</h1>
          <div className="flex gap-2">
            <Button 
              variant={showAdvancedFilters ? "default" : "outline"}
              size="icon"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex-shrink-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsFilterModalOpen(true)}
              className="flex-shrink-0"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Barra de búsqueda */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearch}
          />

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
        </div>

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
      {!isAuthenticated && <Footer />}
    </div>
  );
};

export default Explore;
