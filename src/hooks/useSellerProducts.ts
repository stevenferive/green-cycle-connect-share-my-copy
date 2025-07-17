import { useState, useEffect } from 'react';
import { productService, ProductResponse } from '@/services/productService';

interface UseSellerProductsParams {
  sellerId: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface UseSellerProductsReturn {
  products: ProductResponse[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  total: number;
  currentPage: number;
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
}

export const useSellerProducts = ({
  sellerId,
  page = 1,
  limit = 10,
  sort = '-createdAt'
}: UseSellerProductsParams): UseSellerProductsReturn => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchProducts = async () => {
    if (!sellerId) {
      setError('ID del vendedor requerido');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await productService.getSellerProducts({
        sellerId,
        page: currentPage,
        limit,
        sort
      });
      
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error al obtener productos del vendedor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId, currentPage, limit, sort]);

  const refresh = async () => {
    await fetchProducts();
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    products,
    loading,
    error,
    totalPages,
    total,
    currentPage,
    refresh,
    setPage
  };
}; 