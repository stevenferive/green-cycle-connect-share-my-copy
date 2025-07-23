export type SellerOrderFilter = 'pending' | 'confirmed' | 'cancelled' | 'all';

export interface OrderTab {
  key: SellerOrderFilter;
  label: string;
  badgeStyle: string;
  count: number;
}

export interface EmptyStateMessage {
  title: string;
  description: string;
}

export interface OrderCounts {
  pending: number;
  confirmed: number;
  cancelled: number;
  all: number;
}

export const EMPTY_MESSAGES: Record<SellerOrderFilter, EmptyStateMessage> = {
  pending: {
    title: "No hay órdenes pendientes",
    description: "Cuando recibas nuevas órdenes aparecerán aquí"
  },
  confirmed: {
    title: "No hay órdenes aprobadas",
    description: "Las órdenes que apruebes aparecerán en esta sección"
  },
  cancelled: {
    title: "No hay órdenes rechazadas", 
    description: "Las órdenes que rechaces se mostrarán aquí"
  },
  all: {
    title: "No tienes órdenes aún",
    description: "Cuando los compradores realicen pedidos aparecerán aquí"
  }
}; 