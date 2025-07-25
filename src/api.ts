
import { toast } from 'sonner';

const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'http://localhost:3002/api/v3';

interface RequestOptions extends RequestInit {
  data?: any;
  skipGlobalErrorHandling?: boolean; // Nueva opción para omitir el manejo global de errores
}

interface ApiError {
  message: string;
  type?: string;
  statusCode: number;
  data?: any;
}

// Función global para manejar errores
const handleGlobalError = (error: ApiError) => {
  // Manejar específicamente errores 429 (Too Many Requests)
  if (error.statusCode === 429) {
    toast.error('Demasiadas solicitudes', {
      description: 'Has realizado demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.',
      duration: 5000,
      action: {
        label: 'Entendido',
        onClick: () => {}
      }
    });
    return;
  }

  // Manejar otros tipos de errores comunes si es necesario
  switch (error.statusCode) {
    case 401:
      toast.error('No autorizado', {
        description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        duration: 4000
      });
      break;
    case 403:
      toast.error('Acceso denegado', {
        description: 'No tienes permisos para realizar esta acción.',
        duration: 4000
      });
      break;
    case 500:
      toast.error('Error del servidor', {
        description: 'Ha ocurrido un error interno del servidor. Por favor, inténtalo más tarde.',
        duration: 4000
      });
      break;
    case 0:
      toast.error('Error de conexión', {
        description: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        duration: 4000
      });
      break;
    // No manejamos otros errores globalmente para permitir manejo específico en los componentes
  }
};

const fetchWithAuth = async (url: string, options: RequestOptions = {}) => {
  const { data, skipGlobalErrorHandling, ...fetchOptions } = options;
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  // Agregar log para depuración
  // console.log('HEADERS ENVIADOS:', headers);

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...fetchOptions,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    // Para endpoints que no devuelven JSON (como DELETE)
    const contentType = response.headers.get('content-type');
    const responseData = contentType?.includes('application/json') 
      ? await response.json()
      : null;

    if (!response.ok) {
      const apiError: ApiError = {
        message: (responseData && responseData.message) || `Error del servidor: ${response.status}`,
        type: responseData?.type,
        statusCode: response.status,
        data: responseData?.data
      };

      // Manejar el error globalmente a menos que se especifique lo contrario
      if (!skipGlobalErrorHandling) {
        handleGlobalError(apiError);
      }

      throw apiError;
    }

    return responseData;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const connectionError: ApiError = {
        message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
        statusCode: 0,
      };

      // Manejar el error globalmente a menos que se especifique lo contrario
      if (!skipGlobalErrorHandling) {
        handleGlobalError(connectionError);
      }

      throw connectionError;
    }
    throw error;
  }
};

export const api = {
  get: (url: string, options?: RequestOptions) => 
    fetchWithAuth(url, { ...options, method: 'GET' }),
  
  post: (url: string, data?: any, options?: RequestOptions) => 
    fetchWithAuth(url, { ...options, method: 'POST', data }),
  
  put: (url: string, data?: any, options?: RequestOptions) => 
    fetchWithAuth(url, { ...options, method: 'PUT', data }),
  
  patch: (url: string, data?: any, options?: RequestOptions) => 
    fetchWithAuth(url, { ...options, method: 'PATCH', data }),
  
  delete: (url: string, options?: RequestOptions) => 
    fetchWithAuth(url, { ...options, method: 'DELETE' }),
  
  createProductWithImages: async (productData: any, images: File[], skipGlobalErrorHandling?: boolean) => {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    
    // Agregar datos del producto
    formData.append('productData', JSON.stringify(productData));
    
    // Agregar imágenes
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });
    
    try {
      const response = await fetch(`${BASE_URL}/products/with-images`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });
      
      const contentType = response.headers.get('content-type');
      const responseData = contentType?.includes('application/json') 
        ? await response.json()
        : null;
      
      if (!response.ok) {
        const apiError: ApiError = {
          message: (responseData && responseData.message) || `Error del servidor: ${response.status}`,
          type: responseData?.type,
          statusCode: response.status,
          data: responseData?.data
        };

        // Manejar el error globalmente a menos que se especifique lo contrario
        if (!skipGlobalErrorHandling) {
          handleGlobalError(apiError);
        }

        throw apiError;
      }
      
      return responseData;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        const connectionError: ApiError = {
          message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
          statusCode: 0,
        };

        // Manejar el error globalmente a menos que se especifique lo contrario
        if (!skipGlobalErrorHandling) {
          handleGlobalError(connectionError);
        }

        throw connectionError;
      }
      throw error;
    }
  },
  
  uploadFile: async (url: string, file: File, fieldName: string = 'file', additionalData?: Record<string, any>, skipGlobalErrorHandling?: boolean) => {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    
    formData.append(fieldName, file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
    }
    
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // No establecemos Content-Type aquí porque fetch lo establece automáticamente con el boundary correcto para FormData
        },
        body: formData,
      });
      
      const contentType = response.headers.get('content-type');
      const responseData = contentType?.includes('application/json') 
        ? await response.json()
        : null;
      
      if (!response.ok) {
        const apiError: ApiError = {
          message: (responseData && responseData.message) || `Error del servidor: ${response.status}`,
          type: responseData?.type,
          statusCode: response.status,
          data: responseData?.data
        };

        // Manejar el error globalmente a menos que se especifique lo contrario
        if (!skipGlobalErrorHandling) {
          handleGlobalError(apiError);
        }

        throw apiError;
      }
      
      return responseData;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        const connectionError: ApiError = {
          message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
          statusCode: 0,
        };

        // Manejar el error globalmente a menos que se especifique lo contrario
        if (!skipGlobalErrorHandling) {
          handleGlobalError(connectionError);
        }

        throw connectionError;
      }
      throw error;
    }
  }
};
