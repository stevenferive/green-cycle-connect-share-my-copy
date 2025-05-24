// Servicio de almacenamiento local en la capa de infraestructura
// Esta clase implementa métodos para acceder al localStorage del navegador

export class LocalStorageService {
  // Guardar un valor en localStorage
  static save<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  // Obtener un valor desde localStorage
  static get<T>(key: string): T | null {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error('Error al recuperar de localStorage:', error);
      return null;
    }
  }

  // Eliminar un valor de localStorage
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
    }
  }

  // Limpiar todo el localStorage
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }

  // Comprobar si existe una clave en localStorage
  static exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
} 