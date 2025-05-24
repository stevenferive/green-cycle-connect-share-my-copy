// Página para crear usuarios
import React from 'react';
import { UserForm } from '../components/UserForm';
import { useNavigate } from 'react-router-dom';

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Función para redirigir al usuario a la lista de usuarios cuando se crea con éxito
  const handleSuccess = () => {
    navigate('/users');
  };
  
  return (
    <div className="create-user-page">
      <h1>Crear Nuevo Usuario</h1>
      <p>Completa el formulario para crear un nuevo usuario en el sistema</p>
      
      <UserForm onSuccess={handleSuccess} />
      
      <div className="actions">
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    </div>
  );
}; 