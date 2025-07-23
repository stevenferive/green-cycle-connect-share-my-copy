import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/cart';
import OrderStatusBadge from './OrderStatusBadge';
import { Package, Calendar, User, Eye, ChevronRight } from 'lucide-react';

interface OrderCardCompactProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onOrderUpdate: () => void;
}

const OrderCardCompact: React.FC<OrderCardCompactProps> = ({ 
  order, 
  onViewDetails, 
  onOrderUpdate 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getSellerName = () => {
    if (order.sellerId.firstName && order.sellerId.lastName) {
      return `${order.sellerId.firstName} ${order.sellerId.lastName}`;
    }
    return order.sellerId.email;
  };

  const getMainProduct = () => {
    if (order.items.length === 0) return null;
    const firstItem = order.items[0];
    return {
      name: firstItem.productId.name,
      image: firstItem.productId.images[0],
      quantity: firstItem.quantity
    };
  };

  const getTotalItems = () => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  const mainProduct = getMainProduct();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">#{order.orderNumber}</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(order)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Imagen del producto principal */}
          <div className="col-span-2">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {mainProduct?.image ? (
                <img 
                  src={mainProduct.image} 
                  alt={mainProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Información del producto y vendedor */}
          <div className="col-span-7">
            <div className="space-y-1">
              <p className="font-medium text-sm truncate">
                {mainProduct?.name || 'Producto no disponible'}
                {order.items.length > 1 && (
                  <span className="text-muted-foreground text-xs ml-1">
                    +{order.items.length - 1} más
                  </span>
                )}
              </p>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span className="truncate">{getSellerName()}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Precio y detalles */}
          <div className="col-span-3 text-right">
            <div className="space-y-1">
              <p className="font-bold text-sm text-primary">
                S/ {order.totalAmount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(order)}
                className="h-6 text-xs"
              >
                Ver detalles
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Información adicional según el estado */}
        {order.trackingNumber && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
            <span className="font-medium text-blue-700">Seguimiento:</span>
            <span className="text-blue-600 ml-1 font-mono">{order.trackingNumber}</span>
          </div>
        )}

        {order.cancelReason && (
          <div className="mt-3 p-2 bg-red-50 rounded text-xs">
            <span className="font-medium text-red-700">Cancelado:</span>
            <span className="text-red-600 ml-1">{order.cancelReason}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCardCompact; 