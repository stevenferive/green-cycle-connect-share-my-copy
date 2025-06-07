
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import FilterPanel from "./FilterPanel";

interface SearchBarProps {
  searchTerm: string;
  selectedCategories: string[];
  priceRange: [number, number];
  onlyExchange: boolean;
  onSearchTermChange: (term: string) => void;
  onCategoryToggle: (category: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onExchangeToggle: (checked: boolean) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  selectedCategories,
  priceRange,
  onlyExchange,
  onSearchTermChange,
  onCategoryToggle,
  onPriceRangeChange,
  onExchangeToggle,
  onSearch,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Buscar productos..." 
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
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
              <FilterPanel
                selectedCategories={selectedCategories}
                priceRange={priceRange}
                onlyExchange={onlyExchange}
                onCategoryToggle={onCategoryToggle}
                onPriceRangeChange={onPriceRangeChange}
                onExchangeToggle={onExchangeToggle}
                onSearch={onSearch}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
      
      <Button className="bg-green hover:bg-green-dark" onClick={onSearch}>
        <Search className="h-4 w-4 mr-2" />
        Buscar
      </Button>
    </div>
  );
};

export default SearchBar;
