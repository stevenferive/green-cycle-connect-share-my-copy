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
  },

  createProductWithImages: async (productData: any, images: File[]) => {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    
    // Agregar cada campo del producto al FormData
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    // Agregar las imágenes
    images.forEach(image => {
      formData.append('images', image);
    });
    
    try {
      const response = await fetch(`${BASE_URL}/products/with-images`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // No establecemos Content-Type para FormData
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

export const cartApi = {
  // Agregar producto al carrito
  addToCart: async (productId: string, quantity: number = 1) => {
    return api.post('/cart/add', { productId, quantity });
  },

  // Obtener carrito del usuario
  getCart: async () => {
    return api.get('/cart');
  },

  // Actualizar cantidad de un item - PATCH /cart/item/:productId
  updateCartItem: async (productId: string, quantity: number) => {
    return api.patch(`/cart/item/${productId}`, { quantity });
  },

  // Eliminar item del carrito - DELETE /cart/item/:productId
  removeFromCart: async (productId: string) => {
    return api.delete(`/cart/item/${productId}`);
  },

  // Procesar checkout
  checkout: async (checkoutData: {
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    notes: string;
  }) => {
    return api.post('/cart/checkout', checkoutData);
  }
};

export const orderApi = {
  // Obtener órdenes pendientes del vendedor
  getPendingOrders: async () => {
    return api.get('/orders/seller/pending');
  },

  // Obtener todas las órdenes del vendedor
  getSellerOrders: async (status?: string) => {
    const url = status ? `/orders/seller/all?status=${status}` : '/orders/seller/all';
    // console.log('🔍 Llamando a:', url);
    // console.log('🔑 Token disponible:', !!localStorage.getItem('auth_token'));
    return api.get(url);
  },

  // Aprobar orden
  approveOrder: async (orderId: string) => {
    return api.patch(`/orders/${orderId}/approve`);
  },

  // Rechazar orden
  rejectOrder: async (orderId: string, reason?: string) => {
    return api.patch(`/orders/${orderId}/reject`, { reason });
  },

  // Obtener todas las órdenes del comprador
  getBuyerOrders: async (status?: string) => {
    const url = status ? `/orders/buyer/all?status=${status}` : '/orders/buyer/all';
    // console.log('🔍 Llamando a:', url);
    // console.log('🔑 Token disponible:', !!localStorage.getItem('auth_token'));
    return api.get(url);
  },

  // Obtener una orden específica
  getOrder: async (orderId: string) => {
    return api.get(`/orders/${orderId}`);
  },

  // Confirmar recepción de la orden (marcar como entregado)
  confirmDelivery: async (orderId: string) => {
    return api.patch(`/orders/${orderId}/delivered`);
  },

  // Cancelar orden
  cancelOrder: async (orderId: string, reason?: string) => {
    return api.patch(`/orders/${orderId}/cancel`, { reason });
  }
};

export const chatApi = {
  // Verificar si existe un chat directo entre dos usuarios
  getDirectChat: async (user1Id: string, user2Id: string) => {
    return api.get(`/chats/direct?user1Id=${user1Id}&user2Id=${user2Id}`);
  },

  // Crear un nuevo chat
  createChat: async (chatData: {
    type: 'direct' | 'group';
    participants: string[];
    relatedProduct?: string;
    title?: string;
  }) => {
    return api.post('/chats', chatData);
  },

  // Obtener todos los chats del usuario
  getUserChats: async (userId: string) => {
    return api.get(`/chats/user/${userId}`);
  },

  // Crear o obtener chat directo (flujo combinado)
  createOrGetDirectChat: async (otherUserId: string, relatedProduct?: string, orderNumber?: string) => {
    // Función helper para obtener el ID del usuario actual
    const getCurrentUserId = (): string | null => {
      try {
        const currentUserJson = localStorage.getItem('current_user');
        if (!currentUserJson) return null;
        const user = JSON.parse(currentUserJson);
        return user.id || null;
      } catch (error) {
        console.error('Error al obtener ID de usuario actual:', error);
        return null;
      }
    };

    try {
      // Intentar obtener chat existente primero
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        throw new Error('Usuario no autenticado');
      }

      const existingChat = await chatApi.getDirectChat(currentUserId, otherUserId);
      
      if (existingChat && existingChat._id) {
        return existingChat;
      }
    } catch (error) {
      // Si no existe el chat o hay error, crear uno nuevo
      console.log('Chat no existe, creando uno nuevo...');
    }

    // Crear nuevo chat
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      throw new Error('Usuario no autenticado');
    }

    const chatData = {
      type: 'direct' as const,
      participants: [currentUserId, otherUserId],
      ...(relatedProduct && { relatedProduct }),
      ...(orderNumber && { title: `Chat sobre orden ${orderNumber}` })
    };

    return chatApi.createChat(chatData);
  }
}; 