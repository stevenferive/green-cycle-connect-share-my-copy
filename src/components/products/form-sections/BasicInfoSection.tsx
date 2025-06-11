
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductValidationErrors } from '@/types/product';

interface BasicInfoSectionProps {
  name: string;
  slug: string;
  description: string;
  category: string;
  condition: string;
  onInputChange: (field: string, value: any) => void;
  validationErrors: ProductValidationErrors;
}

const conditionOptions = [
  { value: 'new', label: 'Nuevo' },
  { value: 'like_new', label: 'Como nuevo' },
  { value: 'good', label: 'Bueno' },
  { value: 'fair', label: 'Regular' },
  { value: 'poor', label: 'Malo' },
];

const ecoCategories = [
  'Orgánico', 'Reciclado', 'Artesanal', 'Biodegradable', 'Comercio Justo',
  'Energía Renovable', 'Reutilizable', 'Eco-amigable', 'Hogar', 'Moda',
  'Electrónica', 'Muebles', 'Transporte', 'Niños', 'Jardín', 'Libros', 'Deportes'
];

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  slug,
  description,
  category,
  condition,
  onInputChange,
  validationErrors
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información básica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del producto *</Label>
            <Input
              id="name"
              placeholder="Ej: Bolsa reutilizable de algodón orgánico"
              value={name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={validationErrors.name ? 'border-red-500' : ''}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL amigable)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => onInputChange('slug', e.target.value)}
              placeholder="se-genera-automaticamente"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción *</Label>
          <Textarea
            id="description"
            placeholder="Describe las características ecológicas y beneficios de tu producto..."
            value={description}
            onChange={(e) => onInputChange('description', e.target.value)}
            rows={4}
            className={validationErrors.description ? 'border-red-500' : ''}
          />
          {validationErrors.description && (
            <p className="text-sm text-red-500">{validationErrors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Categoría *</Label>
            <Select onValueChange={(value) => onInputChange('category', value)}>
              <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {ecoCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.category && (
              <p className="text-sm text-red-500">{validationErrors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Condición *</Label>
            <Select 
              value={condition} 
              onValueChange={(value) => onInputChange('condition', value)}
            >
              <SelectTrigger className={validationErrors.condition ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona la condición" />
              </SelectTrigger>
              <SelectContent>
                {conditionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.condition && (
              <p className="text-sm text-red-500">{validationErrors.condition}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
