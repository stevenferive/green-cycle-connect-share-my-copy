
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { categories } from "@/data/sampleProducts";

interface FilterPanelProps {
  selectedCategories: string[];
  priceRange: [number, number];
  onlyExchange: boolean;
  onCategoryToggle: (category: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onExchangeToggle: (checked: boolean) => void;
  onSearch: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategories,
  priceRange,
  onlyExchange,
  onCategoryToggle,
  onPriceRangeChange,
  onExchangeToggle,
  onSearch,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading font-medium mb-2">Categorías</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`} 
                checked={category === "Todos" ? selectedCategories.length === 0 : selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryToggle(category)}
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
          onValueChange={value => onPriceRangeChange(value as [number, number])}
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
          onCheckedChange={(checked) => onExchangeToggle(checked === true)}
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
        onClick={onSearch}
      >
        Aplicar filtros
      </Button>
    </div>
  );
};

export default FilterPanel;
