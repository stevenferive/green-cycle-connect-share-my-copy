
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';

interface ProductUploadModalProps {
  loadProducts: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
}

const ProductUploadModal: React.FC<ProductUploadModalProps> = ({ 
  loadProducts,
  isOpen, 
  onClose, 
  onSave 
}) => {
  const handleSuccess = (product: any) => {
    onSave(product);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-green">Subir Nuevo Producto</DialogTitle>
        </DialogHeader>
        
        <ProductForm loadProducts={loadProducts}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductUploadModal;
