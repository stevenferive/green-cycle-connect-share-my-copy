
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Truck, MapPin, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
    notes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      toast({
        title: "¡Compra realizada con éxito!",
        description: `Tu pedido por S/ ${getTotalPrice().toFixed(2)} ha sido procesado`,
      });
      
      clearCart();
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  const shippingCost = 0; // Envío gratuito
  const total = getTotalPrice() + shippingCost;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Formulario de checkout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Información de Entrega y Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Información de contacto */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Información de Contacto</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Dirección de entrega */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Dirección de Entrega
              </h3>
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Método de pago */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Método de Pago</h3>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Tarjeta de Crédito/Débito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer">Transferencia Bancaria</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Pago Contraentrega</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Notas adicionales */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionales (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Instrucciones especiales para la entrega..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green hover:bg-green-dark"
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : `Finalizar Compra - S/ ${total.toFixed(2)}`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resumen del pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Productos */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-xs text-center">{item.quantity}x</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">S/ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totales */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>S/ {getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Envío</span>
              <span className="text-green-600">Gratis</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Badges informativos */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary" className="text-xs">
              <Truck className="mr-1 h-3 w-3" />
              Envío Gratuito
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <MapPin className="mr-1 h-3 w-3" />
              Entrega 24-48h
            </Badge>
          </div>

          {/* Contacto con vendedores */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-green" />
              <span className="text-sm font-medium">Contacto Directo</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Podrás contactar directamente con cada vendedor para coordinar la entrega
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutForm;
