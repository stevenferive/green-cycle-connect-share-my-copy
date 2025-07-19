// Interfaces para el sistema de carrito

export interface CartItemBackend {
  productId: string;
  quantity: number;
  productName: string;
  unitPrice: number;
  sellerId: string;
  sellerName: string;
  productImage?: string;
}

export interface CartBackend {
  items: CartItemBackend[];
  totalItems: number;
  totalAmount: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem extends CartItemBackend {
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyerId: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'delivered';
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PendingOrder extends Order {
  status: 'pending';
}

export interface CartApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
} 