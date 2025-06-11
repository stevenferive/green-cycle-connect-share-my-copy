import { api } from '@/api';

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  location?: string;
  forBarter?: boolean;
  stock?: number;
  status?: 'active' | 'paused' | 'out_of_stock';
  publishedAt?: string;
  views?: number;
  favorites?: number;
  ecoBadges?: string[];
  ecoSaving?: number;
}

export const productService = {
  async getAllProducts(): Promise<ProductResponse[]> {
    try {
      const response = await api.get('/products');
      return response;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<ProductResponse> {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  }
};
