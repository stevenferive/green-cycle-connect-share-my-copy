import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Package, Truck, ShoppingBag } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          text: 'Pendiente',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
        };
      case 'confirmed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Confirmado',
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
        };
      case 'preparing':
        return {
          icon: <ShoppingBag className="h-4 w-4" />,
          text: 'Preparando',
          className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
        };
      case 'shipped':
        return {
          icon: <Truck className="h-4 w-4" />,
          text: 'Enviado',
          className: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
        };
      case 'delivered':
        return {
          icon: <Package className="h-4 w-4" />,
          text: 'Entregado',
          className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: 'Cancelado',
          className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          text: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={`flex items-center gap-1 ${config.className}`}>
      {config.icon}
      {config.text}
    </Badge>
  );
};

export default OrderStatusBadge; 