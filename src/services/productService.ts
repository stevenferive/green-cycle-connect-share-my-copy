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
  subcategory?: {
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
      console.log('Creando producto con imágenes:', productData);
      
      // Validaciones básicas
      if (!productData.name || productData.name.trim().length < 3) {
        throw new Error('El nombre del producto debe tener al menos 3 caracteres');
      }
      
      if (!productData.description || productData.description.trim().length < 10) {
        throw new Error('La descripción debe tener al menos 10 caracteres');
      }
      
      if (!productData.slug) {
        throw new Error('El slug es obligatorio');
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
      console.log('Producto creado exitosamente:', response);
      
      if (response.success) {
        return response.product;
      } else {
        throw new Error(response.message || 'Error al crear el producto');
      }
    } catch (error: any) {
      console.error('Error al crear producto:', error);
      
      // Manejar errores específicos del servidor
      if (error.statusCode === 400) {
        if (error.message?.includes('slug')) {
          throw new Error('Ya existe un producto con ese slug. Por favor, elige otro nombre.');
        }
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
      console.log('Subiendo imagen del producto:', file.name);
      
      // Validar el archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('La imagen no puede ser mayor a 5MB');
      }
      
      const response = await api.uploadFile('/products/with-images', file, 'image');
      console.log('Imagen subida exitosamente:', response);
      return response;
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      throw new Error(error.message || 'Error al subir la imagen');
    }
  },

  async checkSlugAvailability(slug: string): Promise<boolean> {
    try {
      await api.get(`/products/check-slug/${slug}`);
      return true; // Si no hay error, el slug está disponible
    } catch (error: any) {
      if (error.statusCode === 409) {
        return false; // Slug ya existe
      }
      throw error;
    }
  },

  async getCategories(): Promise<Array<{ _id: string; name: string; slug: string }>> {
    try {
      const response = await api.get('/categories');
      return response || [];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  },

  async getSubcategories(categoryId: string): Promise<Array<{ _id: string; name: string; slug: string }>> {
    try {
      const response = await api.get(`/categories/${categoryId}/subcategories`);
      return response || [];
    } catch (error) {
      console.error('Error al obtener subcategorías:', error);
      return [];
    }
  }
};
