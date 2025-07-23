import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Truck, 
  XCircle, 
  CheckCircle, 
  Eye,
  AlertTriangle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { orderApi } from '../../../../api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Order } from '@/types/cart';

interface OrderActionsProps {
  order: Order;
  onOrderUpdate: () => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({ order, onOrderUpdate }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContactSeller = () => {
    navigate(`/chats?userId=${order.sellerId._id}`);
  };

  const handleViewDetails = () => {
    navigate(`/order/${order._id}`);
  };

  const handleMarkAsReceived = async () => {
    setLoading(true);
    try {
      await orderApi.confirmDelivery(order._id);
      toast({
        title: "Orden marcada como recibida",
        description: "Has confirmado la recepción de tu orden exitosamente.",
      });
      onOrderUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al confirmar recepción",
        description: error.message || "No se pudo confirmar la recepción de la orden",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      await orderApi.cancelOrder(order._id);
      toast({
        title: "Orden cancelada",
        description: "Tu orden ha sido cancelada exitosamente.",
      });
      onOrderUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al cancelar orden",
        description: error.message || "No se pudo cancelar la orden",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTrackShipment = () => {
    if (order.trackingNumber) {
      // Aquí podrías abrir una ventana con el servicio de tracking
      toast({
        title: "Número de seguimiento",
        description: `Tu número de seguimiento es: ${order.trackingNumber}`,
      });
    } else {
      toast({
        title: "Sin número de seguimiento",
        description: "El vendedor aún no ha proporcionado un número de seguimiento.",
      });
    }
  };

  return (
    <div className="flex gap-2 pt-2 flex-wrap">
      {/* Contactar vendedor - disponible para todos los estados excepto cancelado */}
      {order.status !== 'cancelled' && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleContactSeller}
          className="flex-1 min-w-[140px]"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contactar Vendedor
        </Button>
      )}

      {/* Cancelar orden - Solo para órdenes PENDIENTES */}
      {order.status === 'pending' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={loading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancelar Orden
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                ¿Cancelar orden?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción cancelará tu orden #{order.orderNumber}. 
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelOrder}
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                Sí, cancelar orden
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Marcar como recibido - Para órdenes PENDIENTES y CONFIRMADAS */}
      {(order.status === 'pending' || order.status === 'confirmed') && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              disabled={loading}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como Recibido
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Confirmar recepción?</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Has recibido tu orden #{order.orderNumber} en buenas condiciones?
                Esta acción marcará la orden como completada.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No he recibido</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMarkAsReceived}
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                Sí, he recibido mi orden
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Rastrear envío - Solo para órdenes enviadas */}
      {order.status === 'shipped' && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTrackShipment}
          className="flex-1"
        >
          <Truck className="h-4 w-4 mr-2" />
          Rastrear Envío
        </Button>
      )}

      {/* Ver detalles - siempre disponible */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewDetails}
      >
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OrderActions; 