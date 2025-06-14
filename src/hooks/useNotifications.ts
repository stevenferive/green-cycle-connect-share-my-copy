
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'message' | 'favorite' | 'product' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  userId?: string;
  productId?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  // Simular notificaciones iniciales
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'message',
        title: 'Nuevo mensaje',
        message: 'María González te ha enviado un mensaje sobre "Lámpara Vintage"',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
        read: false,
        actionUrl: '/chats',
        userId: 'user1',
        productId: 'product1'
      },
      {
        id: '2',
        type: 'favorite',
        title: 'Producto favorito disponible',
        message: 'Tu producto favorito "Bicicleta ecológica" tiene una oferta especial',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
        read: false,
        actionUrl: '/favorites',
        productId: 'product2'
      },
      {
        id: '3',
        type: 'product',
        title: 'Producto vendido',
        message: 'Tu producto "Monitor Samsung" ha sido vendido exitosamente',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
        read: true,
        actionUrl: '/my-products',
        productId: 'product3'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  // Solicitar permisos para notificaciones push
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return false;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
    return permission === 'granted';
  }, []);

  // Enviar notificación push
  const sendPushNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: false,
        silent: false
      });
    }
  }, [permission]);

  // Agregar nueva notificación
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Mostrar toast
    toast({
      title: newNotification.title,
      description: newNotification.message
    });

    // Enviar push notification si hay permisos
    sendPushNotification(notification);
  }, [toast, sendPushNotification]);

  // Marcar notificación como leída
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Eliminar notificación
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  // Simular nuevas notificaciones periódicamente (solo para demo)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% de probabilidad cada 30 segundos
        const types: Array<Notification['type']> = ['message', 'favorite', 'product'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const messages = {
          message: 'Tienes un nuevo mensaje',
          favorite: 'Alguien agregó tu producto a favoritos',
          product: 'Tu producto recibió una nueva consulta'
        };

        addNotification({
          type: randomType,
          title: 'Nueva actividad',
          message: messages[randomType]
        });
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    permission,
    requestPermission,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification
  };
};
