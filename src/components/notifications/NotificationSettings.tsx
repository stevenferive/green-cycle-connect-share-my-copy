
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Bell, 
  MessageCircle, 
  Package, 
  AlertTriangle, 
  Clock, 
  Star,
  Moon,
  Settings
} from 'lucide-react';

interface NotificationPreferences {
  email: {
    enabled: boolean;
    messages: boolean;
    orders: boolean;
    stock: boolean;
    exchanges: boolean;
    reviews: boolean;
  };
  inApp: {
    enabled: boolean;
    messages: boolean;
    orders: boolean;
    stock: boolean;
    exchanges: boolean;
    reviews: boolean;
  };
  doNotDisturb: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

const NotificationSettings = () => {
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      enabled: true,
      messages: true,
      orders: true,
      stock: true,
      exchanges: true,
      reviews: false,
    },
    inApp: {
      enabled: true,
      messages: true,
      orders: true,
      stock: true,
      exchanges: true,
      reviews: true,
    },
    doNotDisturb: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  });

  const handleEmailToggle = (type: keyof typeof preferences.email) => {
    setPreferences(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [type]: !prev.email[type]
      }
    }));
  };

  const handleInAppToggle = (type: keyof typeof preferences.inApp) => {
    setPreferences(prev => ({
      ...prev,
      inApp: {
        ...prev.inApp,
        [type]: !prev.inApp[type]
      }
    }));
  };

  const handleDoNotDisturbToggle = () => {
    setPreferences(prev => ({
      ...prev,
      doNotDisturb: {
        ...prev.doNotDisturb,
        enabled: !prev.doNotDisturb.enabled
      }
    }));
  };

  const handleTimeChange = (type: 'startTime' | 'endTime', value: string) => {
    setPreferences(prev => ({
      ...prev,
      doNotDisturb: {
        ...prev.doNotDisturb,
        [type]: value
      }
    }));
  };

  const handleSavePreferences = () => {
    // Aquí se guardarían las preferencias en el backend
    toast({
      title: "Preferencias guardadas",
      description: "Tus preferencias de notificación han sido actualizadas correctamente",
    });
  };

  const notificationTypes = [
    {
      key: 'messages' as const,
      label: 'Mensajes de chat',
      description: 'Nuevos mensajes en conversaciones de intercambio',
      icon: MessageCircle,
      color: 'text-blue-500'
    },
    {
      key: 'orders' as const,
      label: 'Pedidos y transacciones',
      description: 'Confirmaciones, envíos y actualizaciones de estado',
      icon: Package,
      color: 'text-green'
    },
    {
      key: 'stock' as const,
      label: 'Alertas de stock',
      description: 'Cuando tus productos tienen poco inventario',
      icon: AlertTriangle,
      color: 'text-orange-500'
    },
    {
      key: 'exchanges' as const,
      label: 'Recordatorios de intercambio',
      description: 'Entregas y intercambios programados',
      icon: Clock,
      color: 'text-purple-500'
    },
    {
      key: 'reviews' as const,
      label: 'Valoraciones y comentarios',
      description: 'Nuevas reseñas de tus productos',
      icon: Star,
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Notificaciones por email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green" />
            Notificaciones por Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Activar notificaciones por email</Label>
              <p className="text-sm text-muted-foreground">
                Recibe notificaciones importantes en tu correo electrónico
              </p>
            </div>
            <Switch
              checked={preferences.email.enabled}
              onCheckedChange={() => handleEmailToggle('enabled')}
            />
          </div>
          
          {preferences.email.enabled && (
            <div className="space-y-3 ml-4 border-l-2 border-green-100 pl-4">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <type.icon className={`h-4 w-4 ${type.color}`} />
                    <div>
                      <Label className="text-sm font-medium">{type.label}</Label>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.email[type.key]}
                    onCheckedChange={() => handleEmailToggle(type.key)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notificaciones en la app */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-green" />
            Notificaciones en la App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Activar notificaciones en la app</Label>
              <p className="text-sm text-muted-foreground">
                Recibe notificaciones mientras navegas en la aplicación
              </p>
            </div>
            <Switch
              checked={preferences.inApp.enabled}
              onCheckedChange={() => handleInAppToggle('enabled')}
            />
          </div>
          
          {preferences.inApp.enabled && (
            <div className="space-y-3 ml-4 border-l-2 border-green-100 pl-4">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <type.icon className={`h-4 w-4 ${type.color}`} />
                    <div>
                      <Label className="text-sm font-medium">{type.label}</Label>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.inApp[type.key]}
                    onCheckedChange={() => handleInAppToggle(type.key)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modo no molestar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-green" />
            Modo No Molestar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Activar modo no molestar</Label>
              <p className="text-sm text-muted-foreground">
                Silencia las notificaciones durante horas específicas
              </p>
            </div>
            <Switch
              checked={preferences.doNotDisturb.enabled}
              onCheckedChange={handleDoNotDisturbToggle}
            />
          </div>
          
          {preferences.doNotDisturb.enabled && (
            <div className="space-y-4 ml-4 border-l-2 border-green-100 pl-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-sm font-medium">
                    Desde
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={preferences.doNotDisturb.startTime}
                    onChange={(e) => handleTimeChange('startTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="text-sm font-medium">
                    Hasta
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={preferences.doNotDisturb.endTime}
                    onChange={(e) => handleTimeChange('endTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Durante este horario no recibirás notificaciones push ni sonidos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botón para guardar */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSavePreferences}
          className="bg-green hover:bg-green-dark text-white"
        >
          <Settings className="mr-2 h-4 w-4" />
          Guardar Preferencias
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
