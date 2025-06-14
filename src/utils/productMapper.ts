
import { Product } from '@/components/products/ProductCard';
import { ProductResponse } from '@/services/productService';

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
