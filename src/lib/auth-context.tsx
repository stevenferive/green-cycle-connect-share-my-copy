
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, getCurrentUser, login, logout, register, UserCredentials } from './auth-service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (userData: UserCredentials) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la aplicación
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const result = await login(credentials);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error('Error en handleLogin:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al iniciar sesión' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: UserCredentials) => {
    setIsLoading(true);
    try {
      const result = await register(userData);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      console.error('Error en handleRegister:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al registrar usuario' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
