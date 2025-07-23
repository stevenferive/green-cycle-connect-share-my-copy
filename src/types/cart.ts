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
  _id?: string;
}

export interface OrderItemProduct {
  _id: string;
  name: string;
  images: string[];
}

export interface OrderItem {
  productId: OrderItemProduct;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderSeller {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyerId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  sellerId: OrderSeller;
  items: OrderItem[];
  subtotal: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderType: string;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelReason?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
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