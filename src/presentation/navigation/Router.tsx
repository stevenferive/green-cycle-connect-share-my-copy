// Router en la capa de presentación
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserPage } from '../pages/UserPage';
import { UsersPage } from '../pages/UsersPage';
import { CreateUserPage } from '../pages/CreateUserPage';
import { AuthProvider } from '../providers/AuthProvider';

// Aquí importarías otras páginas

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas de usuarios */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/create" element={<CreateUserPage />} />
          <Route path="/users/:userId" element={<UserPage />} />
          
          {/* Redirección a la lista de usuarios como página principal */}
          <Route path="/" element={<Navigate to="/users" replace />} />
          
          {/* Página no encontrada */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}; 