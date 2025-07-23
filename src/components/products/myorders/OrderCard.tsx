import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/cart';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActions from './OrderActions';
import { Package, MapPin, User, Calendar } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onOrderUpdate: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onOrderUpdate }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDate = () => {
    switch (order.status) {
      case 'confirmed':
        return order.confirmedAt ? `Confirmado el ${formatDate(order.confirmedAt)}` : null;
      case 'shipped':
        return order.shippedAt ? `Enviado el ${formatDate(order.shippedAt)}` : null;
      case 'delivered':
        return order.deliveredAt ? `Entregado el ${formatDate(order.deliveredAt)}` : null;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Orden #{order.orderNumber}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
            {getStatusDate() && (
              <p className="text-sm text-muted-foreground">
                {getStatusDate()}
              </p>
            )}
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Información del vendedor */}
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {order.sellerId.firstName && order.sellerId.lastName 
                ? `${order.sellerId.firstName} ${order.sellerId.lastName}`
                : order.sellerId.email
              }
            </p>
            {order.sellerId.firstName && order.sellerId.lastName && (
              <p className="text-xs text-muted-foreground">
                {order.sellerId.email}
              </p>
            )}
          </div>
        </div>

        {/* Items de la orden */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Productos:</h4>
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.productId.images && item.productId.images.length > 0 ? (
                  <img 
                    src={item.productId.images[0]} 
                    alt={item.productId.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.productId.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} x S/ {item.unitPrice.toFixed(2)}
                </p>
              </div>
              <p className="font-medium text-sm">
                S/ {item.totalPrice.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t">
          <span className="font-medium">Total</span>
          <span className="text-lg font-bold text-primary">
            S/ {order.totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Dirección de envío */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs font-medium text-muted-foreground">
              Dirección de envío:
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm">{order.shippingAddress.street}</p>
            <p className="text-sm">
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p className="text-sm">
              {order.shippingAddress.zipCode}, {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Información adicional */}
        {order.trackingNumber && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-600 mb-1">
              Número de seguimiento:
            </p>
            <p className="text-sm font-mono text-blue-800">
              {order.trackingNumber}
            </p>
          </div>
        )}

        {order.cancelReason && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs font-medium text-red-600 mb-1">
              Razón de cancelación:
            </p>
            <p className="text-sm text-red-800">
              {order.cancelReason}
            </p>
          </div>
        )}

        {order.notes && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-600 mb-1">
              Notas:
            </p>
            <p className="text-sm text-gray-800">
              {order.notes}
            </p>
          </div>
        )}

        {/* Acciones */}
        <OrderActions order={order} onOrderUpdate={onOrderUpdate} />
      </CardContent>
    </Card>
  );
};

export default OrderCard; 