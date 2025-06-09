
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Package, 
  AlertTriangle, 
  Clock, 
  Star,
  Trash2,
  Check,
  Leaf
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Notification } from '@/pages/Notifications';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete
}) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'order':
        return <Package className="h-5 w-5 text-green" />;
      case 'stock':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'exchange':
        return <Clock className="h-5 w-5 text-purple-500" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return 'Mensaje';
      case 'order':
        return 'Pedido';
      case 'stock':
        return 'Stock';
      case 'exchange':
        return 'Intercambio';
      case 'review':
        return 'Valoración';
      default:
        return 'Notificación';
    }
  };

  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: es 
    });
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-green" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Estás al día 🌿
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            No tienes notificaciones nuevas por ahora. ¡Sigue participando en la comunidad ecológica!
          </p>
        </div>
      </div>
    );
  }

  // Agrupar notificaciones por fecha
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const today = new Date();
    const notificationDate = notification.timestamp;
    const diffTime = today.getTime() - notificationDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let dateGroup: string;
    if (diffDays === 0) {
      dateGroup = 'Hoy';
    } else if (diffDays === 1) {
      dateGroup = 'Ayer';
    } else if (diffDays < 7) {
      dateGroup = 'Esta semana';
    } else {
      dateGroup = 'Anteriores';
    }

    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
        <div key={dateGroup}>
          <h3 className="text-lg font-semibold mb-3 text-foreground">
            {dateGroup}
          </h3>
          <div className="space-y-3">
            {groupNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-green bg-green-50/30' : ''
                } ${
                  notification.isImportant ? 'ring-2 ring-orange-200 bg-orange-50/20' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-lg flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground line-clamp-1">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-green rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                          >
                            {getNotificationTypeLabel(notification.type)}
                          </Badge>
                          {notification.isImportant && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              Importante
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {notification.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(notification.timestamp)}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => onMarkAsRead(notification.id)}
                              className="text-green hover:text-green-dark hover:bg-green-light/10"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Marcar como leída
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => onDelete(notification.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;
