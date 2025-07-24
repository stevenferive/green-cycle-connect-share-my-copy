
import { ProductResponse } from '@/services/productService';

// Interfaz Product base
export interface Product {
  id: string;
  title: string;
  price: number;
  exchange: boolean;
  location: string;
  image: string;
  category: string;
  ecoBadges: string[];
  ecoSaving: number;
}

// Interfaz extendida para productos con detalles completos
export interface ProductDetail extends Product {
  images: string[];
  stock: number;
  stockUnit: string;
  barterPreferences: string[];
  seller: {
    _id: string;
    email: string;
  };
  currency: string;
  condition: string;
  description: string;
}

export const mapProductResponseToProduct = (productResponse: ProductResponse): Product => {
  return {
    id: productResponse._id,
    title: productResponse.name,
    price: productResponse.price,
    exchange: productResponse.forBarter || false,
    location: productResponse.location?.city || 'Ubicación no especificada',
    image: productResponse.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: productResponse.category?.name || 'Sin categoría',
    ecoBadges: productResponse.ecoBadges || ['Producto sostenible'],
    ecoSaving: productResponse.ecoSaving || 0
  };
};

export const mapProductResponseToProductDetail = (productResponse: ProductResponse): ProductDetail => {
  return {
    id: productResponse._id,
    title: productResponse.name,
    price: productResponse.price,
    exchange: productResponse.forBarter || false,
    location: productResponse.location?.city || 'Ubicación no especificada',
    image: productResponse.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    images: productResponse.images || [],
    category: productResponse.category?.name || 'Sin categoría',
    ecoBadges: productResponse.ecoBadges || ['Producto sostenible'],
    ecoSaving: productResponse.ecoSaving || 0,
    stock: productResponse.stock || 0,
    stockUnit: productResponse.stockUnit || 'unidad',
    barterPreferences: productResponse.barterPreferences || [],
    seller: {
      _id: typeof productResponse.seller === 'string' ? productResponse.seller : (productResponse.seller as any)?._id || '',
      email: typeof productResponse.seller === 'object' ? (productResponse.seller as any)?.email || '' : ''
    },
    currency: productResponse.currency || 'PEN',
    condition: productResponse.condition || 'new',
    description: productResponse.description || ''
  };
};
