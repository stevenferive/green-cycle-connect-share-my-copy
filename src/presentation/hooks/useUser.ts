// Hook personalizado en la capa de presentación
import { useState, useEffect } from 'react';
import { User } from '../../core/domain/entities/User';
import { getUserUseCase } from '../../di/container';

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Utilizamos el caso de uso del dominio
        const userResult = await getUserUseCase.execute(userId);
        setUser(userResult);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [userId]);

  return { user, loading, error };
}; 