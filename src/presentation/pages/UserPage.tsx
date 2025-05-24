// Página en la capa de presentación
import React from 'react';
import { UserProfile } from '../components/UserProfile';
import { useParams } from 'react-router-dom';

export const UserPage: React.FC = () => {
  // En una aplicación real, obtendrías el ID del usuario de la URL
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    return <div>ID de usuario no proporcionado</div>;
  }

  return (
    <div className="user-page">
      <h1>Perfil de Usuario</h1>
      <UserProfile userId={userId} />
    </div>
  );
}; 