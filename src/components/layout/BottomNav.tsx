import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageCircle, Menu, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const BottomNav = React.memo(() => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/explore' },
    { icon: Search, label: 'Búsqueda', path: '/search' },
    { icon: ShoppingCart, label: 'Carrito', path: '/cart', showBadge: true },
    { icon: MessageCircle, label: 'Chats', path: '/chats' },
    { icon: Menu, label: 'Menú', path: '/menu' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 h-20">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-around items-center h-full py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const cartCount = getTotalItems();
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
                  isActive 
                    ? 'text-green bg-green/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <item.icon className="h-6 w-6 mb-1" />
                  {item.showBadge && cartCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';

export default BottomNav;
