// Interfaces para tipado
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000';

// Función auxiliar para manejar respuestas de la API
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Función para validar datos de registro
const validateRegistrationData = (credentials: UserCredentials): { isValid: boolean; message?: string } => {
  if (!credentials.firstName || credentials.firstName.length < 2) {
    return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  if (!credentials.lastName || credentials.lastName.length < 2) {
    return { isValid: false, message: 'El apellido debe tener al menos 2 caracteres' };
  }
  
  if (!credentials.email || !credentials.email.includes('@')) {
    return { isValid: false, message: 'Ingresa un email válido' };
  }
  
  if (!credentials.password || credentials.password.length < 8) {
    return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  
  return { isValid: true };
};

// Función para registrar un nuevo usuario
export const register = async (credentials: UserCredentials): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    // Validar datos antes de enviar
    const validation = validateRegistrationData(credentials);
    if (!validation.isValid) {
      return { success: false, message: validation.message };
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        password: credentials.password
      }),
    });

    const data: LoginResponse = await handleApiResponse(response);
    
    // Guardar token en localStorage
    localStorage.setItem('greencycle_token', data.token);
    localStorage.setItem('greencycle_current_user', JSON.stringify(data.user));
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejar errores específicos del backend
    let errorMessage = 'Error al registrar usuario';
    if (error instanceof Error) {
      if (error.message.includes('409') || error.message.toLowerCase().includes('conflict')) {
        errorMessage = 'Este email ya está registrado';
      } else if (error.message.includes('400') || error.message.toLowerCase().includes('bad request')) {
        errorMessage = 'Datos inválidos. Verifica la información ingresada';
      } else {
        errorMessage = error.message;
      }
    }
    
    return { success: false, message: errorMessage };
  }
};

// Función para iniciar sesión
export const login = async (credentials: { email: string; password: string }): Promise<{ success: boolean; message?: string; user?: User }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data: LoginResponse = await handleApiResponse(response);
    
    // Guardar token y usuario en localStorage
    localStorage.setItem('greencycle_token', data.token);
    localStorage.setItem('greencycle_current_user', JSON.stringify(data.user));
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error en login:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Credenciales inválidas' 
    };
  }
};

// Función para verificar si hay una sesión activa
export const getCurrentUser = (): User | null => {
  try {
    const token = localStorage.getItem('greencycle_token');
    const currentUserJson = localStorage.getItem('greencycle_current_user');
    
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
  return localStorage.getItem('greencycle_token');
};

// Función para cerrar sesión
export const logout = (): void => {
  localStorage.removeItem('greencycle_token');
  localStorage.removeItem('greencycle_current_user');
};

// Función para hacer peticiones autenticadas
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};
