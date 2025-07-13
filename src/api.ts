
const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'http://localhost:3002/api/v3';

interface RequestOptions extends RequestInit {
  data?: any;
}

interface ApiError {
  message: string;
  type?: string;
  statusCode: number;
  data?: any;
}

const fetchWithAuth = async (url: string, options: RequestOptions = {}) => {
  const { data, ...fetchOptions } = options;
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  // Agregar log para depuración
  console.log('HEADERS ENVIADOS:', headers);

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
      throw {
        message: (responseData && responseData.message) || `Error del servidor: ${response.status}`,
        type: responseData?.type,
        statusCode: response.status,
        data: responseData?.data
      } as ApiError;
    }

    return responseData;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw {
        message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
        statusCode: 0,
      } as ApiError;
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
  
  createProductWithImages: async (productData: any, images: File[]) => {
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
        throw {
          message: (responseData && responseData.message) || `Error del servidor: ${response.status}`,
          type: responseData?.type,
          statusCode: response.status,
          data: responseData?.data
        } as ApiError;
      }
      
      return responseData;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw {
          message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
          statusCode: 0,
        } as ApiError;
      }
      throw error;
    }
  },
  
  uploadFile: async (url: string, file: File, fieldName: string = 'file', additionalData?: Record<string, any>) => {
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
        throw {
          message: (responseData && responseData.message) || `Error del servidor: ${response.status}`,
          type: responseData?.type,
          statusCode: response.status,
          data: responseData?.data
        } as ApiError;
      }
      
      return responseData;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw {
          message: 'Error de conexión. Por favor, verifica tu conexión a internet.',
          statusCode: 0,
        } as ApiError;
      }
      throw error;
    }
  }
};
