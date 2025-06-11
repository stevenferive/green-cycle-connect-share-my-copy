
import { api } from '@/api';
import { CreateProductDto } from '@/types/product';

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
