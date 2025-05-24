// Store para gestionar el estado global del usuario
import { create } from 'zustand';
import { User } from '../../core/domain/entities/User';
import { getUserUseCase } from '../../di/container';

// Definir interfaces para el estado y acciones
interface UserState {
  // Estado
  user: User | null;
  loading: boolean;
  error: Error | null;
  
  // Acciones
  fetchUser: (userId: string) => Promise<void>;
  clearUser: () => void;
}

// Crear store con Zustand
export const useUserStore = create<UserState>((set) => ({
  // Estado inicial
  user: null,
  loading: false,
  error: null,
  
  // Acción para obtener un usuario
  fetchUser: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      
      // Utilizamos el caso de uso del dominio
      const user = await getUserUseCase.execute(userId);
      
      set({ user, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Error desconocido'), 
        loading: false 
      });
    }
  },
  
  // Acción para limpiar el usuario
  clearUser: () => {
    set({ user: null });
  }
})); 