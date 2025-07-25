// =====================================================================
// EJEMPLOS DE USO DEL SISTEMA DE MANEJO GLOBAL DE ERRORES
// =====================================================================

import { api } from '@/api';

// =====================================================================
// 1. USO NORMAL (MANEJO GLOBAL AUTOMÁTICO DE ERRORES)
// =====================================================================

// Cuando hagas una llamada normal a la API, cualquier error con código 429
// se manejará automáticamente y mostrará un toast al usuario.
// Esto incluye otros errores comunes como 401, 403, 500, etc.

export const ejemploUsoNormal = async () => {
  try {
    // Esta llamada manejará automáticamente los errores 429 con un toast
    const productos = await api.get('/products');
    return productos;
  } catch (error) {
    // Aquí solo llegarán errores que NO fueron manejados globalmente
    // o errores específicos que quieras manejar de forma particular
    console.log('Error específico no manejado globalmente:', error);
  }
};

// =====================================================================
// 2. OMITIR EL MANEJO GLOBAL (PARA CASOS ESPECÍFICOS)
// =====================================================================

// Si necesitas manejar un error de forma específica en lugar del toast global,
// puedes usar la opción skipGlobalErrorHandling

export const ejemploManejoEspecifico = async () => {
  try {
    // Esta llamada NO mostrará toasts automáticos
    const usuarios = await api.get('/users', { 
      skipGlobalErrorHandling: true 
    });
    return usuarios;
  } catch (error: any) {
    // Aquí puedes manejar TODOS los errores de forma personalizada
    if (error.statusCode === 429) {
      // Manejo personalizado para error 429
      alert('Demasiadas solicitudes - manejo personalizado');
    } else if (error.statusCode === 404) {
      // Manejo personalizado para error 404
      console.log('Usuario no encontrado');
    }
  }
};

// =====================================================================
// 3. EJEMPLOS CON DIFERENTES MÉTODOS HTTP
// =====================================================================

export const ejemplosMetodosHTTP = {
  // GET con manejo global automático
  obtenerProducto: async (id: string) => {
    return await api.get(`/products/${id}`);
  },

  // POST con manejo global automático
  crearProducto: async (producto: any) => {
    return await api.post('/products', producto);
  },

  // PUT con manejo específico
  actualizarProducto: async (id: string, producto: any) => {
    try {
      return await api.put(`/products/${id}`, producto, {
        skipGlobalErrorHandling: true
      });
    } catch (error: any) {
      if (error.statusCode === 429) {
        // Manejo específico para este endpoint
        console.log('Actualizando demasiado rápido');
      }
      throw error; // Re-lanzar para que el componente pueda manejarlo
    }
  },

  // DELETE con manejo global automático
  eliminarProducto: async (id: string) => {
    return await api.delete(`/products/${id}`);
  }
};

// =====================================================================
// 4. EJEMPLO CON UPLOAD DE ARCHIVOS
// =====================================================================

export const ejemploUploadArchivo = async (archivo: File) => {
  try {
    // Los uploads también manejan automáticamente errores 429
    const resultado = await api.uploadFile('/upload', archivo);
    return resultado;
  } catch (error) {
    // Solo errores no manejados globalmente llegarán aquí
    console.log('Error específico en upload:', error);
  }
};

// =====================================================================
// 5. EJEMPLO DE USO EN COMPONENTES REACT
// =====================================================================

/*
// En un componente React:
import { api } from '@/api';
import { useState } from 'react';

const MiComponente = () => {
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      // Error 429 se maneja automáticamente con toast
      const data = await api.get('/products');
      setProductos(data);
    } catch (error) {
      // Solo errores específicos que necesites manejar
      console.log('Error específico:', error);
    } finally {
      setLoading(false);
    }
  };

  const manejarErrorEspecifico = async () => {
    try {
      // Manejo personalizado sin toast automático
      await api.post('/special-endpoint', {}, { 
        skipGlobalErrorHandling: true 
      });
    } catch (error: any) {
      if (error.statusCode === 429) {
        // Tu manejo personalizado aquí
        alert('Mensaje personalizado para 429');
      }
    }
  };

  return (
    <div>
      <button onClick={cargarProductos}>
        Cargar Productos (Con manejo global)
      </button>
      <button onClick={manejarErrorEspecifico}>
        Acción con manejo específico
      </button>
    </div>
  );
};
*/

// =====================================================================
// TIPOS DE ERRORES MANEJADOS AUTOMÁTICAMENTE:
// =====================================================================

/*
- 429: Too Many Requests - Toast con mensaje específico y duración de 5 segundos
- 401: Unauthorized - Toast indicando que la sesión expiró
- 403: Forbidden - Toast indicando acceso denegado
- 500: Internal Server Error - Toast de error del servidor
- 0: Connection Error - Toast de error de conexión

ERRORES NO MANEJADOS GLOBALMENTE:
- 404: Not Found - Generalmente estos requieren manejo específico
- 400: Bad Request - Requieren manejo específico según el contexto
- Otros códigos de error - Se pueden manejar específicamente en cada caso
*/ 