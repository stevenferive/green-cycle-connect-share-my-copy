
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth-context";
import { sampleProducts } from "@/data/sampleProducts";
import { useProductFilters } from "@/hooks/useProductFilters";
import FilterPanel from "@/components/explore/FilterPanel";
import SearchBar from "@/components/explore/SearchBar";
import ProductGrid from "@/components/explore/ProductGrid";

const Explore = () => {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  
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
  } = useProductFilters(sampleProducts);
  
  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthenticated && <Navbar />}
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-heading font-bold mb-6">Explorar Productos</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtros para desktop */}
          {!isMobile && (
            <div className="w-64 flex-shrink-0 rounded-lg border bg-card p-4 shadow-sm">
              <FilterPanel
                selectedCategories={selectedCategories}
                priceRange={priceRange}
                onlyExchange={onlyExchange}
                onCategoryToggle={toggleCategory}
                onPriceRangeChange={setPriceRange}
                onExchangeToggle={setOnlyExchange}
                onSearch={handleSearch}
              />
            </div>
          )}
          
          {/* Contenido principal */}
          <div className="flex-1">
            <SearchBar
              searchTerm={searchTerm}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              onlyExchange={onlyExchange}
              onSearchTermChange={setSearchTerm}
              onCategoryToggle={toggleCategory}
              onPriceRangeChange={setPriceRange}
              onExchangeToggle={setOnlyExchange}
              onSearch={handleSearch}
            />
            
            {/* Resultados */}
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </main>
      {!isAuthenticated && <Footer />}
    </div>
  );
};

export default Explore;
