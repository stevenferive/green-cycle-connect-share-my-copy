import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useUpdateProduct } from '@/hooks/useUpdateProduct';
import { ProductResponse } from '@/services/productService';

interface EditProductModalProps {
  product: ProductResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated?: (updatedProduct: ProductResponse) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onProductUpdated
}) => {
  const updateProductMutation = useUpdateProduct();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    forBarter: false,
    barterPreferences: [] as string[],
    stock: 0,
    status: 'active' as 'draft' | 'active' | 'paused' | 'out_of_stock' | 'sold' | 'archived',
    condition: 'new' as 'new' | 'like_new' | 'good' | 'fair' | 'poor',
    isHandmade: false,
    isOrganic: false,
  });

  const [newBarterPreference, setNewBarterPreference] = useState('');

  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (product && isOpen) {

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        forBarter: product.forBarter || false,
        barterPreferences: product.barterPreferences || [],
        stock: product.stock || 0,
        status: product.status || 'active',
        condition: product.condition || 'new',
        isHandmade: product.isHandmade || false,
        isOrganic: product.isOrganic || false,
      });
      setNewBarterPreference('');
      setSubmitError(null);
    }
  }, [product, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleAddBarterPreference = () => {
    if (newBarterPreference.trim() && !formData.barterPreferences.includes(newBarterPreference.trim())) {
      setFormData(prev => ({
        ...prev,
        barterPreferences: [...prev.barterPreferences, newBarterPreference.trim()]
      }));
      setNewBarterPreference('');
    }
  };

  const handleRemoveBarterPreference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      barterPreferences: prev.barterPreferences.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setSubmitError(null);
    

    
    try {
      // Preparar datos para envío
      const productDataToSend = {
        ...formData,
        condition: formData.condition || 'new',
        barterPreferences: formData.barterPreferences || []
      };
      

      
      const updatedProduct = await updateProductMutation.mutateAsync({
        productId: product._id,
        productData: productDataToSend
      });
      
      if (onProductUpdated) {
        onProductUpdated(updatedProduct);
      }
      
      onClose();
    } catch (err) {
      // El error ya se maneja en el hook, pero capturamos para mostrar en el modal si es necesario
      setSubmitError(err instanceof Error ? err.message : 'Error al actualizar producto');
    }
  };

  const handleClose = () => {
    setSubmitError(null);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-green">Editar Producto</DialogTitle>
        </DialogHeader>
        
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="name">Nombre del producto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ingresa el nombre del producto"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu producto..."
              rows={3}
              required
            />
          </div>

          {/* Precio y Intercambio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio (S/)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="forBarter"
                checked={formData.forBarter}
                onCheckedChange={(checked) => handleInputChange('forBarter', checked)}
              />
              <Label htmlFor="forBarter">Disponible para intercambio</Label>
            </div>
          </div>

          {/* Preferencias de intercambio */}
          {formData.forBarter && (
            <div>
              <Label htmlFor="barterPreferences">Preferencias de intercambio</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="barterPreferences"
                  placeholder="Ej: Libros, ropa, plantas"
                  value={newBarterPreference}
                  onChange={(e) => setNewBarterPreference(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBarterPreference();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddBarterPreference}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.barterPreferences.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.barterPreferences.map((pref, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {pref}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveBarterPreference(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stock */}
          <div>
            <Label htmlFor="stock">Stock disponible</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              placeholder="Cantidad disponible"
            />
          </div>

          {/* Estado */}
          <div>
            <Label htmlFor="status">Estado del producto</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Borrador</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="out_of_stock">Sin Stock</SelectItem>
                <SelectItem value="sold">Vendido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Condición */}
          <div>
            <Label htmlFor="condition">Condición del producto</Label>
            <Select 
              value={formData.condition} 
              onValueChange={(value) => handleInputChange('condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la condición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Nuevo</SelectItem>
                <SelectItem value="like_new">Como nuevo</SelectItem>
                <SelectItem value="good">Bueno</SelectItem>
                <SelectItem value="fair">Regular</SelectItem>
                <SelectItem value="poor">Malo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Características ecológicas */}
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isHandmade"
                checked={formData.isHandmade}
                onCheckedChange={(checked) => handleInputChange('isHandmade', checked)}
              />
              <Label htmlFor="isHandmade">Hecho a mano</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isOrganic"
                checked={formData.isOrganic}
                onCheckedChange={(checked) => handleInputChange('isOrganic', checked)}
              />
              <Label htmlFor="isOrganic">Orgánico</Label>
            </div>
          </div> */}

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={updateProductMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={updateProductMutation.isPending}
              className="bg-green hover:bg-green/90"
            >
              {updateProductMutation.isPending ? 'Actualizando...' : 'Actualizar Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal; 