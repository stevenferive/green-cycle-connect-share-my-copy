import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const BottomNav = React.memo(() => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  
  const navItems = [
    { icon: 'house2', label: 'Inicio', path: '/explore' },
    { icon: 'search', label: 'Búsqueda', path: '/search' },
    { icon: 'cart', label: 'Carrito', path: '/cart', showBadge: true },
    { icon: 'chat', label: 'Chats', path: '/chats' },
    { icon: 'menu', label: 'Menú', path: '/menu' },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-transparent border-t-0 z-50 h-20 mb-1">
      <div className="mx-4 h-full rounded-2xl shadow-lg bg-[#FEFCE9]">
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
                  <img 
                    src={`/${item.icon}.png`} 
                    alt={item.label}
                    className="h-12 w-12 mb-1 object-contain"
                  />
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
