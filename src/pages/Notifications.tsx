
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  MessageCircle, 
  Package, 
  Clock, 
  Mail,
  Trash2,
  Check,
  Settings,
  Leaf,
  Star,
  AlertTriangle
} from 'lucide-react';
import NotificationsList from '@/components/notifications/NotificationsList';
import NotificationSettings from '@/components/notifications/NotificationSettings';

// Mock data para notificaciones
const mockNotifications = [
  {
    id: '1',
    type: 'message' as const,
    title: 'Nuevo mensaje de Ana García',
    description: 'Te ha enviado un mensaje sobre el intercambio de la maceta de cerámica',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    isImportant: false
  },
  {
    id: '2',
    type: 'order' as const,
    title: 'Pedido confirmado',
    description: 'Tu pedido de jabón artesanal ha sido confirmado por el vendedor',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    isImportant: true
  },
  {
    id: '3',
    type: 'stock' as const,
    title: 'Stock bajo en tu producto',
    description: 'Solo queda 1 unidad de "Bolsa Reutilizable de Algodón"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    isImportant: true
  },
  {
    id: '4',
    type: 'exchange' as const,
    title: 'Recordatorio de intercambio',
    description: 'Tienes un intercambio programado para mañana a las 15:00',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true,
    isImportant: false
  },
  {
    id: '5',
    type: 'review' as const,
    title: 'Nueva valoración recibida',
    description: 'Carlos M. ha valorado tu producto con 5 estrellas',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    isImportant: false
  }
];

export interface Notification {
  id: string;
  type: 'message' | 'order' | 'stock' | 'exchange' | 'review';
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  isImportant: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast({
      title: "Notificaciones marcadas",
      description: "Todas las notificaciones han sido marcadas como leídas",
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast({
      title: "Notificación eliminada",
      description: "La notificación ha sido eliminada correctamente",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-green" />
              <h1 className="text-2xl font-bold">Notificaciones</h1>
              {unreadCount > 0 && (
                <Badge className="bg-green text-white">
                  {unreadCount} nuevas
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                onClick={handleMarkAllAsRead}
                className="text-green border-green hover:bg-green-light/10"
              >
                <Check className="mr-2 h-4 w-4" />
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Tabs para notificaciones y configuración */}
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuración
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="notifications" className="mt-6">
              <NotificationsList 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <NotificationSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
