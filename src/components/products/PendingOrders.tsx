import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingBag, MessageCircle, Check, X, Eye, User, Package, Loader2, MapPin, Calendar } from 'lucide-react';
import { orderApi, chatApi } from '../../../api';
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [creatingChatForOrderId, setCreatingChatForOrderId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Cargar órdenes pendientes
  const loadPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getPendingOrders();
      
      // Debug: Vamos a ver qué está devolviendo la API
      console.log('Respuesta completa de getPendingOrders:', response);
      console.log('Tipo de respuesta:', typeof response);
      console.log('Es array?', Array.isArray(response));
      
      // Intentamos diferentes estructuras de respuesta
      let ordersData: PendingOrder[] = [];
      
      if (Array.isArray(response)) {
        // Si la respuesta es directamente un array
        ordersData = response;
      } else if (response && Array.isArray(response.orders)) {
        // Si la respuesta tiene una propiedad orders
        ordersData = response.orders;
      } else if (response && Array.isArray(response.data)) {
        // Si la respuesta tiene una propiedad data
        ordersData = response.data;
      } else if (response && response.success && Array.isArray(response.data)) {
        // Si la respuesta tiene success y data
        ordersData = response.data;
      }
      
      console.log('Órdenes procesadas:', ordersData);
      console.log('Cantidad de órdenes:', ordersData.length);
      
      setOrders(ordersData);
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
      setShowDetailsModal(false);
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
      setShowDetailsModal(false);
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

  const handleContactBuyer = async (order: PendingOrder) => {
    try {
      setCreatingChatForOrderId(order._id);
      
      const buyerId = order.buyerId._id;
      const productId = order.items[0]?.productId?._id;
      const orderNumber = order.orderNumber;

      // Crear o obtener chat existente con el comprador
      const chat = await chatApi.createOrGetDirectChat(
        buyerId,
        productId,
        orderNumber
      );

      if (chat && chat._id) {
        // Navegar al chat específico
        navigate(`/chats`, { 
          state: { 
            selectedChatId: chat._id,
            buyerEmail: order.buyerId.email 
          } 
        });
      } else {
        // Fallback: navegar a la lista de chats
        navigate('/chats');
      }

      toast({
        title: "Abriendo chat",
        description: `Iniciando conversación con ${order.buyerId.email}`,
      });

    } catch (error: any) {
      console.error('Error al crear/obtener chat:', error);
      
      // Fallback: navegar a la página de chats
      navigate('/chats');
      
      toast({
        variant: "destructive",
        title: "Error al abrir chat",
        description: error.message || "No se pudo abrir el chat. Intenta desde la página de chats.",
      });
    } finally {
      setCreatingChatForOrderId(null);
    }
  };

  const handleViewDetails = (order: PendingOrder) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
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
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card key={order._id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                {/* Imagen del producto principal */}
                <div className="aspect-square w-full bg-muted rounded-lg mb-4 overflow-hidden">
                  {order.items[0]?.productId?.images?.[0] ? (
                    <img
                      src={order.items[0].productId.images[0]}
                      alt={order.items[0].productId.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Información básica */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {order.orderNumber}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      S/ {order.totalAmount.toFixed(2)}
                    </Badge>
                  </div>
                  
                  <h3 className="font-medium text-sm line-clamp-2">
                    {order.items[0]?.productId?.name || 'Producto sin nombre'}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="truncate">{order.buyerId.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(order.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>

                  {order.items.length > 1 && (
                    <p className="text-xs text-muted-foreground">
                      +{order.items.length - 1} producto{order.items.length > 2 ? 's' : ''} más
                    </p>
                  )}
                </div>

                {/* Botón Ver detalles */}
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                  onClick={() => handleViewDetails(order)}
                >
                  Ver detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
            <DialogDescription>
              Orden #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Sección del producto */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sección del producto</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.productId?.images?.[0] ? (
                          <img
                            src={item.productId.images[0]}
                            alt={item.productId.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.productId.name}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Cantidad: {item.quantity}</span>
                          <span>Precio: S/ {item.unitPrice.toFixed(2)}</span>
                          <span>Total: S/ {item.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-right">
                    <p className="text-lg font-bold">Total: S/ {selectedOrder.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Sección del comprador */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sección del comprador</h3>
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span>{selectedOrder.buyerId.email}</span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Dirección de envío:</p>
                      <p className="text-sm">{selectedOrder.shippingAddress.street}</p>
                      <p className="text-sm">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                      </p>
                      <p className="text-sm">
                        {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fecha de solicitud:</span>
                    <span>{new Date(selectedOrder.createdAt).toLocaleString('es-ES')}</span>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <p className="font-medium mb-1">Notas:</p>
                      <p className="text-sm bg-white p-2 rounded border">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => selectedOrder && handleContactBuyer(selectedOrder)}
              disabled={creatingChatForOrderId === selectedOrder?._id}
            >
              {creatingChatForOrderId === selectedOrder?._id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Abriendo chat...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ir al chat
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowRejectDialog(true)}
              disabled={processingOrderId !== null}
            >
              <X className="h-4 w-4 mr-2" />
              Negar
            </Button>
            
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={() => selectedOrder && handleApprove(selectedOrder)}
              disabled={processingOrderId !== null}
            >
              {processingOrderId === selectedOrder?._id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Aprobando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Aprobar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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