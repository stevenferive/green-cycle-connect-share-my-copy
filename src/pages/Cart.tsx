
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm from '@/components/cart/CheckoutForm';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Mi Carrito</h1>
          {items.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}
            </Badge>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        // Carrito vacío
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground text-center mb-6">
            Explora nuestros productos eco-friendly y agrega algunos a tu carrito.
          </p>
          <Button onClick={() => navigate('/explore')} className="w-full max-w-sm">
            Explorar Productos
          </Button>
        </div>
      ) : (
        // Carrito con productos
        <div className="space-y-4">
          {/* Lista de productos */}
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-4">
                  {/* Imagen del producto (placeholder) */}
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  
                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{item.category}</p>
                    <p className="text-xs text-muted-foreground mb-2">Vendedor: {item.sellerName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">
                        S/ {item.price.toFixed(2)}
                      </span>
                      
                      {/* Controls de cantidad */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="mx-2 min-w-[2rem] text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive ml-2"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Resumen del carrito */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({getTotalItems()} productos)</span>
                <span>S/ {getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">S/ {getTotalPrice().toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full mt-4 bg-green hover:bg-green-dark" 
                size="lg"
                onClick={() => setShowCheckout(true)}
              >
                Proceder al Pago
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/explore')}
              >
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Checkout */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Finalizar Compra</DialogTitle>
          </DialogHeader>
          <CheckoutForm onClose={() => setShowCheckout(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
