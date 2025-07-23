import { orderApi } from '../../../../api';
import { SellerOrderFilter } from './types';
import { Order } from '@/types/cart';

export class SellerOrderService {
  /**
   * Obtiene las órdenes según el filtro especificado
   * Usando los endpoints correctos según la estructura del backend
   */
  static async fetchOrdersByFilter(filter: SellerOrderFilter): Promise<Order[]> {
    try {
      let response: any;

      switch (filter) {
        case 'pending':
          response = await orderApi.getPendingOrders();
          break;
        
        case 'confirmed':
          // GET /orders/seller/all?status=confirmed
          response = await this.fetchSellerOrdersWithStatus('confirmed');
          break;
        
        case 'cancelled':
          // GET /orders/seller/all?status=cancelled
          response = await this.fetchSellerOrdersWithStatus('cancelled');
          break;
        
        case 'all':
          // GET /orders/seller/all
          response = await this.fetchAllSellerOrders();
          break;
        
        default:
          throw new Error(`Filtro no soportado: ${filter}`);
      }

      // Manejar diferentes estructuras de respuesta
      return this.parseOrderResponse(response);
    } catch (error) {
      console.error(`Error al obtener órdenes para filtro ${filter}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene todas las órdenes del vendedor
   * GET /orders/seller/all
   */
  private static async fetchAllSellerOrders(): Promise<any> {
    console.log('🔍 Llamando a: GET /orders/seller/all');
    return orderApi.getSellerOrders();
  }

  /**
   * Obtiene órdenes del vendedor filtradas por status
   * GET /orders/seller/all?status={status}
   */
  private static async fetchSellerOrdersWithStatus(status: string): Promise<any> {
    console.log(`🔍 Llamando a: GET /orders/seller/all?status=${status}`);
    return orderApi.getSellerOrders(status);
  }

  /**
   * Parsea la respuesta de la API para extraer las órdenes
   */
  private static parseOrderResponse(response: any): Order[] {
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.orders)) {
      return response.orders;
    } else if (response && Array.isArray(response.data)) {
      return response.data;
    } else if (response && response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  /**
   * Calcula los contadores para cada estado de órdenes
   */
  static calculateOrderCounts(orders: Order[]) {
    return {
      pending: orders.filter(order => order.status === 'pending').length,
      confirmed: orders.filter(order => order.status === 'confirmed').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length,
      all: orders.length
    };
  }

  /**
   * Obtiene todas las órdenes del vendedor para calcular contadores
   * GET /orders/seller/all
   */
  static async getAllOrdersForCounts(): Promise<Order[]> {
    try {
      return await this.fetchOrdersByFilter('all');
    } catch (error) {
      console.error('Error al obtener todas las órdenes para contadores:', error);
      throw error;
    }
  }
} 