
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth-context";
import { useProducts } from "@/hooks/useProducts";
import { mapProductResponseToProduct } from "@/utils/productMapper";
import { useProductFilters } from "@/hooks/useProductFilters";
import FilterModal from "@/components/explore/FilterModal";
import SearchBar from "@/components/explore/SearchBar";
import ProductGrid from "@/components/explore/ProductGrid";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const Explore = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Usar el hook para obtener productos de la API
  const { data: productsData, isLoading, error } = useProducts();
  
  // Mapear los productos de la API al formato esperado por el frontend
  const products = productsData ? productsData.map(mapProductResponseToProduct) : [];
  
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
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        {!isAuthenticated && <Navbar />}
        <main className="flex-1 container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          </div>
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Error al cargar los productos</p>
              <p className="text-muted-foreground">Por favor, intenta recargar la página</p>
            </div>
          </div>
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
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex-shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          {/* Barra de búsqueda */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearch={handleSearch}
          />
          
          {/* Resultados */}
          <ProductGrid products={filteredProducts} />
        </div>

        {/* Modal de filtros */}
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
