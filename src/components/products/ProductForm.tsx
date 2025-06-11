
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CreateProductDto, ProductValidationErrors } from '@/types/product';
import { validateProduct, generateSlug, hasValidationErrors } from '@/utils/productValidation';
import { useCreateProduct, useUploadImage } from '@/hooks/useCreateProduct';
import BasicInfoSection from './form-sections/BasicInfoSection';
import ImageUploadSection from './form-sections/ImageUploadSection';
import LocationSection from './form-sections/LocationSection';
import PricingSection from './form-sections/PricingSection';
import EcoBadgesSection from './form-sections/EcoBadgesSection';

interface ProductFormProps {
  onSuccess?: (product: any) => void;
  onCancel?: () => void;
}

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
    seller: 'user-id-placeholder',
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
      
      if (field === 'name' && typeof value === 'string') {
        newData.slug = generateSlug(value);
      }
      
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

    const errors = validateProduct(formData);
    
    if (hasValidationErrors(errors)) {
      setValidationErrors(errors);
      return;
    }

    try {
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const result = await uploadImageMutation.mutateAsync(file);
        imageUrls.push(result.url);
      }

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
      <BasicInfoSection
        name={formData.name || ''}
        slug={formData.slug || ''}
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
