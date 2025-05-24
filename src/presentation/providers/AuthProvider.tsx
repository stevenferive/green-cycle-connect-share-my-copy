// Proveedor de autenticación en la capa de presentación
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../../core/domain/entities/User';
// Importaríamos el caso de uso correspondiente del dominio
// import { LoginUseCase } from '../../core/domain/usecases/LoginUseCase';

// Definir el tipo de datos del contexto
interface AuthContextProps {
  currentUser: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Proveedor de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Comprobar si hay un usuario autenticado al cargar
  useEffect(() => {
    // Aquí utilizaríamos un caso de uso para comprobar si hay una sesión activa
    // Por ahora simplemente simulamos la carga y dejamos sin usuario
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Simulación de verificación de autenticación
        setTimeout(() => {
          setCurrentUser(null);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'));
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Aquí utilizaríamos el caso de uso de inicio de sesión
      // Por ahora, simulamos una respuesta
      // Ejemplo: const user = await loginUseCase.execute(email, password);
      
      setTimeout(() => {
        // Usuario simulado
        const mockUser = new User('1', 'Usuario Demo', email, new Date());
        setCurrentUser(mockUser);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al iniciar sesión'));
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Aquí utilizaríamos el caso de uso para cerrar sesión
      // Por ahora, simplemente limpiamos el estado
      
      setCurrentUser(null);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cerrar sesión'));
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para acceder al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
}; 