
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
// import { useNotifications } from '@/hooks/useNotifications';
import { Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  Heart, 
  Package, 
  ShoppingBag,
  HelpCircle, 
  LogOut,
  Bell,
  Shield,
  CreditCard,
  ChevronRight,
  MapPin,
  BarChart3,
  History,
  Star
} from 'lucide-react';

const Menu = () => {
  const { user, logout } = useAuth();
  // const { unreadCount, requestPermission, permission } = useNotifications();

  const menuItems = [
    // { 
    //   icon: BarChart3, 
    //   label: 'Dashboard', 
    //   description: 'Estadísticas y resumen de actividad',
    //   href: '/dashboard'
    // },
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
      icon: ShoppingBag, 
      label: 'Mis Órdenes', 
      description: 'Ver historial de compras realizadas',
      href: '/orders'
    },
    // { 
    //   icon: Heart, 
    //   label: 'Favoritos', 
    //   description: 'Productos que me gustan',
    //   href: '/favorites'
    // },
    // { 
    //   icon: History, 
    //   label: 'Historial de Transacciones', 
    //   description: 'Ver compras y ventas realizadas',
    //   href: '/transaction-history'
    // },
    // { 
    //   icon: Star, 
    //   label: 'Reseñas y Calificaciones', 
    //   description: 'Gestionar reseñas recibidas y dadas',
    //   href: '/reviews'
    // },
    // { 
    //   icon: Bell, 
    //   label: 'Notificaciones', 
    //   description: 'Configurar alertas y ver notificaciones',
    //   href: '/notifications',
    //   badge: unreadCount > 0 ? unreadCount : undefined
    // },
    // { 
    //   icon: MapPin, 
    //   label: 'Ubicaciones', 
    //   description: 'Gestionar direcciones guardadas',
    //   href: '/locations'
    // },
    // { 
    //   icon: CreditCard, 
    //   label: 'Métodos de Pago', 
    //   description: 'Gestionar pagos y cobros',
    //   href: '/payment-methods'
    // },
    // { 
    //   icon: Settings, 
    //   label: 'Configuración', 
    //   description: 'Ajustes de la aplicación y preferencias',
    //   href: '/settings'
    // },
    // { 
    //   icon: Shield, 
    //   label: 'Privacidad y Seguridad', 
    //   description: 'Proteger cuenta y datos personales',
    //   href: '/privacy-security'
    // },
    { 
      icon: HelpCircle, 
      label: 'Ayuda y Soporte', 
      description: 'Obtener ayuda y contactar soporte',
      href: '/help-support'
    },
  ];

  // const handleEnableNotifications = async () => {
  //   const granted = await requestPermission();
  //   if (granted) {
  //     console.log('Notificaciones habilitadas');
  //   }
  // };

  return (
    <div className="min-h-screen pb-[100px] bg-gradient-to-r from-[#EEFFCD] to-[#C8F8B1]">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">
          <h1 className="text-3xl text-center font-bold mb-6 text-gray-600">Menú</h1>
          
          <div className="bg-[#FFFFDA] rounded-[30px] p-6 w-[500px] shadow-lg">
            {/* Perfil del usuario */}
            <Card className="mb-6 bg-transparent border-0 shadow-none">
              <CardContent className="p-6">
                <div className="flex flex-row items-center justify-center gap-4 text-center">
                  <Avatar className="h-[100px] w-[100px]">
                    <AvatarFallback className="bg-green text-white text-lg">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <h2 className="text-xl font-semibold">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <p className="text-sm text-green mt-1">Miembro verificado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notificaciones push */}
            {/* {permission !== 'granted' && ( */}
              {/* <Card className="mb-6 border-none rounded-[30px] bg-yellow-50">
                <CardContent className="px-4 py-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <img 
                        src="/alarm.png" 
                        alt="Alarma" 
                        className="h-[120px] w-[120px] object-contain"
                      />
                      <div>
                        <h3 className="font-medium text-yellow-800">Habilitar Notificaciones</h3>
                        <p className="text-sm text-yellow-700">
                          Recibe alertas de nuevos mensajes y actividad en tus productos
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      Habilitar
                    </Button>
                  </div>
                </CardContent>
              </Card> */}
            {/* )} */}

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
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors border-none rounded-[30px] shadow-none">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-muted rounded-lg">
                            <item.icon className="h-5 w-5 text-green" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{item.label}</h3>
                              {/* {item.badge && (
                                <Badge variant="destructive" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )} */}
                            </div>
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
            <Card className="mt-6 border-none bg-transparent shadow-none">
              <CardContent className="p-4">
                <Button 
                  className="w-full justify-start bg-[#FF4F47] hover:bg-[#FF4F47]/80" 
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;
