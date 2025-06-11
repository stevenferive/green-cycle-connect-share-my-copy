
import { api } from '@/api';
import { CreateProductDto } from '@/types/product';

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  slug: string;
  images: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  price: number;
  currency: string;
  forBarter: boolean;
  barterPreferences: string[];
  stock: number;
  stockUnit: string;
  isUnlimitedStock: boolean;
  ecoBadges: string[];
  ecoSaving: number;
  sustainabilityScore: number;
  materials: string[];
  isHandmade: boolean;
  isOrganic: boolean;
  location: {
    coordinates: {
      lat: number;
      lng: number;
    };
    city: string;
    region: string;
    _id: string;
  };
  shippingOptions: {
    localPickup: boolean;
    homeDelivery: boolean;
    shipping: boolean;
    shippingCost: number;
    _id: string;
  };
  status: 'active' | 'paused' | 'out_of_stock';
  condition: string;
  publishedAt: string;
  seller: string;
  isVerifiedSeller: boolean;
  views: number;
  favorites: number;
  inquiries: number;
  shares: number;
  tags: string[];
  searchKeywords: string[];
  metadata: {
    seoTitle: string;
    seoDescription: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaginatedResponse {
  products: ProductResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export const productService = {
  async getAllProducts(): Promise<ProductResponse[]> {
    try {
      console.log('Obteniendo productos...');
      const response = await api.get('/products?limit=200');
      console.log('Respuesta de la API:', response);
      
      if (!response) {
        console.warn('La respuesta de la API está vacía');
        return [];
      }
      
      // Verificar si la respuesta tiene la estructura paginada
      if ('products' in response && Array.isArray(response.products)) {
        return response.products;
      }
      
      // Si no tiene la estructura paginada, verificar si es un array directamente
      if (Array.isArray(response)) {
        return response;
      }
      
      console.warn('Formato de respuesta no reconocido:', response);
      return [];
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return [];
    }
  },

  async getProductById(id: string): Promise<ProductResponse | null> {
    try {
      const response = await api.get(`/products/${id}`);
      return response || null;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return null;
    }
  },

  async createProduct(productData: CreateProductDto): Promise<ProductResponse> {
    try {
      console.log('Creando producto:', productData);
      const response = await api.post('/products', productData);
      console.log('Producto creado exitosamente:', response);
      return response;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  async uploadProductImage(file: File): Promise<{ url: string }> {
    try {
      console.log('Subiendo imagen del producto:', file.name);
      const response = await api.uploadFile('/products/upload-image', file, 'image');
      console.log('Imagen subida exitosamente:', response);
      return response;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  }
};
