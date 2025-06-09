
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
}

const ecoCategories = [
  'Orgánico',
  'Reciclado',
  'Artesanal',
  'Biodegradable',
  'Comercio Justo',
  'Energía Renovable',
  'Reutilizable',
  'Eco-amigable'
];

const ProductUploadModal: React.FC<ProductUploadModalProps> = ({ isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    stock: 1,
    price: 0,
    forBarter: false,
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          image: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleSave = () => {
    // Validación básica
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto es obligatorio.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error", 
        description: "Selecciona una categoría ecológica.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.image) {
      toast({
        title: "Error",
        description: "Agrega una imagen del producto.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      stock: 1,
      price: 0,
      forBarter: false,
      image: ''
    });
    setImagePreview(null);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      stock: 1,
      price: 0,
      forBarter: false,
      image: ''
    });
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-green">Subir Nuevo Producto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagen del producto */}
          <div className="space-y-2">
            <Label>Imagen del producto *</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Selecciona una imagen del producto
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Subir archivo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        // Simulamos tomar foto
                        setImagePreview('https://images.unsplash.com/photo-1542838132-92c53300491e?w=400');
                        setFormData(prev => ({
                          ...prev,
                          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
                        }));
                      }}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Tomar foto
                    </Button>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Nombre del producto */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del producto *</Label>
            <Input
              id="name"
              placeholder="Ej: Bolsa reutilizable de algodón orgánico"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe las características ecológicas y beneficios de tu producto..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Categoría ecológica */}
          <div className="space-y-2">
            <Label>Categoría ecológica *</Label>
            <Select onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
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
            <div className="flex flex-wrap gap-1 mt-2">
              {ecoCategories.slice(0, 4).map((category) => (
                <Badge key={category} variant="outline" className="text-xs text-green border-green">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label htmlFor="stock">Cantidad disponible</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Precio o intercambio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="barter"
                checked={formData.forBarter}
                onCheckedChange={(checked) => handleInputChange('forBarter', checked)}
              />
              <Label htmlFor="barter" className="text-sm">
                Disponible para intercambio/trueque
              </Label>
            </div>

            {!formData.forBarter && (
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
            )}
          </div>

          {/* Mensaje motivacional */}
          <Card className="bg-green/5 border-green/20">
            <CardContent className="p-4">
              <p className="text-sm text-green-dark">
                🌱 ¡Excelente! Al compartir productos ecológicos ayudas a crear una comunidad más sostenible y consciente del medio ambiente.
              </p>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="flex-1 bg-green hover:bg-green-dark text-white"
            >
              Guardar Producto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductUploadModal;
