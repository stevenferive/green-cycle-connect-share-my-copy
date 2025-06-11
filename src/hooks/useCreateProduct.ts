
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { CreateProductDto } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (productData: CreateProductDto) => productService.createProduct(productData),
    onSuccess: (newProduct) => {
      // Invalidar la caché de productos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      toast({
        title: "¡Producto creado exitosamente!",
        description: `${newProduct.name} ha sido publicado en el marketplace.`,
      });
    },
    onError: (error: any) => {
      console.error('Error al crear producto:', error);
      
      const errorMessage = error?.message || 'Ocurrió un error al crear el producto';
      
      toast({
        title: "Error al crear producto",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useUploadImage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => productService.uploadProductImage(file),
    onSuccess: () => {
      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido correctamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error al subir imagen:', error);
      
      const errorMessage = error?.message || 'Error al subir la imagen';
      
      toast({
        title: "Error al subir imagen",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
