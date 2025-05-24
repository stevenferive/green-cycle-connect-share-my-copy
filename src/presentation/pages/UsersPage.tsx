// Página para listar usuarios
import React, { useEffect, useState } from 'react';
import { User } from '../../core/domain/entities/User';
import { Link, useNavigate } from 'react-router-dom';
import { getDependencies } from '../../di/container';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const navigate = useNavigate();
  
  // Obtener el repositorio desde el contenedor de dependencias
  const { userRepository } = getDependencies();
  
  // Cargar la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener usuarios desde el repositorio
        const usersList = await userRepository.getUsers();
        setUsers(usersList);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error al cargar usuarios'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [userRepository]);
  
  // Función para eliminar un usuario
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await userRepository.deleteUser(userId);
        // Actualizar la lista filtrando el usuario eliminado
        setUsers(prevUsers => prevUsers.filter(user => user.getId() !== userId));
      } catch (err) {
        alert('Error al eliminar el usuario');
        console.error(err);
      }
    }
  };
  
  return (
    <div className="users-page">
      <h1>Lista de Usuarios</h1>
      
      <div className="actions">
        <button 
          className="add-button"
          onClick={() => navigate('/users/create')}
        >
          Crear Nuevo Usuario
        </button>
      </div>
      
      {loading && <div className="loading">Cargando usuarios...</div>}
      
      {error && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}
      
      {!loading && !error && users.length === 0 && (
        <div className="empty-state">
          No hay usuarios registrados. ¡Crea uno nuevo!
        </div>
      )}
      
      {users.length > 0 && (
        <div className="users-list">
          {users.map(user => (
            <div key={user.getId()} className="user-card">
              <h3>{user.getName()}</h3>
              <p>{user.getEmail()}</p>
              <p>Creado: {user.getCreatedAt().toLocaleDateString()}</p>
              
              <div className="user-actions">
                <Link to={`/users/${user.getId()}`} className="view-button">
                  Ver Detalle
                </Link>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteUser(user.getId())}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 