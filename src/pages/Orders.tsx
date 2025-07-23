import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { orderApi } from '../../api';
import { Order } from '@/types/cart';
import OrderCardCompact from '@/components/products/myorders/OrderCardCompact';
import OrderDetailsModal from '@/components/products/myorders/OrderDetailsModal';

type OrderStatus = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'delivered';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (status?: string) => {
    try {
      setLoading(true);
      const response = await orderApi.getBuyerOrders(status);
      
      // Debug: Ver qué está devolviendo la API
      console.log('Respuesta completa de getBuyerOrders:', response);
      console.log('Tipo de respuesta:', typeof response);
      console.log('Es array?', Array.isArray(response));
      
      // Manejar diferentes estructuras de respuesta
      let ordersData: Order[] = [];
      
      if (Array.isArray(response)) {
        // Si la respuesta es directamente un array
        ordersData = response;
      } else if (response && Array.isArray(response.orders)) {
        // Si la respuesta tiene una propiedad orders
        ordersData = response.orders;
      } else if (response && Array.isArray(response.data)) {
        // Si la respuesta tiene una propiedad data
        ordersData = response.data;
      }
      
      console.log('Órdenes procesadas:', ordersData);
      console.log('Cantidad de órdenes:', ordersData.length);
      
      setOrders(ordersData);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar órdenes",
        description: error.message || "No se pudieron cargar tus órdenes",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    const tabValue = value as OrderStatus;
    setActiveTab(tabValue);
    const statusParam = tabValue === 'all' ? undefined : tabValue;
    loadOrders(statusParam);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const statusParam = activeTab === 'all' ? undefined : activeTab;
    await loadOrders(statusParam);
    setRefreshing(false);
  };

  const handleOrderUpdate = () => {
    handleRefresh();
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const getOrderCountByStatus = (status: OrderStatus) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  };

  const getEmptyStateMessage = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          title: 'No tienes órdenes pendientes',
          description: 'Tus órdenes pendientes de confirmación aparecerán aquí.',
        };
      case 'confirmed':
        return {
          title: 'No tienes órdenes confirmadas',
          description: 'Las órdenes confirmadas por los vendedores aparecerán aquí.',
        };
      case 'cancelled':
        return {
          title: 'No tienes órdenes canceladas',
          description: 'Las órdenes que hayas cancelado aparecerán aquí.',
        };
      case 'delivered':
        return {
          title: 'No tienes órdenes entregadas',
          description: 'Las órdenes que hayas recibido aparecerán aquí.',
        };
      default:
        return {
          title: 'No tienes órdenes aún',
          description: 'Explora nuestros productos eco-friendly y realiza tu primera compra.',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Mis Órdenes</h1>
        </div>
        <div className="flex justify-center py-8">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
            <p className="text-muted-foreground">Cargando órdenes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Mis Órdenes</h1>
            <p className="text-sm text-muted-foreground">
              Historial de tus compras en GreenCycle
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Filtros por pestañas */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="text-xs">
            Todas
            {orders.length > 0 && (
              <span className="ml-1 bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-xs">
                {orders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            Pendientes
            {getOrderCountByStatus('pending') > 0 && (
              <span className="ml-1 bg-yellow-100 text-yellow-700 rounded-full px-1.5 py-0.5 text-xs">
                {getOrderCountByStatus('pending')}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="text-xs">
            Aprobadas
            {getOrderCountByStatus('confirmed') > 0 && (
              <span className="ml-1 bg-green-100 text-green-700 rounded-full px-1.5 py-0.5 text-xs">
                {getOrderCountByStatus('confirmed')}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="delivered" className="text-xs">
            Entregadas
            {getOrderCountByStatus('delivered') > 0 && (
              <span className="ml-1 bg-gray-100 text-gray-700 rounded-full px-1.5 py-0.5 text-xs">
                {getOrderCountByStatus('delivered')}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs">
            Canceladas
            {getOrderCountByStatus('cancelled') > 0 && (
              <span className="ml-1 bg-red-100 text-red-700 rounded-full px-1.5 py-0.5 text-xs">
                {getOrderCountByStatus('cancelled')}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Contenido de las pestañas */}
        {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {getFilteredOrders().length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {getEmptyStateMessage(status as OrderStatus).title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {getEmptyStateMessage(status as OrderStatus).description}
                </p>
                {status === 'all' && (
                  <Button 
                    onClick={() => navigate('/explore')} 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Explorar Productos
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFilteredOrders().map((order) => (
                  <OrderCardCompact
                    key={order._id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onOrderUpdate={handleOrderUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal de detalles */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showDetailsModal}
        onClose={handleCloseModal}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
};

export default Orders; 