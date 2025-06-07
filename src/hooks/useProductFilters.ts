
import { useState, useMemo } from "react";
import { Product } from "@/components/products/ProductCard";
import { useToast } from "@/hooks/use-toast";

export const useProductFilters = (products: Product[]) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
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
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
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
  }, [products, searchTerm, selectedCategories, priceRange, onlyExchange]);

  return {
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
  };
};
