
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Truck, MapPin, MessageCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { cartApi } from '../../../api';
import type { ShippingAddress } from '@/types/cart';

interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const { items, getTotalPrice, clearCart, refreshCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ShippingAddress & { notes: string }>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Perú',
    notes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      toast({
        variant: "destructive",
        title: "Datos incompletos",
        description: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Preparar datos de envío con la estructura correcta
      const shippingAddress: ShippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      };

      // Llamar al API de checkout con el payload correcto
      const response = await cartApi.checkout({
        shippingAddress,
        notes: formData.notes
      });

      toast({
        title: "¡Compra realizada con éxito!",
        description: `Se han creado ${response.orders?.length || 1} solicitud(es) de compra. Los vendedores serán notificados.`,
      });
      
      // Limpiar el carrito localmente
      clearCart();
      
      // Cerrar el modal
      onClose();
      
      // Redirigir a la página de órdenes
      navigate('/orders');
      
    } catch (error: any) {
      console.error('Error en checkout:', error);
      toast({
        variant: "destructive",
        title: "Error al procesar la compra",
        description: error.message || "Ocurrió un error al procesar tu pedido. Por favor intenta nuevamente.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
      {/* Información de envío */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Información de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Calle y Número *</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="Jr. Ramón Castilla 456"
                required
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Piura"
                  required
                  disabled={isProcessing}
                />
              </div>
              
              <div>
                <Label htmlFor="state">Estado/Provincia *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Piura"
                  required
                  disabled={isProcessing}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">Código Postal *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="15001"
                  required
                  disabled={isProcessing}
                />
              </div>
              
              <div>
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Perú"
                  disabled={isProcessing}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notas adicionales (opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Instrucciones especiales para la entrega..."
                rows={3}
                disabled={isProcessing}
              />
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Método de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={formData.paymentMethod} 
              onValueChange={(value) => handleInputChange('paymentMethod', value)}
              disabled={isProcessing}
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">
                  <div className="font-medium">Tarjeta de Crédito/Débito</div>
                  <div className="text-sm text-muted-foreground">Visa, Mastercard, Amex</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                  <div className="font-medium">Transferencia Bancaria</div>
                  <div className="text-sm text-muted-foreground">BCP, BBVA, Interbank</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                  <div className="font-medium">Pago Contra Entrega</div>
                  <div className="text-sm text-muted-foreground">Efectivo al recibir</div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card> */}
      </div>

      {/* Resumen del pedido */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Resumen del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lista de productos */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x S/ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium text-sm">
                    S/ {(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>S/ {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Envío</span>
                <Badge variant="secondary" className="text-green">
                  Gratis
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">S/ {getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-green-light/10 p-3 rounded-lg">
              <p className="text-sm text-green font-medium">
                🌱 Tu compra eco-friendly ahorra 2.5 kg de CO₂
              </p>
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full bg-green hover:bg-green-dark" 
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            `Confirmar Pedido - S/ ${getTotalPrice().toFixed(2)}`
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          Al confirmar, aceptas nuestros términos y condiciones de compra
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;
