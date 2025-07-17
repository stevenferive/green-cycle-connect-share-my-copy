import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteProduct } from '@/hooks/useDeleteProduct';
import { ProductResponse } from '@/services/productService';

interface DeleteProductModalProps {
  product: ProductResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onProductDeleted?: () => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onProductDeleted
}) => {
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      await deleteProductMutation.mutateAsync(product._id);
      
      if (onProductDeleted) {
        onProductDeleted();
      }
      
      onClose();
    } catch (err) {
      // El error ya está manejado en el hook
      console.error('Error al eliminar producto:', err);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!product) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              ¿Estás seguro de que quieres eliminar el producto <strong>"{product.name}"</strong>?
            </p>
            <p className="text-amber-600">
              Esta acción archivará el producto y no se podrá deshacer. El producto dejará de ser visible para otros usuarios.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProductMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProductMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProductMutation.isPending ? 'Eliminando...' : 'Eliminar Producto'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductModal; 