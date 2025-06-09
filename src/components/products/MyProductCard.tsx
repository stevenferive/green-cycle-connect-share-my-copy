
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  Pause, 
  Play,
  AlertTriangle,
  Package
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  price: number;
  forBarter: boolean;
  image: string;
  status: 'active' | 'paused' | 'out_of_stock';
  publishedAt: string;
  views: number;
  favorites: number;
}

interface MyProductCardProps {
  product: Product;
  onUpdate: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const MyProductCard: React.FC<MyProductCardProps> = ({ product, onUpdate, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusBadge = () => {
    switch (product.status) {
      case 'active':
        return <Badge className="bg-green text-white">Activo</Badge>;
      case 'paused':
        return <Badge variant="secondary">Pausado</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Sin Stock</Badge>;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    if (product.status === 'out_of_stock') {
      return "Este producto está sin stock. ¿Deseas actualizarlo?";
    }
    if (product.status === 'paused') {
      return "Este producto está pausado y no es visible para otros usuarios.";
    }
    return null;
  };

  const handleToggleStatus = () => {
    const newStatus = product.status === 'active' ? 'paused' : 'active';
    onUpdate({ ...product, status: newStatus });
  };

  const handleUpdateStock = () => {
    if (product.status === 'out_of_stock') {
      onUpdate({ ...product, stock: 1, status: 'active' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Status overlay */}
          {(product.status === 'out_of_stock' || product.status === 'paused') && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                {product.status === 'out_of_stock' && (
                  <>
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Sin Stock</p>
                  </>
                )}
                {product.status === 'paused' && (
                  <>
                    <Pause className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Pausado</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Actions menu */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleStatus}>
                  {product.status === 'active' ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Activar
                    </>
                  )}
                </DropdownMenuItem>
                {product.status === 'out_of_stock' && (
                  <DropdownMenuItem onClick={handleUpdateStock}>
                    <Package className="mr-2 h-4 w-4" />
                    Actualizar Stock
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Categoría:</span>
              <Badge variant="outline" className="text-green border-green">
                {product.category}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stock:</span>
              <span className={product.stock === 0 ? 'text-destructive font-medium' : 'text-foreground'}>
                {product.stock} unidades
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Precio:</span>
              <span className="font-medium text-green">
                {product.forBarter ? 'Intercambio' : `S/ ${product.price.toFixed(2)}`}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Publicado:</span>
              <span>{formatDate(product.publishedAt)}</span>
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-muted-foreground" />
                <span>{product.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-muted-foreground" />
                <span>{product.favorites}</span>
              </div>
            </div>
          </div>

          {/* Status message */}
          {getStatusMessage() && (
            <div className="mt-3 p-2 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">{getStatusMessage()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto "{product.name}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(product.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyProductCard;
