import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { CreateProductDto } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productData, images }: { productData: CreateProductDto; images: File[] }) => 
      productService.createProductWithImages(productData, images),
    onSuccess: (newProduct) => {
      // Invalidar la caché de productos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
      
      toast({
        title: "¡Producto creado exitosamente!",
        description: `${newProduct.name} ha sido publicado en el marketplace.`,
      });
    },
    onError: (error: any) => {
      console.error('Error al crear producto:', error);
      
      let errorMessage = 'Ocurrió un error al crear el producto';
      
      // Manejar errores específicos
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.statusCode === 400) {
        errorMessage = 'Datos del producto inválidos. Por favor, revisa la información.';
      } else if (error?.statusCode === 401) {
        errorMessage = 'No tienes permisos para crear productos. Por favor, inicia sesión.';
      } else if (error?.statusCode === 413) {
        errorMessage = 'Las imágenes son demasiado grandes. Por favor, reduce su tamaño.';
      }
      
      toast({
        title: "Error al crear producto",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useGetCategories = () => {
  return useMutation({
    mutationFn: () => productService.getCategories(),
    onError: (error: any) => {
      console.error('Error al obtener categorías:', error);
    },
  });
};

export const useGetSubcategories = () => {
  return useMutation({
    mutationFn: (categoryId: string) => productService.getSubcategories(categoryId),
    onError: (error: any) => {
      console.error('Error al obtener subcategorías:', error);
    },
  });
};
