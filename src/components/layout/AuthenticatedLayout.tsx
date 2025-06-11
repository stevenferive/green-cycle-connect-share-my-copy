import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = React.memo(({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
});

AuthenticatedLayout.displayName = 'AuthenticatedLayout';

export default AuthenticatedLayout;
