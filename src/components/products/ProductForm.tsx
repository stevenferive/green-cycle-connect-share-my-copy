
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X, Plus, Minus } from 'lucide-react';
import { CreateProductDto, ProductValidationErrors } from '@/types/product';
import { validateProduct, generateSlug, hasValidationErrors } from '@/utils/productValidation';
import { useCreateProduct, useUploadImage } from '@/hooks/useCreateProduct';

interface ProductFormProps {
  onSuccess?: (product: any) => void;
  onCancel?: () => void;
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

const ecoBadgeOptions = [
  'Producto Sostenible', 'Empaque Biodegradable', 'Comercio Justo',
  'Reciclado', 'Orgánico', 'Artesanal', 'Cero Residuos', 'Vegano'
];

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, onCancel }) => {
  const createProductMutation = useCreateProduct();
  const uploadImageMutation = useUploadImage();

  const [formData, setFormData] = useState<Partial<CreateProductDto>>({
    name: '',
    description: '',
    slug: '',
    images: [],
    category: '',
    condition: 'new',
    seller: 'user-id-placeholder', // Se debe obtener del contexto de autenticación
    location: {
      city: '',
      region: '',
    },
    price: 0,
    currency: 'PEN',
    forBarter: false,
    barterPreferences: [],
    stock: 1,
    stockUnit: 'unidad',
    isUnlimitedStock: false,
    ecoBadges: [],
    ecoSaving: 0,
    sustainabilityScore: 50,
    materials: [],
    isHandmade: false,
    isOrganic: false,
    shippingOptions: {
      localPickup: true,
      homeDelivery: false,
      shipping: false,
      shippingCost: 0,
    },
    tags: [],
    searchKeywords: [],
  });

  const [validationErrors, setValidationErrors] = useState<ProductValidationErrors>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newBarterPreference, setNewBarterPreference] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generar slug cuando cambie el nombre
      if (field === 'name' && typeof value === 'string') {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });

    // Limpiar error de validación cuando el usuario corrija el campo
    if (validationErrors[field as keyof ProductValidationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof ProductValidationErrors];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleNestedChange = useCallback((parentField: string, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField as keyof typeof prev] as any,
        [childField]: value,
      },
    }));
  }, []);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + imageFiles.length > 10) {
      alert('Máximo 10 imágenes permitidas');
      return;
    }

    try {
      const newPreviews: string[] = [];
      const newFiles: File[] = [];

      for (const file of files) {
        const reader = new FileReader();
        const preview = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        newPreviews.push(preview);
        newFiles.push(file);
      }

      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    } catch (error) {
      console.error('Error al procesar imágenes:', error);
    }
  }, [imageFiles.length]);

  const removeImage = useCallback((index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addArrayItem = useCallback((field: 'barterPreferences' | 'materials' | 'tags', value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));

    // Limpiar el input correspondiente
    if (field === 'barterPreferences') setNewBarterPreference('');
    if (field === 'materials') setNewMaterial('');
    if (field === 'tags') setNewTag('');
  }, []);

  const removeArrayItem = useCallback((field: 'barterPreferences' | 'materials' | 'tags' | 'ecoBadges', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  }, []);

  const toggleEcoBadge = useCallback((badge: string) => {
    setFormData(prev => {
      const currentBadges = prev.ecoBadges || [];
      const isSelected = currentBadges.includes(badge);
      
      if (isSelected) {
        return {
          ...prev,
          ecoBadges: currentBadges.filter(b => b !== badge),
        };
      } else if (currentBadges.length < 5) {
        return {
          ...prev,
          ecoBadges: [...currentBadges, badge],
        };
      }
      
      return prev;
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validar formulario
    const errors = validateProduct(formData);
    
    if (hasValidationErrors(errors)) {
      setValidationErrors(errors);
      return;
    }

    try {
      // Subir imágenes primero
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const result = await uploadImageMutation.mutateAsync(file);
        imageUrls.push(result.url);
      }

      // Crear producto con las URLs de las imágenes
      const productData: CreateProductDto = {
        ...formData,
        images: imageUrls,
      } as CreateProductDto;

      const result = await createProductMutation.mutateAsync(productData);
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  const isLoading = createProductMutation.isPending || uploadImageMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Información básica */}
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
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
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
                value={formData.slug || ''}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="se-genera-automaticamente"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Describe las características ecológicas y beneficios de tu producto..."
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
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
              <Select onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className={validationErrors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {ecoCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
                value={formData.condition} 
                onValueChange={(value) => handleInputChange('condition', value)}
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

      {/* Imágenes */}
      <Card>
        <CardHeader>
          <CardTitle>Imágenes del producto *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={imagePreviews.length >= 10}
            >
              <Upload className="mr-2 h-4 w-4" />
              Subir imágenes
            </Button>
            <span className="text-sm text-muted-foreground self-center">
              {imagePreviews.length}/10 imágenes
            </span>
          </div>

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />

          {validationErrors.images && (
            <p className="text-sm text-red-500">{validationErrors.images}</p>
          )}
        </CardContent>
      </Card>

      {/* Ubicación */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicación *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                placeholder="Ej: Lima"
                value={formData.location?.city || ''}
                onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                className={validationErrors.location ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Región *</Label>
              <Input
                id="region"
                placeholder="Ej: Lima"
                value={formData.location?.region || ''}
                onChange={(e) => handleNestedChange('location', 'region', e.target.value)}
                className={validationErrors.location ? 'border-red-500' : ''}
              />
            </div>
          </div>
          {validationErrors.location && (
            <p className="text-sm text-red-500">{validationErrors.location}</p>
          )}
        </CardContent>
      </Card>

      {/* Precio e intercambio */}
      <Card>
        <CardHeader>
          <CardTitle>Precio e intercambio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="barter"
              checked={formData.forBarter || false}
              onCheckedChange={(checked) => handleInputChange('forBarter', checked)}
            />
            <Label htmlFor="barter">Disponible para intercambio/trueque</Label>
          </div>

          {!formData.forBarter && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (S/)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Moneda</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => handleInputChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PEN">Soles (PEN)</SelectItem>
                    <SelectItem value="USD">Dólares (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {formData.forBarter && (
            <div className="space-y-2">
              <Label>Preferencias de intercambio</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ej: Libros, ropa, plantas"
                  value={newBarterPreference}
                  onChange={(e) => setNewBarterPreference(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addArrayItem('barterPreferences', newBarterPreference);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addArrayItem('barterPreferences', newBarterPreference)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.barterPreferences?.map((pref, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {pref}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeArrayItem('barterPreferences', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insignias ecológicas */}
      <Card>
        <CardHeader>
          <CardTitle>Insignias ecológicas (máximo 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ecoBadgeOptions.map((badge) => (
              <Badge
                key={badge}
                variant={formData.ecoBadges?.includes(badge) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleEcoBadge(badge)}
              >
                {badge}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Seleccionadas: {formData.ecoBadges?.length || 0}/5
          </p>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-green hover:bg-green-dark text-white"
        >
          {isLoading ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
