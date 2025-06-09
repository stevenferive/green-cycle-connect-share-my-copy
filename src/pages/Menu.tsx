import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Heart, 
  Package, 
  HelpCircle, 
  LogOut,
  Bell,
  Shield,
  CreditCard,
  ChevronRight,
  MapPin
} from 'lucide-react';

const Menu = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { 
      icon: User, 
      label: 'Mi Perfil', 
      description: 'Editar información personal',
      href: '/profile'
    },
    { 
      icon: Package, 
      label: 'Mis Productos', 
      description: 'Gestionar mis publicaciones',
      href: '/my-products'
    },
    { 
      icon: Heart, 
      label: 'Favoritos', 
      description: 'Productos que me gustan',
      href: '/favorites'
    },
    { 
      icon: Bell, 
      label: 'Notificaciones', 
      description: 'Configurar alertas y ver notificaciones',
      href: '/notifications'
    },
    { 
      icon: MapPin, 
      label: 'Tus ubicaciones', 
      description: 'Gestionar ubicaciones',
      href: '/locations'
    },
    { 
      icon: CreditCard, 
      label: 'Métodos de Pago', 
      description: 'Gestionar pagos y cobros',
      href: '/payment-methods'
    },
    { icon: Shield, label: 'Privacidad y Seguridad', description: 'Configuración de seguridad' },
    { icon: Settings, label: 'Configuración', description: 'Ajustes de la aplicación' },
    { icon: HelpCircle, label: 'Ayuda y Soporte', description: 'Obtener ayuda' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Menú</h1>
          
          {/* Perfil del usuario */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-green text-white text-lg">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-green mt-1">Miembro verificado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opciones del menú */}
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const MenuCard = item.href ? Link : 'div';
              return (
                <MenuCard 
                  key={index} 
                  to={item.href} 
                  className="block"
                >
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <item.icon className="h-5 w-5 text-green" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.label}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        {item.href && (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </MenuCard>
              );
            })}
          </div>

          {/* Botón de cerrar sesión */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <Button 
                variant="destructive" 
                className="w-full justify-start" 
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Menu;
