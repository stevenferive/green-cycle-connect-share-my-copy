// Servicio de notificaciones en la capa de infraestructura
// Este servicio gestiona las notificaciones en la aplicación

// Tipos de notificación
export enum NotificationType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

// Interfaz para las opciones de notificación
export interface NotificationOptions {
  title?: string;
  message: string;
  type: NotificationType;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

// Clase del servicio
export class NotificationService {
  // Método principal para mostrar notificaciones
  static show(options: NotificationOptions): void {
    // Esta implementación podría conectar con un sistema de notificaciones real como toast
    console.log(`[${options.type.toUpperCase()}] ${options.title || ''}: ${options.message}`);
    
    // Aquí se podría integrar una biblioteca real (toast, alertas, etc.)
    const defaultOptions = {
      duration: 3000,
      position: 'top-right'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Ejemplo de cómo podría integrarse con una biblioteca de toast
    // toast({
    //   title: mergedOptions.title,
    //   description: mergedOptions.message,
    //   status: mergedOptions.type,
    //   duration: mergedOptions.duration,
    //   position: mergedOptions.position,
    // });
  }
  
  // Métodos de utilidad para diferentes tipos de notificaciones
  static success(message: string, title?: string): void {
    this.show({
      title,
      message,
      type: NotificationType.SUCCESS
    });
  }
  
  static info(message: string, title?: string): void {
    this.show({
      title,
      message,
      type: NotificationType.INFO
    });
  }
  
  static warning(message: string, title?: string): void {
    this.show({
      title,
      message,
      type: NotificationType.WARNING
    });
  }
  
  static error(message: string, title?: string): void {
    this.show({
      title,
      message,
      type: NotificationType.ERROR
    });
  }
} 