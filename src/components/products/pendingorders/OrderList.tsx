import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Check, X, User, Package, Loader2, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { Order } from '@/types/cart';
import { SellerOrderFilter, EMPTY_MESSAGES } from './types';
import { orderApi, chatApi } from '../../../../api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface OrderListProps {
  orders: Order[];
  activeTab: SellerOrderFilter;
  loading: boolean;
  onOrderUpdate: () => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  activeTab,
  loading,
  onOrderUpdate
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [creatingChatForOrderId, setCreatingChatForOrderId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleApprove = async (order: Order) => {
    try {
      setProcessingOrderId(order._id);
      await orderApi.approveOrder(order._id);
      
      toast({
        title: "Solicitud aprobada",
        description: `La orden #${order.orderNumber} ha sido aprobada exitosamente`,
      });
      
      onOrderUpdate();
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
      
      onOrderUpdate();
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

  const handleContactBuyer = async (order: Order) => {
    try {
      setCreatingChatForOrderId(order._id);
      
      const buyerId = order.buyerId._id;
      const productId = order.items[0]?.productId?._id;
      const orderNumber = order.orderNumber;

      const chat = await chatApi.createOrGetDirectChat(
        buyerId,
        productId,
        orderNumber
      );

      if (chat && chat._id) {
        navigate(`/chats`, { 
          state: { 
            selectedChatId: chat._id,
            buyerEmail: order.buyerId.email 
          } 
        });
      } else {
        navigate('/chats');
      }

      toast({
        title: "Abriendo chat",
        description: `Iniciando conversación con ${order.buyerId.email}`,
      });

    } catch (error: any) {
      console.error('Error al crear/obtener chat:', error);
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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprobada</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rechazada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
          <span className="text-muted-foreground">Cargando órdenes...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    const emptyMessage = EMPTY_MESSAGES[activeTab];
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {emptyMessage.title}
        </h3>
        <p className="text-muted-foreground">
          {emptyMessage.description}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order._id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              {/* Estado de la orden */}
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs">
                  {order.orderNumber}
                </Badge>
                {getStatusBadge(order.status)}
              </div>

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

                {order.cancelReason && (
                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-red-700 mb-1">Motivo del rechazo:</p>
                        <p className="text-xs text-red-600 line-clamp-2">
                          {order.cancelReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="space-y-2">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                  onClick={() => handleViewDetails(order)}
                >
                  Ver detalles
                </Button>

                {/* Botones adicionales para órdenes pendientes */}
                {order.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleContactBuyer(order)}
                      disabled={creatingChatForOrderId === order._id}
                    >
                      {creatingChatForOrderId === order._id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <MessageCircle className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de detalles */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Orden</DialogTitle>
            <DialogDescription>
              Orden #{selectedOrder?.orderNumber} - {getStatusBadge(selectedOrder?.status || '')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Sección del producto */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Productos</h3>
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
                <h3 className="text-lg font-semibold mb-3">Información del comprador</h3>
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

                  {selectedOrder.cancelReason && (
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                        <p className="font-medium text-red-600">Motivo del rechazo:</p>
                      </div>
                      <p className="text-sm bg-red-50 p-3 rounded border border-red-200 text-red-800">
                        {selectedOrder.cancelReason}
                      </p>
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
            
            {/* Botones solo para órdenes pendientes */}
            {selectedOrder?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={processingOrderId !== null}
                >
                  <X className="h-4 w-4 mr-2" />
                  Rechazar
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
              </>
            )}
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

export default OrderList; 