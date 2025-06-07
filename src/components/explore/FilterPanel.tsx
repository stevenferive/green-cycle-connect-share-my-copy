
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const handleSliderChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setLocalPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    const newRange: [number, number] = [value, Math.max(value, localPriceRange[1])];
    setLocalPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(localPriceRange[0], parseInt(e.target.value) || 1000);
    const newRange: [number, number] = [localPriceRange[0], value];
    setLocalPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

  const handleFreeOnlyToggle = () => {
    const newShowFreeOnly = !showFreeOnly;
    setShowFreeOnly(newShowFreeOnly);
    
    if (newShowFreeOnly) {
      const freeRange: [number, number] = [0, 0];
      setLocalPriceRange(freeRange);
      onPriceRangeChange(freeRange);
    } else {
      const defaultRange: [number, number] = [0, 1000];
      setLocalPriceRange(defaultRange);
      onPriceRangeChange(defaultRange);
    }
  };

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
        <h3 className="font-heading font-medium mb-3">Rango de precio</h3>
        
        {/* Botón para productos gratis */}
        <div className="mb-4">
          <Button
            variant={showFreeOnly ? "default" : "outline"}
            size="sm"
            onClick={handleFreeOnlyToggle}
            className={showFreeOnly ? "bg-green hover:bg-green-dark" : ""}
          >
            Solo productos gratis
          </Button>
        </div>

        {!showFreeOnly && (
          <>
            {/* Inputs para rango de precio */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="space-y-1">
                <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                  Precio mínimo
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    S/
                  </span>
                  <Input
                    id="min-price"
                    type="number"
                    min="0"
                    max="1000"
                    value={localPriceRange[0]}
                    onChange={handleMinPriceChange}
                    className="pl-8 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                  Precio máximo
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    S/
                  </span>
                  <Input
                    id="max-price"
                    type="number"
                    min="0"
                    max="1000"
                    value={localPriceRange[1]}
                    onChange={handleMaxPriceChange}
                    className="pl-8 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="px-1">
              <Slider
                value={[localPriceRange[0], localPriceRange[1]]}
                min={0}
                max={1000}
                step={5}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>S/ 0</span>
                <span>S/ 1000</span>
              </div>
            </div>
          </>
        )}

        {showFreeOnly && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            Mostrando solo productos gratis (S/ 0)
          </div>
        )}
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
