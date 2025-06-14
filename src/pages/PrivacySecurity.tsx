
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  AlertTriangle, 
  Check, 
  FileText, 
  HelpCircle, 
  Settings, 
  Globe, 
  Users, 
  UserX, 
  ChevronRight, 
  Leaf,
  Key,
  Bell
} from 'lucide-react';

const PrivacySecurity = () => {
  const { user } = useAuth();
  
  // Estados para configuraciones de seguridad
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [suspiciousLoginAlerts, setSuspiciousLoginAlerts] = useState(true);
  
  // Estados para configuraciones de privacidad
  const [profileVisibility, setProfileVisibility] = useState('public');
  
  // Datos mock para dispositivos conectados
  const [connectedDevices] = useState([
    { id: 1, name: 'iPhone 13', location: 'Madrid, España', lastActive: '2 min ago', current: true },
    { id: 2, name: 'MacBook Pro', location: 'Madrid, España', lastActive: '1 hora ago', current: false },
    { id: 3, name: 'Samsung Galaxy', location: 'Barcelona, España', lastActive: '3 días ago', current: false }
  ]);

  const handleChangePassword = () => {
    console.log('Cambiar contraseña');
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    console.log('2FA toggled:', !twoFactorEnabled);
  };

  const handleLogoutDevice = (deviceId: number) => {
    console.log('Cerrar sesión en dispositivo:', deviceId);
  };

  const handleRequestData = () => {
    console.log('Solicitar copia de datos');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      console.log('Eliminar cuenta');
    }
  };

  const getVisibilityIcon = () => {
    switch (profileVisibility) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'buyers': return <Users className="h-4 w-4" />;
      case 'private': return <UserX className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getVisibilityText = () => {
    switch (profileVisibility) {
      case 'public': return 'Público';
      case 'buyers': return 'Solo compradores';
      case 'private': return 'Privado';
      default: return 'Público';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Shield className="h-8 w-8 mr-3 text-green-600" />
              Privacidad y Seguridad
            </h1>
            <p className="text-gray-600">Protege tu cuenta y controla tu información personal</p>
          </div>

          <div className="space-y-6">
            {/* Configuración de Seguridad */}
            <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Lock className="h-6 w-6 mr-3 text-green-600" />
                  Configuración de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cambiar contraseña */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Cambiar contraseña</p>
                      <p className="text-sm text-gray-600">Actualiza tu contraseña regularmente</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleChangePassword}
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    Cambiar
                  </Button>
                </div>

                {/* Verificación en dos pasos */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Verificación en dos pasos (2FA)</p>
                      <p className="text-sm text-gray-600">Agrega una capa extra de seguridad</p>
                      {twoFactorEnabled && (
                        <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          Activado
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled} 
                    onCheckedChange={handleEnable2FA}
                  />
                </div>

                {/* Alertas de inicio de sesión */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Alertas de inicio de sesión sospechoso</p>
                      <p className="text-sm text-gray-600">Recibe notificaciones de actividad inusual</p>
                    </div>
                  </div>
                  <Switch 
                    checked={suspiciousLoginAlerts} 
                    onCheckedChange={setSuspiciousLoginAlerts}
                  />
                </div>

                {/* Dispositivos conectados */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-green-600" />
                    Dispositivos conectados
                  </h3>
                  <div className="space-y-2">
                    {connectedDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{device.name}</p>
                            {device.current && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                Actual
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{device.location}</p>
                          <p className="text-xs text-gray-500">Última actividad: {device.lastActive}</p>
                        </div>
                        {!device.current && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLogoutDevice(device.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Cerrar sesión
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuración de Privacidad */}
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Eye className="h-6 w-6 mr-3 text-blue-600" />
                  Configuración de Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visibilidad del perfil */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    {getVisibilityIcon()}
                    <span className="ml-2">Visibilidad del perfil</span>
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: 'public', label: 'Público', desc: 'Todos pueden ver tu perfil', icon: Globe },
                      { value: 'buyers', label: 'Solo compradores', desc: 'Solo personas que compren pueden ver tu perfil', icon: Users },
                      { value: 'private', label: 'Privado', desc: 'Tu perfil no es visible para otros', icon: UserX }
                    ].map((option) => (
                      <div 
                        key={option.value}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          profileVisibility === option.value 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setProfileVisibility(option.value)}
                      >
                        <div className="flex items-center space-x-3">
                          <option.icon className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-600">{option.desc}</p>
                          </div>
                          {profileVisibility === option.value && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gestión de datos */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div 
                    className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={handleRequestData}
                  >
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Solicitar mis datos</p>
                        <p className="text-sm text-gray-600">Descarga una copia de tu información</p>
                      </div>
                    </div>
                  </div>

                  <Link to="/profile">
                    <div className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Editar datos personales</p>
                          <p className="text-sm text-gray-600">Gestiona tu información personal</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Eliminar cuenta */}
                <div className="border-t pt-6">
                  <div 
                    className="p-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                    onClick={handleDeleteAccount}
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-900">Eliminar mi cuenta</p>
                        <p className="text-sm text-red-700">Esta acción no se puede deshacer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opciones Adicionales */}
            <Card className="border-amber-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <HelpCircle className="h-6 w-6 mr-3 text-amber-600" />
                  Información Legal y Soporte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="font-medium text-gray-900">Política de privacidad</p>
                          <p className="text-sm text-gray-600">Cómo protegemos tus datos</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="font-medium text-gray-900">Términos y condiciones</p>
                          <p className="text-sm text-gray-600">Condiciones de uso de la plataforma</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="font-medium text-gray-900">Soporte de seguridad</p>
                          <p className="text-sm text-gray-600">Reportar problemas de seguridad</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Compromiso ecológico</p>
                          <p className="text-sm text-green-700">Conoce nuestras prácticas sostenibles</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacySecurity;
