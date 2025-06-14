
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { Link } from 'react-router-dom';
import { 
  User, 
  Settings as SettingsIcon, 
  Globe, 
  Accessibility, 
  LogOut,
  Trash2,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  Leaf,
  Package,
  MapPin,
  Lightbulb,
  FileText,
  Eye
} from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  
  // Estados para preferencias
  const [language, setLanguage] = useState('es');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [showRecyclablePackaging, setShowRecyclablePackaging] = useState(true);
  const [prioritizeLocal, setPrioritizeLocal] = useState(true);
  const [ecoTipNotifications, setEcoTipNotifications] = useState(true);

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // Lógica para eliminar cuenta
      console.log('Eliminar cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
            <p className="text-gray-600">Personaliza tu experiencia en la plataforma</p>
          </div>

          {/* Perfil del usuario */}
          <Card className="mb-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-green-200">
                  <AvatarFallback className="bg-green-100 text-green-700 text-lg font-semibold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <Leaf className="h-4 w-4 mr-1" />
                    Miembro eco-verificado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ajustes de la aplicación */}
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <SettingsIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Ajustes de la aplicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Idioma</p>
                      <p className="text-sm text-gray-600">Español</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Cambiar
                  </Button>
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-medium text-gray-900 mb-3 flex items-center">
                    <Accessibility className="h-5 w-5 mr-2 text-blue-600" />
                    Accesibilidad
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Alto contraste</span>
                      <Switch 
                        checked={highContrast} 
                        onCheckedChange={setHighContrast}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Texto grande</span>
                      <Switch 
                        checked={largeText} 
                        onCheckedChange={setLargeText}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cuenta del usuario */}
            <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-600" />
                  Cuenta del usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/profile">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Información personal</p>
                        <p className="text-sm text-gray-600">Editar perfil y datos</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>

                <div className="border-t pt-3 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar cuenta
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preferencias ecológicas */}
            <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Preferencias ecológicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Empaque reciclable</p>
                      <p className="text-sm text-gray-600">Mostrar productos eco-friendly</p>
                    </div>
                  </div>
                  <Switch 
                    checked={showRecyclablePackaging} 
                    onCheckedChange={setShowRecyclablePackaging}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Productos locales</p>
                      <p className="text-sm text-gray-600">Priorizar vendedores cercanos</p>
                    </div>
                  </div>
                  <Switch 
                    checked={prioritizeLocal} 
                    onCheckedChange={setPrioritizeLocal}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Consejos ecológicos</p>
                      <p className="text-sm text-gray-600">Recibir tips de sostenibilidad</p>
                    </div>
                  </div>
                  <Switch 
                    checked={ecoTipNotifications} 
                    onCheckedChange={setEcoTipNotifications}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Soporte y legal */}
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-amber-600" />
                  Soporte y legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Centro de ayuda</p>
                      <p className="text-sm text-gray-600">FAQ y soporte técnico</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Política de privacidad</p>
                      <p className="text-sm text-gray-600">Cómo protegemos tus datos</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Términos y condiciones</p>
                      <p className="text-sm text-gray-600">Condiciones de uso</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enlaces adicionales */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Link to="/notifications">
              <Card className="border-indigo-200 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Bell className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Notificaciones</p>
                  <p className="text-sm text-gray-600">Gestionar alertas</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/payment-methods">
              <Card className="border-teal-200 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Pagos</p>
                  <p className="text-sm text-gray-600">Métodos de pago</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/my-products">
              <Card className="border-rose-200 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 text-rose-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Mis productos</p>
                  <p className="text-sm text-gray-600">Gestionar publicaciones</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
