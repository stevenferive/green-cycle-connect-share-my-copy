import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CreateProductDto, ProductValidationErrors } from '@/types/product';
import { validateProduct, validateProductWithFiles, hasValidationErrors } from '@/utils/productValidation';
import { useCreateProduct } from '@/hooks/useCreateProduct';
import BasicInfoSection from './form-sections/BasicInfoSection';
import ImageUploadSection from './form-sections/ImageUploadSection';
import LocationSection from './form-sections/LocationSection';
import PricingSection from './form-sections/PricingSection';
import EcoBadgesSection from './form-sections/EcoBadgesSection';
import MyProducts from '@/pages/MyProducts';

interface ProductFormProps {
  loadProducts: () => void;
  onSuccess?: (product: any) => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ loadProducts, onSuccess, onCancel }) => {
  const createProductMutation = useCreateProduct();

  const [formData, setFormData] = useState<Partial<CreateProductDto>>({
    name: '',
    description: '',
    category: '',
    condition: 'new',
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
      return newData;
    });

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
      
      // Limpiar error de imágenes si existe
      if (validationErrors.images) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Error al procesar imágenes:', error);
    }
  }, [imageFiles.length, validationErrors.images]);

  const removeImage = useCallback((index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    // Si se eliminó la última imagen, agregar error de validación
    if (imageFiles.length === 1) {
      setValidationErrors(prev => ({
        ...prev,
        images: 'Debe agregar al menos una imagen'
      }));
    }
  }, [imageFiles.length]);

  const addArrayItem = useCallback((field: 'barterPreferences' | 'materials' | 'tags', value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));

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

    // Validar el producto con las imágenes como archivos
    const errors = validateProductWithFiles(formData, imageFiles);
    
    if (hasValidationErrors(errors)) {
      setValidationErrors(errors);
      return;
    }

    try {
      // Preparar los datos del producto
      const productData: CreateProductDto = {
        ...formData,
        name: formData.name!,
        description: formData.description!,
        category: formData.category!,
        condition: formData.condition!,
        price: formData.price!,
        location: formData.location!,
        seller: null
      };

      // Enviar producto con imágenes en una sola llamada
      const result = await createProductMutation.mutateAsync({
        productData,
        images: imageFiles
      });
      
      if (onSuccess) {
        loadProducts();
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  const isLoading = createProductMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <BasicInfoSection
        name={formData.name || ''}
        description={formData.description || ''}
        category={formData.category || ''}
        condition={formData.condition || 'new'}
        onInputChange={handleInputChange}
        validationErrors={validationErrors}
      />

      <ImageUploadSection
        imagePreviews={imagePreviews}
        onImageUpload={handleImageUpload}
        onRemoveImage={removeImage}
        validationErrors={validationErrors}
      />

      <LocationSection
        city={formData.location?.city || ''}
        region={formData.location?.region || ''}
        onNestedChange={handleNestedChange}
        validationErrors={validationErrors}
      />

      <PricingSection
        forBarter={formData.forBarter || false}
        price={formData.price || 0}
        currency={formData.currency || 'PEN'}
        barterPreferences={formData.barterPreferences || []}
        newBarterPreference={newBarterPreference}
        onInputChange={handleInputChange}
        onSetNewBarterPreference={setNewBarterPreference}
        onAddArrayItem={addArrayItem}
        onRemoveArrayItem={removeArrayItem}
      />

      <EcoBadgesSection
        ecoBadges={formData.ecoBadges || []}
        onToggleEcoBadge={toggleEcoBadge}
      />

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
