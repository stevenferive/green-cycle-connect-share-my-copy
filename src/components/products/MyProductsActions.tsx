
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MyProductsActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onUploadClick: () => void;
}

const MyProductsActions: React.FC<MyProductsActionsProps> = ({
  searchTerm,
  onSearchChange,
  onUploadClick
}) => {
  const navigate = useNavigate();

  const handleViewPendingOrders = () => {
    navigate('/pending-orders');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleViewPendingOrders}
          className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Gestionar órdenes
        </Button>
        <Button
          onClick={onUploadClick}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Subir Producto
        </Button>
      </div>
    </div>
  );
};

export default MyProductsActions;
