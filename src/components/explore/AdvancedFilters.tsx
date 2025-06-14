
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StarIcon, X } from 'lucide-react';

export interface AdvancedFilterState {
  priceRange: [number, number];
  categories: string[];
  condition: string[];
  location: string;
  ecoRating: number;
  sellerRating: number;
  distance: number;
  onlyExchange: boolean;
  hasEcoBadges: boolean;
  isVerified: boolean;
  sortBy: string;
}

interface AdvancedFiltersProps {
  filters: AdvancedFilterState;
  onFiltersChange: (filters: AdvancedFilterState) => void;
  onReset: () => void;
  isOpen: boolean;
}

const categories = [
  'Electrónica', 'Ropa', 'Hogar', 'Libros', 'Deportes', 
  'Ecológicos', 'Regalos', 'Alimentos', 'Muebles', 'Transporte'
];

const conditions = ['Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Aceptable'];

const sortOptions = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'distance', label: 'Distancia' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'eco_score', label: 'Puntuación ecológica' }
];

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  isOpen
}) => {
  if (!isOpen) return null;

  const updateFilter = (key: keyof AdvancedFilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilter('categories', newCategories);
  };

  const toggleCondition = (condition: string) => {
    const newConditions = filters.condition.includes(condition)
      ? filters.condition.filter(c => c !== condition)
      : [...filters.condition, condition];
    updateFilter('condition', newConditions);
  };

  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'priceRange' && (value[0] > 0 || value[1] < 1000)) count++;
    if (key === 'categories' && value.length > 0) count++;
    if (key === 'condition' && value.length > 0) count++;
    if (key === 'location' && value) count++;
    if (key === 'ecoRating' && value > 0) count++;
    if (key === 'sellerRating' && value > 0) count++;
    if (key === 'distance' && value < 50) count++;
    if ((key === 'onlyExchange' || key === 'hasEcoBadges' || key === 'isVerified') && value) count++;
    return count;
  }, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} activos</Badge>
            )}
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ordenar por */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Ordenar por</Label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar orden" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Rango de precio */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Precio: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value)}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Categorías */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Categorías</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:bg-green/10"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Condición */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Condición del producto</Label>
          <div className="space-y-2">
            {conditions.map(condition => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={filters.condition.includes(condition)}
                  onCheckedChange={() => toggleCondition(condition)}
                />
                <Label htmlFor={condition} className="text-sm">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Distancia */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Distancia máxima: {filters.distance === 50 ? '50+ km' : `${filters.distance} km`}
          </Label>
          <Slider
            value={[filters.distance]}
            onValueChange={(value) => updateFilter('distance', value[0])}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Ratings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Puntuación ecológica mínima</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 cursor-pointer ${
                    star <= filters.ecoRating ? 'fill-green text-green' : 'text-gray-300'
                  }`}
                  onClick={() => updateFilter('ecoRating', star === filters.ecoRating ? 0 : star)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Valoración del vendedor mínima</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 cursor-pointer ${
                    star <= filters.sellerRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => updateFilter('sellerRating', star === filters.sellerRating ? 0 : star)}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Opciones adicionales */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Opciones adicionales</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="onlyExchange"
                checked={filters.onlyExchange}
                onCheckedChange={(checked) => updateFilter('onlyExchange', checked)}
              />
              <Label htmlFor="onlyExchange" className="text-sm">
                Solo intercambios
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasEcoBadges"
                checked={filters.hasEcoBadges}
                onCheckedChange={(checked) => updateFilter('hasEcoBadges', checked)}
              />
              <Label htmlFor="hasEcoBadges" className="text-sm">
                Con certificaciones ecológicas
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVerified"
                checked={filters.isVerified}
                onCheckedChange={(checked) => updateFilter('isVerified', checked)}
              />
              <Label htmlFor="isVerified" className="text-sm">
                Solo vendedores verificados
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
