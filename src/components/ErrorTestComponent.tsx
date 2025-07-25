import React from 'react';
import { api } from '@/api';
import { Button } from '@/components/ui/button';

// ⚠️ COMPONENTE TEMPORAL PARA PRUEBAS - ELIMINAR DESPUÉS DE VERIFICAR
const ErrorTestComponent: React.FC = () => {
  
  // Simular un error 429 para probar el sistema
  const testError429 = async () => {
    try {
      // Forzamos un error 429 haciendo una llamada a un endpoint que devuelva este error
      // En un caso real, esto sucedería cuando el servidor devuelva un 429
      const fakeError = {
        message: 'Too Many Requests',
        statusCode: 429,
        type: 'RATE_LIMIT_EXCEEDED'
      };
      
      // Simulamos el error directamente para pruebas
      throw fakeError;
      
    } catch (error) {
      console.log('Error capturado en el componente:', error);
    }
  };

  // Hacer una llamada real que podría generar un 429
  const testRealAPI = async () => {
    try {
      // Esta llamada manejará automáticamente cualquier error 429 del servidor
      const response = await api.get('/products');
      console.log('Respuesta exitosa:', response);
    } catch (error) {
      console.log('Error en llamada real:', error);
    }
  };

  // Hacer una llamada con manejo específico (sin toast automático)
  const testSkipGlobalHandling = async () => {
    try {
      const response = await api.get('/products', { 
        skipGlobalErrorHandling: true 
      });
      console.log('Respuesta exitosa (sin manejo global):', response);
    } catch (error: any) {
      if (error.statusCode === 429) {
        alert('Error 429 manejado específicamente en el componente');
      } else {
        console.log('Otro tipo de error:', error);
      }
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
      <h3 className="text-lg font-semibold mb-4 text-yellow-800">
        🧪 Componente de Prueba - Manejo de Errores
      </h3>
      <p className="text-sm text-yellow-700 mb-4">
        Este componente es solo para pruebas. Eliminar después de verificar que funciona.
      </p>
      
      <div className="space-y-2">
        <Button 
          onClick={testError429}
          variant="outline"
          className="w-full"
        >
          🧪 Simular Error 429 (Toast Automático)
        </Button>
        
        <Button 
          onClick={testRealAPI}
          variant="outline"
          className="w-full"
        >
          📡 Llamada Real a API
        </Button>
        
        <Button 
          onClick={testSkipGlobalHandling}
          variant="outline"
          className="w-full"
        >
          🔧 Manejo Específico (Sin Toast Global)
        </Button>
      </div>

      <div className="mt-4 text-xs text-yellow-600">
        <p><strong>Errores manejados globalmente:</strong></p>
        <ul className="list-disc list-inside">
          <li>429: Too Many Requests (5 segundos)</li>
          <li>401: Unauthorized (4 segundos)</li>
          <li>403: Forbidden (4 segundos)</li>
          <li>500: Server Error (4 segundos)</li>
          <li>0: Connection Error (4 segundos)</li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorTestComponent; 