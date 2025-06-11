import { api } from '../../api';

// Interfaces para tipado
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  city?: string;
  country?: string;
  description?: string;
  avatar?: string;
  ecoInterests?: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

export interface UserCredentials {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Nueva interfaz para datos de actualización de perfil
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatar?: string;
  city?: string;
  country?: string;
  description?: string;
  ecoInterests?: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
}

// Función para registrar un nuevo usuario
export const register = async (credentials: UserCredentials): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    const data = await api.post('/auth/register', credentials);
    
    // Guardar token en localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('current_user', JSON.stringify(data.user));
    
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error en registro:', error);
    return { 
      success: false, 
      message: error.message || 'Error al registrar usuario'
    };
  }
};

// Función para iniciar sesión
export const login = async (credentials: { email: string; password: string }): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    // Usuario de prueba
    if (credentials.email === 'prueba02@gmail.com' && credentials.password === 'Prueba02') {
      const mockUser: User = {
        id: '1',
        firstName: 'Ares',
        lastName: 'Prueba',
        email: 'prueba02@gmail.com',
        role: 'user',
        city: 'Ciudad de Prueba',
        country: 'País de Prueba',
        description: 'Usuario de prueba',
        ecoInterests: ['reciclaje', 'sostenibilidad'],
        socialLinks: {
          instagram: 'https://instagram.com/prueba',
          facebook: 'https://facebook.com/prueba',
          twitter: 'https://twitter.com/prueba',
          website: 'https://prueba.com'
        }
      };
      
      // Crear un token mock
      const mockToken = 'mock_token_' + Math.random().toString(36).substring(7);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('current_user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    }

    const data = await api.post('/auth/login', credentials);
    
    // Guardar token y usuario en localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('current_user', JSON.stringify(data.user));
    
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error en login:', error);
    return { 
      success: false, 
      message: error.message || 'Credenciales inválidas'
    };
  }
};

// Función para obtener el perfil del usuario actual
export const getUserProfile = async (): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    const user = await api.get('/user/profile/me');
    
    // Actualizar usuario en localStorage
    localStorage.setItem('current_user', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Error al obtener perfil:', error);
    return { 
      success: false, 
      message: error.message || 'Error al obtener perfil del usuario'
    };
  }
};

// Función para actualizar el perfil del usuario
export const updateUserProfile = async (profileData: UpdateProfileData): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    // Validaciones básicas
    if (profileData.firstName && profileData.firstName.length < 2) {
      return { success: false, message: 'El nombre debe tener al menos 2 caracteres' };
    }
    
    if (profileData.lastName && profileData.lastName.length < 2) {
      return { success: false, message: 'El apellido debe tener al menos 2 caracteres' };
    }
    
    if (profileData.email && !profileData.email.includes('@')) {
      return { success: false, message: 'Ingresa un email válido' };
    }
    
    if (profileData.password && profileData.password.length < 8) {
      return { success: false, message: 'La contraseña debe tener al menos 8 caracteres' };
    }

    const updatedUser = await api.patch('/user/profile/me', profileData);
    
    // Actualizar usuario en localStorage
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error('Error al actualizar perfil:', error);
    return { 
      success: false, 
      message: error.message || 'Error al actualizar perfil'
    };
  }
};

// Función para eliminar la cuenta del usuario
export const deleteUserAccount = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    await api.delete('/user/profile/me');
    
    // Limpiar datos del usuario después de eliminar la cuenta
    logout();
    
    return { success: true };
  } catch (error: any) {
    console.error('Error al eliminar cuenta:', error);
    return { 
      success: false, 
      message: error.message || 'Error al eliminar la cuenta'
    };
  }
};

// Función para verificar si hay una sesión activa
export const getCurrentUser = (): User | null => {
  try {
    const token = localStorage.getItem('auth_token');
    const currentUserJson = localStorage.getItem('current_user');
    
    if (!token || !currentUserJson) {
      return null;
    }
    
    // Verificar si el token ha expirado (básico)
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (tokenPayload.exp && tokenPayload.exp < currentTime) {
      // Token expirado, limpiar storage
      logout();
      return null;
    }
    
    return JSON.parse(currentUserJson);
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    logout(); // Limpiar storage en caso de error
    return null;
  }
};

// Función para obtener el token
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Función para cerrar sesión
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
};

console.log('Token:', localStorage.getItem('auth_token'));
