import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingBag, MessageCircle, Check, X, Clock, User, Package, Loader2 } from 'lucide-react';
import { orderApi } from '../../../api';
import { PendingOrder } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface PendingOrdersProps {
  sellerId?: string;
}

const PendingOrders: React.FC<PendingOrdersProps> = ({ sellerId }) => {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PendingOrder | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Cargar órdenes pendientes
  const loadPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getPendingOrders();
      setOrders(response.orders || []);
    } catch (error: any) {
      console.error('Error loading pending orders:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar solicitudes",
        description: error.message || "No se pudieron cargar las solicitudes pendientes",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingOrders();
  }, [sellerId]);

  const handleApprove = async (order: PendingOrder) => {
    try {
      setProcessingOrderId(order._id);
      await orderApi.approveOrder(order._id);
      
      toast({
        title: "Solicitud aprobada",
        description: `La orden #${order.orderNumber} ha sido aprobada exitosamente`,
      });
      
      // Recargar las órdenes
      await loadPendingOrders();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al aprobar solicitud",
        description: error.message || "No se pudo aprobar la solicitud",
      });
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder || !rejectReason.trim()) {
      toast({
        variant: "destructive",
        title: "Motivo requerido",
        description: "Por favor ingresa un motivo para rechazar la solicitud",
      });
      return;
    }

    try {
      setProcessingOrderId(selectedOrder._id);
      await orderApi.rejectOrder(selectedOrder._id, rejectReason);
      
      toast({
        title: "Solicitud rechazada",
        description: `La orden #${selectedOrder.orderNumber} ha sido rechazada`,
      });
      
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedOrder(null);
      
      // Recargar las órdenes
      await loadPendingOrders();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al rechazar solicitud",
        description: error.message || "No se pudo rechazar la solicitud",
      });
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleContactBuyer = (order: PendingOrder) => {
    // Navegar al chat con el comprador
    navigate(`/chats?userId=${order.buyerId._id}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Solicitudes de Compra Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Solicitudes de Compra Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tienes solicitudes pendientes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Solicitudes de Compra Pendientes
            <Badge variant="secondary">{orders.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="border-2">
              <CardContent className="p-4">
                {/* Header con información del comprador */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{order.buyerId.name}</p>
                      <p className="text-sm text-muted-foreground">{order.buyerId.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Orden #{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                {/* Lista de productos */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} unidad{item.quantity > 1 ? 'es' : ''} × S/ {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">S/ {item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Total y acciones */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Total a recibir</p>
                    <p className="text-xl font-bold text-primary">S/ {order.totalAmount.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactBuyer(order)}
                      disabled={processingOrderId === order._id}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowRejectDialog(true);
                      }}
                      disabled={processingOrderId === order._id}
                    >
                      {processingOrderId === order._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Rechazar
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      className="bg-green hover:bg-green-dark"
                      onClick={() => handleApprove(order)}
                      disabled={processingOrderId === order._id}
                    >
                      {processingOrderId === order._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Aprobar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Dirección de envío */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Dirección de envío:</p>
                  <p className="text-sm">{order.shippingAddress.address}</p>
                  <p className="text-sm">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p className="text-sm">Tel: {order.shippingAddress.phone}</p>
                  {order.shippingAddress.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Notas: {order.shippingAddress.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Dialog para rechazar orden */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Por favor, indica el motivo por el cual rechazas esta solicitud. 
              El comprador recibirá esta información.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <Textarea
              placeholder="Motivo del rechazo..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason('');
                setSelectedOrder(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || processingOrderId !== null}
            >
              {processingOrderId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rechazando...
                </>
              ) : (
                'Confirmar Rechazo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingOrders; 