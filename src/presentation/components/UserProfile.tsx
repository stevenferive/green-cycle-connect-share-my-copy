import React from 'react';
import { useUser } from '../hooks/useUser';

interface UserProfileProps {
  userId: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { user, loading, error } = useUser(userId);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>Usuario no encontrado</div>;
  }

  return (
    <div className="user-profile">
      <h2>{user.getName()}</h2>
      <p>Email: {user.getEmail()}</p>
      <p>Miembro desde: {user.getCreatedAt().toLocaleDateString()}</p>
      
      {/* Validación proveniente de la lógica de dominio */}
      {!user.isValidEmail() && (
        <div className="warning">
          El email del usuario parece no ser válido
        </div>
      )}
    </div>
  );
}; 