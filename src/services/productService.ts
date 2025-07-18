import { api } from '@/api';
import { CreateProductDto } from '@/types/product';

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  subcategory?: {
    _id: string;
    name: string;
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
  status: 'draft' | 'active' | 'paused' | 'out_of_stock' | 'sold' | 'archived';
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
      // console.log('Obteniendo productos...');
      const response = await api.get('/products?limit=200');
      // console.log('Respuesta de la API:', response);
      
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

  async getSellerProducts(params: {
    sellerId: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<PaginatedResponse> {
    try {
      const { sellerId, page = 1, limit = 10, sort = '-createdAt' } = params;
      
      if (!sellerId) {
        throw new Error('El ID del vendedor es requerido');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort
      });

      console.log(`Obteniendo productos del vendedor ${sellerId}...`);
      const response = await api.get(`/products/seller/${sellerId}?${queryParams}`);
      
      if (!response) {
        console.warn('La respuesta de la API está vacía');
        return {
          products: [],
          total: 0,
          page: 1,
          totalPages: 0
        };
      }

      // Verificar estructura de respuesta paginada
      if ('products' in response && 'total' in response) {
        return {
          products: response.products || [],
          total: response.total || 0,
          page: response.page || page,
          totalPages: response.totalPages || 0
        };
      }

      // Si la respuesta es un array directo, convertir a formato paginado
      if (Array.isArray(response)) {
        return {
          products: response,
          total: response.length,
          page: 1,
          totalPages: 1
        };
      }

      console.warn('Formato de respuesta no reconocido:', response);
      return {
        products: [],
        total: 0,
        page: 1,
        totalPages: 0
      };
    } catch (error: any) {
      console.error('Error al obtener productos del vendedor:', error);
      
      // Manejar errores específicos
      if (error.statusCode === 401) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      
      if (error.statusCode === 403) {
        throw new Error('No tienes permisos para ver los productos de otro usuario');
      }
      
      if (error.statusCode === 404) {
        throw new Error('Vendedor no encontrado');
      }
      
      throw new Error(error.message || 'Error al obtener productos del vendedor');
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

  async createProductWithImages(productData: CreateProductDto, images: File[]): Promise<ProductResponse> {
    try {
      // console.log('Creando producto con imágenes:', productData);
      
      // Validaciones básicas
      if (!productData.name || productData.name.trim().length < 3) {
        throw new Error('El nombre del producto debe tener al menos 3 caracteres');
      }
      
      if (!productData.description || productData.description.trim().length < 10) {
        throw new Error('La descripción debe tener al menos 10 caracteres');
      }
      
      if (!productData.category) {
        throw new Error('La categoría es obligatoria');
      }
      
      if (!productData.location?.city || !productData.location?.region) {
        throw new Error('La ciudad y región son obligatorias');
      }
      
      if (!images || images.length === 0) {
        throw new Error('Debe agregar al menos una imagen');
      }
      
      if (images.length > 10) {
        throw new Error('Máximo 10 imágenes permitidas');
      }
      
      // Validar cada imagen
      for (const image of images) {
        if (!image.type.startsWith('image/')) {
          throw new Error(`El archivo ${image.name} no es una imagen válida`);
        }
        
        if (image.size > 5 * 1024 * 1024) { // 5MB
          throw new Error(`La imagen ${image.name} excede el tamaño máximo de 5MB`);
        }
      }
      
      // Establecer valores por defecto
      const productWithDefaults = {
        ...productData,
        price: productData.price || 0,
        currency: productData.currency || 'PEN',
        condition: productData.condition || 'new',
        status: productData.status || 'draft',
      };
      
      const response = await api.createProductWithImages(productWithDefaults, images);
      // console.log('Producto creado exitosamente:', response);
      
      if (response.success) {
        return response.product;
      } else {
        throw new Error(response.message || 'Error al crear el producto');
      }
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      
      // Manejar errores específicos del servidor
      if (error.statusCode === 400) {
        if (error.message?.includes('validation')) {
          throw new Error('Datos del producto inválidos. Por favor, revisa la información.');
        }
      }
      
      if (error.statusCode === 401) {
        throw new Error('No tienes permisos para crear productos. Por favor, inicia sesión.');
      }
      
      if (error.statusCode === 413) {
        throw new Error('Las imágenes son demasiado grandes. Por favor, reduce su tamaño.');
      }
      
      throw new Error(error.message || 'Error al crear el producto');
    }
  },

  // Mantener el método anterior para compatibilidad pero marcarlo como deprecated
  async createProduct(productData: CreateProductDto): Promise<ProductResponse> {
    console.warn('createProduct está deprecated. Usar createProductWithImages en su lugar.');
    throw new Error('Este método ya no es compatible. Usa createProductWithImages.');
  },

  async uploadProductImage(file: File): Promise<{ url: string }> {
    try {
      // console.log('Subiendo imagen del producto:', file.name);
      
      // Validar el archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('La imagen no puede ser mayor a 5MB');
      }
      
      const response = await api.uploadFile('/products/with-images', file, 'image');
      // console.log('Imagen subida exitosamente:', response);
      return response;
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      throw new Error(error.message || 'Error al subir la imagen');
    }
  },

  async getCategories(): Promise<Array<{ _id: string; name: string }>> {
    try {
      const response = await api.get('/categories');
      return response || [];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  },

  async getSubcategories(categoryId: string): Promise<Array<{ _id: string; name: string }>> {
    try {
      const response = await api.get(`/categories/${categoryId}/subcategories`);
      return response || [];
    } catch (error) {
      console.error('Error al obtener subcategorías:', error);
      return [];
    }
  },

  async updateProduct(productId: string, productData: Partial<ProductResponse>): Promise<ProductResponse> {
    try {
      // console.log('Actualizando producto:', productId, productData);
      
      // Validaciones básicas
      if (!productId) {
        throw new Error('El ID del producto es requerido');
      }
      
      // Validar campos si están presentes
      if (productData.name && productData.name.trim().length < 3) {
        throw new Error('El nombre del producto debe tener al menos 3 caracteres');
      }
      
      if (productData.description && productData.description.trim().length < 10) {
        throw new Error('La descripción debe tener al menos 10 caracteres');
      }
      
      if (productData.price && productData.price < 0) {
        throw new Error('El precio no puede ser negativo');
      }
      
      const response = await api.patch(`/products/${productId}`, productData);
      // console.log('Producto actualizado exitosamente:', response);
      
      return response;
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      
      // Manejar errores específicos del servidor
      if (error.statusCode === 400) {
        throw new Error(error.message || 'Datos del producto inválidos');
      }
      
      if (error.statusCode === 401) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente');
      }
      
      if (error.statusCode === 403) {
        throw new Error('No tienes permisos para modificar este producto. Solo puedes modificar tus propios productos');
      }
      
      if (error.statusCode === 404) {
        throw new Error('Producto no encontrado');
      }
      
      throw new Error(error.message || 'Error al actualizar el producto');
    }
  },

  async deleteProduct(productId: string): Promise<{ message: string }> {
    try {
      // console.log('Eliminando producto:', productId);
      
      // Validaciones básicas
      if (!productId) {
        throw new Error('El ID del producto es requerido');
      }
      
      const response = await api.delete(`/products/${productId}`);
      // console.log('Producto eliminado exitosamente:', response);
      
      return response || { message: 'Producto archivado exitosamente' };
    } catch (error: any) {
      console.error('Error al eliminar producto:', error);
      
      // Manejar errores específicos del servidor
      if (error.statusCode === 401) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente');
      }
      
      if (error.statusCode === 403) {
        throw new Error('No tienes permisos para eliminar este producto. Solo puedes eliminar tus propios productos');
      }
      
      if (error.statusCode === 404) {
        throw new Error('Producto no encontrado');
      }
      
      throw new Error(error.message || 'Error al eliminar el producto');
    }
  }
};
