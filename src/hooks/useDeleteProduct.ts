import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),
    onSuccess: (result, productId) => {
      // Invalidar la caché de productos para refrescar las listas
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
      queryClient.removeQueries({ queryKey: ['product', productId] });
      
      toast({
        title: "¡Producto eliminado exitosamente!",
        description: result.message || "El producto ha sido archivado correctamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error al eliminar producto:', error);
      
      let errorMessage = 'Ocurrió un error al eliminar el producto';
      
      // Manejar errores específicos
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.statusCode === 401) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (error?.statusCode === 403) {
        errorMessage = 'No tienes permisos para eliminar este producto. Solo puedes eliminar tus propios productos.';
      } else if (error?.statusCode === 404) {
        errorMessage = 'Producto no encontrado.';
      }
      
      toast({
        title: "Error al eliminar producto",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}; 