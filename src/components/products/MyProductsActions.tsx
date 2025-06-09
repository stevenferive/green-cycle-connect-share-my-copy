
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

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
      <Button
        onClick={onUploadClick}
        className="bg-green hover:bg-green-dark text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Subir Producto
      </Button>
    </div>
  );
};

export default MyProductsActions;
