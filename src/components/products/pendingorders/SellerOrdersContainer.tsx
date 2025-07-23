import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderTabs from './OrderTabs';
import OrderList from './OrderList';
import { useSellerOrders } from './useSellerOrders';

interface SellerOrdersContainerProps {
  sellerId: string;
}

const SellerOrdersContainer: React.FC<SellerOrdersContainerProps> = ({ sellerId }) => {
  const {
    orders,
    loading,
    error,
    activeTab,
    orderCounts,
    setActiveTab,
    refreshOrders,
    refreshCounts
  } = useSellerOrders(sellerId);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };

  const handleOrderUpdate = async () => {
    // Refrescar tanto las órdenes como los contadores
    await Promise.all([
      refreshOrders(),
      refreshCounts()
    ]);
  };

  const handleRefresh = async () => {
    await handleOrderUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Gestión de Órdenes
          </CardTitle>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Barra de pestañas */}
        <OrderTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          orderCounts={orderCounts}
          loading={loading}
        />

        {/* Lista de órdenes */}
        <OrderList
          orders={orders}
          activeTab={activeTab}
          loading={loading}
          onOrderUpdate={handleOrderUpdate}
        />

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-8">
            <div className="text-sm text-red-600 mb-4">{error}</div>
            <Button 
              onClick={handleRefresh}
              variant="outline"
              size="sm"
            >
              Intentar nuevamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerOrdersContainer; 