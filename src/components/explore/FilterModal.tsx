
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FilterPanel from "./FilterPanel";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  priceRange: [number, number];
  onlyExchange: boolean;
  onCategoryToggle: (category: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onExchangeToggle: (checked: boolean) => void;
  onSearch: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  priceRange,
  onlyExchange,
  onCategoryToggle,
  onPriceRangeChange,
  onExchangeToggle,
  onSearch,
}) => {
  const handleApplyFilters = () => {
    onSearch();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>
        <FilterPanel
          selectedCategories={selectedCategories}
          priceRange={priceRange}
          onlyExchange={onlyExchange}
          onCategoryToggle={onCategoryToggle}
          onPriceRangeChange={onPriceRangeChange}
          onExchangeToggle={onExchangeToggle}
          onSearch={handleApplyFilters}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
