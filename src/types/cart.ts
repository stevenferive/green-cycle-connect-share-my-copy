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
  _id: string;
}

export interface OrderItemProduct {
  _id: string;
  images: string[];
  name: string;
}

export interface OrderItem {
  productId: OrderItemProduct;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  _id: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyerId: {
    _id: string;
    email: string;
  };
  sellerId: string;
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderType: 'purchase';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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