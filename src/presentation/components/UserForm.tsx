// Componente de formulario para crear usuarios
import React, { useState } from 'react';
import { useCreateUser } from '../hooks/useCreateUser';

interface UserFormProps {
  onSuccess?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  // Estado local del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Usar el hook personalizado que utiliza el caso de uso de dominio
  const { createUser, loading, error } = useCreateUser();

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createUser({ name, email });
      
      // Limpiar el formulario
      setName('');
      setEmail('');
      
      // Llamar al callback de éxito si existe
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // El error ya se maneja en el hook useCreateUser
      console.error('Error en el formulario:', err);
    }
  };

  return (
    <div className="user-form">
      <h2>Crear Usuario</h2>
      
      {error && (
        <div className="error-message">
          {error.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
}; 