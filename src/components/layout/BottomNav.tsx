import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageCircle, Menu, ShoppingCart } from 'lucide-react';

const BottomNav = React.memo(() => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/explore' },
    { icon: Search, label: 'Búsqueda', path: '/search' },
    { icon: ShoppingCart, label: 'Carrito', path: '/cart' },
    { icon: MessageCircle, label: 'Chats', path: '/chats' },
    { icon: Menu, label: 'Menú', path: '/menu' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 h-20">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-around items-center h-full py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-green bg-green/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-6 w-6 mb-1" />
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
