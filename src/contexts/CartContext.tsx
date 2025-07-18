
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LocalStorageService } from '@/infrastructure/storage/LocalStorageService';
import { cartApi } from '../../api';
import { CartBackend, CartItemBackend } from '@/types/cart';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  sellerId: string;
  sellerName: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Función para convertir items del backend al formato del frontend
  const convertBackendToFrontend = (backendItems: CartItemBackend[]): CartItem[] => {
    return backendItems.map(item => ({
      id: item.productId,
      title: item.productName,
      price: item.unitPrice,
      quantity: item.quantity,
      image: item.productImage || '/placeholder.svg',
      category: 'Producto', // El backend no devuelve la categoría, usar placeholder
      sellerId: item.sellerId,
      sellerName: item.sellerName
    }));
  };

  // Cargar carrito desde el backend o localStorage
  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setIsLoading(true);
        const cartData: CartBackend = await cartApi.getCart();
        const convertedItems = convertBackendToFrontend(cartData.items);
        setItems(convertedItems);
      } catch (error) {
        console.error('Error loading cart from backend:', error);
        // Si falla, intentar cargar desde localStorage como fallback
        const savedCart = LocalStorageService.get<CartItem[]>('cart');
        if (savedCart) {
          setItems(savedCart);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Si no está autenticado, usar localStorage
      const savedCart = LocalStorageService.get<CartItem[]>('cart');
      if (savedCart) {
        setItems(savedCart);
      }
    }
  }, [isAuthenticated]);

  // Cargar carrito al inicializar o cuando cambie la autenticación
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Guardar carrito en localStorage cuando cambie (para usuarios no autenticados)
  useEffect(() => {
    if (!isAuthenticated) {
      LocalStorageService.save('cart', items);
    }
  }, [items, isAuthenticated]);

  const addItem = async (product: Omit<CartItem, 'quantity'>) => {
    if (isAuthenticated) {
      try {
        setIsLoading(true);
        await cartApi.addToCart(product.id, 1);
        await loadCart(); // Recargar carrito desde el servidor
        toast({
          title: "Producto agregado",
          description: `${product.title} añadido al carrito`,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error al agregar producto",
          description: error.message || "No se pudo agregar el producto al carrito",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Comportamiento local para usuarios no autenticados
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        return [...prevItems, { ...product, quantity: 1 }];
      });
      
      toast({
        title: "Producto agregado",
        description: `${product.title} añadido al carrito`,
      });
    }
  };

  const removeItem = async (id: string) => {
    if (isAuthenticated) {
      try {
        setIsLoading(true);
        await cartApi.removeFromCart(id);
        await loadCart();
        toast({
          title: "Producto eliminado",
          description: "El producto fue removido del carrito",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error al eliminar producto",
          description: error.message || "No se pudo eliminar el producto",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      toast({
        title: "Producto eliminado",
        description: "El producto fue removido del carrito",
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }
    
    if (isAuthenticated) {
      try {
        setIsLoading(true);
        await cartApi.updateCartItem(id, quantity);
        await loadCart();
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error al actualizar cantidad",
          description: error.message || "No se pudo actualizar la cantidad",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
    if (!isAuthenticated) {
      LocalStorageService.remove('cart');
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const refreshCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isLoading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
