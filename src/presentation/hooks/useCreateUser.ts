// Hook personalizado para utilizar el caso de uso de creación de usuarios
import { useState } from 'react';
import { User } from '../../core/domain/entities/User';
import { CreateUserDTO } from '../../core/domain/usecases/CreateUserUseCase';
import { createUserUseCase } from '../../di/container';
import { NotificationService } from '../../infrastructure/services/NotificationService';

interface CreateUserState {
  loading: boolean;
  error: Error | null;
  createdUser: User | null;
}

export const useCreateUser = () => {
  const [state, setState] = useState<CreateUserState>({
    loading: false,
    error: null,
    createdUser: null
  });

  const createUser = async (userData: CreateUserDTO) => {
    try {
      // Indicar que estamos cargando
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Utilizar el caso de uso del dominio
      const newUser = await createUserUseCase.execute(userData);
      
      // Actualizar el estado con el resultado
      setState({
        loading: false,
        error: null,
        createdUser: newUser
      });
      
      // Mostrar notificación de éxito
      NotificationService.success('Usuario creado correctamente');
      
      return newUser;
    } catch (err) {
      // Manejar el error
      const error = err instanceof Error ? err : new Error('Error al crear el usuario');
      
      setState({
        loading: false,
        error,
        createdUser: null
      });
      
      // Mostrar notificación de error
      NotificationService.error(error.message);
      
      throw error;
    }
  };

  const reset = () => {
    setState({
      loading: false,
      error: null,
      createdUser: null
    });
  };

  return {
    createUser,
    reset,
    loading: state.loading,
    error: state.error,
    createdUser: state.createdUser
  };
}; 