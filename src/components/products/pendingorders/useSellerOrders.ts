import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/types/cart';
import { SellerOrderFilter, OrderCounts } from './types';
import { SellerOrderService } from './orderService';
import { useToast } from '@/hooks/use-toast';

interface UseSellerOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  activeTab: SellerOrderFilter;
  orderCounts: OrderCounts;
  setActiveTab: (tab: SellerOrderFilter) => void;
  refreshOrders: () => Promise<void>;
  refreshCounts: () => Promise<void>;
}

export const useSellerOrders = (sellerId?: string): UseSellerOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SellerOrderFilter>('all');
  const [orderCounts, setOrderCounts] = useState<OrderCounts>({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    all: 0
  });

  const { toast } = useToast();

  // Función para obtener órdenes según filtro
  const fetchOrders = useCallback(async (filter: SellerOrderFilter) => {
    if (!sellerId) {
      setError('ID del vendedor requerido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedOrders = await SellerOrderService.fetchOrdersByFilter(filter);
      setOrders(fetchedOrders);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error(`Error al obtener órdenes (${filter}):`, err);
      
      toast({
        variant: "destructive",
        title: "Error al cargar órdenes",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [sellerId, toast]);

  // Función para obtener contadores
  const fetchOrderCounts = useCallback(async () => {
    if (!sellerId) return;

    try {
      const allOrders = await SellerOrderService.getAllOrdersForCounts();
      const counts = SellerOrderService.calculateOrderCounts(allOrders);
      setOrderCounts(counts);
    } catch (err) {
      console.error('Error al obtener contadores de órdenes:', err);
      // No mostrar toast para errores de contadores, son menos críticos
    }
  }, [sellerId]);

  // Función para cambiar de pestaña
  const handleTabChange = useCallback((tab: SellerOrderFilter) => {
    setActiveTab(tab);
    fetchOrders(tab);
    
    // Guardar pestaña activa en localStorage
    localStorage.setItem('seller_orders_active_tab', tab);
  }, [fetchOrders]);

  // Función para refrescar órdenes actuales
  const refreshOrders = useCallback(async () => {
    await fetchOrders(activeTab);
  }, [fetchOrders, activeTab]);

  // Función para refrescar contadores
  const refreshCounts = useCallback(async () => {
    await fetchOrderCounts();
  }, [fetchOrderCounts]);

  // Cargar órdenes inicial y contadores
  useEffect(() => {
    if (sellerId) {
      // Restaurar pestaña activa desde localStorage, por defecto 'all'
      const savedTab = localStorage.getItem('seller_orders_active_tab') as SellerOrderFilter;
      if (savedTab && ['pending', 'confirmed', 'cancelled', 'all'].includes(savedTab)) {
        setActiveTab(savedTab);
        fetchOrders(savedTab);
      } else {
        // Por defecto mostrar 'all' en lugar de 'pending'
        setActiveTab('all');
        fetchOrders('all');
      }
      
      // Cargar contadores
      fetchOrderCounts();
    }
  }, [sellerId]); // Solo dependemos de sellerId para evitar loops

  // Recargar cuando cambia la pestaña activa (controlado por handleTabChange)
  useEffect(() => {
    if (sellerId && activeTab) {
      fetchOrders(activeTab);
    }
  }, []); // Array vacío porque el cambio de tab se maneja en handleTabChange

  return {
    orders,
    loading,
    error,
    activeTab,
    orderCounts,
    setActiveTab: handleTabChange,
    refreshOrders,
    refreshCounts
  };
}; 