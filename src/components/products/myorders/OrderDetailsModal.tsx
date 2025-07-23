import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types/cart';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActions from './OrderActions';
import { 
  Package, 
  MapPin, 
  User, 
  Calendar,
  FileText,
  Truck,
  X 
} from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onOrderUpdate
}) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSellerName = () => {
    if (order.sellerId.firstName && order.sellerId.lastName) {
      return `${order.sellerId.firstName} ${order.sellerId.lastName}`;
    }
    return order.sellerId.email;
  };

  const getStatusTimeline = () => {
    const timeline = [
      {
        status: 'pending',
        label: 'Orden creada',
        date: order.createdAt,
        active: true
      }
    ];

    if (order.confirmedAt) {
      timeline.push({
        status: 'confirmed',
        label: 'Confirmada',
        date: order.confirmedAt,
        active: true
      });
    }

    if (order.shippedAt) {
      timeline.push({
        status: 'shipped',
        label: 'Enviada',
        date: order.shippedAt,
        active: true
      });
    }

    if (order.deliveredAt) {
      timeline.push({
        status: 'delivered',
        label: 'Entregada',
        date: order.deliveredAt,
        active: true
      });
    }

    return timeline;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Detalles de la Orden #{order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado y fecha */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Creada el {formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Timeline de estado */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Estado de la orden</h3>
            <div className="space-y-2">
              {getStatusTimeline().map((item, index) => (
                <div key={item.status} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.active ? 'bg-green-500' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1 flex justify-between items-center">
                    <span className={`text-sm ${
                      item.active ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {item.label}
                    </span>
                    {item.active && (
                      <span className="text-xs text-muted-foreground">
                        {formatShortDate(item.date)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Información del vendedor */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Vendedor
            </h3>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium">{getSellerName()}</p>
              <p className="text-sm text-muted-foreground">{order.sellerId.email}</p>
            </div>
          </div>

          <Separator />

          {/* Productos */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.productId.images && item.productId.images.length > 0 ? (
                      <img 
                        src={item.productId.images[0]} 
                        alt={item.productId.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.productId.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity} × S/ {item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">S/ {item.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de costos */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>S/ {order.subtotal.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span className="text-primary">S/ {order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dirección de envío */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Dirección de envío
            </h3>
            <div className="p-4 border rounded-lg">
              <div className="space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          {(order.trackingNumber || order.notes || order.cancelReason) && (
            <>
              <Separator />
              <div className="space-y-4">
                {order.trackingNumber && (
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Seguimiento
                    </h3>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="font-mono text-sm">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}

                {order.notes && (
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notas
                    </h3>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  </div>
                )}

                {order.cancelReason && (
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2 text-red-600">
                      <X className="h-4 w-4" />
                      Razón de cancelación
                    </h3>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{order.cancelReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <Separator />

          {/* Acciones */}
          <div className="space-y-3">
            <h3 className="font-medium">Acciones</h3>
            <OrderActions order={order} onOrderUpdate={() => {
              onOrderUpdate();
              onClose();
            }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal; 