import React, { useState } from 'react';
import { CreateProductDto } from '@/types/product';
import { useCreateProduct } from '@/hooks/useCreateProduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const CreateProductExample: React.FC = () => {
  const createProductMutation = useCreateProduct();
  
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    slug: '',
    category: '',
    condition: 'new',
    price: 0,
    location: {
      city: '',
      region: ''
    }
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (field: keyof CreateProductDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generar slug cuando cambia el nombre
    if (field === 'name' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleLocationChange = (field: 'city' | 'region', value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      
      if (fileList.length > 10) {
        alert('Máximo 10 imágenes permitidas');
        return;
      }

      const validFiles = fileList.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`La imagen ${file.name} excede el tamaño máximo de 5MB`);
          return false;
        }
        if (!file.type.includes('image')) {
          alert(`El archivo ${file.name} no es una imagen válida`);
          return false;
        }
        return true;
      });

      setImages(validFiles);
      
      // Crear previews
      const previews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await createProductMutation.mutateAsync({
        productData: formData,
        images: images
      });
      
      console.log('Producto creado exitosamente:', result);
      alert('¡Producto creado exitosamente!');
      
      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        slug: '',
        category: '',
        condition: 'new',
        price: 0,
        location: {
          city: '',
          region: ''
        }
      });
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Producto - Ejemplo</CardTitle>
        <CardDescription>
          Ejemplo de implementación del nuevo flujo de creación de productos con imágenes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del producto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              minLength={10}
              maxLength={1000}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug (generado automáticamente)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electrónicos</SelectItem>
                <SelectItem value="clothing">Ropa</SelectItem>
                <SelectItem value="home">Hogar</SelectItem>
                <SelectItem value="books">Libros</SelectItem>
                <SelectItem value="sports">Deportes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Condición</Label>
            <Select value={formData.condition} onValueChange={(value: 'new' | 'used' | 'refurbished') => handleInputChange('condition', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Nuevo</SelectItem>
                <SelectItem value="used">Usado</SelectItem>
                <SelectItem value="refurbished">Reacondicionado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.location.city}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="region">Región</Label>
              <Input
                id="region"
                value={formData.location.region}
                onChange={(e) => handleLocationChange('region', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="images">Imágenes (máx. 10)</Label>
            <Input
              id="images"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              multiple
              required
            />
            {imagePreviews.length > 0 && (
              <div className="mt-2 grid grid-cols-5 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={createProductMutation.isPending}
            className="w-full"
          >
            {createProductMutation.isPending ? 'Creando producto...' : 'Crear Producto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateProductExample; 