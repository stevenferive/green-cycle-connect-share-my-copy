import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, ProductResponse } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId, productData }: { productId: string; productData: any }) => 
      productService.updateProduct(productId, productData),
    onSuccess: (updatedProduct) => {
      // Invalidar la caché de productos para refrescar las listas
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
      queryClient.invalidateQueries({ queryKey: ['product', updatedProduct._id] });
      
      toast({
        title: "¡Producto actualizado exitosamente!",
        description: `${updatedProduct.name} ha sido actualizado correctamente.`,
      });
    },
    onError: (error: any) => {
      console.error('Error al actualizar producto:', error);
      
      let errorMessage = 'Ocurrió un error al actualizar el producto';
      
      // Manejar errores específicos
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.statusCode === 400) {
        errorMessage = 'Datos del producto inválidos. Por favor, revisa la información.';
      } else if (error?.statusCode === 401) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      } else if (error?.statusCode === 403) {
        errorMessage = 'No tienes permisos para modificar este producto. Solo puedes modificar tus propios productos.';
      } else if (error?.statusCode === 404) {
        errorMessage = 'Producto no encontrado.';
      }
      
      toast({
        title: "Error al actualizar producto",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}; 